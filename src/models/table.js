// @flow
import invariant from 'invariant';
import {type RecordDef} from '../types/record';
import {type BaseData} from '../types/base';
import {type TableData} from '../types/table';
import {type ViewType, type ViewId} from '../types/view';
import {type FieldId} from '../types/field';
import {PermissionLevels} from '../types/permission_levels';
import {isEnumValue, entries, has} from '../private_utils';
import getSdk from '../get_sdk';
import {type AirtableInterface, type AirtableWriteAction} from '../injected/airtable_interface';
import AbstractModel from './abstract_model';
import View from './view';
import Field from './field';
import Record from './record';
import cellValueUtils from './cell_value_utils';
import type Base from './base';
import {type QueryResultOpts} from './query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import type RecordStore from './record_store';

const hyperId = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id');
const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);
const airtableUrls = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/airtable_urls',
);

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
export const WatchableTableKeys = Object.freeze({
    name: ('name': 'name'),
    views: ('views': 'views'),
    fields: ('fields': 'fields'),
});

export type WatchableTableKey = $Values<typeof WatchableTableKeys>;

/** Model class representing a table in the base. */
class Table extends AbstractModel<TableData, WatchableTableKey> {
    static _className = 'Table';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableTableKeys, key);
    }
    _parentBase: Base;
    _viewModelsById: {[string]: View};
    _fieldModelsById: {[string]: Field};
    _cachedFieldNamesById: {[string]: string} | null;
    _airtableInterface: AirtableInterface;
    _recordStore: RecordStore;

    constructor(
        baseData: BaseData,
        parentBase: Base,
        recordStore: RecordStore,
        tableId: string,
        airtableInterface: AirtableInterface,
    ) {
        super(baseData, tableId);

        this._parentBase = parentBase;
        this._recordStore = recordStore;
        this._viewModelsById = {}; // View instances are lazily created by getViewById.
        this._fieldModelsById = {}; // Field instances are lazily created by getFieldById.
        this._cachedFieldNamesById = null;

        this._airtableInterface = airtableInterface;

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): TableData | null {
        return this._baseData.tablesById[this._id] || null;
    }
    /** */
    get parentBase(): Base {
        return this._parentBase;
    }
    /** The table's name. Can be watched. */
    get name(): string {
        return this._data.name;
    }
    /** */
    get url(): string {
        return airtableUrls.getUrlForTable(this.id, {
            absolute: true,
        });
    }
    /**
     * Every table has exactly one primary field. The primary field of a table
     * will not change.
     */
    get primaryField(): Field {
        const primaryField = this.getFieldById(this._data.primaryFieldId);
        return primaryField;
    }
    /**
     * The fields in this table. The order is arbitrary, since fields are
     * only ordered in the context of a specific view.
     *
     * Can be watched to know when fields are created or deleted.
     */
    get fields(): Array<Field> {
        // TODO(kasra): is it confusing that this returns an array, since the order
        // is arbitrary?
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const fields = [];
        for (const fieldId of Object.keys(this._data.fieldsById)) {
            const field = this.getFieldById(fieldId);
            fields.push(field);
        }
        return fields;
    }
    /** */
    getFieldByIdIfExists(fieldId: FieldId): Field | null {
        if (!this._data.fieldsById[fieldId]) {
            return null;
        } else {
            if (!this._fieldModelsById[fieldId]) {
                this._fieldModelsById[fieldId] = new Field(this._baseData, this, fieldId);
            }
            return this._fieldModelsById[fieldId];
        }
    }
    getFieldById(fieldId: FieldId): Field {
        const field = this.getFieldByIdIfExists(fieldId);
        if (!field) {
            throw new Error(`No field with ID ${fieldId} in table ${this.id}`);
        }
        return field;
    }
    /** */
    getFieldByNameIfExists(fieldName: string): Field | null {
        for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
            if (fieldData.name === fieldName) {
                return this.getFieldByIdIfExists(fieldId);
            }
        }
        return null;
    }
    getFieldByName(fieldName: string): Field {
        const field = this.getFieldByNameIfExists(fieldName);
        if (!field) {
            throw new Error(`No field named ${fieldName} in table ${this.id}`);
        }
        return field;
    }
    /**
     * The views in the table. Can be watched to know when views are created,
     * deleted, or reordered.
     */
    get views(): Array<View> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const views = [];
        this._data.viewOrder.forEach(viewId => {
            const view = this.getViewById(viewId);
            views.push(view);
        });
        return views;
    }
    /** */
    getViewByIdIfExists(viewId: ViewId): View | null {
        if (!this._data.viewsById[viewId]) {
            return null;
        } else {
            if (!this._viewModelsById[viewId]) {
                this._viewModelsById[viewId] = new View(
                    this._baseData,
                    this,
                    this._recordStore.getViewDataStore(viewId),
                    viewId,
                );
            }
            return this._viewModelsById[viewId];
        }
    }
    getViewById(viewId: ViewId): View {
        const view = this.getViewByIdIfExists(viewId);
        if (!view) {
            throw new Error(`No view with ID ${viewId} in table ${this.id}`);
        }
        return view;
    }
    /** */
    getViewByNameIfExists(viewName: string): View | null {
        for (const [viewId, viewData] of entries(this._data.viewsById)) {
            if (viewData.name === viewName) {
                return this.getViewByIdIfExists(viewId);
            }
        }
        return null;
    }
    getViewByName(viewName: string): View {
        const view = this.getViewByNameIfExists(viewName);
        if (!view) {
            throw new Error(`No view named ${viewName} in table ${this.id}`);
        }
        return view;
    }
    /** */
    selectRecords(opts?: QueryResultOpts): TableOrViewQueryResult {
        return TableOrViewQueryResult.__createOrReuseQueryResult(
            this,
            this._recordStore,
            opts || {},
        );
    }

    /** Maximum number of records that the table can contain */
    get recordLimit(): number {
        return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
    }
    /** */
    canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {[string]: RecordDef}): boolean {
        // This takes the field and record IDs to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    setCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {
        [string]: RecordDef,
    }): AirtableWriteAction<void, {}> {
        if (this.isDeleted) {
            throw new Error('Table does not exist');
        }
        if (!this.canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName)) {
            throw new Error('Your permission level does not allow editing cell values');
        }

        const changes = [];
        const cellValuesByRecordIdThenFieldId = {};
        for (const [recordId, cellValuesByFieldIdOrFieldName] of entries(
            cellValuesByRecordIdThenFieldIdOrFieldName,
        )) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw new Error('Record does not exist');
            }

            cellValuesByRecordIdThenFieldId[recordId] = {};

            for (const [fieldIdOrFieldName, publicCellValue] of entries(
                cellValuesByFieldIdOrFieldName,
            )) {
                const field = this.__getFieldMatching(fieldIdOrFieldName);
                invariant(field, 'Field does not exist');
                invariant(!field.isDeleted, 'Field has been deleted');

                const currentPublicCellValue = record.getCellValue(field);
                const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                    publicCellValue,
                    currentPublicCellValue,
                    field,
                );
                if (!validationResult.isValid) {
                    throw new Error(validationResult.reason);
                }

                const normalizedCellValue = cellValueUtils.normalizePublicCellValueForUpdate(
                    publicCellValue,
                    field,
                );
                changes.push({
                    path: [
                        'tablesById',
                        this.id,
                        'recordsById',
                        recordId,
                        'cellValuesByFieldId',
                        field.id,
                    ],
                    value: normalizedCellValue,
                });

                cellValuesByRecordIdThenFieldId[recordId][field.id] = normalizedCellValue;
            }
        }

        getSdk().__applyModelChanges(changes);

        // Now send the update to Airtable.
        const completionPromise = this._airtableInterface.setCellValuesAsync(
            this.id,
            cellValuesByRecordIdThenFieldId,
        );
        return {
            completion: completionPromise,
        };
    }
    /** */
    canCreateRecord(cellValuesByFieldIdOrFieldName: ?RecordDef): boolean {
        return this.canCreateRecords(
            cellValuesByFieldIdOrFieldName ? [cellValuesByFieldIdOrFieldName] : 1,
        );
    }
    /** */
    createRecord(
        cellValuesByFieldIdOrFieldName: ?RecordDef,
    ): AirtableWriteAction<
        void,
        {
            record: Record,
        },
    > {
        const recordDef = cellValuesByFieldIdOrFieldName || {};
        const writeAction = this.createRecords([recordDef]);
        const records = writeAction.records;
        return {
            completion: writeAction.completion,
            record: records[0],
        };
    }
    /** */
    canCreateRecords(recordDefsOrNumberOfRecords: Array<RecordDef> | number): boolean {
        // This takes the field IDs to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    createRecords(
        recordDefsOrNumberOfRecords: Array<RecordDef> | number,
    ): AirtableWriteAction<
        void,
        {
            records: Array<Record>,
        },
    > {
        if (!this.canCreateRecords(recordDefsOrNumberOfRecords)) {
            throw new Error('Your permission level does not allow creating records');
        }

        // TODO: support creating records when only a record metadata or a
        // subset of fields are loaded.
        if (!this._recordStore.isDataLoaded) {
            throw new Error('Table data is not loaded');
        }

        let recordDefs;
        if (typeof recordDefsOrNumberOfRecords === 'number') {
            const numEmptyRecordsToCreate = recordDefsOrNumberOfRecords;
            recordDefs = [];
            for (let i = 0; i < numEmptyRecordsToCreate; i++) {
                recordDefs.push({});
            }
        } else {
            recordDefs = recordDefsOrNumberOfRecords;
        }

        if (this.recordLimit - this._recordStore.recordIds.length < recordDefs.length) {
            throw new Error(
                'Table over record limit. Check remainingRecordLimit before creating records.',
            );
        }

        const parsedRecordDefs = [];
        const recordIds = [];
        const changes = [];
        for (const recordDef of recordDefs) {
            const cellValuesByFieldId = {};
            for (const [fieldIdOrFieldName, cellValue] of entries(recordDef)) {
                const field = this.__getFieldMatching(fieldIdOrFieldName);
                invariant(field, `Field does not exist: ${fieldIdOrFieldName}`);
                invariant(!field.isDeleted, `Field has been deleted: ${fieldIdOrFieldName}`);

                // Current cell value is null since the record doesn't exist.
                const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                    cellValue,
                    null,
                    field,
                );
                if (!validationResult.isValid) {
                    throw new Error(validationResult.reason);
                }

                cellValuesByFieldId[field.id] = cellValueUtils.normalizePublicCellValueForUpdate(
                    cellValue,
                    field,
                );
            }
            const recordId = hyperId.generateRowId();
            const parsedRecordDef = {
                id: recordId,
                cellValuesByFieldId,
                commentCount: 0,
                createdTime: new Date().toJSON(),
            };
            parsedRecordDefs.push(parsedRecordDef);
            recordIds.push(recordId);

            changes.push({
                path: ['tablesById', this.id, 'recordsById', recordId],
                value: parsedRecordDef,
            });
        }

        for (const view of this.views) {
            const viewDataStore = this._recordStore.getViewDataStore(view.id);
            if (viewDataStore.isDataLoaded) {
                changes.push(
                    ...viewDataStore.__generateChangesForParentTableAddMultipleRecords(recordIds),
                );
            }
        }

        getSdk().__applyModelChanges(changes);

        const completionPromise = this._airtableInterface.createRecordsAsync(
            this.id,
            parsedRecordDefs,
        );

        const recordModels = recordIds.map(recordId => {
            const recordModel = this._recordStore.getRecordByIdIfExists(recordId);
            invariant(recordModel, 'Newly created record does not exist');
            return recordModel;
        });

        return {
            completion: completionPromise,
            records: recordModels,
        };
    }
    /** */
    canDeleteRecord(record: Record) {
        return this.canDeleteRecords([record]);
    }
    /** */
    deleteRecord(record: Record): AirtableWriteAction<void, {}> {
        return this.deleteRecords([record]);
    }
    /** */
    canDeleteRecords(records: Array<Record>) {
        // This takes the records to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    deleteRecords(records: Array<Record>): AirtableWriteAction<void, {}> {
        if (!this.canDeleteRecords(records)) {
            throw new Error('Your permission level does not allow deleting records');
        }

        // TODO: support deleting records when only a record metadata or a
        // subset of fields are loaded.
        if (!this._recordStore.isDataLoaded) {
            throw new Error('Table data is not loaded');
        }

        const recordIds = records.map(record => record.id);

        const changes = recordIds.map(recordId => {
            return {path: ['tablesById', this.id, 'recordsById', recordId], value: undefined};
        });

        for (const view of this.views) {
            const viewDataStore = this._recordStore.getViewDataStore(view.id);
            if (viewDataStore.isDataLoaded) {
                changes.push(
                    ...viewDataStore.__generateChangesForParentTableDeleteMultipleRecords(
                        recordIds,
                    ),
                );
            }
        }

        getSdk().__applyModelChanges(changes);

        const completionPromise = this._airtableInterface.deleteRecordsAsync(this.id, recordIds);
        return {
            completion: completionPromise,
        };
    }
    /**
     * Returns the first view in the table where the type is one of `allowedViewTypes`. If a
     * `preferredViewOrViewId` is supplied and that view exists & has the correct type, that view
     * will be returned before checking the other views in the table.
     */
    getFirstViewOfType(
        allowedViewTypes: Array<ViewType> | ViewType,
        preferredViewOrViewId?: View | ViewId | null,
    ): View | null {
        if (!Array.isArray(allowedViewTypes)) {
            allowedViewTypes = ([allowedViewTypes]: Array<ViewType>);
        }

        if (preferredViewOrViewId) {
            const preferredView = this.getViewByIdIfExists(
                typeof preferredViewOrViewId === 'string'
                    ? preferredViewOrViewId
                    : preferredViewOrViewId.id,
            );
            if (preferredView && allowedViewTypes.includes(preferredView.type)) {
                return preferredView;
            }
        }

        return (
            this.views.find(view => {
                return allowedViewTypes.includes(view.type);
            }) || null
        );
    }
    // Experimental, do not document yet. Allows fetching default cell values for
    // a table or view. Before documenting, we should explore making this synchronous.
    async getDefaultCellValuesByFieldIdAsync(opts?: {
        view?: View | null,
    }): Promise<{[string]: mixed}> {
        const viewId = opts && opts.view ? opts.view.id : null;
        const cellValuesByFieldId = await this._airtableInterface.fetchDefaultCellValuesByFieldIdAsync(
            this._id,
            viewId,
        );
        return cellValuesByFieldId;
    }

    __getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field | null {
        let field: Field | null;
        if (fieldOrFieldIdOrFieldName instanceof Field) {
            field = fieldOrFieldIdOrFieldName;
        } else {
            field =
                this.getFieldByIdIfExists(fieldOrFieldIdOrFieldName) ||
                this.getFieldByNameIfExists(fieldOrFieldIdOrFieldName);
        }
        return field;
    }
    __getViewMatching(viewOrViewIdOrViewName: View | string): View | null {
        let view: View | null;
        if (viewOrViewIdOrViewName instanceof View) {
            view = viewOrViewIdOrViewName;
        } else {
            view =
                this.getViewByIdIfExists(viewOrViewIdOrViewName) ||
                this.getViewByNameIfExists(viewOrViewIdOrViewName);
        }
        return view;
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object): boolean {
        let didTableSchemaChange = false;
        this._recordStore.triggerOnChangeForDirtyPaths(dirtyPaths);
        if (dirtyPaths.name) {
            this._onChange(WatchableTableKeys.name);
            didTableSchemaChange = true;
        }
        if (dirtyPaths.viewOrder) {
            this._onChange(WatchableTableKeys.views);
            didTableSchemaChange = true;

            // Clean up deleted views
            for (const [viewId, viewModel] of entries(this._viewModelsById)) {
                if (viewModel.isDeleted) {
                    delete this._viewModelsById[viewId];
                }
            }
        }
        if (dirtyPaths.viewsById) {
            for (const [viewId, dirtyViewPaths] of entries(dirtyPaths.viewsById)) {
                // Directly access from _viewModelsById to avoid creating
                // a view model if it doesn't already exist. If it doesn't exist,
                // nothing can be subscribed to any events on it.
                const view = this._viewModelsById[viewId];
                if (view) {
                    const didViewSchemaChange = view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);
                    if (didViewSchemaChange) {
                        didTableSchemaChange = true;
                    }
                }
            }
        }
        if (dirtyPaths.fieldsById) {
            // TODO: don't trigger schema change when autonumber typeOptions change.
            // That currently happens every time you create a row in a table with an
            // autonumber field.
            didTableSchemaChange = true;

            // Since tables don't have a field order, need to detect if a field
            // was created or deleted and trigger onChange for fields.
            const addedFieldIds = [];
            const removedFieldIds = [];
            for (const [fieldId, dirtyFieldPaths] of entries(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths._isDirty) {
                    // If the entire field is dirty, it was either created or deleted.
                    if (has(this._data.fieldsById, fieldId)) {
                        addedFieldIds.push(fieldId);
                    } else {
                        removedFieldIds.push(fieldId);

                        const fieldModel = this._fieldModelsById[fieldId];
                        if (fieldModel) {
                            // Remove the Field model if it was deleted.
                            delete this._fieldModelsById[fieldId];
                        }
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

            if (addedFieldIds.length > 0 || removedFieldIds.length > 0) {
                this._onChange(WatchableTableKeys.fields, {
                    addedFieldIds,
                    removedFieldIds,
                });
            }

            // Clear out cached field names in case a field was added/removed/renamed.
            this._cachedFieldNamesById = null;
        }
        return didTableSchemaChange;
    }
    __getFieldNamesById(): {[string]: string} {
        if (!this._cachedFieldNamesById) {
            const fieldNamesById = {};
            for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
                fieldNamesById[fieldId] = fieldData.name;
            }
            this._cachedFieldNamesById = fieldNamesById;
        }
        return this._cachedFieldNamesById;
    }
}

export default Table;
