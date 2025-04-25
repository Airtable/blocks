import {
    fireAndForgetPromise,
    entries,
    has,
    values,
    ObjectMap,
    FlowAnyFunction,
    FlowAnyObject,
    cast,
    keys as objectKeys,
    ObjectValues,
    isEnumValue,
} from '../../shared/private_utils';
import {invariant, logErrorToSentry} from '../../shared/error_utils';
import Sdk from '../sdk';
import {TableData} from '../types/table';
import {TableId, FieldId, ViewId, RecordId} from '../../shared/types/hyper_ids';
import {RecordData} from '../types/record';
import {AirtableInterface} from '../types/airtable_interface';
import {ChangedPathsForType} from '../../shared/models/base_core';
import {BaseSdkMode} from '../../sdk_mode';
import RecordStoreCore, {
    WatchableCellValuesInFieldKeyPrefix,
    WatchableRecordStoreKeysCore,
} from '../../shared/models/record_store_core';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Record from './record';
import ViewDataStore from './view_data_store';
import Table from './table';

export const WatchableRecordStoreKeys = Object.freeze({
    ...WatchableRecordStoreKeysCore,
});

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
class RecordStore extends RecordStoreCore<BaseSdkMode, WatchableRecordStoreKey> {
    static _className = 'RecordStore';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordStoreKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    readonly _viewDataStoresByViewId: ObjectMap<ViewId, ViewDataStore> = {};
    readonly _loader: RecordStoreAsyncLoader;

    constructor(sdk: Sdk, tableId: TableId) {
        super(sdk, tableId);

        const onChange = this._onChange.bind(this);
        const clearRecordModels = () => {
            this._recordModelsById = {};
        };
        this._loader = new RecordStoreAsyncLoader(sdk, tableId, onChange, clearRecordModels);
    }

    _constructRecord(recordId: RecordId, parentTable: Table): Record {
        return new Record(this._sdk, this, parentTable, recordId);
    }

