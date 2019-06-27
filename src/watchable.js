// @flow
import {spawnError} from './error_utils';

let idCount = 0;
/**
 * @private
 */
function getId() {
    idCount++;
    return idCount;
}

/**
 * Abstract superclass for watchable models. All watchable models expose `watch`
 * and `unwatch` methods that allow consumers to subscribe to changes to that model.
 *
 * This class should not be used directly.
 */
class Watchable<WatchableKey: string> {
    static _className = 'Watchable';
    static _isWatchableKey(key: string): boolean {
        // Override to return whether `key` is a valid watchable key.
        return false;
    }
    _changeCount = 0;
    +_watchableId = getId();
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
    // React integrations (e.g. useSubscription) rely on referential equality (===) to determine
    // when things have changed. This doesn't work with our mutable models, since the identity
    // of the model doesn't change, but the data inside it might. Rather than never returning two equal values
    // those integrations can use __getWatchableKey, a string key that is guaranteed to be unique
    // to each watchable and will change whenever the watch keys are fired.
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
        keys: WatchableKey | Array<WatchableKey>,
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
                // Rather than pushing onto this array, we initialize a new array.
                // This is necessary since watches can change as a result of an
                // event getting triggered. It would be bad if as we iterate over
                // our watchers, new watchers get pushed onto the array that we
                // are iterating over.
                // TODO(jb): as a perf optimization, we *could* push onto this array
                // as long as we are not in the middle of iterating over it.
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
        keys: WatchableKey | Array<WatchableKey>,
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
