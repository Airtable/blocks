// @flow
import {getLocallyUniqueId} from './private_utils';
import {spawnError} from './error_utils';

/**
 * Abstract superclass for watchable models. All watchable models expose `watch`
 * and `unwatch` methods that allow consumers to subscribe to changes to that model.
 *
 * This class should not be used directly.
 */
class Watchable<WatchableKey: string> {
    static _className = 'Watchable';
    static _isWatchableKey(key: string): boolean {
        return false;
    }
    _changeCount = 0;
    +_watchableId = getLocallyUniqueId();
    _changeWatchersByKey: {
        [string]: Array<{
            callback: (model: Watchable<*>, key: WatchableKey, ...args: Array<any>) => mixed,
            context: ?Object,
        }>,
    };
    /**
     * @hideconstructor
     */
    constructor() {
        this._changeWatchersByKey = {};
    }
    /**
     * @private
     */
    __getWatchableKey(): string {
        return `${this._watchableId} ${this._changeCount}`;
    }
    /**
     * Get notified of changes to the model.
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */
    watch(
        keys: WatchableKey | $ReadOnlyArray<WatchableKey>,
        callback: (model: this, key: WatchableKey, ...args: Array<any>) => mixed,
        context?: ?Object,
    ): Array<WatchableKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        const validKeys = [];
        for (const key of keys) {
            if (this.constructor._isWatchableKey(key)) {
                validKeys.push(key);
                if (!this._changeWatchersByKey[key]) {
                    this._changeWatchersByKey[key] = [];
                }
                this._changeWatchersByKey[key] = [
                    ...this._changeWatchersByKey[key],
                    {callback, context},
                ];
            } else {
                throw spawnError(
                    'Invalid key to watch for %s: %s',
                    this.constructor._className,
                    key,
                );
            }
        }

        return validKeys;
    }
    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param [context] the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
     */
    unwatch(
        keys: WatchableKey | $ReadOnlyArray<WatchableKey>,
        callback: (model: this, key: WatchableKey, ...args: Array<any>) => mixed,
        context?: ?Object,
    ): Array<WatchableKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        const validKeys = [];
        for (const key of keys) {
            if (this.constructor._isWatchableKey(key)) {
                validKeys.push(key);
                const watchers = this._changeWatchersByKey[key];
                if (watchers) {
                    const filteredWatchers = watchers.filter(watcher => {
                        return watcher.callback !== callback || watcher.context !== context;
                    });
                    if (filteredWatchers.length > 0) {
                        this._changeWatchersByKey[key] = filteredWatchers;
                    } else {
                        delete this._changeWatchersByKey[key];
                    }
                }
            } else {
                console.warn(`Invalid key to unwatch for ${this.constructor._className}: ${key}`); // eslint-disable-line no-console
            }
        }

        return validKeys;
    }
    /**
     * @private
     */
    _onChange(key: WatchableKey, ...args: Array<mixed>) {
        this._changeCount += 1;
        const watchers = this._changeWatchersByKey[key];
        if (watchers) {
            for (const watcher of watchers) {
                watcher.callback.call(watcher.context, this, key, ...args);
            }
        }
    }
}

export default Watchable;
