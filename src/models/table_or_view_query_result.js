// @flow
import getSdk from '../get_sdk';
import {type FieldId} from '../types/field';
import {has} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import Table, {WatchableTableKeys} from './table';
import View from './view';
import QueryResult, {
    type WatchableQueryResultKey,
    type QueryResultOpts,
    type NormalizedQueryResultOpts,
} from './query_result';
import ObjectPool from './object_pool';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';
import type Field from './field';
import type Record from './record';
import RecordStore, {WatchableRecordStoreKeys} from './record_store';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';

const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const GroupedRowVisList = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/vis_lists/grouped_row_vis_list',
);
const GroupAssigner = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/filter_and_sort/group_assigner',
);

type GroupLevelOrderType = 'ascending' | 'descending';
type GroupLevelId = string;
type GroupLevelObj =
    | {|
          id: GroupLevelId,
          columnId: FieldId,
          order: GroupLevelOrderType,
          groupingOptions?: Object,
      |}
    | {|
          id: GroupLevelId,
          isCreatedTime: true,
          order: GroupLevelOrderType,
          groupingOptions?: Object,
      |};

type TableOrViewQueryResultData = {
    recordIds: Array<string> | null, // null if data isn't loaded (or if it hasn't been lazily initialized).
};

// eslint-disable-next-line no-use-before-define
const tableOrViewQueryResultPool: ObjectPool<
    TableOrViewQueryResult,
    {|
        sourceModel: Table | View,
        normalizedOpts: NormalizedQueryResultOpts,
    |},
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.__sourceModelId,
    getKeyFromObjectOptions: ({sourceModel}) => sourceModel.id,
    canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
        return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
    },
});

/**
 * Represents a set of records directly from a view or table. See {@link QueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.selectRecords` or `view.selectRecords`.
 */
class TableOrViewQueryResult extends QueryResult<TableOrViewQueryResultData> {
    static _className = 'TableOrViewQueryResult';

    static __createOrReuseQueryResult(
        sourceModel: Table | View,
        recordStore: RecordStore,
        opts: QueryResultOpts,
    ) {
        const tableModel = sourceModel instanceof View ? sourceModel.parentTable : sourceModel;
        const normalizedOpts = QueryResult._normalizeOpts(tableModel, opts);
        const queryResult = tableOrViewQueryResultPool.getObjectForReuse({
            sourceModel,
            normalizedOpts,
        });
        if (queryResult) {
            return queryResult;
        } else {
            return new TableOrViewQueryResult(sourceModel, recordStore, opts);
        }
    }
    _sourceModel: Table | View;
    _mostRecentSourceModelLoadPromise: Promise<*> | null;
    _table: Table;

    _fieldIdsSetToLoadOrNullIfAllFields: {[string]: true} | null;

    // If custom sorts are specified, we'll use a vis list to handle sorting. If no sorts
    // are specified, we'll use the underlying row order of the source model.
    _visList: GroupedRowVisList | null;
    _groupLevels: Array<GroupLevelObj> | null;

    // This is the ordered list of record ids (before any filters are applied).
    _orderedRecordIds: Array<string> | null;

    // lazily generated set of record ids
    _recordIdsSet: {[string]: true | void} | null = null;

