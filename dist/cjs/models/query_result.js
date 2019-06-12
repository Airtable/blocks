"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

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

var _colors = _interopRequireDefault(require("../colors"));

var _field = require("../types/field");

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _field2 = _interopRequireDefault(require("./field"));

var _record_coloring = require("./record_coloring");

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var WatchableQueryResultKeys = Object.freeze({
  records: 'records',
  recordIds: 'recordIds',
  cellValues: 'cellValues',
  recordColors: 'recordColors',
  isDataLoaded: 'isDataLoaded'
});
var WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:'; // The string case is to accommodate cellValuesInField:$FieldId.

/**
 * A QueryResult represents a set of records. It's a little bit like a one-off View in Airtable: it
 * contains a bunch of records, filtered to a useful subset of the records in the table. Those
 * records can be sorted according to your specification, and they can be colored by a select field
 * or using the color from a view. Just like a view, you can either have all the fields in a table
 * available, or you can just ask for the fields that are relevant to you. There are two types of
 * QueryResult:
 *
 * - {@link TableOrViewQueryResult} is the most common, and is a query result filtered to all the
 *   records in a specific {@link Table} or {@link View}. You can get one of these with
 *   `table.selectRecords()` or `view.selectRecords()`.
 * - {@link LinkedRecordsQueryResult} is a query result of all the records in a particular
 *   {@link https://support.airtable.com/hc/en-us/articles/206452848-Linked-record-fields linked record cell}.
 *   You can get one of these with `record.selectLinkedRecordsFromCell(someField)`.
 *
 * Once you've got a query result, you need to load it before you can start working with it. When
 * you're finished, unload it:
 * ```js
 * // query for all the records in "myTable"
 * const queryResult = myTable.selectRecords();
 *
 * // load the data in the query result:
 * await queryResult.loadDataAsync();
 *
 * // work with the data in the query result
 * doSomething(queryResult);
 *
 * // when you're done, unload the data:
 * queryResult.unloadData();
 * ```
 *
 * If you're using a query result in a React component, you don't need to worry about this. Just
 * use {@link useRecords}, {@link useRecordIds}, {@link useRecordById} or {@link useLoadable},
 * which will handle all that for you.
 *
 * Whilst loaded, a query result will automatically keep up to date with what's in Airtable:
 * records will get added or removed, the order will change, cell values will be updated, etc.
 * Again, if you're writing a React component then our hooks will look after that for you. If not,
 * you can get notified of these changes with `.watch()`.
 *
 * When calling a `.select*` method, you can pass in a number of options:
 *
 * ##### sorts
 * Pass an array of sorts to control the order of records within the query result. The first sort
 * in the array has the highest priority. If you don't specify sorts, the query result will use the
 * inherent order of the source model: the same order you'd see in the main UI for views and linked
 * record fields, and an arbitrary (but stable) order for tables.
 *
 * ```js
 * view.selectRecords({
 *     sorts: [
 *         // sort by someField in ascending order...
 *         {field: someField},
 *         // then by someOtherField in descending order
 *         {field: someOtherField, direction: 'desc'},
 *     ]
 * });
 * ```
 *
 * ##### fields
 * Generally, it's a good idea to load as little data into your block as possible - Airtable bases
 * can get pretty big, and we have to keep all that information in memory and up to date if you ask
 * for it. The fields option lets you make sure that only data relevant to you is loaded.
 *
 * You can specify fields with a {@link Field}, by ID, or by name:
 * ```js
 * view.selectRecords({
 *     fields: [
 *         // we want to only load fieldA:
 *         fieldA,
 *         // the field with this id:
 *         'fldXXXXXXXXXXXXXX',
 *         // and the field named 'Rating':
 *         'Rating',
 *     ],
 * });
 * 
 * ##### recordColorMode
 * Just like a view in Airtable, you can control the colors of records in a field. There are three
 * supported record color modes:
 * 
 * By taking the colors the records have according to the rules of a specific view:
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';

 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.byView(someView),
 * });
 * ```
 * 
 * Based on the color of a single select field in the table:
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 * 
 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.bySelectField(someSelectField),
 * });
 * ```
 * 
 * Or with no color at all (the default):
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 * 
 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.none(),
 * });
 * ```
 */
