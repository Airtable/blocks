// @flow
import {isEnumValue} from '../private_utils';
import {invariant} from '../error_utils';
import {type BaseData, type ModelChange} from '../types/base';
import {type FieldId} from '../types/field';
import {type ViewData, type ViewId} from '../types/view';
import {type RecordId} from '../types/record';
import {type AirtableInterface} from '../injected/airtable_interface';
import {type Color} from '../colors';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import type RecordStore from './record_store';
import type Record from './record';

export const WatchableViewDataStoreKeys = Object.freeze({
    visibleRecords: ('visibleRecords': 'visibleRecords'),
    visibleRecordIds: ('visibleRecordIds': 'visibleRecordIds'),
    recordColors: ('recordColors': 'recordColors'),
    allFieldIds: ('allFieldIds': 'allFieldIds'),
    visibleFieldIds: ('visibleFieldIds': 'visibleFieldIds'),
});
export type WatchableViewDataStoreKey = $Values<typeof WatchableViewDataStoreKeys>;

/** @private */
class ViewDataStore extends AbstractModelWithAsyncData<ViewData, WatchableViewDataStoreKey> {
    static _className = 'ViewDataStore';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewDataStoreKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableViewDataStoreKey): boolean {
        return true;
    }

    +viewId: ViewId;
    +parentRecordStore: RecordStore;
    _mostRecentTableLoadPromise: Promise<*> | null;
    +_airtableInterface: AirtableInterface;

    constructor(
        baseData: BaseData,
        parentRecordStore: RecordStore,
        airtableInterface: AirtableInterface,
        viewId: ViewId,
    ) {
        super(baseData, `${viewId}-ViewDataStore`);
        this.parentRecordStore = parentRecordStore;
        this._airtableInterface = airtableInterface;
        this.viewId = viewId;
    }

    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentRecordStore.tableId];
        if (!tableData) {
            return null;
        }
        return tableData.viewsById[this.viewId] || null;
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

        for (const record of this.visibleRecords) {
            if (this._data.colorsByRecordId[record.id]) {
                record.__triggerOnChangeForRecordColorInViewId(this.viewId);
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
        recordIds: Array<RecordId>,
    ): Array<ModelChange> {
        const recordIdsToDeleteSet = {};
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
     */
    getRecordColor(recordOrRecordId: RecordId | Record): Color | null {
        invariant(this.isDataLoaded, 'View data is not loaded');
        const colorsByRecordId = this._data.colorsByRecordId;
        if (!colorsByRecordId) {
            return null;
        }

        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
        const color = colorsByRecordId[recordId];
        return color || null;
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

    triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
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
                        invariant(record, 'record must exist');
                        record.__triggerOnChangeForRecordColorInViewId(this.viewId);
                    }
                }
            }

            this._onChange(WatchableViewDataStoreKeys.recordColors, changedRecordIds);
        }
    }
}

export default ViewDataStore;
