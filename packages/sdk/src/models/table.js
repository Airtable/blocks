// @flow
import {type RecordDef} from '../types/record';
import {type BaseData} from '../types/base';
import {type TableData} from '../types/table';
import {type ViewType, type ViewId} from '../types/view';
import {type FieldId} from '../types/field';
import {PermissionLevels} from '../types/permission_levels';
import {isEnumValue, entries, has} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import getSdk from '../get_sdk';
import {type AirtableInterface, type AirtableWriteAction} from '../injected/airtable_interface';
import AbstractModel from './abstract_model';
import View from './view';
import Field from './field';
import Record from './record';
import cellValueUtils from './cell_value_utils';
import type Base from './base';
import {type RecordQueryResultOpts} from './record_query_result';
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

export const WatchableTableKeys = Object.freeze({
    name: ('name': 'name'),
    views: ('views': 'views'),
    fields: ('fields': 'fields'),
});

export type WatchableTableKey = $Values<typeof WatchableTableKeys>;

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 */
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

    /**
     * @hideconstructor
     */
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
        this._viewModelsById = {}; 
        this._fieldModelsById = {}; 
        this._cachedFieldNamesById = null;

        this._airtableInterface = airtableInterface;

        Object.seal(this);
    }

    /**
     * @function id
     * @memberof Table
     * @instance
     * @returns {string} This table's ID.
     * @example
     * console.log(myTable.id);
     * // => 'tblxxxxxxxxxxxxxx'
     */

    /**
     * True if this table has been deleted.
     *
     * In general, it's best to avoid keeping a reference to a table past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted table (other than its ID) will throw. But if you do keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * table's data.
     *
     * @function isDeleted
     * @memberof Table
     * @instance
     * @returns {boolean} `true` if the table has been deleted, `false` otherwise.
     * @example
     * if (!myTable.isDeleted) {
     *     // Do things with myTable
     * }
     */

    /**
     * Get notified of changes to the table.
     *
     * Watchable keys are:
     * - `'name'`
     * - `'views'`
     * - `'fields'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof Table
     * @instance
     * @param {(WatchableTableKey|Array<WatchableTableKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {Object?} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableTableKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof Table
     * @instance
     * @param {(WatchableTableKey|Array<WatchableTableKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableTableKey>} the array of keys that were unwatched
     */

    /**
     * @private
     */
    get _dataOrNullIfDeleted(): TableData | null {
        return this._baseData.tablesById[this._id] || null;
    }
    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * @function
     * @returns The base that this table belongs to.
     *
     * @example
     * import {base} from '@airtable/blocks';
     * const table = base.getTableByName('Table 1');
     * console.log(table.parentBase.id === base.id);
     * // => true
     */
    get parentBase(): Base {
        return this._parentBase;
    }
    /**
     * @function
     * @returns The name of the table. Can be watched.
     * @example
     * console.log(myTable.name);
     * // => 'Table 1'
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * @function
     * @returns The URL for the table. You can visit this URL in the browser to be taken to the table in the Airtable UI.
     * @example
     * console.log(myTable.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx'
     */
    get url(): string {
        return airtableUrls.getUrlForTable(this.id, {
            absolute: true,
        });
    }
    /**
     * @function
     * @returns The table's primary field. Every table has exactly one primary
     * field. The primary field of a table will not change.
     * @example
     * console.log(myTable.primaryField.name);
     * // => 'Name'
     */
    get primaryField(): Field {
        const primaryField = this.getFieldById(this._data.primaryFieldId);
        return primaryField;
    }
    /**
     * @function
     * @returns The fields in this table. The order is arbitrary, since fields are
     * only ordered in the context of a specific view.
     *
     * Can be watched to know when fields are created or deleted.
     * @example
     * console.log(`This table has ${myTable.fields.length} fields`);
     */
    get fields(): Array<Field> {
        const fields = [];
        for (const fieldId of Object.keys(this._data.fieldsById)) {
            const field = this.getFieldById(fieldId);
            fields.push(field);
        }
        return fields;
    }
    /**
     * @param fieldId The ID of the field.
     * @returns The field matching the given ID, or `null` if that field does not exist in this table.
     * @example
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldByIdIfExists(fieldId);
     * if (field !== null) {
     *     console.log(field.name);
     * } else {
     *     console.log('No field exists with that ID');
     * }
     */
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
    /**
     * @param fieldId The ID of the field.
     * @returns The field matching the given ID. Throws if that field does not exist in this table. Use {@link Table#getFieldByIdIfExists} instead if you are unsure whether a field exists with the given ID.
     * @example
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldById(fieldId);
     * console.log(field.name);
     * // => 'Name'
     */
    getFieldById(fieldId: FieldId): Field {
        const field = this.getFieldByIdIfExists(fieldId);
        if (!field) {
            throw spawnError('No field with ID %s in table %s', fieldId, this.id);
        }
        return field;
    }
    /**
     * @param fieldName The name of the field you're looking for.
     * @returns The field matching the given name, or `null` if no field exists with that name in this table.
     * @example
     * const field = myTable.getFieldByNameIfExists('Name');
     * if (field !== null) {
     *     console.log(field.id);
     * } else {
     *     console.log('No field exists with that name');
     * }
     */
    getFieldByNameIfExists(fieldName: string): Field | null {
        for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
            if (fieldData.name === fieldName) {
                return this.getFieldByIdIfExists(fieldId);
            }
        }
        return null;
    }
    /**
     * @param fieldName The name of the field you're looking for.
     * @returns The field matching the given name. Throws if no field exists with that name in this table. Use {@link Table#getFieldByNameIfExists} instead if you are unsure whether a field exists with the given name.
     * @example
     * const field = myTable.getFieldByName('Name');
     * console.log(field.id);
     * // => 'fldxxxxxxxxxxxxxx'
     */
    getFieldByName(fieldName: string): Field {
        const field = this.getFieldByNameIfExists(fieldName);
        if (!field) {
            throw spawnError('No field named %s in table %s', fieldName, this.id);
        }
        return field;
    }
    /**
     * @function
     * @returns The views in this table. Can be watched to know when views are created,
     * deleted, or reordered.
     * @example
     * console.log(`This table has ${myTable.views.length} views`);
     */
    get views(): Array<View> {
        const views = [];
        this._data.viewOrder.forEach(viewId => {
            const view = this.getViewById(viewId);
            views.push(view);
        });
        return views;
    }
    /**
     * @param viewId The ID of the view.
     * @returns The view matching the given ID, or `null` if that view does not exist in this table.
     * @example
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewByIdIfExists(viewId);
     * if (view !== null) {
     *     console.log(view.name);
     * } else {
     *     console.log('No view exists with that ID');
     * }
     */
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
    /**
     * @param viewId The ID of the view.
     * @returns The view matching the given ID. Throws if that view does not exist in this table. Use {@link Table#getViewByIdIfExists} instead if you are unsure whether a view exists with the given ID.
     * @example
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewById(viewId);
     * console.log(view.name);
     * // => 'Grid view'
     */
    getViewById(viewId: ViewId): View {
        const view = this.getViewByIdIfExists(viewId);
        if (!view) {
            throw spawnError('No view with ID %s in table %s', viewId, this.id);
        }
        return view;
    }
    /**
     * @param viewName The name of the view you're looking for.
     * @returns The view matching the given name, or `null` if no view exists with that name in this table.
     * @example
     * const view = myTable.getViewByNameIfExists('Name');
     * if (view !== null) {
     *     console.log(view.id);
     * } else {
     *     console.log('No view exists with that name');
     * }
     */
    getViewByNameIfExists(viewName: string): View | null {
        for (const [viewId, viewData] of entries(this._data.viewsById)) {
            if (viewData.name === viewName) {
                return this.getViewByIdIfExists(viewId);
            }
        }
        return null;
    }
    /**
     * @param viewName The name of the view you're looking for.
     * @returns The view matching the given name. Throws if no view exists with that name in this table. Use {@link Table#getViewByNameIfExists} instead if you are unsure whether a view exists with the given name.
     * @example
     * const view = myTable.getViewByName('Name');
     * console.log(view.id);
     * // => 'viwxxxxxxxxxxxxxx'
     */
    getViewByName(viewName: string): View {
        const view = this.getViewByNameIfExists(viewName);
        if (!view) {
            throw spawnError('No view named %s in table %', viewName, this.id);
        }
        return view;
    }
    /**
     * Select records from the table. Returns a query result. See {@link RecordQueryResult} for more.
     *
     * @param [opts={}] Options for the query, such as sorts and fields.
     * @returns A query result.
     * @example
     * import {UI} from '@airtable/blocks';
     * import React from 'react';
     *
     * function TodoList() {
     *     const base = UI.useBase();
     *     const table = base.getTableByName('Tasks');
     *
     *     const queryResult = table.selectRecords();
     *     const records = UI.useRecords(queryResult);
     *
     *     return (
     *         <ul>
     *             {records.map(record => (
     *                 <li key={record.id}>
     *                     {record.primaryCellValueAsString || 'Unnamed record'}
     *                 </li>
     *             ))}
     *         </ul>
     *     );
     * }
     */
    selectRecords(opts?: RecordQueryResultOpts): TableOrViewQueryResult {
        return TableOrViewQueryResult.__createOrReuseQueryResult(
            this,
            this._recordStore,
            opts || {},
        );
    }

    /**
     * @function
     * @private (not documenting, since this should really be part of the canCreateRecords check)
     * @returns The maximum number of records that the table can contain.
     */
    get recordLimit(): number {
        return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
    }
    /**
     * @private (since we're not documenting write operations)
     * Use this to check whether the current user can update a set of cell values. Should be
     * called before calling {@link setCellValues}.
     *
     * @param {object.<RecordId, object.<(FieldId|string), CellValue>>} cellValuesByRecordIdThenFieldIdOrFieldName The cell values to set.
     * @returns `true` if the current user can set the given cell values, `false` otherwise.
     * @example
     * const cellValuesByRecordIdThenFieldId = {
     *     [record1.id]: {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     [record2.id]: {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * };
     * if (myTable.canSetCellValues(cellValuesByRecordIdThenFieldId)) {
     *     myTable.setCellValues(cellValuesByRecordIdThenFieldId);
     * }
     */
    canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {[string]: RecordDef}): boolean {
        const {session} = getSdk();
        return permissionHelpers.can(session.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /**
     * @private (since we're not documenting write operations)
     * Sets cell values.
     *
     * Throws if the current user cannot update all of the given cell values. Call
     * {@link canSetCellValues} before calling this to check whether the current user
     * can perform the given updates.
     *
     * @param {object.<RecordId, object.<(FieldId|string), CellValue>>} cellValuesByRecordIdThenFieldIdOrFieldName The cell values to set.
     * @returns {{}}
     * @example
     * const cellValuesByRecordIdThenFieldId = {
     *     [record1.id]: {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     [record2.id]: {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * };
     * if (myTable.canSetCellValues(cellValuesByRecordIdThenFieldId)) {
     *     myTable.setCellValues(cellValuesByRecordIdThenFieldId);
     * }
     */
    setCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {
        [string]: RecordDef,
    }): AirtableWriteAction<void, {}> {
        if (this.isDeleted) {
            throw spawnError('Table does not exist');
        }
        if (!this.canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName)) {
            throw spawnError('Your permission level does not allow editing cell values');
        }

        const changes = [];
        const cellValuesByRecordIdThenFieldId = {};
        for (const [recordId, cellValuesByFieldIdOrFieldName] of entries(
            cellValuesByRecordIdThenFieldIdOrFieldName,
        )) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw spawnError('Record does not exist');
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
                    throw spawnError(validationResult.reason);
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

        const completionPromise = this._airtableInterface.setCellValuesAsync(
            this.id,
            cellValuesByRecordIdThenFieldId,
        );
        return {
            completion: completionPromise,
        };
    }
    /**
     * @private (since we're not documenting write operations)
     * Use this to check whether the current user can create a record. Should be
     * called before calling {@link createRecord}.
     *
     * @param {(object.<(FieldId|string), CellValue>)?} cellValuesByFieldIdOrFieldName The record to create. If nothing is supplied, this will check whether the current user can create a single, empty record.
     * @returns `true` if the current user can create the given record, `false` otherwise.
     * @example
     * const recordDef = {
     *     [mySingleLineTextField.id]: 'new cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myTable.canCreateRecord(recordDef)) {
     *     const {record} = myTable.createRecord(recordDef);
     *     console.log(record.id);
     * }
     *
     * @example
     * if (myTable.canCreateRecord()) {
     *     const {record} = myTable.createRecord();
     *     console.log(record.id);
     * }
     */
    canCreateRecord(cellValuesByFieldIdOrFieldName: ?RecordDef): boolean {
        return this.canCreateRecords(
            cellValuesByFieldIdOrFieldName ? [cellValuesByFieldIdOrFieldName] : 1,
        );
    }
    /**
     * @private (since we're not documenting write operations)
     * Creates a record in the table.
     *
     * Throws if the current user cannot create the given record. Call {@link canCreateRecord}
     * before calling this to check whether the current user can create the given record.
     *
     * @param {(object.<(FieldId|string), CellValue>)?} cellValuesByFieldIdOrFieldName The record to create. If nothing is supplied, this will create a single, empty record.
     * @returns {{record: Record}} An object with the optimistically-created record.
     * @example
     * const recordDef = {
     *     [mySingleLineTextField.id]: 'new cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myTable.canCreateRecord(recordDef)) {
     *     const {record} = myTable.createRecord(recordDef);
     *     console.log(record.id);
     * }
     *
     * @example
     * if (myTable.canCreateRecord()) {
     *     const {record} = myTable.createRecord();
     *     console.log(record.id);
     * }
     */
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
    /**
     * @private (since we're not documenting write operations)
     * Use this to check whether the current user can create records. Should be
     * called before calling {@link createRecords}.
     *
     * @param {(Array<object.<(FieldId|string), CellValue>>|number)} recordDefsOrNumberOfRecords The records to create, or a number of empty records to create.
     * @returns `true` if the current user can create the given records, `false` otherwise.
     * @example
     * const recordDefs = [
     *     {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * ];
     * if (myTable.canCreateRecords(recordDefs)) {
     *     const {records} = myTable.createRecords(recordDefs);
     *     console.log(`Created ${records.length} records`);
     * }
     *
     * @example
     * const numRecordsToCreate = 10;
     * if (myTable.canCreateRecords(numRecordsToCreate)) {
     *     const {records} = myTable.createRecords(numRecordsToCreate);
     *     console.log(`Created ${records.length} records`);
     * }
     */
    canCreateRecords(recordDefsOrNumberOfRecords: Array<RecordDef> | number): boolean {
        const {session} = getSdk();
        return permissionHelpers.can(session.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /**
     * @private (since we're not documenting write operations)
     * Creates records in the table.
     *
     * Throws if the current user cannot create the given records. Call {@link canCreateRecords}
     * before calling this to check whether the current user can create the given records.
     *
     * @param {(Array<object.<(FieldId|string), CellValue>>|number)} recordDefsOrNumberOfRecords The records to create, or a number of empty records to create.
     * @returns {{records: Array<Record>}} An object with the optimistically-created records.
     * @example
     * const recordDefs = [
     *     {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * ];
     * if (myTable.canCreateRecords(recordDefs)) {
     *     const {records} = myTable.createRecords(recordDefs);
     *     console.log(`Created ${records.length} records`);
     * }
     *
     * @example
     * const numRecordsToCreate = 10;
     * if (myTable.canCreateRecords(numRecordsToCreate)) {
     *     const {records} = myTable.createRecords(numRecordsToCreate);
     *     console.log(`Created ${records.length} records`);
     * }
     */
    createRecords(
        recordDefsOrNumberOfRecords: Array<RecordDef> | number,
    ): AirtableWriteAction<
        void,
        {
            records: Array<Record>,
        },
    > {
        if (!this.canCreateRecords(recordDefsOrNumberOfRecords)) {
            throw spawnError('Your permission level does not allow creating records');
        }

        if (!this._recordStore.isDataLoaded) {
            throw spawnError('Table data is not loaded');
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
            throw spawnError(
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
                invariant(field, 'Field does not exist: %s', fieldIdOrFieldName);
                invariant(!field.isDeleted, 'Field has been deleted: %s', fieldIdOrFieldName);

                const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                    cellValue,
                    null,
                    field,
                );
                if (!validationResult.isValid) {
                    throw spawnError(validationResult.reason);
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
    /**
     * @private (since we're not documenting write operations)
     * Use this to check whether the current user can delete a record. Should be
     * called before calling {@link deleteRecord}.
     *
     * @param record The record to delete.
     * @returns `true` if the current user can delete the given record, `false` otherwise.
     * @example
     * if (myTable.canDeleteRecord(myRecord)) {
     *     myTable.deleteRecord(myRecord);
     * }
     */
    canDeleteRecord(record: Record): boolean {
        return this.canDeleteRecords([record]);
    }
    /**
     * @private (since we're not documenting write operations)
     * Deletes a record.
     *
     * Throws if the current user cannot delete the given record. Call {@link canDeleteRecord}
     * before calling this to check whether the current user can delete the given record.
     *
     * @param record The record to delete.
     * @returns {{}}
     * @example
     * if (myTable.canDeleteRecord(myRecord)) {
     *     myTable.deleteRecord(myRecord);
     * }
     */
    deleteRecord(record: Record): AirtableWriteAction<void, {}> {
        return this.deleteRecords([record]);
    }
    /**
     * @private (since we're not documenting write operations)
     * Use this to check whether the current user can delete records. Should be
     * called before calling {@link deleteRecords}.
     *
     * @param records The records to delete.
     * @returns `true` if the current user can delete the given records, `false` otherwise.
     * @example
     * const recordsToDelete = [myRecord1, myRecord2];
     * if (myTable.canDeleteRecords(recordsToDelete)) {
     *     myTable.deleteRecords(recordsToDelete);
     * }
     */
    canDeleteRecords(records: Array<Record>): boolean {
        const {session} = getSdk();
        return permissionHelpers.can(session.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /**
     * @private (since we're not documenting write operations)
     * Deletes records.
     *
     * Throws if the current user cannot delete the given records. Call {@link canDeleteRecords}
     * before calling this to check whether the current user can delete the given records.
     *
     * @param records The records to delete.
     * @returns {{}}
     * @example
     * const recordsToDelete = [myRecord1, myRecord2];
     * if (myTable.canDeleteRecords(recordsToDelete)) {
     *     myTable.deleteRecords(recordsToDelete);
     * }
     */
    deleteRecords(records: Array<Record>): AirtableWriteAction<void, {}> {
        if (!this.canDeleteRecords(records)) {
            throw spawnError('Your permission level does not allow deleting records');
        }

        if (!this._recordStore.isDataLoaded) {
            throw spawnError('Table data is not loaded');
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
     * Returns the first view in the table where the type is one of `allowedViewTypes`.
     *
     * @param allowedViewTypes An array of view types or a single view type to match against.
     * @param preferredViewOrViewId If a view or view ID is supplied and that view exists & has the correct type, that view
     * will be returned before checking the other views in the table.
     * @returns The first view where the type is one of `allowedViewTypes` or `null` if no such view exists in the table.
     * @example
     * import {viewTypes} from '@airtable/blocks/models';
     * const firstCalendarView = myTable.getFirstViewOfType(viewTypes.CALENDAR);
     * if (firstCalendarView !== null) {
     *     console.log(firstCalendarView.name);
     * } else {
     *     console.log('No calendar views exist in the table');
     * }
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
    /**
     * @private
     */
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
    /**
     * @private
     */
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
    /**
     * @private
     */
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
    /**
     * @private
     */
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

            for (const [viewId, viewModel] of entries(this._viewModelsById)) {
                if (viewModel.isDeleted) {
                    delete this._viewModelsById[viewId];
                }
            }
        }
        if (dirtyPaths.viewsById) {
            for (const [viewId, dirtyViewPaths] of entries(dirtyPaths.viewsById)) {
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
            didTableSchemaChange = true;

            const addedFieldIds = [];
            const removedFieldIds = [];
            for (const [fieldId, dirtyFieldPaths] of entries(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths._isDirty) {
                    if (has(this._data.fieldsById, fieldId)) {
                        addedFieldIds.push(fieldId);
                    } else {
                        removedFieldIds.push(fieldId);

                        const fieldModel = this._fieldModelsById[fieldId];
                        if (fieldModel) {
                            delete this._fieldModelsById[fieldId];
                        }
                    }
                } else {
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

            this._cachedFieldNamesById = null;
        }
        return didTableSchemaChange;
    }
    /**
     * @private
     */
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
