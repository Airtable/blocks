// @flow
const invariant = require('invariant');
const utils = require('client/blocks/sdk/utils');
const AbstractModelWithAsyncData = require('client/blocks/sdk/models/abstract_model_with_async_data.js');
const View = require('client/blocks/sdk/models/view');
const Field = require('client/blocks/sdk/models/field');
const Record = require('client/blocks/sdk/models/record');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');

import type {BaseDataForBlocks, TableDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type BaseType from 'client/blocks/sdk/models/base';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableTableKeys = {
    name: 'name',
    activeView: 'activeView',
    views: 'views',
    fields: 'fields',
    records: 'records',
    recordIds: 'recordIds',
    // TODO(kasra): these keys don't have matching getters (not that they should
    // it's just inconsistent...)
    cellValues: 'cellValues',
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';
// The string case is to accomodate cellValuesInField:$FieldId.
// It may also be useful to have cellValuesInView:$ViewId...
type WatchableTableKey = $Keys<typeof WatchableTableKeys> | string;

class Table extends AbstractModelWithAsyncData<TableDataForBlocks, WatchableTableKey> {
    static _className = 'Table';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableTableKeys, key) ||
            utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix);
    }
    static _shouldLoadDataForKey(key: WatchableTableKey): boolean {
        return key === WatchableTableKeys.records ||
            key === WatchableTableKeys.recordIds ||
            key === WatchableTableKeys.cellValues ||
            utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix);
    }
    _parentBase: BaseType;
    _viewModelsById: {[key: string]: View};
    _fieldModelsById: {[key: string]: Field};
    _recordModelsById: {[key: string]: Record};
    _cachedFieldNamesById: {[key: string]: string} | null;
    constructor(baseData: BaseDataForBlocks, parentBase: BaseType, tableId: string) {
        super(baseData, tableId);

        this._parentBase = parentBase;
        this._viewModelsById = {}; // View instances are lazily created by getViewById.
        this._fieldModelsById = {}; // Field instances are lazily created by getFieldById.
        this._recordModelsById = {}; // Record instances are lazily created by getRecordById.
        this._cachedFieldNamesById = null;

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): TableDataForBlocks | null {
        return this._baseData.tablesById[this._id] || null;
    }
    get parentBase(): BaseType {
        return this._parentBase;
    }
    get name(): string {
        return this._data.name;
    }
    get primaryField(): Field {
        const primaryField = this.getFieldById(this._data.primaryFieldId);
        invariant(primaryField, 'no primary field');
        return primaryField;
    }
    get fields(): Array<Field> {
        // TODO(kasra): is it confusing that this returns an array, since the order
        // is arbitrary?
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const fields = [];
        for (const fieldId of utils.iterateKeys(this._data.fieldsById)) {
            const field = this.getFieldById(fieldId);
            invariant(field, 'no field model' + fieldId);
            fields.push(field);
        }
        return fields;
    }
    getFieldById(fieldId: string): Field | null {
        if (!this._data.fieldsById[fieldId]) {
            return null;
        } else {
            if (!this._fieldModelsById[fieldId]) {
                this._fieldModelsById[fieldId] = new Field(this._baseData, this, fieldId);
            }
            return this._fieldModelsById[fieldId];
        }
    }
    getFieldByName(fieldName: string): Field | null {
        for (const [fieldData, fieldId] of utils.iterate(this._data.fieldsById)) {
            if (fieldData.name === fieldName) {
                return this.getFieldById(fieldId);
            }
        }
        return null;
    }
    get activeView(): View | null {
        const {activeViewId} = this._data;
        return activeViewId ? this.getViewById(activeViewId) : null;
    }
    get views(): Array<View> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const views = [];
        this._data.viewOrder.forEach(viewId => {
            const view = this.getViewById(viewId);
            invariant(view, 'no view matching id in view order');
            views.push(view);
        });
        return views;
    }
    getViewById(viewId: string): View | null {
        if (!this._data.viewsById[viewId]) {
            return null;
        } else {
            if (!this._viewModelsById[viewId]) {
                this._viewModelsById[viewId] = new View(this._baseData, this, viewId);
            }
            return this._viewModelsById[viewId];
        }
    }
    getViewByName(viewName: string): View | null {
        for (const [viewData, viewId] of utils.iterate(this._data.viewsById)) {
            if (viewData.name === viewName) {
                return this.getViewById(viewId);
            }
        }
        return null;
    }
    get records(): Array<Record> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Table data is not loaded');
        const records = Object.keys(recordsById).map(recordId => {
            const record = this.getRecordById(recordId);
            invariant(record, 'record');
            return record;
        });
        return records;
    }
    get recordIds(): Array<string> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Table data is not loaded');
        return Object.keys(recordsById);
    }
    getRecordById(recordId: string): Record | null {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Table data is not loaded');

        if (!recordsById[recordId]) {
            return null;
        } else {
            if (!this._recordModelsById[recordId]) {
                this._recordModelsById[recordId] = new Record(this._baseData, this, recordId);
            }
            return this._recordModelsById[recordId];
        }
    }
    async _loadDataAsync(): Promise<Array<WatchableTableKey>> {
        const tableData = await liveappInterface.fetchAndSubscribeToTableDataAsync(this._id);
        this._data.recordsById = tableData.recordsById;

        const changedKeys = [
            WatchableTableKeys.records,
            WatchableTableKeys.recordIds,
            WatchableTableKeys.cellValues,
        ];

        for (const fieldId of Object.keys(this._data.fieldsById)) {
            changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
    _unloadData() {
        liveappInterface.unsubscribeFromTableData(this._id);
        if (!this.isDeleted) {
            this._data.recordsById = undefined;
        }
        this._recordModelsById = {};
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (dirtyPaths.name) {
            this._onChange(WatchableTableKeys.name);
        }
        if (dirtyPaths.activeViewId) {
            this._onChange(WatchableTableKeys.activeView);
        }
        if (dirtyPaths.viewOrder) {
            this._onChange(WatchableTableKeys.views);

            // Clean up deleted views
            for (const [viewModel, viewId] of utils.iterate(this._viewModelsById)) {
                if (viewModel.isDeleted) {
                    delete this._viewModelsById[viewId];
                }
            }
        }
        if (dirtyPaths.viewsById) {
            for (const [dirtyViewPaths, viewId] of utils.iterate(dirtyPaths.viewsById)) {
                // Directly access from _viewModelsById to avoid creating
                // a view model if it doesn't already exist. If it doesn't exist,
                // nothing can be subscribed to any events on it.
                const view = this._viewModelsById[viewId];
                if (view) {
                    view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);
                }
            }
        }
        if (dirtyPaths.fieldsById) {
            // Since tables don't have a field order, need to detect if a field
            // was created or deleted and trigger onChange for fields.
            let didFieldsChange = false;
            for (const [dirtyFieldPaths, fieldId] of utils.iterate(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths._isDirty) {
                    // If the entire field is dirty, it was either created or deleted.
                    if (!didFieldsChange) {
                        // We only want to trigger onChange of fields once, even
                        // if multiple fields were created or deleted.
                        didFieldsChange = true;
                        this._onChange(WatchableTableKeys.fields);
                    }
                } else {
                    // Directly access from _fieldModelsById to avoid creating
                    // a field model if it doesn't already exist. If it doesn't exist,
                    // nothing can be subscribed to any events on it.
                    const field = this._fieldModelsById[fieldId];
                    if (field) {
                        field.__triggerOnChangeForDirtyPaths(dirtyFieldPaths);
                    }
                }
            }

            if (didFieldsChange) {
                // Clean up deleted fields
                for (const [fieldModel, fieldId] of utils.iterate(this._fieldModelsById)) {
                    if (fieldModel.isDeleted) {
                        delete this._fieldModelsById[fieldId];
                    }
                }
            }

            // Clear out cached field names in case a field was added/removed/renamed.
            this._cachedFieldNamesById = null;
        }
        if (this.isDataLoaded && dirtyPaths.recordsById) {
            // Since tables don't have a record order, need to detect if a record
            // was created or deleted and trigger onChange for records.
            const dirtyFieldIdsSet = {};
            let didRecordsChange = false;
            for (const [dirtyRecordPaths, recordId] of utils.iterate(dirtyPaths.recordsById)) {
                if (dirtyRecordPaths._isDirty) {
                    // If the entire record is dirty, it was either created or deleted.
                    if (!didRecordsChange) {
                        // We only want to trigger onChange of records once, even
                        // if multiple records were created or deleted.
                        didRecordsChange = true;
                        this._onChange(WatchableTableKeys.records);
                    }

                    // Remove the Record model if it was deleted.
                    const recordModel = this._recordModelsById[recordId];
                    if (recordModel && recordModel.isDeleted) {
                        delete this._recordModelsById[recordId];
                    }
                } else if (dirtyRecordPaths.cellValuesByFieldId) {
                    const recordModel = this._recordModelsById[recordId];
                    if (recordModel) {
                        recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
                    }
                }

                const {cellValuesByFieldId} = dirtyRecordPaths;
                if (cellValuesByFieldId) {
                    for (const fieldId of utils.iterateKeys(cellValuesByFieldId)) {
                        dirtyFieldIdsSet[fieldId] = true;
                    }
                }
            }

            // NOTE: this is an experimental (and somewhat messy) way to watch
            // for changes to cells in a table, as an alternative to implementing
            // full event bubbling. For now, it unblocks the things we want to
            // build, but we may replace it.
            // If we keep it, could be more efficient by not calling _onChange
            // if there are no subscribers.
            const fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
            const recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));
            this._onChange(WatchableTableKeys.cellValues, {
                recordIds,
                fieldIds,
            });
            for (const fieldId of fieldIds) {
                this._onChange(WatchableCellValuesInFieldKeyPrefix + fieldId, recordIds);
            }
        }
    }
    __getFieldNamesById(): {[key: string]: string} {
        if (!this._cachedFieldNamesById) {
            const fieldNamesById = {};
            for (const [fieldData, fieldId] of utils.iterate(this._data.fieldsById)) {
                fieldNamesById[fieldId] = fieldData.name;
            }
            this._cachedFieldNamesById = fieldNamesById;
        }
        return this._cachedFieldNamesById;
    }
}

module.exports = Table;
