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
type WatchableViewKey = $Keys<typeof WatchableViewKeys>;

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
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, viewId: string) {
        super(baseData, viewId);

        this._parentTable = parentTable;

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
    async _loadDataAsync(): Promise<Array<WatchableViewKey>> {
        const [viewData] = await Promise.all([
            liveappInterface.fetchAndSubscribeToViewDataAsync(this.parentTable.id, this._id),
            this.parentTable.loadDataAsync(),
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
    _unloadData() {
        this.parentTable.unloadData();

        liveappInterface.unsubscribeFromViewData(this.parentTable.id, this._id);
        if (!this.isDeleted) {
            this._data.visibleRecordIds = undefined;
        }
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
