import {
    isEnumValue,
    fireAndForgetPromise,
    entries,
    has,
    values,
    ObjectValues,
    ObjectMap,
    FlowAnyFunction,
    FlowAnyObject,
    cast,
    keys as objectKeys,
} from '../private_utils';
import {invariant} from '../error_utils';
import Sdk from '../sdk';
import {TableId, TableData} from '../types/table';
import {FieldId} from '../types/field';
import {RecordId, RecordData} from '../types/record';
import {ViewId} from '../types/view';
import {AirtableInterface} from '../types/airtable_interface';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Record from './record';
import ViewDataStore from './view_data_store';
import {ChangedPathsForType} from './base';

export const WatchableRecordStoreKeys = Object.freeze({
    records: 'records' as const,
    recordIds: 'recordIds' as const,
    cellValues: 'cellValues' as const,
});
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';

/**
 * The string case is to accommodate prefix keys
 *
 * @internal
 */
export type WatchableRecordStoreKey = ObjectValues<typeof WatchableRecordStoreKeys> | string;

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @internal
 */
class RecordStore extends AbstractModelWithAsyncData<TableData, WatchableRecordStoreKey> {
    static _className = 'RecordStore';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordStoreKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }
    static _shouldLoadDataForKey(key: WatchableRecordStoreKey): boolean {
        return key === WatchableRecordStoreKeys.cellValues;
    }

    readonly tableId: TableId;
    _recordModelsById: ObjectMap<RecordId, Record> = {};
    readonly _primaryFieldId: FieldId;
    readonly _airtableInterface: AirtableInterface;
    readonly _viewDataStoresByViewId: ObjectMap<ViewId, ViewDataStore> = {};

    _areCellValuesLoadedByFieldId: ObjectMap<FieldId, boolean | undefined> = {};
    _pendingCellValuesLoadPromiseByFieldId: ObjectMap<
        FieldId,
        Promise<Array<WatchableRecordStoreKey>> | undefined
    > = {};
    _cellValuesRetainCountByFieldId: ObjectMap<FieldId, number> = {};

    constructor(sdk: Sdk, tableId: TableId) {
        super(sdk, `${tableId}-RecordStore`);

        this._airtableInterface = sdk.__airtableInterface;
        this.tableId = tableId;
        this._primaryFieldId = this._data.primaryFieldId;
    }

    getViewDataStore(viewId: ViewId): ViewDataStore {
        if (this._viewDataStoresByViewId[viewId]) {
            return this._viewDataStoresByViewId[viewId];
        }
        invariant(this._data.viewsById[viewId], 'view must exist');
        const viewDataStore = new ViewDataStore(this._sdk, this, viewId);
        this._viewDataStoresByViewId[viewId] = viewDataStore;
        return viewDataStore;
    }

    watch(
        keys: WatchableRecordStoreKey | ReadonlyArray<WatchableRecordStoreKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKey> {
        const validKeys = super.watch(keys, callback, context);
        const fieldIdsToLoad = this._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToLoad.length > 0) {
            fireAndForgetPromise(this.loadCellValuesInFieldIdsAsync.bind(this, fieldIdsToLoad));
        }
        return validKeys;
    }

    unwatch(
        keys: WatchableRecordStoreKey | ReadonlyArray<WatchableRecordStoreKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKey> {
        const validKeys = super.unwatch(keys, callback, context);
        const fieldIdsToUnload = this._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToUnload.length > 0) {
            this.unloadCellValuesInFieldIds(fieldIdsToUnload);
        }
        return validKeys;
    }

    _getFieldIdsToLoadFromWatchableKeys(keys: Array<WatchableRecordStoreKey>): Array<string> {
        const fieldIdsToLoad = [];
        for (const key of keys) {
            if (key.startsWith(WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(WatchableCellValuesInFieldKeyPrefix.length);
                fieldIdsToLoad.push(fieldId);
            } else if (
                key === WatchableRecordStoreKeys.records ||
                key === WatchableRecordStoreKeys.recordIds
            ) {
                fieldIdsToLoad.push(this._getFieldIdForCausingRecordMetadataToLoad());
            }
        }
        return fieldIdsToLoad;
    }

    get _dataOrNullIfDeleted(): TableData | null {
        return this._baseData.tablesById[this.tableId] ?? null;
    }

    _onChangeIsDataLoaded() {
    }

    /**
     * The records in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */
    get records(): Array<Record> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        const records = Object.keys(recordsById).map(recordId => {
            const record = this.getRecordByIdIfExists(recordId);
            invariant(record, 'record');
            return record;
        });
        return records;
    }

    /**
     * The record IDs in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */
    get recordIds(): Array<string> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        return Object.keys(recordsById);
    }

    getRecordByIdIfExists(recordId: string): Record | null {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        invariant(typeof recordId === 'string', 'getRecordById expects a string');

        if (!recordsById[recordId]) {
            return null;
        } else {
            if (this._recordModelsById[recordId]) {
                return this._recordModelsById[recordId];
            }
            const newRecord = new Record(
                this._sdk,
                this,
                this._sdk.base.getTableById(this.tableId),
                recordId,
            );
            this._recordModelsById[recordId] = newRecord;
            return newRecord;
        }
    }

    __onDataDeletion(): void {
        for (const fieldId of Object.keys(this._cellValuesRetainCountByFieldId)) {
            while (
                this._cellValuesRetainCountByFieldId[fieldId] &&
                this._cellValuesRetainCountByFieldId[fieldId] > 0
            ) {
                this.unloadCellValuesInFieldIds([fieldId]);
            }
        }

        this._forceUnload();

        for (const viewDataStore of values(this._viewDataStoresByViewId)) {
            viewDataStore.__onDataDeletion();
        }
    }

    /**
     * Record metadata means record IDs, createdTime, and commentCount are loaded.
     * Record metadata must be loaded before creating, deleting, or updating records.
     */
    get isRecordMetadataLoaded(): boolean {
        return !!this._data.recordsById;
    }

    async loadRecordMetadataAsync() {
        return await this.loadCellValuesInFieldIdsAsync([
            this._getFieldIdForCausingRecordMetadataToLoad(),
        ]);
    }

    unloadRecordMetadata() {
        this.unloadCellValuesInFieldIds([this._getFieldIdForCausingRecordMetadataToLoad()]);
    }

    _getFieldIdForCausingRecordMetadataToLoad(): FieldId {
        return this._primaryFieldId;
    }

    areCellValuesLoadedForFieldId(fieldId: FieldId): boolean {
        return this.isDataLoaded || this._areCellValuesLoadedByFieldId[fieldId] || false;
    }

    async loadCellValuesInFieldIdsAsync(fieldIds: Array<FieldId>) {
        this._assertNotForceUnloaded();
        const fieldIdsWhichAreNotAlreadyLoadedOrLoading: Array<FieldId> = [];
        const pendingLoadPromises: Array<Promise<Array<WatchableRecordStoreKey>>> = [];
        for (const fieldId of fieldIds) {
            if (this._cellValuesRetainCountByFieldId[fieldId] !== undefined) {
                this._cellValuesRetainCountByFieldId[fieldId]++;
            } else {
                this._cellValuesRetainCountByFieldId[fieldId] = 1;
            }

            if (!this._areCellValuesLoadedByFieldId[fieldId]) {
                const pendingLoadPromise = this._pendingCellValuesLoadPromiseByFieldId[fieldId];
                if (pendingLoadPromise) {
                    pendingLoadPromises.push(pendingLoadPromise);
                } else {
                    fieldIdsWhichAreNotAlreadyLoadedOrLoading.push(fieldId);
                }
            }
        }
        if (fieldIdsWhichAreNotAlreadyLoadedOrLoading.length > 0) {
            const loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = this._loadCellValuesInFieldIdsAsync(
                fieldIdsWhichAreNotAlreadyLoadedOrLoading,
            );
            pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);
            for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
                this._pendingCellValuesLoadPromiseByFieldId[
                    fieldId
                ] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
            }
            loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise.then(changedKeys => {
                for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
                    this._areCellValuesLoadedByFieldId[fieldId] = true;
                    this._pendingCellValuesLoadPromiseByFieldId[fieldId] = undefined;
                }

                for (const key of changedKeys) {
                    this._onChange(key);
                }
            });
        }
        await Promise.all(pendingLoadPromises);
    }

    async _loadCellValuesInFieldIdsAsync(
        fieldIds: Array<FieldId>,
    ): Promise<Array<WatchableRecordStoreKey>> {
        const {
            recordsById: newRecordsById,
        } = await this._airtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync(
            this.tableId,
            fieldIds,
        );

        if (!this._data.recordsById) {
            this._data.recordsById = {};
        }
        const {recordsById: existingRecordsById} = this._data;
        for (const [recordId, newRecordObj] of entries(
            cast<ObjectMap<RecordId, RecordData>>(newRecordsById),
        )) {
            if (!has(existingRecordsById, recordId)) {
                existingRecordsById[recordId] = newRecordObj;
            } else {
                const existingRecordObj = existingRecordsById[recordId];

                invariant(
                    existingRecordObj.commentCount === newRecordObj.commentCount,
                    'comment count out of sync',
                );

                invariant(
                    existingRecordObj.createdTime === newRecordObj.createdTime,
                    'created time out of sync',
                );

                if (!existingRecordObj.cellValuesByFieldId) {
                    existingRecordObj.cellValuesByFieldId = {};
                }
                const existingCellValuesByFieldId = existingRecordObj.cellValuesByFieldId;
                for (let i = 0; i < fieldIds.length; i++) {
                    const fieldId = fieldIds[i];
                    existingCellValuesByFieldId[fieldId] = newRecordObj.cellValuesByFieldId
                        ? newRecordObj.cellValuesByFieldId[fieldId]
                        : undefined;
                }
            }
        }

        const changedKeys = fieldIds.map(fieldId => WatchableCellValuesInFieldKeyPrefix + fieldId);
        changedKeys.push(WatchableRecordStoreKeys.records);
        changedKeys.push(WatchableRecordStoreKeys.recordIds);
        changedKeys.push(WatchableRecordStoreKeys.cellValues);
        return changedKeys;
    }

    unloadCellValuesInFieldIds(fieldIds: Array<FieldId>) {
        if (this._isForceUnloaded) {
            return;
        }
        const fieldIdsWithZeroRetainCount: Array<FieldId> = [];
        for (const fieldId of fieldIds) {
            let fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
            fieldRetainCount--;

            if (fieldRetainCount < 0) {
                console.log('Field data over-released'); // eslint-disable-line no-console
                fieldRetainCount = 0;
            }
            this._cellValuesRetainCountByFieldId[fieldId] = fieldRetainCount;

            if (fieldRetainCount === 0) {
                fieldIdsWithZeroRetainCount.push(fieldId);
            }
        }
        if (fieldIdsWithZeroRetainCount.length > 0) {
            setTimeout(() => {
                const fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
                    return this._cellValuesRetainCountByFieldId[fieldId] === 0;
                });
                if (fieldIdsToUnload.length > 0) {
                    for (const fieldId of fieldIdsToUnload) {
                        this._areCellValuesLoadedByFieldId[fieldId] = false;
                    }
                    this._unloadCellValuesInFieldIds(fieldIdsToUnload);
                }
            }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
        }
    }

    _unloadCellValuesInFieldIds(fieldIds: Array<FieldId>) {
        this._airtableInterface.unsubscribeFromCellValuesInFields(this.tableId, fieldIds);
        this._afterUnloadDataOrUnloadCellValuesInFieldIds(fieldIds);
    }

    async _loadDataAsync(): Promise<Array<WatchableRecordStoreKey>> {
        const tableData = await this._airtableInterface.fetchAndSubscribeToTableDataAsync(
            this.tableId,
        );
        this._data.recordsById = tableData.recordsById;

        const changedKeys: Array<WatchableRecordStoreKey> = [
            WatchableRecordStoreKeys.records,
            WatchableRecordStoreKeys.recordIds,
            WatchableRecordStoreKeys.cellValues,
        ];

        for (const fieldId of objectKeys(this._data.fieldsById)) {
            changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }

    _unloadData() {
        this._airtableInterface.unsubscribeFromTableData(this.tableId);
        this._afterUnloadDataOrUnloadCellValuesInFieldIds();
    }

    _afterUnloadDataOrUnloadCellValuesInFieldIds(unloadedFieldIds?: Array<FieldId>) {
        const areAnyFieldsLoaded =
            this.isDataLoaded ||
            values(this._areCellValuesLoadedByFieldId).some(isLoaded => isLoaded);

        if (!this.isDeleted) {
            if (!areAnyFieldsLoaded) {
                this._data.recordsById = undefined;
            } else if (!this.isDataLoaded) {
                let fieldIdsToClear;
                if (unloadedFieldIds) {
                    fieldIdsToClear = unloadedFieldIds;
                } else {
                    const fieldIds = Object.keys(this._data.fieldsById);
                    fieldIdsToClear = fieldIds.filter(
                        fieldId => !this._areCellValuesLoadedByFieldId[fieldId],
                    );
                }
                const {recordsById} = this._data;
                for (const recordObj of values(recordsById || {})) {
                    for (let i = 0; i < fieldIdsToClear.length; i++) {
                        const fieldId = fieldIdsToClear[i];
                        if (recordObj.cellValuesByFieldId) {
                            recordObj.cellValuesByFieldId[fieldId] = undefined;
                        }
                    }
                }
            }
        }
        if (!areAnyFieldsLoaded) {
            this._recordModelsById = {};
        }
    }

    triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<TableData>) {
        if (this.isRecordMetadataLoaded && dirtyPaths.recordsById) {
            const dirtyFieldIdsSet: ObjectMap<FieldId, true> = {};
            const addedRecordIds: Array<RecordId> = [];
            const removedRecordIds: Array<RecordId> = [];
            for (const [recordId, dirtyRecordPaths] of entries(dirtyPaths.recordsById) as Array<
                [RecordId, ChangedPathsForType<RecordData>]
            >) {
                if (dirtyRecordPaths && dirtyRecordPaths._isDirty) {
                    invariant(this._data.recordsById, 'No recordsById');

                    if (has(this._data.recordsById, recordId)) {
                        addedRecordIds.push(recordId);
                    } else {
                        removedRecordIds.push(recordId);

                        const recordModel = this._recordModelsById[recordId];
                        if (recordModel) {
                            delete this._recordModelsById[recordId];
                        }
                    }
                } else {
                    const recordModel = this._recordModelsById[recordId];
                    if (recordModel) {
                        recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
                    }
                }

                const {cellValuesByFieldId} = dirtyRecordPaths;
                if (cellValuesByFieldId) {
                    for (const fieldId of Object.keys(cellValuesByFieldId)) {
                        dirtyFieldIdsSet[fieldId] = true;
                    }
                }
            }

            if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeys.records, {
                    addedRecordIds,
                    removedRecordIds,
                });

                this._onChange(WatchableRecordStoreKeys.recordIds, {
                    addedRecordIds,
                    removedRecordIds,
                });
            }

            const fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
            const recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));
            if (fieldIds.length > 0 && recordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeys.cellValues, {
                    recordIds,
                    fieldIds,
                });
            }
            for (const fieldId of fieldIds) {
                this._onChange(WatchableCellValuesInFieldKeyPrefix + fieldId, recordIds, fieldId);
            }
        }

        if (dirtyPaths.viewOrder) {
            for (const [viewId, viewDataStore] of entries(this._viewDataStoresByViewId)) {
                if (viewDataStore.isDeleted) {
                    viewDataStore.__onDataDeletion();
                    delete this._viewDataStoresByViewId[viewId];
                }
            }
        }
    }
}

/** @internal */
export default RecordStore;
