import {
    isEnumValue,
    ObjectValues,
    FlowAnyExistential,
    FlowAnyObject,
    has,
    ObjectMap,
    cloneDeep,
} from '../private_utils';
import {invariant} from '../error_utils';
import {ModelChange} from '../types/base';
import Sdk from '../sdk';
import {FieldId} from '../types/field';
import {GroupData, GroupLevelData, ViewData, ViewId} from '../types/view';
import {RecordId} from '../types/record';
import {AirtableInterface} from '../types/airtable_interface';
import {Color} from '../colors';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import RecordStore from './record_store';
import Record from './record';

export const WatchableViewDataStoreKeys = Object.freeze({
    visibleRecords: 'visibleRecords' as const,
    visibleRecordIds: 'visibleRecordIds' as const,
    groups: 'groups' as const,
    groupLevels: 'groupLevels' as const,
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
    }

    get isDataLoaded(): boolean {
        return this._isDataLoaded && this.parentRecordStore.isRecordMetadataLoaded;
    }

    __onDataDeletion(): void {
        this._forceUnload();
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
        this._data.groups = viewData.groups;
        this._data.groupLevels = viewData.groupLevels;
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
            WatchableViewDataStoreKeys.groups,
            WatchableViewDataStoreKeys.groupLevels,
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
            this._data.groups = undefined;
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
        const newVisibleRecordIds = this.visibleRecordIds.filter(
            recordId => !recordIdsToDeleteSet[recordId],
        );

        const changePayload = [
            {
                path: [
                    'tablesById',
                    this.parentRecordStore.tableId,
                    'viewsById',
                    this.viewId,
                    'visibleRecordIds',
                ],
                value: newVisibleRecordIds as unknown,
            },
        ];

        if (this._data.groups) {
            const newGroups = this.__recursivelyRemoveRecordsFromGroupsInPlace(
                cloneDeep(this._data.groups),
                recordIdsToDeleteSet,
            );
            changePayload.push({
                path: [
                    'tablesById',
                    this.parentRecordStore.tableId,
                    'viewsById',
                    this.viewId,
                    'groups',
                ],
                value: newGroups,
            });
        }
        return changePayload;
    }

    __recursivelyRemoveRecordsFromGroupsInPlace(
        groups: Array<GroupData> | null,
        recordIdsToDeleteSet: ObjectMap<RecordId, true>,
    ) {
        if (!groups || groups.length === 0) {
            return groups;
        }

        return groups.map(group => {
            if (group.visibleRecordIds) {
                group.visibleRecordIds = group.visibleRecordIds.filter(
                    id => !recordIdsToDeleteSet[id],
                );
            }
            this.__recursivelyRemoveRecordsFromGroupsInPlace(group.groups, recordIdsToDeleteSet);
            return group;
        });
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
     * Gets the groups in a view, can be watched to be notified if a record changes groups,
     * if a record is changed/deleted/created, if sort order of groups changes, grouping
     * heirarchy changes, or grouping field changes.
     *
     * @hidden
     */
    get groups(): Array<GroupData> | null {
        invariant(this.parentRecordStore.isRecordMetadataLoaded, 'Table data is not loaded');

        const groups = this._data.groups;
        return groups ?? null;
    }

    /**
     * Gets the group config for this view, can be watched to know when groupLevels
     * changes (reorder, groups deleted, groups changed, grouped field changes)
     */
    get groupLevels(): Array<GroupLevelData> | null {
        invariant(this.parentRecordStore.isRecordMetadataLoaded, 'Table data is not loaded');

        const groupLevels = this._data.groupLevels;
        return groupLevels ?? null;
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
            this._onChange(WatchableViewDataStoreKeys.visibleFieldIds);
        }
        if (dirtyPaths.groups || dirtyPaths.groupLevels) {
            this._onChange(WatchableViewDataStoreKeys.groups);
        }
        if (dirtyPaths.groupLevels) {
            this._onChange(WatchableViewDataStoreKeys.groupLevels);
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

/** @internal */
export default ViewDataStore;
