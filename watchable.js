// @flow

class Watchable<WatchableKey: string> {
    static _className = 'Watchable';
    static _isWatchableKey(key: string): boolean {
        // Override to return whether `key` is a valid watchable key.
        return false;
    }
    _changeWatchersByKey: {[key: string]: Array<{callback: Function, context: any}>}; // eslint-disable-line flowtype/no-weak-types
    constructor() {
        this._changeWatchersByKey = {};
    }
    watch(keys: WatchableKey | Array<WatchableKey>, callback: Function, context?: any): Array<WatchableKey> { // eslint-disable-line flowtype/no-weak-types
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
                console.warn(`Invalid key to watch for ${this.constructor._className}: ${key}`); // eslint-disable-line no-console
            }
        }

        return validKeys;
    }
    unwatch(keys: WatchableKey | Array<WatchableKey>, callback: Function, context?: any): Array<WatchableKey> { // eslint-disable-line flowtype/no-weak-types
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
    _onChange(key: WatchableKey, ...args?: Array<any>) { // eslint-disable-line flowtype/no-weak-types
        const watchers = this._changeWatchersByKey[key];
        if (watchers) {
            for (const watcher of watchers) {
                watcher.callback.call(watcher.context, this, ...args);
            }
        }
    }
}

module.exports = Watchable;
