/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import getSdk from '../get_sdk';
import {FieldId} from '../types/field';
import {
    has,
    compact,
    arrayDifference,
    FlowAnyObject,
    FlowAnyExistential,
    FlowAnyFunction,
    ObjectMap,
} from '../private_utils';
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import {RecordId} from '../types/record';
import Table, {WatchableTableKeys} from './table';
import View from './view';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    RecordQueryResultOpts,
    NormalizedRecordQueryResultOpts,
} from './record_query_result';
import ObjectPool from './object_pool';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';
import Field from './field';
import Record from './record';
import RecordStore, {WatchableRecordStoreKeys} from './record_store';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';

const {h} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const GroupedRowVisList = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/vis_lists/grouped_row_vis_list',
);
const GroupAssigner = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/filter_and_sort/group_assigner',
);

type GroupLevelOrderType = 'ascending' | 'descending';
type GroupLevelId = string;
type GroupLevelObj = {
    id: GroupLevelId;
    isCreatedTime?: true;
    columnId?: FieldId;
    order: GroupLevelOrderType;
    groupingOptions?: any;
};

type TableOrViewQueryResultData = {
    recordIds: Array<string> | null; // null if data isn't loaded (or if it hasn't been lazily initialized).
};

const tableOrViewQueryResultPool: ObjectPool<
    TableOrViewQueryResult,
    {
        sourceModel: Table | View;
        normalizedOpts: NormalizedRecordQueryResultOpts;
    }
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.__sourceModelId,
    getKeyFromObjectOptions: ({sourceModel}) => sourceModel.id,
    canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
        return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
    },
});

/**
 * Represents a set of records directly from a view or table. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.selectRecords` or `view.selectRecords`.
 */
class TableOrViewQueryResult extends RecordQueryResult<TableOrViewQueryResultData> {
    /** @internal */
    static _className = 'TableOrViewQueryResult';

    /** @internal */
    static __createOrReuseQueryResult(
        sourceModel: Table | View,
        recordStore: RecordStore,
        opts: RecordQueryResultOpts,
    ) {
        const tableModel = sourceModel instanceof View ? sourceModel.parentTable : sourceModel;
        const normalizedOpts = RecordQueryResult._normalizeOpts(tableModel, recordStore, opts);
        return this.__createOrReuseQueryResultWithNormalizedOpts(sourceModel, normalizedOpts);
    }
    /** @internal */
    static __createOrReuseQueryResultWithNormalizedOpts(
        sourceModel: Table | View,
        normalizedOpts: NormalizedRecordQueryResultOpts,
    ) {
        const queryResult = tableOrViewQueryResultPool.getObjectForReuse({
            sourceModel,
            normalizedOpts,
        });
        if (queryResult) {
            return queryResult;
        } else {
            return new TableOrViewQueryResult(sourceModel, normalizedOpts);
        }
    }
    /** @internal */
    _sourceModel: Table | View;
    /** @internal */
    _mostRecentSourceModelLoadPromise: Promise<FlowAnyExistential> | null;
    /** @internal */
    _table: Table;

    /** @internal */
    _fieldIdsSetToLoadOrNullIfAllFields: {[key: string]: true} | null;

    // If custom sorts are specified, we'll use a vis list to handle sorting. If no sorts
    // are specified, we'll use the underlying row order of the source model.
    /** @internal */
    _visList: typeof GroupedRowVisList | null;
    /** @internal */
    _groupLevels: Array<GroupLevelObj> | null;

    // This is the ordered list of record ids (before any filters are applied).
    /** @internal */
    _orderedRecordIds: Array<string> | null;

    // lazily generated set of record ids
    /** @internal */
    _recordIdsSet: {[key: string]: true | void} | null = null;

