"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WatchableViewDataStoreKeys = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

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

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var WatchableViewDataStoreKeys = Object.freeze({
  visibleRecords: 'visibleRecords',
  visibleRecordIds: 'visibleRecordIds',
  recordColors: 'recordColors',
  allFieldIds: 'allFieldIds',
  visibleFieldIds: 'visibleFieldIds'
});
exports.WatchableViewDataStoreKeys = WatchableViewDataStoreKeys;

// ViewDataStore contains loadable data for a specific view. That means the set of visible records,
// and field order/visibility information. View itself only contains core schema information. The
// data here doesn't belong in View as it's record data or conditionally loaded.

/** @private */
var ViewDataStore =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(ViewDataStore, _AbstractModelWithAsy);
  (0, _createClass2.default)(ViewDataStore, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableViewDataStoreKeys, key);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      return true;
    }
  }]);

  function ViewDataStore(baseData, parentRecordStore, airtableInterface, viewId) {
    var _this;

    (0, _classCallCheck2.default)(this, ViewDataStore);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ViewDataStore).call(this, baseData, "".concat(viewId, "-ViewDataStore")));
    _this.parentRecordStore = parentRecordStore;
    _this._airtableInterface = airtableInterface;
    _this.viewId = viewId;
    return _this;
  }

  (0, _createClass2.default)(ViewDataStore, [{
    key: "_onChangeIsDataLoaded",
    value: function _onChangeIsDataLoaded() {// noop
    }
  }, {
    key: "loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var tableLoadPromise;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Override this method to also load table data.
                // NOTE: it's important that we call loadDataAsync on the table here and not in
                // _loadDataAsync since we want the retain counts for the view and table to increase/decrease
                // in lock-step. If we load table data in _loadDataAsync, the table's retain
                // count only increments some of the time, which leads to unexpected behavior.
                tableLoadPromise = this.parentRecordStore.loadRecordMetadataAsync();
                this._mostRecentTableLoadPromise = tableLoadPromise;
                _context.next = 4;
                return (0, _get2.default)((0, _getPrototypeOf2.default)(ViewDataStore.prototype), "loadDataAsync", this).call(this);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return loadDataAsync;
    }()
  }, {
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var tableLoadPromise, _ref, _ref2, viewData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, record;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // We need to be sure that the table data is loaded *before* we return
                // from this method.
                (0, _invariant.default)(this._mostRecentTableLoadPromise, 'No table load promise');
                tableLoadPromise = this._mostRecentTableLoadPromise;
                _context2.next = 4;
                return Promise.all([this._airtableInterface.fetchAndSubscribeToViewDataAsync(this.parentRecordStore.tableId, this.viewId), tableLoadPromise]);

              case 4:
                _ref = _context2.sent;
                _ref2 = (0, _slicedToArray2.default)(_ref, 1);
                viewData = _ref2[0];
                this._data.visibleRecordIds = viewData.visibleRecordIds;
                this._data.fieldOrder = viewData.fieldOrder;
                this._data.colorsByRecordId = viewData.colorsByRecordId;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 13;

                for (_iterator = this.visibleRecords[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  record = _step.value;

                  if (this._data.colorsByRecordId[record.id]) {
                    record.__triggerOnChangeForRecordColorInViewId(this.viewId);
                  }
                }

                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2["catch"](13);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 21:
                _context2.prev = 21;
                _context2.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 24:
                _context2.prev = 24;

                if (!_didIteratorError) {
                  _context2.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context2.finish(24);

              case 28:
                return _context2.finish(21);

              case 29:
                return _context2.abrupt("return", [WatchableViewDataStoreKeys.visibleRecords, WatchableViewDataStoreKeys.visibleRecordIds, WatchableViewDataStoreKeys.allFieldIds, WatchableViewDataStoreKeys.visibleFieldIds, WatchableViewDataStoreKeys.recordColors]);

              case 30:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[13, 17, 21, 29], [22,, 24, 28]]);
      }));

      function _loadDataAsync() {
        return _loadDataAsync3.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "unloadData",
    value: function unloadData() {
      // Override this method to also unload the table's data.
      // NOTE: it's important that we do this here, since we want the view and table's
      // retain counts to increment/decrement in lock-step. If we unload the table's
      // data in _unloadData, it leads to unexpected behavior.
      (0, _get2.default)((0, _getPrototypeOf2.default)(ViewDataStore.prototype), "unloadData", this).call(this);
      this.parentRecordStore.unloadRecordMetadata();
    }
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._mostRecentTableLoadPromise = null;

      this._airtableInterface.unsubscribeFromViewData(this.parentRecordStore.tableId, this.viewId);

      if (!this.isDeleted) {
        this._data.visibleRecordIds = undefined;
        this._data.colorsByRecordId = undefined;
      }
    }
  }, {
    key: "__generateChangesForParentTableAddMultipleRecords",
    value: function __generateChangesForParentTableAddMultipleRecords(recordIds) {
      var newVisibleRecordIds = [...this.visibleRecordIds, ...recordIds];
      return [{
        path: ['tablesById', this.parentRecordStore.tableId, 'viewsById', this.viewId, 'visibleRecordIds'],
        value: newVisibleRecordIds
      }];
    }
  }, {
    key: "__generateChangesForParentTableDeleteMultipleRecords",
    value: function __generateChangesForParentTableDeleteMultipleRecords(recordIds) {
      var recordIdsToDeleteSet = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = recordIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var recordId = _step2.value;
          recordIdsToDeleteSet[recordId] = true;
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

      var newVisibleRecordIds = this.visibleRecordIds.filter(recordId => {
        return !recordIdsToDeleteSet[recordId];
      });
      return [{
        path: ['tablesById', this.parentRecordStore.tableId, 'viewsById', this.viewId, 'visibleRecordIds'],
        value: newVisibleRecordIds
      }];
    }
    /**
     * The record IDs that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */

  }, {
    key: "getRecordColor",

    /**
     * Get the color name for the specified record in this view, or null if no
     * color is available. Watch with 'recordColors'
     */
    value: function getRecordColor(recordOrRecordId) {
      (0, _invariant.default)(this.isDataLoaded, 'View data is not loaded');
      var colorsByRecordId = this._data.colorsByRecordId;

      if (!colorsByRecordId) {
        return null;
      }

      var recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
      var color = colorsByRecordId[recordId];
      return color || null;
    }
  }, {
    key: "triggerOnChangeForDirtyPaths",
    value: function triggerOnChangeForDirtyPaths(dirtyPaths) {
      if (dirtyPaths.visibleRecordIds) {
        this._onChange(WatchableViewDataStoreKeys.visibleRecords);

        this._onChange(WatchableViewDataStoreKeys.visibleRecordIds);
      }

      if (dirtyPaths.fieldOrder) {
        this._onChange(WatchableViewDataStoreKeys.allFieldIds); // TODO(kasra): only trigger visibleFields if the *visible* field ids changed.


        this._onChange(WatchableViewDataStoreKeys.visibleFieldIds);
      }

      if (dirtyPaths.colorsByRecordId) {
        var changedRecordIds = dirtyPaths.colorsByRecordId._isDirty ? null : Object.keys(dirtyPaths.colorsByRecordId);

        if (changedRecordIds) {
          // Checking isRecordMetadataLoaded fixes a timing issue:
          // When a new table loads in liveapp, we'll receive the record
          // colors before getting the response to our loadData call.
          // This is a temporary fix: we need a more general solution to
          // avoid processing events associated with subscriptions whose
          // data we haven't received yet.
          if (this.parentRecordStore.isRecordMetadataLoaded) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = changedRecordIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var recordId = _step3.value;
                var record = this.parentRecordStore.getRecordByIdIfExists(recordId);
                (0, _invariant.default)(record, 'record must exist');

                record.__triggerOnChangeForRecordColorInViewId(this.viewId);
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

        this._onChange(WatchableViewDataStoreKeys.recordColors, changedRecordIds);
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      var tableData = this._baseData.tablesById[this.parentRecordStore.tableId];

      if (!tableData) {
        return null;
      }

      return tableData.viewsById[this.viewId] || null;
    }
  }, {
    key: "isDataLoaded",
    get: function get() {
      return this._isDataLoaded && this.parentRecordStore.isRecordMetadataLoaded;
    }
  }, {
    key: "visibleRecordIds",
    get: function get() {
      var visibleRecordIds = this._data.visibleRecordIds;
      (0, _invariant.default)(visibleRecordIds, 'View data is not loaded'); // Freeze visibleRecordIds so users can't mutate it.
      // If it changes from liveapp, we get an entire new array which will
      // replace this one, so it's okay to freeze it.

      if (!Object.isFrozen(visibleRecordIds)) {
        Object.freeze(visibleRecordIds);
      }

      return visibleRecordIds;
    }
    /**
     * The records that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */

  }, {
    key: "visibleRecords",
    get: function get() {
      (0, _invariant.default)(this.parentRecordStore.isRecordMetadataLoaded, 'Table data is not loaded');
      var visibleRecordIds = this._data.visibleRecordIds;
      (0, _invariant.default)(visibleRecordIds, 'View data is not loaded');
      return visibleRecordIds.map(recordId => {
        var record = this.parentRecordStore.getRecordByIdIfExists(recordId);
        (0, _invariant.default)(record, 'Record in view does not exist');
        return record;
      });
    }
  }, {
    key: "allFieldIds",
    get: function get() {
      var fieldOrder = this._data.fieldOrder;
      (0, _invariant.default)(fieldOrder, 'View data is not loaded');
      return fieldOrder.fieldIds;
    }
  }, {
    key: "visibleFieldIds",
    get: function get() {
      var fieldOrder = this._data.fieldOrder;
      (0, _invariant.default)(fieldOrder, 'View data is not loaded');
      var fieldIds = fieldOrder.fieldIds;
      return fieldIds.slice(0, fieldOrder.visibleFieldCount);
    }
  }]);
  return ViewDataStore;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(ViewDataStore, "_className", 'ViewDataStore');
var _default = ViewDataStore;
exports.default = _default;