"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

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
    var _context;

    var tableId, recordIds, fieldIds, sdk, shouldAllowCreatingRecord, chosenRecordId, table;
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(records.length === 0)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", null);

          case 2:
            tableId = records[0].parentTable.id;
            recordIds = (0, _map.default)(records).call(records, function (record) {
              (0, _invariant.default)(record.parentTable.id === tableId, 'all records must belong to the same table');
              return record.id;
            });
            fieldIds = opts && opts.fields ? (0, _map.default)(_context = opts.fields).call(_context, function (field) {
              (0, _invariant.default)(field.parentTable.id === tableId, 'all fields must belong to the same table');
              return field.id;
            }) : null;
            sdk = (0, _get_sdk.default)();
            shouldAllowCreatingRecord = !!opts && !!opts.shouldAllowCreatingRecord;
            _context2.next = 9;
            return sdk.__airtableInterface.expandRecordPickerAsync(tableId, recordIds, fieldIds, shouldAllowCreatingRecord);

          case 9:
            chosenRecordId = _context2.sent;

            if (chosenRecordId) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", null);

          case 12:
            table = sdk.base.getTableById(tableId);

            if (table) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("return", null);

          case 15:
            return _context2.abrupt("return", table.getRecordById(chosenRecordId));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  }));
  return _expandRecordPickerAsync.apply(this, arguments);
}

var _default = expandRecordPickerAsync;
exports.default = _default;