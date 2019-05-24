"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _invariant = _interopRequireDefault(require("invariant"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

/**
 * Expands a list of records in the Airtable UI
 *
 * @param records the records to expand. Duplicate records will be removed.
 * @param opts.fields optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.expandRecordList([record1, record2, record3]);
 *
 * UI.expandRecordList([record1, record2], {
 *     fields: [field1, field2],
 * });
 */
function expandRecordList(records, opts) {
  if (records.length === 0) {
    return;
  }

  var tableId = records[0].parentTable.id;
  var recordIds = records.map(record => {
    (0, _invariant.default)(record.parentTable.id === tableId, 'all records must belong to the same table');
    return record.id;
  });
  var fieldIds = opts && opts.fields ? opts.fields.map(field => {
    (0, _invariant.default)(field.parentTable.id === tableId, 'all fields must belong to the same table');
    return field.id;
  }) : null;

  (0, _get_sdk.default)().__airtableInterface.expandRecordList(tableId, recordIds, fieldIds);
}

var _default = expandRecordList;
exports.default = _default;