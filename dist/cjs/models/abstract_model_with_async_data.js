"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("../private_utils");

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    h = _window$__requirePriv.h;
/** Abstract superclass for all block SDK models that need to fetch async data. */


var AbstractModelWithAsyncData =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(AbstractModelWithAsyncData, _AbstractModel);
  (0, _createClass2.default)(AbstractModelWithAsyncData, null, [{
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      // Override to return whether watching the key should trigger the
      // data to be loaded for this model.
      return false;
    }
  }]);

  function AbstractModelWithAsyncData(baseData, modelId) {
    var _this;

    (0, _classCallCheck2.default)(this, AbstractModelWithAsyncData);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AbstractModelWithAsyncData).call(this, baseData, modelId));
    _this._isDataLoaded = false;
    _this._pendingDataLoadPromise = null;
    _this._dataRetainCount = 0;
    _this._unloadDataTimeoutId = null;
    return _this;
  }
  /**
   * Watching a key that needs to load data asynchronously will automatically
   * cause the data to be fetched. Once the data is available, the callback
   * will be called.
   */


  (0, _createClass2.default)(AbstractModelWithAsyncData, [{
    key: "watch",
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(AbstractModelWithAsyncData.prototype), "watch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = validKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (this.constructor._shouldLoadDataForKey(key)) {
            // Note: for simplicity, we will call loadData for every key that needs
            // needs data, relying on the retain count to unload once all keys have
            // been unwatched.
            (0, _private_utils.fireAndForgetPromise)(this.loadDataAsync.bind(this));
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
     * Unwatching a key that needs to load data asynchronously will automatically
     * cause the data to be released. Once the data is available, the callback
     * will be called.
     */

  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(AbstractModelWithAsyncData.prototype), "unwatch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = validKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (this.constructor._shouldLoadDataForKey(key)) {
            // We called loadDataAsync for every key that needs data so call
            // unloadData for every key to balance the retain count.
            this.unloadData();
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
    /** */

  }, {
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw new Error('abstract method');

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function _loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      // Override this to unload the data.
      throw new Error('abstract method');
    } // Override this method if your model is dependent on other models.
    // Do NOT load other models' data from _loadDataAsync, since it can lead to
    // unexpected behavior.
    // IMPORTANT: always call super.loadDataAsync() from your override.

    /**
     * Will cause all the async data to be fetched and retained. Every call to
     * `loadDataAsync` should have a matching call to `unloadData`.
     *
     * Returns a Promise that will resolve once the data is loaded.
     */

  }, {
    key: "loadDataAsync",
    value: function () {
      var _loadDataAsync3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this._unloadDataTimeoutId !== null) {
                  // If we set a timeout to unload data, clear it since we are incrementing
                  // the retain count and loading data.
                  clearTimeout(this._unloadDataTimeoutId);
                  this._unloadDataTimeoutId = null;
                } // We keep a count of how many things have loaded the data so we don't
                // actually unload the data until the retain count comes back down to zero.


                this._dataRetainCount++;

                if (!this._isDataLoaded) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                if (!this._pendingDataLoadPromise) {
                  this._pendingDataLoadPromise = this._loadDataAsync();

                  this._pendingDataLoadPromise.then(changedKeys => {
                    this._isDataLoaded = true;
                    this._pendingDataLoadPromise = null;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                      for (var _iterator3 = changedKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var key = _step3.value;

                        this._onChange(key);
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
                  });
                }

                _context2.next = 7;
                return this._pendingDataLoadPromise;

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadDataAsync() {
        return _loadDataAsync3.apply(this, arguments);
      }

      return loadDataAsync;
    }() // Override this method if your model is dependent on other models.
    // Do NOT unload other models' data from _unloadData, since it can lead to
    // unexpected behavior.
    // IMPORTANT: always call super.unloadData() from your override.

    /** */

  }, {
    key: "unloadData",
    value: function unloadData() {
      this._dataRetainCount--;

      if (this._dataRetainCount < 0) {
        console.warn("Block ".concat(this.constructor._className, " data over-released")); // eslint-disable-line no-console

        this._dataRetainCount = 0;
      }

      if (this._dataRetainCount === 0) {
        // Don't unload immediately. Wait a while in case something else
        // requests the data, so we can avoid going back to liveapp or
        // the network.
        this._unloadDataTimeoutId = setTimeout(() => {
          h.assert(this._dataRetainCount === 0, 'Unload data timeout fired with non-zero retain count'); // Set _isDataLoaded to false before calling _unloadData in case
          // _unloadData reads from isDataLoaded.

          this._isDataLoaded = false;

          this._unloadData();
        }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
      }
    }
  }, {
    key: "isDataLoaded",
    get: function get() {
      return this._isDataLoaded;
    }
  }]);
  return AbstractModelWithAsyncData;
}(_abstract_model.default);

(0, _defineProperty2.default)(AbstractModelWithAsyncData, "__DATA_UNLOAD_DELAY_MS", 1000);
var _default = AbstractModelWithAsyncData;
exports.default = _default;