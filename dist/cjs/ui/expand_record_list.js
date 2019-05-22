"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

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
  var _context;

  if (records.length === 0) {
    return;
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

  (0, _get_sdk.default)().__airtableInterface.expandRecordList(tableId, recordIds, fieldIds);
}

var _default = expandRecordList;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9leHBhbmRfcmVjb3JkX2xpc3QuanMiXSwibmFtZXMiOlsiZXhwYW5kUmVjb3JkTGlzdCIsInJlY29yZHMiLCJvcHRzIiwibGVuZ3RoIiwidGFibGVJZCIsInBhcmVudFRhYmxlIiwiaWQiLCJyZWNvcmRJZHMiLCJyZWNvcmQiLCJmaWVsZElkcyIsImZpZWxkcyIsImZpZWxkIiwiX19haXJ0YWJsZUludGVyZmFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxTQUFTQSxnQkFBVCxDQUNJQyxPQURKLEVBRUlDLElBRkosRUFLRTtBQUFBOztBQUNFLE1BQUlELE9BQU8sQ0FBQ0UsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN0QjtBQUNIOztBQUVELFFBQU1DLE9BQU8sR0FBR0gsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXSSxXQUFYLENBQXVCQyxFQUF2QztBQUVBLFFBQU1DLFNBQVMsR0FBRyxrQkFBQU4sT0FBTyxNQUFQLENBQUFBLE9BQU8sRUFBS08sTUFBTSxJQUFJO0FBQ3BDLDRCQUFVQSxNQUFNLENBQUNILFdBQVAsQ0FBbUJDLEVBQW5CLEtBQTBCRixPQUFwQyxFQUE2QywyQ0FBN0M7QUFDQSxXQUFPSSxNQUFNLENBQUNGLEVBQWQ7QUFDSCxHQUh3QixDQUF6QjtBQUtBLFFBQU1HLFFBQVEsR0FDVlAsSUFBSSxJQUFJQSxJQUFJLENBQUNRLE1BQWIsR0FDTSw2QkFBQVIsSUFBSSxDQUFDUSxNQUFMLGlCQUFnQkMsS0FBSyxJQUFJO0FBQ3JCLDRCQUNJQSxLQUFLLENBQUNOLFdBQU4sQ0FBa0JDLEVBQWxCLEtBQXlCRixPQUQ3QixFQUVJLDBDQUZKO0FBSUEsV0FBT08sS0FBSyxDQUFDTCxFQUFiO0FBQ0gsR0FORCxDQUROLEdBUU0sSUFUVjs7QUFXQSwwQkFBU00sbUJBQVQsQ0FBNkJaLGdCQUE3QixDQUE4Q0ksT0FBOUMsRUFBdURHLFNBQXZELEVBQWtFRSxRQUFsRTtBQUNIOztlQUVjVCxnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgZ2V0U2RrIGZyb20gJy4uL2dldF9zZGsnO1xuaW1wb3J0IHR5cGUgUmVjb3JkIGZyb20gJy4uL21vZGVscy9yZWNvcmQnO1xuaW1wb3J0IHR5cGUgRmllbGQgZnJvbSAnLi4vbW9kZWxzL2ZpZWxkJztcblxuLyoqXG4gKiBFeHBhbmRzIGEgbGlzdCBvZiByZWNvcmRzIGluIHRoZSBBaXJ0YWJsZSBVSVxuICpcbiAqIEBwYXJhbSByZWNvcmRzIHRoZSByZWNvcmRzIHRvIGV4cGFuZC4gRHVwbGljYXRlIHJlY29yZHMgd2lsbCBiZSByZW1vdmVkLlxuICogQHBhcmFtIG9wdHMuZmllbGRzIG9wdGlvbmFsbHkgaW5jbHVkZSBhbiBhcnJheSBvZiBmaWVsZHMgdG8gY29udHJvbFxuICogd2hpY2ggZmllbGRzIGFyZSBzaG93biBpbiB0aGUgcmVjb3JkIGNhcmRzLiBUaGUgcHJpbWFyeSBmaWVsZCB3aWxsIGFsd2F5c1xuICogYmUgc2hvd24uIER1cGxpY2F0ZSBmaWVsZHMgd2lsbCBiZSByZW1vdmVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge1VJfSBmcm9tICdhaXJ0YWJsZS1ibG9jayc7XG4gKiBVSS5leHBhbmRSZWNvcmRMaXN0KFtyZWNvcmQxLCByZWNvcmQyLCByZWNvcmQzXSk7XG4gKlxuICogVUkuZXhwYW5kUmVjb3JkTGlzdChbcmVjb3JkMSwgcmVjb3JkMl0sIHtcbiAqICAgICBmaWVsZHM6IFtmaWVsZDEsIGZpZWxkMl0sXG4gKiB9KTtcbiAqL1xuZnVuY3Rpb24gZXhwYW5kUmVjb3JkTGlzdChcbiAgICByZWNvcmRzOiBBcnJheTxSZWNvcmQ+LFxuICAgIG9wdHM/OiB7XG4gICAgICAgIGZpZWxkcz86IEFycmF5PEZpZWxkPixcbiAgICB9LFxuKSB7XG4gICAgaWYgKHJlY29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUlkID0gcmVjb3Jkc1swXS5wYXJlbnRUYWJsZS5pZDtcblxuICAgIGNvbnN0IHJlY29yZElkcyA9IHJlY29yZHMubWFwKHJlY29yZCA9PiB7XG4gICAgICAgIGludmFyaWFudChyZWNvcmQucGFyZW50VGFibGUuaWQgPT09IHRhYmxlSWQsICdhbGwgcmVjb3JkcyBtdXN0IGJlbG9uZyB0byB0aGUgc2FtZSB0YWJsZScpO1xuICAgICAgICByZXR1cm4gcmVjb3JkLmlkO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmllbGRJZHMgPVxuICAgICAgICBvcHRzICYmIG9wdHMuZmllbGRzXG4gICAgICAgICAgICA/IG9wdHMuZmllbGRzLm1hcChmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICAgICAgICAgICAgZmllbGQucGFyZW50VGFibGUuaWQgPT09IHRhYmxlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgJ2FsbCBmaWVsZHMgbXVzdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGFibGUnLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC5pZDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogbnVsbDtcblxuICAgIGdldFNkaygpLl9fYWlydGFibGVJbnRlcmZhY2UuZXhwYW5kUmVjb3JkTGlzdCh0YWJsZUlkLCByZWNvcmRJZHMsIGZpZWxkSWRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwYW5kUmVjb3JkTGlzdDtcbiJdfQ==