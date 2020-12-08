/** @module @airtable/blocks/models: View */ /** */
import Sdk from '../sdk';
import {ViewData, ViewType} from '../types/view';
import {isEnumValue, ObjectValues, FlowAnyObject} from '../private_utils';
import AbstractModel from './abstract_model';
import ObjectPool from './object_pool';
import Table from './table';
import RecordQueryResult, {RecordQueryResultOpts} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import ViewDataStore from './view_data_store';
import ViewMetadataQueryResult from './view_metadata_query_result';
import * as RecordColoring from './record_coloring';

const WatchableViewKeys = Object.freeze({
    name: 'name' as const,
});

/**
 * A key in {@link View} that can be watched.
 * - `name`
 */
export type WatchableViewKey = ObjectValues<typeof WatchableViewKeys>;

/**
 * A class that represents an Airtable view. Every {@link Table} has one or more views.
 *
 * @docsPath models/View
 */
class View extends AbstractModel<ViewData, WatchableViewKey> {
    /** @internal */
    static _className = 'View';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewKeys, key);
    }
    /** @internal */
    _parentTable: Table;
    /** @internal */
    _viewDataStore: ViewDataStore;
    /** @internal */
    __viewMetadataQueryResultPool: ObjectPool<
        ViewMetadataQueryResult,
        typeof ViewMetadataQueryResult
    >;

    /**
     * @internal
     */
    constructor(sdk: Sdk, parentTable: Table, viewDataStore: ViewDataStore, viewId: string) {
        super(sdk, viewId);

        this._parentTable = parentTable;
        this._viewDataStore = viewDataStore;
        this.__viewMetadataQueryResultPool = new ObjectPool(ViewMetadataQueryResult);
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        return tableData?.viewsById[this._id] ?? null;
    }
    /**
     * The table that this view belongs to. Should never change because views aren't moved between tables.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @example
     * ```js
     * const view = myTable.getViewByName('Grid View');
     * console.log(view.parentTable.id === myTable.id);
     * // => true
     * ```
     */
    get parentTable(): Table {
        return this._parentTable;
    }
    /**
     * The name of the view. Can be watched.
     *
     * @example
     * ```js
     * console.log(myView.name);
     * // => 'Grid view'
     * ```
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * The type of the view, such as Grid, Calendar, or Kanban. Should never change because view types cannot be modified.
     *
     * @example
     * ```js
     * console.log(myView.type);
     * // => 'kanban'
     * ```
     */
    get type(): ViewType {
        return this._data.type;
    }
    /**
     * The URL for the view. You can visit this URL in the browser to be taken to the view in the Airtable UI.
     *
     * @example
     * ```js
     * console.log(myView.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx/viwxxxxxxxxxxxxxx'
     * ```
     */
    get url(): string {
        return this._sdk.__airtableInterface.urlConstructor.getViewUrl(
            this.id,
            this.parentTable.id,
        );
    }
    /**
     * Select records from the view. Returns a {@link RecordQueryResult}.
     *
     * Consider using {@link useRecords} or {@link useRecordIds} instead, unless you need the
     * features of a QueryResult (e.g. `queryResult.getRecordById`). Record hooks handle
     * loading/unloading and updating your UI automatically, but manually `select`ing records is
     * useful for one-off data processing.
     *
     * @param opts Options for the query, such as sorts, fields, and record coloring. By
     * default, records will be coloured according to the view.
     * @example
     * ```js
     * import {useBase, useRecords} from '@airtable/blocks/UI';
     * import React from 'react';
     *
     * function TodoList() {
     *     const base = useBase();
     *     const table = base.getTableByName('Tasks');
     *     const view = table.getViewByName('Grid view');
     *
     *     const queryResult = view.selectRecords();
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
    selectRecords(opts: RecordQueryResultOpts = {}): TableOrViewQueryResult {
        const normalizedOpts = RecordQueryResult._normalizeOpts(
            this.parentTable,
            this._viewDataStore.parentRecordStore,
            {
                ...opts,
                recordColorMode:
                    opts.recordColorMode === undefined
                        ? RecordColoring.modes.byView(this)
                        : opts.recordColorMode,
            },
        );

        return this.parentTable.__tableOrViewQueryResultPool.getObjectForReuse(
            this._sdk,
            this,
            normalizedOpts,
        );
    }
    /**
     * Select and load records from the view. Returns a {@link RecordQueryResult} promise where
     * record data has been loaded.
     *
     * Consider using {@link useRecords} or {@link useRecordIds} instead, unless you need the
     * features of a QueryResult (e.g. `queryResult.getRecordById`). Record hooks handle
     * loading/unloading and updating your UI automatically, but manually `select`ing records is
     * useful for one-off data processing.
     *
     * Once you've finished with your query, remember to call `queryResult.unloadData()`.
     *
     * @param opts Options for the query, such as sorts, fields, and record coloring. By
     * default, records will be coloured according to the view.
     * @example
     * ```js
     * async function getRecordCountAsync(view) {
     *     const query = await view.selectRecordsAsync();
     *     const recordCount = query.recordIds.length;
     *     query.unloadData();
     *     return recordCount;
     * }
     * ```
     */
    async selectRecordsAsync(opts: RecordQueryResultOpts = {}): Promise<TableOrViewQueryResult> {
        const queryResult = this.selectRecords(opts);
        await queryResult.loadDataAsync();
        return queryResult;
    }
    /**
     * Select the field order and visible fields from the view. Returns a
     * {@link ViewMetadataQueryResult}.
     *
     * Consider using {@link useViewMetadata} instead if you're creating a React UI. The
     * {@link useViewMetadata} hook handles loading/unloading and updating your UI automatically,
     * but manually `select`ing data is useful for one-off data processing.
     *
     * @example
     * ```js
     * async function loadMetadataForViewAsync(view) {
     *     const viewMetadata = view.selectMetadata();
     *     await viewMetadata.loadDataAsync();
     *
     *     console.log('Visible fields:');
     *     console.log(viewMetadata.visibleFields.map(field => field.name));
     *     // => ['Field 1', 'Field 2', 'Field 3']
     *
     *     console.log('All fields:');
     *     console.log(viewMetadata.allFields.map(field => field.name));
     *     // => ['Field 1', 'Field 2', 'Field 3', 'Hidden field 4']
     *
     *     viewMetadata.unloadData();
     * }
     * ```
     */
    selectMetadata(): ViewMetadataQueryResult {
        return this.__viewMetadataQueryResultPool.getObjectForReuse(
            this._sdk,
            this,
            this._viewDataStore,
        );
    }
    /**
     * Select and load the field order and visible fields from the view. Returns a
     * {@link ViewMetadataQueryResult} promise where the metadata has already been loaded.
     *
     * Consider using {@link useViewMetadata} instead if you're creating a React UI. The
     * {@link useViewMetadata} hook handles loading/unloading and updating your UI automatically,
     * but manually `select`ing data is useful for one-off data processing.
     *
     * @example
     * ```js
     * async function loadMetadataForViewAsync(view) {
     *     const viewMetadata = await view.selectMetadata();
     *
     *     console.log('Visible fields:');
     *     console.log(viewMetadata.visibleFields.map(field => field.name));
     *     // => ['Field 1', 'Field 2', 'Field 3']
     *
     *     console.log('All fields:');
     *     console.log(viewMetadata.allFields.map(field => field.name));
     *     // => ['Field 1', 'Field 2', 'Field 3', 'Hidden field 4']
     *
     *     viewMetadata.unloadData();
     * }
     * ```
     */
    async selectMetadataAsync(): Promise<ViewMetadataQueryResult> {
        const queryResult = this.selectMetadata();
        await queryResult.loadDataAsync();
        return queryResult;
    }

    /**
     * @internal
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject): boolean {
        let didViewSchemaChange = false;
        this._viewDataStore.triggerOnChangeForDirtyPaths(dirtyPaths);
        if (dirtyPaths.name) {
            this._onChange(WatchableViewKeys.name);
            didViewSchemaChange = true;
        }
        return didViewSchemaChange;
    }
}

export default View;
