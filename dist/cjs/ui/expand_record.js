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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9leHBhbmRfcmVjb3JkLmpzIl0sIm5hbWVzIjpbImV4cGFuZFJlY29yZCIsInJlY29yZCIsIm9wdHMiLCJyZWNvcmRJZHMiLCJyZWNvcmRzIiwiciIsImlkIiwiX19haXJ0YWJsZUludGVyZmFjZSIsInBhcmVudFRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBOztBQU9BOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBU0EsWUFBVCxDQUFzQkMsTUFBdEIsRUFBc0NDLElBQXRDLEVBQStEO0FBQzNEO0FBQ0E7QUFDQTtBQUVBLE1BQUlDLFNBQVMsR0FBRyxJQUFoQjs7QUFDQSxNQUFJRCxJQUFJLElBQUlBLElBQUksQ0FBQ0UsT0FBakIsRUFBMEI7QUFBQTs7QUFDdEJELElBQUFBLFNBQVMsR0FBRyw2QkFBQUQsSUFBSSxDQUFDRSxPQUFMLGlCQUFpQkMsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLEVBQXhCLENBQVo7QUFDSDs7QUFFRCwwQkFBU0MsbUJBQVQsQ0FBNkJQLFlBQTdCLENBQTBDQyxNQUFNLENBQUNPLFdBQVAsQ0FBbUJGLEVBQTdELEVBQWlFTCxNQUFNLENBQUNLLEVBQXhFLEVBQTRFSCxTQUE1RTtBQUNIOztlQUVjSCxZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBnZXRTZGsgZnJvbSAnLi4vZ2V0X3Nkayc7XG5pbXBvcnQgdHlwZSBSZWNvcmQgZnJvbSAnLi4vbW9kZWxzL3JlY29yZCc7XG5cbmV4cG9ydCB0eXBlIEV4cGFuZFJlY29yZE9wdHMgPSB7XG4gICAgcmVjb3Jkcz86IEFycmF5PFJlY29yZD4sXG59O1xuXG4vKipcbiAqIEV4cGFuZHMgdGhlIGdpdmVuIHJlY29yZCBpbiB0aGUgQWlydGFibGUgVUkuXG4gKlxuICogQHBhcmFtIHJlY29yZCB0aGUgcmVjb3JkIHRvIGV4cGFuZFxuICogQHBhcmFtIG9wdHMgSWYgYHJlY29yZHNgIGlzIHByb3ZpZGVkLCB0aGUgbGlzdCB3aWxsIGJlIHVzZWQgdG8gcGFnZSB0aHJvdWdoXG4gKiByZWNvcmRzIGZyb20gdGhlIGV4cGFuZGVkIHJlY29yZCBkaWFsb2cuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7VUl9IGZyb20gJ2FpcnRhYmxlLWJsb2NrJztcbiAqIFVJLmV4cGFuZFJlY29yZChyZWNvcmQxLCB7XG4gKiAgICAgcmVjb3JkczogW3JlY29yZDEsIHJlY29yZDIsIHJlY29yZDNdLFxuICogfSk7XG4gKi9cbmZ1bmN0aW9uIGV4cGFuZFJlY29yZChyZWNvcmQ6IFJlY29yZCwgb3B0cz86IEV4cGFuZFJlY29yZE9wdHMpIHtcbiAgICAvLyBUT0RPKGthc3JhKTogdGhpcyB3aWxsIGNhdXNlIHRoZSBsaXZlYXBwIHBhZ2UgdG8gZm9yY2UgYSByZWZyZXNoIGlmIHRoZVxuICAgIC8vIHRhYmxlSWQgYW5kIHJlY29yZElkIGFyZSBib3RoIHZhbGlkLCBidXQgdGhlIHJlY29yZElkIGRvZXMgbm90XG4gICAgLy8gZXhpc3QgaW4gdGhlIHRhYmxlLlxuXG4gICAgbGV0IHJlY29yZElkcyA9IG51bGw7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5yZWNvcmRzKSB7XG4gICAgICAgIHJlY29yZElkcyA9IG9wdHMucmVjb3Jkcy5tYXAociA9PiByLmlkKTtcbiAgICB9XG5cbiAgICBnZXRTZGsoKS5fX2FpcnRhYmxlSW50ZXJmYWNlLmV4cGFuZFJlY29yZChyZWNvcmQucGFyZW50VGFibGUuaWQsIHJlY29yZC5pZCwgcmVjb3JkSWRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXhwYW5kUmVjb3JkO1xuIl19