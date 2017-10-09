// @flow
const invariant = require('invariant');
const utils = require('client/blocks/sdk/utils');
const AbstractModelWithAsyncData = require('client/blocks/sdk/models/abstract_model_with_async_data.js');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const viewTypeProvider = require('client_server_shared/view_types/view_type_provider');
const airtableUrls = require('client_server_shared/airtable_urls');

import type {BaseDataForBlocks, ViewDataForBlocks, BlockModelChange} from 'client/blocks/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';
import type FieldType from 'client/blocks/sdk/models/field';
import type RecordType from 'client/blocks/sdk/models/record';
import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableViewKeys = {
    name: 'name',
    visibleRecords: 'visibleRecords',
    visibleRecordIds: 'visibleRecordIds',
    allFields: 'allFields',
    visibleFields: 'visibleFields',
};
export type WatchableViewKey = $Keys<typeof WatchableViewKeys>;

class View extends AbstractModelWithAsyncData<ViewDataForBlocks, WatchableViewKey> {
    static _className = 'View';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableViewKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableViewKey): boolean {
        return key === WatchableViewKeys.visibleRecords ||
            key === WatchableViewKeys.visibleRecordIds ||
            key === WatchableViewKeys.allFields ||
            key === WatchableViewKeys.visibleFields;
    }
    _parentTable: TableType;
    _tableLoadPromises: Array<Promise<*>>;
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, viewId: string) {
        super(baseData, viewId);

        this._parentTable = parentTable;
        this._tableLoadPromises = [];

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): ViewDataForBlocks | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.viewsById[this._id] || null;
    }
    get isDataLoaded(): boolean {
        return this._isDataLoaded && this.parentTable.isDataLoaded;
    }
    get parentTable(): TableType {
        return this._parentTable;
    }
    get name(): string {
        return this._data.name;
    }
    get type(): ApiViewType {
        return viewTypeProvider.getApiViewType(this._data.type);
    }
    get url(): string {
        return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    async loadDataAsync() {
        // Override this method to also load table data.
        // NOTE: it's important that we call loadDataAsync on the table here and not in
        // _loadDataAsync since we want the retain counts for the view and table to increase/decrease
        // in lock-step. If we load table data in _loadDataAsync, the table's retain
        // count only increments some of the time, which leads to unexpected behavior.
        const tableLoadPromise = this.parentTable.loadDataAsync();
        this._tableLoadPromises.push(tableLoadPromise);

        await super.loadDataAsync();
    }
    async _loadDataAsync(): Promise<Array<WatchableViewKey>> {
        invariant(this._tableLoadPromises.length > 0, 'No table load promises');

        // We need to be sure that the table data is loaded *before* we return from this
        // method, so let's pop a promise off of the array and await it.
        // NOTE: if the array has multiple promises, we might not be awaiting the same
        // promise that we stored in the corresponding loadDataAsync call, but that
        // doesn't really matter, since we just care that the table data is loaded.
        const tableLoadPromise = this._tableLoadPromises.pop();

        const [viewData] = await Promise.all([
            liveappInterface.fetchAndSubscribeToViewDataAsync(this.parentTable.id, this._id),
            tableLoadPromise,
        ]);

        this._data.visibleRecordIds = viewData.visibleRecordIds;
        this._data.fieldOrder = viewData.fieldOrder;
        return [
            WatchableViewKeys.visibleRecords,
            WatchableViewKeys.visibleRecordIds,
            WatchableViewKeys.allFields,
            WatchableViewKeys.visibleFields,
        ];
    }
    unloadData() {
        // Override this method to also unload the table's data.
        // NOTE: it's important that we do this here, since we want the view and table's
        // retain counts to increment/decrement in lock-step. If we unload the table's
        // data in _unloadData, it leads to unexpected behavior.
        super.unloadData();
        this.parentTable.unloadData();
    }
    _unloadData() {
        liveappInterface.unsubscribeFromViewData(this.parentTable.id, this._id);
        if (!this.isDeleted) {
            this._data.visibleRecordIds = undefined;
        }
    }
    __generateChangesForParentTableAddMultipleRecords(recordIds: Array<string>): Array<BlockModelChange> {
        const newVisibleRecordIds = this.visibleRecordIds.concat(recordIds);
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
    get visibleRecords(): Array<RecordType> {
        const {parentTable} = this;
        invariant(parentTable.isDataLoaded, 'Table data is not loaded');

        const visibleRecordIds = this._data.visibleRecordIds;
        invariant(visibleRecordIds, 'View data is not loaded');

        return visibleRecordIds.map(recordId => {
            const record = parentTable.getRecordById(recordId);
            invariant(record, 'Record in view does not exist');
            return record;
        });
    }
    get allFields(): Array<FieldType> {
        const fieldOrder = this._data.fieldOrder;
        invariant(fieldOrder, 'View data is not loaded');
        return fieldOrder.fieldIds.map(fieldId => {
            const field = this.parentTable.getFieldById(fieldId);
            invariant(field, 'Field in view does not exist');
            return field;
        });
    }
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
    }
}

module.exports = View;