    // NOTE: when a cellValue key (cellValues or cellValuesInField:) is watched, we want
    // to make sure we watch the associated key on the table. However, we need to make
    // sure that we only watch the table once for each key. Otherwise, the callbacks
    // for each key will get called more than once for each change event. This is because
    // Watchable stores references to callbacks for each key, and on each _onChange event
    // calls each callback for that key. If we watch the table more than once, then we'll
    // call _onChange more than once, and each callback will be called more than once, which
    // is undesirable. Instead, we'll store watch counts for each key to make sure we only
    // watch the table once.
    /** @internal */
    _cellValueKeyWatchCounts: {[key: string]: number};
    /** @hidden */
    constructor(sourceModel: Table | View, normalizedOpts: NormalizedRecordQueryResultOpts) {
        super(normalizedOpts, sourceModel.__baseData);

        this._sourceModel = sourceModel;
        this._mostRecentSourceModelLoadPromise = null;
        this._table = normalizedOpts.table;

        const {sorts} = this._normalizedOpts;
        if (sorts) {
            const groupLevels: Array<GroupLevelObj> = sorts.map(sort => {
                return {
                    id: h.id.generateGroupLevelId(),
                    columnId: sort.fieldId,
                    order: sort.direction === 'desc' ? 'descending' : 'ascending',
                    groupingOptions: {
                        // Always use the raw cell value (rather than normalizing for grouping) so
                        // that group behavior matches sort rather than group by.
                        shouldUseRawCellValue: true,
                    },
                };
            });

            // Tie-break using record created time.
            groupLevels.push({
                id: h.id.generateGroupLevelId(),
                isCreatedTime: true,
                order: 'ascending',
                groupingOptions: {
                    shouldUseRawCellValue: true,
                },
            });

            this._groupLevels = groupLevels;
        } else {
            this._groupLevels = null;
        }

        this._visList = null;
        this._orderedRecordIds = null;

        this._cellValueKeyWatchCounts = {};

        let fieldIdsSetToLoadOrNullIfAllFields: ObjectMap<FieldId, true> | null = null;
        if (this._normalizedOpts.fieldIdsOrNullIfAllFields) {
            fieldIdsSetToLoadOrNullIfAllFields = {};
            for (const fieldId of this._normalizedOpts.fieldIdsOrNullIfAllFields) {
                fieldIdsSetToLoadOrNullIfAllFields[fieldId] = true;
            }
            // Need to load data for fields we're sorting by, even if
            // they're not explicitly requested in the `fields` opt.
            if (this._groupLevels) {
                for (const groupLevel of this._groupLevels) {
                    if (!groupLevel.isCreatedTime && groupLevel.columnId) {
                        fieldIdsSetToLoadOrNullIfAllFields[groupLevel.columnId] = true;
                    }
                }
            }

            const recordColorMode = this._normalizedOpts.recordColorMode;
            if (recordColorMode && recordColorMode.type === RecordColorModeTypes.BY_SELECT_FIELD) {
                fieldIdsSetToLoadOrNullIfAllFields[recordColorMode.selectField.id] = true;
            }
        }
        this._fieldIdsSetToLoadOrNullIfAllFields = fieldIdsSetToLoadOrNullIfAllFields;

        // we want to return the same instance to subsequent calls to __createOrReuseQueryResult,
        // so register this instance weakly with the object pool. it'll be automatically
        // unregistered if it hasn't been used after a few seconds
        tableOrViewQueryResultPool.registerObjectForReuseWeak(this);
        Object.seal(this);
    }
    /** @internal */
    get _dataOrNullIfDeleted(): TableOrViewQueryResultData | null {
        if (this._sourceModel.isDeleted) {
            return null;
        }

        return {
            recordIds: this._orderedRecordIds,
        };
    }
    /** @internal */
    get __sourceModelId(): string {
        return this._sourceModel.id;
    }

