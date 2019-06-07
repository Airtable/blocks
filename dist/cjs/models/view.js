"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("../private_utils");

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var _view_data_store = _interopRequireWildcard(require("./view_data_store"));

var viewTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/view_types/view_type_provider');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


var WatchableViewKeys = Object.freeze({
  name: 'name',
  visibleFields: 'visibleFields',
  allFields: 'allFields'
});

/** Model class representing a view in a table. */
var View =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(View, _AbstractModel);
  (0, _createClass2.default)(View, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableViewKeys, key);
    }
  }]);

  function View(baseData, parentTable, viewDataStore, viewId) {
    var _this;

    (0, _classCallCheck2.default)(this, View);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(View).call(this, baseData, viewId));
    _this._parentTable = parentTable;
    _this._viewDataStore = viewDataStore;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(View, [{
    key: "selectRecords",

    /** */
    value: function selectRecords(opts) {
      return _table_or_view_query_result.default.__createOrReuseQueryResult(this, this._viewDataStore.parentRecordStore, opts || {});
    }
    /**
     * All the fields in the table, including fields that are hidden in this
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */

  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(View.prototype), "watch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = validKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var validKey = _step.value;

          if (validKey === WatchableViewKeys.visibleFields) {
            this._viewDataStore.watch(_view_data_store.WatchableViewDataStoreKeys.visibleFieldIds, callback, context);
          }

          if (validKey === WatchableViewKeys.allFields) {
            this._viewDataStore.watch(_view_data_store.WatchableViewDataStoreKeys.allFieldIds, callback, context);
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
  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(View.prototype), "unwatch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = validKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var validKey = _step2.value;

          if (validKey === WatchableViewKeys.visibleFields) {
            this._viewDataStore.unwatch(_view_data_store.WatchableViewDataStoreKeys.visibleFieldIds, callback, context);
          }

          if (validKey === WatchableViewKeys.allFields) {
            this._viewDataStore.unwatch(_view_data_store.WatchableViewDataStoreKeys.allFieldIds, callback, context);
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
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      this._viewDataStore.triggerOnChangeForDirtyPaths(dirtyPaths);

      if (dirtyPaths.name) {
        this._onChange(WatchableViewKeys.name);
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
    key: "allFields",
    get: function get() {
      return this._viewDataStore.allFieldIds.map(fieldId => this.parentTable.getFieldById(fieldId));
    }
    /**
     * The fields that are not hidden in this view.
     * view. Can be watched to know when fields are created, deleted, or reordered.
     */

  }, {
    key: "visibleFields",
    get: function get() {
      return this._viewDataStore.visibleFieldIds.map(fieldId => this.parentTable.getFieldById(fieldId));
    }
  }]);
  return View;
}(_abstract_model.default);

(0, _defineProperty2.default)(View, "_className", 'View');
var _default = View;
exports.default = _default;