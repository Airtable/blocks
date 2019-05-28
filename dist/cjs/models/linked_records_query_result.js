"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _private_utils = require("../private_utils");

var _object_pool = _interopRequireDefault(require("./object_pool"));

var _query_result = _interopRequireDefault(require("./query_result"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var getLinkedTableId = field => {
  var options = field.options;
  var linkedTableId = options && options.linkedTableId;
  (0, _invariant.default)(typeof linkedTableId === 'string', 'linkedTableId must exist');
  return linkedTableId;
}; // eslint-disable-next-line no-use-before-define


var pool = new _object_pool.default({
  getKeyFromObject: queryResult => queryResult._poolKey,
  getKeyFromObjectOptions: (_ref) => {
    var field = _ref.field,
        record = _ref.record;
    return "".concat(record.id, "::").concat(field.id, "::").concat(getLinkedTableId(field));
  },
  canObjectBeReusedForOptions: (queryResult, _ref2) => {
    var normalizedOpts = _ref2.normalizedOpts;
    return queryResult.isValid && queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
  }
});
/**
 * Represents a set of records from a LinkedRecord cell value.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.getLinkedRecordsFromCell`.
 */

var LinkedRecordsQueryResult =
/*#__PURE__*/
function (_QueryResult) {
  (0, _inherits2.default)(LinkedRecordsQueryResult, _QueryResult);
  (0, _createClass2.default)(LinkedRecordsQueryResult, null, [{
    key: "__createOrReuseQueryResult",
    value: function __createOrReuseQueryResult(record, field, opts) {
      (0, _invariant.default)(record.parentTable === field.parentTable, 'record and field must belong to the same table');
      (0, _invariant.default)(field.type === _field.FieldTypes.MULTIPLE_RECORD_LINKS, 'field must be MULTIPLE_RECORD_LINKS');
      var linkedTableId = field.options && field.options.linkedTableId;
      (0, _invariant.default)(typeof linkedTableId === 'string', 'linkedTableId must be set');
      var linkedTable = (0, _get_sdk.default)().base.getTableById(linkedTableId);

      var normalizedOpts = _table_or_view_query_result.default._normalizeOpts(linkedTable, opts);

      var queryResult = pool.getObjectForReuse({
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

  }]);

  function LinkedRecordsQueryResult(record, field, opts) {
    var _this;

    (0, _classCallCheck2.default)(this, LinkedRecordsQueryResult);
    var linkedTableId = getLinkedTableId(field);
    var linkedTable = (0, _get_sdk.default)().base.getTableById(linkedTableId);

    var normalizedOpts = _query_result.default._normalizeOpts(linkedTable, opts);

    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LinkedRecordsQueryResult).call(this, normalizedOpts, record.parentTable.__baseData));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_isValid", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_computedRecordIdsSet", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_computedFilteredSortedRecordIds", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cellValueChangeHandlerByFieldId", {});
    (0, _invariant.default)(record.parentTable === field.parentTable, 'record and field must belong to the same table');
    _this._record = record;
    _this._field = field;
    _this._linkedTable = linkedTable;
    _this._poolKey = "".concat(record.id, "::").concat(field.id, "::").concat(linkedTableId); // we could rely on QueryResult's reuse pool to make sure we get back
    // the same QueryResult every time, but that would make it much harder
    // to make sure we unwatch everything from the old QueryResult if e.g.
    // the field config changes to point at a different table

    _this._linkedQueryResult = _table_or_view_query_result.default.__createOrReuseQueryResult(linkedTable, opts);
    return _this;
  }
  /**
   * Is the query result currently valid? This value always starts as 'true',
   * but can become false if the field config changes to link to a different
   * table or a type other than MULTIPLE_RECORD_LINKS. Once `isValid` has
   * become false, it will never become true again. Many fields will throw on
   * attempting to access them, and watches will no longer fire.
   */


  (0, _createClass2.default)(LinkedRecordsQueryResult, [{
    key: "watch",
    value: function watch(keys, callback, context) {
      (0, _invariant.default)(this.isValid, 'cannot watch an invalid LinkedRecordQueryResult');
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(LinkedRecordsQueryResult.prototype), "watch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = validKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          (0, _private_utils.fireAndForgetPromise)(this.loadDataAsync.bind(this));

          if (key === _query_result.default.WatchableKeys.cellValues) {
            this._watchLinkedQueryCellValuesIfNeededAfterWatch();
          }

          if (key.startsWith(_query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
            var fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

            this._watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return validKeys;
    }
  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(LinkedRecordsQueryResult.prototype), "unwatch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = validKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          this.unloadData();

          if (key === _query_result.default.WatchableKeys.cellValues) {
            this._unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch();
          }

          if (key.startsWith(_query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
            var fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

            this._unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return validKeys;
    }
  }, {
    key: "loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _get2.default)((0, _getPrototypeOf2.default)(LinkedRecordsQueryResult.prototype), "loadDataAsync", this).call(this);

              case 2:
                if (this.isDataLoaded) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return this.loadDataAsync();

              case 5:
                // there has to be an unloadData call for every loadDataAsync call.
                // call it here to offset calling loadDataAsync a second time
                this.unloadData();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return loadDataAsync;
    }()
  }, {
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                pool.registerObjectForReuse(this);

                this._watchOrigin();

                this._watchLinkedQueryResult();

                _context2.next = 5;
                return Promise.all([this._record.parentTable.loadCellValuesInFieldIdsAsync([this._field.id]), this._linkedQueryResult.loadDataAsync(), this._loadRecordColorsAsync()]);

              case 5:
                this._invalidateComputedData();

                return _context2.abrupt("return", ['records', 'recordIds']);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _loadDataAsync() {
        return _loadDataAsync3.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "_unloadData",
    value: function _unloadData() {
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
  }, {
    key: "_watchLinkedQueryCellValuesIfNeededAfterWatch",
    value: function _watchLinkedQueryCellValuesIfNeededAfterWatch() {
      if (this._cellValuesWatchCount === 1) {
        this._watchLinkedQueryCellValues();
      }
    }
  }, {
    key: "_unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch",
    value: function _unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch() {
      (0, _invariant.default)(this._cellValuesWatchCount > 0, 'overfree cellValues watch');

      if (this._cellValuesWatchCount === 0 && this.isValid) {
        this._unwatchLinkedQueryCellValues();
      }
    }
  }, {
    key: "_watchLinkedQueryCellValuesInFieldIfNeededAfterWatch",
    value: function _watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId) {
      if (this._cellValueWatchCountByFieldId[fieldId] === 1 && this.isValid) {
        this._watchLinkedQueryCellValuesInField(fieldId);
      }
    }
  }, {
    key: "_unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch",
    value: function _unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId) {
      (0, _invariant.default)(this._cellValueWatchCountByFieldId[fieldId] && this._cellValueWatchCountByFieldId[fieldId] > 0, "cellValuesInField:".concat(fieldId, " over-free'd"));

      if (this._cellValueWatchCountByFieldId[fieldId] === 0 && this.isValid) {
        this._unwatchLinkedQueryCellValuesInField(fieldId);
      }
    }
  }, {
    key: "_watchOrigin",
    value: function _watchOrigin() {
      // if the cell values in the record change, we need to invalidate our
      // cached data and notify watchers
      this._record.watch("cellValueInField:".concat(this._field.id), this._onOriginCellValueChange, this); // if the field config changes, we need to invalidate cached data,
      // and potentially start watching a different table


      this._field.watch('type', this._onOriginFieldConfigChange, this);

      this._field.watch('options', this._onOriginFieldConfigChange, this);
    }
  }, {
    key: "_unwatchOrigin",
    value: function _unwatchOrigin() {
      this._record.unwatch("cellValueInField:".concat(this._field.id), this._onOriginCellValueChange, this);

      this._field.unwatch('type', this._onOriginFieldConfigChange, this);

      this._field.unwatch('options', this._onOriginFieldConfigChange, this);
    }
  }, {
    key: "_watchLinkedQueryResult",
    value: function _watchLinkedQueryResult() {
      // in the linked table, all we care about is the set of recordIds.
      // this watch fire when they're added/removed and when they change
      // order. we only care about order, because add/remove is handled by
      // watching the origin record
      this._linkedQueryResult.watch('recordIds', this._onLinkedRecordIdsChange, this);
    }
  }, {
    key: "_unwatchLinkedQueryResult",
    value: function _unwatchLinkedQueryResult() {
      this._linkedQueryResult.unwatch('recordIds', this._onLinkedRecordIdsChange, this);
    }
  }, {
    key: "_watchLinkedQueryCellValues",
    value: function _watchLinkedQueryCellValues() {
      this._linkedQueryResult.watch('cellValues', this._onLinkedCellValuesChange, this);
    }
  }, {
    key: "_unwatchLinkedQueryCellValues",
    value: function _unwatchLinkedQueryCellValues() {
      this._linkedQueryResult.unwatch('cellValues', this._onLinkedCellValuesChange, this);
    }
  }, {
    key: "_watchLinkedQueryCellValuesInField",
    value: function _watchLinkedQueryCellValuesInField(fieldId) {
      this._linkedQueryResult.watch(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._getOnLinkedCellValuesInFieldChange(fieldId), this);
    }
  }, {
    key: "_unwatchLinkedQueryCellValuesInField",
    value: function _unwatchLinkedQueryCellValuesInField(fieldId) {
      this._linkedQueryResult.unwatch(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._getOnLinkedCellValuesInFieldChange(fieldId), this);
    }
  }, {
    key: "_onLinkedRecordIdsChange",
    value: function _onLinkedRecordIdsChange() {
      (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

      if (!this.isDataLoaded) {
        return;
      }

      this._invalidateComputedData(); // we don't actually know at this stage whether anything changed or
      // not. it may have done though, so notify watchers


      this._onChange('records');

      this._onChange('recordIds');
    } // eslint-disable-next-line flowtype/no-weak-types

  }, {
    key: "_onLinkedCellValuesChange",
    value: function _onLinkedCellValuesChange(queryResult, key, changes) {
      (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

      if (changes && changes.fieldIds && changes.recordIds) {
        var recordIdsSet = this._getOrGenerateRecordIdsSet();

        var recordIds = changes.recordIds.filter(id => recordIdsSet[id] === true);

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
  }, {
    key: "_getOnLinkedCellValuesInFieldChange",
    value: function _getOnLinkedCellValuesInFieldChange(fieldId) {
      if (!this._cellValueChangeHandlerByFieldId[fieldId]) {
        this._cellValueChangeHandlerByFieldId[fieldId] = (queryResult, key, recordIds) => {
          (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');

          if (Array.isArray(recordIds)) {
            var recordIdsSet = this._getOrGenerateRecordIdsSet();

            var filteredRecordIds = recordIds.filter(id => typeof id === 'string' && recordIdsSet[id] === true);

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
  }, {
    key: "_onOriginCellValueChange",
    value: function _onOriginCellValueChange() {
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
  }, {
    key: "_onOriginFieldConfigChange",
    value: function _onOriginFieldConfigChange() {
      (0, _invariant.default)(this.isValid, 'watch key change event whilst invalid');
      var type = this._field.type;

      if (type !== _field.FieldTypes.MULTIPLE_RECORD_LINKS) {
        this._invalidateQueryResult();

        return;
      }

      var linkedTableId = getLinkedTableId(this._field);

      if (linkedTableId !== this._linkedTable.id) {
        this._invalidateQueryResult();

        return;
      }
    }
  }, {
    key: "_invalidateQueryResult",
    value: function _invalidateQueryResult() {
      if (this.isDataLoaded) {
        this._unloadData();
      }

      if (this._cellValuesWatchCount > 0) {
        this._unwatchLinkedQueryCellValues();
      }

      for (var _i = 0, _Object$keys = Object.keys(this._cellValueWatchCountByFieldId); _i < _Object$keys.length; _i++) {
        var fieldId = _Object$keys[_i];

        if (this._cellValueWatchCountByFieldId[fieldId] > 0) {
          this._unwatchLinkedQueryCellValuesInField(fieldId);
        }
      }

      this._isValid = false;

      this._onChange('records');

      this._onChange('recordIds');
    }
  }, {
    key: "_invalidateComputedData",
    value: function _invalidateComputedData() {
      this._computedRecordIdsSet = null;
      this._computedFilteredSortedRecordIds = null;
    }
  }, {
    key: "_generateComputedDataIfNeeded",
    value: function _generateComputedDataIfNeeded() {
      if (!this._computedRecordIdsSet) {
        this._generateComputedData();
      }
    }
  }, {
    key: "_generateComputedData",
    value: function _generateComputedData() {
      var recordIdsSet = {};

      var rawCellValue = this._record.getCellValue(this._field);

      var cellValue = rawCellValue === null ? [] : rawCellValue;
      (0, _invariant.default)(Array.isArray(cellValue), 'cellValue should be array');
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = cellValue[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var linkedRecord = _step3.value;
          (0, _invariant.default)(linkedRecord && typeof linkedRecord === 'object', 'linked record should be object');
          var recordId = linkedRecord.id;
          (0, _invariant.default)(typeof recordId === 'string', 'id should be present'); // We need to use the query result as the source of truth for
          // recordIds, since when the client deletes a record from the linked
          // table, we update it optimistically but the origin cell value
          // doesn't update until receiving the push payload.

          if (this._linkedQueryResult.hasRecord(recordId)) {
            recordIdsSet[recordId] = true;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this._computedRecordIdsSet = recordIdsSet;

      if (this._normalizedOpts.sorts && this._normalizedOpts.sorts.length) {
        // when sorts are present, record order comes from the query result
        this._computedFilteredSortedRecordIds = this._linkedQueryResult.recordIds.filter(recordId => recordIdsSet[recordId] === true);
      } else {
        // with no sorts, record order is the same as in the cell in the
        // main Airtable UI. Since we generated recordIdsSet by iterating
        // over the cell value, we're guaranteed that the key order matches
        // the linked record order in the cell.
        this._computedFilteredSortedRecordIds = Object.keys(recordIdsSet);
      }
    }
  }, {
    key: "_getOrGenerateRecordIdsSet",
    value: function _getOrGenerateRecordIdsSet() {
      this._generateComputedDataIfNeeded();

      var recordIdsSet = this._computedRecordIdsSet;
      (0, _invariant.default)(recordIdsSet, 'recordIdsSet must exist');
      return recordIdsSet;
    }
  }, {
    key: "isValid",
    get: function get() {
      return this._isValid;
    }
    /**
     * The table that the records in the QueryResult are a part of
     */

  }, {
    key: "parentTable",
    get: function get() {
      (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
      return this._linkedTable;
    }
    /**
     * Ordered array of all the linked record ids.
     * Watchable.
     */

  }, {
    key: "recordIds",
    get: function get() {
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

  }, {
    key: "records",
    get: function get() {
      (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
      var linkedTable = this._linkedTable;
      return this.recordIds.map(recordId => {
        var record = linkedTable.__getRecordByIdIfExists(recordId);

        (0, _invariant.default)(record, "No record for id: ".concat(recordId));
        return record;
      });
    }
    /**
     * The fields that were used to create this LinkedRecordsQueryResult.
     */

  }, {
    key: "fields",
    get: function get() {
      (0, _invariant.default)(this.isValid, 'LinkedRecordQueryResult is no longer valid');
      return this._linkedQueryResult.fields;
    }
  }, {
    key: "_cellValuesWatchCount",
    get: function get() {
      return (this._changeWatchersByKey[_query_result.default.WatchableKeys.cellValues] || []).length;
    }
  }, {
    key: "_cellValueWatchCountByFieldId",
    get: function get() {
      var countByFieldId = {};
      var watchKeys = Object.keys(this._changeWatchersByKey).filter(key => {
        return key.startsWith(_query_result.default.WatchableCellValuesInFieldKeyPrefix);
      });
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = watchKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var watchKey = _step4.value;
          var fieldId = watchKey.slice(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);
          countByFieldId[fieldId] = (this._changeWatchersByKey[watchKey] || []).length;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return countByFieldId;
    }
  }]);
  return LinkedRecordsQueryResult;
}(_query_result.default);

(0, _defineProperty2.default)(LinkedRecordsQueryResult, "_className", 'LinkedRecordsQueryResult');
var _default = LinkedRecordsQueryResult;
exports.default = _default;