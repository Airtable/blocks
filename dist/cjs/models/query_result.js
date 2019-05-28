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
  recordColors: 'recordColors'
});
var WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:'; // The string case is to accommodate cellValuesInField:$FieldId.

/** */
var QueryResult =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(QueryResult, _AbstractModelWithAsy);
  (0, _createClass2.default)(QueryResult, [{
    key: "_getOrGenerateRecordIdsSet",

    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
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

  function QueryResult(normalizedOpts, baseData) {
    var _this;

    (0, _classCallCheck2.default)(this, QueryResult);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(QueryResult).call(this, baseData, (0, _get_sdk.default)().models.generateGuid()));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_recordColorChangeHandler", null);
    _this._normalizedOpts = normalizedOpts;
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
     */

  }, {
    key: "getRecordByIdIfExists",
    value: function getRecordByIdIfExists(recordId) {
      var record = this.parentTable.__getRecordByIdIfExists(recordId);

      if (!record || !this.hasRecord(record)) {
        return null;
      }

      return record;
    }
  }, {
    key: "_getRecord",
    value: function _getRecord(recordOrRecordId) {
      var record = this.getRecordByIdIfExists(typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id);
      (0, _invariant.default)(record, 'record must exist');
      return record;
    }
  }, {
    key: "hasRecord",
    value: function hasRecord(recordOrRecordId) {
      var recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
      return this._getOrGenerateRecordIdsSet()[recordId] === true;
    }
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
          return recordColorMode.view.__getRecordColor(record);

        default:
          throw new Error("Unknown record coloring mode: ".concat(recordColorMode.type));
      }
    }
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
            recordColorMode.view.watch('__recordColors', handler);
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
            recordColorMode.view.unwatch('__recordColors', handler);
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
                return recordColorMode.view.loadDataAsync();

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
          recordColorMode.view.unloadData();
          break;

        default:
          throw (0, _private_utils.spawnUnknownSwitchCaseError)('record color mode type', recordColorMode.type);
      }
    }
  }, {
    key: "records",
    get: function get() {
      return this.recordIds.map(recordId => {
        var record = this.parentTable.__getRecordByIdIfExists(recordId);

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