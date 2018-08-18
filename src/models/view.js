// @flow
const invariant = require('invariant');
const utils = require('client/blocks/sdk/utils');
const AbstractModelWithAsyncData = require('client/blocks/sdk/models/abstract_model_with_async_data');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const ColorUtils = require('client/blocks/sdk/ui/color_utils');
const viewTypeProvider = require('client_server_shared/view_types/view_type_provider');
const airtableUrls = require('client_server_shared/airtable_urls');

import type {Color} from 'client_server_shared/types/view_config/color_config_obj';
import type {BaseDataForBlocks, ViewDataForBlocks, BlockModelChange} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';
import type FieldType from 'client/blocks/sdk/models/field';
import type RecordType from 'client/blocks/sdk/models/record';
import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';
import type QueryResultType, {QueryResultOpts} from 'client/blocks/sdk/models/query_result';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableViewKeys = {
    name: 'name',
    visibleRecords: 'visibleRecords',
    visibleRecordIds: 'visibleRecordIds',
    allFields: 'allFields',
    visibleFields: 'visibleFields',
    recordColors: 'recordColors',
};
export type WatchableViewKey = $Keys<typeof WatchableViewKeys>;

/** Model class representing a view in a table. */
class View extends AbstractModelWithAsyncData<ViewDataForBlocks, WatchableViewKey> {
    // Once all blocks that current set this flag to true are migrated,
    // remove this flag.
    static shouldLoadAllCellValuesForRecords = false;

