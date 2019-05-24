"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

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

var _table = _interopRequireDefault(require("./table"));

var _view = _interopRequireDefault(require("./view"));

var _query_result = _interopRequireDefault(require("./query_result"));

var _object_pool = _interopRequireDefault(require("./object_pool"));

var _record_coloring = require("./record_coloring");

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    h = _window$__requirePriv.h,
    u = _window$__requirePriv.u;

var GroupedRowVisList = window.__requirePrivateModuleFromAirtable('client_server_shared/vis_lists/grouped_row_vis_list');

var GroupAssigner = window.__requirePrivateModuleFromAirtable('client_server_shared/filter_and_sort/group_assigner');

// eslint-disable-next-line no-use-before-define
var tableOrViewQueryResultPool = new _object_pool.default({
  getKeyFromObject: queryResult => queryResult.__sourceModelId,
  getKeyFromObjectOptions: (_ref) => {
    var sourceModel = _ref.sourceModel;
    return sourceModel.id;
  },
  canObjectBeReusedForOptions: (queryResult, _ref2) => {
    var normalizedOpts = _ref2.normalizedOpts;
    return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
  }
});
/**
 * Represents a set of records directly from a view or table.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.select` or `view.select`.
 */

var TableOrViewQueryResult =
/*#__PURE__*/
function (_QueryResult) {
  (0, _inherits2.default)(TableOrViewQueryResult, _QueryResult);
  (0, _createClass2.default)(TableOrViewQueryResult, null, [{
    key: "__createOrReuseQueryResult",
    value: function __createOrReuseQueryResult(sourceModel, opts) {
      var tableModel = sourceModel instanceof _view.default ? sourceModel.parentTable : sourceModel;

      var normalizedOpts = _query_result.default._normalizeOpts(tableModel, opts);

      var queryResult = tableOrViewQueryResultPool.getObjectForReuse({
        sourceModel,
        normalizedOpts
      });

      if (queryResult) {
        return queryResult;
      } else {
        return new TableOrViewQueryResult(sourceModel, opts);
      }
    }
  }]);

  function TableOrViewQueryResult(sourceModel, opts) {
    var _this;

    (0, _classCallCheck2.default)(this, TableOrViewQueryResult);
    var table = sourceModel instanceof _view.default ? sourceModel.parentTable : sourceModel;

    var normalizedOpts = _query_result.default._normalizeOpts(table, opts);

    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TableOrViewQueryResult).call(this, normalizedOpts, sourceModel.__baseData));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_recordIdsSet", null);
    _this._sourceModel = sourceModel;
    _this._mostRecentSourceModelLoadPromise = null;
    _this._table = table;
    var sorts = _this._normalizedOpts.sorts;

    if (sorts) {
      var groupLevels = sorts.map(sort => {
        return {
          id: h.id.generateGroupLevelId(),
          columnId: sort.fieldId,
          order: sort.direction === 'desc' ? 'descending' : 'ascending',
          groupingOptions: {
            // Always use the raw cell value (rather than normalizing for grouping) so
            // that group behavior matches sort rather than group by.
            shouldUseRawCellValue: true
          }
        };
      }); // Tie-break using record created time.

      groupLevels.push({
        id: h.id.generateGroupLevelId(),
        isCreatedTime: true,
        order: 'ascending',
        groupingOptions: {
          shouldUseRawCellValue: true
        }
      });
      _this._groupLevels = groupLevels;
    } else {
      _this._groupLevels = null;
    }

    _this._visList = null;
    _this._orderedRecordIds = null;
    _this._cellValueKeyWatchCounts = {};
    var fieldIdsSetToLoadOrNullIfAllFields = null;

    if (_this._normalizedOpts.fieldIdsOrNullIfAllFields) {
      fieldIdsSetToLoadOrNullIfAllFields = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this._normalizedOpts.fieldIdsOrNullIfAllFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fieldId = _step.value;
          fieldIdsSetToLoadOrNullIfAllFields[fieldId] = true;
        } // Need to load data for fields we're sorting by, even if
        // they're not explicitly requested in the `fields` opt.

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

      if (_this._groupLevels) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this._groupLevels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var groupLevel = _step2.value;

            if (!groupLevel.isCreatedTime) {
              fieldIdsSetToLoadOrNullIfAllFields[groupLevel.columnId] = true;
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
      }

      var recordColorMode = _this._normalizedOpts.recordColorMode;

      if (recordColorMode && recordColorMode.type === _record_coloring.ModeTypes.BY_SELECT_FIELD) {
        fieldIdsSetToLoadOrNullIfAllFields[recordColorMode.selectField.id] = true;
      }
    }

    _this._fieldIdsSetToLoadOrNullIfAllFields = fieldIdsSetToLoadOrNullIfAllFields;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(TableOrViewQueryResult, [{
    key: "_getOrGenerateRecordIdsSet",

    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     */
    value: function _getOrGenerateRecordIdsSet() {
      if (!this._recordIdsSet) {
        var recordIdsSet = {};
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.recordIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var recordId = _step3.value;
            recordIdsSet[recordId] = true;
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

        this._recordIdsSet = recordIdsSet;
      }

      return this._recordIdsSet;
    }
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */

  }, {
    key: "_incrementCellValueKeyWatchCountAndWatchIfNecessary",
    value: function _incrementCellValueKeyWatchCountAndWatchIfNecessary(key, watchCallback) {
      if (!this._cellValueKeyWatchCounts[key]) {
        this._cellValueKeyWatchCounts[key] = 0;

        this._table.watch(key, watchCallback, this);
      }

      this._cellValueKeyWatchCounts[key]++;
    }
  }, {
    key: "_decrementCellValueKeyWatchCountAndUnwatchIfPossible",
    value: function _decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, watchCallback) {
      if (!this._cellValueKeyWatchCounts[key]) {
        // Key isn't watched, so just skip it. This matches behavior of Watchable,
        // where calling unwatch on a key that isn't watched just no-ops.
        return;
      }

      this._cellValueKeyWatchCounts[key]--;

      if (this._cellValueKeyWatchCounts[key] === 0) {
        // We're down to zero watches for this key, so we can actually unwatch it now.
        this._table.unwatch(key, watchCallback, this);

        delete this._cellValueKeyWatchCounts[key];
      }
    }
  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(TableOrViewQueryResult.prototype), "watch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = validKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var key = _step4.value;

          if (key.startsWith(_query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
            var fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

            if (this._fieldIdsSetToLoadOrNullIfAllFields && !u.has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)) {
              throw new Error("Can't watch field because it wasn't included in QueryResult fields: ".concat(fieldId));
            }

            this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesInFieldChanged);
          }

          if (key === _query_result.default.WatchableKeys.cellValues) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
              for (var _i = 0, _Object$keys = Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields); _i < _Object$keys.length; _i++) {
                var _fieldId = _Object$keys[_i];

                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(_query_result.default.WatchableCellValuesInFieldKeyPrefix + _fieldId, this._onCellValuesChanged);
              }
            } else {
              this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesChanged);
            }
          }
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

      return validKeys;
    }
  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(TableOrViewQueryResult.prototype), "unwatch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = validKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var key = _step5.value;

          if (key.startsWith(_query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
            this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesInFieldChanged);
          }

          if (key === _query_result.default.WatchableKeys.cellValues) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
              for (var _i2 = 0, _Object$keys2 = Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields); _i2 < _Object$keys2.length; _i2++) {
                var fieldId = _Object$keys2[_i2];

                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._onCellValuesChanged);
              }
            } else {
              this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesChanged);
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
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
        var sourceModelLoadPromise, cellValuesInFieldsLoadPromise;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                  cellValuesInFieldsLoadPromise = this._table.loadCellValuesInFieldIdsAsync(Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields));
                } else {
                  // Load all fields.
                  cellValuesInFieldsLoadPromise = this._table.loadDataAsync();
                }

                if (this._sourceModel instanceof _table.default) {
                  if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    sourceModelLoadPromise = this._table.loadRecordMetadataAsync();
                  } else {
                    // table.loadDataAsync is a superset of loadRecordMetadataAsync,
                    // so no need to load record metadata again.
                    sourceModelLoadPromise = null;
                  }
                } else {
                  sourceModelLoadPromise = this._sourceModel.loadDataAsync();
                }

                this._mostRecentSourceModelLoadPromise = Promise.all([sourceModelLoadPromise, cellValuesInFieldsLoadPromise, this._loadRecordColorsAsync()]);
                _context.next = 5;
                return (0, _get2.default)((0, _getPrototypeOf2.default)(TableOrViewQueryResult.prototype), "loadDataAsync", this).call(this);

              case 5:
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
        var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, groupLevel, field, changedKeys, fieldIds, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, fieldId;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                tableOrViewQueryResultPool.registerObjectForReuse(this);
                (0, _invariant.default)(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
                _context2.next = 4;
                return this._mostRecentSourceModelLoadPromise;

              case 4:
                if (this._groupLevels) {
                  this._replaceVisList();
                }

                this._orderedRecordIds = this._generateOrderedRecordIds();

                this._sourceModel.watch( // flow-disable-next-line since we know this watch key is valid.
                this._recordsWatchKey, this._onRecordsChanged, this);

                this._table.watch(this._cellValuesForSortWatchKeys, this._onCellValuesForSortChanged, this);

                this._table.watch(this._fieldsWatchKey, this._onTableFieldsChanged, this);

                if (!this._groupLevels) {
                  _context2.next = 38;
                  break;
                }

                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context2.prev = 13;
                _iterator6 = this._groupLevels[Symbol.iterator]();

              case 15:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context2.next = 24;
                  break;
                }

                groupLevel = _step6.value;

                if (!groupLevel.isCreatedTime) {
                  _context2.next = 19;
                  break;
                }

                return _context2.abrupt("continue", 21);

              case 19:
                field = this._table.getFieldById(groupLevel.columnId);

                if (field) {
                  field.watch('type', this._onFieldConfigChanged, this);
                  field.watch('options', this._onFieldConfigChanged, this);
                }

              case 21:
                _iteratorNormalCompletion6 = true;
                _context2.next = 15;
                break;

              case 24:
                _context2.next = 30;
                break;

              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2["catch"](13);
                _didIteratorError6 = true;
                _iteratorError6 = _context2.t0;

              case 30:
                _context2.prev = 30;
                _context2.prev = 31;

                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }

              case 33:
                _context2.prev = 33;

                if (!_didIteratorError6) {
                  _context2.next = 36;
                  break;
                }

                throw _iteratorError6;

              case 36:
                return _context2.finish(33);

              case 37:
                return _context2.finish(30);

              case 38:
                changedKeys = [_query_result.default.WatchableKeys.records, _query_result.default.WatchableKeys.recordIds, _query_result.default.WatchableKeys.cellValues];
                fieldIds = this._normalizedOpts.fieldIdsOrNullIfAllFields || this._table.fields.map(field => field.id);
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context2.prev = 43;

                for (_iterator7 = fieldIds[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  fieldId = _step7.value;
                  changedKeys.push(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId);
                }

                _context2.next = 51;
                break;

              case 47:
                _context2.prev = 47;
                _context2.t1 = _context2["catch"](43);
                _didIteratorError7 = true;
                _iteratorError7 = _context2.t1;

              case 51:
                _context2.prev = 51;
                _context2.prev = 52;

                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }

              case 54:
                _context2.prev = 54;

                if (!_didIteratorError7) {
                  _context2.next = 57;
                  break;
                }

                throw _iteratorError7;

              case 57:
                return _context2.finish(54);

              case 58:
                return _context2.finish(51);

              case 59:
                return _context2.abrupt("return", changedKeys);

              case 60:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[13, 26, 30, 38], [31,, 33, 37], [43, 47, 51, 59], [52,, 54, 58]]);
      }));

      function _loadDataAsync() {
        return _loadDataAsync3.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "unloadData",
    value: function unloadData() {
      (0, _get2.default)((0, _getPrototypeOf2.default)(TableOrViewQueryResult.prototype), "unloadData", this).call(this);

      if (this._sourceModel instanceof _table.default) {
        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
          this._sourceModel.unloadRecordMetadata();
        } else {
          this._sourceModel.unloadData();
        }
      } else {
        this._sourceModel.unloadData();
      }

      if (this._fieldIdsSetToLoadOrNullIfAllFields) {
        this._table.unloadCellValuesInFieldIds(Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields));
      }

      this._unloadRecordColors();
    }
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._mostRecentSourceModelLoadPromise = null;

      this._sourceModel.unwatch( // flow-disable-next-line since we know this watch key is valid.
      this._recordsWatchKey, this._onRecordsChanged, this);

      this._table.unwatch(this._cellValuesForSortWatchKeys, this._onCellValuesForSortChanged, this);

      this._table.unwatch(this._fieldsWatchKey, this._onTableFieldsChanged, this); // If the table is deleted, can't call getFieldById on it below.


      if (!this._table.isDeleted && this._groupLevels) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = this._groupLevels[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var groupLevel = _step8.value;

            if (groupLevel.isCreatedTime) {
              continue;
            }

            var field = this._table.getFieldById(groupLevel.columnId);

            if (field) {
              field.unwatch('type', this._onFieldConfigChanged, this);
              field.unwatch('options', this._onFieldConfigChanged, this);
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }

      this._visList = null;
      this._orderedRecordIds = null;
      this._recordIdsSet = null;
      tableOrViewQueryResultPool.unregisterObjectForReuse(this);
    }
  }, {
    key: "_getColumnsById",
    value: function _getColumnsById() {
      return this._table.fields.reduce((result, field) => {
        result[field.id] = field.__getRawColumn();
        return result;
      }, {});
    }
  }, {
    key: "_addRecordIdsToVisList",
    value: function _addRecordIdsToVisList(recordIds) {
      var columnsById = this._getColumnsById();

      var visList = this._visList;
      (0, _invariant.default)(visList, 'No vis list');
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = recordIds[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var recordId = _step9.value;

          var record = this._table.__getRecordById(recordId);

          (0, _invariant.default)(record, 'Record missing in table');

          var rowJson = record.__getRawRow();

          var groupPath = GroupAssigner.getGroupPathForRow(this._table.parentBase.__appInterface, this._getGroupLevelsWithDeletedFieldsFiltered(), columnsById, rowJson);
          visList.addIdToGroupAtEnd(recordId, true, groupPath);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }, {
    key: "_onRecordsChanged",
    value: function _onRecordsChanged(model, key, updates) {
      if (model instanceof _view.default) {
        // For a view model, we don't get updates sent with the onChange event,
        // so we need to manually generate updates based on the old and new
        // recordIds.
        if (this._orderedRecordIds) {
          var _addedRecordIds = u.difference(model.__visibleRecordIds, this._orderedRecordIds);

          var _removedRecordIds = u.difference(this._orderedRecordIds, model.__visibleRecordIds);

          updates = {
            addedRecordIds: _addedRecordIds,
            removedRecordIds: _removedRecordIds
          };
        } else {
          updates = null;
        }
      }

      if (!updates) {
        // If there are no updates, do nothing, since we'll handle the initial
        // callback when the record set is loaded (and we don't want to fire
        // a records change twice with no data).
        return;
      }

      var _updates = updates,
          addedRecordIds = _updates.addedRecordIds,
          removedRecordIds = _updates.removedRecordIds;

      if (this._groupLevels) {
        var visList = this._visList;
        (0, _invariant.default)(visList, 'No vis list');

        if (removedRecordIds.length > 0) {
          visList.removeMultipleIds(removedRecordIds);
        }

        if (addedRecordIds.length > 0) {
          this._addRecordIdsToVisList(addedRecordIds);
        }
      }

      if (this._recordIdsSet) {
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = addedRecordIds[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var recordId = _step10.value;
            this._recordIdsSet[recordId] = true;
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = removedRecordIds[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var _recordId = _step11.value;
            this._recordIdsSet[_recordId] = undefined;
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }
      } // Now that we've applied our changes (if applicable), let's regenerate our recordIds.


      this._orderedRecordIds = this._generateOrderedRecordIds();

      this._onChange(_query_result.default.WatchableKeys.records, updates);

      this._onChange(_query_result.default.WatchableKeys.recordIds, updates);
    }
  }, {
    key: "_onCellValuesForSortChanged",
    value: function _onCellValuesForSortChanged(table, key, recordIds, fieldId) {
      if (!recordIds || !fieldId) {
        // If there are no updates, do nothing, since we'll handle the initial
        // callback when the record set is loaded (and we don't want to fire
        // a records change twice with no data).
        return;
      } // NOTE: this will only ever be called if we have sorts, so it's safe to assert that we have
      // a vis list here.


      var visList = this._visList;
      (0, _invariant.default)(visList, 'No vis list');

      if (recordIds.length === 0) {
        // Nothing actually changed, so just break out early.
        return;
      } // Move the record ids in the vis list.
      // Note: the cell value changes may have resulted in the records
      // being filtered out. So don't try to remove and re-add them if
      // they're no longer visible.


      var visibleRecordIds = recordIds.filter(recordId => visList.isIdVisible(recordId));
      visList.removeMultipleIds(visibleRecordIds);

      this._addRecordIdsToVisList(visibleRecordIds);

      this._orderedRecordIds = this._generateOrderedRecordIds();
      var changeData = {
        addedRecordIds: [],
        removedRecordIds: []
      };

      this._onChange(_query_result.default.WatchableKeys.records, changeData);

      this._onChange(_query_result.default.WatchableKeys.recordIds, changeData);
    }
  }, {
    key: "_onFieldConfigChanged",
    value: function _onFieldConfigChanged(field, key) {
      // Field config changed for a field we rely on, so we need to replace our vis list.
      // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
      // are using a vis list here.
      this._replaceVisList();

      this._orderedRecordIds = this._generateOrderedRecordIds();
    }
  }, {
    key: "_onTableFieldsChanged",
    value: function _onTableFieldsChanged(table, key, updates) {
      if (!this._groupLevels) {
        // If we don't have any sorts, we don't have to do anything in response to field changes.
        return;
      }

      var addedFieldIds = updates.addedFieldIds,
          removedFieldIds = updates.removedFieldIds;

      var fieldIdsSet = this._groupLevels.reduce((result, groupLevel) => {
        if (!groupLevel.isCreatedTime) {
          result[groupLevel.columnId] = true;
        }

        return result;
      }, {}); // Check if any fields that we rely on were created or deleted. If they were,
      // replace our vis list.
      // NOTE: we need to check for created, since a field that we rely on can be
      // deleted and then undeleted.


      var wereAnyFieldsCreatedOrDeleted = false;
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = addedFieldIds[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var fieldId = _step12.value;

          // If a field that we rely on was created (i.e. it was undeleted), we need to
          // make sure we're watching it's config.
          if (u.has(fieldIdsSet, fieldId)) {
            wereAnyFieldsCreatedOrDeleted = true;

            var field = this._table.getFieldById(fieldId);

            (0, _invariant.default)(field, 'Created field does not exist');
            field.watch('type', this._onFieldConfigChanged, this);
            field.watch('options', this._onFieldConfigChanged, this);
          }
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      if (!wereAnyFieldsCreatedOrDeleted) {
        wereAnyFieldsCreatedOrDeleted = removedFieldIds.some(fieldId => u.has(fieldIdsSet, fieldId));
      }

      if (wereAnyFieldsCreatedOrDeleted) {
        // One of the fields we're relying on was deleted,
        this._replaceVisList();

        this._orderedRecordIds = this._generateOrderedRecordIds(); // Make sure we fire onChange events since the order may have changed
        // as a result.

        var changeData = {
          addedRecordIds: [],
          removedRecordIds: []
        };

        this._onChange(_query_result.default.WatchableKeys.records, changeData);

        this._onChange(_query_result.default.WatchableKeys.recordIds, changeData);
      }
    }
  }, {
    key: "_onCellValuesChanged",
    value: function _onCellValuesChanged(table, key, updates) {
      if (!updates) {
        // If there are no updates, do nothing, since we'll handle the initial
        // callback when the record set is loaded (and we don't want to fire
        // a cellValues change twice with no data).
        return;
      }

      this._onChange(_query_result.default.WatchableKeys.cellValues, updates);
    }
  }, {
    key: "_onCellValuesInFieldChanged",
    value: function _onCellValuesInFieldChanged(table, key, recordIds, fieldId) {
      if (!recordIds && !fieldId) {
        // If there are no updates, do nothing, since we'll handle the initial
        // callback when the record set is loaded (and we don't want to fire
        // a cellValuesInField change twice with no data).
        return;
      }

      this._onChange(key, recordIds, fieldId);
    }
  }, {
    key: "_generateOrderedRecordIds",
    value: function _generateOrderedRecordIds() {
      if (this._groupLevels) {
        (0, _invariant.default)(this._visList, 'Cannot generate record ids without a vis list');
        var recordIds = [];

        this._visList.eachVisibleIdInGroupedOrder(recordId => recordIds.push(recordId));

        return recordIds;
      } else {
        return this._sourceModelRecordIds;
      }
    }
  }, {
    key: "_replaceVisList",
    value: function _replaceVisList() {
      var rowsById = {};
      var rowVisibilityObjArray = [];
      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this._sourceModelRecords[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var record = _step13.value;
          rowsById[record.id] = record.__getRawRow();
          rowVisibilityObjArray.push({
            rowId: record.id,
            visibility: true
          });
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      var columnsById = this._getColumnsById();

      var groupLevels = this._getGroupLevelsWithDeletedFieldsFiltered();

      var groupAssigner = new GroupAssigner({
        appInterface: this._table.parentBase.__appInterface,
        groupLevels,
        rowsById,
        columnsById
      });
      var groupKeyComparators = groupAssigner.getGroupKeyComparators();
      var groupPathsByRowId = groupAssigner.getGroupPathsByRowId();
      this._visList = new GroupedRowVisList(groupKeyComparators, rowVisibilityObjArray, groupPathsByRowId);
    }
  }, {
    key: "_getGroupLevelsWithDeletedFieldsFiltered",
    value: function _getGroupLevelsWithDeletedFieldsFiltered() {
      (0, _invariant.default)(this._groupLevels, 'No group levels'); // Filter out any group levels that rely on deleted fields.
      // NOTE: we keep deleted fields around (rather than filtering them out
      // in realtime) in case a field gets undeleted, in which case we want to
      // keep using it.

      return this._groupLevels.filter(groupLevel => {
        if (groupLevel.isCreatedTime) {
          return true;
        }

        var field = this._table.getFieldById(groupLevel.columnId);

        return !!field;
      });
    }
  }, {
    key: "_getErrorMessageForDeletion",
    value: function _getErrorMessageForDeletion() {
      var sourceModelName = this._sourceModel instanceof _table.default ? 'table' : 'view';
      return "QueryResult's underlying ".concat(sourceModelName, " has been deleted");
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      if (this._sourceModel.isDeleted) {
        return null;
      }

      return {
        recordIds: this._orderedRecordIds
      };
    }
  }, {
    key: "__sourceModelId",
    get: function get() {
      return this._sourceModel.id;
    }
    /** */

  }, {
    key: "parentTable",
    get: function get() {
      return this._table;
    }
    /**
     * The view that was used to obtain this QueryResult by calling
     * `view.select`. Null if the QueryResult was obtained by calling
     * `table.select`.
     */

  }, {
    key: "parentView",
    get: function get() {
      return this._sourceModel instanceof _table.default ? null : this._sourceModel;
    }
    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     */

  }, {
    key: "recordIds",
    get: function get() {
      (0, _invariant.default)(this.isDataLoaded, 'QueryResult data is not loaded');
      (0, _invariant.default)(this._data.recordIds, 'No recordIds');
      return this._data.recordIds;
    }
  }, {
    key: "fields",
    get: function get() {
      var fieldIdsOrNullIfAllFields = this._normalizedOpts.fieldIdsOrNullIfAllFields;

      if (fieldIdsOrNullIfAllFields) {
        var fields = []; // Filter out any deleted fields, since QueryResult is "live".
        // It would be too cumbersome (and defeat part of the purpose of
        // using QueryResult) if the user had to manually watch for deletion
        // on all the fields and recreate the QueryResult.

        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = fieldIdsOrNullIfAllFields[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var fieldId = _step14.value;

            var field = this._table.getFieldById(fieldId);

            if (field !== null) {
              fields.push(field);
            }
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
              _iterator14.return();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
        }

        return fields;
      } else {
        return null;
      }
    }
  }, {
    key: "_cellValuesForSortWatchKeys",
    get: function get() {
      return this._groupLevels ? u.compact(this._groupLevels.map(groupLevel => {
        if (groupLevel.isCreatedTime) {
          return null;
        }

        return "cellValuesInField:".concat(groupLevel.columnId);
      })) : [];
    }
  }, {
    key: "_recordsWatchKey",
    get: function get() {
      return this._sourceModel instanceof _table.default ? '__records' : '__visibleRecords';
    }
  }, {
    key: "_fieldsWatchKey",
    get: function get() {
      return 'fields';
    }
  }, {
    key: "_sourceModelRecordIds",
    get: function get() {
      return this._sourceModel instanceof _table.default ? this._sourceModel.__recordIds : this._sourceModel.__visibleRecordIds;
    }
  }, {
    key: "_sourceModelRecords",
    get: function get() {
      return this._sourceModel instanceof _table.default ? this._sourceModel.__records : this._sourceModel.__visibleRecords;
    }
  }]);
  return TableOrViewQueryResult;
}(_query_result.default);

(0, _defineProperty2.default)(TableOrViewQueryResult, "_className", 'TableOrViewQueryResult');
var _default = TableOrViewQueryResult;
exports.default = _default;