// @flow
import {type BaseData} from '../types/base';
import {type ViewData, type ViewType} from '../types/view';
import {isEnumValue} from '../private_utils';
import AbstractModel from './abstract_model';
import type Table from './table';
import {type RecordQueryResultOpts} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import type ViewDataStore from './view_data_store';
import ViewMetadataQueryResult from './view_metadata_query_result';
import * as RecordColoring from './record_coloring';

const viewTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/view_types/view_type_provider',
);
const airtableUrls = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/airtable_urls',
);

const WatchableViewKeys = Object.freeze({
    name: ('name': 'name'),
});
export type WatchableViewKey = $Values<typeof WatchableViewKeys>;

/**
 * A class that represents an Airtable view. Every {@link Table} has one or more views.
 */
class View extends AbstractModel<ViewData, WatchableViewKey> {
    static _className = 'View';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewKeys, key);
    }
    _parentTable: Table;
    _viewDataStore: ViewDataStore;
    /**
     * @hideconstructor
     */
    constructor(
        baseData: BaseData,
        parentTable: Table,
        viewDataStore: ViewDataStore,
        viewId: string,
    ) {
        super(baseData, viewId);

        this._parentTable = parentTable;
        this._viewDataStore = viewDataStore;

        Object.seal(this);
    }

    /**
     * @function id
     * @memberof View
     * @instance
     * @returns {string} This view's ID.
     * @example
     * console.log(myView.id);
     * // => 'viwxxxxxxxxxxxxxx'
     */

    /**
     * True if this view has been deleted.
     *
     * In general, it's best to avoid keeping a reference to a view past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted view (other than its ID) will throw. But if you do keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * view's data.
     *
     * @function isDeleted
     * @memberof View
     * @instance
     * @returns {boolean} `true` if the view has been deleted, `false` otherwise.
     * @example
     * if (!myView.isDeleted) {
     *     // Do things with myView
     * }
     */

    /**
     * @private
     */
    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.viewsById[this._id] || null;
    }
    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * @function
     * @returns The table that this view belongs to. Should never change because views aren't moved between tables.
     *
     * @example
     * const view = myTable.getViewByName('Grid View');
     * console.log(view.parentTable.id === myTable.id);
     * // => true
     */
    get parentTable(): Table {
        return this._parentTable;
    }
    /**
     * @function
     * @returns The name of the view. Can be watched.
     * @example
     * console.log(myView.name);
     * // => 'Grid view'
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * @function
     * @returns The type of the view, such as Grid, Calendar, or Kanban. Should never change because view types cannot be modified.
     * @example
     * console.log(myView.type);
     * // => 'kanban'
     */
    get type(): ViewType {
        return viewTypeProvider.getApiViewType(this._data.type);
    }
    /**
     * @function
     * @returns The URL for the view. You can visit this URL in the browser to be taken to the view in the Airtable UI.
     * @example
     * console.log(myView.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx/viwxxxxxxxxxxxxxx'
     */
    get url(): string {
        return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    /**
     * Select records from the view. Returns a query result. See {@RecordQueryResult} for more.
     *
     * @param [opts={}] Options for the query, such as sorts, fields, and record coloring. By
     * default, records will be coloured according to the view.
     * @returns A record query result.
     * @example
     * import {UI} from '@airtable/blocks';
     * import React from 'react';
     *
     * function TodoList() {
     *     const base = UI.useBase();
     *     const table = base.getTableByName('Tasks');
     *     const view = table.getViewByName('Grid view');
     *
     *     const queryResult = view.selectRecords();
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
    selectRecords(opts: RecordQueryResultOpts = {}): TableOrViewQueryResult {
        const defaultedOpts = {
            ...opts,
            recordColorMode:
                opts.recordColorMode === undefined
                    ? RecordColoring.modes.byView(this)
                    : opts.recordColorMode,
        };

        return TableOrViewQueryResult.__createOrReuseQueryResult(
            this,
            this._viewDataStore.parentRecordStore,
            defaultedOpts,
        );
    }
    /**
     * Select the field order and visible fields from the view. See {@ViewMetadataQueryResult} for more.
     *
     * @returns a {@ViewMetadataQueryResult}
     * @example
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
     */
    selectMetadata(): ViewMetadataQueryResult {
        return ViewMetadataQueryResult.__createOrReuseQueryResult(this, this._viewDataStore);
    }

    /**
     * Get notified of changes to the view.
     *
     * Watchable keys are:
     * - `'name'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof View
     * @instance
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof View
     * @instance
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param [context] the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
     */

    /**
     * @private
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object): boolean {
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
