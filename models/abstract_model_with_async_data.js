// @flow
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');

import type {BaseDataForBlocks} from 'client/blocks/blocks_model_bridge';

const DATA_UNLOAD_DELAY_MS = 1000;

// Abstract superclass for all block SDK models that need to fetch async data.
class AbstractModelWithAsyncData<DataType, WatchableKey: string> extends AbstractModel<DataType, WatchableKey> {
    static _shouldLoadDataForKey(key: WatchableKey): boolean {
        // Override to return whether watching the key should trigger the
        // data to be loaded for this model.
        return false;
    }
    _isDataLoaded: boolean;
    _pendingDataLoadPromise: Promise<Array<WatchableKey>> | null;
    _dataRetainCount: number;
    constructor(baseData: BaseDataForBlocks, modelId: string) {
        super(baseData, modelId);

        this._isDataLoaded = false;
        this._pendingDataLoadPromise = null;
        this._dataRetainCount = 0;
    }
    watch(keys: WatchableKey | Array<WatchableKey>, callback: Function, context?: mixed): Array<WatchableKey> {
        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (this.constructor._shouldLoadDataForKey(key)) {
                // Note: for simplicity, we will call loadData for every key that needs
                // needs data, relying on the retain count to unload once all keys have
                // been unwatched.
                utils.fireAndForgetPromise(this._loadDataIfNeededAndRetainAsync.bind(this));
            }
        }
        return validKeys;
    }
    unwatch(keys: WatchableKey | Array<WatchableKey>, callback: Function, context?: mixed): Array<WatchableKey> {
        const validKeys = super.unwatch(keys, callback, context);
        for (const key of validKeys) {
            if (this.constructor._shouldLoadDataForKey(key)) {
                // We called _loadDataIfNeededAndRetainAsync for every key that needs
                // data so call _releaseData for every key to balance the retain count.
                this._releaseData();
            }
        }
        return validKeys;
    }
    async _loadDataAsync(): Promise<Array<WatchableKey>> {
        // Override this to fetch the data.
        // It should return an array of watchable keys that changed
        // as a result of loading data.
        throw new Error('abstract method');
    }
    _unloadData() {
        // Override this to unload the data.
        throw new Error('abstract method');
    }
    get isDataLoaded(): boolean {
        return this._isDataLoaded;
    }
    async loadDataAsync() {
        return this._loadDataIfNeededAndRetainAsync();
    }
    unloadData() {
        this._releaseData();
    }
    async _loadDataIfNeededAndRetainAsync() {
        // We keep a count of how many things have loaded the data so we don't
        // actually unload the data until the retain count comes back down to zero.
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
            });
        }
        await this._pendingDataLoadPromise;
    }
    _releaseData() {
        this._dataRetainCount--;

        if (this._dataRetainCount < 0) {
            console.warn(`Block ${this.constructor._className} data over-released`); // eslint-disable-line no-console
            this._dataRetainCount = 0;
        }
        if (this._dataRetainCount === 0) {
            // Don't unload immediately. Wait a while in case something else
            // requests the data, so we can avoid going back to liveapp or
            // the network.
            setTimeout(() => {
                if (this._dataRetainCount === 0) {
                    this._unloadData();
                    this._isDataLoaded = false;
                }
            }, DATA_UNLOAD_DELAY_MS);
        }
    }
}

module.exports = AbstractModelWithAsyncData;
