/** @module @airtable/blocks/models: Table */ /** */
import {BaseData} from '../types/base';
import {TableData} from '../types/table';
import {ViewType, ViewId} from '../types/view';
import {FieldId, FieldType, FieldOptions} from '../types/field';
import {RecordId} from '../types/record';
import {MutationTypes, PermissionCheckResult} from '../types/mutations';
import {isEnumValue, entries, has, ObjectValues, cast, ObjectMap, keys} from '../private_utils';
import {spawnError} from '../error_utils';
import getSdk from '../get_sdk';
import {AirtableInterface} from '../injected/airtable_interface';
import warning from '../warning';
import AbstractModel from './abstract_model';
import View from './view';
import Field from './field';
import Base, {ChangedPathsForType} from './base';
import Record from './record';
import {RecordQueryResultOpts} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import RecordStore from './record_store';

export const WatchableTableKeys = Object.freeze({
    name: 'name' as const,
    description: 'description' as const,
    views: 'views' as const,
    fields: 'fields' as const,
});

/**
 * A key in {@link Table} that can be watched.
 * - `name`
 * - `description`
 * - `views`
 * - `fields`
 */
export type WatchableTableKey = ObjectValues<typeof WatchableTableKeys>;

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 *
 * @docsPath models/Table
 */
class Table extends AbstractModel<TableData, WatchableTableKey> {
    /** @internal */
    static _className = 'Table';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableTableKeys, key);
    }
    /** @internal */
    _parentBase: Base;
    /** @internal */
    _viewModelsById: {[key: string]: View};
    /** @internal */
    _fieldModelsById: {[key: string]: Field};
    /** @internal */
    _cachedFieldNamesById: {[key: string]: string} | null;
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _recordStore: RecordStore;

    /**
     * @internal
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
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): TableData | null {
        return this._baseData.tablesById[this._id] ?? null;
    }
    /**
     * The base that this table belongs to.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * const table = base.getTableByName('Table 1');
     * console.log(table.parentBase.id === base.id);
     * // => true
     * ```
     */
    get parentBase(): Base {
        return this._parentBase;
    }
    /**
     * The name of the table. Can be watched.
     *
     * @example
     * ```js
     * console.log(myTable.name);
     * // => 'Table 1'
     * ```
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * The description of the table, if it has one. Can be watched.
     *
     * @example
     * ```js
     * console.log(myTable.description);
     * // => 'This is my table'
     * ```
     */
    get description(): string | null {
        return this._data.description;
    }
    /**
     * The URL for the table. You can visit this URL in the browser to be taken to the table in the Airtable UI.
     *
     * @example
     * ```js
     * console.log(myTable.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx'
     * ```
     */
    get url(): string {
        return this._airtableInterface.urlConstructor.getTableUrl(this.id);
    }
    /**
     * The table's primary field. Every table has exactly one primary
     * field. The primary field of a table will not change.
     *
     * @example
     * ```js
     * console.log(myTable.primaryField.name);
     * // => 'Name'
     * ```
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
     *
     * @example
     * ```js
     * console.log(`This table has ${myTable.fields.length} fields`);
     * ```
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
     * Gets the field matching the given ID, or `null` if that field does not exist in this table.

     * @param fieldId The ID of the field.
     * @example
     * ```js
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldByIdIfExists(fieldId);
     * if (field !== null) {
     *     console.log(field.name);
     * } else {
     *     console.log('No field exists with that ID');
     * }
     * ```
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
     * Gets the field matching the given ID. Throws if that field does not exist in this table. Use
     * {@link getFieldByIdIfExists} instead if you are unsure whether a field exists with the given
     * ID.
     *
     * @param fieldId The ID of the field.
     * @example
     * ```js
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldById(fieldId);
     * console.log(field.name);
     * // => 'Name'
     * ```
     */
    getFieldById(fieldId: FieldId): Field {
        const field = this.getFieldByIdIfExists(fieldId);
        if (!field) {
            throw spawnError("No field with ID %s in table '%s'", fieldId, this.name);
        }
        return field;
    }
    /**
     * Gets the field matching the given name, or `null` if no field exists with that name in this
     * table.
     *
     * @param fieldName The name of the field you're looking for.
     * @example
     * ```js
     * const field = myTable.getFieldByNameIfExists('Name');
     * if (field !== null) {
     *     console.log(field.id);
     * } else {
     *     console.log('No field exists with that name');
     * }
     * ```
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
     * Gets the field matching the given name. Throws if no field exists with that name in this
     * table. Use {@link getFieldByNameIfExists} instead if you are unsure whether a field exists
     * with the given name.
     *
     * @param fieldName The name of the field you're looking for.
     * @example
     * ```js
     * const field = myTable.getFieldByName('Name');
     * console.log(field.id);
     * // => 'fldxxxxxxxxxxxxxx'
     * ```
     */
    getFieldByName(fieldName: string): Field {
        const field = this.getFieldByNameIfExists(fieldName);
        if (!field) {
            throw spawnError("No field named '%s' in table '%s'", fieldName, this.name);
        }
        return field;
    }
    /**
     * The field matching the given ID or name. Returns `null` if no matching field exists within
     * this table.
     *
     * This method is convenient when building a block for a specific base, but for more generic
     * blocks the best practice is to use the {@link getFieldByIdIfExists} or
     * {@link getFieldByNameIfExists} methods instead.
     *
     * @param fieldIdOrName The ID or name of the field you're looking for.
     */
    getFieldIfExists(fieldIdOrName: FieldId | string): Field | null {
        return (
            this.getFieldByIdIfExists(fieldIdOrName) ?? this.getFieldByNameIfExists(fieldIdOrName)
        );
    }
    /**
     * The field matching the given ID or name. Throws if no matching field exists within this table.
     * Use {@link getFieldIfExists} instead if you are unsure whether a field exists with the given
     * name/ID.
     *
     * This method is convenient when building a block for a specific base, but for more generic
     * blocks the best practice is to use the {@link getFieldById} or {@link getFieldByName} methods
     * instead.
     *
     * @param fieldIdOrName The ID or name of the field you're looking for.
     */
    getField(fieldIdOrName: FieldId | string): Field {
        const field = this.getFieldIfExists(fieldIdOrName);
        if (!field) {
            throw spawnError(
                "No field with ID or name '%s' in table '%s'",
                fieldIdOrName,
                this.name,
            );
        }
        return field;
    }
    /**
     * The views in this table. Can be watched to know when views are created,
     * deleted, or reordered.
     *
     * @example
     * ```js
     * console.log(`This table has ${myTable.views.length} views`);
     * ```
     */
    get views(): Array<View> {
        const views: Array<View> = [];
        this._data.viewOrder.forEach(viewId => {
            const view = this.getViewById(viewId);
            views.push(view);
        });
        return views;
    }
    /**
     * Gets the view matching the given ID, or `null` if that view does not exist in this table.
     *
     * @param viewId The ID of the view.
     * @example
     * ```js
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewByIdIfExists(viewId);
     * if (view !== null) {
     *     console.log(view.name);
     * } else {
     *     console.log('No view exists with that ID');
     * }
     * ```
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
     * Gets the view matching the given ID. Throws if that view does not exist in this table. Use
     * {@link getViewByIdIfExists} instead if you are unsure whether a view exists with the given
     * ID.
     *
     * @param viewId The ID of the view.
     * @example
     * ```js
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewById(viewId);
     * console.log(view.name);
     * // => 'Grid view'
     * ```
     */
    getViewById(viewId: ViewId): View {
        const view = this.getViewByIdIfExists(viewId);
        if (!view) {
            throw spawnError("No view with ID %s in table '%s'", viewId, this.name);
        }
        return view;
    }
    /**
     * Gets the view matching the given name, or `null` if no view exists with that name in this
     * table.
     *
     * @param viewName The name of the view you're looking for.
     * @example
     * ```js
     * const view = myTable.getViewByNameIfExists('Name');
     * if (view !== null) {
     *     console.log(view.id);
     * } else {
     *     console.log('No view exists with that name');
     * }
     * ```
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
     * Gets the view matching the given name. Throws if no view exists with that name in this table.
     * Use {@link getViewByNameIfExists} instead if you are unsure whether a view exists with the
     * given name.
     *
     * @param viewName The name of the view you're looking for.
     * @example
     * ```js
     * const view = myTable.getViewByName('Name');
     * console.log(view.id);
     * // => 'viwxxxxxxxxxxxxxx'
     * ```
     */
    getViewByName(viewName: string): View {
        const view = this.getViewByNameIfExists(viewName);
        if (!view) {
            throw spawnError("No view named '%s' in table '%s'", viewName, this.name);
        }
        return view;
    }
    /**
     * The view matching the given ID or name. Returns `null` if no matching view exists within
     * this table.
     *
     * This method is convenient when building a block for a specific base, but for more generic
     * blocks the best practice is to use the {@link getViewByIdIfExists} or
     * {@link getViewByNameIfExists} methods instead.
     *
     * @param viewIdOrName The ID or name of the view you're looking for.
     */
    getViewIfExists(viewIdOrName: ViewId | string): View | null {
        return this.getViewByIdIfExists(viewIdOrName) ?? this.getViewByNameIfExists(viewIdOrName);
    }
    /**
     * The view matching the given ID or name. Throws if no matching view exists within this table.
     * Use {@link getViewIfExists} instead if you are unsure whether a view exists with the given
     * name/ID.
     *
     * This method is convenient when building a block for a specific base, but for more generic
     * blocks the best practice is to use the {@link getViewById} or {@link getViewByName} methods
     * instead.
     *
     * @param viewIdOrName The ID or name of the view you're looking for.
     */
    getView(viewIdOrName: ViewId | string): View {
        const view = this.getViewIfExists(viewIdOrName);
        if (!view) {
            throw spawnError("No view with ID or name '%s' in table '%s'", viewIdOrName, this.name);
        }
        return view;
    }
    /**
     * Select records from the table. Returns a {@link RecordQueryResult}.
     *
     * Consider using {@link useRecords} or {@link useRecordIds} instead, unless you need the
     * features of a QueryResult (e.g. `queryResult.getRecordById`). Record hooks handle
     * loading/unloading and updating your UI automatically, but manually `select`ing records is
     * useful for one-off data processing.
     *
     * @param opts Options for the query, such as sorts and fields.
     * @example
     * ```js
     * import {useBase, useRecords} from '@airtable/blocks';
     * import React from 'react';
     *
     * function TodoList() {
     *     const base = useBase();
     *     const table = base.getTableByName('Tasks');
     *
     *     const queryResult = table.selectRecords();
     *     const records = useRecords(queryResult);
     *
     *     return (
     *         <ul>
     *             {records.map(record => (
     *                 <li key={record.id}>
     *                     {record.name || 'Unnamed record'}
     *                 </li>
     *             ))}
     *         </ul>
     *     );
     * }
     * ```
     */
    selectRecords(opts?: RecordQueryResultOpts): TableOrViewQueryResult {
        return TableOrViewQueryResult.__createOrReuseQueryResult(
            this,
            this._recordStore,
            opts || {},
        );
    }
    /**
     * Select and load records from the table. Returns a {@link RecordQueryResult} promise where
     * record data has been loaded.
     *
     * Consider using {@link useRecords} or {@link useRecordIds} instead, unless you need the
     * features of a QueryResult (e.g. `queryResult.getRecordById`). Record hooks handle
     * loading/unloading and updating your UI automatically, but manually `select`ing records is
     * useful for one-off data processing.
     *
     * Once you've finished with your query, remember to call `queryResult.unloadData()`.
     *
     * @param opts Options for the query, such as sorts and fields.
     * @example
     * ```js
     * async function logRecordCountAsync(table) {
     *     const query = await table.selectRecordsAsync();
     *     console.log(query.recordIds.length);
     *     query.unloadData();
     * }
     * ```
     */
    async selectRecordsAsync(opts?: RecordQueryResultOpts): Promise<TableOrViewQueryResult> {
        const queryResult = this.selectRecords(opts);
        await queryResult.loadDataAsync();
        return queryResult;
    }
    /**
     * Returns the first view in the table where the type is one of `allowedViewTypes`, or `null` if
     * no such view exists in the table.
     *
     * @param allowedViewTypes An array of view types or a single view type to match against.
     * @param preferredViewOrViewId If a view or view ID is supplied and that view exists & has the
     * correct type, that view will be returned before checking the other views in the table.
     * @example
     * ```js
     * import {ViewType} from '@airtable/blocks/models';
     * const firstCalendarView = myTable.getFirstViewOfType(ViewType.CALENDAR);
     * if (firstCalendarView !== null) {
     *     console.log(firstCalendarView.name);
     * } else {
     *     console.log('No calendar views exist in the table');
     * }
     * ```
     */
    getFirstViewOfType(
        allowedViewTypes: Array<ViewType> | ViewType,
        preferredViewOrViewId?: View | ViewId | null,
    ): View | null {
        if (!Array.isArray(allowedViewTypes)) {
            allowedViewTypes = cast<Array<ViewType>>([allowedViewTypes]);
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
            }) ?? null
        );
    }
    /**
     * @internal
     */
    async getDefaultCellValuesByFieldIdAsync(opts?: {
        view?: View | null;
    }): Promise<{[key: string]: unknown}> {
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
     * Refer to {@link FieldType} for cell value write formats.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the updated
     * cell values to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param recordOrRecordId the record to update
     * @param fields cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * function updateRecord(record, recordFields) {
     *     if (table.hasPermissionToUpdateRecord(record, recordFields)) {
     *         table.updateRecordAsync(record, recordFields);
     *     }
     *     // The updated values will now show in your block (eg in
     *     // `table.selectRecords()` result) but are still being saved to Airtable
     *     // servers (e.g. other users may not be able to see them yet).
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
     *
     * // Cell values should generally have format matching the output of
     * // record.getCellValue() for the field being updated
     * updateRecord(record1, {
     *     'Category (single select)': {name: 'Recipe'},
     *     'Tags (multiple select)': [{name: 'Desserts'}, {id: 'someChoiceId'}],
     *     'Images (attachment)': [{url: 'http://mywebsite.com/cake.png'}],
     *     'Related posts (linked records)': [{id: 'someRecordId'}],
     * });
     * ```
     */
    async updateRecordAsync(
        recordOrRecordId: Record | RecordId,
        fields: ObjectMap<FieldId | string, unknown>,
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
     * Accepts partial input, in the same format as {@link updateRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param recordOrRecordId the record to update
     * @param fields cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * // Check if user can update specific fields for a specific record.
     * const updateRecordCheckResult =
     *     table.checkPermissionsForUpdateRecord(record, {
     *         'Post Title': 'How to make: orange-mango pound cake',
     *         'Publication Date': '2020-01-01',
     *     });
     * if (!updateRecordCheckResult.hasPermission) {
     *     alert(updateRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Like updateRecordAsync, you can use either field names or field IDs.
     * const updateRecordCheckResultWithFieldIds =
     *     table.checkPermissionsForUpdateRecord(record, {
     *         [postTitleField.id]: 'Cake decorating tips & tricks',
     *         [publicationDateField.id]: '2020-02-02',
     *     });
     *
     * // Check if user could update a given record, when you don't know the
     * // specific fields that will be updated yet (e.g. to check whether you should
     * // allow a user to select a certain record to update).
     * const updateUnknownFieldsCheckResult =
     *     table.checkPermissionsForUpdateRecord(record);
     *
     * // Check if user could update specific fields, when you don't know the
     * // specific record that will be updated yet. (for example, if the field is
     * // selected by the user and you want to check if your block can write to it).
     * const updateUnknownRecordCheckResult =
     *     table.checkPermissionsForUpdateRecord(undefined, {
     *         'My field name': 'updated value',
     *         // You can use undefined if you know you're going to update a field,
     *         // but don't know the new cell value yet.
     *         'Another field name': undefined,
     *     });
     *
     * // Check if user could perform updates within the table, without knowing the
     * // specific record or fields that will be updated yet (e.g., to render your
     * // block in "read only" mode).
     * const updateUnknownRecordAndFieldsCheckResult =
     *     table.checkPermissionsForUpdateRecord();
     * ```
     */
    checkPermissionsForUpdateRecord(
        recordOrRecordId?: Record | RecordId,
        fields?: ObjectMap<FieldId | string, unknown | void>,
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
     * Accepts partial input, in the same format as {@link updateRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param recordOrRecordId the record to update
     * @param fields cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
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
     * const canUpdateRecordWithFieldIds =
     *     table.hasPermissionToUpdateRecord(record, {
     *         [postTitleField.id]: 'Cake decorating tips & tricks',
     *         [publicationDateField.id]: '2020-02-02',
     *     });
     *
     * // Check if user could update a given record, when you don't know the
     * // specific fields that will be updated yet (e.g. to check whether you should
     * // allow a user to select a certain record to update).
     * const canUpdateUnknownFields = table.hasPermissionToUpdateRecord(record);
     *
     * // Check if user could update specific fields, when you don't know the
     * // specific record that will be updated yet (e.g. if the field is selected
     * // by the user and you want to check if your block can write to it).
     * const canUpdateUnknownRecord =
     *     table.hasPermissionToUpdateRecord(undefined, {
     *         'My field name': 'updated value',
     *         // You can use undefined if you know you're going to update a field,
     *         // but don't know the new cell value yet.
     *         'Another field name': undefined,
     *     });
     *
     * // Check if user could perform updates within the table, without knowing the
     * // specific record or fields that will be updated yet. (for example, to
     * // render your block in "read only" mode)
     * const canUpdateUnknownRecordAndFields = table.hasPermissionToUpdateRecord();
     * ```
     */
    hasPermissionToUpdateRecord(
        recordOrRecordId?: Record | RecordId,
        fields?: ObjectMap<FieldId | string, unknown | void>,
    ): boolean {
        return this.checkPermissionsForUpdateRecord(recordOrRecordId, fields).hasPermission;
    }
    /**
     * Updates cell values for records.
     *
     * Throws an error if the user does not have permission to update the given cell values in
     * the records, or if invalid input is provided (eg. invalid cell values).
     *
     * Refer to {@link FieldType} for cell value write formats.
     *
     * You may only update up to 50 records in one call to `updateRecordsAsync`.
     * See [Write back to Airtable](/guides/write-back-to-airtable) for more information
     * about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * updates to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param records Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @example
     * ```js
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
     *     // Cell values should generally have format matching the output of
     *     // record.getCellValue() for the field being updated
     *     {
     *         id: record4.id,
     *         fields: {
     *             'Category (single select)': {name: 'Recipe'},
     *             'Tags (multiple select)': [{name: 'Desserts'}, {id: 'choiceId'}],
     *             'Images (attachment)': [{url: 'http://mywebsite.com/cake.png'}],
     *             'Related posts (linked records)': [{id: 'someRecordId'}],
     *         },
     *     },
     * ];
     *
     * function updateRecords() {
     *     if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
     *         table.updateRecordsAsync(recordsToUpdate);
     *     }
     *     // The records are now updated within your block (eg will be reflected in
     *     // `table.selectRecords()`) but are still being saved to Airtable servers
     *     // (e.g. they may not be updated for other users yet).
     * }
     *
     * async function updateRecordsAsync() {
     *     if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
     *         await table.updateRecordsAsync(recordsToUpdate);
     *     }
     *     // Record updates have been saved to Airtable servers.
     *     alert('records have been updated');
     * }
     * ```
     */
    async updateRecordsAsync(
        records: ReadonlyArray<{
            readonly id: RecordId;
            readonly fields: ObjectMap<FieldId | string, unknown>;
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
     * Accepts partial input, in the same format as {@link updateRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param records Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @example
     * ```js
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
     *         // Validating an update to a specific record, not knowing what
     *         // fields will be updated
     *         id: record3.id,
     *     },
     *     {
     *         // Validating an update to specific cell values, not knowing what
     *         // record will be updated
     *         fields: {
     *             'My field name': 'updated value for unknown record',
     *             // You can use undefined if you know you're going to update a
     *             // field, but don't know the new cell value yet.
     *             'Another field name': undefined,
     *         },
     *     },
     * ];
     *
     * const updateRecordsCheckResult =
     *     table.checkPermissionsForUpdateRecords(recordsToUpdate);
     * if (!updateRecordsCheckResult.hasPermission) {
     *     alert(updateRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially update records.
     * // Equivalent to table.checkPermissionsForUpdateRecord()
     * const updateUnknownRecordAndFieldsCheckResult =
     *     table.checkPermissionsForUpdateRecords();
     * ```
     */
    checkPermissionsForUpdateRecords(
        records?: ReadonlyArray<{
            readonly id?: RecordId | void;
            readonly fields?: ObjectMap<FieldId | string, unknown | void> | void;
        }>,
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
     * Accepts partial input, in the same format as {@link updateRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param records Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value)
     * @example
     * ```js
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
     *         // Validating an update to a specific record, not knowing what
     *         // fields will be updated
     *         id: record3.id,
     *     },
     *     {
     *         // Validating an update to specific cell values, not knowing what
     *         // record will be updated
     *         fields: {
     *             'My field name': 'updated value for unknown record',
     *             // You can use undefined if you know you're going to update a
     *             // field, but don't know the new cell value yet.
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
     * const canUpdateUnknownRecordsAndFields =
     *     table.hasPermissionToUpdateRecords();
     * ```
     */
    hasPermissionToUpdateRecords(
        records?: ReadonlyArray<{
            readonly id?: RecordId | void;
            readonly fields?: ObjectMap<FieldId | string, unknown | void> | void;
        }>,
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
     * @param recordOrRecordId the record to be deleted
     * @example
     * ```js
     * function deleteRecord(record) {
     *     if (table.hasPermissionToDeleteRecord(record)) {
     *         table.deleteRecordAsync(record);
     *     }
     *     // The record is now deleted within your block (eg will not be returned
     *     // in `table.selectRecords`) but it is still being saved to Airtable
     *     // servers (e.g. it may not look deleted to other users yet).
     * }
     *
     * async function deleteRecordAsync(record) {
     *     if (table.hasPermissionToDeleteRecord(record)) {
     *         await table.deleteRecordAsync(record);
     *     }
     *     // Record deletion has been saved to Airtable servers.
     *     alert('record has been deleted');
     * }
     * ```
     */
    async deleteRecordAsync(recordOrRecordId: Record | RecordId): Promise<void> {
        await this.deleteRecordsAsync([recordOrRecordId]);
    }
    /**
     * Checks whether the current user has permission to delete the specified record.
     *
     * Accepts optional input, in the same format as {@link deleteRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can delete the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param recordOrRecordId the record to be deleted
     * @example
     * ```js
     * // Check if user can delete a specific record
     * const deleteRecordCheckResult =
     *     table.checkPermissionsForDeleteRecord(record);
     * if (!deleteRecordCheckResult.hasPermission) {
     *     alert(deleteRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially delete a record.
     * // Use when you don't know the specific record you want to delete yet (for
     * // example, to show/hide UI controls that let you select a record to delete).
     * const deleteUnknownRecordCheckResult =
     *     table.checkPermissionsForDeleteRecord();
     * ```
     */
    checkPermissionsForDeleteRecord(recordOrRecordId?: Record | RecordId): PermissionCheckResult {
        return this.checkPermissionsForDeleteRecords(
            recordOrRecordId ? [recordOrRecordId] : undefined,
        );
    }
    /**
     * An alias for `checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission`.
     *
     * Checks whether the current user has permission to delete the specified record.
     *
     * Accepts optional input, in the same format as {@link deleteRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param recordOrRecordId the record to be deleted
     * @example
     * ```js
     * // Check if user can delete a specific record
     * const canDeleteRecord = table.hasPermissionToDeleteRecord(record);
     * if (!canDeleteRecord) {
     *     alert('not allowed');
     * }
     *
     * // Check if user could potentially delete a record.
     * // Use when you don't know the specific record you want to delete yet (for
     * // example, to show/hide UI controls that let you select a record to delete).
     * const canDeleteUnknownRecord = table.hasPermissionToDeleteRecord();
     * ```
     */
    hasPermissionToDeleteRecord(recordOrRecordId?: Record | RecordId): boolean {
        return this.checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission;
    }
    /**
     * Delete the given records.
     *
     * Throws an error if the user does not have permission to delete the given records.
     *
     * You may only delete up to 50 records in one call to `deleteRecordsAsync`.
     * See [Write back to Airtable](/guides/write-back-to-airtable#size-limits-rate-limits) for
     * more information about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * delete to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * @param recordsOrRecordIds Array of Records and RecordIds
     * @example
     * ```js
     *
     * function deleteRecords(records) {
     *     if (table.hasPermissionToDeleteRecords(records)) {
     *         table.deleteRecordsAsync(records);
     *     }
     *     // The records are now deleted within your block (eg will not be
     *     // returned in `table.selectRecords()`) but are still being saved to
     *     // Airtable servers (e.g. they may not look deleted to other users yet).
     * }
     *
     * async function deleteRecordsAsync(records) {
     *     if (table.hasPermissionToDeleteRecords(records)) {
     *         await table.deleteRecordsAsync(records);
     *     }
     *     // Record deletions have been saved to Airtable servers.
     *     alert('records have been deleted');
     * }
     * ```
     */
    async deleteRecordsAsync(recordsOrRecordIds: ReadonlyArray<Record | RecordId>): Promise<void> {
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
     * Accepts optional input, in the same format as {@link deleteRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can delete the specified records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param recordsOrRecordIds the records to be deleted
     * @example
     * ```js
     * // Check if user can delete specific records
     * const deleteRecordsCheckResult =
     *     table.checkPermissionsForDeleteRecords([record1, record2]);
     * if (!deleteRecordsCheckResult.hasPermission) {
     *     alert(deleteRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially delete records.
     * // Use when you don't know the specific records you want to delete yet (for
     * // example, to show/hide UI controls that let you select records to delete).
     * // Equivalent to table.hasPermissionToDeleteRecord()
     * const deleteUnknownRecordsCheckResult =
     *     table.checkPermissionsForDeleteRecords();
     * ```
     */
    checkPermissionsForDeleteRecords(
        recordsOrRecordIds?: ReadonlyArray<Record | RecordId>,
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
     * Accepts optional input, in the same format as {@link deleteRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param recordsOrRecordIds the records to be deleted
     * @example
     * ```js
     * // Check if user can delete specific records
     * const canDeleteRecords =
     *     table.hasPermissionToDeleteRecords([record1, record2]);
     * if (!canDeleteRecords) {
     *     alert('not allowed!');
     * }
     *
     * // Check if user could potentially delete records.
     * // Use when you don't know the specific records you want to delete yet (for
     * // example, to show/hide UI controls that let you select records to delete).
     * // Equivalent to table.hasPermissionToDeleteRecord()
     * const canDeleteUnknownRecords = table.hasPermissionToDeleteRecords();
     * ```
     */
    hasPermissionToDeleteRecords(recordsOrRecordIds?: ReadonlyArray<Record | RecordId>): boolean {
        return this.checkPermissionsForDeleteRecords(recordsOrRecordIds).hasPermission;
    }

    /**
     * Creates a new record with the specified cell values.
     *
     * Throws an error if the user does not have permission to create the given records, or
     * if invalid input is provided (eg. invalid cell values).
     *
     * Refer to {@link FieldType} for cell value write formats.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the new
     * record to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * The returned promise will resolve to the RecordId of the new record once it is persisted.
     *
     * @param fields object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * function createNewRecord(recordFields) {
     *     if (table.hasPermissionToCreateRecord(recordFields)) {
     *         table.createRecordAsync(recordFields);
     *     }
     *     // You can now access the new record in your block (eg
     *     // `table.selectRecords()`) but it is still being saved to Airtable
     *     // servers (e.g. other users may not be able to see it yet).
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
     *
     * // Cell values should generally have format matching the output of
     * // record.getCellValue() for the field being updated
     * createNewRecord({
     *     'Project Name': 'Cat video 2'
     *     'Category (single select)': {name: 'Video'},
     *     'Tags (multiple select)': [{name: 'Cats'}, {id: 'someChoiceId'}],
     *     'Assets (attachment)': [{url: 'http://mywebsite.com/cats.mp4'}],
     *     'Related projects (linked records)': [{id: 'someRecordId'}],
     * });
     * ```
     */
    async createRecordAsync(fields: ObjectMap<FieldId | string, unknown> = {}): Promise<RecordId> {
        const recordIds = await this.createRecordsAsync([{fields}]);
        return recordIds[0];
    }

    /**
     * Checks whether the current user has permission to create the specified record.
     *
     * Accepts partial input, in the same format as {@link createRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can create the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param fields object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * // Check if user can create a specific record, when you already know what
     * // fields/cell values will be set for the record.
     * const createRecordCheckResult = table.checkPermissionsForCreateRecord({
     *     'Project Name': 'Advertising campaign',
     *     'Budget': 100,
     * });
     * if (!createRecordCheckResult.hasPermission) {
     *     alert(createRecordCheckResult.reasonDisplayString);
     * }
     *
     * // Like createRecordAsync, you can use either field names or field IDs.
     * const checkResultWithFieldIds = table.checkPermissionsForCreateRecord({
     *     [projectNameField.id]: 'Cat video',
     *     [budgetField.id]: 200,
     * });
     *
     * // Check if user could potentially create a record.
     * // Use when you don't know the specific fields/cell values yet (for example,
     * // to show or hide UI controls that let you start creating a record.)
     * const createUnknownRecordCheckResult =
     *     table.checkPermissionsForCreateRecord();
     * ```
     */
    checkPermissionsForCreateRecord(
        fields?: ObjectMap<FieldId | string, unknown | void>,
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
     * Accepts partial input, in the same format as {@link createRecordAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param fields object mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * // Check if user can create a specific record, when you already know what
     * // fields/cell values will be set for the record.
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
     * // Use when you don't know the specific fields/cell values yet (for example,
     * // to show or hide UI controls that let you start creating a record.)
     * const canCreateUnknownRecord = table.hasPermissionToCreateRecord();
     * ```
     */
    hasPermissionToCreateRecord(fields?: ObjectMap<FieldId | string, unknown | void>): boolean {
        return this.checkPermissionsForCreateRecord(fields).hasPermission;
    }
    /**
     * Creates new records with the specified cell values.
     *
     * Throws an error if the user does not have permission to create the given records, or
     * if invalid input is provided (eg. invalid cell values).
     *
     * Refer to {@link FieldType} for cell value write formats.
     *
     * You may only create up to 50 records in one call to `createRecordsAsync`.
     * See [Write back to Airtable](/guides/write-back-to-airtable#size-limits-rate-limits) for
     * more information about write limits.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the new
     * record to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in your block
     * before the promise resolves.
     *
     * The returned promise will resolve to an array of RecordIds of the new records once the new
     * records are persisted.
     *
     * @param records Array of objects with a `fields` key mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * const recordDefs = [
     *     // Fields can be specified by name or ID
     *     {
     *          fields: {
     *              'Project Name': 'Advertising campaign',
     *              'Budget': 100,
     *          },
     *     },
     *     {
     *          fields: {
     *              [projectNameField.id]: 'Cat video',
     *              [budgetField.id]: 200,
     *          },
     *     },
     *     // Specifying no fields will create a new record with no cell values set
     *     {
     *          fields: {},
     *     },
     *     // Cell values should generally have format matching the output of
     *     // record.getCellValue() for the field being updated
     *     {
     *          fields: {
     *              'Project Name': 'Cat video 2'
     *              'Category (single select)': {name: 'Video'},
     *              'Tags (multiple select)': [{name: 'Cats'}, {id: 'choiceId'}],
     *              'Assets (attachment)': [{url: 'http://mywebsite.com/cats.mp4'}],
     *              'Related projects (linked records)': [{id: 'someRecordId'}],
     *          },
     *     },
     * ];
     *
     * function createNewRecords() {
     *     if (table.hasPermissionToCreateRecords(recordDefs)) {
     *         table.createRecordsAsync(recordDefs);
     *     }
     *     // You can now access the new records in your block (e.g.
     *     // `table.selectRecords()`) but they are still being saved to Airtable
     *     // servers (e.g. other users may not be able to see them yet.)
     * }
     *
     * async function createNewRecordsAsync() {
     *     if (table.hasPermissionToCreateRecords(recordDefs)) {
     *         const newRecordIds = await table.createRecordsAsync(recordDefs);
     *     }
     *     // New records have been saved to Airtable servers.
     *     alert(`new records with IDs ${newRecordIds} have been created`);
     * }
     * ```
     */
    async createRecordsAsync(
        records: ReadonlyArray<{fields: ObjectMap<FieldId | string, unknown>}>,
    ): Promise<Array<RecordId>> {
        const recordsToCreate = records.map(recordDef => {
            const recordDefKeys = keys(recordDef);
            let fields: ObjectMap<FieldId | string, unknown>;
            if (recordDefKeys.length === 1 && recordDefKeys[0] === 'fields') {
                fields = recordDef.fields;
            } else {
                warning([
                    'Table.createRecordsAsync(): passing objects with field ids/names directly is deprecated and will be removed in a future version.',
                    'Pass field ids/names & values under the `fields` key instead:',
                    '',
                    'myTable.createRecordsAsync([{',
                    '    fields: {',
                    "        myField: 'A cell value',",
                    '    },',
                    '}]);',
                    '',
                    'See: https://airtable.com/developers/blocks/api/models/Table#createRecordsAsync',
                ]);
                fields = recordDef as ObjectMap<FieldId | string, unknown>;
            }
            return {
                id: this._airtableInterface.idGenerator.generateRecordId(),
                cellValuesByFieldId: this._cellValuesByFieldIdOrNameToCellValuesByFieldId(fields),
            };
        });

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
     * Accepts partial input, in the same format as {@link createRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * Returns `{hasPermission: true}` if the current user can create the specified records,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param records Array of objects mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * // Check if user can create specific records, when you already know what
     * // fields/cell values will be set for the records.
     * const createRecordsCheckResult = table.checkPermissionsForCreateRecords([
     *     // Like createRecordsAsync, fields can be specified by name or ID
     *     {
     *          fields: {
     *              'Project Name': 'Advertising campaign',
     *              'Budget': 100,
     *          },
     *     },
     *     {
     *          fields: {
     *              [projectNameField.id]: 'Cat video',
     *              [budgetField.id]: 200,
     *          },
     *     },
     *     {},
     * ]);
     * if (!createRecordsCheckResult.hasPermission) {
     *     alert(createRecordsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially create records.
     * // Use when you don't know the specific fields/cell values yet (for example,
     * // to show or hide UI controls that let you start creating records.)
     * // Equivalent to table.checkPermissionsForCreateRecord()
     * const createUnknownRecordCheckResult =
     *     table.checkPermissionsForCreateRecords();
     * ```
     */
    checkPermissionsForCreateRecords(
        records?: ReadonlyArray<{
            readonly fields?: ObjectMap<FieldId | string, unknown | void> | void;
        }>,
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
     * Accepts partial input, in the same format as {@link createRecordsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param records Array of objects mapping `FieldId` or field name to value for that field.
     * @example
     * ```js
     * // Check if user can create specific records, when you already know what fields/cell values
     * // will be set for the records.
     * const canCreateRecords = table.hasPermissionToCreateRecords([
     *     // Like createRecordsAsync, fields can be specified by name or ID
     *     {
     *          fields: {
     *              'Project Name': 'Advertising campaign',
     *              'Budget': 100,
     *          }
     *     },
     *     {
     *          fields: {
     *              [projectNameField.id]: 'Cat video',
     *              [budgetField.id]: 200,
     *          }
     *     },
     *     {},
     * ]);
     * if (!canCreateRecords) {
     *     alert('not allowed');
     * }
     *
     * // Check if user could potentially create records.
     * // Use when you don't know the specific fields/cell values yet (for example,
     * // to show or hide UI controls that let you start creating records).
     * // Equivalent to table.hasPermissionToCreateRecord()
     * const canCreateUnknownRecords = table.hasPermissionToCreateRecords();
     * ```
     */
    hasPermissionToCreateRecords(
        records?: ReadonlyArray<{
            readonly fields?: ObjectMap<FieldId | string, unknown | void> | void;
        }>,
    ): boolean {
        return this.checkPermissionsForCreateRecords(records).hasPermission;
    }
    /** @internal */
    _cellValuesByFieldIdOrNameToCellValuesByFieldId(
        cellValuesByFieldIdOrName: ObjectMap<FieldId | string, unknown>,
    ): ObjectMap<FieldId, unknown> {
        return Object.fromEntries(
            entries(cellValuesByFieldIdOrName).map(([fieldIdOrName, cellValue]) => {
                const field = this.__getFieldMatching(fieldIdOrName);
                return [field.id, cellValue];
            }),
        );
    }
    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * Checks whether the current user has permission to create a field in this table.
     *
     * Accepts partial input, in the same format as {@link unstable_createFieldAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param name name for the field. must be case-insensitive unique for the table
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     *
     * ```js
     * const createFieldCheckResult = table.unstable_checkPermissionsForCreateField();
     *
     * if (!createFieldCheckResult.hasPermission) {
     *     alert(createFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    unstable_checkPermissionsForCreateField(
        name?: string,
        type?: FieldType,
        options?: FieldOptions | null,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.CREATE_SINGLE_FIELD,
            tableId: this.id,
            id: undefined, 
            name,
            config: type
                ? {
                      type: type,
                      ...(options ? {options} : null),
                  }
                : undefined,
        });
    }

    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * An alias for `unstable_checkPermissionsForCreateField(name, type, options).hasPermission`.
     *
     * Checks whether the current user has permission to create a field in this table.
     *
     * Accepts partial input, in the same format as {@link unstable_createFieldAsync}.
     *
     * @param name name for the field. must be case-insensitive unique for the table
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     *
     * ```js
     * const canCreateField = table.unstable_hasPermissionToCreateField();
     *
     * if (!canCreateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    unstable_hasPermissionToCreateField(
        name?: string,
        type?: FieldType,
        options?: FieldOptions | null,
    ): boolean {
        return this.unstable_checkPermissionsForCreateField(name, type, options).hasPermission;
    }

    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * Creates a new field.
     *
     * Similar to creating a field from the Airtable UI, the new field will not be visible
     * in views that have other hidden fields and views that are publicly shared.
     *
     * Throws an error if the user does not have permission to create a field, if invalid
     * name, type or options are provided, or if creating fields of this type is not supported.
     *
     * Refer to {@link FieldType} for supported field types, the write format for options, and
     * other specifics for certain field types.
     *
     * This action is asynchronous. Unlike new records, new fields are **not** created
     * optimistically locally. You must `await` the returned promise before using the new
     * field in your block.
     *
     * @param name name for the field. must be case-insensitive unique
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     * @example
     * ```js
     * async function createNewSingleLineTextField(table, name) {
     *     if (table.unstable_hasPermissionToCreateField(name, FieldType.SINGLE_LINE_TEXT)) {
     *         await table.unstable_createFieldAsync(name, FieldType.SINGLE_LINE_TEXT);
     *     }
     * }
     *
     * async function createNewCheckboxField(table, name) {
     *     const options = {
     *         icon: 'check',
     *         color: 'greenBright',
     *     };
     *     if (table.unstable_hasPermissionToCreateField(name, FieldType.CHECKBOX, options)) {
     *         await table.unstable_createFieldAsync(name, FieldType.CHECKBOX, options);
     *     }
     * }
     *
     * async function createNewDateField(table, name) {
     *     const options = {
     *         dateFormat: {
     *             name: 'iso',
     *         },
     *     };
     *     if (table.unstable_hasPermissionToCreateField(name, FieldType.DATE, options)) {
     *         await table.unstable_createFieldAsync(name, FieldType.DATE, options);
     *     }
     * }
     * ```
     */
    async unstable_createFieldAsync(
        name: string,
        type: FieldType,
        options?: FieldOptions | null,
    ): Promise<Field> {
        const fieldId = this._airtableInterface.idGenerator.generateFieldId();

        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.CREATE_SINGLE_FIELD,
            tableId: this.id,
            id: fieldId,
            name,
            config: {
                type: type,
                ...(options ? {options} : null),
            },
        });

        return this.getFieldById(fieldId);
    }
    /**
     * @internal
     */
    __getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field {
        let field: Field | null;
        if (fieldOrFieldIdOrFieldName instanceof Field) {
            if (fieldOrFieldIdOrFieldName.parentTable.id !== this.id) {
                throw spawnError(
                    "Field '%s' is from a different table than table '%s'",
                    fieldOrFieldIdOrFieldName.name,
                    this.name,
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
                    this.name,
                );
            }
        }

        if (field.isDeleted) {
            throw spawnError("Field '%s' was deleted from table '%s'", field.name, this.name);
        }
        return field;
    }
    /**
     * @internal
     */
    __getViewMatching(viewOrViewIdOrViewName: View | string): View {
        let view: View | null;
        if (viewOrViewIdOrViewName instanceof View) {
            if (viewOrViewIdOrViewName.parentTable.id !== this.id) {
                throw spawnError(
                    "View '%s' is from a different table than table '%s'",
                    viewOrViewIdOrViewName.name,
                    this.name,
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
                    this.name,
                );
            }
        }

        if (view.isDeleted) {
            throw spawnError("View '%s' was deleted from table '%s'", view.name, this.name);
        }
        return view;
    }
    /**
     * @internal
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<TableData>): boolean {
        let didTableSchemaChange = false;
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
        if (dirtyPaths.description) {
            this._onChange(WatchableTableKeys.description);
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

            const addedFieldIds: Array<FieldId> = [];
            const removedFieldIds: Array<FieldId> = [];
            for (const [fieldId, dirtyFieldPaths] of entries(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths && dirtyFieldPaths._isDirty) {
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
        this._recordStore.triggerOnChangeForDirtyPaths(dirtyPaths);
        return didTableSchemaChange;
    }
    /**
     * @internal
     */
    __getFieldNamesById(): {[key: string]: string} {
        if (!this._cachedFieldNamesById) {
            const fieldNamesById: ObjectMap<FieldId, string> = {};
            for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
                fieldNamesById[fieldId] = fieldData.name;
            }
            this._cachedFieldNamesById = fieldNamesById;
        }
        return this._cachedFieldNamesById;
    }
}

export default Table;
