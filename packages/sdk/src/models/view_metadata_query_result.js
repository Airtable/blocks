// @flow
import {type BaseData} from '../types/base';
import {type FieldId} from '../types/field';
import {invariant} from '../error_utils';
import {isEnumValue, getLocallyUniqueId} from '../private_utils';
import ObjectPool from './object_pool';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import type ViewDataStore from './view_data_store';
import type View from './view';
import type Field from './field';

const WatchableViewMetadataKeys = {
    allFields: ('allFields': 'allFields'),
    visibleFields: ('visibleFields': 'visibleFields'),
    isDataLoaded: ('isDataLoaded': 'isDataLoaded'),
};

type WatchableViewMetadataKey = $Values<typeof WatchableViewMetadataKeys>;

type ViewMetadata = {|
    visibleFieldIds: Array<FieldId> | null,
    allFieldIds: Array<FieldId> | null,
|};

const viewMetadataQueryResultPool: ObjectPool<
    ViewMetadataQueryResult,
    {|view: View|},
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.parentView.id,
    getKeyFromObjectOptions: ({view}) => view.id,
    canObjectBeReusedForOptions: () => true,
});

/**
 * Contains information about a view that isn't loaded by default e.g. field order and visible fields.
 *
 * In a React component, you might want to use {@link useViewMetadata}.
 *
 * @example
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
 */
class ViewMetadataQueryResult extends AbstractModelWithAsyncData<
    ViewMetadata,
    WatchableViewMetadataKey,
> {
    static _className = 'ViewMetadataQueryResult';

    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewMetadataKeys, key);
    }

    static _shouldLoadDataForKey(key: WatchableViewMetadataKey): boolean {
        return (
            key === WatchableViewMetadataKeys.allFields ||
            key === WatchableViewMetadataKeys.visibleFields
        );
    }

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

    +parentView: View;
    +_viewDataStore: ViewDataStore;

    constructor(baseData: BaseData, parentView: View, viewDataStore: ViewDataStore) {
        super(baseData, getLocallyUniqueId('ViewMetadataQueryResult'));
        this.parentView = parentView;
        this._viewDataStore = viewDataStore;

        viewMetadataQueryResultPool.registerObjectForReuseWeak(this);
    }

    /**
     * Get notified of changes to the view meta data.
     *
     * Watchable keys are:
     * - `'visibleFields'`
     * - `'allFields'`
     * - `'isDataLoaded'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof ViewMetadataQueryResult
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
     * @memberof ViewMetadataQueryResult
     * @instance
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param [context] the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
     */

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

    _onChangeIsDataLoaded() {
        this._onChange(WatchableViewMetadataKeys.isDataLoaded);
    }

    async _loadDataAsync(): Promise<Array<WatchableViewMetadataKey>> {
        await this._viewDataStore.loadDataAsync();
        this._viewDataStore.watch('visibleFieldIds', this._onVisibleFieldIdsChange);
        this._viewDataStore.watch('allFieldIds', this._onAllFieldIdsChange);
        return [WatchableViewMetadataKeys.allFields, WatchableViewMetadataKeys.visibleFields];
    }

    _unloadData() {
        this._viewDataStore.unwatch('visibleFieldIds', this._onVisibleFieldIdsChange);
        this._viewDataStore.unwatch('allFieldIds', this._onAllFieldIdsChange);
        this._viewDataStore.unloadData();
    }

    _onVisibleFieldIdsChange = () => {
        this._onChange(WatchableViewMetadataKeys.visibleFields);
    };

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
