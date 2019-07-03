// @flow
import {type BaseData} from '../types/base';
import {fireAndForgetPromise} from '../private_utils';
import {invariant, spawnAbstractMethodError} from '../error_utils';
import AbstractModel from './abstract_model';

/** Abstract superclass for all block SDK models that need to fetch async data. */
class AbstractModelWithAsyncData<DataType, WatchableKey: string> extends AbstractModel<
    DataType,
    WatchableKey,
> {
    static __DATA_UNLOAD_DELAY_MS = 1000;
    static _shouldLoadDataForKey(key: WatchableKey): boolean {
        return false;
    }
    _isDataLoaded: boolean;
    _pendingDataLoadPromise: Promise<Array<WatchableKey>> | null;
    _dataRetainCount: number;
    _unloadDataTimeoutId: null | TimeoutID;
    constructor(baseData: BaseData, modelId: string) {
        super(baseData, modelId);

        this._isDataLoaded = false;
        this._pendingDataLoadPromise = null;
        this._dataRetainCount = 0;
        this._unloadDataTimeoutId = null;
    }
    /**
     * Watching a key that needs to load data asynchronously will automatically
     * cause the data to be fetched. Once the data is available, the callback
     * will be called.
     */
    watch(
        keys: WatchableKey | Array<WatchableKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableKey> {
        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (this.constructor._shouldLoadDataForKey(key)) {
                fireAndForgetPromise(this.loadDataAsync.bind(this));
            }
        }
        return validKeys;
    }
    /**
     * Unwatching a key that needs to load data asynchronously will automatically
     * cause the data to be released. Once the data is available, the callback
     * will be called.
     */
    unwatch(
        keys: WatchableKey | Array<WatchableKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableKey> {
        const validKeys = super.unwatch(keys, callback, context);
        for (const key of validKeys) {
            if (this.constructor._shouldLoadDataForKey(key)) {
                this.unloadData();
            }
        }
        return validKeys;
    }
    /** */
    get isDataLoaded(): boolean {
        return this._isDataLoaded;
    }
    _onChangeIsDataLoaded() {
        throw spawnAbstractMethodError();
    }
    async _loadDataAsync(): Promise<Array<WatchableKey>> {
        throw spawnAbstractMethodError();
    }
    _unloadData() {
        throw spawnAbstractMethodError();
    }
    /**
     * Will cause all the async data to be fetched and retained. Every call to
     * `loadDataAsync` should have a matching call to `unloadData`.
     *
     * Returns a Promise that will resolve once the data is loaded.
     */
    async loadDataAsync() {
        if (this._unloadDataTimeoutId !== null) {
            clearTimeout(this._unloadDataTimeoutId);
            this._unloadDataTimeoutId = null;
        }

        this._dataRetainCount++;

        if (this._isDataLoaded) {
            return;
        }
        if (!this._pendingDataLoadPromise) {
            this._pendingDataLoadPromise = this._loadDataAsync();
            this._pendingDataLoadPromise.then(changedKeys => {
                this._isDataLoaded = true;
                this._pendingDataLoadPromise = null;

                for (const key of changedKeys) {
                    this._onChange(key);
                }
                this._onChangeIsDataLoaded();
            });
        }
        await this._pendingDataLoadPromise;
    }
    /** */
    unloadData() {
        this._dataRetainCount--;

        if (this._dataRetainCount < 0) {
            console.warn(`Block ${this.constructor._className} data over-released`); // eslint-disable-line no-console
            this._dataRetainCount = 0;
        }
        if (this._dataRetainCount === 0) {
            this._unloadDataTimeoutId = setTimeout(() => {
                invariant(
                    this._dataRetainCount === 0,
                    'Unload data timeout fired with non-zero retain count',
                );
                this._isDataLoaded = false;
                this._unloadData();
                this._onChangeIsDataLoaded();
            }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
        }
    }
}

export default AbstractModelWithAsyncData;