    // NOTE: when a cellValue key (cellValues or cellValuesInField:) is watched, we want
    // to make sure we watch the associated key on the table. However, we need to make
    // sure that we only watch the table once for each key. Otherwise, the callbacks
    // for each key will get called more than once for each change event. This is because
    // Watchable stores references to callbacks for each key, and on each _onChange event
    // calls each callback for that key. If we watch the table more than once, then we'll
    // call _onChange more than once, and each callback will be called more than once, which
    // is undesirable. Instead, we'll store watch counts for each key to make sure we only
    // watch the table once.
    _cellValueKeyWatchCounts: {[string]: number};
    constructor(sourceModel: Table | View, recordStore: RecordStore, opts?: QueryResultOpts) {
        const table = sourceModel instanceof View ? sourceModel.parentTable : sourceModel;
        invariant(
            table.id === recordStore.tableId,
            'record store must belong to QueryResult table',
        );
        const normalizedOpts = QueryResult._normalizeOpts(table, opts);
        super(recordStore, normalizedOpts, sourceModel.__baseData);

        this._sourceModel = sourceModel;
        this._mostRecentSourceModelLoadPromise = null;
        this._table = table;

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

        let fieldIdsSetToLoadOrNullIfAllFields = null;
        if (this._normalizedOpts.fieldIdsOrNullIfAllFields) {
            fieldIdsSetToLoadOrNullIfAllFields = {};
            for (const fieldId of this._normalizedOpts.fieldIdsOrNullIfAllFields) {
                fieldIdsSetToLoadOrNullIfAllFields[fieldId] = true;
            }
            // Need to load data for fields we're sorting by, even if
            // they're not explicitly requested in the `fields` opt.
            if (this._groupLevels) {
                for (const groupLevel of this._groupLevels) {
                    if (!groupLevel.isCreatedTime) {
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
    get _dataOrNullIfDeleted(): TableOrViewQueryResultData | null {
        if (this._sourceModel.isDeleted) {
            return null;
        }

        return {
            recordIds: this._orderedRecordIds,
        };
    }
    get __sourceModelId(): string {
        return this._sourceModel.id;
    }

    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this QueryResult are part of
     */
    get parentTable(): Table {
        return this._table;
    }
    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * The view that was used to obtain this QueryResult by calling
     * `view.selectRecords`. Null if the QueryResult was obtained by calling
     * `table.selectRecords`.
     */
    get parentView(): View | null {
        return this._sourceModel instanceof Table ? null : this._sourceModel;
    }
    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get recordIds(): Array<string> {
        invariant(this.isDataLoaded, 'QueryResult data is not loaded');
        invariant(this._data.recordIds, 'No recordIds');
        return this._data.recordIds;
    }
    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * @private
     */
    _getOrGenerateRecordIdsSet(): {[string]: true | void} {
        if (!this._recordIdsSet) {
            const recordIdsSet = {};
            for (const recordId of this.recordIds) {
                recordIdsSet[recordId] = true;
            }
            this._recordIdsSet = recordIdsSet;
        }

        return this._recordIdsSet;
    }
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    get fields(): Array<Field> | null {
        const {fieldIdsOrNullIfAllFields} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields) {
            const fields = [];
            // Filter out any deleted fields, since QueryResult is "live".
            // It would be too cumbersome (and defeat part of the purpose of
            // using QueryResult) if the user had to manually watch for deletion
            // on all the fields and recreate the QueryResult.
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
    get _cellValuesForSortWatchKeys(): Array<string> {
        return this._groupLevels
            ? u.compact(
                  this._groupLevels.map(groupLevel => {
                      if (groupLevel.isCreatedTime) {
                          return null;
                      }
                      return `cellValuesInField:${groupLevel.columnId}`;
                  }),
              )
            : [];
    }
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof Table
            ? this._recordStore.recordIds
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecordIds;
    }
    get _sourceModelRecords(): Array<Record> {
        return this._sourceModel instanceof Table
            ? this._recordStore.records
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecords;
    }
    _incrementCellValueKeyWatchCountAndWatchIfNecessary(key: string, watchCallback: Function) {
        if (!this._cellValueKeyWatchCounts[key]) {
            this._cellValueKeyWatchCounts[key] = 0;

            this._recordStore.watch(key, watchCallback, this);
        }

        this._cellValueKeyWatchCounts[key]++;
    }
    _decrementCellValueKeyWatchCountAndUnwatchIfPossible(key: string, watchCallback: Function) {
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
    watch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.watch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    QueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                if (
                    this._fieldIdsSetToLoadOrNullIfAllFields &&
                    !has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)
                ) {
                    throw spawnError(
                        "Can't watch field because it wasn't included in QueryResult fields: %s",
                        fieldId,
                    );
                }
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === QueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
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
    unwatch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === QueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
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
    async _loadDataAsync(): Promise<Array<WatchableQueryResultKey>> {
        tableOrViewQueryResultPool.registerObjectForReuseStrong(this);

        invariant(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
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
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
                if (field) {
                    field.watch('type', this._onFieldConfigChanged, this);
                    field.watch('options', this._onFieldConfigChanged, this);
                }
            }
        }

        const changedKeys = [
            QueryResult.WatchableKeys.records,
            QueryResult.WatchableKeys.recordIds,
            QueryResult.WatchableKeys.cellValues,
        ];

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this._table.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
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
                if (groupLevel.isCreatedTime) {
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
    _getColumnsById(): {[string]: Object} {
        return this._table.fields.reduce((result, field) => {
            result[field.id] = field.__getRawColumn();
            return result;
        }, {});
    }
    _addRecordIdsToVisList(recordIds: Array<string>) {
        const columnsById = this._getColumnsById();
        const visList = this._visList;
        invariant(visList, 'No vis list');
        for (const recordId of recordIds) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            invariant(record, 'Record missing in table');
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
    _onRecordsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates: ?{addedRecordIds: Array<string>, removedRecordIds: Array<string>},
    ) {
        if (model instanceof ViewDataStore) {
            // For a view model, we don't get updates sent with the onChange event,
            // so we need to manually generate updates based on the old and new
            // recordIds.
            if (this._orderedRecordIds) {
                const visibleRecordIds = this._recordStore.getViewDataStore(model.viewId)
                    .visibleRecordIds;
                const addedRecordIds = u.difference(visibleRecordIds, this._orderedRecordIds);
                const removedRecordIds = u.difference(this._orderedRecordIds, visibleRecordIds);
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
            invariant(visList, 'No vis list');

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

        this._onChange(QueryResult.WatchableKeys.records, updates);
        this._onChange(QueryResult.WatchableKeys.recordIds, updates);
    }
    _onCellValuesForSortChanged(
        recordStore: RecordStore,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
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
        invariant(visList, 'No vis list');

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
        this._onChange(QueryResult.WatchableKeys.records, changeData);
        this._onChange(QueryResult.WatchableKeys.recordIds, changeData);
    }
    _onFieldConfigChanged(field: Field, key: string) {
        // Field config changed for a field we rely on, so we need to replace our vis list.
        // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
        // are using a vis list here.
        this._replaceVisList();
        this._orderedRecordIds = this._generateOrderedRecordIds();
    }
    _onTableFieldsChanged(
        table: Table,
        key: string,
        updates: {addedFieldIds: Array<string>, removedFieldIds: Array<string>},
    ) {
        if (!this._groupLevels) {
            // If we don't have any sorts, we don't have to do anything in response to field changes.
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = this._groupLevels.reduce((result, groupLevel) => {
            if (!groupLevel.isCreatedTime) {
                result[groupLevel.columnId] = true;
            }
            return result;
        }, {});

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
                invariant(field, 'Created field does not exist');
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
            this._onChange(QueryResult.WatchableKeys.records, changeData);
            this._onChange(QueryResult.WatchableKeys.recordIds, changeData);
        }
    }
    _onCellValuesChanged(table: Table, key: string, updates: ?Object) {
        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValues change twice with no data).
            return;
        }
        this._onChange(QueryResult.WatchableKeys.cellValues, updates);
    }
    _onCellValuesInFieldChanged(
        table: Table,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
    ) {
        if (!recordIds && !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValuesInField change twice with no data).
            return;
        }
        this._onChange(key, recordIds, fieldId);
    }
    _generateOrderedRecordIds(): Array<string> {
        if (this._groupLevels) {
            invariant(this._visList, 'Cannot generate record ids without a vis list');
            const recordIds = [];
            this._visList.eachVisibleIdInGroupedOrder(recordId => recordIds.push(recordId));
            return recordIds;
        } else {
            return this._sourceModelRecordIds;
        }
    }
    _replaceVisList() {
        const rowsById = {};
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
    _getGroupLevelsWithDeletedFieldsFiltered(): Array<GroupLevelObj> {
        invariant(this._groupLevels, 'No group levels');

        // Filter out any group levels that rely on deleted fields.
        // NOTE: we keep deleted fields around (rather than filtering them out
        // in realtime) in case a field gets undeleted, in which case we want to
        // keep using it.
        return this._groupLevels.filter(groupLevel => {
            if (groupLevel.isCreatedTime) {
                return true;
            }
            const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
            return !!field;
        });
    }
    _spawnErrorForDeletion(): Error {
        const sourceModelName = this._sourceModel instanceof Table ? 'table' : 'view';
        return spawnError("QueryResult's underlying %s has been deleted", sourceModelName);
    }
}

export default TableOrViewQueryResult;
