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

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _colors = _interopRequireDefault(require("../colors"));

var _field = require("../types/field");

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _field2 = _interopRequireDefault(require("./field"));

var _record_coloring = require("./record_coloring");

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const WatchableQueryResultKeys = {
  records: 'records',
  recordIds: 'recordIds',
  cellValues: 'cellValues',
  recordColors: 'recordColors'
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:'; // The string case is to accommodate cellValuesInField:$FieldId.

/** */
class QueryResult extends _abstract_model_with_async_data.default {
  // Abstract properties - classes extending QueryResult must override these:

  /**
   * The record IDs in this QueryResult.
   * Throws if data is not loaded yet.
   */
  get recordIds() {
    throw u.spawnAbstractMethodError();
  }
  /**
   * The set of record IDs in this QueryResult.
   * Throws if data is not loaded yet.
   */


  _getOrGenerateRecordIdsSet() {
    throw u.spawnAbstractMethodError();
  }
  /**
   * The fields that were used to create this QueryResult.
   * Null if fields were not specified, which means the QueryResult
   * will load all fields in the table.
   */


  get fields() {
    throw u.spawnAbstractMethodError();
  }
  /**
   * The table that records in this QueryResult are part of
   */


  get parentTable() {
    throw u.spawnAbstractMethodError();
  } // provided properties + methods:


  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableQueryResultKeys, key) || (0, _startsWith.default)(u).call(u, key, WatchableCellValuesInFieldKeyPrefix);
  }

  static _shouldLoadDataForKey(key) {
    return key === QueryResult.WatchableKeys.records || key === QueryResult.WatchableKeys.recordIds || key === QueryResult.WatchableKeys.cellValues || key === QueryResult.WatchableKeys.recordColors || (0, _startsWith.default)(u).call(u, key, QueryResult.WatchableCellValuesInFieldKeyPrefix);
  }

  static _normalizeOpts(table, opts = {}) {
    var _context;

    const sorts = !opts.sorts ? null : (0, _map.default)(_context = opts.sorts).call(_context, sort => {
      const field = table.__getFieldMatching(sort.field);

      if (!field) {
        throw new Error(`No field found for sort: ${sort.field ? sort.field.toString() : typeof sort.field}`);
      }

      if (sort.direction !== undefined && sort.direction !== 'asc' && sort.direction !== 'desc') {
        throw new Error(`Invalid sort direction: ${sort.direction}`);
      }

      return {
        fieldId: field.id,
        direction: sort.direction || 'asc'
      };
    });
    let fieldIdsOrNullIfAllFields = null;

    if (opts.fields) {
      (0, _invariant.default)((0, _isArray.default)(opts.fields), 'Must specify an array of fields');
      fieldIdsOrNullIfAllFields = [];

      for (const fieldOrFieldIdOrFieldName of opts.fields) {
        if (!fieldOrFieldIdOrFieldName) {
          // Filter out false-y values so users of this API
          // can conveniently list conditional fields, e.g. [field1, isFoo && field2]
          continue;
        }

        if (typeof fieldOrFieldIdOrFieldName !== 'string' && !(fieldOrFieldIdOrFieldName instanceof _field2.default)) {
          throw new Error(`Invalid value for field, expected a field, id, or name but got: ${fieldOrFieldIdOrFieldName.toString()}`);
        }

        const field = table.__getFieldMatching(fieldOrFieldIdOrFieldName);

        if (!field) {
          throw new Error(`No field found: ${fieldOrFieldIdOrFieldName.toString()}`);
        }

        fieldIdsOrNullIfAllFields.push(field.id);
      }
    }

    const recordColorMode = opts.recordColorMode || _record_coloring.modes.none();

    switch (recordColorMode.type) {
      case _record_coloring.ModeTypes.NONE:
        break;

      case _record_coloring.ModeTypes.BY_SELECT_FIELD:
        (0, _invariant.default)(recordColorMode.selectField.type === _field.FieldTypes.SINGLE_SELECT, `Invalid field for coloring records by select field: expected a ${_field.FieldTypes.SINGLE_SELECT}, but got a ${recordColorMode.selectField.type}`);
        (0, _invariant.default)(recordColorMode.selectField.parentTable === table, 'Invalid field for coloring records by select field: the single select field is not in the same table as the records');

        if (fieldIdsOrNullIfAllFields) {
          fieldIdsOrNullIfAllFields.push(recordColorMode.selectField.id);
        }

        break;

      case _record_coloring.ModeTypes.BY_VIEW:
        (0, _invariant.default)(recordColorMode.view.parentTable === table, 'Invalid view for coloring records from view: the view is not in the same table as the records');
        break;

      default:
        throw new Error(`Unknown record coloring mode: ${recordColorMode.type}`);
    }

    return {
      sorts,
      fieldIdsOrNullIfAllFields,
      recordColorMode
    };
  }

  constructor(normalizedOpts, baseData) {
    super(baseData, (0, _get_sdk.default)().models.generateGuid());
    (0, _defineProperty2.default)(this, "_recordColorChangeHandler", null);
    this._normalizedOpts = normalizedOpts;
  }

  __canBeReusedForNormalizedOpts(normalizedOpts) {
    return u.isEqual(this._normalizedOpts, normalizedOpts);
  }
  /**
   * The records in this QueryResult.
   * Throws if data is not loaded yet.
   */


  get records() {
    var _context2;

    return (0, _map.default)(_context2 = this.recordIds).call(_context2, recordId => {
      const record = this.parentTable.getRecordById(recordId);
      (0, _invariant.default)(record, 'Record missing in table');
      return record;
    });
  }

  _getRecord(recordOrRecordId) {
    const record = typeof recordOrRecordId === 'string' ? this.parentTable.getRecordById(recordOrRecordId) : recordOrRecordId;
    (0, _invariant.default)(record, 'Record does not exist');
    (0, _invariant.default)(this.hasRecord(record), 'Record is not part of this query result');
    return record;
  }

  hasRecord(recordOrRecordId) {
    const recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
    return this._getOrGenerateRecordIdsSet()[recordId] === true;
  }

  getRecordColor(recordOrRecordId) {
    const record = this._getRecord(recordOrRecordId);

    const recordColorMode = this._normalizedOpts.recordColorMode;

    switch (recordColorMode.type) {
      case _record_coloring.ModeTypes.NONE:
        return null;

      case _record_coloring.ModeTypes.BY_SELECT_FIELD:
        {
          if (recordColorMode.selectField.type !== _field.FieldTypes.SINGLE_SELECT) {
            return null;
          }

          const value = record.getCellValue(recordColorMode.selectField);
          return value && typeof value === 'object' && typeof value.color === 'string' ? _private_utils.default.assertEnumValue(_colors.default, value.color) : null;
        }

      case _record_coloring.ModeTypes.BY_VIEW:
        return recordColorMode.view.getRecordColor(record);

      default:
        throw new Error(`Unknown record coloring mode: ${recordColorMode.type}`);
    }
  }

  watch(keys, callback, context) {
    const validKeys = super.watch(keys, callback, context);

    for (const key of validKeys) {
      if (key === WatchableQueryResultKeys.recordColors) {
        this._watchRecordColorsIfNeeded();
      }
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    const validKeys = super.unwatch(keys, callback, context);

    for (const key of validKeys) {
      if (key === WatchableQueryResultKeys.recordColors) {
        this._unwatchRecordColorsIfPossible();
      }
    }

    return validKeys;
  }

  _watchRecordColorsIfNeeded() {
    const watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || []).length;

    if (!this._recordColorChangeHandler && watchCount >= 1) {
      this._watchRecordColors();
    }
  }

  _watchRecordColors() {
    const recordColorMode = this._normalizedOpts.recordColorMode;

    const handler = (model, key, recordIds) => {
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
        this.watch(`${WatchableCellValuesInFieldKeyPrefix}${recordColorMode.selectField.id}`, handler);
        recordColorMode.selectField.watch('options', handler);
        break;

      case _record_coloring.ModeTypes.BY_VIEW:
        {
          recordColorMode.view.watch('recordColors', handler);
          break;
        }

      default:
        throw new Error(`unknown record coloring type ${recordColorMode.type}`);
    }

    this._recordColorChangeHandler = handler;
  }

  _unwatchRecordColorsIfPossible() {
    const watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || []).length;

    if (this._recordColorChangeHandler && watchCount === 0) {
      this._unwatchRecordColors();
    }
  }

  _unwatchRecordColors() {
    const recordColorMode = this._normalizedOpts.recordColorMode;
    const handler = this._recordColorChangeHandler;
    (0, _invariant.default)(handler, 'record color change handler must exist');

    switch (recordColorMode.type) {
      case _record_coloring.ModeTypes.NONE:
        break;

      case _record_coloring.ModeTypes.BY_SELECT_FIELD:
        this.unwatch(`${WatchableCellValuesInFieldKeyPrefix}${recordColorMode.selectField.id}`, handler);
        recordColorMode.selectField.unwatch('options', handler);
        break;

      case _record_coloring.ModeTypes.BY_VIEW:
        {
          recordColorMode.view.unwatch('recordColors', handler);
          break;
        }

      default:
        throw new Error(`unknown record coloring type ${recordColorMode.type}`);
    }

    this._recordColorChangeHandler = null;
  }

  async _loadRecordColorsAsync() {
    const recordColorMode = this._normalizedOpts.recordColorMode;

    switch (recordColorMode.type) {
      case _record_coloring.ModeTypes.NONE:
        return;

      case _record_coloring.ModeTypes.BY_SELECT_FIELD:
        // The select field id gets added to fieldIdsOrNullIfAllFields,
        // so we don't need to handle it here
        return;

      case _record_coloring.ModeTypes.BY_VIEW:
        await recordColorMode.view.loadDataAsync();
        return;

      default:
        throw u.spawnUnknownSwitchCaseError('record color mode type', recordColorMode.type);
    }
  }

  _unloadRecordColors() {
    const recordColorMode = this._normalizedOpts.recordColorMode;

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
        throw u.spawnUnknownSwitchCaseError('record color mode type', recordColorMode.type);
    }
  }

}

(0, _defineProperty2.default)(QueryResult, "_className", 'QueryResult');
(0, _defineProperty2.default)(QueryResult, "WatchableKeys", WatchableQueryResultKeys);
(0, _defineProperty2.default)(QueryResult, "WatchableCellValuesInFieldKeyPrefix", WatchableCellValuesInFieldKeyPrefix);
var _default = QueryResult;
exports.default = _default;