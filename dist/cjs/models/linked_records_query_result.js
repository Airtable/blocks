"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _object_pool = _interopRequireDefault(require("./object_pool"));

var _query_result = _interopRequireDefault(require("./query_result"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

const getLinkedTableId = field => {
  const options = field.config.options;
  const linkedTableId = options && options.linkedTableId;
  (0, _invariant.default)(linkedTableId, 'linkedTableId must exist');
  return linkedTableId;
}; // eslint-disable-next-line no-use-before-define


const pool = new _object_pool.default({
  getKeyFromObject: queryResult => queryResult._poolKey,
  getKeyFromObjectOptions: ({
    field,
    record
  }) => {
    return `${record.id}::${field.id}::${getLinkedTableId(field)}`;
  },
  canObjectBeReusedForOptions: (queryResult, {
    normalizedOpts
  }) => {
    return queryResult.isValid && queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
  }
});
/**
 * Represents a set of records from a LinkedRecord cell value.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.getLinkedRecordsFromCell`.
 */

class LinkedRecordsQueryResult extends _query_result.default {
  static __createOrReuseQueryResult(record, field, opts) {
    (0, _invariant.default)(record.parentTable === field.parentTable, 'record and field must belong to the same table');
    (0, _invariant.default)(field.config.type === _field.FieldTypes.MULTIPLE_RECORD_LINKS, 'field must be MULTIPLE_RECORD_LINKS');
    const linkedTableId = field.config.options && field.config.options.linkedTableId;
    (0, _invariant.default)(linkedTableId, 'linkedTableId must be set');
    const linkedTable = (0, _get_sdk.default)().base.getTableById(linkedTableId);
    (0, _invariant.default)(linkedTable, 'linkedTable must exist');

    const normalizedOpts = _table_or_view_query_result.default._normalizeOpts(linkedTable, opts);

    const queryResult = pool.getObjectForReuse({
      record,
      field,
      normalizedOpts
    });

    if (queryResult) {
      return queryResult;
    } else {
      return new LinkedRecordsQueryResult(record, field, opts);
    }
  } // the record containing the linked-record cell this is a query of.


  constructor(record, field, opts) {
    const linkedTableId = getLinkedTableId(field);
    const linkedTable = (0, _get_sdk.default)().base.getTableById(linkedTableId);
    (0, _invariant.default)(linkedTable, 'table must exist');

    const normalizedOpts = _query_result.default._normalizeOpts(linkedTable, opts);

    super(normalizedOpts, record.parentTable.__baseData);
    (0, _defineProperty2.default)(this, "_isValid", true);
    (0, _defineProperty2.default)(this, "_computedRecordIdsSet", null);
    (0, _defineProperty2.default)(this, "_computedFilteredSortedRecordIds", null);
    (0, _defineProperty2.default)(this, "_cellValueChangeHandlerByFieldId", {});
    (0, _invariant.default)(record.parentTable === field.parentTable, 'record and field must belong to the same table');
    this._record = record;
    this._field = field;
    this._linkedTable = linkedTable;
    this._poolKey = `${record.id}::${field.id}::${linkedTableId}`; // we could rely on QueryResult's reuse pool to make sure we get back
    // the same QueryResult every time, but that would make it much harder
    // to make sure we unwatch everything from the old QueryResult if e.g.
    // the field config changes to point at a different table

    this._linkedQueryResult = _table_or_view_query_result.default.__createOrReuseQueryResult(linkedTable, opts);
  }
  /**
   * Is the query result currently valid? This value always starts as 'true',
   * but can become false if the field config changes to link to a different
   * table or a type other than MULTIPLE_RECORD_LINKS. Once `isValid` has
   * become false, it will never become true again. Many fields will throw on
   * attempting to access them, and watches will no longer fire.
   */


  get isValid() {
    return this._isValid;
  }
  /**
   * The table that the records in the QueryResult are a part of
   */


  get parentTable() {
    (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
    return this._linkedTable;
  }
  /**
   * Ordered array of all the linked record ids.
   * Watchable.
   */


  get recordIds() {
    (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
    (0, _invariant.default)(this.isDataLoaded, 'LinkedRecordsQueryResult data is not loaded'); // record ids are lazily generated

    this._generateComputedDataIfNeeded();

    (0, _invariant.default)(this._computedFilteredSortedRecordIds, 'no recordIds');
    return this._computedFilteredSortedRecordIds;
  }
  /**
   * Ordered array of all the linked records.
   * Watchable.
   */


  get records() {
    var _context;

    (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
    const linkedTable = this._linkedTable;
    return (0, _map.default)(_context = this.recordIds).call(_context, recordId => {
      const record = linkedTable.getRecordById(recordId);
      (0, _invariant.default)(record, `No record for id: ${recordId}`);
      return record;
    });
  }
  /**
   * The fields that were used to create this LinkedRecordsQueryResult.
   */


  get fields() {
    (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
    return this._linkedQueryResult.fields;
  }

  watch(keys, callback, context) {
    (0, _invariant.default)(this.isValid, 'cannot watch an invalid LinkedRecordQueryResult');
    const validKeys = super.watch(keys, callback, context);

    for (const key of validKeys) {
      var _context2;

      _private_utils.default.fireAndForgetPromise((0, _bind.default)(_context2 = this.loadDataAsync).call(_context2, this));

      if (key === _query_result.default.WatchableKeys.cellValues) {
        this._watchLinkedQueryCellValuesIfNeededAfterWatch();
      }

      if ((0, _startsWith.default)(key).call(key, _query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
        const fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

        this._watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId);
      }
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    const validKeys = super.unwatch(keys, callback, context);

    for (const key of validKeys) {
      this.unloadData();

      if (key === _query_result.default.WatchableKeys.cellValues) {
        this._unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch();
      }

      if ((0, _startsWith.default)(key).call(key, _query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
        const fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

        this._unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId);
      }
    }

    return validKeys;
  }

  async loadDataAsync() {
    await super.loadDataAsync();

    if (!this.isDataLoaded) {
      // data still might not be loaded after the promise resolves if the
      // linked table changed. in that case, call again:
      await this.loadDataAsync(); // there has to be an unloadData call for every loadDataAsync call.
      // call it here to offset calling loadDataAsync a second time

      this.unloadData();
    }
  }

  async _loadDataAsync() {
    pool.registerObjectForReuse(this);

    this._watchOrigin();

    this._watchLinkedQueryResult();

    await _promise.default.all([this._record.parentTable.loadCellValuesInFieldIdsAsync([this._field.id]), this._linkedQueryResult.loadDataAsync(), this._loadRecordColorsAsync()]);

    this._invalidateComputedData();

    return ['records', 'recordIds'];
  }

  _unloadData() {
    if (this.isValid) {
      pool.unregisterObjectForReuse(this);

      this._unwatchOrigin();

      this._unwatchLinkedQueryResult();

      this._record.parentTable.unloadCellValuesInFieldIds([this._field.id]);

      this._linkedQueryResult.unloadData();

      this._unloadRecordColors();

      this._invalidateComputedData();
    }
  }

  get _cellValuesWatchCount() {
    return (this._changeWatchersByKey[_query_result.default.WatchableKeys.cellValues] || []).length;
  }

  _watchLinkedQueryCellValuesIfNeededAfterWatch() {
    if (this._cellValuesWatchCount === 1) {
      this._watchLinkedQueryCellValues();
    }
  }

  _unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch() {
    (0, _invariant.default)(this._cellValuesWatchCount > 0, 'overfree cellValues watch');

    if (this._cellValuesWatchCount === 0 && this.isValid) {
      this._unwatchLinkedQueryCellValues();
    }
  }

  get _cellValueWatchCountByFieldId() {
    var _context3;

    const countByFieldId = {};
    const watchKeys = (0, _filter.default)(_context3 = (0, _keys.default)(this._changeWatchersByKey)).call(_context3, key => {
      return (0, _startsWith.default)(key).call(key, _query_result.default.WatchableCellValuesInFieldKeyPrefix);
    });

    for (const watchKey of watchKeys) {
      const fieldId = (0, _slice.default)(watchKey).call(watchKey, _query_result.default.WatchableCellValuesInFieldKeyPrefix.length);
      countByFieldId[fieldId] = (this._changeWatchersByKey[watchKey] || []).length;
    }

    return countByFieldId;
  }

  _watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId) {
    if (this._cellValueWatchCountByFieldId[fieldId] === 1 && this.isValid) {
      this._watchLinkedQueryCellValuesInField(fieldId);
    }
  }

  _unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId) {
    (0, _invariant.default)(this._cellValueWatchCountByFieldId[fieldId] && this._cellValueWatchCountByFieldId[fieldId] > 0, `cellValuesInField:${fieldId} over-free'd`);

    if (this._cellValueWatchCountByFieldId[fieldId] === 0 && this.isValid) {
      this._unwatchLinkedQueryCellValuesInField(fieldId);
    }
  }

  _watchOrigin() {
    // if the cell values in the record change, we need to invalidate our
    // cached data and notify watchers
    this._record.watch(`cellValueInField:${this._field.id}`, this._onOriginCellValueChange, this); // if the field config changes, we need to invalidate cached data,
    // and potentially start watching a different table


    this._field.watch('config', this._onOriginFieldConfigChange, this);
  }

  _unwatchOrigin() {
    this._record.unwatch(`cellValueInField:${this._field.id}`, this._onOriginCellValueChange, this);

    this._field.unwatch('config', this._onOriginFieldConfigChange, this);
  }

  _watchLinkedQueryResult() {
    // in the linked table, all we care about is the set of recordIds.
    // this watch fire when they're added/removed and when they change
    // order. we only care about order, because add/remove is handled by
    // watching the origin record
    this._linkedQueryResult.watch('recordIds', this._onLinkedRecordIdsChange, this);
  }

  _unwatchLinkedQueryResult() {
    this._linkedQueryResult.unwatch('recordIds', this._onLinkedRecordIdsChange, this);
  }

  _watchLinkedQueryCellValues() {
    this._linkedQueryResult.watch('cellValues', this._onLinkedCellValuesChange, this);
  }

  _unwatchLinkedQueryCellValues() {
    this._linkedQueryResult.unwatch('cellValues', this._onLinkedCellValuesChange, this);
  }

  _watchLinkedQueryCellValuesInField(fieldId) {
    this._linkedQueryResult.watch(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._getOnLinkedCellValuesInFieldChange(fieldId), this);
  }

  _unwatchLinkedQueryCellValuesInField(fieldId) {
    this._linkedQueryResult.unwatch(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._getOnLinkedCellValuesInFieldChange(fieldId), this);
  }

  _onLinkedRecordIdsChange() {
    (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

    if (!this.isDataLoaded) {
      return;
    }

    this._invalidateComputedData(); // we don't actually know at this stage whether anything changed or
    // not. it may have done though, so notify watchers


    this._onChange('records');

    this._onChange('recordIds');
  } // eslint-disable-next-line flowtype/no-weak-types


  _onLinkedCellValuesChange(queryResult, key, changes) {
    (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

    if (changes && changes.fieldIds && changes.recordIds) {
      var _context4;

      const recordIdsSet = this._getOrGenerateRecordIdsSet();

      const recordIds = (0, _filter.default)(_context4 = changes.recordIds).call(_context4, id => recordIdsSet[id] === true);

      if (recordIds.length) {
        this._onChange('cellValues', {
          fieldIds: changes.fieldIds,
          recordIds
        });
      }
    } else {
      this._onChange('cellValues');
    }
  }

  _getOnLinkedCellValuesInFieldChange(fieldId) {
    if (!this._cellValueChangeHandlerByFieldId[fieldId]) {
      this._cellValueChangeHandlerByFieldId[fieldId] = (queryResult, key, recordIds) => {
        (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

        if ((0, _isArray.default)(recordIds)) {
          const recordIdsSet = this._getOrGenerateRecordIdsSet();

          const filteredRecordIds = (0, _filter.default)(recordIds).call(recordIds, id => typeof id === 'string' && recordIdsSet[id] === true);

          if (filteredRecordIds.length) {
            this._onChange(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, filteredRecordIds);
          }
        } else {
          this._onChange(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }
      };
    }

    return this._cellValueChangeHandlerByFieldId[fieldId];
  }

  _onOriginCellValueChange() {
    (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

    if (!this.isDataLoaded) {
      return;
    } // when the origin cell value (listing all the linked records) changes,
    // invalidate all the data we have stored - we need to completely
    // regenerate it


    this._invalidateComputedData(); // notify watchers that our set of linked records has changed


    this._onChange('records');

    this._onChange('recordIds');
  }

  _onOriginFieldConfigChange() {
    (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');
    const type = this._field.config.type;

    if (type !== _field.FieldTypes.MULTIPLE_RECORD_LINKS) {
      this._invalidateQueryResult();

      return;
    }

    const linkedTableId = getLinkedTableId(this._field);

    if (linkedTableId !== this._linkedTable.id) {
      this._invalidateQueryResult();

      return;
    }
  }

  _invalidateQueryResult() {
    if (this.isDataLoaded) {
      this._unloadData();
    }

    if (this._cellValuesWatchCount > 0) {
      this._unwatchLinkedQueryCellValues();
    }

    for (const fieldId of (0, _keys.default)(this._cellValueWatchCountByFieldId)) {
      if (this._cellValueWatchCountByFieldId[fieldId] > 0) {
        this._unwatchLinkedQueryCellValuesInField(fieldId);
      }
    }

    this._isValid = false;

    this._onChange('records');

    this._onChange('recordIds');
  }

  _invalidateComputedData() {
    this._computedRecordIdsSet = null;
    this._computedFilteredSortedRecordIds = null;
  }

  _generateComputedDataIfNeeded() {
    if (!this._computedRecordIdsSet) {
      this._generateComputedData();
    }
  }

  _generateComputedData() {
    const recordIdsSet = {};

    const rawCellValue = this._record.getCellValue(this._field);

    const cellValue = rawCellValue === null ? [] : rawCellValue;
    (0, _invariant.default)((0, _isArray.default)(cellValue), 'cellValue should be array');

    for (const linkedRecord of cellValue) {
      (0, _invariant.default)(linkedRecord && typeof linkedRecord === 'object', 'linked record should be object');
      const recordId = linkedRecord.id;
      (0, _invariant.default)(typeof recordId === 'string', 'id should be present'); // We need to use the query result as the source of truth for
      // recordIds, since when the client deletes a record from the linked
      // table, we update it optimistically but the origin cell value
      // doesn't update until receiving the push payload.

      if (this._linkedQueryResult.hasRecord(recordId)) {
        recordIdsSet[recordId] = true;
      }
    }

    this._computedRecordIdsSet = recordIdsSet;

    if (this._normalizedOpts.sorts && this._normalizedOpts.sorts.length) {
      var _context5;

      // when sorts are present, record order comes from the query result
      this._computedFilteredSortedRecordIds = (0, _filter.default)(_context5 = this._linkedQueryResult.recordIds).call(_context5, recordId => recordIdsSet[recordId] === true);
    } else {
      // with no sorts, record order is the same as in the cell in the
      // main Airtable UI. Since we generated recordIdsSet by iterating
      // over the cell value, we're guaranteed that the key order matches
      // the linked record order in the cell.
      this._computedFilteredSortedRecordIds = (0, _keys.default)(recordIdsSet);
    }
  }

  _getOrGenerateRecordIdsSet() {
    this._generateComputedDataIfNeeded();

    const recordIdsSet = this._computedRecordIdsSet;
    (0, _invariant.default)(recordIdsSet, 'recordIdsSet must exist');
    return recordIdsSet;
  }

}

(0, _defineProperty2.default)(LinkedRecordsQueryResult, "_className", 'LinkedRecordsQueryResult');
var _default = LinkedRecordsQueryResult;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbGlua2VkX3JlY29yZHNfcXVlcnlfcmVzdWx0LmpzIl0sIm5hbWVzIjpbImdldExpbmtlZFRhYmxlSWQiLCJmaWVsZCIsIm9wdGlvbnMiLCJjb25maWciLCJsaW5rZWRUYWJsZUlkIiwicG9vbCIsIk9iamVjdFBvb2wiLCJnZXRLZXlGcm9tT2JqZWN0IiwicXVlcnlSZXN1bHQiLCJfcG9vbEtleSIsImdldEtleUZyb21PYmplY3RPcHRpb25zIiwicmVjb3JkIiwiaWQiLCJjYW5PYmplY3RCZVJldXNlZEZvck9wdGlvbnMiLCJub3JtYWxpemVkT3B0cyIsImlzVmFsaWQiLCJfX2NhbkJlUmV1c2VkRm9yTm9ybWFsaXplZE9wdHMiLCJMaW5rZWRSZWNvcmRzUXVlcnlSZXN1bHQiLCJRdWVyeVJlc3VsdCIsIl9fY3JlYXRlT3JSZXVzZVF1ZXJ5UmVzdWx0Iiwib3B0cyIsInBhcmVudFRhYmxlIiwidHlwZSIsIkZpZWxkVHlwZXMiLCJNVUxUSVBMRV9SRUNPUkRfTElOS1MiLCJsaW5rZWRUYWJsZSIsImJhc2UiLCJnZXRUYWJsZUJ5SWQiLCJUYWJsZU9yVmlld1F1ZXJ5UmVzdWx0IiwiX25vcm1hbGl6ZU9wdHMiLCJnZXRPYmplY3RGb3JSZXVzZSIsImNvbnN0cnVjdG9yIiwiX19iYXNlRGF0YSIsIl9yZWNvcmQiLCJfZmllbGQiLCJfbGlua2VkVGFibGUiLCJfbGlua2VkUXVlcnlSZXN1bHQiLCJfaXNWYWxpZCIsInJlY29yZElkcyIsImlzRGF0YUxvYWRlZCIsIl9nZW5lcmF0ZUNvbXB1dGVkRGF0YUlmTmVlZGVkIiwiX2NvbXB1dGVkRmlsdGVyZWRTb3J0ZWRSZWNvcmRJZHMiLCJyZWNvcmRzIiwicmVjb3JkSWQiLCJnZXRSZWNvcmRCeUlkIiwiZmllbGRzIiwid2F0Y2giLCJrZXlzIiwiY2FsbGJhY2siLCJjb250ZXh0IiwidmFsaWRLZXlzIiwia2V5IiwidXRpbHMiLCJmaXJlQW5kRm9yZ2V0UHJvbWlzZSIsImxvYWREYXRhQXN5bmMiLCJXYXRjaGFibGVLZXlzIiwiY2VsbFZhbHVlcyIsIl93YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlc0lmTmVlZGVkQWZ0ZXJXYXRjaCIsIldhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4IiwiZmllbGRJZCIsInN1YnN0cmluZyIsImxlbmd0aCIsIl93YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlc0luRmllbGRJZk5lZWRlZEFmdGVyV2F0Y2giLCJ1bndhdGNoIiwidW5sb2FkRGF0YSIsIl91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSWZQb3NzaWJsZUFmdGVyVW53YXRjaCIsIl91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZElmUG9zc2libGVBZnRlclVud2F0Y2giLCJfbG9hZERhdGFBc3luYyIsInJlZ2lzdGVyT2JqZWN0Rm9yUmV1c2UiLCJfd2F0Y2hPcmlnaW4iLCJfd2F0Y2hMaW5rZWRRdWVyeVJlc3VsdCIsImFsbCIsImxvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jIiwiX2xvYWRSZWNvcmRDb2xvcnNBc3luYyIsIl9pbnZhbGlkYXRlQ29tcHV0ZWREYXRhIiwiX3VubG9hZERhdGEiLCJ1bnJlZ2lzdGVyT2JqZWN0Rm9yUmV1c2UiLCJfdW53YXRjaE9yaWdpbiIsIl91bndhdGNoTGlua2VkUXVlcnlSZXN1bHQiLCJ1bmxvYWRDZWxsVmFsdWVzSW5GaWVsZElkcyIsIl91bmxvYWRSZWNvcmRDb2xvcnMiLCJfY2VsbFZhbHVlc1dhdGNoQ291bnQiLCJfY2hhbmdlV2F0Y2hlcnNCeUtleSIsIl93YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlcyIsIl91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzIiwiX2NlbGxWYWx1ZVdhdGNoQ291bnRCeUZpZWxkSWQiLCJjb3VudEJ5RmllbGRJZCIsIndhdGNoS2V5cyIsIndhdGNoS2V5IiwiX3dhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZCIsIl91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZCIsIl9vbk9yaWdpbkNlbGxWYWx1ZUNoYW5nZSIsIl9vbk9yaWdpbkZpZWxkQ29uZmlnQ2hhbmdlIiwiX29uTGlua2VkUmVjb3JkSWRzQ2hhbmdlIiwiX29uTGlua2VkQ2VsbFZhbHVlc0NoYW5nZSIsIl9nZXRPbkxpbmtlZENlbGxWYWx1ZXNJbkZpZWxkQ2hhbmdlIiwiX29uQ2hhbmdlIiwiY2hhbmdlcyIsImZpZWxkSWRzIiwicmVjb3JkSWRzU2V0IiwiX2dldE9yR2VuZXJhdGVSZWNvcmRJZHNTZXQiLCJfY2VsbFZhbHVlQ2hhbmdlSGFuZGxlckJ5RmllbGRJZCIsImZpbHRlcmVkUmVjb3JkSWRzIiwiX2ludmFsaWRhdGVRdWVyeVJlc3VsdCIsIl9jb21wdXRlZFJlY29yZElkc1NldCIsIl9nZW5lcmF0ZUNvbXB1dGVkRGF0YSIsInJhd0NlbGxWYWx1ZSIsImdldENlbGxWYWx1ZSIsImNlbGxWYWx1ZSIsImxpbmtlZFJlY29yZCIsImhhc1JlY29yZCIsIl9ub3JtYWxpemVkT3B0cyIsInNvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBS0EsTUFBTUEsZ0JBQWdCLEdBQUlDLEtBQUQsSUFBK0I7QUFDcEQsUUFBTUMsT0FBTyxHQUFHRCxLQUFLLENBQUNFLE1BQU4sQ0FBYUQsT0FBN0I7QUFDQSxRQUFNRSxhQUFhLEdBQUdGLE9BQU8sSUFBSUEsT0FBTyxDQUFDRSxhQUF6QztBQUNBLDBCQUFVQSxhQUFWLEVBQXlCLDBCQUF6QjtBQUVBLFNBQU9BLGFBQVA7QUFDSCxDQU5ELEMsQ0FRQTs7O0FBQ0EsTUFBTUMsSUFPTCxHQUFHLElBQUlDLG9CQUFKLENBQWU7QUFDZkMsRUFBQUEsZ0JBQWdCLEVBQUVDLFdBQVcsSUFBSUEsV0FBVyxDQUFDQyxRQUQ5QjtBQUVmQyxFQUFBQSx1QkFBdUIsRUFBRSxDQUFDO0FBQUNULElBQUFBLEtBQUQ7QUFBUVUsSUFB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RSxTQUF4QixDQUFrQ25FLFFBQWxDLENBQUosRUFBaUQ7QUFDN0N3RCxRQUFBQSxZQUFZLENBQUN4RCxRQUFELENBQVosR0FBeUIsSUFBekI7QUFDSDtBQUNKOztBQUVELFNBQUs2RCxxQkFBTCxHQUE2QkwsWUFBN0I7O0FBRUEsUUFBSSxLQUFLWSxlQUFMLENBQXFCQyxLQUFyQixJQUE4QixLQUFLRCxlQUFMLENBQXFCQyxLQUFyQixDQUEyQm5ELE1BQTdELEVBQXFFO0FBQUE7O0FBQ2pFO0FBQ0EsV0FBS3BCLGdDQUFMLEdBQXdDLHNDQUFLTCxrQkFBTCxDQUF3QkUsU0FBeEIsa0JBQ3BDSyxRQUFRLElBQUl3RCxZQUFZLENBQUN4RCxRQUFELENBQVosS0FBMkIsSUFESCxDQUF4QztBQUdILEtBTEQsTUFLTztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBS0YsZ0NBQUwsR0FBd0MsbUJBQVkwRCxZQUFaLENBQXhDO0FBQ0g7QUFDSjs7QUFFREMsRUFBQUEsMEJBQTBCLEdBQUc7QUFDekIsU0FBSzVELDZCQUFMOztBQUNBLFVBQU0yRCxZQUFZLEdBQUcsS0FBS0sscUJBQTFCO0FBQ0EsNEJBQVVMLFlBQVYsRUFBd0IseUJBQXhCO0FBQ0EsV0FBT0EsWUFBUDtBQUNIOztBQTFmOEM7OzhCQUE3Q2xGLHdCLGdCQUNrQiwwQjtlQTRmVEEsd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IHtGaWVsZFR5cGVzfSBmcm9tICcuLi90eXBlcy9maWVsZCc7XG5pbXBvcnQgZ2V0U2RrIGZyb20gJy4uL2dldF9zZGsnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3ByaXZhdGVfdXRpbHMnO1xuaW1wb3J0IE9iamVjdFBvb2wgZnJvbSAnLi9vYmplY3RfcG9vbCc7XG5pbXBvcnQgUXVlcnlSZXN1bHQsIHtcbiAgICB0eXBlIFdhdGNoYWJsZVF1ZXJ5UmVzdWx0S2V5LFxuICAgIHR5cGUgUXVlcnlSZXN1bHRPcHRzLFxuICAgIHR5cGUgTm9ybWFsaXplZFF1ZXJ5UmVzdWx0T3B0cyxcbn0gZnJvbSAnLi9xdWVyeV9yZXN1bHQnO1xuaW1wb3J0IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQgZnJvbSAnLi90YWJsZV9vcl92aWV3X3F1ZXJ5X3Jlc3VsdCc7XG5pbXBvcnQgdHlwZSBUYWJsZU1vZGVsIGZyb20gJy4vdGFibGUnO1xuaW1wb3J0IHR5cGUgRmllbGRNb2RlbCBmcm9tICcuL2ZpZWxkJztcbmltcG9ydCB0eXBlIFJlY29yZE1vZGVsIGZyb20gJy4vcmVjb3JkJztcblxuY29uc3QgZ2V0TGlua2VkVGFibGVJZCA9IChmaWVsZDogRmllbGRNb2RlbCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGZpZWxkLmNvbmZpZy5vcHRpb25zO1xuICAgIGNvbnN0IGxpbmtlZFRhYmxlSWQgPSBvcHRpb25zICYmIG9wdGlvbnMubGlua2VkVGFibGVJZDtcbiAgICBpbnZhcmlhbnQobGlua2VkVGFibGVJZCwgJ2xpbmtlZFRhYmxlSWQgbXVzdCBleGlzdCcpO1xuXG4gICAgcmV0dXJuIGxpbmtlZFRhYmxlSWQ7XG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbmNvbnN0IHBvb2w6IE9iamVjdFBvb2w8XG4gICAgTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0LFxuICAgIHtcbiAgICAgICAgZmllbGQ6IEZpZWxkTW9kZWwsXG4gICAgICAgIHJlY29yZDogUmVjb3JkTW9kZWwsXG4gICAgICAgIG5vcm1hbGl6ZWRPcHRzOiBOb3JtYWxpemVkUXVlcnlSZXN1bHRPcHRzLFxuICAgIH0sXG4+ID0gbmV3IE9iamVjdFBvb2woe1xuICAgIGdldEtleUZyb21PYmplY3Q6IHF1ZXJ5UmVzdWx0ID0+IHF1ZXJ5UmVzdWx0Ll9wb29sS2V5LFxuICAgIGdldEtleUZyb21PYmplY3RPcHRpb25zOiAoe2ZpZWxkLCByZWNvcmR9KSA9PiB7XG4gICAgICAgIHJldHVybiBgJHtyZWNvcmQuaWR9Ojoke2ZpZWxkLmlkfTo6JHtnZXRMaW5rZWRUYWJsZUlkKGZpZWxkKX1gO1xuICAgIH0sXG4gICAgY2FuT2JqZWN0QmVSZXVzZWRGb3JPcHRpb25zOiAocXVlcnlSZXN1bHQsIHtub3JtYWxpemVkT3B0c30pID0+IHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5UmVzdWx0LmlzVmFsaWQgJiYgcXVlcnlSZXN1bHQuX19jYW5CZVJldXNlZEZvck5vcm1hbGl6ZWRPcHRzKG5vcm1hbGl6ZWRPcHRzKTtcbiAgICB9LFxufSk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHNldCBvZiByZWNvcmRzIGZyb20gYSBMaW5rZWRSZWNvcmQgY2VsbCB2YWx1ZS5cbiAqXG4gKiBEbyBub3QgaW5zdGFudGlhdGUuIFlvdSBjYW4gZ2V0IGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGJ5IGNhbGxpbmdcbiAqIGByZWNvcmQuZ2V0TGlua2VkUmVjb3Jkc0Zyb21DZWxsYC5cbiAqL1xuY2xhc3MgTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0IGV4dGVuZHMgUXVlcnlSZXN1bHQge1xuICAgIHN0YXRpYyBfY2xhc3NOYW1lID0gJ0xpbmtlZFJlY29yZHNRdWVyeVJlc3VsdCc7XG5cbiAgICBzdGF0aWMgX19jcmVhdGVPclJldXNlUXVlcnlSZXN1bHQoXG4gICAgICAgIHJlY29yZDogUmVjb3JkTW9kZWwsXG4gICAgICAgIGZpZWxkOiBGaWVsZE1vZGVsLFxuICAgICAgICBvcHRzOiBRdWVyeVJlc3VsdE9wdHMsXG4gICAgKTogTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0IHtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgcmVjb3JkLnBhcmVudFRhYmxlID09PSBmaWVsZC5wYXJlbnRUYWJsZSxcbiAgICAgICAgICAgICdyZWNvcmQgYW5kIGZpZWxkIG11c3QgYmVsb25nIHRvIHRoZSBzYW1lIHRhYmxlJyxcbiAgICAgICAgKTtcbiAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgZmllbGQuY29uZmlnLnR5cGUgPT09IEZpZWxkVHlwZXMuTVVMVElQTEVfUkVDT1JEX0xJTktTLFxuICAgICAgICAgICAgJ2ZpZWxkIG11c3QgYmUgTVVMVElQTEVfUkVDT1JEX0xJTktTJyxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbGlua2VkVGFibGVJZCA9IGZpZWxkLmNvbmZpZy5vcHRpb25zICYmIGZpZWxkLmNvbmZpZy5vcHRpb25zLmxpbmtlZFRhYmxlSWQ7XG4gICAgICAgIGludmFyaWFudChsaW5rZWRUYWJsZUlkLCAnbGlua2VkVGFibGVJZCBtdXN0IGJlIHNldCcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmtlZFRhYmxlID0gZ2V0U2RrKCkuYmFzZS5nZXRUYWJsZUJ5SWQobGlua2VkVGFibGVJZCk7XG4gICAgICAgIGludmFyaWFudChsaW5rZWRUYWJsZSwgJ2xpbmtlZFRhYmxlIG11c3QgZXhpc3QnKTtcblxuICAgICAgICBjb25zdCBub3JtYWxpemVkT3B0cyA9IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQuX25vcm1hbGl6ZU9wdHMobGlua2VkVGFibGUsIG9wdHMpO1xuICAgICAgICBjb25zdCBxdWVyeVJlc3VsdCA9IHBvb2wuZ2V0T2JqZWN0Rm9yUmV1c2Uoe3JlY29yZCwgZmllbGQsIG5vcm1hbGl6ZWRPcHRzfSk7XG4gICAgICAgIGlmIChxdWVyeVJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5UmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5rZWRSZWNvcmRzUXVlcnlSZXN1bHQocmVjb3JkLCBmaWVsZCwgb3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGUgcmVjb3JkIGNvbnRhaW5pbmcgdGhlIGxpbmtlZC1yZWNvcmQgY2VsbCB0aGlzIGlzIGEgcXVlcnkgb2YuXG4gICAgX3JlY29yZDogUmVjb3JkTW9kZWw7XG4gICAgLy8gdGhlIGNlbGwncyBmaWVsZCBpbiB0aGUgcmVjb3JkXG4gICAgX2ZpZWxkOiBGaWVsZE1vZGVsO1xuICAgIC8vIHRoZSBrZXkgdXNlZCB0byBpZGVudGlmeSB0aGlzIHF1ZXJ5IHJlc3VsdCBpbiBPYmplY3RQb29sXG4gICAgX3Bvb2xLZXk6IHN0cmluZztcbiAgICAvLyB0aGUgdGFibGUgd2UncmUgbGlua2luZyB0b1xuICAgIF9saW5rZWRUYWJsZTogVGFibGVNb2RlbDtcbiAgICAvLyBhIFF1ZXJ5UmVzdWx0IGNvbnRhaW5pbmcgYWxsIHRoZSByb3dzIGluIHRoZSBsaW5rZWQgdGFibGVcbiAgICBfbGlua2VkUXVlcnlSZXN1bHQ6IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQ7XG4gICAgLy8gaXMgdGhlIHF1ZXJ5IHJlc3VsdCBjdXJyZW50bHkgdmFsaWQuIGlmIHRoZSBmaWVsZCBjb25maWcgY2hhbmdlcyB0byBsaW5rXG4gICAgLy8gdG8gYW5vdGhlciB0YWJsZSBvciBub3QgYmUgYSBsaW5rZWQgcmVjb3JkIGZpZWxkIGF0IGFsbCwgaXNWYWxpZCB3aWxsXG4gICAgLy8gYmVjb21lIGZhbHNlLiBvbmNlIGEgTGlua2VkUmVjb3JkUXVlcnlSZXN1bHQgaGFzIGJlY29tZSBpbnZhbGlkLCBpdCB3aWxsXG4gICAgLy8gbm90IGJlY29tZSB2YWxpZCBhZ2Fpbi5cbiAgICBfaXNWYWxpZDogYm9vbGVhbiA9IHRydWU7XG4gICAgLy8gYSBsYXppbHktZ2VuZXJhdGVkIHNldCBvZiB0aGUgcmVjb3JkIGlkcyBpbiB0aGUgcmVzdWx0IHNldC5cbiAgICBfY29tcHV0ZWRSZWNvcmRJZHNTZXQ6IHtbc3RyaW5nXTogdHJ1ZSB8IHZvaWR9IHwgbnVsbCA9IG51bGw7XG4gICAgLy8gYSBsYXppbHktZ2VuZXJhdGVkIGFycmF5IG9mIHRoZSByZWNvcmQgaWRzIGluIHRoZSBxdWVyeSByZXN1bHQuXG4gICAgX2NvbXB1dGVkRmlsdGVyZWRTb3J0ZWRSZWNvcmRJZHM6IEFycmF5PHN0cmluZz4gfCBudWxsID0gbnVsbDtcbiAgICAvLyBob3cgbWFueSB0aW1lcyBoYXMgZWFjaCAnY2VsbFZhbHVlc0luRmllbGQ6JEZpZWxkSWQnIGJlZW4gd2F0Y2hlZD9cbiAgICBfY2VsbFZhbHVlQ2hhbmdlSGFuZGxlckJ5RmllbGRJZDoge1xuICAgICAgICBbc3RyaW5nXTogKFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQsIHN0cmluZywgbWl4ZWQpID0+IHZvaWQsXG4gICAgfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IocmVjb3JkOiBSZWNvcmRNb2RlbCwgZmllbGQ6IEZpZWxkTW9kZWwsIG9wdHM6IFF1ZXJ5UmVzdWx0T3B0cykge1xuICAgICAgICBjb25zdCBsaW5rZWRUYWJsZUlkID0gZ2V0TGlua2VkVGFibGVJZChmaWVsZCk7XG4gICAgICAgIGNvbnN0IGxpbmtlZFRhYmxlID0gZ2V0U2RrKCkuYmFzZS5nZXRUYWJsZUJ5SWQobGlua2VkVGFibGVJZCk7XG4gICAgICAgIGludmFyaWFudChsaW5rZWRUYWJsZSwgJ3RhYmxlIG11c3QgZXhpc3QnKTtcblxuICAgICAgICBjb25zdCBub3JtYWxpemVkT3B0cyA9IFF1ZXJ5UmVzdWx0Ll9ub3JtYWxpemVPcHRzKGxpbmtlZFRhYmxlLCBvcHRzKTtcblxuICAgICAgICBzdXBlcihub3JtYWxpemVkT3B0cywgcmVjb3JkLnBhcmVudFRhYmxlLl9fYmFzZURhdGEpO1xuXG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIHJlY29yZC5wYXJlbnRUYWJsZSA9PT0gZmllbGQucGFyZW50VGFibGUsXG4gICAgICAgICAgICAncmVjb3JkIGFuZCBmaWVsZCBtdXN0IGJlbG9uZyB0byB0aGUgc2FtZSB0YWJsZScsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3JlY29yZCA9IHJlY29yZDtcbiAgICAgICAgdGhpcy5fZmllbGQgPSBmaWVsZDtcbiAgICAgICAgdGhpcy5fbGlua2VkVGFibGUgPSBsaW5rZWRUYWJsZTtcbiAgICAgICAgdGhpcy5fcG9vbEtleSA9IGAke3JlY29yZC5pZH06OiR7ZmllbGQuaWR9Ojoke2xpbmtlZFRhYmxlSWR9YDtcblxuICAgICAgICAvLyB3ZSBjb3VsZCByZWx5IG9uIFF1ZXJ5UmVzdWx0J3MgcmV1c2UgcG9vbCB0byBtYWtlIHN1cmUgd2UgZ2V0IGJhY2tcbiAgICAgICAgLy8gdGhlIHNhbWUgUXVlcnlSZXN1bHQgZXZlcnkgdGltZSwgYnV0IHRoYXQgd291bGQgbWFrZSBpdCBtdWNoIGhhcmRlclxuICAgICAgICAvLyB0byBtYWtlIHN1cmUgd2UgdW53YXRjaCBldmVyeXRoaW5nIGZyb20gdGhlIG9sZCBRdWVyeVJlc3VsdCBpZiBlLmcuXG4gICAgICAgIC8vIHRoZSBmaWVsZCBjb25maWcgY2hhbmdlcyB0byBwb2ludCBhdCBhIGRpZmZlcmVudCB0YWJsZVxuICAgICAgICB0aGlzLl9saW5rZWRRdWVyeVJlc3VsdCA9IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQuX19jcmVhdGVPclJldXNlUXVlcnlSZXN1bHQoXG4gICAgICAgICAgICBsaW5rZWRUYWJsZSxcbiAgICAgICAgICAgIG9wdHMsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXMgdGhlIHF1ZXJ5IHJlc3VsdCBjdXJyZW50bHkgdmFsaWQ/IFRoaXMgdmFsdWUgYWx3YXlzIHN0YXJ0cyBhcyAndHJ1ZScsXG4gICAgICogYnV0IGNhbiBiZWNvbWUgZmFsc2UgaWYgdGhlIGZpZWxkIGNvbmZpZyBjaGFuZ2VzIHRvIGxpbmsgdG8gYSBkaWZmZXJlbnRcbiAgICAgKiB0YWJsZSBvciBhIHR5cGUgb3RoZXIgdGhhbiBNVUxUSVBMRV9SRUNPUkRfTElOS1MuIE9uY2UgYGlzVmFsaWRgIGhhc1xuICAgICAqIGJlY29tZSBmYWxzZSwgaXQgd2lsbCBuZXZlciBiZWNvbWUgdHJ1ZSBhZ2Fpbi4gTWFueSBmaWVsZHMgd2lsbCB0aHJvdyBvblxuICAgICAqIGF0dGVtcHRpbmcgdG8gYWNjZXNzIHRoZW0sIGFuZCB3YXRjaGVzIHdpbGwgbm8gbG9uZ2VyIGZpcmUuXG4gICAgICovXG4gICAgZ2V0IGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSB0YWJsZSB0aGF0IHRoZSByZWNvcmRzIGluIHRoZSBRdWVyeVJlc3VsdCBhcmUgYSBwYXJ0IG9mXG4gICAgICovXG4gICAgZ2V0IHBhcmVudFRhYmxlKCk6IFRhYmxlTW9kZWwge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5pc1ZhbGlkLCAnTGlua2VkUmVjb3JkUXVlcnlSZXN1bHQgaXMgbm8gbG9uZ2VyIHZhbGlkJyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9saW5rZWRUYWJsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcmRlcmVkIGFycmF5IG9mIGFsbCB0aGUgbGlua2VkIHJlY29yZCBpZHMuXG4gICAgICogV2F0Y2hhYmxlLlxuICAgICAqL1xuICAgIGdldCByZWNvcmRJZHMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLmlzVmFsaWQsICdMaW5rZWRSZWNvcmRRdWVyeVJlc3VsdCBpcyBubyBsb25nZXIgdmFsaWQnKTtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuaXNEYXRhTG9hZGVkLCAnTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0IGRhdGEgaXMgbm90IGxvYWRlZCcpO1xuXG4gICAgICAgIC8vIHJlY29yZCBpZHMgYXJlIGxhemlseSBnZW5lcmF0ZWRcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGVDb21wdXRlZERhdGFJZk5lZWRlZCgpO1xuXG4gICAgICAgIGludmFyaWFudCh0aGlzLl9jb21wdXRlZEZpbHRlcmVkU29ydGVkUmVjb3JkSWRzLCAnbm8gcmVjb3JkSWRzJyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wdXRlZEZpbHRlcmVkU29ydGVkUmVjb3JkSWRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9yZGVyZWQgYXJyYXkgb2YgYWxsIHRoZSBsaW5rZWQgcmVjb3Jkcy5cbiAgICAgKiBXYXRjaGFibGUuXG4gICAgICovXG4gICAgZ2V0IHJlY29yZHMoKTogQXJyYXk8UmVjb3JkTW9kZWw+IHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuaXNWYWxpZCwgJ0xpbmtlZFJlY29yZFF1ZXJ5UmVzdWx0IGlzIG5vIGxvbmdlciB2YWxpZCcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmtlZFRhYmxlID0gdGhpcy5fbGlua2VkVGFibGU7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZElkcy5tYXAocmVjb3JkSWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gbGlua2VkVGFibGUuZ2V0UmVjb3JkQnlJZChyZWNvcmRJZCk7XG4gICAgICAgICAgICBpbnZhcmlhbnQocmVjb3JkLCBgTm8gcmVjb3JkIGZvciBpZDogJHtyZWNvcmRJZH1gKTtcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBmaWVsZHMgdGhhdCB3ZXJlIHVzZWQgdG8gY3JlYXRlIHRoaXMgTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0LlxuICAgICAqL1xuICAgIGdldCBmaWVsZHMoKTogQXJyYXk8RmllbGRNb2RlbD4gfCBudWxsIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuaXNWYWxpZCwgJ0xpbmtlZFJlY29yZFF1ZXJ5UmVzdWx0IGlzIG5vIGxvbmdlciB2YWxpZCcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9saW5rZWRRdWVyeVJlc3VsdC5maWVsZHM7XG4gICAgfVxuXG4gICAgd2F0Y2goXG4gICAgICAgIGtleXM6IFdhdGNoYWJsZVF1ZXJ5UmVzdWx0S2V5IHwgQXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+LFxuICAgICAgICBjYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgIGNvbnRleHQ/OiA/T2JqZWN0LFxuICAgICk6IEFycmF5PFdhdGNoYWJsZVF1ZXJ5UmVzdWx0S2V5PiB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLmlzVmFsaWQsICdjYW5ub3Qgd2F0Y2ggYW4gaW52YWxpZCBMaW5rZWRSZWNvcmRRdWVyeVJlc3VsdCcpO1xuXG4gICAgICAgIGNvbnN0IHZhbGlkS2V5cyA9IHN1cGVyLndhdGNoKGtleXMsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdmFsaWRLZXlzKSB7XG4gICAgICAgICAgICB1dGlscy5maXJlQW5kRm9yZ2V0UHJvbWlzZSh0aGlzLmxvYWREYXRhQXN5bmMuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmIChrZXkgPT09IFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUtleXMuY2VsbFZhbHVlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSWZOZWVkZWRBZnRlcldhdGNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZElkID0ga2V5LnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXgubGVuZ3RoLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJbkZpZWxkSWZOZWVkZWRBZnRlcldhdGNoKGZpZWxkSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWxpZEtleXM7XG4gICAgfVxuXG4gICAgdW53YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXkgfCBBcnJheTxXYXRjaGFibGVRdWVyeVJlc3VsdEtleT4sXG4gICAgICAgIGNhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgY29udGV4dD86ID9PYmplY3QsXG4gICAgKTogQXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+IHtcbiAgICAgICAgY29uc3QgdmFsaWRLZXlzID0gc3VwZXIudW53YXRjaChrZXlzLCBjYWxsYmFjaywgY29udGV4dCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdmFsaWRLZXlzKSB7XG4gICAgICAgICAgICB0aGlzLnVubG9hZERhdGEoKTtcblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5jZWxsVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW53YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlc0lmUG9zc2libGVBZnRlclVud2F0Y2goKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkSWQgPSBrZXkuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICBRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZElmUG9zc2libGVBZnRlclVud2F0Y2goZmllbGRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsaWRLZXlzO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWREYXRhQXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmxvYWREYXRhQXN5bmMoKTtcblxuICAgICAgICBpZiAoIXRoaXMuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICAvLyBkYXRhIHN0aWxsIG1pZ2h0IG5vdCBiZSBsb2FkZWQgYWZ0ZXIgdGhlIHByb21pc2UgcmVzb2x2ZXMgaWYgdGhlXG4gICAgICAgICAgICAvLyBsaW5rZWQgdGFibGUgY2hhbmdlZC4gaW4gdGhhdCBjYXNlLCBjYWxsIGFnYWluOlxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YUFzeW5jKCk7XG4gICAgICAgICAgICAvLyB0aGVyZSBoYXMgdG8gYmUgYW4gdW5sb2FkRGF0YSBjYWxsIGZvciBldmVyeSBsb2FkRGF0YUFzeW5jIGNhbGwuXG4gICAgICAgICAgICAvLyBjYWxsIGl0IGhlcmUgdG8gb2Zmc2V0IGNhbGxpbmcgbG9hZERhdGFBc3luYyBhIHNlY29uZCB0aW1lXG4gICAgICAgICAgICB0aGlzLnVubG9hZERhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9sb2FkRGF0YUFzeW5jKCk6IFByb21pc2U8QXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+PiB7XG4gICAgICAgIHBvb2wucmVnaXN0ZXJPYmplY3RGb3JSZXVzZSh0aGlzKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hPcmlnaW4oKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hMaW5rZWRRdWVyeVJlc3VsdCgpO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHRoaXMuX3JlY29yZC5wYXJlbnRUYWJsZS5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNBc3luYyhbdGhpcy5fZmllbGQuaWRdKSxcbiAgICAgICAgICAgIHRoaXMuX2xpbmtlZFF1ZXJ5UmVzdWx0LmxvYWREYXRhQXN5bmMoKSxcbiAgICAgICAgICAgIHRoaXMuX2xvYWRSZWNvcmRDb2xvcnNBc3luYygpLFxuICAgICAgICBdKTtcblxuICAgICAgICB0aGlzLl9pbnZhbGlkYXRlQ29tcHV0ZWREYXRhKCk7XG5cbiAgICAgICAgcmV0dXJuIFsncmVjb3JkcycsICdyZWNvcmRJZHMnXTtcbiAgICB9XG5cbiAgICBfdW5sb2FkRGF0YSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgcG9vbC51bnJlZ2lzdGVyT2JqZWN0Rm9yUmV1c2UodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl91bndhdGNoT3JpZ2luKCk7XG4gICAgICAgICAgICB0aGlzLl91bndhdGNoTGlua2VkUXVlcnlSZXN1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5fcmVjb3JkLnBhcmVudFRhYmxlLnVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKFt0aGlzLl9maWVsZC5pZF0pO1xuICAgICAgICAgICAgdGhpcy5fbGlua2VkUXVlcnlSZXN1bHQudW5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkUmVjb3JkQ29sb3JzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2ludmFsaWRhdGVDb21wdXRlZERhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBfY2VsbFZhbHVlc1dhdGNoQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9jaGFuZ2VXYXRjaGVyc0J5S2V5W1F1ZXJ5UmVzdWx0LldhdGNoYWJsZUtleXMuY2VsbFZhbHVlc10gfHwgW10pLmxlbmd0aDtcbiAgICB9XG5cbiAgICBfd2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJZk5lZWRlZEFmdGVyV2F0Y2goKSB7XG4gICAgICAgIGlmICh0aGlzLl9jZWxsVmFsdWVzV2F0Y2hDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fd2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSWZQb3NzaWJsZUFmdGVyVW53YXRjaCgpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX2NlbGxWYWx1ZXNXYXRjaENvdW50ID4gMCwgJ292ZXJmcmVlIGNlbGxWYWx1ZXMgd2F0Y2gnKTtcbiAgICAgICAgaWYgKHRoaXMuX2NlbGxWYWx1ZXNXYXRjaENvdW50ID09PSAwICYmIHRoaXMuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhpcy5fdW53YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IF9jZWxsVmFsdWVXYXRjaENvdW50QnlGaWVsZElkKCk6ICRSZWFkT25seTx7W3N0cmluZ106IG51bWJlcn0+IHtcbiAgICAgICAgY29uc3QgY291bnRCeUZpZWxkSWQgPSB7fTtcbiAgICAgICAgY29uc3Qgd2F0Y2hLZXlzID0gT2JqZWN0LmtleXModGhpcy5fY2hhbmdlV2F0Y2hlcnNCeUtleSkuZmlsdGVyKGtleSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yIChjb25zdCB3YXRjaEtleSBvZiB3YXRjaEtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkSWQgPSB3YXRjaEtleS5zbGljZShRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeC5sZW5ndGgpO1xuICAgICAgICAgICAgY291bnRCeUZpZWxkSWRbZmllbGRJZF0gPSAodGhpcy5fY2hhbmdlV2F0Y2hlcnNCeUtleVt3YXRjaEtleV0gfHwgW10pLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudEJ5RmllbGRJZDtcbiAgICB9XG5cbiAgICBfd2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJbkZpZWxkSWZOZWVkZWRBZnRlcldhdGNoKGZpZWxkSWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5fY2VsbFZhbHVlV2F0Y2hDb3VudEJ5RmllbGRJZFtmaWVsZElkXSA9PT0gMSAmJiB0aGlzLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZChmaWVsZElkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91bndhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzSW5GaWVsZElmUG9zc2libGVBZnRlclVud2F0Y2goZmllbGRJZDogc3RyaW5nKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIHRoaXMuX2NlbGxWYWx1ZVdhdGNoQ291bnRCeUZpZWxkSWRbZmllbGRJZF0gJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9jZWxsVmFsdWVXYXRjaENvdW50QnlGaWVsZElkW2ZpZWxkSWRdID4gMCxcbiAgICAgICAgICAgIGBjZWxsVmFsdWVzSW5GaWVsZDoke2ZpZWxkSWR9IG92ZXItZnJlZSdkYCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5fY2VsbFZhbHVlV2F0Y2hDb3VudEJ5RmllbGRJZFtmaWVsZElkXSA9PT0gMCAmJiB0aGlzLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3Vud2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJbkZpZWxkKGZpZWxkSWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3dhdGNoT3JpZ2luKCkge1xuICAgICAgICAvLyBpZiB0aGUgY2VsbCB2YWx1ZXMgaW4gdGhlIHJlY29yZCBjaGFuZ2UsIHdlIG5lZWQgdG8gaW52YWxpZGF0ZSBvdXJcbiAgICAgICAgLy8gY2FjaGVkIGRhdGEgYW5kIG5vdGlmeSB3YXRjaGVyc1xuICAgICAgICB0aGlzLl9yZWNvcmQud2F0Y2goXG4gICAgICAgICAgICBgY2VsbFZhbHVlSW5GaWVsZDoke3RoaXMuX2ZpZWxkLmlkfWAsXG4gICAgICAgICAgICB0aGlzLl9vbk9yaWdpbkNlbGxWYWx1ZUNoYW5nZSxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICk7XG4gICAgICAgIC8vIGlmIHRoZSBmaWVsZCBjb25maWcgY2hhbmdlcywgd2UgbmVlZCB0byBpbnZhbGlkYXRlIGNhY2hlZCBkYXRhLFxuICAgICAgICAvLyBhbmQgcG90ZW50aWFsbHkgc3RhcnQgd2F0Y2hpbmcgYSBkaWZmZXJlbnQgdGFibGVcbiAgICAgICAgdGhpcy5fZmllbGQud2F0Y2goJ2NvbmZpZycsIHRoaXMuX29uT3JpZ2luRmllbGRDb25maWdDaGFuZ2UsIHRoaXMpO1xuICAgIH1cblxuICAgIF91bndhdGNoT3JpZ2luKCkge1xuICAgICAgICB0aGlzLl9yZWNvcmQudW53YXRjaChcbiAgICAgICAgICAgIGBjZWxsVmFsdWVJbkZpZWxkOiR7dGhpcy5fZmllbGQuaWR9YCxcbiAgICAgICAgICAgIHRoaXMuX29uT3JpZ2luQ2VsbFZhbHVlQ2hhbmdlLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fZmllbGQudW53YXRjaCgnY29uZmlnJywgdGhpcy5fb25PcmlnaW5GaWVsZENvbmZpZ0NoYW5nZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3dhdGNoTGlua2VkUXVlcnlSZXN1bHQoKSB7XG4gICAgICAgIC8vIGluIHRoZSBsaW5rZWQgdGFibGUsIGFsbCB3ZSBjYXJlIGFib3V0IGlzIHRoZSBzZXQgb2YgcmVjb3JkSWRzLlxuICAgICAgICAvLyB0aGlzIHdhdGNoIGZpcmUgd2hlbiB0aGV5J3JlIGFkZGVkL3JlbW92ZWQgYW5kIHdoZW4gdGhleSBjaGFuZ2VcbiAgICAgICAgLy8gb3JkZXIuIHdlIG9ubHkgY2FyZSBhYm91dCBvcmRlciwgYmVjYXVzZSBhZGQvcmVtb3ZlIGlzIGhhbmRsZWQgYnlcbiAgICAgICAgLy8gd2F0Y2hpbmcgdGhlIG9yaWdpbiByZWNvcmRcbiAgICAgICAgdGhpcy5fbGlua2VkUXVlcnlSZXN1bHQud2F0Y2goJ3JlY29yZElkcycsIHRoaXMuX29uTGlua2VkUmVjb3JkSWRzQ2hhbmdlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfdW53YXRjaExpbmtlZFF1ZXJ5UmVzdWx0KCkge1xuICAgICAgICB0aGlzLl9saW5rZWRRdWVyeVJlc3VsdC51bndhdGNoKCdyZWNvcmRJZHMnLCB0aGlzLl9vbkxpbmtlZFJlY29yZElkc0NoYW5nZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3dhdGNoTGlua2VkUXVlcnlDZWxsVmFsdWVzKCkge1xuICAgICAgICB0aGlzLl9saW5rZWRRdWVyeVJlc3VsdC53YXRjaCgnY2VsbFZhbHVlcycsIHRoaXMuX29uTGlua2VkQ2VsbFZhbHVlc0NoYW5nZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3Vud2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXMoKSB7XG4gICAgICAgIHRoaXMuX2xpbmtlZFF1ZXJ5UmVzdWx0LnVud2F0Y2goJ2NlbGxWYWx1ZXMnLCB0aGlzLl9vbkxpbmtlZENlbGxWYWx1ZXNDaGFuZ2UsIHRoaXMpO1xuICAgIH1cblxuICAgIF93YXRjaExpbmtlZFF1ZXJ5Q2VsbFZhbHVlc0luRmllbGQoZmllbGRJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xpbmtlZFF1ZXJ5UmVzdWx0LndhdGNoKFxuICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXggKyBmaWVsZElkLFxuICAgICAgICAgICAgdGhpcy5fZ2V0T25MaW5rZWRDZWxsVmFsdWVzSW5GaWVsZENoYW5nZShmaWVsZElkKSxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX3Vud2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJbkZpZWxkKGZpZWxkSWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9saW5rZWRRdWVyeVJlc3VsdC51bndhdGNoKFxuICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXggKyBmaWVsZElkLFxuICAgICAgICAgICAgdGhpcy5fZ2V0T25MaW5rZWRDZWxsVmFsdWVzSW5GaWVsZENoYW5nZShmaWVsZElkKSxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgX29uTGlua2VkUmVjb3JkSWRzQ2hhbmdlKCkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5pc1ZhbGlkLCAnd2F0Y2gga2V5IGNoYW5nZSBldmVudCB3aGlsc3QgaW52YWxpZCcpO1xuICAgICAgICBpZiAoIXRoaXMuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbnZhbGlkYXRlQ29tcHV0ZWREYXRhKCk7XG5cbiAgICAgICAgLy8gd2UgZG9uJ3QgYWN0dWFsbHkga25vdyBhdCB0aGlzIHN0YWdlIHdoZXRoZXIgYW55dGhpbmcgY2hhbmdlZCBvclxuICAgICAgICAvLyBub3QuIGl0IG1heSBoYXZlIGRvbmUgdGhvdWdoLCBzbyBub3RpZnkgd2F0Y2hlcnNcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoJ3JlY29yZHMnKTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoJ3JlY29yZElkcycpO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmbG93dHlwZS9uby13ZWFrLXR5cGVzXG4gICAgX29uTGlua2VkQ2VsbFZhbHVlc0NoYW5nZShxdWVyeVJlc3VsdDogVGFibGVPclZpZXdRdWVyeVJlc3VsdCwga2V5OiBzdHJpbmcsIGNoYW5nZXM6IGFueSkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5pc1ZhbGlkLCAnd2F0Y2gga2V5IGNoYW5nZSBldmVudCB3aGlsc3QgaW52YWxpZCcpO1xuXG4gICAgICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXMuZmllbGRJZHMgJiYgY2hhbmdlcy5yZWNvcmRJZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkc1NldCA9IHRoaXMuX2dldE9yR2VuZXJhdGVSZWNvcmRJZHNTZXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkcyA9IGNoYW5nZXMucmVjb3JkSWRzLmZpbHRlcihpZCA9PiByZWNvcmRJZHNTZXRbaWRdID09PSB0cnVlKTtcbiAgICAgICAgICAgIGlmIChyZWNvcmRJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoJ2NlbGxWYWx1ZXMnLCB7ZmllbGRJZHM6IGNoYW5nZXMuZmllbGRJZHMsIHJlY29yZElkc30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoJ2NlbGxWYWx1ZXMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRPbkxpbmtlZENlbGxWYWx1ZXNJbkZpZWxkQ2hhbmdlKFxuICAgICAgICBmaWVsZElkOiBzdHJpbmcsXG4gICAgKTogKFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQsIHN0cmluZywgbWl4ZWQpID0+IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2NlbGxWYWx1ZUNoYW5nZUhhbmRsZXJCeUZpZWxkSWRbZmllbGRJZF0pIHtcbiAgICAgICAgICAgIHRoaXMuX2NlbGxWYWx1ZUNoYW5nZUhhbmRsZXJCeUZpZWxkSWRbZmllbGRJZF0gPSAoXG4gICAgICAgICAgICAgICAgcXVlcnlSZXN1bHQ6IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQsXG4gICAgICAgICAgICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcmVjb3JkSWRzOiBtaXhlZCxcbiAgICAgICAgICAgICkgPT4ge1xuICAgICAgICAgICAgICAgIGludmFyaWFudCh0aGlzLmlzVmFsaWQsICd3YXRjaCBrZXkgY2hhbmdlIGV2ZW50IHdoaWxzdCBpbnZhbGlkJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZWNvcmRJZHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZElkc1NldCA9IHRoaXMuX2dldE9yR2VuZXJhdGVSZWNvcmRJZHNTZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRSZWNvcmRJZHMgPSByZWNvcmRJZHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPT4gdHlwZW9mIGlkID09PSAnc3RyaW5nJyAmJiByZWNvcmRJZHNTZXRbaWRdID09PSB0cnVlLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRSZWNvcmRJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCArIGZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRSZWNvcmRJZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXggKyBmaWVsZElkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxWYWx1ZUNoYW5nZUhhbmRsZXJCeUZpZWxkSWRbZmllbGRJZF07XG4gICAgfVxuXG4gICAgX29uT3JpZ2luQ2VsbFZhbHVlQ2hhbmdlKCkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5pc1ZhbGlkLCAnd2F0Y2gga2V5IGNoYW5nZSBldmVudCB3aGlsc3QgaW52YWxpZCcpO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0RhdGFMb2FkZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyB3aGVuIHRoZSBvcmlnaW4gY2VsbCB2YWx1ZSAobGlzdGluZyBhbGwgdGhlIGxpbmtlZCByZWNvcmRzKSBjaGFuZ2VzLFxuICAgICAgICAvLyBpbnZhbGlkYXRlIGFsbCB0aGUgZGF0YSB3ZSBoYXZlIHN0b3JlZCAtIHdlIG5lZWQgdG8gY29tcGxldGVseVxuICAgICAgICAvLyByZWdlbmVyYXRlIGl0XG4gICAgICAgIHRoaXMuX2ludmFsaWRhdGVDb21wdXRlZERhdGEoKTtcblxuICAgICAgICAvLyBub3RpZnkgd2F0Y2hlcnMgdGhhdCBvdXIgc2V0IG9mIGxpbmtlZCByZWNvcmRzIGhhcyBjaGFuZ2VkXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKCdyZWNvcmRzJyk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKCdyZWNvcmRJZHMnKTtcbiAgICB9XG5cbiAgICBfb25PcmlnaW5GaWVsZENvbmZpZ0NoYW5nZSgpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuaXNWYWxpZCwgJ3dhdGNoIGtleSBjaGFuZ2UgZXZlbnQgd2hpbHN0IGludmFsaWQnKTtcblxuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5fZmllbGQuY29uZmlnLnR5cGU7XG5cbiAgICAgICAgaWYgKHR5cGUgIT09IEZpZWxkVHlwZXMuTVVMVElQTEVfUkVDT1JEX0xJTktTKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnZhbGlkYXRlUXVlcnlSZXN1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxpbmtlZFRhYmxlSWQgPSBnZXRMaW5rZWRUYWJsZUlkKHRoaXMuX2ZpZWxkKTtcbiAgICAgICAgaWYgKGxpbmtlZFRhYmxlSWQgIT09IHRoaXMuX2xpbmtlZFRhYmxlLmlkKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnZhbGlkYXRlUXVlcnlSZXN1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pbnZhbGlkYXRlUXVlcnlSZXN1bHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGF0YUxvYWRlZCkge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jZWxsVmFsdWVzV2F0Y2hDb3VudCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3Vud2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkSWQgb2YgT2JqZWN0LmtleXModGhpcy5fY2VsbFZhbHVlV2F0Y2hDb3VudEJ5RmllbGRJZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jZWxsVmFsdWVXYXRjaENvdW50QnlGaWVsZElkW2ZpZWxkSWRdID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Vud2F0Y2hMaW5rZWRRdWVyeUNlbGxWYWx1ZXNJbkZpZWxkKGZpZWxkSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSgncmVjb3JkcycpO1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSgncmVjb3JkSWRzJyk7XG4gICAgfVxuXG4gICAgX2ludmFsaWRhdGVDb21wdXRlZERhdGEoKSB7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVkUmVjb3JkSWRzU2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY29tcHV0ZWRGaWx0ZXJlZFNvcnRlZFJlY29yZElkcyA9IG51bGw7XG4gICAgfVxuXG4gICAgX2dlbmVyYXRlQ29tcHV0ZWREYXRhSWZOZWVkZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fY29tcHV0ZWRSZWNvcmRJZHNTZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlQ29tcHV0ZWREYXRhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2VuZXJhdGVDb21wdXRlZERhdGEoKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZElkc1NldCA9IHt9O1xuICAgICAgICBjb25zdCByYXdDZWxsVmFsdWUgPSB0aGlzLl9yZWNvcmQuZ2V0Q2VsbFZhbHVlKHRoaXMuX2ZpZWxkKTtcbiAgICAgICAgY29uc3QgY2VsbFZhbHVlID0gcmF3Q2VsbFZhbHVlID09PSBudWxsID8gW10gOiByYXdDZWxsVmFsdWU7XG4gICAgICAgIGludmFyaWFudChBcnJheS5pc0FycmF5KGNlbGxWYWx1ZSksICdjZWxsVmFsdWUgc2hvdWxkIGJlIGFycmF5Jyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBsaW5rZWRSZWNvcmQgb2YgY2VsbFZhbHVlKSB7XG4gICAgICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICAgICAgbGlua2VkUmVjb3JkICYmIHR5cGVvZiBsaW5rZWRSZWNvcmQgPT09ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICdsaW5rZWQgcmVjb3JkIHNob3VsZCBiZSBvYmplY3QnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkID0gbGlua2VkUmVjb3JkLmlkO1xuICAgICAgICAgICAgaW52YXJpYW50KHR5cGVvZiByZWNvcmRJZCA9PT0gJ3N0cmluZycsICdpZCBzaG91bGQgYmUgcHJlc2VudCcpO1xuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHVzZSB0aGUgcXVlcnkgcmVzdWx0IGFzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggZm9yXG4gICAgICAgICAgICAvLyByZWNvcmRJZHMsIHNpbmNlIHdoZW4gdGhlIGNsaWVudCBkZWxldGVzIGEgcmVjb3JkIGZyb20gdGhlIGxpbmtlZFxuICAgICAgICAgICAgLy8gdGFibGUsIHdlIHVwZGF0ZSBpdCBvcHRpbWlzdGljYWxseSBidXQgdGhlIG9yaWdpbiBjZWxsIHZhbHVlXG4gICAgICAgICAgICAvLyBkb2Vzbid0IHVwZGF0ZSB1bnRpbCByZWNlaXZpbmcgdGhlIHB1c2ggcGF5bG9hZC5cbiAgICAgICAgICAgIGlmICh0aGlzLl9saW5rZWRRdWVyeVJlc3VsdC5oYXNSZWNvcmQocmVjb3JkSWQpKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkSWRzU2V0W3JlY29yZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb21wdXRlZFJlY29yZElkc1NldCA9IHJlY29yZElkc1NldDtcblxuICAgICAgICBpZiAodGhpcy5fbm9ybWFsaXplZE9wdHMuc29ydHMgJiYgdGhpcy5fbm9ybWFsaXplZE9wdHMuc29ydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyB3aGVuIHNvcnRzIGFyZSBwcmVzZW50LCByZWNvcmQgb3JkZXIgY29tZXMgZnJvbSB0aGUgcXVlcnkgcmVzdWx0XG4gICAgICAgICAgICB0aGlzLl9jb21wdXRlZEZpbHRlcmVkU29ydGVkUmVjb3JkSWRzID0gdGhpcy5fbGlua2VkUXVlcnlSZXN1bHQucmVjb3JkSWRzLmZpbHRlcihcbiAgICAgICAgICAgICAgICByZWNvcmRJZCA9PiByZWNvcmRJZHNTZXRbcmVjb3JkSWRdID09PSB0cnVlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHdpdGggbm8gc29ydHMsIHJlY29yZCBvcmRlciBpcyB0aGUgc2FtZSBhcyBpbiB0aGUgY2VsbCBpbiB0aGVcbiAgICAgICAgICAgIC8vIG1haW4gQWlydGFibGUgVUkuIFNpbmNlIHdlIGdlbmVyYXRlZCByZWNvcmRJZHNTZXQgYnkgaXRlcmF0aW5nXG4gICAgICAgICAgICAvLyBvdmVyIHRoZSBjZWxsIHZhbHVlLCB3ZSdyZSBndWFyYW50ZWVkIHRoYXQgdGhlIGtleSBvcmRlciBtYXRjaGVzXG4gICAgICAgICAgICAvLyB0aGUgbGlua2VkIHJlY29yZCBvcmRlciBpbiB0aGUgY2VsbC5cbiAgICAgICAgICAgIHRoaXMuX2NvbXB1dGVkRmlsdGVyZWRTb3J0ZWRSZWNvcmRJZHMgPSBPYmplY3Qua2V5cyhyZWNvcmRJZHNTZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dldE9yR2VuZXJhdGVSZWNvcmRJZHNTZXQoKSB7XG4gICAgICAgIHRoaXMuX2dlbmVyYXRlQ29tcHV0ZWREYXRhSWZOZWVkZWQoKTtcbiAgICAgICAgY29uc3QgcmVjb3JkSWRzU2V0ID0gdGhpcy5fY29tcHV0ZWRSZWNvcmRJZHNTZXQ7XG4gICAgICAgIGludmFyaWFudChyZWNvcmRJZHNTZXQsICdyZWNvcmRJZHNTZXQgbXVzdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gcmVjb3JkSWRzU2V0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlua2VkUmVjb3Jkc1F1ZXJ5UmVzdWx0O1xuIl19