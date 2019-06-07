// @flow
import {type BaseData} from '../types/base';
import {type ViewData, type ViewType} from '../types/view';
import {isEnumValue} from '../private_utils';
import AbstractModel from './abstract_model';
import type Table from './table';
import type Field from './field';
import {type QueryResultOpts} from './query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';

const viewTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/view_types/view_type_provider',
);
const airtableUrls = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/airtable_urls',
);

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableViewKeys = Object.freeze({
    name: ('name': 'name'),
    visibleFields: ('visibleFields': 'visibleFields'),
    allFields: ('allFields': 'allFields'),
});
export type WatchableViewKey = $Values<typeof WatchableViewKeys>;

/** Model class representing a view in a table. */
class View extends AbstractModel<ViewData, WatchableViewKey> {
    static _className = 'View';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewKeys, key);
    }
    _parentTable: Table;
    _viewDataStore: ViewDataStore;
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
    get _dataOrNullIfDeleted(): ViewData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        return tableData.viewsById[this._id] || null;
    }
    /** */
    get parentTable(): Table {
        return this._parentTable;
    }
    /** The name of the view. Can be watched. */
    get name(): string {
        return this._data.name;
    }
    /** The type of the view. Will not change. */
    get type(): ViewType {
        return viewTypeProvider.getApiViewType(this._data.type);
    }
    /** */
    get url(): string {
        return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    /** */
    selectRecords(opts?: QueryResultOpts): TableOrViewQueryResult {
        return TableOrViewQueryResult.__createOrReuseQueryResult(
            this,
            this._viewDataStore.parentRecordStore,
            opts || {},
        );
    }
    /**
     * All the fields in the table, including fields that are hidden in this
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */
    get allFields(): Array<Field> {
        return this._viewDataStore.allFieldIds.map(fieldId =>
            this.parentTable.getFieldById(fieldId),
        );
    }
    /**
     * The fields that are not hidden in this view.
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */
    get visibleFields(): Array<Field> {
        return this._viewDataStore.visibleFieldIds.map(fieldId =>
            this.parentTable.getFieldById(fieldId),
        );
    }

    watch(
        keys: WatchableViewKey | Array<WatchableViewKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableViewKey> {
        const validKeys = super.watch(keys, callback, context);

        for (const validKey of validKeys) {
            if (validKey === WatchableViewKeys.visibleFields) {
                this._viewDataStore.watch(
                    WatchableViewDataStoreKeys.visibleFieldIds,
                    callback,
                    context,
                );
            }
            if (validKey === WatchableViewKeys.allFields) {
                this._viewDataStore.watch(
                    WatchableViewDataStoreKeys.allFieldIds,
                    callback,
                    context,
                );
            }
        }

        return validKeys;
    }

    unwatch(
        keys: WatchableViewKey | Array<WatchableViewKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableViewKey> {
        const validKeys = super.unwatch(keys, callback, context);

        for (const validKey of validKeys) {
            if (validKey === WatchableViewKeys.visibleFields) {
                this._viewDataStore.unwatch(
                    WatchableViewDataStoreKeys.visibleFieldIds,
                    callback,
                    context,
                );
            }
            if (validKey === WatchableViewKeys.allFields) {
                this._viewDataStore.unwatch(
                    WatchableViewDataStoreKeys.allFieldIds,
                    callback,
                    context,
                );
            }
        }

        return validKeys;
    }

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
