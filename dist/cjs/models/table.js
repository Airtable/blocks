"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.url.to-json");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _permission_levels = require("../types/permission_levels");

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _view = _interopRequireDefault(require("./view"));

var _field = _interopRequireDefault(require("./field"));

var _record = _interopRequireDefault(require("./record"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var hyperId = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id');

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


var WatchableTableKeys = {
  name: 'name',
  activeView: 'activeView',
  views: 'views',
  fields: 'fields',
  __records: '__records',
  __recordIds: '__recordIds',
  // TODO(kasra): these keys don't have matching getters (not that they should
  // it's just inconsistent...)
  __cellValues: '__cellValues'
};
var WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:'; // The string case is to accommodate cellValuesInField:$FieldId.
// It may also be useful to have cellValuesInView:$ViewId...

/** Model class representing a table in the base. */
class Table extends _abstract_model_with_async_data.default {
  static _isWatchableKey(key) {
    return (0, _private_utils.isEnumValue)(WatchableTableKeys, key) || u.startsWith(key, WatchableCellValuesInFieldKeyPrefix);
  }

  static _shouldLoadDataForKey(key) {
    // "Data" means *all* cell values in the table. If only watching records/recordIds,
    // we'll just load record metadata (id, createdTime, commentCount).
    // If only watching specific fields, we'll just load cell values in those
    // fields. Both of those scenarios are handled manually by this class,
    // instead of relying on AbstractModelWithAsyncData.
    return key === WatchableTableKeys.__cellValues;
  }

  constructor(baseData, parentBase, tableId, airtableInterface) {
    super(baseData, tableId);
    this._parentBase = parentBase;
    this._viewModelsById = {}; // View instances are lazily created by getViewById.

    this._fieldModelsById = {}; // Field instances are lazily created by getFieldById.

    this._recordModelsById = {}; // Record instances are lazily created by getRecordById.

    this._cachedFieldNamesById = null; // A bit of a hack, but we use the primary field ID to load record
    // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
    // ID here instead of calling this.primaryField.id since that would crash
    // when the table is getting unloaded after being deleted.

    this._primaryFieldId = this._data.primaryFieldId;
    this._airtableInterface = airtableInterface;
    this._areCellValuesLoadedByFieldId = {};
    this._pendingCellValuesLoadPromiseByFieldId = {};
    this._cellValuesRetainCountByFieldId = {};
    Object.seal(this);
  }

  watch(keys, callback, context) {
    var validKeys = super.watch(keys, callback, context);

    var fieldIdsToLoad = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

    if (fieldIdsToLoad.length > 0) {
      (0, _private_utils.fireAndForgetPromise)(this.loadCellValuesInFieldIdsAsync.bind(this, fieldIdsToLoad));
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    var validKeys = super.unwatch(keys, callback, context);

    var fieldIdsToUnload = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

    if (fieldIdsToUnload.length > 0) {
      this.unloadCellValuesInFieldIds(fieldIdsToUnload);
    }

    return validKeys;
  }

  _getFieldIdsToLoadFromWatchableKeys(keys) {
    var fieldIdsToLoad = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (u.startsWith(key, WatchableCellValuesInFieldKeyPrefix)) {
          var fieldId = key.substring(WatchableCellValuesInFieldKeyPrefix.length);
          fieldIdsToLoad.push(fieldId);
        } else if (key === WatchableTableKeys.__records || key === WatchableTableKeys.__recordIds) {
          fieldIdsToLoad.push(this._getFieldIdForCausingRecordMetadataToLoad());
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

    return fieldIdsToLoad;
  }

  get _dataOrNullIfDeleted() {
    return this._baseData.tablesById[this._id] || null;
  }
  /** */


  get parentBase() {
    return this._parentBase;
  }
  /** The table's name. Can be watched. */


  get name() {
    return this._data.name;
  }
  /** */


  get url() {
    return airtableUrls.getUrlForTable(this.id, {
      absolute: true
    });
  }
  /**
   * Every table has exactly one primary field. The primary field of a table
   * will not change.
   */


  get primaryField() {
    var primaryField = this.getFieldById(this._data.primaryFieldId);
    (0, _invariant.default)(primaryField, 'no primary field');
    return primaryField;
  }
  /**
   * The fields in this table. The order is arbitrary, since fields are
   * only ordered in the context of a specific view.
   *
   * Can be watched to know when fields are created or deleted.
   */


  get fields() {
    // TODO(kasra): is it confusing that this returns an array, since the order
    // is arbitrary?
    // TODO(kasra): cache and freeze this so it isn't O(n)
    var fields = [];

    for (var _i = 0, _Object$keys = Object.keys(this._data.fieldsById); _i < _Object$keys.length; _i++) {
      var fieldId = _Object$keys[_i];
      var field = this.getFieldById(fieldId);
      (0, _invariant.default)(field, 'no field model' + fieldId);
      fields.push(field);
    }

    return fields;
  }
  /** */


  getFieldById(fieldId) {
    if (!this._data.fieldsById[fieldId]) {
      return null;
    } else {
      if (!this._fieldModelsById[fieldId]) {
        this._fieldModelsById[fieldId] = new _field.default(this._baseData, this, fieldId);
      }

      return this._fieldModelsById[fieldId];
    }
  }
  /** */


  getFieldByName(fieldName) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _private_utils.entries)(this._data.fieldsById)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
            fieldId = _step2$value[0],
            fieldData = _step2$value[1];

        if (fieldData.name === fieldName) {
          return this.getFieldById(fieldId);
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

    return null;
  }
  /**
   * The view model corresponding to the view the user is currently viewing
   * in Airtable. May be `null` if the user is switching between
   * tables or views. Can be watched.
   */


  get activeView() {
    var activeViewId = this._data.activeViewId;
    return activeViewId ? this.getViewById(activeViewId) : null;
  }
  /**
   * The views in the table. Can be watched to know when views are created,
   * deleted, or reordered.
   */


  get views() {
    // TODO(kasra): cache and freeze this so it isn't O(n)
    var views = [];

    this._data.viewOrder.forEach(viewId => {
      var view = this.getViewById(viewId);
      (0, _invariant.default)(view, 'no view matching id in view order');
      views.push(view);
    });

    return views;
  }
  /** */


  getViewById(viewId) {
    if (!this._data.viewsById[viewId]) {
      return null;
    } else {
      if (!this._viewModelsById[viewId]) {
        this._viewModelsById[viewId] = new _view.default(this._baseData, this, viewId, this._airtableInterface);
      }

      return this._viewModelsById[viewId];
    }
  }
  /** */


  getViewByName(viewName) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _private_utils.entries)(this._data.viewsById)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
            viewId = _step3$value[0],
            viewData = _step3$value[1];

        if (viewData.name === viewName) {
          return this.getViewById(viewId);
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

    return null;
  }
  /** */


  select(opts) {
    return _table_or_view_query_result.default.__createOrReuseQueryResult(this, opts || {});
  }
  /**
   * The records in this table. The order is arbitrary since records are
   * only ordered in the context of a specific view.
   */


  get __records() {
    var recordsById = this._data.recordsById;
    (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
    var records = Object.keys(recordsById).map(recordId => {
      var record = this.__getRecordById(recordId);

      (0, _invariant.default)(record, 'record');
      return record;
    });
    return records;
  }
  /**
   * The record IDs in this table. The order is arbitrary since records are
   * only ordered in the context of a specific view.
   */


  get __recordIds() {
    var recordsById = this._data.recordsById;
    (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
    return Object.keys(recordsById);
  }
  /** Maximum number of records that the table can contain */


  get recordLimit() {
    return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
  }

  __getRecordById(recordId) {
    var recordsById = this._data.recordsById;
    (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
    (0, _invariant.default)(typeof recordId === 'string', 'getRecordById expects a string');

    if (!recordsById[recordId]) {
      return null;
    } else {
      if (!this._recordModelsById[recordId]) {
        this._recordModelsById[recordId] = new _record.default(this._baseData, this, recordId);
      }

      return this._recordModelsById[recordId];
    }
  }
  /** */


  canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName) {
    // This takes the field and record IDs to future-proof against granular permissions.
    // For now, just need at least edit permissions.
    var _getSdk = (0, _get_sdk.default)(),
        base = _getSdk.base;

    return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
  }
  /** */


  setCellValues(cellValuesByRecordIdThenFieldIdOrFieldName) {
    if (this.isDeleted) {
      throw new Error('Table does not exist');
    }

    if (!this.canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName)) {
      throw new Error('Your permission level does not allow editing cell values');
    }

    var changes = [];
    var cellValuesByRecordIdThenFieldId = {};
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = (0, _private_utils.entries)(cellValuesByRecordIdThenFieldIdOrFieldName)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = (0, _slicedToArray2.default)(_step4.value, 2),
            recordId = _step4$value[0],
            cellValuesByFieldIdOrFieldName = _step4$value[1];

        var record = this.__getRecordById(recordId);

        if (!record) {
          throw new Error('Record does not exist');
        }

        cellValuesByRecordIdThenFieldId[recordId] = {};
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _private_utils.entries)(cellValuesByFieldIdOrFieldName)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = (0, _slicedToArray2.default)(_step5.value, 2),
                fieldIdOrFieldName = _step5$value[0],
                publicCellValue = _step5$value[1];

            var field = this.__getFieldMatching(fieldIdOrFieldName);

            (0, _invariant.default)(field, 'Field does not exist');
            (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
            var currentPublicCellValue = record.getCellValue(field);

            var validationResult = _cell_value_utils.default.validatePublicCellValueForUpdate(publicCellValue, currentPublicCellValue, field);

            if (!validationResult.isValid) {
              throw new Error(validationResult.reason);
            }

            var normalizedCellValue = _cell_value_utils.default.normalizePublicCellValueForUpdate(publicCellValue, field);

            changes.push({
              path: ['tablesById', this.id, 'recordsById', recordId, 'cellValuesByFieldId', field.id],
              value: normalizedCellValue
            });
            cellValuesByRecordIdThenFieldId[recordId][field.id] = normalizedCellValue;
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

    this.parentBase.__applyChanges(changes); // Now send the update to Airtable.


    var completionPromise = this._airtableInterface.setCellValuesAsync(this.id, cellValuesByRecordIdThenFieldId);

    return {
      completion: completionPromise
    };
  }
  /** */


  canCreateRecord(cellValuesByFieldIdOrFieldName) {
    return this.canCreateRecords(cellValuesByFieldIdOrFieldName ? [cellValuesByFieldIdOrFieldName] : 1);
  }
  /** */


  createRecord(cellValuesByFieldIdOrFieldName) {
    var recordDef = cellValuesByFieldIdOrFieldName || {};
    var writeAction = this.createRecords([recordDef]);
    var records = writeAction.records;
    return {
      completion: writeAction.completion,
      record: records[0]
    };
  }
  /** */


  canCreateRecords(recordDefsOrNumberOfRecords) {
    // This takes the field IDs to future-proof against granular permissions.
    // For now, just need at least edit permissions.
    var _getSdk2 = (0, _get_sdk.default)(),
        base = _getSdk2.base;

    return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
  }
  /** */


  createRecords(recordDefsOrNumberOfRecords) {
    if (!this.canCreateRecords(recordDefsOrNumberOfRecords)) {
      throw new Error('Your permission level does not allow creating records');
    } // TODO: support creating records when only a record metadata or a
    // subset of fields are loaded.


    if (!this.isDataLoaded) {
      throw new Error('Table data is not loaded');
    }

    var recordDefs;

    if (typeof recordDefsOrNumberOfRecords === 'number') {
      var numEmptyRecordsToCreate = recordDefsOrNumberOfRecords;
      recordDefs = [];

      for (var i = 0; i < numEmptyRecordsToCreate; i++) {
        recordDefs.push({});
      }
    } else {
      recordDefs = recordDefsOrNumberOfRecords;
    }

    if (this.recordLimit - this.__recordIds.length < recordDefs.length) {
      throw new Error('Table over record limit. Check remainingRecordLimit before creating records.');
    }

    var parsedRecordDefs = [];
    var recordIds = [];
    var changes = [];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = recordDefs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var recordDef = _step6.value;
        var cellValuesByFieldId = {};
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = (0, _private_utils.entries)(recordDef)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _step8$value = (0, _slicedToArray2.default)(_step8.value, 2),
                fieldIdOrFieldName = _step8$value[0],
                cellValue = _step8$value[1];

            var field = this.__getFieldMatching(fieldIdOrFieldName);

            (0, _invariant.default)(field, "Field does not exist: ".concat(fieldIdOrFieldName));
            (0, _invariant.default)(!field.isDeleted, "Field has been deleted: ".concat(fieldIdOrFieldName)); // Current cell value is null since the record doesn't exist.

            var validationResult = _cell_value_utils.default.validatePublicCellValueForUpdate(cellValue, null, field);

            if (!validationResult.isValid) {
              throw new Error(validationResult.reason);
            }

            cellValuesByFieldId[field.id] = _cell_value_utils.default.normalizePublicCellValueForUpdate(cellValue, field);
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

        var recordId = hyperId.generateRowId();
        var parsedRecordDef = {
          id: recordId,
          cellValuesByFieldId,
          commentCount: 0,
          createdTime: new Date().toJSON()
        };
        parsedRecordDefs.push(parsedRecordDef);
        recordIds.push(recordId);
        changes.push({
          path: ['tablesById', this.id, 'recordsById', recordId],
          value: parsedRecordDef
        });
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.views[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var view = _step7.value;

        if (view.isDataLoaded) {
          changes.push(...view.__generateChangesForParentTableAddMultipleRecords(recordIds));
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    this.parentBase.__applyChanges(changes);

    var completionPromise = this._airtableInterface.createRecordsAsync(this.id, parsedRecordDefs);

    var recordModels = recordIds.map(recordId => {
      var recordModel = this.__getRecordById(recordId);

      (0, _invariant.default)(recordModel, 'Newly created record does not exist');
      return recordModel;
    });
    return {
      completion: completionPromise,
      records: recordModels
    };
  }
  /** */


  canDeleteRecord(record) {
    return this.canDeleteRecords([record]);
  }
  /** */


  deleteRecord(record) {
    return this.deleteRecords([record]);
  }
  /** */


  canDeleteRecords(records) {
    // This takes the records to future-proof against granular permissions.
    // For now, just need at least edit permissions.
    var _getSdk3 = (0, _get_sdk.default)(),
        base = _getSdk3.base;

    return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
  }
  /** */


  deleteRecords(records) {
    if (!this.canDeleteRecords(records)) {
      throw new Error('Your permission level does not allow deleting records');
    } // TODO: support deleting records when only a record metadata or a
    // subset of fields are loaded.


    if (!this.isDataLoaded) {
      throw new Error('Table data is not loaded');
    }

    var recordIds = records.map(record => record.id);
    var changes = recordIds.map(recordId => {
      return {
        path: ['tablesById', this.id, 'recordsById', recordId],
        value: undefined
      };
    });
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = this.views[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var view = _step9.value;

        if (view.isDataLoaded) {
          changes.push(...view.__generateChangesForParentTableDeleteMultipleRecords(recordIds));
        }
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

    this.parentBase.__applyChanges(changes);

    var completionPromise = this._airtableInterface.deleteRecordsAsync(this.id, recordIds);

    return {
      completion: completionPromise
    };
  }
  /** */


  getFirstViewOfType(allowedViewTypes) {
    if (!Array.isArray(allowedViewTypes)) {
      allowedViewTypes = [allowedViewTypes];
    }

    return u.find(this.views, view => {
      return u.includes(allowedViewTypes, view.type);
    }) || null;
  }
  /**
   * If the activeView's type is in allowedViewTypes, then the activeView
   * is returned. Otherwise, the first view whose type is in allowedViewTypes
   * will be returned. Returns null if no view satisfying allowedViewTypes
   * exists.
   */


  getDefaultViewOfType(allowedViewTypes) {
    if (!Array.isArray(allowedViewTypes)) {
      allowedViewTypes = [allowedViewTypes];
    }

    var activeView = this.activeView;

    if (activeView && u.includes(allowedViewTypes, activeView.type)) {
      return activeView;
    } else {
      return this.getFirstViewOfType(allowedViewTypes);
    }
  } // Experimental, do not document yet. Allows fetching default cell values for
  // a table or view. Before documenting, we should explore making this synchronous.


  getDefaultCellValuesByFieldIdAsync(opts) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var viewId, cellValuesByFieldId;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              viewId = opts && opts.view ? opts.view.id : null;
              _context.next = 3;
              return _this._airtableInterface.fetchDefaultCellValuesByFieldIdAsync(_this._id, viewId);

            case 3:
              cellValuesByFieldId = _context.sent;
              return _context.abrupt("return", cellValuesByFieldId);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
  /**
   * Record metadata means record IDs, createdTime, and commentCount are loaded.
   * Record metadata must be loaded before creating, deleting, or updating records.
   */


  get isRecordMetadataLoaded() {
    return !!this._data.recordsById;
  }
  /**
   * Loads record metadata. Returns a Promise that resolves when record
   * metadata is loaded.
   */


  loadRecordMetadataAsync() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this2.loadCellValuesInFieldIdsAsync([_this2._getFieldIdForCausingRecordMetadataToLoad()]);

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
  /** Unloads record metadata. */


  unloadRecordMetadata() {
    this.unloadCellValuesInFieldIds([this._getFieldIdForCausingRecordMetadataToLoad()]);
  }

  _getFieldIdForCausingRecordMetadataToLoad() {
    // As a shortcut, we'll load the primary field cell values to
    // cause record metadata (id, createdTime, commentCount) to be loaded
    // and subscribed to. In the future, we could add an explicit model
    // bridge to fetch and subscribe to row metadata.
    return this._primaryFieldId;
  }
  /** */


  areCellValuesLoadedForFieldId(fieldId) {
    return this.isDataLoaded || this._areCellValuesLoadedByFieldId[fieldId] || false;
  }
  /**
   * This is a low-level API. In most cases, using a `QueryResult` obtained by
   * calling `table.select` or `view.select` is preferred.
   */


  loadCellValuesInFieldIdsAsync(fieldIds) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3() {
      var fieldIdsWhichAreNotAlreadyLoadedOrLoading, pendingLoadPromises, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _fieldId, pendingLoadPromise, loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise, _i2, _fieldIdsWhichAreNotA, fieldId;

      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              fieldIdsWhichAreNotAlreadyLoadedOrLoading = [];
              pendingLoadPromises = [];
              _iteratorNormalCompletion10 = true;
              _didIteratorError10 = false;
              _iteratorError10 = undefined;
              _context3.prev = 5;

              for (_iterator10 = fieldIds[Symbol.iterator](); !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                _fieldId = _step10.value;

                if (_this3._cellValuesRetainCountByFieldId[_fieldId] !== undefined) {
                  _this3._cellValuesRetainCountByFieldId[_fieldId]++;
                } else {
                  _this3._cellValuesRetainCountByFieldId[_fieldId] = 1;
                } // NOTE: we don't use this.areCellValuesLoadedForFieldId() here because
                // that will return true if the cell values are loaded as a result
                // of the entire table being loaded. In that scenario, we still
                // want to separately load the cell values for the field so there
                // is a separate subscription. Otherwise, when the table data unloads,
                // the field data would unload as well. This can be improved by just
                // subscribing to the field data without fetching it, since the cell
                // values are already in the block frame.


                if (!_this3._areCellValuesLoadedByFieldId[_fieldId]) {
                  pendingLoadPromise = _this3._pendingCellValuesLoadPromiseByFieldId[_fieldId];

                  if (pendingLoadPromise) {
                    pendingLoadPromises.push(pendingLoadPromise);
                  } else {
                    fieldIdsWhichAreNotAlreadyLoadedOrLoading.push(_fieldId);
                  }
                }
              }

              _context3.next = 13;
              break;

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](5);
              _didIteratorError10 = true;
              _iteratorError10 = _context3.t0;

            case 13:
              _context3.prev = 13;
              _context3.prev = 14;

              if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
                _iterator10.return();
              }

            case 16:
              _context3.prev = 16;

              if (!_didIteratorError10) {
                _context3.next = 19;
                break;
              }

              throw _iteratorError10;

            case 19:
              return _context3.finish(16);

            case 20:
              return _context3.finish(13);

            case 21:
              if (fieldIdsWhichAreNotAlreadyLoadedOrLoading.length > 0) {
                // Could inline _loadCellValuesInFieldIdsAsync, but following the
                // pattern from AbstractModelWithAsyncData where the public method
                // is responsible for updating retain counts and the private method
                // actually fetches data.
                loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = _this3._loadCellValuesInFieldIdsAsync(fieldIdsWhichAreNotAlreadyLoadedOrLoading);
                pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);

                for (_i2 = 0, _fieldIdsWhichAreNotA = fieldIdsWhichAreNotAlreadyLoadedOrLoading; _i2 < _fieldIdsWhichAreNotA.length; _i2++) {
                  fieldId = _fieldIdsWhichAreNotA[_i2];
                  _this3._pendingCellValuesLoadPromiseByFieldId[fieldId] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
                } // Doing `.then` instead of performing these actions directly in
                // _loadCellValuesInFieldIdsAsync so this is similar to
                // AbstractModelWithAsyncData. The idea is to refactor to avoid code
                // duplication, so keeping them similar for now hopefully will make the
                // refactor simpler.


                loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise.then(changedKeys => {
                  for (var _i3 = 0, _fieldIdsWhichAreNotA2 = fieldIdsWhichAreNotAlreadyLoadedOrLoading; _i3 < _fieldIdsWhichAreNotA2.length; _i3++) {
                    var fieldId = _fieldIdsWhichAreNotA2[_i3];
                    _this3._areCellValuesLoadedByFieldId[fieldId] = true;
                    _this3._pendingCellValuesLoadPromiseByFieldId[fieldId] = undefined;
                  }

                  var _iteratorNormalCompletion11 = true;
                  var _didIteratorError11 = false;
                  var _iteratorError11 = undefined;

                  try {
                    for (var _iterator11 = changedKeys[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                      var key = _step11.value;

                      _this3._onChange(key);
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
                });
              }

              _context3.next = 24;
              return Promise.all(pendingLoadPromises);

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[5, 9, 13, 21], [14,, 16, 20]]);
    }))();
  }

  _loadCellValuesInFieldIdsAsync(fieldIds) {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee4() {
      var _ref, newRecordsById, existingRecordsById, changedKeys;

      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this4._airtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync(_this4._id, fieldIds);

            case 2:
              _ref = _context4.sent;
              newRecordsById = _ref.recordsById;

              // Merge with existing data.
              if (!_this4._data.recordsById) {
                _this4._data.recordsById = {};
              }

              existingRecordsById = _this4._data.recordsById;
              u.unsafeEach(newRecordsById, (newRecordObj, recordId) => {
                if (!u.has(existingRecordsById, recordId)) {
                  existingRecordsById[recordId] = newRecordObj;
                } else {
                  var existingRecordObj = existingRecordsById[recordId]; // Metadata (createdTime, commentCount) should already be up to date,
                  // but just verify for sanity. If this doesn't catch anything, can
                  // remove it for perf.

                  (0, _invariant.default)(existingRecordObj.commentCount === newRecordObj.commentCount, 'comment count out of sync');
                  (0, _invariant.default)(existingRecordObj.createdTime === newRecordObj.createdTime, 'created time out of sync');

                  if (!existingRecordObj.cellValuesByFieldId) {
                    existingRecordObj.cellValuesByFieldId = {};
                  }

                  var existingCellValuesByFieldId = existingRecordObj.cellValuesByFieldId;

                  for (var i = 0; i < fieldIds.length; i++) {
                    var fieldId = fieldIds[i];
                    existingCellValuesByFieldId[fieldId] = newRecordObj.cellValuesByFieldId ? newRecordObj.cellValuesByFieldId[fieldId] : undefined;
                  }
                }
              });
              changedKeys = fieldIds.map(fieldId => WatchableCellValuesInFieldKeyPrefix + fieldId); // Need to trigger onChange for records and recordIds since watching either
              // of those causes record metadata to be loaded (via _getFieldIdForCausingRecordMetadataToLoad)
              // and by convention we trigger a change event when data loads.

              changedKeys.push(WatchableTableKeys.__records);
              changedKeys.push(WatchableTableKeys.__recordIds); // Also trigger cellValues changes since the cell values in the fields
              // are now loaded.

              changedKeys.push(WatchableTableKeys.__cellValues);
              return _context4.abrupt("return", changedKeys);

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  }
  /** */


  unloadCellValuesInFieldIds(fieldIds) {
    var fieldIdsWithZeroRetainCount = [];
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
      for (var _iterator12 = fieldIds[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
        var fieldId = _step12.value;
        var fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
        fieldRetainCount--;

        if (fieldRetainCount < 0) {
          console.log('Field data over-released'); // eslint-disable-line no-console

          fieldRetainCount = 0;
        }

        this._cellValuesRetainCountByFieldId[fieldId] = fieldRetainCount;

        if (fieldRetainCount === 0) {
          fieldIdsWithZeroRetainCount.push(fieldId);
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

    if (fieldIdsWithZeroRetainCount.length > 0) {
      // Don't unload immediately. Wait a while in case something else
      // requests the data, so we can avoid going back to liveapp or
      // the network.
      setTimeout(() => {
        // Make sure the retain count is still zero, since it may
        // have been incremented before the timeout fired.
        var fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
          return this._cellValuesRetainCountByFieldId[fieldId] === 0;
        });

        if (fieldIdsToUnload.length > 0) {
          // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
          // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = fieldIdsToUnload[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var fieldId = _step13.value;
              this._areCellValuesLoadedByFieldId[fieldId] = false;
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

          this._unloadCellValuesInFieldIds(fieldIdsToUnload);
        }
      }, _abstract_model_with_async_data.default.__DATA_UNLOAD_DELAY_MS);
    }
  }

  _unloadCellValuesInFieldIds(fieldIds) {
    this._airtableInterface.unsubscribeFromCellValuesInFields(this._id, fieldIds);

    this._afterUnloadDataOrUnloadCellValuesInFieldIds(fieldIds);
  }

  _loadDataAsync() {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee5() {
      var tableData, changedKeys, _i4, _Object$keys2, fieldId;

      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _this5._airtableInterface.fetchAndSubscribeToTableDataAsync(_this5._id);

            case 2:
              tableData = _context5.sent;
              _this5._data.recordsById = tableData.recordsById;
              changedKeys = [WatchableTableKeys.__records, WatchableTableKeys.__recordIds, WatchableTableKeys.__cellValues];

              for (_i4 = 0, _Object$keys2 = Object.keys(_this5._data.fieldsById); _i4 < _Object$keys2.length; _i4++) {
                fieldId = _Object$keys2[_i4];
                changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
              }

              return _context5.abrupt("return", changedKeys);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  }

  _unloadData() {
    this._airtableInterface.unsubscribeFromTableData(this._id);

    this._afterUnloadDataOrUnloadCellValuesInFieldIds();
  }

  _afterUnloadDataOrUnloadCellValuesInFieldIds(unloadedFieldIds) {
    var areAnyFieldsLoaded = this.isDataLoaded || u.some((0, _private_utils.values)(this._areCellValuesLoadedByFieldId), isLoaded => isLoaded);

    if (!this.isDeleted) {
      if (!areAnyFieldsLoaded) {
        this._data.recordsById = undefined;
      } else if (!this.isDataLoaded) {
        var fieldIdsToClear;

        if (unloadedFieldIds) {
          // Specific fields were unloaded, so clear out the cell values for those fields.
          fieldIdsToClear = unloadedFieldIds;
        } else {
          // The entire table was unloaded, but some individual fields are still loaded.
          // We need to clear out the cell values of every field that was unloaded.
          // This is kind of slow, but hopefully uncommon.
          var fieldIds = Object.keys(this._data.fieldsById);
          fieldIdsToClear = fieldIds.filter(fieldId => !this._areCellValuesLoadedByFieldId[fieldId]);
        }

        u.unsafeEach(this._data.recordsById, recordObj => {
          for (var i = 0; i < fieldIdsToClear.length; i++) {
            var fieldId = fieldIdsToClear[i];

            if (recordObj.cellValuesByFieldId) {
              recordObj.cellValuesByFieldId[fieldId] = undefined;
            }
          }
        });
      }
    }

    if (!areAnyFieldsLoaded) {
      this._recordModelsById = {};
    }
  }

  __getFieldMatching(fieldOrFieldIdOrFieldName) {
    var field;

    if (fieldOrFieldIdOrFieldName instanceof _field.default) {
      field = fieldOrFieldIdOrFieldName;
    } else {
      field = this.getFieldById(fieldOrFieldIdOrFieldName) || this.getFieldByName(fieldOrFieldIdOrFieldName);
    }

    return field;
  }

  __getViewMatching(viewOrViewIdOrViewName) {
    var view;

    if (viewOrViewIdOrViewName instanceof _view.default) {
      view = viewOrViewIdOrViewName;
    } else {
      view = this.getViewById(viewOrViewIdOrViewName) || this.getViewByName(viewOrViewIdOrViewName);
    }

    return view;
  }

  __triggerOnChangeForDirtyPaths(dirtyPaths) {
    if (dirtyPaths.name) {
      this._onChange(WatchableTableKeys.name);
    }

    if (dirtyPaths.activeViewId) {
      this._onChange(WatchableTableKeys.activeView);
    }

    if (dirtyPaths.viewOrder) {
      this._onChange(WatchableTableKeys.views); // Clean up deleted views


      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        for (var _iterator14 = (0, _private_utils.entries)(this._viewModelsById)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          var _step14$value = (0, _slicedToArray2.default)(_step14.value, 2),
              viewId = _step14$value[0],
              viewModel = _step14$value[1];

          if (viewModel.isDeleted) {
            delete this._viewModelsById[viewId];
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
    }

    if (dirtyPaths.viewsById) {
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = (0, _private_utils.entries)(dirtyPaths.viewsById)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var _step15$value = (0, _slicedToArray2.default)(_step15.value, 2),
              viewId = _step15$value[0],
              dirtyViewPaths = _step15$value[1];

          // Directly access from _viewModelsById to avoid creating
          // a view model if it doesn't already exist. If it doesn't exist,
          // nothing can be subscribed to any events on it.
          var view = this._viewModelsById[viewId];

          if (view) {
            view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);
          }
        }
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
            _iterator15.return();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
        }
      }
    }

    if (dirtyPaths.fieldsById) {
      // Since tables don't have a field order, need to detect if a field
      // was created or deleted and trigger onChange for fields.
      var addedFieldIds = [];
      var removedFieldIds = [];
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        for (var _iterator16 = (0, _private_utils.entries)(dirtyPaths.fieldsById)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          var _step16$value = (0, _slicedToArray2.default)(_step16.value, 2),
              fieldId = _step16$value[0],
              dirtyFieldPaths = _step16$value[1];

          if (dirtyFieldPaths._isDirty) {
            // If the entire field is dirty, it was either created or deleted.
            if (u.has(this._data.fieldsById, fieldId)) {
              addedFieldIds.push(fieldId);
            } else {
              removedFieldIds.push(fieldId);
              var fieldModel = this._fieldModelsById[fieldId];

              if (fieldModel) {
                // Remove the Field model if it was deleted.
                delete this._fieldModelsById[fieldId];
              }
            }
          } else {
            // Directly access from _fieldModelsById to avoid creating
            // a field model if it doesn't already exist. If it doesn't exist,
            // nothing can be subscribed to any events on it.
            var field = this._fieldModelsById[fieldId];

            if (field) {
              field.__triggerOnChangeForDirtyPaths(dirtyFieldPaths);
            }
          }
        }
      } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
            _iterator16.return();
          }
        } finally {
          if (_didIteratorError16) {
            throw _iteratorError16;
          }
        }
      }

      if (addedFieldIds.length > 0 || removedFieldIds.length > 0) {
        this._onChange(WatchableTableKeys.fields, {
          addedFieldIds,
          removedFieldIds
        });
      } // Clear out cached field names in case a field was added/removed/renamed.


      this._cachedFieldNamesById = null;
    }

    if (this.isRecordMetadataLoaded && dirtyPaths.recordsById) {
      // Since tables don't have a record order, need to detect if a record
      // was created or deleted and trigger onChange for records.
      var dirtyFieldIdsSet = {};
      var addedRecordIds = [];
      var removedRecordIds = [];
      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
        for (var _iterator17 = (0, _private_utils.entries)(dirtyPaths.recordsById)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
          var _step17$value = (0, _slicedToArray2.default)(_step17.value, 2),
              recordId = _step17$value[0],
              dirtyRecordPaths = _step17$value[1];

          if (dirtyRecordPaths._isDirty) {
            // If the entire record is dirty, it was either created or deleted.
            (0, _invariant.default)(this._data.recordsById, 'No recordsById');

            if (u.has(this._data.recordsById, recordId)) {
              addedRecordIds.push(recordId);
            } else {
              removedRecordIds.push(recordId);
              var recordModel = this._recordModelsById[recordId];

              if (recordModel) {
                // Remove the Record model if it was deleted.
                delete this._recordModelsById[recordId];
              }
            }
          } else {
            var _recordModel = this._recordModelsById[recordId];

            if (_recordModel) {
              _recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
            }
          }

          var cellValuesByFieldId = dirtyRecordPaths.cellValuesByFieldId;

          if (cellValuesByFieldId) {
            for (var _i5 = 0, _Object$keys3 = Object.keys(cellValuesByFieldId); _i5 < _Object$keys3.length; _i5++) {
              var fieldId = _Object$keys3[_i5];
              dirtyFieldIdsSet[fieldId] = true;
            }
          }
        } // Now that we've composed our created/deleted record ids arrays, let's fire
        // the records onChange event if any records were created or deleted.

      } catch (err) {
        _didIteratorError17 = true;
        _iteratorError17 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion17 && _iterator17.return != null) {
            _iterator17.return();
          }
        } finally {
          if (_didIteratorError17) {
            throw _iteratorError17;
          }
        }
      }

      if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
        this._onChange(WatchableTableKeys.__records, {
          addedRecordIds,
          removedRecordIds
        });

        this._onChange(WatchableTableKeys.__recordIds, {
          addedRecordIds,
          removedRecordIds
        });
      } // NOTE: this is an experimental (and somewhat messy) way to watch
      // for changes to cells in a table, as an alternative to implementing
      // full event bubbling. For now, it unblocks the things we want to
      // build, but we may replace it.
      // If we keep it, could be more efficient by not calling _onChange
      // if there are no subscribers.
      // TODO: don't trigger changes for fields that aren't supposed to be loaded
      // (in some cases, e.g. record created, liveapp will send cell values
      // that we're not subscribed to).


      var fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
      var recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));

      if (fieldIds.length > 0 && recordIds.length > 0) {
        this._onChange(WatchableTableKeys.__cellValues, {
          recordIds,
          fieldIds
        });
      }

      var _iteratorNormalCompletion18 = true;
      var _didIteratorError18 = false;
      var _iteratorError18 = undefined;

      try {
        for (var _iterator18 = fieldIds[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
          var _fieldId2 = _step18.value;

          this._onChange(WatchableCellValuesInFieldKeyPrefix + _fieldId2, recordIds, _fieldId2);
        }
      } catch (err) {
        _didIteratorError18 = true;
        _iteratorError18 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion18 && _iterator18.return != null) {
            _iterator18.return();
          }
        } finally {
          if (_didIteratorError18) {
            throw _iteratorError18;
          }
        }
      }
    }
  }

  __getFieldNamesById() {
    if (!this._cachedFieldNamesById) {
      var fieldNamesById = {};
      var _iteratorNormalCompletion19 = true;
      var _didIteratorError19 = false;
      var _iteratorError19 = undefined;

      try {
        for (var _iterator19 = (0, _private_utils.entries)(this._data.fieldsById)[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
          var _step19$value = (0, _slicedToArray2.default)(_step19.value, 2),
              fieldId = _step19$value[0],
              fieldData = _step19$value[1];

          fieldNamesById[fieldId] = fieldData.name;
        }
      } catch (err) {
        _didIteratorError19 = true;
        _iteratorError19 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion19 && _iterator19.return != null) {
            _iterator19.return();
          }
        } finally {
          if (_didIteratorError19) {
            throw _iteratorError19;
          }
        }
      }

      this._cachedFieldNamesById = fieldNamesById;
    }

    return this._cachedFieldNamesById;
  }

}

(0, _defineProperty2.default)(Table, "_className", 'Table');
var _default = Table;
exports.default = _default;