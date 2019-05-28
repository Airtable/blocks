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
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var viewTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/view_types/view_type_provider');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


var WatchableViewKeys = Object.freeze({
  name: 'name',
  __visibleRecords: '__visibleRecords',
  __visibleRecordIds: '__visibleRecordIds',
  allFields: 'allFields',
  visibleFields: 'visibleFields',
  __recordColors: '__recordColors'
});

/** Model class representing a view in a table. */
var View =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(View, _AbstractModelWithAsy);
  (0, _createClass2.default)(View, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableViewKeys, key);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      return key === WatchableViewKeys.__visibleRecords || key === WatchableViewKeys.__visibleRecordIds || key === WatchableViewKeys.allFields || key === WatchableViewKeys.visibleFields || key === WatchableViewKeys.__recordColors;
    }
  }]);

  function View(baseData, parentTable, viewId, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, View);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(View).call(this, baseData, viewId));
    _this._parentTable = parentTable;
    _this._mostRecentTableLoadPromise = null;
    _this._airtableInterface = airtableInterface;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(View, [{
    key: "select",

    /** */
    value: function select(opts) {
      return _table_or_view_query_result.default.__createOrReuseQueryResult(this, opts || {});
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
                tableLoadPromise = this.parentTable.loadRecordMetadataAsync();
                this._mostRecentTableLoadPromise = tableLoadPromise;
                _context.next = 4;
                return (0, _get2.default)((0, _getPrototypeOf2.default)(View.prototype), "loadDataAsync", this).call(this);

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
                return Promise.all([this._airtableInterface.fetchAndSubscribeToViewDataAsync(this.parentTable.id, this._id), tableLoadPromise]);

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

                for (_iterator = this.__visibleRecords[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  record = _step.value;

                  if (this._data.colorsByRecordId[record.id]) {
                    record.__triggerOnChangeForRecordColorInViewId(this.id);
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
                return _context2.abrupt("return", [WatchableViewKeys.__visibleRecords, WatchableViewKeys.__visibleRecordIds, WatchableViewKeys.allFields, WatchableViewKeys.visibleFields, WatchableViewKeys.__recordColors]);

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
      (0, _get2.default)((0, _getPrototypeOf2.default)(View.prototype), "unloadData", this).call(this);
      this.parentTable.unloadRecordMetadata();
    }
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._mostRecentTableLoadPromise = null;

      this._airtableInterface.unsubscribeFromViewData(this.parentTable.id, this._id);

      if (!this.isDeleted) {
        this._data.visibleRecordIds = undefined;
        this._data.colorsByRecordId = undefined;
      }
    }
  }, {
    key: "__generateChangesForParentTableAddMultipleRecords",
    value: function __generateChangesForParentTableAddMultipleRecords(recordIds) {
      var newVisibleRecordIds = [...this.__visibleRecordIds, ...recordIds];
      return [{
        path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'],
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

      var newVisibleRecordIds = this.__visibleRecordIds.filter(recordId => {
        return !recordIdsToDeleteSet[recordId];
      });

      return [{
        path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'],
        value: newVisibleRecordIds
      }];
    }
    /**
     * The record IDs that are not filtered out of this view.
     * Can be watched to know when records are created, deleted, reordered, or
     * filtered in and out of this view.
     */

  }, {
    key: "__getRecordColor",

    /**
     * Get the color name for the specified record in this view, or null if no
     * color is available. Watch with '__recordColors'
     */
    value: function __getRecordColor(recordOrRecordId) {
      (0, _invariant.default)(this.isDataLoaded, 'View data is not loaded');
      var colorsByRecordId = this._data.colorsByRecordId;

      if (!colorsByRecordId) {
        return null;
      }

      var recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
      var color = colorsByRecordId[recordId];
      return color || null;
    }
    /**
     * Get the CSS hex color for the specified record in this view, or null if
     * no color is available. Watch with '__recordColors'
     */

  }, {
    key: "__getRecordColorHex",
    value: function __getRecordColorHex(recordOrRecordId) {
      var colorName = this.__getRecordColor(recordOrRecordId);

      if (!colorName) {
        return null;
      }

      return _color_utils.default.getHexForColor(colorName);
    }
  }, {
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      if (dirtyPaths.name) {
        this._onChange(WatchableViewKeys.name);
      }

      if (dirtyPaths.visibleRecordIds) {
        this._onChange(WatchableViewKeys.__visibleRecords);

        this._onChange(WatchableViewKeys.__visibleRecordIds);
      }

      if (dirtyPaths.fieldOrder) {
        this._onChange(WatchableViewKeys.allFields); // TODO(kasra): only trigger visibleFields if the *visible* field ids changed.


        this._onChange(WatchableViewKeys.visibleFields);
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
          if (this.parentTable.isRecordMetadataLoaded) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = changedRecordIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var recordId = _step3.value;

                var record = this.parentTable.__getRecordByIdIfExists(recordId);

                (0, _invariant.default)(record, 'record must exist');

                record.__triggerOnChangeForRecordColorInViewId(this.id);
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

        this._onChange(WatchableViewKeys.__recordColors, changedRecordIds);
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      var tableData = this._baseData.tablesById[this.parentTable.id];

      if (!tableData) {
        return null;
      }

      return tableData.viewsById[this._id] || null;
    }
  }, {
    key: "_isRecordMetadataLoaded",
    get: function get() {
      var parentTable = this.parentTable;
      var isParentTableLoaded = parentTable.isRecordMetadataLoaded;
      return isParentTableLoaded;
    }
    /** */

  }, {
    key: "isDataLoaded",
    get: function get() {
      return this._isDataLoaded && this._isRecordMetadataLoaded;
    }
    /** */

  }, {
    key: "parentTable",
    get: function get() {
      return this._parentTable;
    }
    /** The name of the view. Can be watched. */

  }, {
    key: "name",
    get: function get() {
      return this._data.name;
    }
    /** The type of the view. Will not change. */

  }, {
    key: "type",
    get: function get() {
      return viewTypeProvider.getApiViewType(this._data.type);
    }
    /** */

  }, {
    key: "url",
    get: function get() {
      return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
        absolute: true
      });
    }
  }, {
    key: "__visibleRecordIds",
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
    key: "__visibleRecords",
    get: function get() {
      var parentTable = this.parentTable;
      (0, _invariant.default)(this._isRecordMetadataLoaded, 'Table data is not loaded');
      var visibleRecordIds = this._data.visibleRecordIds;
      (0, _invariant.default)(visibleRecordIds, 'View data is not loaded');
      return visibleRecordIds.map(recordId => {
        var record = parentTable.__getRecordByIdIfExists(recordId);

        (0, _invariant.default)(record, 'Record in view does not exist');
        return record;
      });
    }
    /**
     * All the fields in the table, including fields that are hidden in this
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */

  }, {
    key: "allFields",
    get: function get() {
      var fieldOrder = this._data.fieldOrder;
      (0, _invariant.default)(fieldOrder, 'View data is not loaded');
      return fieldOrder.fieldIds.map(fieldId => this.parentTable.getFieldById(fieldId));
    }
    /**
     * The fields that are not hidden in this view.
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */

  }, {
    key: "visibleFields",
    get: function get() {
      var fieldOrder = this._data.fieldOrder;
      (0, _invariant.default)(fieldOrder, 'View data is not loaded');
      var fieldIds = fieldOrder.fieldIds;
      return fieldIds.slice(0, fieldOrder.visibleFieldCount).map(fieldId => this.parentTable.getFieldById(fieldId));
    }
  }]);
  return View;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(View, "_className", 'View');
var _default = View;
exports.default = _default;