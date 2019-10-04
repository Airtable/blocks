// @flow
import {type BaseData} from '../types/base';
import {type TableData} from '../types/table';
import {type ViewType, type ViewId} from '../types/view';
import {type FieldId} from '../types/field';
import {type RecordId} from '../types/record';
import {MutationTypes, type PermissionCheckResult} from '../types/mutations';
import {isEnumValue, entries, has} from '../private_utils';
import {spawnError} from '../error_utils';
import getSdk from '../get_sdk';
import {type AirtableInterface} from '../injected/airtable_interface';
import AbstractModel from './abstract_model';
import View from './view';
import Field from './field';
import type Base from './base';
import type Record from './record';
import {type RecordQueryResultOpts} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import type RecordStore from './record_store';

const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
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
        return this._airtableInterface.urlConstructor.getTableUrl(this.id);
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
     * @returns The field matching the given ID. Throws if that field does not exist in this table. Use [getFieldByIdIfExists](#getfieldbyidifexists) instead if you are unsure whether a field exists with the given ID.
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
     * @returns The field matching the given name. Throws if no field exists with that name in this table. Use [getFieldByNameIfExists](#getfieldbynameifexists) instead if you are unsure whether a field exists with the given name.
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
     * @returns The view matching the given ID. Throws if that view does not exist in this table. Use [getViewByIdIfExists](#getviewbyidifexists) instead if you are unsure whether a view exists with the given ID.
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
     * @returns The view matching the given name. Throws if no view exists with that name in this table. Use [getViewByNameIfExists](#getviewbynameifexists) instead if you are unsure whether a view exists with the given name.
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
     * Updates cell values for a record.
     *
     * Throws an error if the user does not have permission to update the given cell values in
     * the record, or if invalid input is provided (eg. invalid cell values).
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the updated
     * cell values to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {Record | RecordId} recordOrRecordId the record to update
     * @param {object} fields cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @returns {Promise<RecordId>} A promise that will resolve to the RecordId of the new record, once the new record is persisted to Airtable.
     * @example
     * function updateRecord(record, recordFields) {
     *     if (table.hasPermissionToUpdateRecord(record, recordFields)) {
     *         table.updateRecordAsync(record, recordFields);
     *     }
     *     // The updated values will now show in your block (eg in `table.selectRecords()` result)
     *     // but are still being saved to Airtable servers (eg. other users may not be able to see
     *     // them yet.)
     * }
     *
     * async function updateRecordAsync(record, recordFields) {
     *     if (table.hasPermissionToUpdateRecord(record, recordFields)) {
     *         await table.updateRecordAsync(record, recordFields);
     *     }
     *     // New record has been saved to Airtable servers.
     *     alert(`record with ID ${record.id} has been updated`);
     * }
     *
     * // Fields can be specified by name or ID
     * updateRecord(record1, {
     *     'Post Title': 'How to make: orange-mango pound cake',
     *     'Publication Date': '2020-01-01',
     * });
     * updateRecord(record2, {
     *     [postTitleField.id]: 'Cake decorating tips & tricks',
     *     [publicationDateField.id]: '2020-02-02',
     * });
     */
    async updateRecordAsync(
        recordOrRecordId: Record | RecordId,
        fields: {+[fieldIdOrName: FieldId | string]: mixed},
    ): Promise<void> {
        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;

        await this.updateRecordsAsync([
            {
                id: recordId,
                fields,
            },
        ]);
    }
    /**
     * Checks whether the current user has permission to perform the given record update.
     *
     * Accepts partial input, in the same format as [updateRecordAsync](#updateRecordAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Record | RecordId} [recordOrRecordId] the record to update
     * @param {object} [fields] cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can update the specified record, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * // Check if user can update specific fields for a specific record.
     * const updateRecordCheckResult = table.checkPermissionsForUpdateRecord(record, {
     *     'Post Title': 'How to make: orange-mango pound cake',
     *     'Publication Date': '2020-01-01',
     * });
     * if (!updateRecordCheckResult.hasPermission) {
     *     alert(updateRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Like updateRecordAsync, you can use either field names or field IDs.
     * const updateRecordCheckResultWithFieldIds = table.checkPermissionsForUpdateRecord(record, {
     *     [postTitleField.id]: 'Cake decorating tips & tricks',
     *     [publicationDateField.id]: '2020-02-02',
     * });
     *
     * // Check if user could update a given record, when you don't know the specific fields that
     * // will be updated yet. (for example, to check whether you should allow a user to select
     * // a certain record to update)
     * const updateUnknownFieldsCheckResult = table.checkPermissionsForUpdateRecord(record);
     *
     * // Check if user could update specific fields, when you don't know the specific record that
     * // will be updated yet. (for example, if the field is selected by the user and you want to
     * // check if your block can write to it)
     * const updateUnknownRecordCheckResult = table.checkPermissionsForUpdateRecord(undefined, {
     *     'My field name': 'updated value',
     *     // You can use undefined if you know you're going to update a field, but don't know
     *     // the new cell value yet.
     *     'Another field name': undefined,
     * });
     *
     * // Check if user could perform updates within the table, without knowing the specific record
     * // or fields that will be updated yet. (for example, to render your block in "read only"
     * // mode)
     * const updateUnknownRecordAndFieldsCheckResult = table.checkPermissionsForUpdateRecord();
     */
    checkPermissionsForUpdateRecord(
        recordOrRecordId?: Record | RecordId | void,
        fields?: {[fieldIdOrName: FieldId | string]: mixed | void} | void,
    ): PermissionCheckResult {
        const recordId =
            typeof recordOrRecordId === 'object' && recordOrRecordId !== null
                ? recordOrRecordId.id
                : recordOrRecordId;

        return this.checkPermissionsForUpdateRecords([
            {
                id: recordId,
                fields,
            },
        ]);
    }
    /**
     * An alias for `checkPermissionsForUpdateRecord(recordOrRecordId, fields).hasPermission`.
     *
     * Checks whether the current user has permission to perform the given record update.
     *
     * Accepts partial input, in the same format as [updateRecordAsync](#updateRecordAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Record | RecordId} [recordOrRecordId] the record to update
     * @param {object} [fields] cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @returns boolean Whether the user can update the specified record.
     * @example
     * // Check if user can update specific fields for a specific record.
     * const canUpdateRecord = table.hasPermissionToUpdateRecord(record, {
     *     'Post Title': 'How to make: orange-mango pound cake',
     *     'Publication Date': '2020-01-01',
     * });
     * if (!canUpdateRecord) {
     *     alert('not allowed!');
     * }
     *
     * // Like updateRecordAsync, you can use either field names or field IDs.
     * const canUpdateRecordWithFieldIds = table.hasPermissionToUpdateRecord(record, {
     *     [postTitleField.id]: 'Cake decorating tips & tricks',
     *     [publicationDateField.id]: '2020-02-02',
     * });
     *
     * // Check if user could update a given record, when you don't know the specific fields that
     * // will be updated yet. (for example, to check whether you should allow a user to select
     * // a certain record to update)
     * const canUpdateUnknownFields = table.hasPermissionToUpdateRecord(record);
     *
     * // Check if user could update specific fields, when you don't know the specific record that
     * // will be updated yet. (for example, if the field is selected by the user and you want to
     * // check if your block can write to it)
     * const canUpdateUnknownRecord = table.hasPermissionToUpdateRecord(undefined, {
     *     'My field name': 'updated value',
     *     // You can use undefined if you know you're going to update a field, but don't know
     *     // the new cell value yet.
     *     'Another field name': undefined,
     * });
     *
     * // Check if user could perform updates within the table, without knowing the specific record
     * // or fields that will be updated yet. (for example, to render your block in "read only"
     * // mode)
     * const canUpdateUnknownRecordAndFields = table.hasPermissionToUpdateRecord();
     */
    hasPermissionToUpdateRecord(
        recordOrRecordId?: Record | RecordId | void,
        fields?: {[fieldIdOrName: FieldId | string]: mixed | void} | void,
    ): boolean {
        return this.checkPermissionsForUpdateRecord(recordOrRecordId, fields).hasPermission;
    }
    /**
     * Updates cell values for records.
     *
     * Throws an error if the user does not have permission to update the given cell values in
     * the records, or if invalid input is provided (eg. invalid cell values).
     *
     * You may only update up to 50 records in one call to `updateRecordsAsync`.
     * See [Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information
     * about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * updates to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {Array<{id: RecordId, fields: object}>} records Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @returns {Promise<void>} A promise that will resolve once the updates are persisted to Airtable.
     * @example
     * const recordsToUpdate = [
     *     // Fields can be specified by name or ID
     *     {
     *         id: record1.id,
     *         fields: {
     *             'Post Title': 'How to make: orange-mango pound cake',
     *             'Publication Date': '2020-01-01',
     *         },
     *     },
     *     {
     *         id: record2.id,
     *         fields: {
     *             // Sets the cell values to be empty.
     *             'Post Title': '',
     *             'Publication Date': '',
     *         },
     *     },
     *     {
     *         id: record3.id,
     *         fields: {
     *             [postTitleField.id]: 'Cake decorating tips & tricks',
     *             [publicationDateField.id]: '2020-02-02',
     *         },
     *     },
     * ];
     *
     * function updateRecords() {
     *     if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
     *         table.updateRecordsAsync(recordsToUpdate);
     *     }
     *     // The records are now updated within your block (eg will be reflected in
     *     // `table.selectRecords()`) but are still being saved to Airtable servers (eg. they
     *     // may not be updated for other users yet)
     * }
     *
     * async function updateRecordsAsync() {
     *     if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
     *         await table.updateRecordsAsync(recordsToUpdate);
     *     }
     *     // Record updates have been saved to Airtable servers.
     *     alert('records have been updated');
     * }
     */
    async updateRecordsAsync(
        records: $ReadOnlyArray<{
            +id: RecordId,
            +fields: {+[fieldIdOrName: FieldId | string]: mixed},
        }>,
    ): Promise<void> {
        const recordsWithCellValuesByFieldId = records.map(record => ({
            id: record.id,
            cellValuesByFieldId: this._cellValuesByFieldIdOrNameToCellValuesByFieldId(
                record.fields,
            ),
        }));

        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
            tableId: this.id,
            records: recordsWithCellValuesByFieldId,
        });
    }
    /**
     * Checks whether the current user has permission to perform the given record updates.
     *
     * Accepts partial input, in the same format as [updateRecordsAsync](#updateRecordsAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<{id?: RecordId, fields?: object}>} [records] Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can update the specified records, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * const recordsToUpdate = [
     *     {
     *         // Validating a complete record update
     *         id: record1.id,
     *         fields: {
     *             'Post Title': 'How to make: orange-mango pound cake',
     *             'Publication Date': '2020-01-01',
     *         },
     *     },
     *     {
     *         // Like updateRecordsAsync, fields can be specified by name or ID
     *         id: record2.id,
     *         fields: {
     *             [postTitleField.id]: 'Cake decorating tips & tricks',
     *             [publicationDateField.id]: '2020-02-02',
     *         },
     *     },
     *     {
     *         // Validating an update to a specific record, not knowing what fields will be updated
     *         id: record3.id,
     *     },
     *     {
     *         // Validating an update to specific cell values, not knowing what record will be updated
     *         fields: {
     *             'My field name': 'updated value for unknown record',
     *             // You can use undefined if you know you're going to update a field, but don't know
     *             // the new cell value yet.
     *             'Another field name': undefined,
     *         },
     *     },
     * ];
     *
     * const updateRecordsCheckResult = table.checkPermissionsForUpdateRecords(recordsToUpdate);
     * if (!updateRecordsCheckResult.hasPermission) {
     *     alert(updateRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially update records.
     * // Equivalent to table.checkPermissionsForUpdateRecord()
     * const updateUnknownRecordAndFieldsCheckResult = table.checkPermissionsForUpdateRecords();
     */
    checkPermissionsForUpdateRecords(
        records?: $ReadOnlyArray<{
            +id?: RecordId | void,
            +fields?: {
                +[FieldId | string]: mixed | void,
            } | void,
        }> | void,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
            tableId: this.id,
            records: records
                ? records.map(record => ({
                      id: record.id || undefined,
                      cellValuesByFieldId: record.fields
                          ? this._cellValuesByFieldIdOrNameToCellValuesByFieldId(record.fields)
                          : undefined,
                  }))
                : undefined,
        });
    }
    /**
     * An alias for `checkPermissionsForUpdateRecords(records).hasPermission`.
     *
     * Checks whether the current user has permission to perform the given record updates.
     *
     * Accepts partial input, in the same format as [updateRecordsAsync](#updateRecordsAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<{id?: RecordId, fields?: object}>} [records] Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @returns boolean Whether the current user can update the specified records.
     * @example
     * const recordsToUpdate = [
     *     {
     *         // Validating a complete record update
     *         id: record1.id,
     *         fields: {
     *             'Post Title': 'How to make: orange-mango pound cake',
     *             'Publication Date': '2020-01-01',
     *         },
     *     },
     *     {
     *         // Like updateRecordsAsync, fields can be specified by name or ID
     *         id: record2.id,
     *         fields: {
     *             [postTitleField.id]: 'Cake decorating tips & tricks',
     *             [publicationDateField.id]: '2020-02-02',
     *         },
     *     },
     *     {
     *         // Validating an update to a specific record, not knowing what fields will be updated
     *         id: record3.id,
     *     },
     *     {
     *         // Validating an update to specific cell values, not knowing what record will be updated
     *         fields: {
     *             'My field name': 'updated value for unknown record',
     *             // You can use undefined if you know you're going to update a field, but don't know
     *             // the new cell value yet.
     *             'Another field name': undefined,
     *         },
     *     },
     * ];
     *
     * const canUpdateRecords = table.hasPermissionToUpdateRecords(recordsToUpdate);
     * if (!canUpdateRecords) {
     *     alert('not allowed');
     * }
     *
     * // Check if user could potentially update records.
     * // Equivalent to table.hasPermissionToUpdateRecord()
     * const canUpdateUnknownRecordsAndFields = table.hasPermissionToUpdateRecords();
     */
    hasPermissionToUpdateRecords(
        records?: $ReadOnlyArray<{
            +id?: RecordId | void,
            +fields?: {
                +[FieldId | string]: mixed | void,
            } | void,
        }> | void,
    ): boolean {
        return this.checkPermissionsForUpdateRecords(records).hasPermission;
    }
    /**
     * Delete the given record.
     *
     * Throws an error if the user does not have permission to delete the given record.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * delete to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {Record | RecordId} recordOrRecordId the record to be deleted
     * @returns {Promise<void>} A promise that will resolve once the delete is persisted to Airtable.
     * @example
     * function deleteRecord(record) {
     *     if (table.hasPermissionToDeleteRecord(record)) {
     *         table.deleteRecordAsync(record);
     *     }
     *     // The record is now deleted within your block (eg will not be returned in
     *     // `table.selectRecords`) but it is still being saved to Airtable servers (eg. it may
     *     // not look deleted to other users yet)
     * }
     *
     * async function deleteRecordAsync(record) {
     *     if (table.hasPermissionToDeleteRecord(record)) {
     *         await table.deleteRecordAsync(record);
     *     }
     *     // Record deletion has been saved to Airtable servers.
     *     alert('record has been deleted');
     * }
     */
    async deleteRecordAsync(recordOrRecordId: Record | RecordId): Promise<void> {
        await this.deleteRecordsAsync([recordOrRecordId]);
    }
    /**
     * Checks whether the current user has permission to delete the specified record.
     *
     * Accepts optional input, in the same format as [deleteRecordAsync](#deleteRecordAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Record | RecordId} [recordOrRecordId] the record to be deleted
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified record, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * // Check if user can delete a specific record
     * const deleteRecordCheckResult = table.checkPermissionsForDeleteRecord(record);
     * if (!deleteRecordCheckResult.hasPermission) {
     *     alert(deleteRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially delete a record.
     * // Use when you don't know the specific record you want to delete yet (for example, to show
     * // or hide UI controls that let you select a record to delete.)
     * const deleteUnknownRecordCheckResult = table.checkPermissionsForDeleteRecord();
     */
    checkPermissionsForDeleteRecord(
        recordOrRecordId?: Record | RecordId | void,
    ): PermissionCheckResult {
        return this.checkPermissionsForDeleteRecords(
            recordOrRecordId ? [recordOrRecordId] : undefined,
        );
    }
    /**
     * An alias for `checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission`.
     *
     * Checks whether the current user has permission to delete the specified record.
     *
     * Accepts optional input, in the same format as [deleteRecordAsync](#deleteRecordAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Record | RecordId} [recordOrRecordId] the record to be deleted
     * @returns boolean Whether the current user can delete the specified record.
     * @example
     * // Check if user can delete a specific record
     * const canDeleteRecord = table.hasPermissionToDeleteRecord(record);
     * if (!canDeleteRecord) {
     *     alert('not allowed');
     * }
     *
     * // Check if user could potentially delete a record.
     * // Use when you don't know the specific record you want to delete yet (for example, to show
     * // or hide UI controls that let you select a record to delete.)
     * const canDeleteUnknownRecord = table.hasPermissionToDeleteRecord();
     */
    hasPermissionToDeleteRecord(recordOrRecordId?: Record | RecordId | void): boolean {
        return this.checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission;
    }
    /**
     * Delete the given records.
     *
     * Throws an error if the user does not have permission to delete the given records.
     *
     * You may only delete up to 50 records in one call to `deleteRecordsAsync`.
     * See [Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information
     * about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * delete to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {Array<Record | RecordId>} recordsOrRecordIds Array of Records and RecordIds
     * @returns {Promise<void>} A promise that will resolve once the deletes are persisted to Airtable.
     * @example
     *
     * function deleteRecords(records) {
     *     if (table.hasPermissionToDeleteRecords(records)) {
     *         table.deleteRecordsAsync(records);
     *     }
     *     // The records are now deleted within your block (eg will not be returned in
     *     // `table.selectRecords()`) but are still being saved to Airtable servers (eg. they
     *     // may not look deleted to other users yet)
     * }
     *
     * async function deleteRecordsAsync(records) {
     *     if (table.hasPermissionToDeleteRecords(records)) {
     *         await table.deleteRecordsAsync(records);
     *     }
     *     // Record deletions have been saved to Airtable servers.
     *     alert('records have been deleted');
     * }
     */
    async deleteRecordsAsync(recordsOrRecordIds: $ReadOnlyArray<Record | RecordId>): Promise<void> {
        const recordIds = recordsOrRecordIds.map(recordOrRecordId =>
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id,
        );

        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.DELETE_MULTIPLE_RECORDS,
            tableId: this.id,
            recordIds,
        });
    }
    /**
     * Checks whether the current user has permission to delete the specified records.
     *
     * Accepts optional input, in the same format as [deleteRecordsAsync](#deleteRecordsAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<Record | RecordId>} [recordsOrRecordIds] the records to be deleted
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified records, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * // Check if user can delete specific records
     * const deleteRecordsCheckResult = table.checkPermissionsForDeleteRecords([record1, record2]);
     * if (!deleteRecordsCheckResult.hasPermission) {
     *     alert(deleteRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially delete records.
     * // Use when you don't know the specific records you want to delete yet (for example, to show
     * // or hide UI controls that let you select records to delete.)
     * // Equivalent to table.hasPermissionToDeleteRecord()
     * const deleteUnknownRecordsCheckResult = table.checkPermissionsForDeleteRecords();
     */
    checkPermissionsForDeleteRecords(
        recordsOrRecordIds?: $ReadOnlyArray<Record | RecordId> | void,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.DELETE_MULTIPLE_RECORDS,
            tableId: this.id,
            recordIds: recordsOrRecordIds
                ? recordsOrRecordIds.map(recordOrRecordId =>
                      typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id,
                  )
                : undefined,
        });
    }
    /**
     * An alias for `checkPermissionsForDeleteRecords(recordsOrRecordIds).hasPermission`.
     *
     * Checks whether the current user has permission to delete the specified records.
     *
     * Accepts optional input, in the same format as [deleteRecordsAsync](#deleteRecordsAsync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<Record | RecordId>} [recordsOrRecordIds] the records to be deleted
     * @returns boolean Whether the current user can delete the specified records.
     * @example
     * // Check if user can delete specific records
     * const canDeleteRecords = table.hasPermissionToDeleteRecords([record1, record2]);
     * if (!canDeleteRecords) {
     *     alert('not allowed!');
     * }
     *
     * // Check if user could potentially delete records.
     * // Use when you don't know the specific records you want to delete yet (for example, to show
     * // or hide UI controls that let you select records to delete.)
     * // Equivalent to table.hasPermissionToDeleteRecord()
     * const canDeleteUnknownRecords = table.hasPermissionToDeleteRecords();
     */
    hasPermissionToDeleteRecords(
        recordsOrRecordIds?: $ReadOnlyArray<Record | RecordId> | void,
    ): boolean {
        return this.checkPermissionsForDeleteRecords(recordsOrRecordIds).hasPermission;
    }

    /**
     * Creates a new record with the specified cell values.
     *
     * Throws an error if the user does not have permission to create the given records, or
     * if invalid input is provided (eg. invalid cell values).
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the new
     * record to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {object} fields object mapping `FieldId` or field name to value for that field.
     * @returns {Promise<RecordId>} A promise that will resolve to the RecordId of the new record, once the new record is persisted to Airtable.
     * @example
     * function createNewRecord(recordFields) {
     *     if (table.hasPermissionToCreateRecord(recordFields)) {
     *         table.createRecordAsync(recordFields);
     *     }
     *     // You can now access the new record in your block (eg `table.selectRecords()`) but it is
     *     // still being saved to Airtable servers (eg. other users may not be able to see it yet.)
     * }
     *
     * async function createNewRecordAsync(recordFields) {
     *     if (table.hasPermissionToCreateRecord(recordFields)) {
     *         const newRecordId = await table.createRecordAsync(recordFields);
     *     }
     *     // New record has been saved to Airtable servers.
     *     alert(`new record with ID ${newRecordId} has been created`);
     * }
     *
     * // Fields can be specified by name or ID
     * createNewRecord({
     *     'Project Name': 'Advertising campaign',
     *     'Budget': 100,
     * });
     * createNewRecord({
     *     [projectNameField.id]: 'Cat video',
     *     [budgetField.id]: 200,
     * });
     */
    async createRecordAsync(
        fields: {
            +[fieldIdOrName: FieldId | string]: mixed,
        } = {},
    ): Promise<RecordId> {
        const recordIds = await this.createRecordsAsync([fields]);
        return recordIds[0];
    }

    /**
     * Checks whether the current user has permission to create the specified record.
     *
     * Accepts partial input, in the same format as [createRecordAsync](#createrecordasync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {object} [fields] object mapping `FieldId` or field name to value for that field.
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can create the specified record, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * // Check if user can create a specific record, when you already know what fields/cell values
     * // will be set for the record.
     * const createRecordCheckResult = table.checkPermissionsForCreateRecord({
     *     'Project Name': 'Advertising campaign',
     *     'Budget': 100,
     * });
     * if (!createRecordCheckResult.hasPermission) {
     *     alert(createRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Like createRecordAsync, you can use either field names or field IDs.
     * const createRecordCheckResultWithFieldIds = table.checkPermissionsForCreateRecord({
     *     [projectNameField.id]: 'Cat video',
     *     [budgetField.id]: 200,
     * });
     *
     * // Check if user could potentially create a record.
     * // Use when you don't know the specific fields/cell values yet (for example, to show or hide
     * // UI controls that let you start creating a record.)
     * const createUnknownRecordCheckResult = table.checkPermissionsForCreateRecord();
     */
    checkPermissionsForCreateRecord(
        fields?: {
            [fieldIdOrName: FieldId | string]: mixed | void,
        } | void,
    ): PermissionCheckResult {
        return this.checkPermissionsForCreateRecords([
            {
                fields: fields || undefined,
            },
        ]);
    }
    /**
     * An alias for `checkPermissionsForCreateRecord(fields).hasPermission`.
     *
     * Checks whether the current user has permission to create the specified record.
     *
     * Accepts partial input, in the same format as [createRecordAsync](#createrecordasync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {object} [fields] object mapping `FieldId` or field name to value for that field.
     * @returns boolean Whether the current user can create the specified record.
     * @example
     * // Check if user can create a specific record, when you already know what fields/cell values
     * // will be set for the record.
     * const canCreateRecord = table.hasPermissionToCreateRecord({
     *     'Project Name': 'Advertising campaign',
     *     'Budget': 100,
     * });
     * if (!canCreateRecord) {
     *     alert('not allowed!');
     * }
     *
     * // Like createRecordAsync, you can use either field names or field IDs.
     * const canCreateRecordWithFieldIds = table.hasPermissionToCreateRecord({
     *     [projectNameField.id]: 'Cat video',
     *     [budgetField.id]: 200,
     * });
     *
     * // Check if user could potentially create a record.
     * // Use when you don't know the specific fields/cell values yet (for example, to show or hide
     * // UI controls that let you start creating a record.)
     * const canCreateUnknownRecord = table.hasPermissionToCreateRecord();
     */
    hasPermissionToCreateRecord(
        fields?: {
            [fieldIdOrName: FieldId | string]: mixed | void,
        } | void,
    ): boolean {
        return this.checkPermissionsForCreateRecord(fields).hasPermission;
    }
    /**
     * Creates new records with the specified cell values.
     *
     * Throws an error if the user does not have permission to create the given records, or
     * if invalid input is provided (eg. invalid cell values).
     *
     * You may only create up to 50 records in one call to `createRecordsAsync`.
     * See [Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information
     * about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the new
     * record to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param {Array<object>} records Array of objects mapping `FieldId` or field name to value for that field.
     * @returns {Promise<Array<RecordId>>} A promise that will resolve to array of RecordIds of the new records, once the new records are persisted to Airtable.
     * @example
     * const recordDefs = [
     *     // Fields can be specified by name or ID
     *     {
     *         'Project Name': 'Advertising campaign',
     *         'Budget': 100,
     *     },
     *     {
     *         [projectNameField.id]: 'Cat video',
     *         [budgetField.id]: 200,
     *     },
     *     // Specifying no fields will create a new record with no cell values set
     *     {},
     * ];
     *
     * function createNewRecords() {
     *     if (table.hasPermissionToCreateRecords(recordDefs)) {
     *         table.createRecordsAsync(recordDefs);
     *     }
     *     // You can now access the new records in your block (eg `table.selectRecords()`) but they
     *     // are still being saved to Airtable servers (eg. other users may not be able to see them
     *     // yet.)
     * }
     *
     * async function createNewRecordsAsync() {
     *     if (table.hasPermissionToCreateRecords(recordDefs)) {
     *         const newRecordIds = await table.createRecordsAsync(recordDefs);
     *     }
     *     // New records have been saved to Airtable servers.
     *     alert(`new records with IDs ${newRecordIds} have been created`);
     * }
     */
    async createRecordsAsync(
        records: $ReadOnlyArray<{
            +[fieldIdOrName: FieldId | string]: mixed,
        }>,
    ): Promise<Array<RecordId>> {
        const recordsToCreate = records.map(recordDef => ({
            id: this._airtableInterface.idGenerator.generateRecordId(),
            cellValuesByFieldId: this._cellValuesByFieldIdOrNameToCellValuesByFieldId(recordDef),
        }));

        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.CREATE_MULTIPLE_RECORDS,
            tableId: this.id,
            records: recordsToCreate,
        });

        return recordsToCreate.map(record => record.id);
    }
    /**
     * Checks whether the current user has permission to create the specified records.
     *
     * Accepts partial input, in the same format as [createRecordsAsync](#createrecordsasync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<object>} [records] Array of objects mapping `FieldId` or field name to value for that field.
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can create the specified records, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     * @example
     * // Check if user can create specific records, when you already know what fields/cell values
     * // will be set for the records.
     * const createRecordsCheckResult = table.checkPermissionsForCreateRecords([
     *     // Like createRecordsAsync, fields can be specified by name or ID
     *     {
     *         'Project Name': 'Advertising campaign',
     *         'Budget': 100,
     *     },
     *     {
     *         [projectNameField.id]: 'Cat video',
     *         [budgetField.id]: 200,
     *     },
     *     {},
     * ]);
     * if (!createRecordsCheckResult.hasPermission) {
     *     alert(createRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially create records.
     * // Use when you don't know the specific fields/cell values yet (for example, to show or hide
     * // UI controls that let you start creating records.)
     * // Equivalent to table.checkPermissionsForCreateRecord()
     * const createUnknownRecordCheckResult = table.checkPermissionsForCreateRecords();
     */
    checkPermissionsForCreateRecords(
        records?: $ReadOnlyArray<{
            +fields?: {[FieldId | string]: mixed | void} | void,
        }> | void,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.CREATE_MULTIPLE_RECORDS,
            tableId: this.id,
            records: records
                ? records.map(record => ({
                      id: undefined,
                      cellValuesByFieldId: record.fields
                          ? this._cellValuesByFieldIdOrNameToCellValuesByFieldId(record.fields)
                          : undefined,
                  }))
                : undefined,
        });
    }
    /**
     * An alias for `checkPermissionsForCreateRecords(records).hasPermission`.
     *
     * Checks whether the current user has permission to create the specified records.
     *
     * Accepts partial input, in the same format as [createRecordsAsync](#createrecordsasync).
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {Array<object>} [records] Array of objects mapping `FieldId` or field name to value for that field.
     * @returns boolean Whether the current user can create the specified records.
     * @example
     * // Check if user can create specific records, when you already know what fields/cell values
     * // will be set for the records.
     * const canCreateRecords = table.hasPermissionToCreateRecords([
     *     // Like createRecordsAsync, fields can be specified by name or ID
     *     {
     *         'Project Name': 'Advertising campaign',
     *         'Budget': 100,
     *     },
     *     {
     *         [projectNameField.id]: 'Cat video',
     *         [budgetField.id]: 200,
     *     },
     *     {},
     * ]);
     * if (!canCreateRecords) {
     *     alert('not allowed');
     * }
     *
     * // Check if user could potentially create records.
     * // Use when you don't know the specific fields/cell values yet (for example, to show or hide
     * // UI controls that let you start creating records.)
     * // Equivalent to table.hasPermissionToCreateRecord()
     * const canCreateUnknownRecords = table.hasPermissionToCreateRecords();
     */
    hasPermissionToCreateRecords(
        records?: $ReadOnlyArray<{
            +fields?: {[FieldId | string]: mixed | void} | void,
        }> | void,
    ): boolean {
        return this.checkPermissionsForCreateRecords(records).hasPermission;
    }
    _cellValuesByFieldIdOrNameToCellValuesByFieldId(cellValuesByFieldIdOrName: {
        +[fieldIdOrName: FieldId | string]: mixed,
    }): {[FieldId]: mixed} {
        return Object.fromEntries(
            entries(cellValuesByFieldIdOrName).map(([fieldIdOrName, cellValue]) => {
                const field = this.__getFieldMatching(fieldIdOrName);
                return [field.id, cellValue];
            }),
        );
    }
    /**
     * @private
     */
    __getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field {
        let field: Field | null;
        if (fieldOrFieldIdOrFieldName instanceof Field) {
            if (fieldOrFieldIdOrFieldName.parentTable.id !== this.id) {
                throw spawnError(
                    "Field '%s' is from a different table than table '%s'",
                    fieldOrFieldIdOrFieldName.id,
                    this.id,
                );
            }
            field = fieldOrFieldIdOrFieldName;
        } else {
            field =
                this.getFieldByIdIfExists(fieldOrFieldIdOrFieldName) ||
                this.getFieldByNameIfExists(fieldOrFieldIdOrFieldName);

            if (field === null) {
                throw spawnError(
                    "Field '%s' does not exist in table '%s'",
                    fieldOrFieldIdOrFieldName,
                    this.id,
                );
            }
        }

        if (field.isDeleted) {
            throw spawnError("Field '%s' was deleted from table '%s'", field.id, this.id);
        }
        return field;
    }
    /**
     * @private
     */
    __getViewMatching(viewOrViewIdOrViewName: View | string): View {
        let view: View | null;
        if (viewOrViewIdOrViewName instanceof View) {
            if (viewOrViewIdOrViewName.parentTable.id !== this.id) {
                throw spawnError(
                    "View '%s' is from a different table than table '%s'",
                    viewOrViewIdOrViewName.id,
                    this.id,
                );
            }
            view = viewOrViewIdOrViewName;
        } else {
            view =
                this.getViewByIdIfExists(viewOrViewIdOrViewName) ||
                this.getViewByNameIfExists(viewOrViewIdOrViewName);

            if (view === null) {
                throw spawnError(
                    "View '%s' does not exist in table '%s'",
                    viewOrViewIdOrViewName,
                    this.id,
                );
            }
        }

        if (view.isDeleted) {
            throw spawnError("View '%s' was deleted from table '%s'", view.id, this.id);
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
        if (dirtyPaths.lock) {
            didTableSchemaChange = true;
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
