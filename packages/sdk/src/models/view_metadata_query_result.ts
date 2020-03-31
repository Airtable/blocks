/** @module @airtable/blocks/models: View */ /** */
import {BaseData} from '../types/base';
import {FieldId} from '../types/field';
import {invariant} from '../error_utils';
import {isEnumValue, getLocallyUniqueId, ObjectValues} from '../private_utils';
import ObjectPool from './object_pool';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import ViewDataStore from './view_data_store';
import View from './view';
import Field from './field';

const WatchableViewMetadataKeys = {
    allFields: 'allFields' as const,
    visibleFields: 'visibleFields' as const,
    isDataLoaded: 'isDataLoaded' as const,
};

/**
 * A key in {@link ViewMetadataQueryResult} that can be watched.
 * - `allFields`
 * - `visibleFields`
 * - `isDataLoaded`
 */
type WatchableViewMetadataKey = ObjectValues<typeof WatchableViewMetadataKeys>;

/** @hidden */
interface ViewMetadata {
    visibleFieldIds: Array<FieldId> | null;
    allFieldIds: Array<FieldId> | null;
}

const viewMetadataQueryResultPool: ObjectPool<
    ViewMetadataQueryResult,
    {view: View}
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.parentView.id,
    getKeyFromObjectOptions: ({view}) => view.id,
    canObjectBeReusedForOptions: () => true,
});

/**
 * Contains information about a view that isn't loaded by default e.g. field order and visible fields.
 *
 * In a React component, we recommend using {@link useViewMetadata} instead.
 *
 * @example
 * ```js
 * async function loadMetadataForViewAsync(view) {
 *     const viewMetadata = view.selectMetadata();
 *     await viewMetadata.loadDataAsync();
 *
 *     console.log(viewMetadata.visibleField);
 *     // => [Field, Field, Field]
 *
 *     console.log(viewMetadata.allFields);
 *     // => [Field, Field, Field, Field, Field]
 *
 *     viewMetadata.unloadData();
 * }
 * ```
 * @docsPath models/query results/ViewMetadataQueryResult
 */
class ViewMetadataQueryResult extends AbstractModelWithAsyncData<
    ViewMetadata,
    WatchableViewMetadataKey
> {
    /** @internal */
    static _className = 'ViewMetadataQueryResult';

    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewMetadataKeys, key);
    }

    /** @internal */
    static _shouldLoadDataForKey(key: WatchableViewMetadataKey): boolean {
        return (
            key === WatchableViewMetadataKeys.allFields ||
            key === WatchableViewMetadataKeys.visibleFields
        );
    }

    /** @internal */
    static __createOrReuseQueryResult(
        view: View,
        viewDataStore: ViewDataStore,
    ): ViewMetadataQueryResult {
        const queryResult = viewMetadataQueryResultPool.getObjectForReuse({view});
        if (queryResult) {
            return queryResult;
        }

        return new ViewMetadataQueryResult(view.__baseData, view, viewDataStore);
    }

    /** */
    readonly parentView: View;
    /** @internal */
    readonly _viewDataStore: ViewDataStore;

    /** @internal */
    constructor(baseData: BaseData, parentView: View, viewDataStore: ViewDataStore) {
        super(baseData, getLocallyUniqueId('ViewMetadataQueryResult'));
        this.parentView = parentView;
        this._viewDataStore = viewDataStore;

        viewMetadataQueryResultPool.registerObjectForReuseWeak(this);
    }

    /** @internal */
    get _dataOrNullIfDeleted(): ViewMetadata | null {
        if (this._viewDataStore.isDeleted) {
            return null;
        }

        if (!this._viewDataStore.isDataLoaded) {
            return {
                visibleFieldIds: null,
                allFieldIds: null,
            };
        }

        return {
            visibleFieldIds: this._viewDataStore.visibleFieldIds,
            allFieldIds: this._viewDataStore.allFieldIds,
        };
    }

    /** @internal */
    _onChangeIsDataLoaded() {
        this._onChange(WatchableViewMetadataKeys.isDataLoaded);
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableViewMetadataKey>> {
        await this._viewDataStore.loadDataAsync();
        this._viewDataStore.watch('visibleFieldIds', this._onVisibleFieldIdsChange);
        this._viewDataStore.watch('allFieldIds', this._onAllFieldIdsChange);
        return [WatchableViewMetadataKeys.allFields, WatchableViewMetadataKeys.visibleFields];
    }

    /** @internal */
    _unloadData() {
        this._viewDataStore.unwatch('visibleFieldIds', this._onVisibleFieldIdsChange);
        this._viewDataStore.unwatch('allFieldIds', this._onAllFieldIdsChange);
        this._viewDataStore.unloadData();
    }

    /** @internal */
    _onVisibleFieldIdsChange = () => {
        this._onChange(WatchableViewMetadataKeys.visibleFields);
    };

    /** @internal */
    _onAllFieldIdsChange = () => {
        this._onChange(WatchableViewMetadataKeys.allFields);
    };

    /**
     * Returns every field in the table in the order they appear in this view. Watchable.
     */
    get allFields(): Array<Field> {
        const allFieldIds = this._data.allFieldIds;
        invariant(allFieldIds, 'view meta data is not loaded');
        return allFieldIds.map(fieldId => this.parentView.parentTable.getFieldById(fieldId));
    }

    /**
     * Returns every field visible in this view. Watchable.
     */
    get visibleFields(): Array<Field> {
        const visibleFieldIds = this._data.visibleFieldIds;
        invariant(visibleFieldIds, 'view meta data is not loaded');
        return visibleFieldIds.map(fieldId => this.parentView.parentTable.getFieldById(fieldId));
    }
}

export default ViewMetadataQueryResult;