    static _className = 'View';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableViewKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableViewKey): boolean {
        return key === WatchableViewKeys.visibleRecords ||
            key === WatchableViewKeys.visibleRecordIds ||
            key === WatchableViewKeys.allFields ||
            key === WatchableViewKeys.visibleFields ||
            key === WatchableViewKeys.recordColors;
    }
    _parentTable: TableType;
    _mostRecentTableLoadPromise: Promise<*> | null;
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, viewId: string) {
        super(baseData, viewId);

        this._parentTable = parentTable;
        this._mostRecentTableLoadPromise = null;

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): ViewDataForBlocks | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.viewsById[this._id] || null;
    }
    get _isRecordMetadataLoaded(): boolean {
        const parentTable = this.parentTable;
        const isParentTableLoaded = View.shouldLoadAllCellValuesForRecords ?
            parentTable.isDataLoaded :
            parentTable.isRecordMetadataLoaded;
        return isParentTableLoaded;
    }
    /** */
    get isDataLoaded(): boolean {
        return this._isDataLoaded && this._isRecordMetadataLoaded;
    }
    /** */
    get parentTable(): TableType {
        return this._parentTable;
    }
    /** The name of the view. Can be watched. */
    get name(): string {
        return this._data.name;
    }
    /** The type of the view. Will not change. */
    get type(): ApiViewType {
        return viewTypeProvider.getApiViewType(this._data.type);
    }
    /** */
    get url(): string {
        return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    /** */
    select(opts?: QueryResultOpts): QueryResultType {
        // require here to avoid circular import
        const QueryResult = require('client/blocks/sdk/models/query_result');
        return QueryResult.__createOrReuseQueryResult(this, opts || {});
    }
    async loadDataAsync() {
        // Override this method to also load table data.
        // NOTE: it's important that we call loadDataAsync on the table here and not in
        // _loadDataAsync since we want the retain counts for the view and table to increase/decrease
        // in lock-step. If we load table data in _loadDataAsync, the table's retain
        // count only increments some of the time, which leads to unexpected behavior.
        if (View.shouldLoadAllCellValuesForRecords) {
            // Legacy behavior.
            const tableLoadPromise = this.parentTable.loadDataAsync();
            this._mostRecentTableLoadPromise = tableLoadPromise;
        } else {
            const tableLoadPromise = this.parentTable.loadRecordMetadataAsync();
            this._mostRecentTableLoadPromise = tableLoadPromise;
        }

        await super.loadDataAsync();
    }
    async _loadDataAsync(): Promise<Array<WatchableViewKey>> {
        // We need to be sure that the table data is loaded *before* we return
        // from this method.
        invariant(this._mostRecentTableLoadPromise, 'No table load promise');
        const tableLoadPromise = this._mostRecentTableLoadPromise;

        const [viewData] = await Promise.all([
            liveappInterface.fetchAndSubscribeToViewDataAsync(this.parentTable.id, this._id),
            tableLoadPromise,
        ]);

        this._data.visibleRecordIds = viewData.visibleRecordIds;
        this._data.fieldOrder = viewData.fieldOrder;
        this._data.colorsByRecordId = viewData.colorsByRecordId;

        for (const record of this.visibleRecords) {
            if (this._data.colorsByRecordId[record.id]) {
                record.__triggerOnChangeForRecordColorInViewId(this.id);
            }
        }

        return [
            WatchableViewKeys.visibleRecords,
            WatchableViewKeys.visibleRecordIds,
            WatchableViewKeys.allFields,
            WatchableViewKeys.visibleFields,
            WatchableViewKeys.recordColors,
        ];
    }
    unloadData() {
        // Override this method to also unload the table's data.
        // NOTE: it's important that we do this here, since we want the view and table's
        // retain counts to increment/decrement in lock-step. If we unload the table's
        // data in _unloadData, it leads to unexpected behavior.
        super.unloadData();

        if (View.shouldLoadAllCellValuesForRecords) {
            // Legacy behavior.
            this.parentTable.unloadData();
        } else {
            this.parentTable.unloadRecordMetadata();
        }
    }
    _unloadData() {
        this._mostRecentTableLoadPromise = null;
        liveappInterface.unsubscribeFromViewData(this.parentTable.id, this._id);
        if (!this.isDeleted) {
            this._data.visibleRecordIds = undefined;
            this._data.colorsByRecordId = undefined;
        }
    }
    __generateChangesForParentTableAddMultipleRecords(recordIds: Array<string>): Array<BlockModelChange> {
        const newVisibleRecordIds = [...this.visibleRecordIds, ...recordIds];
        return [
            {path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'], value: newVisibleRecordIds},
        ];
    }
    __generateChangesForParentTableDeleteMultipleRecords(recordIds: Array<string>): Array<BlockModelChange> {
        const recordIdsToDeleteSet = {};
        for (const recordId of recordIds) {
            recordIdsToDeleteSet[recordId] = true;
        }
        const newVisibleRecordIds = this.visibleRecordIds.filter(recordId => {
            return !recordIdsToDeleteSet[recordId];
        });
        return [
            {path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'], value: newVisibleRecordIds},
        ];
    }
    /**
     * The record IDs that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */
    get visibleRecordIds(): Array<string> {
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
    get visibleRecords(): Array<RecordType> {
        const {parentTable} = this;
        invariant(this._isRecordMetadataLoaded, 'Table data is not loaded');

        const visibleRecordIds = this._data.visibleRecordIds;
        invariant(visibleRecordIds, 'View data is not loaded');

        return visibleRecordIds.map(recordId => {
            const record = parentTable.getRecordById(recordId);
            invariant(record, 'Record in view does not exist');
            return record;
        });
    }
    /**
     * All the fields in the table, including fields that are hidden in this
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */
    get allFields(): Array<FieldType> {
        const fieldOrder = this._data.fieldOrder;
        invariant(fieldOrder, 'View data is not loaded');
        return fieldOrder.fieldIds.map(fieldId => {
            const field = this.parentTable.getFieldById(fieldId);
            invariant(field, 'Field in view does not exist');
            return field;
        });
    }
    /**
     * The fields that are not hidden in this view.
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */
    get visibleFields(): Array<FieldType> {
        const fieldOrder = this._data.fieldOrder;
        invariant(fieldOrder, 'View data is not loaded');
        const {fieldIds} = fieldOrder;
        const visibleFields = [];
        for (let i = 0; i < fieldOrder.visibleFieldCount; i++) {
            const field = this.parentTable.getFieldById(fieldIds[i]);
            invariant(field, 'Field in view does not exist');
            visibleFields.push(field);
        }
        return visibleFields;
    }
    /**
     * Get the color name for the specified record in this view, or null if no
     * color is available. Watch with 'recordColors'
     */
    getRecordColor(recordOrRecordId: string | RecordType): Color | null {
        invariant(this.isDataLoaded, 'View data is not loaded');
        const colorsByRecordId = this._data.colorsByRecordId;
        if (!colorsByRecordId) {
            return null;
        }

        const recordId = typeof recordOrRecordId === 'string' ?
            recordOrRecordId :
            recordOrRecordId.id;
        const color = colorsByRecordId[recordId];
        return color || null;
    }
    /**
     * Get the CSS hex color for the specificed record in this view, or null if
     * no color is available. Watch with 'recordColors'
     */
    getRecordColorHex(recordOrRecordId: string | RecordType): string | null {
        const colorName = this.getRecordColor(recordOrRecordId);
        if (!colorName) {
            return null;
        }
        return ColorUtils.getHexForColor(colorName);
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (dirtyPaths.name) {
            this._onChange(WatchableViewKeys.name);
        }
        if (dirtyPaths.visibleRecordIds) {
            this._onChange(WatchableViewKeys.visibleRecords);
            this._onChange(WatchableViewKeys.visibleRecordIds);
        }
        if (dirtyPaths.fieldOrder) {
            this._onChange(WatchableViewKeys.allFields);
            // TODO(kasra): only trigger visibleFields if the *visible* field ids changed.
            this._onChange(WatchableViewKeys.visibleFields);
        }
        if (dirtyPaths.colorsByRecordId) {
            const changedRecordIds = dirtyPaths.colorsByRecordId._isDirty ?
                null :
                Object.keys(dirtyPaths.colorsByRecordId);

            if (changedRecordIds) {
                // Checking isRecordMetadataLoaded fixes a timing issue:
                // When a new table loads in liveapp, we'll receive the record
                // colors before getting the response to our loadData call.
                // This is a temporary fix: we need a more general solution to
                // avoid processing events associated with subscriptions whose
                // data we haven't received yet.
                if (this.parentTable.isRecordMetadataLoaded) {
                    for (const recordId of changedRecordIds) {
                        const record = this.parentTable.getRecordById(recordId);
                        invariant(record, 'record must exist');
                        record.__triggerOnChangeForRecordColorInViewId(this.id);
                    }
                }
            }

            this._onChange(WatchableViewKeys.recordColors, changedRecordIds);
        }
    }
}

module.exports = View;
