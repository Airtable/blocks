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