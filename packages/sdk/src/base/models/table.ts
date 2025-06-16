/** @module @airtable/blocks/models: Table */ /** */
import {TableCore, WatchableTableKeysCore} from '../../shared/models/table_core';
import {ViewType} from '../types/view';
import {spawnError} from '../../shared/error_utils';
import {entries, cast, isEnumValue, ObjectValues} from '../../shared/private_utils';
import BlockSdk from '../sdk';
import {FieldId, ViewId} from '../../shared/types/hyper_ids';
import {TableData} from '../types/table';
import {FieldType, FieldOptions} from '../../shared/types/field_core';
import {MutationTypes} from '../types/mutations';
import {BaseSdkMode} from '../../sdk_mode';
import {PermissionCheckResult} from '../../shared/types/mutations_core';
import {ChangedPathsForType} from '../../shared/models/base_core';
import RecordStore from './record_store';
import RecordQueryResult, {RecordQueryResultOpts} from './record_query_result';
import Field from './field';
import TableOrViewQueryResult from './table_or_view_query_result';
import View from './view';
import ObjectPool from './object_pool';
import Base from './base';

export const WatchableTableKeys = Object.freeze({
    ...WatchableTableKeysCore,
    views: 'views' as const,
});

/**
 * A key in {@link Table} that can be watched.
 * - `name`
 * - `description`
 * - `fields`
 * - `views`
 */
export type WatchableTableKey = ObjectValues<typeof WatchableTableKeys>;

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 *
 * @docsPath models/Table
 */
class Table extends TableCore<BaseSdkMode, WatchableTableKey> {
    /** @internal */
    static _className = 'Table';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableTableKeys, key);
    }
    /** @internal */
    _viewModelsById: {[key: string]: View};
    /** @internal */
    __tableOrViewQueryResultPool: ObjectPool<TableOrViewQueryResult, typeof TableOrViewQueryResult>;

    /** @internal */
    constructor(parentBase: Base, recordStore: RecordStore, tableId: string, sdk: BlockSdk) {
        super(parentBase, recordStore, tableId, sdk);

        this._viewModelsById = {}; 
        this.__tableOrViewQueryResultPool = new ObjectPool(TableOrViewQueryResult);
    }

    /** @internal */
    _constructField(fieldId: FieldId): Field {
        return new Field(this.parentBase.__sdk, this, fieldId);
    }

    /**
     * The URL for the table. You can visit this URL in the browser to be taken to the table in the Airtable UI.
     *
     * @example
     * ```js
     * console.log(myTable.url);
     * // => 'https://airtable.com/appxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx'
     * ```
     */
    get url(): string {
        return this._sdk.__airtableInterface.urlConstructor.getTableUrl(this.id);
    }

    /**
     * @internal
     */
    async getDefaultCellValuesByFieldIdAsync(opts?: {
        view?: View | null;
    }): Promise<{[key: string]: unknown}> {
        const viewId = opts && opts.view ? opts.view.id : null;
        const cellValuesByFieldId = await this._sdk.__airtableInterface.fetchDefaultCellValuesByFieldIdAsync(
            this._id,
            viewId,
        );
        return cellValuesByFieldId;
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
                    this._sdk,
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
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getViewByIdIfExists} or
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
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getViewById} or {@link getViewByName} methods
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
     * import {useBase, useRecords} from '@airtable/blocks/base/ui';
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
        const normalizedOpts = RecordQueryResult._normalizeOpts(
            this,
            this._recordStore,
            opts || {},
        );
        return this.__tableOrViewQueryResultPool.getObjectForReuse(this._sdk, this, normalizedOpts);
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
     * import {ViewType} from '@airtable/blocks/base/models';
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
     * Checks whether the current user has permission to create a field in this table.
     *
     * Accepts partial input, in the same format as {@link createFieldAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param name name for the field. must be case-insensitive unique for the table
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     * @param description description for the field. omit to leave blank
     *
     * @example
     * ```js
     * const createFieldCheckResult = table.checkPermissionsForCreateField();
     *
     * if (!createFieldCheckResult.hasPermission) {
     *     alert(createFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForCreateField(
        name?: string,
        type?: FieldType,
        options?: FieldOptions | null,
        description?: string | null,
    ): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
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
            description,
        });
    }

    /**
     * An alias for `checkPermissionsForCreateField(name, type, options, description).hasPermission`.
     *
     * Checks whether the current user has permission to create a field in this table.
     *
     * Accepts partial input, in the same format as {@link createFieldAsync}.
     *
     * @param name name for the field. must be case-insensitive unique for the table
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     * @param description description for the field. omit to leave blank
     *
     * @example
     * ```js
     * const canCreateField = table.hasPermissionToCreateField();
     *
     * if (!canCreateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToCreateField(
        name?: string,
        type?: FieldType,
        options?: FieldOptions | null,
        description?: string | null,
    ): boolean {
        return this.checkPermissionsForCreateField(name, type, options, description).hasPermission;
    }

    /**
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
     * field in your extension.
     *
     * @param name name for the field. must be case-insensitive unique
     * @param type type for the field
     * @param options options for the field. omit for fields without writable options
     * @param description description for the field. is optional and will be `''` if not specified
     * or if specified as `null`.
     *
     * @example
     * ```js
     * async function createNewSingleLineTextField(table, name) {
     *     if (table.hasPermissionToCreateField(name, FieldType.SINGLE_LINE_TEXT)) {
     *         await table.createFieldAsync(name, FieldType.SINGLE_LINE_TEXT);
     *     }
     * }
     *
     * async function createNewCheckboxField(table, name) {
     *     const options = {
     *         icon: 'check',
     *         color: 'greenBright',
     *     };
     *     if (table.hasPermissionToCreateField(name, FieldType.CHECKBOX, options)) {
     *         await table.createFieldAsync(name, FieldType.CHECKBOX, options);
     *     }
     * }
     *
     * async function createNewDateField(table, name) {
     *     const options = {
     *         dateFormat: {
     *             name: 'iso',
     *         },
     *     };
     *     if (table.hasPermissionToCreateField(name, FieldType.DATE, options)) {
     *         await table.createFieldAsync(name, FieldType.DATE, options);
     *     }
     * }
     * ```
     */
    async createFieldAsync(
        name: string,
        type: FieldType,
        options?: FieldOptions | null,
        description?: string | null,
    ): Promise<Field> {
        const fieldId = this._sdk.__airtableInterface.idGenerator.generateFieldId();

        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.CREATE_SINGLE_FIELD,
            tableId: this.id,
            id: fieldId,
            name,
            config: {
                type: type,
                ...(options ? {options} : null),
            },
            description: description ?? null,
        });

        return this.getFieldById(fieldId);
    }

    /** @internal */
    __triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<TableData>): boolean {
        let didTableSchemaChange = false;
        if (super.__triggerOnChangeForDirtyPaths(dirtyPaths)) {
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

        return didTableSchemaChange;
    }
}

export default Table;
