/** @module @airtable/blocks/models: Abstract Models */ /** */
import {getLocallyUniqueId, FlowAnyExistential, FlowAnyObject} from './private_utils';
import {spawnError} from './error_utils';

/**
 * Abstract superclass for watchable models. All watchable models expose `watch`
 * and `unwatch` methods that allow consumers to subscribe to changes to that model.
 *
 * This class should not be used directly.
 */
class Watchable<WatchableKey extends string> {
    /** @internal */
    static _className = 'Watchable';
    /** @internal */
    static _isWatchableKey(_key: string): boolean {
        // Override to return whether `key` is a valid watchable key.
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
    // React integrations (e.g. useSubscription) rely on referential equality (===) to determine
    // when things have changed. This doesn't work with our mutable models, since the identity
    // of the model doesn't change, but the data inside it might. Rather than never returning two equal values
    // those integrations can use __getWatchableKey, a string key that is guaranteed to be unique
    // to each watchable and will change whenever the watch keys are fired.
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
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
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
                // Rather than pushing onto this array, we initialize a new array.
                // This is necessary since watches can change as a result of an
                // event getting triggered. It would be bad if as we iterate over
                // our watchers, new watchers get pushed onto the array that we
                // are iterating over.
                // TODO(jb): as a perf optimization, we *could* push onto this array
                // as long as we are not in the middle of iterating over it.
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
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param [context] the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
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
