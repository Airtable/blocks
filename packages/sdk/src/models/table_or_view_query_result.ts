/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import Sdk from '../sdk';
import {FieldId} from '../types/field';
import {
    has,
    arrayDifference,
    FlowAnyObject,
    FlowAnyExistential,
    FlowAnyFunction,
    ObjectMap,
} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import {VisList, NormalizedGroupLevel} from '../types/airtable_interface';
import {RecordId} from '../types/record';
import {GroupLevelData, GroupData} from '../types/view';
import Table, {WatchableTableKeys} from './table';
import View from './view';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    NormalizedRecordQueryResultOpts,
    NormalizedSortConfig,
} from './record_query_result';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';
import Field from './field';
import Record from './record';
import ObjectPool from './object_pool';
import RecordStore, {WatchableRecordStoreKeys} from './record_store';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';
import GroupedRecordQueryResult from './grouped_record_query_result';
import {GroupLevels} from './view_metadata_query_result';

/** @hidden */
interface TableOrViewQueryResultData {
    recordIds: Array<string> | null; 
    groups: Array<GroupedRecordQueryResult> | null;
    groupLevels: Array<NormalizedGroupLevel> | null;
}

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
    _groupLevels: Array<NormalizedGroupLevel> | null;

    /** @internal */
    _orderedRecordIds: Array<string> | null;

    /** @internal */
    _orderedGroups: Array<GroupedRecordQueryResult> | null;

    /** @internal */
    _loadedGroupLevels: Array<NormalizedGroupLevel> | null;

    /** @internal */
    _recordIdsSet: {[key: string]: true | void} | null = null;

    /** @internal */
    _cellValueKeyWatchCounts: {[key: string]: number};

    /** @internal */
    __groupedRecordQueryResultPool: ObjectPool<
        GroupedRecordQueryResult,
        typeof GroupedRecordQueryResult
    >;

    /** @internal */
    constructor(
        sdk: Sdk,
        sourceModel: Table | View,
        normalizedOpts: NormalizedRecordQueryResultOpts,
    ) {
        super(sdk, normalizedOpts);

        this._sourceModel = sourceModel;
        this._mostRecentSourceModelLoadPromise = null;
        this._table = normalizedOpts.table;

        const {sorts} = this._normalizedOpts;
        this._sorts = sorts ?? null;
        this._groupLevels = null;

        this._visList = null;
        this._orderedRecordIds = null;
        this._orderedGroups = null;
        this._loadedGroupLevels = null;

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
        this.__groupedRecordQueryResultPool = new ObjectPool(GroupedRecordQueryResult);

        Object.seal(this);
    }
    /** @internal */
    get _dataOrNullIfDeleted(): TableOrViewQueryResultData | null {
        if (this._sourceModel.isDeleted || this._recordStore.isDeleted) {
            return null;
        }

        return {
            recordIds: this._orderedRecordIds,
            groups: this._orderedGroups,
            groupLevels: this._loadedGroupLevels,
        };
    }
    /** @internal */
    get __sourceModelId(): string {
        return this._sourceModel.id;
    }

    /** @internal */
    get __poolKey(): string {
        return `${this._serializedOpts}::${this._sourceModel.id}`;
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
        const {recordIds} = this._data; 
        invariant(this.isDataLoaded, 'RecordQueryResult data is not loaded');
        invariant(recordIds, 'No recordIds');
        return recordIds;
    }
    /**
     * The ordered GroupedRecordQueryResult's in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     *
     * @hidden
     */
    get groups(): Array<GroupedRecordQueryResult> | null {
        const {groups} = this._data; 
        invariant(this.isDataLoaded, 'RecordQueryResult data is not loaded');
        return groups ?? null;
    }
    /**
     * The GroupLevels in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     *
     * @hidden
     */
    get groupLevels(): GroupLevels | null {
        const {groupLevels} = this._data; 
        invariant(this.isDataLoaded, 'RecordQueryResult data is not loaded');
        return groupLevels
            ? groupLevels.map(singleLevel => ({
                  ...singleLevel,
                  field: this.parentTable.getFieldById(singleLevel.fieldId),
              }))
            : null;
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
    get _cellValuesForGroupWatchKeys(): Array<string> {
        return this._groupLevels
            ? this._groupLevels.map(group => `cellValuesInField:${group.fieldId}`)
            : [];
    }
    /** @internal */
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof Table
            ? this._recordStore.recordIds
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecordIds;
    }
    /** @internal */
    get _sourceModelGroups(): Array<GroupData> | null {
        return this._sourceModel instanceof Table
            ? null
            : this._recordStore.getViewDataStore(this._sourceModel.id).groups;
    }
    /** @internal */
    get _sourceModelGroupLevels(): Array<GroupLevelData> | null {
        return this._sourceModel instanceof Table
            ? null
            : this._recordStore.getViewDataStore(this._sourceModel.id).groupLevels;
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

        if (this._sourceModel.isDeleted) {
            throw this._spawnErrorForDeletion();
        }

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

    /**
     * @internal
     */
    _getChangedKeysOnLoad(): Array<WatchableRecordQueryResultKey> {
        const changedKeys: Array<WatchableRecordQueryResultKey> = [
            RecordQueryResult.WatchableKeys.records,
            RecordQueryResult.WatchableKeys.recordIds,
            RecordQueryResult.WatchableKeys.cellValues,
            RecordQueryResult.WatchableKeys.groups,
            RecordQueryResult.WatchableKeys.groupLevels,
        ];

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this._table.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        this._table.__tableOrViewQueryResultPool.registerObjectForReuseStrong(this);

        invariant(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
        await this._mostRecentSourceModelLoadPromise;

        if (this._sorts) {
            this._replaceVisList();
        }
        this._orderedRecordIds = this._generateOrderedRecordIds();
        this._orderedGroups = this._generateAndLoadOrderedGroups();
        this._loadedGroupLevels = this._sourceModelGroupLevels;

        if (this._sourceModel instanceof Table) {
            this._recordStore.watch(WatchableRecordStoreKeys.records, this._onRecordsChanged, this);
        } else {
            const viewDataStore = this._recordStore.getViewDataStore(this._sourceModel.id);
            viewDataStore.watch(
                WatchableViewDataStoreKeys.visibleRecords,
                this._onRecordsChanged,
                this,
            );
            viewDataStore.watch(WatchableViewDataStoreKeys.groups, this._onGroupsChanged, this);
            viewDataStore.watch(
                WatchableViewDataStoreKeys.groupLevels,
                this._onGroupLevelsChanged,
                this,
            );
        }

        this._recordStore.watch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._recordStore.watch(
            this._cellValuesForGroupWatchKeys,
            this._onCellValuesForGroupChanged,
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

        return this._getChangedKeysOnLoad();
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
            if (!this._sourceModel.isDeleted) {
                this._recordStore.getViewDataStore(this._sourceModel.id).unloadData();
            }
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
            if (!this._sourceModel.isDeleted) {
                const viewDataStore = this._recordStore.getViewDataStore(this._sourceModel.id);
                viewDataStore.unwatch(
                    WatchableViewDataStoreKeys.visibleRecords,
                    this._onRecordsChanged,
                    this,
                );
                viewDataStore.unwatch(
                    WatchableViewDataStoreKeys.groups,
                    this._onGroupsChanged,
                    this,
                );
                viewDataStore.unwatch(
                    WatchableViewDataStoreKeys.groupLevels,
                    this._onGroupLevelsChanged,
                    this,
                );
            }
        }

        this._recordStore.unwatch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._recordStore.unwatch(
            this._cellValuesForGroupWatchKeys,
            this._onCellValuesForGroupChanged,
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

        this._unloadOrderedGroupsIfNeeded();

        this._visList = null;
        this._orderedRecordIds = null;
        this._recordIdsSet = null;

        this._table.__tableOrViewQueryResultPool.unregisterObjectForReuseStrong(this);
    }
    /** @internal */
    _addRecordIdsToVisList(recordIds: Array<string>) {
        const visList = this._visList;
        invariant(visList, 'No vis list');
        for (const recordId of recordIds) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            invariant(record, 'Record missing in table');
            visList.addRecordData(record._data);
        }
    }
    /** @internal */
    _onGroupLevelsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates?: {addedRecordIds: Array<string>; removedRecordIds: Array<string>} | null,
    ) {
        this._loadedGroupLevels = this._sourceModelGroupLevels;
        this._unloadRemovedGroupsAndLoadNewGroupsAndTriggerWatches();
        this._onChange(RecordQueryResult.WatchableKeys.groupLevels);
    }
    /** @internal */
    _onGroupsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates?: {addedRecordIds: Array<string>; removedRecordIds: Array<string>} | null,
    ) {
        this._unloadRemovedGroupsAndLoadNewGroupsAndTriggerWatches();
    }
    /** @internal */
    _onRecordsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates?: {addedRecordIds: Array<string>; removedRecordIds: Array<string>} | null,
    ) {
        if (model instanceof ViewDataStore) {
            invariant(this._orderedRecordIds, '_orderedRecordIds unset');
            const visibleRecordIds = this._recordStore.getViewDataStore(model.viewId)
                .visibleRecordIds;
            const addedRecordIds = arrayDifference(visibleRecordIds, this._orderedRecordIds);
            const removedRecordIds = arrayDifference(this._orderedRecordIds, visibleRecordIds);
            updates = {addedRecordIds, removedRecordIds};
        }

        if (!updates) {
            return;
        }

        const {addedRecordIds, removedRecordIds} = updates;

        if (this._sorts) {
            const visList = this._visList;
            invariant(visList, 'No vis list');

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
    _onCellValuesForGroupChanged(
        recordStore: RecordStore,
        key: string,
        recordIds?: Array<string> | null,
        fieldId?: string | null,
    ) {
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
        invariant(visList, 'No vis list');

        invariant(recordIds.length > 0, 'field ID set without a corresponding record ID');

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
            if (fieldIdsSet.has(fieldId)) {
                wereAnyFieldsCreatedOrDeleted = true;
                const field = this._table.getFieldByIdIfExists(fieldId);
                invariant(field, 'Created field does not exist');
                field.watch('type', this._onFieldConfigChanged, this);
                field.watch('options', this._onFieldConfigChanged, this);
            }
        }

        if (!wereAnyFieldsCreatedOrDeleted) {
            wereAnyFieldsCreatedOrDeleted = removedFieldIds.some(fieldId =>
                fieldIdsSet.has(fieldId),
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
            invariant(this._visList, 'Cannot generate record ids without a vis list');
            return this._visList.getOrderedRecordIds();
        } else {
            return this._sourceModelRecordIds;
        }
    }
    /** @internal */
    _generateAndLoadOrderedGroups(): Array<GroupedRecordQueryResult> | null {
        if (this._groupLevels) {
            invariant(this._visList, 'Cannot generate record ids without a vis list');
            throw spawnError('custom group configs not supported');
        } else {
            const groupLevels = this._sourceModelGroupLevels;
            if (!this._sourceModelGroups || !groupLevels) {
                return null;
            }
            return this._sourceModelGroups.map(groupData => {
                const group = this.__groupedRecordQueryResultPool.getObjectForReuse(
                    this,
                    groupData,
                    groupLevels,
                    this._normalizedOpts,
                    this._sdk,
                );
                group.loadDataAsync();
                return group;
            });
        }
    }
    /** @internal */
    _unloadOrderedGroupsIfNeeded() {
        if (this._orderedGroups) {
            for (const group of this._orderedGroups) {
                group.unloadData();
            }
        }
    }
    /**
     * If groupings change then some groups will need to be created, and some removed
     * This (TODO: will) handle the diffing necessary to unload, and reload only the changed groups.
     * Also triggers the WatchableKeys.group, as by necessity this will have changed.
     *
     * @internal
     */
    _unloadRemovedGroupsAndLoadNewGroupsAndTriggerWatches() {
        this._unloadOrderedGroupsIfNeeded();
        this._orderedGroups = this._generateAndLoadOrderedGroups();
        this._onChange(RecordQueryResult.WatchableKeys.groups);
    }
    /** @internal */
    _replaceVisList() {
        const airtableInterface = this._sdk.__airtableInterface;
        const appInterface = this._sdk.__appInterface;

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
        invariant(this._sorts, 'No sorts');

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