    /**
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this RecordQueryResult are part of
     */
    get parentTable(): Table {
        return this._table;
    }
    /**
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * The view that was used to obtain this RecordQueryResult by calling
     * `view.selectRecords`. Null if the RecordQueryResult was obtained by calling
     * `table.selectRecords`.
     */
    get parentView(): View | null {
        return this._sourceModel instanceof Table ? null : this._sourceModel;
    }
    /**
     * The record IDs in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get recordIds(): Array<string> {
        if (!this.isDataLoaded) {
            throw spawnInvariantViolationError('RecordQueryResult data is not loaded');
        }
        if (!this._data.recordIds) {
            throw spawnInvariantViolationError('No recordIds');
        }
        return this._data.recordIds;
    }
    /**
     * The set of record IDs in this RecordQueryResult.
     * Throws if data is not loaded yet.
     *
     * @internal
     */
    _getOrGenerateRecordIdsSet(): {[key: string]: true | void} {
        if (!this._recordIdsSet) {
            const recordIdsSet: ObjectMap<RecordId, true> = {};
            for (const recordId of this.recordIds) {
                recordIdsSet[recordId] = true;
            }
            this._recordIdsSet = recordIdsSet;
        }

        return this._recordIdsSet;
    }
    /**
     * The fields that were used to create this RecordQueryResult.
     * Null if fields were not specified, which means the RecordQueryResult
     * will load all fields in the table.
     */
    get fields(): Array<Field> | null {
        const {fieldIdsOrNullIfAllFields} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields) {
            const fields = [];
            // Filter out any deleted fields, since RecordQueryResult is "live".
            // It would be too cumbersome (and defeat part of the purpose of
            // using RecordQueryResult) if the user had to manually watch for deletion
            // on all the fields and recreate the RecordQueryResult.
            for (const fieldId of fieldIdsOrNullIfAllFields) {
                const field = this._table.getFieldByIdIfExists(fieldId);
                if (field !== null) {
                    fields.push(field);
                }
            }
            return fields;
        } else {
            return null;
        }
    }
    /** @internal */
    get _cellValuesForSortWatchKeys(): Array<string> {
        return this._groupLevels
            ? compact(
                  this._groupLevels.map(groupLevel => {
                      if (groupLevel.isCreatedTime) {
                          return null;
                      }
                      return `cellValuesInField:${groupLevel.columnId}`;
                  }),
              )
            : [];
    }
    /** @internal */
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof Table
            ? this._recordStore.recordIds
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecordIds;
    }
    /** @internal */
    get _sourceModelRecords(): Array<Record> {
        return this._sourceModel instanceof Table
            ? this._recordStore.records
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecords;
    }
    /** @internal */
    _incrementCellValueKeyWatchCountAndWatchIfNecessary(
        key: string,
        watchCallback: FlowAnyFunction,
    ) {
        if (!this._cellValueKeyWatchCounts[key]) {
            this._cellValueKeyWatchCounts[key] = 0;

            this._recordStore.watch(key, watchCallback, this);
        }

        this._cellValueKeyWatchCounts[key]++;
    }
    /** @internal */
    _decrementCellValueKeyWatchCountAndUnwatchIfPossible(
        key: string,
        watchCallback: FlowAnyFunction,
    ) {
        if (!this._cellValueKeyWatchCounts[key]) {
            // Key isn't watched, so just skip it. This matches behavior of Watchable,
            // where calling unwatch on a key that isn't watched just no-ops.
            return;
        }

        this._cellValueKeyWatchCounts[key]--;

        if (this._cellValueKeyWatchCounts[key] === 0) {
            // We're down to zero watches for this key, so we can actually unwatch it now.
            this._recordStore.unwatch(key, watchCallback, this);
            delete this._cellValueKeyWatchCounts[key];
        }
    }
    /** @inheritdoc */
    watch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const validKeys = super.watch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                if (
                    this._fieldIdsSetToLoadOrNullIfAllFields &&
                    !has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)
                ) {
                    throw spawnError(
                        "Can't watch field because it wasn't included in RecordQueryResult fields: %s",
                        fieldId,
                    );
                }
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            this._onCellValuesChanged,
                        );
                    }
                } else {
                    this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                        key,
                        this._onCellValuesChanged,
                    );
                }
            }
        }

        return validKeys;
    }
    /** @inheritdoc */
    unwatch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            this._onCellValuesChanged,
                        );
                    }
                } else {
                    this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                        key,
                        this._onCellValuesChanged,
                    );
                }
            }
        }

        return validKeys;
    }
    /** @inheritdoc */
    async loadDataAsync() {
        let sourceModelLoadPromise;
        let cellValuesInFieldsLoadPromise;

        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
            cellValuesInFieldsLoadPromise = this._recordStore.loadCellValuesInFieldIdsAsync(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        } else {
            // Load all fields.
            cellValuesInFieldsLoadPromise = this._recordStore.loadDataAsync();
        }

        if (this._sourceModel instanceof Table) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                sourceModelLoadPromise = this._recordStore.loadRecordMetadataAsync();
            } else {
                // table.loadDataAsync is a superset of loadRecordMetadataAsync,
                // so no need to load record metadata again.
                sourceModelLoadPromise = null;
            }
        } else {
            sourceModelLoadPromise = this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .loadDataAsync();
        }

        this._mostRecentSourceModelLoadPromise = Promise.all([
            sourceModelLoadPromise,
            cellValuesInFieldsLoadPromise,
            this._loadRecordColorsAsync(),
        ]);

        await super.loadDataAsync();
    }
    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        tableOrViewQueryResultPool.registerObjectForReuseStrong(this);

        if (!this._mostRecentSourceModelLoadPromise) {
            throw spawnInvariantViolationError('No source model load promises');
        }
        await this._mostRecentSourceModelLoadPromise;

        if (this._groupLevels) {
            this._replaceVisList();
        }
        this._orderedRecordIds = this._generateOrderedRecordIds();

        if (this._sourceModel instanceof Table) {
            this._recordStore.watch(WatchableRecordStoreKeys.records, this._onRecordsChanged, this);
        } else {
            this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .watch(WatchableViewDataStoreKeys.visibleRecords, this._onRecordsChanged, this);
        }

        this._recordStore.watch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.watch(WatchableTableKeys.fields, this._onTableFieldsChanged, this);

        if (this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (!groupLevel.columnId) {
                    continue;
                }
                const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
                if (field) {
                    field.watch('type', this._onFieldConfigChanged, this);
                    field.watch('options', this._onFieldConfigChanged, this);
                }
            }
        }

        const changedKeys: Array<WatchableRecordQueryResultKey> = [
            RecordQueryResult.WatchableKeys.records,
            RecordQueryResult.WatchableKeys.recordIds,
            RecordQueryResult.WatchableKeys.cellValues,
        ];

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this._table.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
    /** @inheritdoc */
    unloadData() {
        super.unloadData();

        if (this._sourceModel instanceof Table) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                this._recordStore.unloadRecordMetadata();
            } else {
                this._recordStore.unloadData();
            }
        } else {
            this._recordStore.getViewDataStore(this._sourceModel.id).unloadData();
        }

        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
            this._recordStore.unloadCellValuesInFieldIds(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        }

        this._unloadRecordColors();
    }
    /** @internal */
    _unloadData() {
        this._mostRecentSourceModelLoadPromise = null;

        if (this._sourceModel instanceof Table) {
            this._recordStore.unwatch(
                WatchableRecordStoreKeys.records,
                this._onRecordsChanged,
                this,
            );
        } else {
            this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .unwatch(WatchableViewDataStoreKeys.visibleRecords, this._onRecordsChanged, this);
        }

        this._recordStore.unwatch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.unwatch(WatchableTableKeys.fields, this._onTableFieldsChanged, this);

        // If the table is deleted, can't call getFieldById on it below.
        if (!this._table.isDeleted && this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (!groupLevel.columnId) {
                    continue;
                }
                const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
                if (field) {
                    field.unwatch('type', this._onFieldConfigChanged, this);
                    field.unwatch('options', this._onFieldConfigChanged, this);
                }
            }
        }

        this._visList = null;
        this._orderedRecordIds = null;
        this._recordIdsSet = null;

        tableOrViewQueryResultPool.unregisterObjectForReuseStrong(this);
    }
    /** @internal */
    _getColumnsById(): {[key: string]: FlowAnyObject} {
        return this._table.fields.reduce(
            (result, field) => {
                result[field.id] = field.__getRawColumn();
                return result;
            },
            {} as ObjectMap<FieldId, unknown>,
        );
    }
    /** @internal */
    _addRecordIdsToVisList(recordIds: Array<string>) {
        const columnsById = this._getColumnsById();
        const visList = this._visList;
        if (!visList) {
            throw spawnInvariantViolationError('No vis list');
        }
        for (const recordId of recordIds) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw spawnInvariantViolationError('Record missing in table');
            }
            const rowJson = record.__getRawRow();
            const groupPath = GroupAssigner.getGroupPathForRow(
                getSdk().__appInterface,
                this._getGroupLevelsWithDeletedFieldsFiltered(),
                columnsById,
                rowJson,
            );
            visList.addIdToGroupAtEnd(recordId, true, groupPath);
        }
    }
    /** @internal */
    _onRecordsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates?: {addedRecordIds: Array<string>; removedRecordIds: Array<string>} | null,
    ) {
        if (model instanceof ViewDataStore) {
            // For a view model, we don't get updates sent with the onChange event,
            // so we need to manually generate updates based on the old and new
            // recordIds.
            if (this._orderedRecordIds) {
                const visibleRecordIds = this._recordStore.getViewDataStore(model.viewId)
                    .visibleRecordIds;
                const addedRecordIds = arrayDifference(
                    visibleRecordIds,
                    this._orderedRecordIds || [],
                );
                const removedRecordIds = arrayDifference(
                    this._orderedRecordIds || [],
                    visibleRecordIds,
                );
                updates = {addedRecordIds, removedRecordIds};
            } else {
                updates = null;
            }
        }

        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a records change twice with no data).
            return;
        }

        const {addedRecordIds, removedRecordIds} = updates;

        if (this._groupLevels) {
            const visList = this._visList;
            if (!visList) {
                throw spawnInvariantViolationError('No vis list');
            }

            if (removedRecordIds.length > 0) {
                visList.removeMultipleIds(removedRecordIds);
            }

            if (addedRecordIds.length > 0) {
                this._addRecordIdsToVisList(addedRecordIds);
            }
        }

        if (this._recordIdsSet) {
            for (const recordId of addedRecordIds) {
                this._recordIdsSet[recordId] = true;
            }
            for (const recordId of removedRecordIds) {
                this._recordIdsSet[recordId] = undefined;
            }
        }

        // Now that we've applied our changes (if applicable), let's regenerate our recordIds.
        this._orderedRecordIds = this._generateOrderedRecordIds();

        this._onChange(RecordQueryResult.WatchableKeys.records, updates);
        this._onChange(RecordQueryResult.WatchableKeys.recordIds, updates);
    }
    /** @internal */
    _onCellValuesForSortChanged(
        recordStore: RecordStore,
        key: string,
        recordIds?: Array<string> | null,
        fieldId?: string | null,
    ) {
        if (!recordIds || !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a records change twice with no data).
            return;
        }

        // NOTE: this will only ever be called if we have sorts, so it's safe to assert that we have
        // a vis list here.
        const visList = this._visList;
        if (!visList) {
            throw spawnInvariantViolationError('No vis list');
        }

        if (recordIds.length === 0) {
            // Nothing actually changed, so just break out early.
            return;
        }

        // Move the record ids in the vis list.
        // Note: the cell value changes may have resulted in the records
        // being filtered out. So don't try to remove and re-add them if
        // they're no longer visible.
        const visibleRecordIds = recordIds.filter(recordId => visList.isIdVisible(recordId));
        visList.removeMultipleIds(visibleRecordIds);
        this._addRecordIdsToVisList(visibleRecordIds);
        this._orderedRecordIds = this._generateOrderedRecordIds();

        const changeData = {addedRecordIds: [], removedRecordIds: []};
        this._onChange(RecordQueryResult.WatchableKeys.records, changeData);
        this._onChange(RecordQueryResult.WatchableKeys.recordIds, changeData);
    }
    /** @internal */
    _onFieldConfigChanged(_field: Field, _key: string) {
        // Field config changed for a field we rely on, so we need to replace our vis list.
        // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
        // are using a vis list here.
        this._replaceVisList();
        this._orderedRecordIds = this._generateOrderedRecordIds();
    }
    /** @internal */
    _onTableFieldsChanged(
        table: Table,
        key: string,
        updates: {addedFieldIds: Array<string>; removedFieldIds: Array<string>},
    ) {
        if (!this._groupLevels) {
            // If we don't have any sorts, we don't have to do anything in response to field changes.
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = this._groupLevels.reduce(
            (result, groupLevel) => {
                if (groupLevel.columnId) {
                    result[groupLevel.columnId] = true;
                }
                return result;
            },
            {} as ObjectMap<string, true>,
        );

        // Check if any fields that we rely on were created or deleted. If they were,
        // replace our vis list.
        // NOTE: we need to check for created, since a field that we rely on can be
        // deleted and then undeleted.
        let wereAnyFieldsCreatedOrDeleted = false;
        for (const fieldId of addedFieldIds) {
            // If a field that we rely on was created (i.e. it was undeleted), we need to
            // make sure we're watching it's config.
            if (has(fieldIdsSet, fieldId)) {
                wereAnyFieldsCreatedOrDeleted = true;
                const field = this._table.getFieldByIdIfExists(fieldId);
                if (!field) {
                    throw spawnInvariantViolationError('Created field does not exist');
                }
                field.watch('type', this._onFieldConfigChanged, this);
                field.watch('options', this._onFieldConfigChanged, this);
            }
        }

        if (!wereAnyFieldsCreatedOrDeleted) {
            wereAnyFieldsCreatedOrDeleted = removedFieldIds.some(fieldId =>
                has(fieldIdsSet, fieldId),
            );
        }

        if (wereAnyFieldsCreatedOrDeleted) {
            // One of the fields we're relying on was deleted,
            this._replaceVisList();
            this._orderedRecordIds = this._generateOrderedRecordIds();

            // Make sure we fire onChange events since the order may have changed
            // as a result.
            const changeData = {addedRecordIds: [], removedRecordIds: []};
            this._onChange(RecordQueryResult.WatchableKeys.records, changeData);
            this._onChange(RecordQueryResult.WatchableKeys.recordIds, changeData);
        }
    }
    /** @internal */
    _onCellValuesChanged(table: Table, key: string, updates?: FlowAnyObject | null) {
        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValues change twice with no data).
            return;
        }
        this._onChange(RecordQueryResult.WatchableKeys.cellValues, updates);
    }
    /** @internal */
    _onCellValuesInFieldChanged(
        table: Table,
        key: string,
        recordIds?: Array<string> | null,
        fieldId?: string | null,
    ) {
        if (!recordIds && !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValuesInField change twice with no data).
            return;
        }
        this._onChange(key, recordIds, fieldId);
    }
    /** @internal */
    _generateOrderedRecordIds(): Array<string> {
        if (this._groupLevels) {
            if (!this._visList) {
                throw spawnInvariantViolationError('Cannot generate record ids without a vis list');
            }
            const recordIds: Array<RecordId> = [];
            this._visList.eachVisibleIdInGroupedOrder((recordId: RecordId) =>
                recordIds.push(recordId),
            );
            return recordIds;
        } else {
            return this._sourceModelRecordIds;
        }
    }
    /** @internal */
    _replaceVisList() {
        const rowsById: ObjectMap<RecordId, unknown> = {};
        const rowVisibilityObjArray = [];

        for (const record of this._sourceModelRecords) {
            rowsById[record.id] = record.__getRawRow();
            rowVisibilityObjArray.push({rowId: record.id, visibility: true});
        }

        const columnsById = this._getColumnsById();

        const groupLevels = this._getGroupLevelsWithDeletedFieldsFiltered();

        const groupAssigner = new GroupAssigner({
            appInterface: getSdk().__appInterface,
            groupLevels,
            rowsById,
            columnsById,
        });

        const groupKeyComparators = groupAssigner.getGroupKeyComparators();
        const groupPathsByRowId = groupAssigner.getGroupPathsByRowId();
        this._visList = new GroupedRowVisList(
            groupKeyComparators,
            rowVisibilityObjArray,
            groupPathsByRowId,
        );
    }
    /** @internal */
    _getGroupLevelsWithDeletedFieldsFiltered(): Array<GroupLevelObj> {
        if (!this._groupLevels) {
            throw spawnInvariantViolationError('No group levels');
        }

        // Filter out any group levels that rely on deleted fields.
        // NOTE: we keep deleted fields around (rather than filtering them out
        // in realtime) in case a field gets undeleted, in which case we want to
        // keep using it.
        return this._groupLevels.filter(groupLevel => {
            if (!groupLevel.columnId) {
                return true;
            }
            const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
            return !!field;
        });
    }
    /** @internal */
    _spawnErrorForDeletion(): Error {
        const sourceModelName = this._sourceModel instanceof Table ? 'table' : 'view';
        return spawnError("RecordQueryResult's underlying %s has been deleted", sourceModelName);
    }
}

export default TableOrViewQueryResult;