var QueryResult =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(QueryResult, _AbstractModelWithAsy);
  (0, _createClass2.default)(QueryResult, [{
    key: "_getOrGenerateRecordIdsSet",

    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * @private
     */
    value: function _getOrGenerateRecordIdsSet() {
      throw (0, _private_utils.spawnAbstractMethodError)();
    }
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */

  }, {
    key: "recordIds",
    // Abstract properties - classes extending QueryResult must override these:

    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get: function get() {
      throw (0, _private_utils.spawnAbstractMethodError)();
    }
  }, {
    key: "fields",
    get: function get() {
      throw (0, _private_utils.spawnAbstractMethodError)();
    }
    /**
     * The table that records in this QueryResult are part of
     */

  }, {
    key: "parentTable",
    get: function get() {
      throw (0, _private_utils.spawnAbstractMethodError)();
    } // provided properties + methods:

  }], [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableQueryResultKeys, key) || key.startsWith(WatchableCellValuesInFieldKeyPrefix);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      return key === QueryResult.WatchableKeys.records || key === QueryResult.WatchableKeys.recordIds || key === QueryResult.WatchableKeys.cellValues || key === QueryResult.WatchableKeys.recordColors || key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix);
    }
  }, {
    key: "_normalizeOpts",
    value: function _normalizeOpts(table) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var sorts = !opts.sorts ? null : opts.sorts.map(sort => {
        var field = table.__getFieldMatching(sort.field);

        if (!field) {
          throw new Error("No field found for sort: ".concat(sort.field ? sort.field.toString() : typeof sort.field));
        }

        if (sort.direction !== undefined && sort.direction !== 'asc' && sort.direction !== 'desc') {
          throw new Error("Invalid sort direction: ".concat(sort.direction));
        }

        return {
          fieldId: field.id,
          direction: sort.direction || 'asc'
        };
      });
      var fieldIdsOrNullIfAllFields = null;

      if (opts.fields) {
        (0, _invariant.default)(Array.isArray(opts.fields), 'Must specify an array of fields');
        fieldIdsOrNullIfAllFields = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = opts.fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fieldOrFieldIdOrFieldName = _step.value;

            if (!fieldOrFieldIdOrFieldName) {
              // Filter out false-y values so users of this API
              // can conveniently list conditional fields, e.g. [field1, isFoo && field2]
              continue;
            }

            if (typeof fieldOrFieldIdOrFieldName !== 'string' && !(fieldOrFieldIdOrFieldName instanceof _field2.default)) {
              throw new Error("Invalid value for field, expected a field, id, or name but got: ".concat(fieldOrFieldIdOrFieldName.toString()));
            }

            var field = table.__getFieldMatching(fieldOrFieldIdOrFieldName);

            if (!field) {
              throw new Error("No field found: ".concat(fieldOrFieldIdOrFieldName.toString()));
            }

            fieldIdsOrNullIfAllFields.push(field.id);
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
      }

      var recordColorMode = opts.recordColorMode || _record_coloring.modes.none();

      switch (recordColorMode.type) {
        case _record_coloring.ModeTypes.NONE:
          break;

        case _record_coloring.ModeTypes.BY_SELECT_FIELD:
          (0, _invariant.default)(recordColorMode.selectField.type === _field.FieldTypes.SINGLE_SELECT, "Invalid field for coloring records by select field: expected a ".concat(_field.FieldTypes.SINGLE_SELECT, ", but got a ").concat(recordColorMode.selectField.type));
          (0, _invariant.default)(recordColorMode.selectField.parentTable === table, 'Invalid field for coloring records by select field: the single select field is not in the same table as the records');

          if (fieldIdsOrNullIfAllFields) {
            fieldIdsOrNullIfAllFields.push(recordColorMode.selectField.id);
          }

          break;

        case _record_coloring.ModeTypes.BY_VIEW:
          (0, _invariant.default)(recordColorMode.view.parentTable === table, 'Invalid view for coloring records from view: the view is not in the same table as the records');
          break;

        default:
          throw new Error("Unknown record coloring mode: ".concat(recordColorMode.type));
      }

      return {
        sorts,
        fieldIdsOrNullIfAllFields,
        recordColorMode
      };
    }
  }]);

  /**
   * @hideconstructor
   * @private
   */
  function QueryResult(recordStore, normalizedOpts, baseData) {
    var _this;

    (0, _classCallCheck2.default)(this, QueryResult);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(QueryResult).call(this, baseData, (0, _get_sdk.default)().models.generateGuid()));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_recordColorChangeHandler", null);
    _this._normalizedOpts = normalizedOpts;
    _this._recordStore = recordStore;
    return _this;
  }

  (0, _createClass2.default)(QueryResult, [{
    key: "__canBeReusedForNormalizedOpts",
    value: function __canBeReusedForNormalizedOpts(normalizedOpts) {
      return u.isEqual(this._normalizedOpts, normalizedOpts);
    }
    /**
     * The records in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     *
     * @returns all of the records in this query result
     */

  }, {
    key: "getRecordByIdIfExists",

    /**
     * Get a specific record in the query result, or null if that record doesn't exist or is
     * filtered out. Throws if data is not loaded yet. Watch using `'recordIds'`.
     *
     * @param recordId the ID of the {@link Record} you want
     * @returns the record
     */
    value: function getRecordByIdIfExists(recordId) {
      var record = this._recordStore.getRecordByIdIfExists(recordId);

      if (!record || !this.hasRecord(record)) {
        return null;
      }

      return record;
    }
    /**
     * Get a specific record in the query result, or throws if that record doesn't exist or is
     * filtered out. Throws if data is not loaded yet. Watch using `'recordIds'`.
     *
     * @param recordId the ID of the {@link Record} you want
     * @returns the record
     */

  }, {
    key: "getRecordById",
    value: function getRecordById(recordId) {
      var record = this.getRecordByIdIfExists(recordId);

      if (!record) {
        throw new Error("No record with ID ".concat(recordId, " in this query result"));
      }

      return record;
    }
  }, {
    key: "_getRecord",
    value: function _getRecord(recordOrRecordId) {
      return this.getRecordById(typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id);
    }
    /**
     * Check to see if a particular record or record id is present in this query result. Returns
     * false if the record has been deleted or is filtered out.
     *
     * @param recordOrRecordId the record or record id to check the presence of
     * @returns whether the record exists in this query result
     */

  }, {
    key: "hasRecord",
    value: function hasRecord(recordOrRecordId) {
      var recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
      return this._getOrGenerateRecordIdsSet()[recordId] === true;
    }
    /**
     * Get the color of a specific record in the query result. Throws if the record isn't in the
     * QueryResult. Watch with the `'recordColors'` and `'recordIds` keys.
     *
     * @param recordOrRecordId the record or record ID you want the color of.
     * @returns a {@link Color}, or null if the record has no color in this query result.
     */

  }, {
    key: "getRecordColor",
    value: function getRecordColor(recordOrRecordId) {
      var record = this._getRecord(recordOrRecordId);

      var recordColorMode = this._normalizedOpts.recordColorMode;

      switch (recordColorMode.type) {
        case _record_coloring.ModeTypes.NONE:
          return null;

        case _record_coloring.ModeTypes.BY_SELECT_FIELD:
          {
            if (recordColorMode.selectField.type !== _field.FieldTypes.SINGLE_SELECT) {
              return null;
            }

            var value = record.getCellValue(recordColorMode.selectField);
            return value && typeof value === 'object' && typeof value.color === 'string' ? (0, _private_utils.assertEnumValue)(_colors.default, value.color) : null;
          }

        case _record_coloring.ModeTypes.BY_VIEW:
          return this._recordStore.getViewDataStore(recordColorMode.view.id).getRecordColor(record);

        default:
          throw new Error("Unknown record coloring mode: ".concat(recordColorMode.type));
      }
    }
  }, {
    key: "_onChangeIsDataLoaded",
    value: function _onChangeIsDataLoaded() {
      this._onChange(WatchableQueryResultKeys.isDataLoaded);
    }
    /**
     * Get notified of changes to the query result.
     *
     * Watchable keys are:
     * -
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */

  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(QueryResult.prototype), "watch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = validKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (key === WatchableQueryResultKeys.recordColors) {
            this._watchRecordColorsIfNeeded();
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
    /**
     * Unwatch keys watched with `.watch`.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */

  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(QueryResult.prototype), "unwatch", this).call(this, keys, callback, context);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = validKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;

          if (key === WatchableQueryResultKeys.recordColors) {
            this._unwatchRecordColorsIfPossible();
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

      return validKeys;
    }
  }, {
    key: "_watchRecordColorsIfNeeded",
    value: function _watchRecordColorsIfNeeded() {
      var watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || []).length;

      if (!this._recordColorChangeHandler && watchCount >= 1) {
        this._watchRecordColors();
      }
    }
  }, {
    key: "_watchRecordColors",
    value: function _watchRecordColors() {
      var recordColorMode = this._normalizedOpts.recordColorMode;

      var handler = (model, key, recordIds) => {
        if (model === this) {
          this._onChange(WatchableQueryResultKeys.recordColors, recordIds);
        } else {
          this._onChange(WatchableQueryResultKeys.recordColors);
        }
      };

      switch (recordColorMode.type) {
        case _record_coloring.ModeTypes.NONE:
          break;

        case _record_coloring.ModeTypes.BY_SELECT_FIELD:
          this.watch("".concat(WatchableCellValuesInFieldKeyPrefix).concat(recordColorMode.selectField.id), handler);
          recordColorMode.selectField.watch('options', handler);
          break;

        case _record_coloring.ModeTypes.BY_VIEW:
          {
            this._recordStore.getViewDataStore(recordColorMode.view.id).watch('recordColors', handler);

            break;
          }

        default:
          throw new Error("unknown record coloring type ".concat(recordColorMode.type));
      }

      this._recordColorChangeHandler = handler;
    }
  }, {
    key: "_unwatchRecordColorsIfPossible",
    value: function _unwatchRecordColorsIfPossible() {
      var watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || []).length;

      if (this._recordColorChangeHandler && watchCount === 0) {
        this._unwatchRecordColors();
      }
    }
  }, {
    key: "_unwatchRecordColors",
    value: function _unwatchRecordColors() {
      var recordColorMode = this._normalizedOpts.recordColorMode;
      var handler = this._recordColorChangeHandler;
      (0, _invariant.default)(handler, 'record color change handler must exist');

      switch (recordColorMode.type) {
        case _record_coloring.ModeTypes.NONE:
          break;

        case _record_coloring.ModeTypes.BY_SELECT_FIELD:
          this.unwatch("".concat(WatchableCellValuesInFieldKeyPrefix).concat(recordColorMode.selectField.id), handler);
          recordColorMode.selectField.unwatch('options', handler);
          break;

        case _record_coloring.ModeTypes.BY_VIEW:
          {
            this._recordStore.getViewDataStore(recordColorMode.view.id).unwatch('recordColors', handler);

            break;
          }

        default:
          throw new Error("unknown record coloring type ".concat(recordColorMode.type));
      }

      this._recordColorChangeHandler = null;
    }
  }, {
    key: "_loadRecordColorsAsync",
    value: function () {
      var _loadRecordColorsAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var recordColorMode;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                recordColorMode = this._normalizedOpts.recordColorMode;
                _context.t0 = recordColorMode.type;
                _context.next = _context.t0 === _record_coloring.ModeTypes.NONE ? 4 : _context.t0 === _record_coloring.ModeTypes.BY_SELECT_FIELD ? 5 : _context.t0 === _record_coloring.ModeTypes.BY_VIEW ? 6 : 9;
                break;

              case 4:
                return _context.abrupt("return");

              case 5:
                return _context.abrupt("return");

              case 6:
                _context.next = 8;
                return this._recordStore.getViewDataStore(recordColorMode.view.id).loadDataAsync();

              case 8:
                return _context.abrupt("return");

              case 9:
                throw (0, _private_utils.spawnUnknownSwitchCaseError)('record color mode type', recordColorMode.type);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _loadRecordColorsAsync() {
        return _loadRecordColorsAsync2.apply(this, arguments);
      }

      return _loadRecordColorsAsync;
    }()
  }, {
    key: "_unloadRecordColors",
    value: function _unloadRecordColors() {
      var recordColorMode = this._normalizedOpts.recordColorMode;

      switch (recordColorMode.type) {
        case _record_coloring.ModeTypes.NONE:
          return;

        case _record_coloring.ModeTypes.BY_SELECT_FIELD:
          // handled as part of fieldIdsOrNullIfAllFields
          return;

        case _record_coloring.ModeTypes.BY_VIEW:
          this._recordStore.getViewDataStore(recordColorMode.view.id).unloadData();

          break;

        default:
          throw (0, _private_utils.spawnUnknownSwitchCaseError)('record color mode type', recordColorMode.type);
      }
    }
  }, {
    key: "records",
    get: function get() {
      return this.recordIds.map(recordId => {
        var record = this._recordStore.getRecordByIdIfExists(recordId);

        (0, _invariant.default)(record, 'Record missing in table');
        return record;
      });
    }
  }]);
  return QueryResult;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(QueryResult, "_className", 'QueryResult');
(0, _defineProperty2.default)(QueryResult, "WatchableKeys", WatchableQueryResultKeys);
(0, _defineProperty2.default)(QueryResult, "WatchableCellValuesInFieldKeyPrefix", WatchableCellValuesInFieldKeyPrefix);
var _default = QueryResult;
exports.default = _default;