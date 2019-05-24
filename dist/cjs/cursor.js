"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _private_utils = require("./private_utils");

var _abstract_model_with_async_data = _interopRequireDefault(require("./models/abstract_model_with_async_data"));

var _record = _interopRequireDefault(require("./models/record"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    h = _window$__requirePriv.h;

var WatchableCursorKeys = {
  selectedRecordIds: 'selectedRecordIds'
};

// NOTE: cursor is an AbstractModel because it needs access to the base data.

/**
 * Contains information about the state of the user's current interactions in Airtable
 *
 * @example
 * import {cursor} from 'airtable-block';
 */
class Cursor extends _abstract_model_with_async_data.default {
  static _isWatchableKey(key) {
    return (0, _private_utils.isEnumValue)(WatchableCursorKeys, key);
  }

  static _shouldLoadDataForKey(key) {
    return true;
  }

  constructor(baseData, airtableInterface) {
    super(baseData, 'cursor');
    this._airtableInterface = airtableInterface;
    Object.seal(this);
  }

  get _dataOrNullIfDeleted() {
    return this._baseData.cursorData;
  }

  _loadDataAsync() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var cursorData;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this._airtableInterface.fetchAndSubscribeToCursorDataAsync();

            case 2:
              cursorData = _context.sent;
              _this._baseData.cursorData = cursorData;
              return _context.abrupt("return", [WatchableCursorKeys.selectedRecordIds]);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }

  _unloadData() {
    this._airtableInterface.unsubscribeFromCursorData();

    this._baseData.cursorData = null;
  }
  /** */


  get selectedRecordIds() {
    h.assert(this._isDataLoaded, 'Cursor data is not loaded');
    var selectedRecordIds = Object.keys(this._data.selectedRecordIdSet);
    return selectedRecordIds;
  }
  /** */


  isRecordSelected(recordOrRecordId) {
    h.assert(this._isDataLoaded, 'Cursor data is not loaded');
    var recordId;

    if (recordOrRecordId instanceof _record.default) {
      recordId = recordOrRecordId.id;
    } else {
      recordId = recordOrRecordId;
    }

    return !!this._data.selectedRecordIdSet[recordId];
  }

  __triggerOnChangeForDirtyPaths(dirtyPaths) {
    if (this.isDataLoaded && dirtyPaths.selectedRecordIdSet) {
      this._onChange(WatchableCursorKeys.selectedRecordIds);
    }
  }

}

(0, _defineProperty2.default)(Cursor, "_className", 'Cursor');
var _default = Cursor;
exports.default = _default;