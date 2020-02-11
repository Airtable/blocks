import {
    isEnumValue,
    ObjectValues,
    FlowAnyExistential,
    FlowAnyObject,
    has,
    ObjectMap,
} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import {BaseData, ModelChange} from '../types/base';
import {FieldId} from '../types/field';
import {ViewData, ViewId} from '../types/view';
import {RecordId} from '../types/record';
import {AirtableInterface} from '../injected/airtable_interface';
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

    constructor(
        baseData: BaseData,
        parentRecordStore: RecordStore,
        airtableInterface: AirtableInterface,
        viewId: ViewId,
    ) {
        super(baseData, `${viewId}-ViewDataStore`);
        this.parentRecordStore = parentRecordStore;
        this._airtableInterface = airtableInterface;
        this._mostRecentTableLoadPromise = null;
        this.viewId = viewId;
    }

    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentRecordStore.tableId];
        return tableData?.viewsById[this.viewId] ?? null;
    }

    _onChangeIsDataLoaded() {
    }

    get isDataLoaded(): boolean {
        return this._isDataLoaded && this.parentRecordStore.isRecordMetadataLoaded;
    }

    async loadDataAsync() {
        const tableLoadPromise = this.parentRecordStore.loadRecordMetadataAsync();
        this._mostRecentTableLoadPromise = tableLoadPromise;

        await super.loadDataAsync();
    }

    async _loadDataAsync(): Promise<Array<WatchableViewDataStoreKey>> {
        if (!this._mostRecentTableLoadPromise) {
            throw spawnInvariantViolationError('No table load promise');
        }
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
        if (!visibleRecordIds) {
            throw spawnInvariantViolationError('View data is not loaded');
        }

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
        if (!this.parentRecordStore.isRecordMetadataLoaded) {
            throw spawnInvariantViolationError('Table data is not loaded');
        }

        const visibleRecordIds = this._data.visibleRecordIds;
        if (!visibleRecordIds) {
            throw spawnInvariantViolationError('View data is not loaded');
        }

        return visibleRecordIds.map(recordId => {
            const record = this.parentRecordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw spawnInvariantViolationError('Record in view does not exist');
            }
            return record;
        });
    }

    /**
     * Get the color name for the specified record in this view, or null if no
     * color is available. Watch with 'recordColors'
     *
     * @param recordOrRecordId the record/record id to get the color for
     */
    getRecordColor(recordOrRecordId: RecordId | Record): Color | null {
        if (!this.isDataLoaded) {
            throw spawnInvariantViolationError('View data is not loaded');
        }

        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;

        return this._data.colorsByRecordId?.[recordId] ?? null;
    }

    get allFieldIds(): Array<FieldId> {
        const fieldOrder = this._data.fieldOrder;
        if (!fieldOrder) {
            throw spawnInvariantViolationError('View data is not loaded');
        }
        return fieldOrder.fieldIds;
    }

    get visibleFieldIds(): Array<FieldId> {
        const fieldOrder = this._data.fieldOrder;
        if (!fieldOrder) {
            throw spawnInvariantViolationError('View data is not loaded');
        }
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
            this._onChange(WatchableViewDataStoreKeys.visibleFieldIds);
        }
        if (dirtyPaths.colorsByRecordId) {
            const changedRecordIds = dirtyPaths.colorsByRecordId._isDirty
                ? null
                : Object.keys(dirtyPaths.colorsByRecordId);

            if (changedRecordIds) {
                if (this.parentRecordStore.isRecordMetadataLoaded) {
                    for (const recordId of changedRecordIds) {
                        const record = this.parentRecordStore.getRecordByIdIfExists(recordId);
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

export default ViewDataStore;
