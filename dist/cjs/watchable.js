"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var idCount = 0;
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


var Watchable =
/*#__PURE__*/
function () {
  (0, _createClass2.default)(Watchable, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      // Override to return whether `key` is a valid watchable key.
      return false;
    }
  }]);

  /**
   * @hideconstructor
   */
  function Watchable() {
    (0, _classCallCheck2.default)(this, Watchable);
    (0, _defineProperty2.default)(this, "_changeCount", 0);
    (0, _defineProperty2.default)(this, "_watchableId", getId());
    this._changeWatchersByKey = {};
  } // React integrations (e.g. useSubscription) rely on referential equality (===) to determine
  // when things have changed. This doesn't work with our mutable models, since the identity
  // of the model doesn't change, but the data inside it might. Rather than never returning two equal values
  // those integrations can use __getWatchableKey, a string key that is guaranteed to be unique
  // to each watchable and will change whenever the watch keys are fired.

  /**
   * @private
   */


  (0, _createClass2.default)(Watchable, [{
    key: "__getWatchableKey",
    value: function __getWatchableKey() {
      return "".concat(this._watchableId, " ").concat(this._changeCount);
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

  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      var validKeys = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key = _step.value;

          if (this.constructor._isWatchableKey(_key)) {
            validKeys.push(_key);

            if (!this._changeWatchersByKey[_key]) {
              this._changeWatchersByKey[_key] = [];
            } // Rather than pushing onto this array, we initialize a new array.
            // This is necessary since watches can change as a result of an
            // event getting triggered. It would be bad if as we iterate over
            // our watchers, new watchers get pushed onto the array that we
            // are iterating over.
            // TODO(jb): as a perf optimization, we *could* push onto this array
            // as long as we are not in the middle of iterating over it.


            this._changeWatchersByKey[_key] = [...this._changeWatchersByKey[_key], {
              callback,
              context
            }];
          } else {
            throw new Error("Invalid key to watch for ".concat(this.constructor._className, ": ").concat(_key)); // eslint-disable-line no-console
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
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

  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      var validKeys = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _key2 = _step2.value;

          if (this.constructor._isWatchableKey(_key2)) {
            validKeys.push(_key2);
            var watchers = this._changeWatchersByKey[_key2];

            if (watchers) {
              var filteredWatchers = watchers.filter(watcher => {
                return watcher.callback !== callback || watcher.context !== context;
              });

              if (filteredWatchers.length > 0) {
                this._changeWatchersByKey[_key2] = filteredWatchers;
              } else {
                delete this._changeWatchersByKey[_key2];
              }
            }
          } else {
            console.warn("Invalid key to unwatch for ".concat(this.constructor._className, ": ").concat(_key2)); // eslint-disable-line no-console
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return validKeys;
    }
    /**
     * @private
     */

  }, {
    key: "_onChange",
    value: function _onChange(key) {
      this._changeCount += 1;
      var watchers = this._changeWatchersByKey[key];

      if (watchers) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key3 = 1; _key3 < _len; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = watchers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var watcher = _step3.value;
            watcher.callback.call(watcher.context, this, key, ...args);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }
  }]);
  return Watchable;
}();

(0, _defineProperty2.default)(Watchable, "_className", 'Watchable');
var _default = Watchable;
exports.default = _default;