"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record the record to expand
 * @param [opts] An optional options object.
 * @param [opts.records] If `records` is provided, the list will be used to page through
 * records from the expanded record dialog.
 *
 * @example
 * import {expandRecord} from '@airtable/blocks/ui';
 * expandRecord(record1, {
 *     records: [record1, record2, record3],
 * });
 */
function expandRecord(record, opts) {
  // TODO(kasra): this will cause the liveapp page to force a refresh if the
  // tableId and recordId are both valid, but the recordId does not
  // exist in the table.
  var recordIds = null;

  if (opts && opts.records) {
    recordIds = opts.records.map(r => r.id);
  }

  (0, _get_sdk.default)().__airtableInterface.expandRecord(record.parentTable.id, record.id, recordIds);
}

var _default = expandRecord;
exports.default = _default;