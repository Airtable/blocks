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

/** @hidden */
interface TableOrViewQueryResultData {
    recordIds: Array<string> | null; 
}

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
 *
 * @docsPath models/query results/TableOrViewQueryResult
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

    /** @internal */
    _visList: VisList | null;
    /** @internal */
    _sorts: Array<NormalizedSortConfig> | null;

    /** @internal */
    _orderedRecordIds: Array<string> | null;

    /** @internal */
    _recordIdsSet: {[key: string]: true | void} | null = null;

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
            return;
        }

        this._cellValueKeyWatchCounts[key]--;

        if (this._cellValueKeyWatchCounts[key] === 0) {
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
            cellValuesInFieldsLoadPromise = this._recordStore.loadDataAsync();
        }

        if (this._sourceModel instanceof Table) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                sourceModelLoadPromise = this._recordStore.loadRecordMetadataAsync();
            } else {
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
            return;
        }

        const visList = this._visList;
        if (!visList) {
            throw spawnInvariantViolationError('No vis list');
        }

        if (recordIds.length === 0) {
            return;
        }

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
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = new Set(this._sorts.map(sort => sort.fieldId));

        let wereAnyFieldsCreatedOrDeleted = false;
        for (const fieldId of addedFieldIds) {
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
            this._replaceVisList();
            this._orderedRecordIds = this._generateOrderedRecordIds();

            const changeData = {addedRecordIds: [], removedRecordIds: []};
            this._onChange(RecordQueryResult.WatchableKeys.records, changeData);
            this._onChange(RecordQueryResult.WatchableKeys.recordIds, changeData);
        }
    }
    /** @internal */
    _onCellValuesChanged(table: Table, key: string, updates?: FlowAnyObject | null) {
        if (!updates) {
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
