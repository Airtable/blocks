/** @module @airtable/blocks/models: Abstract models */ /** */
import {getLocallyUniqueId, FlowAnyExistential, FlowAnyObject} from './private_utils';
import {spawnError} from './error_utils';

/**
 * Abstract superclass for watchable models. All watchable models expose `watch`
 * and `unwatch` methods that allow consumers to subscribe to changes to that model.
 *
 * This class should not be used directly.
 *
 * @docsPath models/advanced/Watchable
 */
class Watchable<WatchableKey extends string> {
    /** @internal */
    static _className = 'Watchable';
    /** @internal */
    static _isWatchableKey(_key: string): boolean {
        return false;
    }
    /** @internal */
    _changeCount = 0;
    /** @internal */
    readonly _watchableId = getLocallyUniqueId();
    /** @internal */
    _changeWatchersByKey: {
        [key: string]: Array<{
            callback: (
                model: Watchable<FlowAnyExistential>,
                key: WatchableKey,
                ...args: Array<any>
            ) => unknown;
            context: FlowAnyObject | null | undefined;
        }>;
    };
    /**
     * @internal
     */
    constructor() {
        this._changeWatchersByKey = {};
    }
    /**
     * @internal
     */
    __getWatchableKey(): string {
        return `${this._watchableId} ${this._changeCount}`;
    }
    /**
     * Get notified of changes to the model.
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * Returns the array of keys that were watched.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param context an optional context for `this` in `callback`.
     */
    watch(
        keys: WatchableKey | ReadonlyArray<WatchableKey>,
        callback: (model: this, key: WatchableKey, ...args: Array<any>) => unknown,
        context?: FlowAnyObject | null,
    ): Array<WatchableKey> {
        const arrayKeys = (Array.isArray(keys) ? keys : [keys]) as ReadonlyArray<WatchableKey>;

        const validKeys = [];
        for (const key of arrayKeys) {
            if ((this.constructor as typeof Watchable)._isWatchableKey(key)) {
                validKeys.push(key);
                if (!this._changeWatchersByKey[key]) {
                    this._changeWatchersByKey[key] = [];
                }
                this._changeWatchersByKey[key] = [
                    ...this._changeWatchersByKey[key],
                    {callback, context} as any,
                ];
            } else {
                throw spawnError(
                    'Invalid key to watch for %s: %s',
                    (this.constructor as typeof Watchable)._className,
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
     * Returns the array of keys that were unwatched.
     *
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param context the context that was passed to `.watch` for this `callback`
     */
    unwatch(
        keys: WatchableKey | ReadonlyArray<WatchableKey>,
        callback: (model: this, key: WatchableKey, ...args: Array<any>) => unknown,
        context?: FlowAnyObject | null,
    ): Array<WatchableKey> {
        const arrayKeys = (Array.isArray(keys) ? keys : [keys]) as ReadonlyArray<WatchableKey>;

        const validKeys = [];
        for (const key of arrayKeys) {
            if ((this.constructor as typeof Watchable)._isWatchableKey(key)) {
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
                // eslint-disable-next-line no-console
                console.warn(
                    `Invalid key to unwatch for ${(this.constructor as any)._className}: ${key}`,
                );
            }
        }

        return validKeys;
    }
    /**
     * @internal
     */
    _onChange(key: WatchableKey, ...args: Array<unknown>) {
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
