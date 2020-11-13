import {
    isEnumValue,
    ObjectValues,
    FlowAnyExistential,
    FlowAnyObject,
    has,
    ObjectMap,
} from '../private_utils';
import {invariant} from '../error_utils';
import {ModelChange} from '../types/base';
import Sdk from '../sdk';
import {FieldId} from '../types/field';
import {ViewData, ViewId} from '../types/view';
import {RecordId} from '../types/record';
import {AirtableInterface} from '../types/airtable_interface';
import {Color} from '../colors';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import RecordStore from './record_store';
import Record from './record';

export const WatchableViewDataStoreKeys = Object.freeze({
    visibleRecords: 'visibleRecords' as const,
    visibleRecordIds: 'visibleRecordIds' as const,
    recordColors: 'recordColors' as const,
    allFieldIds: 'allFieldIds' as const,
    visibleFieldIds: 'visibleFieldIds' as const,
});

/** @internal */
export type WatchableViewDataStoreKey = ObjectValues<typeof WatchableViewDataStoreKeys>;

// ViewDataStore contains loadable data for a specific view. That means the set of visible records,
// and field order/visibility information. View itself only contains core schema information. The
// data here doesn't belong in View as it's record data or conditionally loaded.
/** @internal */
class ViewDataStore extends AbstractModelWithAsyncData<ViewData, WatchableViewDataStoreKey> {
    static _className = 'ViewDataStore';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewDataStoreKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableViewDataStoreKey): boolean {
        return true;
    }

    readonly viewId: ViewId;
    readonly parentRecordStore: RecordStore;
    _mostRecentTableLoadPromise: Promise<FlowAnyExistential> | null;
    readonly _airtableInterface: AirtableInterface;

    constructor(sdk: Sdk, parentRecordStore: RecordStore, viewId: ViewId) {
        super(sdk, `${viewId}-ViewDataStore`);
        this.parentRecordStore = parentRecordStore;
        this._airtableInterface = sdk.__airtableInterface;
        this._mostRecentTableLoadPromise = null;
        this.viewId = viewId;
    }

    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentRecordStore.tableId];
        return tableData?.viewsById[this.viewId] ?? null;
    }

    _onChangeIsDataLoaded() {
        // noop
    }

    get isDataLoaded(): boolean {
        return this._isDataLoaded && this.parentRecordStore.isRecordMetadataLoaded;
    }

    __onDataDeletion(): void {
        this._forceUnload();
    }

    async loadDataAsync() {
        // Override this method to also load table data.
        // NOTE: it's important that we call loadDataAsync on the table here and not in
        // _loadDataAsync since we want the retain counts for the view and table to increase/decrease
        // in lock-step. If we load table data in _loadDataAsync, the table's retain
        // count only increments some of the time, which leads to unexpected behavior.
        const tableLoadPromise = this.parentRecordStore.loadRecordMetadataAsync();
        this._mostRecentTableLoadPromise = tableLoadPromise;

        await super.loadDataAsync();
    }

    async _loadDataAsync(): Promise<Array<WatchableViewDataStoreKey>> {
        // We need to be sure that the table data is loaded *before* we return
        // from this method.
        invariant(this._mostRecentTableLoadPromise, 'No table load promise');

        const tableLoadPromise = this._mostRecentTableLoadPromise;

        const [viewData] = await Promise.all([
            this._airtableInterface.fetchAndSubscribeToViewDataAsync(
                this.parentRecordStore.tableId,
                this.viewId,
            ),
            tableLoadPromise,
        ]);

        this._data.visibleRecordIds = viewData.visibleRecordIds;
        this._data.fieldOrder = viewData.fieldOrder;
        this._data.colorsByRecordId = viewData.colorsByRecordId;

        if (this._data.colorsByRecordId) {
            for (const record of this.visibleRecords) {
                if (has(this._data.colorsByRecordId, record.id)) {
                    record.__triggerOnChangeForRecordColorInViewId(this.viewId);
                }
            }
        }

        return [
            WatchableViewDataStoreKeys.visibleRecords,
            WatchableViewDataStoreKeys.visibleRecordIds,
            WatchableViewDataStoreKeys.allFieldIds,
            WatchableViewDataStoreKeys.visibleFieldIds,
            WatchableViewDataStoreKeys.recordColors,
        ];
    }

    unloadData() {
        // Override this method to also unload the table's data.
        // NOTE: it's important that we do this here, since we want the view and table's
        // retain counts to increment/decrement in lock-step. If we unload the table's
        // data in _unloadData, it leads to unexpected behavior.
        super.unloadData();
        this.parentRecordStore.unloadRecordMetadata();
    }

    _unloadData() {
        this._mostRecentTableLoadPromise = null;
        this._airtableInterface.unsubscribeFromViewData(
            this.parentRecordStore.tableId,
            this.viewId,
        );
        if (!this.isDeleted) {
            this._data.visibleRecordIds = undefined;
            this._data.colorsByRecordId = undefined;
        }
    }

    __generateChangesForParentTableAddMultipleRecords(
        recordIds: Array<RecordId>,
    ): Array<ModelChange> {
        const newVisibleRecordIds = [...this.visibleRecordIds, ...recordIds];
        return [
            {
                path: [
                    'tablesById',
                    this.parentRecordStore.tableId,
                    'viewsById',
                    this.viewId,
                    'visibleRecordIds',
                ],
                value: newVisibleRecordIds,
            },
        ];
    }

    __generateChangesForParentTableDeleteMultipleRecords(
        recordIds: ReadonlyArray<RecordId>,
    ): Array<ModelChange> {
        const recordIdsToDeleteSet: ObjectMap<RecordId, true> = {};
        for (const recordId of recordIds) {
            recordIdsToDeleteSet[recordId] = true;
        }
        const newVisibleRecordIds = this.visibleRecordIds.filter(recordId => {
            return !recordIdsToDeleteSet[recordId];
        });
        return [
            {
                path: [
                    'tablesById',
                    this.parentRecordStore.tableId,
                    'viewsById',
                    this.viewId,
                    'visibleRecordIds',
                ],
                value: newVisibleRecordIds,
            },
        ];
    }

    /**
     * The record IDs that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */
    get visibleRecordIds(): Array<RecordId> {
        const visibleRecordIds = this._data.visibleRecordIds;
        invariant(visibleRecordIds, 'View data is not loaded');

        // Freeze visibleRecordIds so users can't mutate it.
        // If it changes from liveapp, we get an entire new array which will
        // replace this one, so it's okay to freeze it.
        if (!Object.isFrozen(visibleRecordIds)) {
            Object.freeze(visibleRecordIds);
        }

        return visibleRecordIds;
    }

    /**
     * The records that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */
    get visibleRecords(): Array<Record> {
        invariant(this.parentRecordStore.isRecordMetadataLoaded, 'Table data is not loaded');

        const visibleRecordIds = this._data.visibleRecordIds;
        invariant(visibleRecordIds, 'View data is not loaded');

        return visibleRecordIds.map(recordId => {
            const record = this.parentRecordStore.getRecordByIdIfExists(recordId);
            invariant(record, 'Record in view does not exist');
            return record;
        });
    }

    /**
     * Get the color name for the specified record in this view, or null if no
     * color is available. Watch with 'recordColors'
     *
     * @param recordOrRecordId the record/record id to get the color for
     */
    getRecordColor(record: Record): Color | null {
        invariant(this.isDataLoaded, 'View data is not loaded');

        return this._data.colorsByRecordId?.[record.id] ?? null;
    }

    get allFieldIds(): Array<FieldId> {
        const fieldOrder = this._data.fieldOrder;
        invariant(fieldOrder, 'View data is not loaded');
        return fieldOrder.fieldIds;
    }

    get visibleFieldIds(): Array<FieldId> {
        const fieldOrder = this._data.fieldOrder;
        invariant(fieldOrder, 'View data is not loaded');
        const {fieldIds} = fieldOrder;
        return fieldIds.slice(0, fieldOrder.visibleFieldCount);
    }

    triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject) {
        if (dirtyPaths.visibleRecordIds) {
            this._onChange(WatchableViewDataStoreKeys.visibleRecords);
            this._onChange(WatchableViewDataStoreKeys.visibleRecordIds);
        }
        if (dirtyPaths.fieldOrder) {
            this._onChange(WatchableViewDataStoreKeys.allFieldIds);
            // TODO(kasra): only trigger visibleFields if the *visible* field ids changed.
            this._onChange(WatchableViewDataStoreKeys.visibleFieldIds);
        }
        if (dirtyPaths.colorsByRecordId) {
            const changedRecordIds = dirtyPaths.colorsByRecordId._isDirty
                ? null
                : Object.keys(dirtyPaths.colorsByRecordId);

            if (changedRecordIds) {
                // Checking isRecordMetadataLoaded fixes a timing issue:
                // When a new table loads in liveapp, we'll receive the record
                // colors before getting the response to our loadData call.
                // This is a temporary fix: we need a more general solution to
                // avoid processing events associated with subscriptions whose
                // data we haven't received yet.
                if (this.parentRecordStore.isRecordMetadataLoaded) {
                    for (const recordId of changedRecordIds) {
                        const record = this.parentRecordStore.getRecordByIdIfExists(recordId);
                        // Similar to above, we could be receiving the change notification
                        // for a record color before receiving the new record itself.
                        if (record) {
                            record.__triggerOnChangeForRecordColorInViewId(this.viewId);
                        }
                    }
                }
            }

            this._onChange(WatchableViewDataStoreKeys.recordColors, changedRecordIds);
        }
    }
}

/** @internal */
export default ViewDataStore;