    get _dataOrNullIfDeleted(): TableData | null {
        return this._loader._dataOrNullIfDeleted;
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
        const fieldIdsToLoad = this._loader._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToLoad.length > 0) {
            fireAndForgetPromise(async () => {
                await this._loader.loadCellValuesInFieldIdsAsync(
                    fieldIdsToLoad,
                    this._onChange.bind(this),
                );
            });
        }
        return validKeys;
    }

    unwatch(
        keys: WatchableRecordStoreKey | ReadonlyArray<WatchableRecordStoreKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKey> {
        const validKeys = super.unwatch(keys, callback, context);
        const fieldIdsToUnload = this._loader._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToUnload.length > 0) {
            this._loader.unloadCellValuesInFieldIds(fieldIdsToUnload);
        }
        return validKeys;
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

    __onDataDeletion(): void {
        // also need to call unloadCellValuesInFieldIds because otherwise
        // on the hyperbase side, the old record store would still be subscribed
        // to the cell values and it will refuse a request for new subscription
        for (const fieldId of Object.keys(this._loader._cellValuesRetainCountByFieldId)) {
            while (
                this._loader._cellValuesRetainCountByFieldId[fieldId] &&
                this._loader._cellValuesRetainCountByFieldId[fieldId] > 0
            ) {
                this._loader.unloadCellValuesInFieldIds([fieldId]);
            }
        }

        this._loader._forceUnload();

        // similarly unsubscribe from the view data.
        // this comes after _forceUnload to avoid over releasing the table data.
        for (const viewDataStore of values(this._viewDataStoresByViewId)) {
            viewDataStore.__onDataDeletion();
        }
    }

    // #region async data loading
    // wrapper methods over RecordStoreAsyncLoader
    get isDeleted(): boolean {
        return this._loader.isDeleted || super.isDeleted;
    }
    get isDataLoaded(): boolean {
        return !this.isDeleted && this._loader.isDataLoaded;
    }
    async loadDataAsync() {
        return await this._loader.loadDataAsync();
    }
    unloadData() {
        return this._loader.unloadData();
    }
    get isRecordMetadataLoaded() {
        return this._loader.isRecordMetadataLoaded;
    }
    async loadRecordMetadataAsync() {
        return await this._loader.loadRecordMetadataAsync(this._onChange.bind(this));
    }
    unloadRecordMetadata() {
        return this._loader.unloadRecordMetadata();
    }
    areCellValuesLoadedForFieldId(fieldId: FieldId): boolean {
        return this._loader.areCellValuesLoadedForFieldId(fieldId);
    }
    async loadCellValuesInFieldIdsAsync(fieldIds: Array<FieldId>) {
        return await this._loader.loadCellValuesInFieldIdsAsync(
            fieldIds,
            this._onChange.bind(this),
        );
    }
    unloadCellValuesInFieldIds(fieldIds: Array<FieldId>) {
        return this._loader.unloadCellValuesInFieldIds(fieldIds);
    }
    // #endregion

    triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<TableData>) {
        if (this.isRecordMetadataLoaded && dirtyPaths.recordsById) {
            super.triggerOnChangeForDirtyPaths(dirtyPaths);
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
class RecordStoreAsyncLoader extends AbstractModelWithAsyncData<TableData, string> {
    static _shouldLoadDataForKey(key: WatchableRecordStoreKey): boolean {
        // "Data" means *all* cell values in the table. If only watching records/recordIds,
        // we'll just load record metadata (id, createdTime, commentCount).
        // If only watching specific fields, we'll just load cell values in those
        // fields. Both of those scenarios are handled manually by this class,
        // instead of relying on AbstractModelWithAsyncData.
        return key === WatchableRecordStoreKeys.cellValues;
    }

    readonly tableId: TableId;
    readonly _airtableInterface: AirtableInterface;
    readonly _primaryFieldId: FieldId;
    readonly _onChange: (key: string) => void;
    readonly _clearRecordModels: () => void;

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

    _timeoutForRemovingFieldIds: NodeJS.Timeout | null = null;

    constructor(
        sdk: Sdk,
        tableId: TableId,
        onChange: (key: string) => void,
        clearRecordModels: () => void,
    ) {
        super(sdk, `${tableId}-RecordStore`);

        this._airtableInterface = sdk.__airtableInterface;
        this.tableId = tableId;
        this._onChange = onChange;
        this._clearRecordModels = clearRecordModels;
        // A bit of a hack, but we use the primary field ID to load record
        // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
        // ID here instead of calling this.primaryField.id since that would crash
        // when the table is getting unloaded after being deleted.
        this._primaryFieldId = this._data.primaryFieldId;
    }

    _onChangeIsDataLoaded(): void {
        // noop
    }

    /**
     * Record metadata means record IDs, createdTime, and commentCount are loaded.
     * Record metadata must be loaded before creating, deleting, or updating records.
     */
    get isRecordMetadataLoaded(): boolean {
        return !!this._data.recordsById;
    }

    async loadRecordMetadataAsync(onChange: (key: WatchableRecordStoreKey) => void) {
        return await this.loadCellValuesInFieldIdsAsync(
            [this._getFieldIdForCausingRecordMetadataToLoad()],
            onChange,
        );
    }

    unloadRecordMetadata() {
        this.unloadCellValuesInFieldIds([this._getFieldIdForCausingRecordMetadataToLoad()]);
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

    async loadCellValuesInFieldIdsAsync(
        fieldIds: Array<FieldId>,
        onChange: (key: WatchableRecordStoreKey) => void,
    ) {
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
                    onChange(key);
                }
            });
        }
        // Since we are incrementing fieldIds, it's necessary to restart any pending timeouts
        // to unload data. This is because it's possible for a timeout to fire while a queryResult
        // is actively unloading, and erroneously unload data. Data must be unloaded _after_ the queryResult.
        this._restartTimeoutToUnloadFieldIdsIfTimeoutIsActive();
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

                // Metadata (createdTime, commentCount) should generally be up to date,
                // but can be out of date in the rare scenario where realtime
                // data has not yet been delivered to the SDK, but is populated in hyperbase
                // at the time this new fetch is executed.
                // istanbul ignore next
                if (existingRecordObj.commentCount !== newRecordObj.commentCount) {
                    const isCommentCountTypesSame =
                        typeof existingRecordObj.commentCount !== typeof newRecordObj.commentCount;
                    logErrorToSentry('comment count out of sync - types are same: %s', {
                        isCommentCountTypesSame,
                    });
                }

                // istanbul ignore next
                if (existingRecordObj.createdTime !== newRecordObj.createdTime) {
                    const isCreatedTimeTypesSame =
                        typeof existingRecordObj.createdTime !== typeof newRecordObj.createdTime;
                    logErrorToSentry('created time out of sync - types are same: %s', {
                        isCreatedTimeTypesSame,
                    });
                }

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
        for (const fieldId of fieldIds) {
            let fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
            fieldRetainCount--;

            if (fieldRetainCount < 0) {
                console.log('Field data over-released'); // eslint-disable-line no-console
                fieldRetainCount = 0;
            }
            this._cellValuesRetainCountByFieldId[fieldId] = fieldRetainCount;
        }
        // Don't unload immediately. Wait a while in case something else
        // requests the data, so we can avoid going back to liveapp or
        // the network.
        this._startTimeoutToUnloadForFieldIdsIfNeeded();
    }

    // This unloads all fields where the retain count is at zero, and if any other
    // request to unload fields is pending - cancels it and restarts it.
    // This is important because fields must always be unloaded at least __DATA_UNLOAD_DELAY_MS
    // after the unload is requested so that any QueryResults relying on them properly
    // unload either first, or at the same time
    _startTimeoutToUnloadForFieldIdsIfNeeded() {
        const fieldIdsWithZeroRetainCount: Array<FieldId> = [];
        for (const [fieldId, retainCount] of Object.entries(this._cellValuesRetainCountByFieldId)) {
            if (retainCount === 0) {
                fieldIdsWithZeroRetainCount.push(fieldId);
            }
        }

        // Cancel any pending timeouts before proceeding
        // This should be canceled even if there aren't any fields to unload as that means
        // that there has been loading that's occured that makes the pending request invalid
        if (this._timeoutForRemovingFieldIds) {
            clearTimeout(this._timeoutForRemovingFieldIds);
            this._timeoutForRemovingFieldIds = null;
        }
        if (fieldIdsWithZeroRetainCount.length > 0) {
            this._timeoutForRemovingFieldIds = setTimeout(() => {
                // Make sure the retain count is still zero, since it may
                // have been incremented before the timeout fired.
                const fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
                    // It's necessary to also check that the field is loaded, as it's possible
                    // for an unload to trigger with fields that have already been removed.
                    return (
                        this._cellValuesRetainCountByFieldId[fieldId] === 0 &&
                        this._areCellValuesLoadedByFieldId[fieldId]
                    );
                });
                // istanbul ignore else
                if (fieldIdsToUnload.length > 0) {
                    // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
                    // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
                    for (const fieldId of fieldIdsToUnload) {
                        this._areCellValuesLoadedByFieldId[fieldId] = false;
                    }
                    this._unloadCellValuesInFieldIds(fieldIdsToUnload);
                } else {
                    // This shouldn't be possible because we always cancel the timer if fieldIds loadedness
                    // status ever changes
                    logErrorToSentry(
                        'fieldIdsToUnload is empty, this likely means the unload timer is not properly reset.',
                    );
                }
                this._timeoutForRemovingFieldIds = null;
            }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
        }
    }

    _restartTimeoutToUnloadFieldIdsIfTimeoutIsActive() {
        if (this._timeoutForRemovingFieldIds) {
            this._startTimeoutToUnloadForFieldIdsIfNeeded();
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
                // This should be impossible - for fields should always be loaded
                // when attempting to unload specific fields. This codepath was previously possible
                // due to a bug. It could be converted to an invariant, but that is higher risk.
                // istanbul ignore if
                if (unloadedFieldIds) {
                    // Specific fields were unloaded, so clear out the cell values for those fields.
                    fieldIdsToClear = unloadedFieldIds;
                    logErrorToSentry('Field Ids are being unloaded when record_store is unloaded');
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
            this._clearRecordModels();
        }
    }

    get _dataOrNullIfDeleted(): TableData | null {
        return this._baseData.tablesById[this.tableId] ?? null;
    }
}

/** @internal */
export default RecordStore;
