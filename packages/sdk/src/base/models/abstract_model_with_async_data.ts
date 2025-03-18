/** @module @airtable/blocks/models: Abstract models */ /** */
import Sdk from '../sdk';
import {fireAndForgetPromise, FlowAnyFunction, FlowAnyObject, TimeoutId} from '../../private_utils';
import {invariant} from '../../error_utils';
import AbstractModel from '../../shared/models/abstract_model';
import {BaseSdkMode} from '../../sdk_mode';

/**
 * Abstract superclass for all Blocks SDK models that need to fetch async data.
 *
 * @docsPath models/advanced/AbstractModelWithAsyncData
 */
abstract class AbstractModelWithAsyncData<
    DataType,
    WatchableKey extends string
> extends AbstractModel<BaseSdkMode, DataType, WatchableKey> {
    /** @internal */
    static __DATA_UNLOAD_DELAY_MS = 1000;
    /** @internal */
    static _shouldLoadDataForKey(key: string): boolean {
        // Override to return whether watching the key should trigger the
        // data to be loaded for this model.
        return false;
    }
    /** @internal */
    _isDataLoaded: boolean;
    /** @internal */
    _pendingDataLoadPromise: Promise<Array<WatchableKey>> | null;
    /** @internal */
    _dataRetainCount: number;
    /** @internal */
    _unloadDataTimeoutId: null | TimeoutId;
    /**
     * This flag is used to keep track of models that have been
     * forced to unload (regardless of the retain count). The force
     * unload happens via _forceUnload method and the only proper use
     * of that function is when the underlying data gets deleted while
     * the model is still active. e.g. when a table is deleted in the
     * main extension while an instance of record_store is still alive.
     * NOTE: Once set to true, it never goes back to false.
     *
     * @internal
     */
    _isForceUnloaded: boolean = false;
    /** @hidden */
    constructor(sdk: Sdk, modelId: string) {
        super(sdk, modelId);

        this._isDataLoaded = false;
        this._pendingDataLoadPromise = null;
        this._dataRetainCount = 0;
        this._unloadDataTimeoutId = null;
    }
    /**
     * Watching a key that needs to load data asynchronously will automatically
     * cause the data to be fetched. Once the data is available, the callback
     * will be called.
     *
     * @inheritdoc
     */
    watch(
        keys: WatchableKey | ReadonlyArray<WatchableKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableKey> {
        this._assertNotForceUnloaded();
        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (
                (this.constructor as typeof AbstractModelWithAsyncData)._shouldLoadDataForKey(key)
            ) {
                // Note: for simplicity, we will call loadData for every key that needs
                // needs data, relying on the retain count to unload once all keys have
                // been unwatched.
                fireAndForgetPromise(this.loadDataAsync.bind(this));
            }
        }
        return validKeys;
    }
    /**
     * Unwatching a key that needs to load data asynchronously will automatically
     * cause the data to be released. Once the data is available, the callback
     * will be called.
     *
     * @inheritdoc
     */
    unwatch(
        keys: WatchableKey | ReadonlyArray<WatchableKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableKey> {
        const validKeys = super.unwatch(keys, callback, context);
        for (const key of validKeys) {
            if (
                (this.constructor as typeof AbstractModelWithAsyncData)._shouldLoadDataForKey(key)
            ) {
                // We called loadDataAsync for every key that needs data so call
                // unloadData for every key to balance the retain count.
                this.unloadData();
            }
        }
        return validKeys;
    }
    /** @inheritdoc */
    get isDeleted(): boolean {
        if (this._isForceUnloaded) {
            return true;
        }
        return super.isDeleted;
    }
    /** */
    get isDataLoaded(): boolean {
        if (this.isDeleted) {
            return false;
        }
        return this._isDataLoaded;
    }
    /** @internal */
    abstract _onChangeIsDataLoaded(): void;
    /** @internal */
    abstract _loadDataAsync(): Promise<Array<WatchableKey>>;
    /** @internal */
    abstract _unloadData(): void;
    // Override this method if your model is dependent on other models.
    // Do NOT load other models' data from _loadDataAsync, since it can lead to
    // unexpected behavior.
    // IMPORTANT: always call super.loadDataAsync() from your override.
    /**
     * Will cause all the async data to be fetched and retained. Every call to
     * `loadDataAsync` should have a matching call to `unloadData`.
     *
     * Returns a Promise that will resolve once the data is loaded.
     */
    async loadDataAsync() {
        this._assertNotForceUnloaded();
        if (this._unloadDataTimeoutId !== null) {
            // If we set a timeout to unload data, clear it since we are incrementing
            // the retain count and loading data.
            clearTimeout(this._unloadDataTimeoutId);
            this._unloadDataTimeoutId = null;
        }

        // We keep a count of how many things have loaded the data so we don't
        // actually unload the data until the retain count comes back down to zero.
        this._dataRetainCount++;

        if (this._isDataLoaded) {
            return;
        }
        if (!this._pendingDataLoadPromise) {
            this._pendingDataLoadPromise = this._loadDataAsync().then(changedKeys => {
                this._isDataLoaded = true;
                this._pendingDataLoadPromise = null;

                for (const key of changedKeys) {
                    this._onChange(key);
                }
                this._onChangeIsDataLoaded();

                return changedKeys;
            });
        }
        await this._pendingDataLoadPromise;
    }
    // Override this method if your model is dependent on other models.
    // Do NOT unload other models' data from _unloadData, since it can lead to
    // unexpected behavior.
    // IMPORTANT: always call super.unloadData() from your override.
    /** */
    unloadData() {
        if (this._isForceUnloaded) {
            return;
        }
        this._dataRetainCount--;

        if (this._dataRetainCount < 0) {
            console.warn(`Block ${(this.constructor as any)._className} data over-released`); // eslint-disable-line no-console
            this._dataRetainCount = 0;
        }
        if (this._dataRetainCount === 0) {
            // Don't unload immediately. Wait a while in case something else
            // requests the data, so we can avoid going back to liveapp or
            // the network.
            this._unloadDataTimeoutId = setTimeout(() => {
                invariant(
                    this._dataRetainCount === 0,
                    'Unload data timeout fired with non-zero retain count',
                );

                // Set _isDataLoaded to false before calling _unloadData in case
                // _unloadData reads from isDataLoaded.
                this._isDataLoaded = false;
                this._unloadData();
                this._onChangeIsDataLoaded();
            }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
        }
    }

    _forceUnload() {
        while (this._dataRetainCount > 0) {
            this.unloadData();
        }
        this._isForceUnloaded = true;
    }

    _assertNotForceUnloaded() {
        invariant(!this._isForceUnloaded, 'model (%s) permanently deleted', this.id);
    }
}

export default AbstractModelWithAsyncData;
