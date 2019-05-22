"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

require("core-js/modules/web.url.to-json");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _permission_levels = require("../types/permission_levels");

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _view = _interopRequireDefault(require("./view"));

var _field = _interopRequireDefault(require("./field"));

var _record = _interopRequireDefault(require("./record"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const hyperId = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id');

const permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

const airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


const WatchableTableKeys = {
  name: 'name',
  activeView: 'activeView',
  views: 'views',
  fields: 'fields',
  records: 'records',
  recordIds: 'recordIds',
  // TODO(kasra): these keys don't have matching getters (not that they should
  // it's just inconsistent...)
  cellValues: 'cellValues'
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:'; // The string case is to accommodate cellValuesInField:$FieldId.
// It may also be useful to have cellValuesInView:$ViewId...

/** Model class representing a table in the base. */
class Table extends _abstract_model_with_async_data.default {
  // Once all blocks that current set this flag to true are migrated,
  // remove this flag.
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableTableKeys, key) || (0, _startsWith.default)(u).call(u, key, WatchableCellValuesInFieldKeyPrefix);
  }

  static _shouldLoadDataForKey(key) {
    // "Data" means *all* cell values in the table. If only watching records/recordIds,
    // we'll just load record metadata (id, createdTime, commentCount).
    // If only watching specific fields, we'll just load cell values in those
    // fields. Both of those scenarios are handled manually by this class,
    // instead of relying on AbstractModelWithAsyncData.
    if (Table.shouldLoadAllCellValuesForRecords) {
      return key === WatchableTableKeys.records || key === WatchableTableKeys.recordIds || key === WatchableTableKeys.cellValues;
    } else {
      return key === WatchableTableKeys.cellValues;
    }
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
    (0, _seal.default)(this);
  }

  watch(keys, callback, context) {
    const validKeys = super.watch(keys, callback, context);

    const fieldIdsToLoad = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

    if (fieldIdsToLoad.length > 0) {
      var _context;

      _private_utils.default.fireAndForgetPromise((0, _bind.default)(_context = this.loadCellValuesInFieldIdsAsync).call(_context, this, fieldIdsToLoad));
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    const validKeys = super.unwatch(keys, callback, context);

    const fieldIdsToUnload = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

    if (fieldIdsToUnload.length > 0) {
      this.unloadCellValuesInFieldIds(fieldIdsToUnload);
    }

    return validKeys;
  }

  _getFieldIdsToLoadFromWatchableKeys(keys) {
    const fieldIdsToLoad = [];

    for (const key of keys) {
      if ((0, _startsWith.default)(u).call(u, key, WatchableCellValuesInFieldKeyPrefix)) {
        const fieldId = key.substring(WatchableCellValuesInFieldKeyPrefix.length);
        fieldIdsToLoad.push(fieldId);
      } else if (!Table.shouldLoadAllCellValuesForRecords) {
        if (key === WatchableTableKeys.records || key === WatchableTableKeys.recordIds) {
          fieldIdsToLoad.push(this._getFieldIdForCausingRecordMetadataToLoad());
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
    const primaryField = this.getFieldById(this._data.primaryFieldId);
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
    const fields = [];

    for (const fieldId of (0, _keys2.default)(u).call(u, this._data.fieldsById)) {
      const field = this.getFieldById(fieldId);
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
    for (const [fieldId, fieldData] of (0, _entries.default)(u).call(u, this._data.fieldsById)) {
      if (fieldData.name === fieldName) {
        return this.getFieldById(fieldId);
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
    const {
      activeViewId
    } = this._data;
    return activeViewId ? this.getViewById(activeViewId) : null;
  }
  /**
   * The views in the table. Can be watched to know when views are created,
   * deleted, or reordered.
   */


  get views() {
    var _context2;

    // TODO(kasra): cache and freeze this so it isn't O(n)
    const views = [];
    (0, _forEach.default)(_context2 = this._data.viewOrder).call(_context2, viewId => {
      const view = this.getViewById(viewId);
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
    for (const [viewId, viewData] of (0, _entries.default)(u).call(u, this._data.viewsById)) {
      if (viewData.name === viewName) {
        return this.getViewById(viewId);
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


  get records() {
    var _context3;

    const recordsById = this._data.recordsById;
    (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
    const records = (0, _map.default)(_context3 = (0, _keys.default)(recordsById)).call(_context3, recordId => {
      const record = this.getRecordById(recordId);
      (0, _invariant.default)(record, 'record');
      return record;
    });
    return records;
  }
  /**
   * The record IDs in this table. The order is arbitrary since records are
   * only ordered in the context of a specific view.
   */


  get recordIds() {
    const recordsById = this._data.recordsById;
    (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
    return (0, _keys.default)(recordsById);
  }
  /** Number of records in the table */


  get recordCount() {
    return this.recordIds.length;
  }
  /** Maximum number of records that the table can contain */


  get recordLimit() {
    return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
  }
  /** Maximum number of additional records that can be created in the table */


  get remainingRecordLimit() {
    return this.recordLimit - this.recordCount;
  }
  /** */


  getRecordById(recordId) {
    const recordsById = this._data.recordsById;
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
    const {
      base
    } = (0, _get_sdk.default)();
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

    const changes = [];
    const cellValuesByRecordIdThenFieldId = {};

    for (const [recordId, cellValuesByFieldIdOrFieldName] of (0, _entries.default)(u).call(u, cellValuesByRecordIdThenFieldIdOrFieldName)) {
      const record = this.getRecordById(recordId);

      if (!record) {
        throw new Error('Record does not exist');
      }

      cellValuesByRecordIdThenFieldId[recordId] = {};

      for (const [fieldIdOrFieldName, publicCellValue] of (0, _entries.default)(u).call(u, cellValuesByFieldIdOrFieldName)) {
        const field = this.__getFieldMatching(fieldIdOrFieldName);

        (0, _invariant.default)(field, 'Field does not exist');
        (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
        const currentPublicCellValue = record.getCellValue(field);

        const validationResult = _cell_value_utils.default.validatePublicCellValueForUpdate(publicCellValue, currentPublicCellValue, field);

        if (!validationResult.isValid) {
          throw new Error(validationResult.reason);
        }

        const normalizedCellValue = _cell_value_utils.default.normalizePublicCellValueForUpdate(publicCellValue, field);

        changes.push({
          path: ['tablesById', this.id, 'recordsById', recordId, 'cellValuesByFieldId', field.id],
          value: normalizedCellValue
        });
        cellValuesByRecordIdThenFieldId[recordId][field.id] = normalizedCellValue;
      }
    }

    this.parentBase.__applyChanges(changes); // Now send the update to Airtable.


    const completionPromise = this._airtableInterface.setCellValuesAsync(this.id, cellValuesByRecordIdThenFieldId);

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
    const recordDef = cellValuesByFieldIdOrFieldName || {};
    const writeAction = this.createRecords([recordDef]);
    const records = writeAction.records;
    return {
      completion: writeAction.completion,
      record: records[0]
    };
  }
  /** */


  canCreateRecords(recordDefsOrNumberOfRecords) {
    // This takes the field IDs to future-proof against granular permissions.
    // For now, just need at least edit permissions.
    const {
      base
    } = (0, _get_sdk.default)();
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

    let recordDefs;

    if (typeof recordDefsOrNumberOfRecords === 'number') {
      const numEmptyRecordsToCreate = recordDefsOrNumberOfRecords;
      recordDefs = [];

      for (let i = 0; i < numEmptyRecordsToCreate; i++) {
        recordDefs.push({});
      }
    } else {
      recordDefs = recordDefsOrNumberOfRecords;
    }

    if (this.remainingRecordLimit < recordDefs.length) {
      throw new Error('Table over record limit. Check remainingRecordLimit before creating records.');
    }

    const parsedRecordDefs = [];
    const recordIds = [];
    const changes = [];

    for (const recordDef of recordDefs) {
      const cellValuesByFieldId = {};

      for (const [fieldIdOrFieldName, cellValue] of (0, _entries.default)(u).call(u, recordDef)) {
        const field = this.__getFieldMatching(fieldIdOrFieldName);

        (0, _invariant.default)(field, `Field does not exist: ${fieldIdOrFieldName}`);
        (0, _invariant.default)(!field.isDeleted, `Field has been deleted: ${fieldIdOrFieldName}`); // Current cell value is null since the record doesn't exist.

        const validationResult = _cell_value_utils.default.validatePublicCellValueForUpdate(cellValue, null, field);

        if (!validationResult.isValid) {
          throw new Error(validationResult.reason);
        }

        cellValuesByFieldId[field.id] = _cell_value_utils.default.normalizePublicCellValueForUpdate(cellValue, field);
      }

      const recordId = hyperId.generateRowId();
      const parsedRecordDef = {
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

    for (const view of this.views) {
      if (view.isDataLoaded) {
        changes.push(...view.__generateChangesForParentTableAddMultipleRecords(recordIds));
      }
    }

    this.parentBase.__applyChanges(changes);

    const completionPromise = this._airtableInterface.createRecordsAsync(this.id, parsedRecordDefs);

    const recordModels = (0, _map.default)(recordIds).call(recordIds, recordId => {
      const recordModel = this.getRecordById(recordId);
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
    const {
      base
    } = (0, _get_sdk.default)();
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

    const recordIds = (0, _map.default)(records).call(records, record => record.id);
    const changes = (0, _map.default)(recordIds).call(recordIds, recordId => {
      return {
        path: ['tablesById', this.id, 'recordsById', recordId],
        value: undefined
      };
    });

    for (const view of this.views) {
      if (view.isDataLoaded) {
        changes.push(...view.__generateChangesForParentTableDeleteMultipleRecords(recordIds));
      }
    }

    this.parentBase.__applyChanges(changes);

    const completionPromise = this._airtableInterface.deleteRecordsAsync(this.id, recordIds);

    return {
      completion: completionPromise
    };
  }
  /** */


  getFirstViewOfType(allowedViewTypes) {
    if (!(0, _isArray.default)(allowedViewTypes)) {
      allowedViewTypes = [allowedViewTypes];
    }

    return (0, _find.default)(u).call(u, this.views, view => {
      return (0, _includes.default)(u).call(u, allowedViewTypes, view.type);
    }) || null;
  }
  /**
   * If the activeView's type is in allowedViewTypes, then the activeView
   * is returned. Otherwise, the first view whose type is in allowedViewTypes
   * will be returned. Returns null if no view satisfying allowedViewTypes
   * exists.
   */


  getDefaultViewOfType(allowedViewTypes) {
    if (!(0, _isArray.default)(allowedViewTypes)) {
      allowedViewTypes = [allowedViewTypes];
    }

    const activeView = this.activeView;

    if (activeView && (0, _includes.default)(u).call(u, allowedViewTypes, activeView.type)) {
      return activeView;
    } else {
      return this.getFirstViewOfType(allowedViewTypes);
    }
  } // Experimental, do not document yet. Allows fetching default cell values for
  // a table or view. Before documenting, we should explore making this synchronous.


  async getDefaultCellValuesByFieldIdAsync(opts) {
    const viewId = opts && opts.view ? opts.view.id : null;
    const cellValuesByFieldId = await this._airtableInterface.fetchDefaultCellValuesByFieldIdAsync(this._id, viewId);
    return cellValuesByFieldId;
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


  async loadRecordMetadataAsync() {
    return await this.loadCellValuesInFieldIdsAsync([this._getFieldIdForCausingRecordMetadataToLoad()]);
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


  async loadCellValuesInFieldIdsAsync(fieldIds) {
    const fieldIdsWhichAreNotAlreadyLoadedOrLoading = [];
    const pendingLoadPromises = [];

    for (const fieldId of fieldIds) {
      if (this._cellValuesRetainCountByFieldId[fieldId] !== undefined) {
        this._cellValuesRetainCountByFieldId[fieldId]++;
      } else {
        this._cellValuesRetainCountByFieldId[fieldId] = 1;
      } // NOTE: we don't use this.areCellValuesLoadedForFieldId() here because
      // that will return true if the cell values are loaded as a result
      // of the entire table being loaded. In that scenario, we still
      // want to separately load the cell values for the field so there
      // is a separate subscription. Otherwise, when the table data unloads,
      // the field data would unload as well. This can be improved by just
      // subscribing to the field data without fetching it, since the cell
      // values are already in the block frame.


      if (!this._areCellValuesLoadedByFieldId[fieldId]) {
        const pendingLoadPromise = this._pendingCellValuesLoadPromiseByFieldId[fieldId];

        if (pendingLoadPromise) {
          pendingLoadPromises.push(pendingLoadPromise);
        } else {
          fieldIdsWhichAreNotAlreadyLoadedOrLoading.push(fieldId);
        }
      }
    }

    if (fieldIdsWhichAreNotAlreadyLoadedOrLoading.length > 0) {
      // Could inline _loadCellValuesInFieldIdsAsync, but following the
      // pattern from AbstractModelWithAsyncData where the public method
      // is responsible for updating retain counts and the private method
      // actually fetches data.
      const loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = this._loadCellValuesInFieldIdsAsync(fieldIdsWhichAreNotAlreadyLoadedOrLoading);

      pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);

      for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
        this._pendingCellValuesLoadPromiseByFieldId[fieldId] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
      } // Doing `.then` instead of performing these actions directly in
      // _loadCellValuesInFieldIdsAsync so this is similar to
      // AbstractModelWithAsyncData. The idea is to refactor to avoid code
      // duplication, so keeping them similar for now hopefully will make the
      // refactor simpler.


      loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise.then(changedKeys => {
        for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
          this._areCellValuesLoadedByFieldId[fieldId] = true;
          this._pendingCellValuesLoadPromiseByFieldId[fieldId] = undefined;
        }

        for (const key of changedKeys) {
          this._onChange(key);
        }
      });
    }

    await _promise.default.all(pendingLoadPromises);
  }

  async _loadCellValuesInFieldIdsAsync(fieldIds) {
    const {
      recordsById: newRecordsById
    } = await this._airtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync(this._id, fieldIds); // Merge with existing data.

    if (!this._data.recordsById) {
      this._data.recordsById = {};
    }

    const {
      recordsById: existingRecordsById
    } = this._data;
    u.unsafeEach(newRecordsById, (newRecordObj, recordId) => {
      if (!u.has(existingRecordsById, recordId)) {
        existingRecordsById[recordId] = newRecordObj;
      } else {
        const existingRecordObj = existingRecordsById[recordId]; // Metadata (createdTime, commentCount) should already be up to date,
        // but just verify for sanity. If this doesn't catch anything, can
        // remove it for perf.

        (0, _invariant.default)(existingRecordObj.commentCount === newRecordObj.commentCount, 'comment count out of sync');
        (0, _invariant.default)(existingRecordObj.createdTime === newRecordObj.createdTime, 'created time out of sync');

        if (!existingRecordObj.cellValuesByFieldId) {
          existingRecordObj.cellValuesByFieldId = {};
        }

        const existingCellValuesByFieldId = existingRecordObj.cellValuesByFieldId;

        for (let i = 0; i < fieldIds.length; i++) {
          const fieldId = fieldIds[i];
          existingCellValuesByFieldId[fieldId] = newRecordObj.cellValuesByFieldId ? newRecordObj.cellValuesByFieldId[fieldId] : undefined;
        }
      }
    });
    const changedKeys = (0, _map.default)(fieldIds).call(fieldIds, fieldId => WatchableCellValuesInFieldKeyPrefix + fieldId); // Need to trigger onChange for records and recordIds since watching either
    // of those causes record metadata to be loaded (via _getFieldIdForCausingRecordMetadataToLoad)
    // and by convention we trigger a change event when data loads.

    changedKeys.push(WatchableTableKeys.records);
    changedKeys.push(WatchableTableKeys.recordIds); // Also trigger cellValues changes since the cell values in the fields
    // are now loaded.

    changedKeys.push(WatchableTableKeys.cellValues);
    return changedKeys;
  }
  /** */


  unloadCellValuesInFieldIds(fieldIds) {
    const fieldIdsWithZeroRetainCount = [];

    for (const fieldId of fieldIds) {
      let fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
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

    if (fieldIdsWithZeroRetainCount.length > 0) {
      // Don't unload immediately. Wait a while in case something else
      // requests the data, so we can avoid going back to liveapp or
      // the network.
      (0, _setTimeout2.default)(() => {
        // Make sure the retain count is still zero, since it may
        // have been incremented before the timeout fired.
        const fieldIdsToUnload = (0, _filter.default)(fieldIdsWithZeroRetainCount).call(fieldIdsWithZeroRetainCount, fieldId => {
          return this._cellValuesRetainCountByFieldId[fieldId] === 0;
        });

        if (fieldIdsToUnload.length > 0) {
          // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
          // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
          for (const fieldId of fieldIdsToUnload) {
            this._areCellValuesLoadedByFieldId[fieldId] = false;
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

  async _loadDataAsync() {
    const tableData = await this._airtableInterface.fetchAndSubscribeToTableDataAsync(this._id);
    this._data.recordsById = tableData.recordsById;
    const changedKeys = [WatchableTableKeys.records, WatchableTableKeys.recordIds, WatchableTableKeys.cellValues];

    for (const fieldId of (0, _keys.default)(this._data.fieldsById)) {
      changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
    }

    return changedKeys;
  }

  _unloadData() {
    this._airtableInterface.unsubscribeFromTableData(this._id);

    this._afterUnloadDataOrUnloadCellValuesInFieldIds();
  }

  _afterUnloadDataOrUnloadCellValuesInFieldIds(unloadedFieldIds) {
    const areAnyFieldsLoaded = this.isDataLoaded || (0, _some.default)(u).call(u, (0, _values.default)(u).call(u, this._areCellValuesLoadedByFieldId), isLoaded => isLoaded);

    if (!this.isDeleted) {
      if (!areAnyFieldsLoaded) {
        this._data.recordsById = undefined;
      } else if (!this.isDataLoaded) {
        let fieldIdsToClear;

        if (unloadedFieldIds) {
          // Specific fields were unloaded, so clear out the cell values for those fields.
          fieldIdsToClear = unloadedFieldIds;
        } else {
          // The entire table was unloaded, but some individual fields are still loaded.
          // We need to clear out the cell values of every field that was unloaded.
          // This is kind of slow, but hopefully uncommon.
          const fieldIds = (0, _keys.default)(this._data.fieldsById);
          fieldIdsToClear = (0, _filter.default)(fieldIds).call(fieldIds, fieldId => !this._areCellValuesLoadedByFieldId[fieldId]);
        }

        u.unsafeEach(this._data.recordsById, recordObj => {
          for (let i = 0; i < fieldIdsToClear.length; i++) {
            const fieldId = fieldIdsToClear[i];

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
    let field;

    if (fieldOrFieldIdOrFieldName instanceof _field.default) {
      field = fieldOrFieldIdOrFieldName;
    } else {
      field = this.getFieldById(fieldOrFieldIdOrFieldName) || this.getFieldByName(fieldOrFieldIdOrFieldName);
    }

    return field;
  }

  __getViewMatching(viewOrViewIdOrViewName) {
    let view;

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


      for (const [viewId, viewModel] of (0, _entries.default)(u).call(u, this._viewModelsById)) {
        if (viewModel.isDeleted) {
          delete this._viewModelsById[viewId];
        }
      }
    }

    if (dirtyPaths.viewsById) {
      for (const [viewId, dirtyViewPaths] of (0, _entries.default)(u).call(u, dirtyPaths.viewsById)) {
        // Directly access from _viewModelsById to avoid creating
        // a view model if it doesn't already exist. If it doesn't exist,
        // nothing can be subscribed to any events on it.
        const view = this._viewModelsById[viewId];

        if (view) {
          view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);
        }
      }
    }

    if (dirtyPaths.fieldsById) {
      // Since tables don't have a field order, need to detect if a field
      // was created or deleted and trigger onChange for fields.
      const addedFieldIds = [];
      const removedFieldIds = [];

      for (const [fieldId, dirtyFieldPaths] of (0, _entries.default)(u).call(u, dirtyPaths.fieldsById)) {
        if (dirtyFieldPaths._isDirty) {
          // If the entire field is dirty, it was either created or deleted.
          if (u.has(this._data.fieldsById, fieldId)) {
            addedFieldIds.push(fieldId);
          } else {
            removedFieldIds.push(fieldId);
            const fieldModel = this._fieldModelsById[fieldId];

            if (fieldModel) {
              // Remove the Field model if it was deleted.
              delete this._fieldModelsById[fieldId];
            }
          }
        } else {
          // Directly access from _fieldModelsById to avoid creating
          // a field model if it doesn't already exist. If it doesn't exist,
          // nothing can be subscribed to any events on it.
          const field = this._fieldModelsById[fieldId];

          if (field) {
            field.__triggerOnChangeForDirtyPaths(dirtyFieldPaths);
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
      const dirtyFieldIdsSet = {};
      const addedRecordIds = [];
      const removedRecordIds = [];

      for (const [recordId, dirtyRecordPaths] of (0, _entries.default)(u).call(u, dirtyPaths.recordsById)) {
        if (dirtyRecordPaths._isDirty) {
          // If the entire record is dirty, it was either created or deleted.
          (0, _invariant.default)(this._data.recordsById, 'No recordsById');

          if (u.has(this._data.recordsById, recordId)) {
            addedRecordIds.push(recordId);
          } else {
            removedRecordIds.push(recordId);
            const recordModel = this._recordModelsById[recordId];

            if (recordModel) {
              // Remove the Record model if it was deleted.
              delete this._recordModelsById[recordId];
            }
          }
        } else {
          const recordModel = this._recordModelsById[recordId];

          if (recordModel) {
            recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
          }
        }

        const {
          cellValuesByFieldId
        } = dirtyRecordPaths;

        if (cellValuesByFieldId) {
          for (const fieldId of (0, _keys2.default)(u).call(u, cellValuesByFieldId)) {
            dirtyFieldIdsSet[fieldId] = true;
          }
        }
      } // Now that we've composed our created/deleted record ids arrays, let's fire
      // the records onChange event if any records were created or deleted.


      if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
        this._onChange(WatchableTableKeys.records, {
          addedRecordIds,
          removedRecordIds
        });

        this._onChange(WatchableTableKeys.recordIds, {
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


      const fieldIds = (0, _freeze.default)((0, _keys.default)(dirtyFieldIdsSet));
      const recordIds = (0, _freeze.default)((0, _keys.default)(dirtyPaths.recordsById));

      if (fieldIds.length > 0 && recordIds.length > 0) {
        this._onChange(WatchableTableKeys.cellValues, {
          recordIds,
          fieldIds
        });
      }

      for (const fieldId of fieldIds) {
        this._onChange(WatchableCellValuesInFieldKeyPrefix + fieldId, recordIds, fieldId);
      }
    }
  }

  __getFieldNamesById() {
    if (!this._cachedFieldNamesById) {
      const fieldNamesById = {};

      for (const [fieldId, fieldData] of (0, _entries.default)(u).call(u, this._data.fieldsById)) {
        fieldNamesById[fieldId] = fieldData.name;
      }

      this._cachedFieldNamesById = fieldNamesById;
    }

    return this._cachedFieldNamesById;
  }

}

(0, _defineProperty2.default)(Table, "shouldLoadAllCellValuesForRecords", false);
(0, _defineProperty2.default)(Table, "_className", 'Table');
var _default = Table;
exports.default = _default;