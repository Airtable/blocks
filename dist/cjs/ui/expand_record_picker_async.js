"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
function expandRecordPickerAsync(_x, _x2) {
  return _expandRecordPickerAsync.apply(this, arguments);
}

function _expandRecordPickerAsync() {
  _expandRecordPickerAsync = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(records, opts) {
    var tableId, recordIds, fieldIds, sdk, shouldAllowCreatingRecord, chosenRecordId, table;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(records.length === 0)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", null);

          case 2:
            tableId = records[0].parentTable.id;
            recordIds = records.map(record => {
              (0, _invariant.default)(record.parentTable.id === tableId, 'all records must belong to the same table');
              return record.id;
            });
            fieldIds = opts && opts.fields ? opts.fields.map(field => {
              (0, _invariant.default)(field.parentTable.id === tableId, 'all fields must belong to the same table');
              return field.id;
            }) : null;
            sdk = (0, _get_sdk.default)();
            shouldAllowCreatingRecord = !!opts && !!opts.shouldAllowCreatingRecord;
            _context.next = 9;
            return sdk.__airtableInterface.expandRecordPickerAsync(tableId, recordIds, fieldIds, shouldAllowCreatingRecord);

          case 9:
            chosenRecordId = _context.sent;

            if (chosenRecordId) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", null);

          case 12:
            table = sdk.base.getTableById(tableId);

            if (table) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", null);

          case 15:
            return _context.abrupt("return", table.__getRecordById(chosenRecordId));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _expandRecordPickerAsync.apply(this, arguments);
}

var _default = expandRecordPickerAsync;
exports.default = _default;