"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _private_utils = _interopRequireDefault(require("./private_utils"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./models/abstract_model_with_async_data"));

var _record = _interopRequireDefault(require("./models/record"));

const {
  h
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const WatchableCursorKeys = {
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
    return _private_utils.default.isEnumValue(WatchableCursorKeys, key);
  }

  static _shouldLoadDataForKey(key) {
    return true;
  }

  constructor(baseData, airtableInterface) {
    super(baseData, 'cursor');
    this._airtableInterface = airtableInterface;
    (0, _seal.default)(this);
  }

  get _dataOrNullIfDeleted() {
    return this._baseData.cursorData;
  }

  async _loadDataAsync() {
    const cursorData = await this._airtableInterface.fetchAndSubscribeToCursorDataAsync();
    this._baseData.cursorData = cursorData;
    return [WatchableCursorKeys.selectedRecordIds];
  }

  _unloadData() {
    this._airtableInterface.unsubscribeFromCursorData();

    this._baseData.cursorData = null;
  }
  /** */


  get selectedRecordIds() {
    h.assert(this._isDataLoaded, 'Cursor data is not loaded');
    const selectedRecordIds = (0, _keys.default)(this._data.selectedRecordIdSet);
    return selectedRecordIds;
  }
  /** */


  isRecordSelected(recordOrRecordId) {
    h.assert(this._isDataLoaded, 'Cursor data is not loaded');
    let recordId;

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