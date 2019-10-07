/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import getSdk from '../get_sdk';
import {FieldId} from '../types/field';
import {
    has,
    arrayDifference,
    FlowAnyObject,
    FlowAnyExistential,
    FlowAnyFunction,
    ObjectMap,
} from '../private_utils';
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import {VisList} from '../injected/airtable_interface';
import {RecordId} from '../types/record';
import Table, {WatchableTableKeys} from './table';
import View from './view';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    RecordQueryResultOpts,
    NormalizedRecordQueryResultOpts,
    NormalizedSortConfig,
} from './record_query_result';
import ObjectPool from './object_pool';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';
import Field from './field';
import Record from './record';
import RecordStore, {WatchableRecordStoreKeys} from './record_store';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';

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

    // If custom sorts are specified, we'll use a VisList to handle sorting.
    // If no sorts are specified, we'll use the underlying row order of the source model.
    // Note: we're currently handling visibility tracking for view query results within this class,
    // not in the VisList. In other words, only visible records are added to the visList.
    /** @internal */
    _visList: VisList | null;
    /** @internal */
    _sorts: Array<NormalizedSortConfig> | null;

    // This is the ordered list of record ids.
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
            this._sorts = sorts;
        } else {
            this._sorts = null;
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
            if (this._sorts !== null) {
                for (const sort of this._sorts) {
                    fieldIdsSetToLoadOrNullIfAllFields[sort.fieldId] = true;
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
        return this._sorts ? this._sorts.map(sort => `cellValuesInField:${sort.fieldId}`) : [];
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

        if (this._sorts) {
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

        if (this._sorts) {
            for (const sort of this._sorts) {
                const field = this._table.getFieldByIdIfExists(sort.fieldId);
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
        if (!this._table.isDeleted && this._sorts) {
            for (const sort of this._sorts) {
                const field = this._table.getFieldByIdIfExists(sort.fieldId);
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
    _addRecordIdsToVisList(recordIds: Array<string>) {
        const visList = this._visList;
        if (!visList) {
            throw spawnInvariantViolationError('No vis list');
        }
        for (const recordId of recordIds) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw spawnInvariantViolationError('Record missing in table');
            }
            visList.addRecordData(record._data);
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

        if (this._sorts) {
            const visList = this._visList;
            if (!visList) {
                throw spawnInvariantViolationError('No vis list');
            }

            if (removedRecordIds.length > 0) {
                visList.removeRecordIds(removedRecordIds);
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

        // Only move recordIds that are already in the visList.
        // It's possible to have recordId that is not currently in the visList since
        // this callback can run before onRecordsChanged. (eg. when a deleted record is
        // restored, this is triggered for that record but the record is not yet in the visList:
        // onRecordsChanged actually adds it)
        // Note: cell value changes that result in the records being filtered out trigger
        //       onRecordsChanged on the View model, so we don't have to worry about that here.
        const visListRecordIdsSet = new Set(visList.getOrderedRecordIds());
        const recordIdsToMove = recordIds.filter(recordId => visListRecordIdsSet.has(recordId));

        visList.removeRecordIds(recordIdsToMove);
        this._addRecordIdsToVisList(recordIdsToMove);
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
        if (!this._sorts) {
            // If we don't have any sorts, we don't have to do anything in response to field changes.
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = new Set(this._sorts.map(sort => sort.fieldId));

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
        if (this._sorts) {
            if (!this._visList) {
                throw spawnInvariantViolationError('Cannot generate record ids without a vis list');
            }
            return this._visList.getOrderedRecordIds();
        } else {
            return this._sourceModelRecordIds;
        }
    }
    /** @internal */
    _replaceVisList() {
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;

        const recordDatas = this._sourceModelRecords.map(record => record._data);
        const fieldDatas = this._table.fields.map(field => field._data);
        const filteredSorts = this._getSortsWithDeletedFieldsFiltered();

        this._visList = airtableInterface.createVisList(
            appInterface,
            recordDatas,
            fieldDatas,
            filteredSorts,
        );
    }
    /** @internal */
    _getSortsWithDeletedFieldsFiltered(): Array<NormalizedSortConfig> {
        if (!this._sorts) {
            throw spawnInvariantViolationError('No sorts');
        }

        // Filter out any sorts levels that rely on deleted fields.
        // NOTE: we keep deleted fields around (rather than filtering them out
        // in realtime) in case a field gets undeleted, in which case we want to
        // keep using it.
        return this._sorts.filter(sort => {
            const field = this._table.getFieldByIdIfExists(sort.fieldId);
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
