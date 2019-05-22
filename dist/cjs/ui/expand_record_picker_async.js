"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _invariant = _interopRequireDefault(require("invariant"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

/**
 * Expands a list of records in the Airtable UI, and prompts the user to pick
 * one. The selected record is returned to the block, and the modal is
 * automatically closed.
 *
 * If the user dismisses the modal, or another one is opened before this one
 * has been closed, it will return null.
 *
 * @param records the records the user can pick from. Duplicate records will be removed.
 * @param opts.fields optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 * @param opts.shouldAllowCreatingRecord set to true to allow the user to create
 * an empty new record.
 *
 * @returns {Promise<record | null>} a Promise that resolves to the record
 * chosen by the user or null
 *
 * @example
 * import {UI} from 'airtable-block';
 *
 * const record = await UI.expandRecordPickerAsync([record1, record2, record3]);
 * if (record !== null) {
 *   alert(record.primaryCellValueAsString);
 * } else {
 *   alert('no record picked');
 * }
 *
 * const record = await UI.expandRecordPickerAsync([record1, record2], {
 *     fields: [field1, field2],
 * });
 */
async function expandRecordPickerAsync(records, opts) {
  var _context;

  if (records.length === 0) {
    return null;
  }

  const tableId = records[0].parentTable.id;
  const recordIds = (0, _map.default)(records).call(records, record => {
    (0, _invariant.default)(record.parentTable.id === tableId, 'all records must belong to the same table');
    return record.id;
  });
  const fieldIds = opts && opts.fields ? (0, _map.default)(_context = opts.fields).call(_context, field => {
    (0, _invariant.default)(field.parentTable.id === tableId, 'all fields must belong to the same table');
    return field.id;
  }) : null;
  const sdk = (0, _get_sdk.default)();
  const shouldAllowCreatingRecord = !!opts && !!opts.shouldAllowCreatingRecord;
  const chosenRecordId = await sdk.__airtableInterface.expandRecordPickerAsync(tableId, recordIds, fieldIds, shouldAllowCreatingRecord);

  if (!chosenRecordId) {
    return null;
  }

  const table = sdk.base.getTableById(tableId);

  if (!table) {
    // table has probably been deleted
    return null;
  }

  return table.getRecordById(chosenRecordId);
}

var _default = expandRecordPickerAsync;
exports.default = _default;