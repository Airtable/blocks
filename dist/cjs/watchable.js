"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

/** */
class Watchable {
  static _isWatchableKey(key) {
    // Override to return whether `key` is a valid watchable key.
    return false;
  }

  constructor() {
    this._changeWatchersByKey = {};
  }
  /**
   * Start watching the given key or keys. The callback will be called when the
   * value changes. Every call to `watch` should have a matching call to `unwatch`.
   *
   * Will log a warning if the keys given are invalid.
   */


  watch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = [];

    for (const key of keys) {
      if (this.constructor._isWatchableKey(key)) {
        validKeys.push(key);

        if (!this._changeWatchersByKey[key]) {
          this._changeWatchersByKey[key] = [];
        } // Rather than pushing onto this array, we initialize a new array.
        // This is necessary since watches can change as a result of an
        // event getting triggered. It would be bad if as we iterate over
        // our watchers, new watchers get pushed onto the array that we
        // are iterating over.
        // TODO(jb): as a perf optimization, we *could* push onto this array
        // as long as we are not in the middle of iterating over it.


        this._changeWatchersByKey[key] = [...this._changeWatchersByKey[key], {
          callback,
          context
        }];
      } else {
        console.warn(`Invalid key to watch for ${this.constructor._className}: ${key}`); // eslint-disable-line no-console
      }
    }

    return validKeys;
  }
  /**
   * Stop watching the given key or keys. Should be called with the same
   * arguments that were given to `watch`.
   *
   * Will log a warning if the keys given are invalid.
   */


  unwatch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = [];

    for (const key of keys) {
      if (this.constructor._isWatchableKey(key)) {
        validKeys.push(key);
        const watchers = this._changeWatchersByKey[key];

        if (watchers) {
          const filteredWatchers = (0, _filter.default)(watchers).call(watchers, watcher => {
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

  _onChange(key, ...args) {
    const watchers = this._changeWatchersByKey[key];

    if (watchers) {
      for (const watcher of watchers) {
        watcher.callback.call(watcher.context, this, key, ...args);
      }
    }
  }

}

(0, _defineProperty2.default)(Watchable, "_className", 'Watchable');
var _default = Watchable;
exports.default = _default;