"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record the record to expand
 * @param opts If `records` is provided, the list will be used to page through
 * records from the expanded record dialog.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.expandRecord(record1, {
 *     records: [record1, record2, record3],
 * });
 */
function expandRecord(record, opts) {
  // TODO(kasra): this will cause the liveapp page to force a refresh if the
  // tableId and recordId are both valid, but the recordId does not
  // exist in the table.
  let recordIds = null;

  if (opts && opts.records) {
    var _context;

    recordIds = (0, _map.default)(_context = opts.records).call(_context, r => r.id);
  }

  (0, _get_sdk.default)().__airtableInterface.expandRecord(record.parentTable.id, record.id, recordIds);
}

var _default = expandRecord;
exports.default = _default;