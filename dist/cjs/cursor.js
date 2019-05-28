"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("./private_utils");

var _abstract_model_with_async_data = _interopRequireDefault(require("./models/abstract_model_with_async_data"));

var _record = _interopRequireDefault(require("./models/record"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    h = _window$__requirePriv.h;

var WatchableCursorKeys = Object.freeze({
  selectedRecordIds: 'selectedRecordIds'
});

// NOTE: cursor is an AbstractModel because it needs access to the base data.

/**
 * Contains information about the state of the user's current interactions in Airtable
 *
 * @example
 * import {cursor} from 'airtable-block';
 */
var Cursor =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(Cursor, _AbstractModelWithAsy);
  (0, _createClass2.default)(Cursor, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableCursorKeys, key);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      return true;
    }
  }]);

  function Cursor(baseData, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, Cursor);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Cursor).call(this, baseData, 'cursor'));
    _this._airtableInterface = airtableInterface;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Cursor, [{
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var cursorData;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._airtableInterface.fetchAndSubscribeToCursorDataAsync();

              case 2:
                cursorData = _context.sent;
                this._baseData.cursorData = cursorData;
                return _context.abrupt("return", [WatchableCursorKeys.selectedRecordIds]);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._airtableInterface.unsubscribeFromCursorData();

      this._baseData.cursorData = null;
    }
    /** */

  }, {
    key: "isRecordSelected",

    /** */
    value: function isRecordSelected(recordOrRecordId) {
      h.assert(this._isDataLoaded, 'Cursor data is not loaded');
      var recordId;

      if (recordOrRecordId instanceof _record.default) {
        recordId = recordOrRecordId.id;
      } else {
        recordId = recordOrRecordId;
      }

      return !!this._data.selectedRecordIdSet[recordId];
    }
  }, {
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      if (this.isDataLoaded && dirtyPaths.selectedRecordIdSet) {
        this._onChange(WatchableCursorKeys.selectedRecordIds);
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      return this._baseData.cursorData;
    }
  }, {
    key: "selectedRecordIds",
    get: function get() {
      h.assert(this._isDataLoaded, 'Cursor data is not loaded');
      var selectedRecordIds = Object.keys(this._data.selectedRecordIdSet);
      return selectedRecordIds;
    }
  }]);
  return Cursor;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(Cursor, "_className", 'Cursor');
var _default = Cursor;
exports.default = _default;