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
        // "Data" means *all* cell values in the table. If only watching records/recordIds,
        // we'll just load record metadata (id, createdTime, commentCount).
        // If only watching specific fields, we'll just load cell values in those
        // fields. Both of those scenarios are handled manually by this class,
        // instead of relying on AbstractModelWithAsyncData.
        return key === WatchableRecordStoreKeys.cellValues;
    }

    readonly tableId: TableId;
    _recordModelsById: ObjectMap<RecordId, Record> = {};
    readonly _primaryFieldId: FieldId;
    readonly _airtableInterface: AirtableInterface;
    readonly _viewDataStoresByViewId: ObjectMap<ViewId, ViewDataStore> = {};

    // There is a lot of duplication here and in AbstractModelWithAsyncData.
    // Alternatively, phase out AbstractModelWithAsyncData as a superclass
    // and instead create a helper class for managing each part of the data
    // tree that is loaded.
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
        // A bit of a hack, but we use the primary field ID to load record
        // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
        // ID here instead of calling this.primaryField.id since that would crash
        // when the table is getting unloaded after being deleted.
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
        // noop
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
        // also need to call unloadCellValuesInFieldIds because otherwise
        // on the hyperbase side, the old record store would still be subscribed
        // to the cell values and it will refuse a request for new subscription
        for (const fieldId of Object.keys(this._cellValuesRetainCountByFieldId)) {
            while (
                this._cellValuesRetainCountByFieldId[fieldId] &&
                this._cellValuesRetainCountByFieldId[fieldId] > 0
            ) {
                this.unloadCellValuesInFieldIds([fieldId]);
            }
        }

        this._forceUnload();

        // similarly unsubscribe from the view data.
        // this comes after _forceUnload to avoid over releasing the table data.
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
        // As a shortcut, we'll load the primary field cell values to
        // cause record metadata (id, createdTime, commentCount) to be loaded
        // and subscribed to. In the future, we could add an explicit model
        // bridge to fetch and subscribe to row metadata.
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

            // NOTE: we don't use this.areCellValuesLoadedForFieldId() here because
            // that will return true if the cell values are loaded as a result
            // of the entire table being loaded. In that scenario, we still
            // want to separately load the cell values for the field so there
            // is a separate subscription. Otherwise, when the table data unloads,
            // the field data would unload as well. This can be improved by just
            // subscribing to the field data without fetching it, since the cell
            // values are already in the block frame.
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
            // Could inline _loadCellValuesInFieldIdsAsync, but following the
            // pattern from AbstractModelWithAsyncData where the public method
            // is responsible for updating retain counts and the private method
            // actually fetches data.
            const loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = this._loadCellValuesInFieldIdsAsync(
                fieldIdsWhichAreNotAlreadyLoadedOrLoading,
            );
            pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);
            for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
                this._pendingCellValuesLoadPromiseByFieldId[
                    fieldId
                ] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
            }
            // Doing `.then` instead of performing these actions directly in
            // _loadCellValuesInFieldIdsAsync so this is similar to
            // AbstractModelWithAsyncData. The idea is to refactor to avoid code
            // duplication, so keeping them similar for now hopefully will make the
            // refactor simpler.
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

        // Merge with existing data.
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

                // Metadata (createdTime, commentCount) should already be up to date,
                // but just verify for sanity. If this doesn't catch anything, can
                // remove it for perf.
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
        // Need to trigger onChange for records and recordIds since watching either
        // of those causes record metadata to be loaded (via _getFieldIdForCausingRecordMetadataToLoad)
        // and by convention we trigger a change event when data loads.
        changedKeys.push(WatchableRecordStoreKeys.records);
        changedKeys.push(WatchableRecordStoreKeys.recordIds);
        // Also trigger cellValues changes since the cell values in the fields
        // are now loaded.
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
            // Don't unload immediately. Wait a while in case something else
            // requests the data, so we can avoid going back to liveapp or
            // the network.
            setTimeout(() => {
                // Make sure the retain count is still zero, since it may
                // have been incremented before the timeout fired.
                const fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
                    return this._cellValuesRetainCountByFieldId[fieldId] === 0;
                });
                if (fieldIdsToUnload.length > 0) {
                    // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
                    // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
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
                    // Specific fields were unloaded, so clear out the cell values for those fields.
                    fieldIdsToClear = unloadedFieldIds;
                } else {
                    // The entire table was unloaded, but some individual fields are still loaded.
                    // We need to clear out the cell values of every field that was unloaded.
                    // This is kind of slow, but hopefully uncommon.
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
            // Since tables don't have a record order, need to detect if a record
            // was created or deleted and trigger onChange for records.
            const dirtyFieldIdsSet: ObjectMap<FieldId, true> = {};
            const addedRecordIds: Array<RecordId> = [];
            const removedRecordIds: Array<RecordId> = [];
            for (const [recordId, dirtyRecordPaths] of entries(dirtyPaths.recordsById) as Array<
                [RecordId, ChangedPathsForType<RecordData>]
            >) {
                if (dirtyRecordPaths && dirtyRecordPaths._isDirty) {
                    // If the entire record is dirty, it was either created or deleted.
                    invariant(this._data.recordsById, 'No recordsById');

                    if (has(this._data.recordsById, recordId)) {
                        addedRecordIds.push(recordId);
                    } else {
                        removedRecordIds.push(recordId);

                        const recordModel = this._recordModelsById[recordId];
                        if (recordModel) {
                            // Remove the Record model if it was deleted.
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

            // Now that we've composed our created/deleted record ids arrays, let's fire
            // the records onChange event if any records were created or deleted.
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

            // NOTE: this is an experimental (and somewhat messy) way to watch
            // for changes to cells in a table, as an alternative to implementing
            // full event bubbling. For now, it unblocks the things we want to
            // build, but we may replace it.
            // If we keep it, could be more efficient by not calling _onChange
            // if there are no subscribers.
            // TODO: don't trigger changes for fields that aren't supposed to be loaded
            // (in some cases, e.g. record created, liveapp will send cell values
            // that we're not subscribed to).
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
            // clean up deleted views
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
