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

/** */
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

  function Watchable() {
    (0, _classCallCheck2.default)(this, Watchable);
    this._changeWatchersByKey = {};
  }
  /**
   * Start watching the given key or keys. The callback will be called when the
   * value changes. Every call to `watch` should have a matching call to `unwatch`.
   *
   * Will log a warning if the keys given are invalid.
   */


  (0, _createClass2.default)(Watchable, [{
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
          var key = _step.value;

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
            console.warn("Invalid key to watch for ".concat(this.constructor._className, ": ").concat(key)); // eslint-disable-line no-console
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
     * Stop watching the given key or keys. Should be called with the same
     * arguments that were given to `watch`.
     *
     * Will log a warning if the keys given are invalid.
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
          var key = _step2.value;

          if (this.constructor._isWatchableKey(key)) {
            validKeys.push(key);
            var watchers = this._changeWatchersByKey[key];

            if (watchers) {
              var filteredWatchers = watchers.filter(watcher => {
                return watcher.callback !== callback || watcher.context !== context;
              });

              if (filteredWatchers.length > 0) {
                this._changeWatchersByKey[key] = filteredWatchers;
              } else {
                delete this._changeWatchersByKey[key];
              }
            }
          } else {
            console.warn("Invalid key to unwatch for ".concat(this.constructor._className, ": ").concat(key)); // eslint-disable-line no-console
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
  }, {
    key: "_onChange",
    value: function _onChange(key) {
      var watchers = this._changeWatchersByKey[key];

      if (watchers) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
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