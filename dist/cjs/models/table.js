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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvdGFibGUuanMiXSwibmFtZXMiOlsidSIsIndpbmRvdyIsIl9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUiLCJoeXBlcklkIiwicGVybWlzc2lvbkhlbHBlcnMiLCJjbGllbnRTZXJ2ZXJTaGFyZWRDb25maWdTZXR0aW5ncyIsImFpcnRhYmxlVXJscyIsIldhdGNoYWJsZVRhYmxlS2V5cyIsIm5hbWUiLCJhY3RpdmVWaWV3Iiwidmlld3MiLCJmaWVsZHMiLCJyZWNvcmRzIiwicmVjb3JkSWRzIiwiY2VsbFZhbHVlcyIsIldhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4IiwiVGFibGUiLCJBYnN0cmFjdE1vZGVsV2l0aEFzeW5jRGF0YSIsIl9pc1dhdGNoYWJsZUtleSIsImtleSIsInV0aWxzIiwiaXNFbnVtVmFsdWUiLCJfc2hvdWxkTG9hZERhdGFGb3JLZXkiLCJzaG91bGRMb2FkQWxsQ2VsbFZhbHVlc0ZvclJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImJhc2VEYXRhIiwicGFyZW50QmFzZSIsInRhYmxlSWQiLCJhaXJ0YWJsZUludGVyZmFjZSIsIl9wYXJlbnRCYXNlIiwiX3ZpZXdNb2RlbHNCeUlkIiwiX2ZpZWxkTW9kZWxzQnlJZCIsIl9yZWNvcmRNb2RlbHNCeUlkIiwiX2NhY2hlZEZpZWxkTmFtZXNCeUlkIiwiX3ByaW1hcnlGaWVsZElkIiwiX2RhdGEiLCJwcmltYXJ5RmllbGRJZCIsIl9haXJ0YWJsZUludGVyZmFjZSIsIl9hcmVDZWxsVmFsdWVzTG9hZGVkQnlGaWVsZElkIiwiX3BlbmRpbmdDZWxsVmFsdWVzTG9hZFByb21pc2VCeUZpZWxkSWQiLCJfY2VsbFZhbHVlc1JldGFpbkNvdW50QnlGaWVsZElkIiwid2F0Y2giLCJrZXlzIiwiY2FsbGJhY2siLCJjb250ZXh0IiwidmFsaWRLZXlzIiwiZmllbGRJZHNUb0xvYWQiLCJfZ2V0RmllbGRJZHNUb0xvYWRGcm9tV2F0Y2hhYmxlS2V5cyIsImxlbmd0aCIsImZpcmVBbmRGb3JnZXRQcm9taXNlIiwibG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzQXN5bmMiLCJ1bndhdGNoIiwiZmllbGRJZHNUb1VubG9hZCIsInVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzIiwiZmllbGRJZCIsInN1YnN0cmluZyIsInB1c2giLCJfZ2V0RmllbGRJZEZvckNhdXNpbmdSZWNvcmRNZXRhZGF0YVRvTG9hZCIsIl9kYXRhT3JOdWxsSWZEZWxldGVkIiwiX2Jhc2VEYXRhIiwidGFibGVzQnlJZCIsIl9pZCIsInVybCIsImdldFVybEZvclRhYmxlIiwiaWQiLCJhYnNvbHV0ZSIsInByaW1hcnlGaWVsZCIsImdldEZpZWxkQnlJZCIsImZpZWxkc0J5SWQiLCJmaWVsZCIsIkZpZWxkIiwiZ2V0RmllbGRCeU5hbWUiLCJmaWVsZE5hbWUiLCJmaWVsZERhdGEiLCJhY3RpdmVWaWV3SWQiLCJnZXRWaWV3QnlJZCIsInZpZXdPcmRlciIsInZpZXdJZCIsInZpZXciLCJ2aWV3c0J5SWQiLCJWaWV3IiwiZ2V0Vmlld0J5TmFtZSIsInZpZXdOYW1lIiwidmlld0RhdGEiLCJzZWxlY3QiLCJvcHRzIiwiVGFibGVPclZpZXdRdWVyeVJlc3VsdCIsIl9fY3JlYXRlT3JSZXVzZVF1ZXJ5UmVzdWx0IiwicmVjb3Jkc0J5SWQiLCJyZWNvcmRJZCIsInJlY29yZCIsImdldFJlY29yZEJ5SWQiLCJyZWNvcmRDb3VudCIsInJlY29yZExpbWl0IiwiTUFYX05VTV9ST1dTX1BFUl9UQUJMRSIsInJlbWFpbmluZ1JlY29yZExpbWl0IiwiUmVjb3JkIiwiY2FuU2V0Q2VsbFZhbHVlcyIsImNlbGxWYWx1ZXNCeVJlY29yZElkVGhlbkZpZWxkSWRPckZpZWxkTmFtZSIsImJhc2UiLCJjYW4iLCJfX3Jhd1Blcm1pc3Npb25MZXZlbCIsIlBlcm1pc3Npb25MZXZlbHMiLCJFRElUIiwic2V0Q2VsbFZhbHVlcyIsImlzRGVsZXRlZCIsIkVycm9yIiwiY2hhbmdlcyIsImNlbGxWYWx1ZXNCeVJlY29yZElkVGhlbkZpZWxkSWQiLCJjZWxsVmFsdWVzQnlGaWVsZElkT3JGaWVsZE5hbWUiLCJmaWVsZElkT3JGaWVsZE5hbWUiLCJwdWJsaWNDZWxsVmFsdWUiLCJfX2dldEZpZWxkTWF0Y2hpbmciLCJjdXJyZW50UHVibGljQ2VsbFZhbHVlIiwiZ2V0Q2VsbFZhbHVlIiwidmFsaWRhdGlvblJlc3VsdCIsImNlbGxWYWx1ZVV0aWxzIiwidmFsaWRhdGVQdWJsaWNDZWxsVmFsdWVGb3JVcGRhdGUiLCJpc1ZhbGlkIiwicmVhc29uIiwibm9ybWFsaXplZENlbGxWYWx1ZSIsIm5vcm1hbGl6ZVB1YmxpY0NlbGxWYWx1ZUZvclVwZGF0ZSIsInBhdGgiLCJ2YWx1ZSIsIl9fYXBwbHlDaGFuZ2VzIiwiY29tcGxldGlvblByb21pc2UiLCJzZXRDZWxsVmFsdWVzQXN5bmMiLCJjb21wbGV0aW9uIiwiY2FuQ3JlYXRlUmVjb3JkIiwiY2FuQ3JlYXRlUmVjb3JkcyIsImNyZWF0ZVJlY29yZCIsInJlY29yZERlZiIsIndyaXRlQWN0aW9uIiwiY3JlYXRlUmVjb3JkcyIsInJlY29yZERlZnNPck51bWJlck9mUmVjb3JkcyIsImlzRGF0YUxvYWRlZCIsInJlY29yZERlZnMiLCJudW1FbXB0eVJlY29yZHNUb0NyZWF0ZSIsImkiLCJwYXJzZWRSZWNvcmREZWZzIiwiY2VsbFZhbHVlc0J5RmllbGRJZCIsImNlbGxWYWx1ZSIsImdlbmVyYXRlUm93SWQiLCJwYXJzZWRSZWNvcmREZWYiLCJjb21tZW50Q291bnQiLCJjcmVhdGVkVGltZSIsIkRhdGUiLCJ0b0pTT04iLCJfX2dlbmVyYXRlQ2hhbmdlc0ZvclBhcmVudFRhYmxlQWRkTXVsdGlwbGVSZWNvcmRzIiwiY3JlYXRlUmVjb3Jkc0FzeW5jIiwicmVjb3JkTW9kZWxzIiwicmVjb3JkTW9kZWwiLCJjYW5EZWxldGVSZWNvcmQiLCJjYW5EZWxldGVSZWNvcmRzIiwiZGVsZXRlUmVjb3JkIiwiZGVsZXRlUmVjb3JkcyIsInVuZGVmaW5lZCIsIl9fZ2VuZXJhdGVDaGFuZ2VzRm9yUGFyZW50VGFibGVEZWxldGVNdWx0aXBsZVJlY29yZHMiLCJkZWxldGVSZWNvcmRzQXN5bmMiLCJnZXRGaXJzdFZpZXdPZlR5cGUiLCJhbGxvd2VkVmlld1R5cGVzIiwidHlwZSIsImdldERlZmF1bHRWaWV3T2ZUeXBlIiwiZ2V0RGVmYXVsdENlbGxWYWx1ZXNCeUZpZWxkSWRBc3luYyIsImZldGNoRGVmYXVsdENlbGxWYWx1ZXNCeUZpZWxkSWRBc3luYyIsImlzUmVjb3JkTWV0YWRhdGFMb2FkZWQiLCJsb2FkUmVjb3JkTWV0YWRhdGFBc3luYyIsInVubG9hZFJlY29yZE1ldGFkYXRhIiwiYXJlQ2VsbFZhbHVlc0xvYWRlZEZvckZpZWxkSWQiLCJmaWVsZElkcyIsImZpZWxkSWRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nIiwicGVuZGluZ0xvYWRQcm9taXNlcyIsInBlbmRpbmdMb2FkUHJvbWlzZSIsImxvYWRGaWVsZHNXaGljaEFyZU5vdEFscmVhZHlMb2FkZWRPckxvYWRpbmdQcm9taXNlIiwiX2xvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jIiwidGhlbiIsImNoYW5nZWRLZXlzIiwiX29uQ2hhbmdlIiwiYWxsIiwibmV3UmVjb3Jkc0J5SWQiLCJmZXRjaEFuZFN1YnNjcmliZVRvQ2VsbFZhbHVlc0luRmllbGRzQXN5bmMiLCJleGlzdGluZ1JlY29yZHNCeUlkIiwidW5zYWZlRWFjaCIsIm5ld1JlY29yZE9iaiIsImhhcyIsImV4aXN0aW5nUmVjb3JkT2JqIiwiZXhpc3RpbmdDZWxsVmFsdWVzQnlGaWVsZElkIiwiZmllbGRJZHNXaXRoWmVyb1JldGFpbkNvdW50IiwiZmllbGRSZXRhaW5Db3VudCIsImNvbnNvbGUiLCJsb2ciLCJfdW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHMiLCJfX0RBVEFfVU5MT0FEX0RFTEFZX01TIiwidW5zdWJzY3JpYmVGcm9tQ2VsbFZhbHVlc0luRmllbGRzIiwiX2FmdGVyVW5sb2FkRGF0YU9yVW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHMiLCJfbG9hZERhdGFBc3luYyIsInRhYmxlRGF0YSIsImZldGNoQW5kU3Vic2NyaWJlVG9UYWJsZURhdGFBc3luYyIsIl91bmxvYWREYXRhIiwidW5zdWJzY3JpYmVGcm9tVGFibGVEYXRhIiwidW5sb2FkZWRGaWVsZElkcyIsImFyZUFueUZpZWxkc0xvYWRlZCIsImlzTG9hZGVkIiwiZmllbGRJZHNUb0NsZWFyIiwicmVjb3JkT2JqIiwiZmllbGRPckZpZWxkSWRPckZpZWxkTmFtZSIsIl9fZ2V0Vmlld01hdGNoaW5nIiwidmlld09yVmlld0lkT3JWaWV3TmFtZSIsIl9fdHJpZ2dlck9uQ2hhbmdlRm9yRGlydHlQYXRocyIsImRpcnR5UGF0aHMiLCJ2aWV3TW9kZWwiLCJkaXJ0eVZpZXdQYXRocyIsImFkZGVkRmllbGRJZHMiLCJyZW1vdmVkRmllbGRJZHMiLCJkaXJ0eUZpZWxkUGF0aHMiLCJfaXNEaXJ0eSIsImZpZWxkTW9kZWwiLCJkaXJ0eUZpZWxkSWRzU2V0IiwiYWRkZWRSZWNvcmRJZHMiLCJyZW1vdmVkUmVjb3JkSWRzIiwiZGlydHlSZWNvcmRQYXRocyIsIl9fZ2V0RmllbGROYW1lc0J5SWQiLCJmaWVsZE5hbWVzQnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBRUEsTUFBTTtBQUFDQSxFQUFBQTtBQUFELElBQU1DLE1BQU0sQ0FBQ0Msa0NBQVAsQ0FBMEMseUJBQTFDLENBQVo7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHRixNQUFNLENBQUNDLGtDQUFQLENBQTBDLCtCQUExQyxDQUFoQjs7QUFDQSxNQUFNRSxpQkFBaUIsR0FBR0gsTUFBTSxDQUFDQyxrQ0FBUCxDQUN0QixxREFEc0IsQ0FBMUI7O0FBR0EsTUFBTUcsZ0NBQWdDLEdBQUdKLE1BQU0sQ0FBQ0Msa0NBQVAsQ0FDckMsMkRBRHFDLENBQXpDOztBQUdBLE1BQU1JLFlBQVksR0FBR0wsTUFBTSxDQUFDQyxrQ0FBUCxDQUNqQixvQ0FEaUIsQ0FBckIsQyxDQUlBO0FBQ0E7OztBQUNBLE1BQU1LLGtCQUFrQixHQUFHO0FBQ3ZCQyxFQUFBQSxJQUFJLEVBQUUsTUFEaUI7QUFFdkJDLEVBQUFBLFVBQVUsRUFBRSxZQUZXO0FBR3ZCQyxFQUFBQSxLQUFLLEVBQUUsT0FIZ0I7QUFJdkJDLEVBQUFBLE1BQU0sRUFBRSxRQUplO0FBS3ZCQyxFQUFBQSxPQUFPLEVBQUUsU0FMYztBQU12QkMsRUFBQUEsU0FBUyxFQUFFLFdBTlk7QUFPdkI7QUFDQTtBQUNBQyxFQUFBQSxVQUFVLEVBQUU7QUFUVyxDQUEzQjtBQVdBLE1BQU1DLG1DQUFtQyxHQUFHLG9CQUE1QyxDLENBQ0E7QUFDQTs7QUFHQTtBQUNBLE1BQU1DLEtBQU4sU0FBb0JDLHVDQUFwQixDQUE2RTtBQUN6RTtBQUNBO0FBSUEsU0FBT0MsZUFBUCxDQUF1QkMsR0FBdkIsRUFBNkM7QUFDekMsV0FDSUMsdUJBQU1DLFdBQU4sQ0FBa0JkLGtCQUFsQixFQUFzQ1ksR0FBdEMsS0FDQSx5QkFBQW5CLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQVltQixHQUFaLEVBQWlCSixtQ0FBakIsQ0FGTDtBQUlIOztBQUNELFNBQU9PLHFCQUFQLENBQTZCSCxHQUE3QixFQUE4RDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSUgsS0FBSyxDQUFDTyxpQ0FBVixFQUE2QztBQUN6QyxhQUNJSixHQUFHLEtBQUtaLGtCQUFrQixDQUFDSyxPQUEzQixJQUNBTyxHQUFHLEtBQUtaLGtCQUFrQixDQUFDTSxTQUQzQixJQUVBTSxHQUFHLEtBQUtaLGtCQUFrQixDQUFDTyxVQUgvQjtBQUtILEtBTkQsTUFNTztBQUNILGFBQU9LLEdBQUcsS0FBS1osa0JBQWtCLENBQUNPLFVBQWxDO0FBQ0g7QUFDSjs7QUFrQkRVLEVBQUFBLFdBQVcsQ0FDUEMsUUFETyxFQUVQQyxVQUZPLEVBR1BDLE9BSE8sRUFJUEMsaUJBSk8sRUFLVDtBQUNFLFVBQU1ILFFBQU4sRUFBZ0JFLE9BQWhCO0FBRUEsU0FBS0UsV0FBTCxHQUFtQkgsVUFBbkI7QUFDQSxTQUFLSSxlQUFMLEdBQXVCLEVBQXZCLENBSkYsQ0FJNkI7O0FBQzNCLFNBQUtDLGdCQUFMLEdBQXdCLEVBQXhCLENBTEYsQ0FLOEI7O0FBQzVCLFNBQUtDLGlCQUFMLEdBQXlCLEVBQXpCLENBTkYsQ0FNK0I7O0FBQzdCLFNBQUtDLHFCQUFMLEdBQTZCLElBQTdCLENBUEYsQ0FTRTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLEtBQUtDLEtBQUwsQ0FBV0MsY0FBbEM7QUFFQSxTQUFLQyxrQkFBTCxHQUEwQlQsaUJBQTFCO0FBRUEsU0FBS1UsNkJBQUwsR0FBcUMsRUFBckM7QUFDQSxTQUFLQyxzQ0FBTCxHQUE4QyxFQUE5QztBQUNBLFNBQUtDLCtCQUFMLEdBQXVDLEVBQXZDO0FBRUEsdUJBQVksSUFBWjtBQUNIOztBQUNEQyxFQUFBQSxLQUFLLENBQ0RDLElBREMsRUFFREMsUUFGQyxFQUdEQyxPQUhDLEVBSXVCO0FBQ3hCLFVBQU1DLFNBQVMsR0FBRyxNQUFNSixLQUFOLENBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQTRCQyxPQUE1QixDQUFsQjs7QUFDQSxVQUFNRSxjQUFjLEdBQUcsS0FBS0MsbUNBQUwsQ0FBeUNGLFNBQXpDLENBQXZCOztBQUNBLFFBQUlDLGNBQWMsQ0FBQ0UsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUFBOztBQUMzQjVCLDZCQUFNNkIsb0JBQU4sQ0FDSSxtQ0FBS0MsNkJBQUwsaUJBQXdDLElBQXhDLEVBQThDSixjQUE5QyxDQURKO0FBR0g7O0FBQ0QsV0FBT0QsU0FBUDtBQUNIOztBQUNETSxFQUFBQSxPQUFPLENBQ0hULElBREcsRUFFSEMsUUFGRyxFQUdIQyxPQUhHLEVBSXFCO0FBQ3hCLFVBQU1DLFNBQVMsR0FBRyxNQUFNTSxPQUFOLENBQWNULElBQWQsRUFBb0JDLFFBQXBCLEVBQThCQyxPQUE5QixDQUFsQjs7QUFDQSxVQUFNUSxnQkFBZ0IsR0FBRyxLQUFLTCxtQ0FBTCxDQUF5Q0YsU0FBekMsQ0FBekI7O0FBQ0EsUUFBSU8sZ0JBQWdCLENBQUNKLE1BQWpCLEdBQTBCLENBQTlCLEVBQWlDO0FBQzdCLFdBQUtLLDBCQUFMLENBQWdDRCxnQkFBaEM7QUFDSDs7QUFDRCxXQUFPUCxTQUFQO0FBQ0g7O0FBQ0RFLEVBQUFBLG1DQUFtQyxDQUFDTCxJQUFELEVBQWdEO0FBQy9FLFVBQU1JLGNBQWMsR0FBRyxFQUF2Qjs7QUFDQSxTQUFLLE1BQU0zQixHQUFYLElBQWtCdUIsSUFBbEIsRUFBd0I7QUFDcEIsVUFBSSx5QkFBQTFDLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQVltQixHQUFaLEVBQWlCSixtQ0FBakIsQ0FBTCxFQUE0RDtBQUN4RCxjQUFNdUMsT0FBTyxHQUFHbkMsR0FBRyxDQUFDb0MsU0FBSixDQUFjeEMsbUNBQW1DLENBQUNpQyxNQUFsRCxDQUFoQjtBQUNBRixRQUFBQSxjQUFjLENBQUNVLElBQWYsQ0FBb0JGLE9BQXBCO0FBQ0gsT0FIRCxNQUdPLElBQUksQ0FBQ3RDLEtBQUssQ0FBQ08saUNBQVgsRUFBOEM7QUFDakQsWUFBSUosR0FBRyxLQUFLWixrQkFBa0IsQ0FBQ0ssT0FBM0IsSUFBc0NPLEdBQUcsS0FBS1osa0JBQWtCLENBQUNNLFNBQXJFLEVBQWdGO0FBQzVFaUMsVUFBQUEsY0FBYyxDQUFDVSxJQUFmLENBQW9CLEtBQUtDLHlDQUFMLEVBQXBCO0FBQ0g7QUFDSjtBQUNKOztBQUNELFdBQU9YLGNBQVA7QUFDSDs7QUFDRCxNQUFJWSxvQkFBSixHQUE2QztBQUN6QyxXQUFPLEtBQUtDLFNBQUwsQ0FBZUMsVUFBZixDQUEwQixLQUFLQyxHQUEvQixLQUF1QyxJQUE5QztBQUNIO0FBQ0Q7OztBQUNBLE1BQUluQyxVQUFKLEdBQXVCO0FBQ25CLFdBQU8sS0FBS0csV0FBWjtBQUNIO0FBQ0Q7OztBQUNBLE1BQUlyQixJQUFKLEdBQW1CO0FBQ2YsV0FBTyxLQUFLMkIsS0FBTCxDQUFXM0IsSUFBbEI7QUFDSDtBQUNEOzs7QUFDQSxNQUFJc0QsR0FBSixHQUFrQjtBQUNkLFdBQU94RCxZQUFZLENBQUN5RCxjQUFiLENBQTRCLEtBQUtDLEVBQWpDLEVBQXFDO0FBQ3hDQyxNQUFBQSxRQUFRLEVBQUU7QUFEOEIsS0FBckMsQ0FBUDtBQUdIO0FBQ0Q7Ozs7OztBQUlBLE1BQUlDLFlBQUosR0FBMEI7QUFDdEIsVUFBTUEsWUFBWSxHQUFHLEtBQUtDLFlBQUwsQ0FBa0IsS0FBS2hDLEtBQUwsQ0FBV0MsY0FBN0IsQ0FBckI7QUFDQSw0QkFBVThCLFlBQVYsRUFBd0Isa0JBQXhCO0FBQ0EsV0FBT0EsWUFBUDtBQUNIO0FBQ0Q7Ozs7Ozs7O0FBTUEsTUFBSXZELE1BQUosR0FBMkI7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsVUFBTUEsTUFBTSxHQUFHLEVBQWY7O0FBQ0EsU0FBSyxNQUFNMkMsT0FBWCxJQUFzQixvQkFBQXRELENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQU0sS0FBS21DLEtBQUwsQ0FBV2lDLFVBQWpCLENBQXZCLEVBQXFEO0FBQ2pELFlBQU1DLEtBQUssR0FBRyxLQUFLRixZQUFMLENBQWtCYixPQUFsQixDQUFkO0FBQ0EsOEJBQVVlLEtBQVYsRUFBaUIsbUJBQW1CZixPQUFwQztBQUNBM0MsTUFBQUEsTUFBTSxDQUFDNkMsSUFBUCxDQUFZYSxLQUFaO0FBQ0g7O0FBQ0QsV0FBTzFELE1BQVA7QUFDSDtBQUNEOzs7QUFDQXdELEVBQUFBLFlBQVksQ0FBQ2IsT0FBRCxFQUFnQztBQUN4QyxRQUFJLENBQUMsS0FBS25CLEtBQUwsQ0FBV2lDLFVBQVgsQ0FBc0JkLE9BQXRCLENBQUwsRUFBcUM7QUFDakMsYUFBTyxJQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsVUFBSSxDQUFDLEtBQUt2QixnQkFBTCxDQUFzQnVCLE9BQXRCLENBQUwsRUFBcUM7QUFDakMsYUFBS3ZCLGdCQUFMLENBQXNCdUIsT0FBdEIsSUFBaUMsSUFBSWdCLGNBQUosQ0FBVSxLQUFLWCxTQUFmLEVBQTBCLElBQTFCLEVBQWdDTCxPQUFoQyxDQUFqQztBQUNIOztBQUNELGFBQU8sS0FBS3ZCLGdCQUFMLENBQXNCdUIsT0FBdEIsQ0FBUDtBQUNIO0FBQ0o7QUFDRDs7O0FBQ0FpQixFQUFBQSxjQUFjLENBQUNDLFNBQUQsRUFBa0M7QUFDNUMsU0FBSyxNQUFNLENBQUNsQixPQUFELEVBQVVtQixTQUFWLENBQVgsSUFBbUMsc0JBQUF6RSxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFTLEtBQUttQyxLQUFMLENBQVdpQyxVQUFwQixDQUFwQyxFQUFxRTtBQUNqRSxVQUFJSyxTQUFTLENBQUNqRSxJQUFWLEtBQW1CZ0UsU0FBdkIsRUFBa0M7QUFDOUIsZUFBTyxLQUFLTCxZQUFMLENBQWtCYixPQUFsQixDQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLElBQVA7QUFDSDtBQUNEOzs7Ozs7O0FBS0EsTUFBSTdDLFVBQUosR0FBOEI7QUFDMUIsVUFBTTtBQUFDaUUsTUFBQUE7QUFBRCxRQUFpQixLQUFLdkMsS0FBNUI7QUFDQSxXQUFPdUMsWUFBWSxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJELFlBQWpCLENBQUgsR0FBb0MsSUFBdkQ7QUFDSDtBQUNEOzs7Ozs7QUFJQSxNQUFJaEUsS0FBSixHQUF5QjtBQUFBOztBQUNyQjtBQUNBLFVBQU1BLEtBQUssR0FBRyxFQUFkO0FBQ0EsMkNBQUt5QixLQUFMLENBQVd5QyxTQUFYLGtCQUE2QkMsTUFBTSxJQUFJO0FBQ25DLFlBQU1DLElBQUksR0FBRyxLQUFLSCxXQUFMLENBQWlCRSxNQUFqQixDQUFiO0FBQ0EsOEJBQVVDLElBQVYsRUFBZ0IsbUNBQWhCO0FBQ0FwRSxNQUFBQSxLQUFLLENBQUM4QyxJQUFOLENBQVdzQixJQUFYO0FBQ0gsS0FKRDtBQUtBLFdBQU9wRSxLQUFQO0FBQ0g7QUFDRDs7O0FBQ0FpRSxFQUFBQSxXQUFXLENBQUNFLE1BQUQsRUFBOEI7QUFDckMsUUFBSSxDQUFDLEtBQUsxQyxLQUFMLENBQVc0QyxTQUFYLENBQXFCRixNQUFyQixDQUFMLEVBQW1DO0FBQy9CLGFBQU8sSUFBUDtBQUNILEtBRkQsTUFFTztBQUNILFVBQUksQ0FBQyxLQUFLL0MsZUFBTCxDQUFxQitDLE1BQXJCLENBQUwsRUFBbUM7QUFDL0IsYUFBSy9DLGVBQUwsQ0FBcUIrQyxNQUFyQixJQUErQixJQUFJRyxhQUFKLENBQzNCLEtBQUtyQixTQURzQixFQUUzQixJQUYyQixFQUczQmtCLE1BSDJCLEVBSTNCLEtBQUt4QyxrQkFKc0IsQ0FBL0I7QUFNSDs7QUFDRCxhQUFPLEtBQUtQLGVBQUwsQ0FBcUIrQyxNQUFyQixDQUFQO0FBQ0g7QUFDSjtBQUNEOzs7QUFDQUksRUFBQUEsYUFBYSxDQUFDQyxRQUFELEVBQWdDO0FBQ3pDLFNBQUssTUFBTSxDQUFDTCxNQUFELEVBQVNNLFFBQVQsQ0FBWCxJQUFpQyxzQkFBQW5GLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQVMsS0FBS21DLEtBQUwsQ0FBVzRDLFNBQXBCLENBQWxDLEVBQWtFO0FBQzlELFVBQUlJLFFBQVEsQ0FBQzNFLElBQVQsS0FBa0IwRSxRQUF0QixFQUFnQztBQUM1QixlQUFPLEtBQUtQLFdBQUwsQ0FBaUJFLE1BQWpCLENBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sSUFBUDtBQUNIO0FBQ0Q7OztBQUNBTyxFQUFBQSxNQUFNLENBQUNDLElBQUQsRUFBaUQ7QUFDbkQsV0FBT0Msb0NBQXVCQywwQkFBdkIsQ0FBa0QsSUFBbEQsRUFBd0RGLElBQUksSUFBSSxFQUFoRSxDQUFQO0FBQ0g7QUFDRDs7Ozs7O0FBSUEsTUFBSXpFLE9BQUosR0FBNkI7QUFBQTs7QUFDekIsVUFBTTRFLFdBQVcsR0FBRyxLQUFLckQsS0FBTCxDQUFXcUQsV0FBL0I7QUFDQSw0QkFBVUEsV0FBVixFQUF1QiwrQkFBdkI7QUFDQSxVQUFNNUUsT0FBTyxHQUFHLGlEQUFZNEUsV0FBWixtQkFBNkJDLFFBQVEsSUFBSTtBQUNyRCxZQUFNQyxNQUFNLEdBQUcsS0FBS0MsYUFBTCxDQUFtQkYsUUFBbkIsQ0FBZjtBQUNBLDhCQUFVQyxNQUFWLEVBQWtCLFFBQWxCO0FBQ0EsYUFBT0EsTUFBUDtBQUNILEtBSmUsQ0FBaEI7QUFLQSxXQUFPOUUsT0FBUDtBQUNIO0FBQ0Q7Ozs7OztBQUlBLE1BQUlDLFNBQUosR0FBK0I7QUFDM0IsVUFBTTJFLFdBQVcsR0FBRyxLQUFLckQsS0FBTCxDQUFXcUQsV0FBL0I7QUFDQSw0QkFBVUEsV0FBVixFQUF1QiwrQkFBdkI7QUFDQSxXQUFPLG1CQUFZQSxXQUFaLENBQVA7QUFDSDtBQUNEOzs7QUFDQSxNQUFJSSxXQUFKLEdBQTBCO0FBQ3RCLFdBQU8sS0FBSy9FLFNBQUwsQ0FBZW1DLE1BQXRCO0FBQ0g7QUFDRDs7O0FBQ0EsTUFBSTZDLFdBQUosR0FBMEI7QUFDdEIsV0FBT3hGLGdDQUFnQyxDQUFDeUYsc0JBQXhDO0FBQ0g7QUFDRDs7O0FBQ0EsTUFBSUMsb0JBQUosR0FBbUM7QUFDL0IsV0FBTyxLQUFLRixXQUFMLEdBQW1CLEtBQUtELFdBQS9CO0FBQ0g7QUFDRDs7O0FBQ0FELEVBQUFBLGFBQWEsQ0FBQ0YsUUFBRCxFQUFrQztBQUMzQyxVQUFNRCxXQUFXLEdBQUcsS0FBS3JELEtBQUwsQ0FBV3FELFdBQS9CO0FBQ0EsNEJBQVVBLFdBQVYsRUFBdUIsK0JBQXZCO0FBQ0EsNEJBQVUsT0FBT0MsUUFBUCxLQUFvQixRQUE5QixFQUF3QyxnQ0FBeEM7O0FBRUEsUUFBSSxDQUFDRCxXQUFXLENBQUNDLFFBQUQsQ0FBaEIsRUFBNEI7QUFDeEIsYUFBTyxJQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsVUFBSSxDQUFDLEtBQUt6RCxpQkFBTCxDQUF1QnlELFFBQXZCLENBQUwsRUFBdUM7QUFDbkMsYUFBS3pELGlCQUFMLENBQXVCeUQsUUFBdkIsSUFBbUMsSUFBSU8sZUFBSixDQUFXLEtBQUtyQyxTQUFoQixFQUEyQixJQUEzQixFQUFpQzhCLFFBQWpDLENBQW5DO0FBQ0g7O0FBQ0QsYUFBTyxLQUFLekQsaUJBQUwsQ0FBdUJ5RCxRQUF2QixDQUFQO0FBQ0g7QUFDSjtBQUNEOzs7QUFDQVEsRUFBQUEsZ0JBQWdCLENBQUNDLDBDQUFELEVBQTZFO0FBQ3pGO0FBQ0E7QUFDQSxVQUFNO0FBQUNDLE1BQUFBO0FBQUQsUUFBUyx1QkFBZjtBQUNBLFdBQU8vRixpQkFBaUIsQ0FBQ2dHLEdBQWxCLENBQXNCRCxJQUFJLENBQUNFLG9CQUEzQixFQUFpREMsb0NBQWlCQyxJQUFsRSxDQUFQO0FBQ0g7QUFDRDs7O0FBQ0FDLEVBQUFBLGFBQWEsQ0FBQ04sMENBQUQsRUFFcUI7QUFDOUIsUUFBSSxLQUFLTyxTQUFULEVBQW9CO0FBQ2hCLFlBQU0sSUFBSUMsS0FBSixDQUFVLHNCQUFWLENBQU47QUFDSDs7QUFDRCxRQUFJLENBQUMsS0FBS1QsZ0JBQUwsQ0FBc0JDLDBDQUF0QixDQUFMLEVBQXdFO0FBQ3BFLFlBQU0sSUFBSVEsS0FBSixDQUFVLDBEQUFWLENBQU47QUFDSDs7QUFFRCxVQUFNQyxPQUFPLEdBQUcsRUFBaEI7QUFDQSxVQUFNQywrQkFBK0IsR0FBRyxFQUF4Qzs7QUFDQSxTQUFLLE1BQU0sQ0FBQ25CLFFBQUQsRUFBV29CLDhCQUFYLENBQVgsSUFBeUQsc0JBQUE3RyxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUN0RGtHLDBDQURzRCxDQUExRCxFQUVHO0FBQ0MsWUFBTVIsTUFBTSxHQUFHLEtBQUtDLGFBQUwsQ0FBbUJGLFFBQW5CLENBQWY7O0FBQ0EsVUFBSSxDQUFDQyxNQUFMLEVBQWE7QUFDVCxjQUFNLElBQUlnQixLQUFKLENBQVUsdUJBQVYsQ0FBTjtBQUNIOztBQUVERSxNQUFBQSwrQkFBK0IsQ0FBQ25CLFFBQUQsQ0FBL0IsR0FBNEMsRUFBNUM7O0FBRUEsV0FBSyxNQUFNLENBQUNxQixrQkFBRCxFQUFxQkMsZUFBckIsQ0FBWCxJQUFvRCxzQkFBQS9HLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQ2pENkcsOEJBRGlELENBQXJELEVBRUc7QUFDQyxjQUFNeEMsS0FBSyxHQUFHLEtBQUsyQyxrQkFBTCxDQUF3QkYsa0JBQXhCLENBQWQ7O0FBQ0EsZ0NBQVV6QyxLQUFWLEVBQWlCLHNCQUFqQjtBQUNBLGdDQUFVLENBQUNBLEtBQUssQ0FBQ29DLFNBQWpCLEVBQTRCLHdCQUE1QjtBQUVBLGNBQU1RLHNCQUFzQixHQUFHdkIsTUFBTSxDQUFDd0IsWUFBUCxDQUFvQjdDLEtBQXBCLENBQS9COztBQUNBLGNBQU04QyxnQkFBZ0IsR0FBR0MsMEJBQWVDLGdDQUFmLENBQ3JCTixlQURxQixFQUVyQkUsc0JBRnFCLEVBR3JCNUMsS0FIcUIsQ0FBekI7O0FBS0EsWUFBSSxDQUFDOEMsZ0JBQWdCLENBQUNHLE9BQXRCLEVBQStCO0FBQzNCLGdCQUFNLElBQUlaLEtBQUosQ0FBVVMsZ0JBQWdCLENBQUNJLE1BQTNCLENBQU47QUFDSDs7QUFFRCxjQUFNQyxtQkFBbUIsR0FBR0osMEJBQWVLLGlDQUFmLENBQ3hCVixlQUR3QixFQUV4QjFDLEtBRndCLENBQTVCOztBQUlBc0MsUUFBQUEsT0FBTyxDQUFDbkQsSUFBUixDQUFhO0FBQ1RrRSxVQUFBQSxJQUFJLEVBQUUsQ0FDRixZQURFLEVBRUYsS0FBSzFELEVBRkgsRUFHRixhQUhFLEVBSUZ5QixRQUpFLEVBS0YscUJBTEUsRUFNRnBCLEtBQUssQ0FBQ0wsRUFOSixDQURHO0FBU1QyRCxVQUFBQSxLQUFLLEVBQUVIO0FBVEUsU0FBYjtBQVlBWixRQUFBQSwrQkFBK0IsQ0FBQ25CLFFBQUQsQ0FBL0IsQ0FBMENwQixLQUFLLENBQUNMLEVBQWhELElBQXNEd0QsbUJBQXREO0FBQ0g7QUFDSjs7QUFFRCxTQUFLOUYsVUFBTCxDQUFnQmtHLGNBQWhCLENBQStCakIsT0FBL0IsRUF6RDhCLENBMkQ5Qjs7O0FBQ0EsVUFBTWtCLGlCQUFpQixHQUFHLEtBQUt4RixrQkFBTCxDQUF3QnlGLGtCQUF4QixDQUN0QixLQUFLOUQsRUFEaUIsRUFFdEI0QywrQkFGc0IsQ0FBMUI7O0FBSUEsV0FBTztBQUNIbUIsTUFBQUEsVUFBVSxFQUFFRjtBQURULEtBQVA7QUFHSDtBQUNEOzs7QUFDQUcsRUFBQUEsZUFBZSxDQUFDbkIsOEJBQUQsRUFBc0Q7QUFDakUsV0FBTyxLQUFLb0IsZ0JBQUwsQ0FDSHBCLDhCQUE4QixHQUFHLENBQUNBLDhCQUFELENBQUgsR0FBc0MsQ0FEakUsQ0FBUDtBQUdIO0FBQ0Q7OztBQUNBcUIsRUFBQUEsWUFBWSxDQUNSckIsOEJBRFEsRUFPVjtBQUNFLFVBQU1zQixTQUFTLEdBQUd0Qiw4QkFBOEIsSUFBSSxFQUFwRDtBQUNBLFVBQU11QixXQUFXLEdBQUcsS0FBS0MsYUFBTCxDQUFtQixDQUFDRixTQUFELENBQW5CLENBQXBCO0FBQ0EsVUFBTXZILE9BQU8sR0FBR3dILFdBQVcsQ0FBQ3hILE9BQTVCO0FBQ0EsV0FBTztBQUNIbUgsTUFBQUEsVUFBVSxFQUFFSyxXQUFXLENBQUNMLFVBRHJCO0FBRUhyQyxNQUFBQSxNQUFNLEVBQUU5RSxPQUFPLENBQUMsQ0FBRDtBQUZaLEtBQVA7QUFJSDtBQUNEOzs7QUFDQXFILEVBQUFBLGdCQUFnQixDQUFDSywyQkFBRCxFQUFrRTtBQUM5RTtBQUNBO0FBQ0EsVUFBTTtBQUFDbkMsTUFBQUE7QUFBRCxRQUFTLHVCQUFmO0FBQ0EsV0FBTy9GLGlCQUFpQixDQUFDZ0csR0FBbEIsQ0FBc0JELElBQUksQ0FBQ0Usb0JBQTNCLEVBQWlEQyxvQ0FBaUJDLElBQWxFLENBQVA7QUFDSDtBQUNEOzs7QUFDQThCLEVBQUFBLGFBQWEsQ0FDVEMsMkJBRFMsRUFPWDtBQUNFLFFBQUksQ0FBQyxLQUFLTCxnQkFBTCxDQUFzQkssMkJBQXRCLENBQUwsRUFBeUQ7QUFDckQsWUFBTSxJQUFJNUIsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDSCxLQUhILENBS0U7QUFDQTs7O0FBQ0EsUUFBSSxDQUFDLEtBQUs2QixZQUFWLEVBQXdCO0FBQ3BCLFlBQU0sSUFBSTdCLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0g7O0FBRUQsUUFBSThCLFVBQUo7O0FBQ0EsUUFBSSxPQUFPRiwyQkFBUCxLQUF1QyxRQUEzQyxFQUFxRDtBQUNqRCxZQUFNRyx1QkFBdUIsR0FBR0gsMkJBQWhDO0FBQ0FFLE1BQUFBLFVBQVUsR0FBRyxFQUFiOztBQUNBLFdBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsdUJBQXBCLEVBQTZDQyxDQUFDLEVBQTlDLEVBQWtEO0FBQzlDRixRQUFBQSxVQUFVLENBQUNoRixJQUFYLENBQWdCLEVBQWhCO0FBQ0g7QUFDSixLQU5ELE1BTU87QUFDSGdGLE1BQUFBLFVBQVUsR0FBR0YsMkJBQWI7QUFDSDs7QUFFRCxRQUFJLEtBQUt2QyxvQkFBTCxHQUE0QnlDLFVBQVUsQ0FBQ3hGLE1BQTNDLEVBQW1EO0FBQy9DLFlBQU0sSUFBSTBELEtBQUosQ0FDRiw4RUFERSxDQUFOO0FBR0g7O0FBRUQsVUFBTWlDLGdCQUFnQixHQUFHLEVBQXpCO0FBQ0EsVUFBTTlILFNBQVMsR0FBRyxFQUFsQjtBQUNBLFVBQU04RixPQUFPLEdBQUcsRUFBaEI7O0FBQ0EsU0FBSyxNQUFNd0IsU0FBWCxJQUF3QkssVUFBeEIsRUFBb0M7QUFDaEMsWUFBTUksbUJBQW1CLEdBQUcsRUFBNUI7O0FBQ0EsV0FBSyxNQUFNLENBQUM5QixrQkFBRCxFQUFxQitCLFNBQXJCLENBQVgsSUFBOEMsc0JBQUE3SSxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFTbUksU0FBVCxDQUEvQyxFQUFvRTtBQUNoRSxjQUFNOUQsS0FBSyxHQUFHLEtBQUsyQyxrQkFBTCxDQUF3QkYsa0JBQXhCLENBQWQ7O0FBQ0EsZ0NBQVV6QyxLQUFWLEVBQWtCLHlCQUF3QnlDLGtCQUFtQixFQUE3RDtBQUNBLGdDQUFVLENBQUN6QyxLQUFLLENBQUNvQyxTQUFqQixFQUE2QiwyQkFBMEJLLGtCQUFtQixFQUExRSxFQUhnRSxDQUtoRTs7QUFDQSxjQUFNSyxnQkFBZ0IsR0FBR0MsMEJBQWVDLGdDQUFmLENBQ3JCd0IsU0FEcUIsRUFFckIsSUFGcUIsRUFHckJ4RSxLQUhxQixDQUF6Qjs7QUFLQSxZQUFJLENBQUM4QyxnQkFBZ0IsQ0FBQ0csT0FBdEIsRUFBK0I7QUFDM0IsZ0JBQU0sSUFBSVosS0FBSixDQUFVUyxnQkFBZ0IsQ0FBQ0ksTUFBM0IsQ0FBTjtBQUNIOztBQUVEcUIsUUFBQUEsbUJBQW1CLENBQUN2RSxLQUFLLENBQUNMLEVBQVAsQ0FBbkIsR0FBZ0NvRCwwQkFBZUssaUNBQWYsQ0FDNUJvQixTQUQ0QixFQUU1QnhFLEtBRjRCLENBQWhDO0FBSUg7O0FBQ0QsWUFBTW9CLFFBQVEsR0FBR3RGLE9BQU8sQ0FBQzJJLGFBQVIsRUFBakI7QUFDQSxZQUFNQyxlQUFlLEdBQUc7QUFDcEIvRSxRQUFBQSxFQUFFLEVBQUV5QixRQURnQjtBQUVwQm1ELFFBQUFBLG1CQUZvQjtBQUdwQkksUUFBQUEsWUFBWSxFQUFFLENBSE07QUFJcEJDLFFBQUFBLFdBQVcsRUFBRSxJQUFJQyxJQUFKLEdBQVdDLE1BQVg7QUFKTyxPQUF4QjtBQU1BUixNQUFBQSxnQkFBZ0IsQ0FBQ25GLElBQWpCLENBQXNCdUYsZUFBdEI7QUFDQWxJLE1BQUFBLFNBQVMsQ0FBQzJDLElBQVYsQ0FBZWlDLFFBQWY7QUFFQWtCLE1BQUFBLE9BQU8sQ0FBQ25ELElBQVIsQ0FBYTtBQUNUa0UsUUFBQUEsSUFBSSxFQUFFLENBQUMsWUFBRCxFQUFlLEtBQUsxRCxFQUFwQixFQUF3QixhQUF4QixFQUF1Q3lCLFFBQXZDLENBREc7QUFFVGtDLFFBQUFBLEtBQUssRUFBRW9CO0FBRkUsT0FBYjtBQUlIOztBQUVELFNBQUssTUFBTWpFLElBQVgsSUFBbUIsS0FBS3BFLEtBQXhCLEVBQStCO0FBQzNCLFVBQUlvRSxJQUFJLENBQUN5RCxZQUFULEVBQXVCO0FBQ25CNUIsUUFBQUEsT0FBTyxDQUFDbkQsSUFBUixDQUFhLEdBQUdzQixJQUFJLENBQUNzRSxpREFBTCxDQUF1RHZJLFNBQXZELENBQWhCO0FBQ0g7QUFDSjs7QUFFRCxTQUFLYSxVQUFMLENBQWdCa0csY0FBaEIsQ0FBK0JqQixPQUEvQjs7QUFFQSxVQUFNa0IsaUJBQWlCLEdBQUcsS0FBS3hGLGtCQUFMLENBQXdCZ0gsa0JBQXhCLENBQ3RCLEtBQUtyRixFQURpQixFQUV0QjJFLGdCQUZzQixDQUExQjs7QUFLQSxVQUFNVyxZQUFZLEdBQUcsa0JBQUF6SSxTQUFTLE1BQVQsQ0FBQUEsU0FBUyxFQUFLNEUsUUFBUSxJQUFJO0FBQzNDLFlBQU04RCxXQUFXLEdBQUcsS0FBSzVELGFBQUwsQ0FBbUJGLFFBQW5CLENBQXBCO0FBQ0EsOEJBQVU4RCxXQUFWLEVBQXVCLHFDQUF2QjtBQUNBLGFBQU9BLFdBQVA7QUFDSCxLQUo2QixDQUE5QjtBQU1BLFdBQU87QUFDSHhCLE1BQUFBLFVBQVUsRUFBRUYsaUJBRFQ7QUFFSGpILE1BQUFBLE9BQU8sRUFBRTBJO0FBRk4sS0FBUDtBQUlIO0FBQ0Q7OztBQUNBRSxFQUFBQSxlQUFlLENBQUM5RCxNQUFELEVBQWlCO0FBQzVCLFdBQU8sS0FBSytELGdCQUFMLENBQXNCLENBQUMvRCxNQUFELENBQXRCLENBQVA7QUFDSDtBQUNEOzs7QUFDQWdFLEVBQUFBLFlBQVksQ0FBQ2hFLE1BQUQsRUFBZ0Q7QUFDeEQsV0FBTyxLQUFLaUUsYUFBTCxDQUFtQixDQUFDakUsTUFBRCxDQUFuQixDQUFQO0FBQ0g7QUFDRDs7O0FBQ0ErRCxFQUFBQSxnQkFBZ0IsQ0FBQzdJLE9BQUQsRUFBeUI7QUFDckM7QUFDQTtBQUNBLFVBQU07QUFBQ3VGLE1BQUFBO0FBQUQsUUFBUyx1QkFBZjtBQUNBLFdBQU8vRixpQkFBaUIsQ0FBQ2dHLEdBQWxCLENBQXNCRCxJQUFJLENBQUNFLG9CQUEzQixFQUFpREMsb0NBQWlCQyxJQUFsRSxDQUFQO0FBQ0g7QUFDRDs7O0FBQ0FvRCxFQUFBQSxhQUFhLENBQUMvSSxPQUFELEVBQXdEO0FBQ2pFLFFBQUksQ0FBQyxLQUFLNkksZ0JBQUwsQ0FBc0I3SSxPQUF0QixDQUFMLEVBQXFDO0FBQ2pDLFlBQU0sSUFBSThGLEtBQUosQ0FBVSx1REFBVixDQUFOO0FBQ0gsS0FIZ0UsQ0FLakU7QUFDQTs7O0FBQ0EsUUFBSSxDQUFDLEtBQUs2QixZQUFWLEVBQXdCO0FBQ3BCLFlBQU0sSUFBSTdCLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0g7O0FBRUQsVUFBTTdGLFNBQVMsR0FBRyxrQkFBQUQsT0FBTyxNQUFQLENBQUFBLE9BQU8sRUFBSzhFLE1BQU0sSUFBSUEsTUFBTSxDQUFDMUIsRUFBdEIsQ0FBekI7QUFFQSxVQUFNMkMsT0FBTyxHQUFHLGtCQUFBOUYsU0FBUyxNQUFULENBQUFBLFNBQVMsRUFBSzRFLFFBQVEsSUFBSTtBQUN0QyxhQUFPO0FBQUNpQyxRQUFBQSxJQUFJLEVBQUUsQ0FBQyxZQUFELEVBQWUsS0FBSzFELEVBQXBCLEVBQXdCLGFBQXhCLEVBQXVDeUIsUUFBdkMsQ0FBUDtBQUF5RGtDLFFBQUFBLEtBQUssRUFBRWlDO0FBQWhFLE9BQVA7QUFDSCxLQUZ3QixDQUF6Qjs7QUFJQSxTQUFLLE1BQU05RSxJQUFYLElBQW1CLEtBQUtwRSxLQUF4QixFQUErQjtBQUMzQixVQUFJb0UsSUFBSSxDQUFDeUQsWUFBVCxFQUF1QjtBQUNuQjVCLFFBQUFBLE9BQU8sQ0FBQ25ELElBQVIsQ0FDSSxHQUFHc0IsSUFBSSxDQUFDK0Usb0RBQUwsQ0FBMERoSixTQUExRCxDQURQO0FBR0g7QUFDSjs7QUFFRCxTQUFLYSxVQUFMLENBQWdCa0csY0FBaEIsQ0FBK0JqQixPQUEvQjs7QUFFQSxVQUFNa0IsaUJBQWlCLEdBQUcsS0FBS3hGLGtCQUFMLENBQXdCeUgsa0JBQXhCLENBQTJDLEtBQUs5RixFQUFoRCxFQUFvRG5ELFNBQXBELENBQTFCOztBQUNBLFdBQU87QUFDSGtILE1BQUFBLFVBQVUsRUFBRUY7QUFEVCxLQUFQO0FBR0g7QUFDRDs7O0FBQ0FrQyxFQUFBQSxrQkFBa0IsQ0FBQ0MsZ0JBQUQsRUFBNEQ7QUFDMUUsUUFBSSxDQUFDLHNCQUFjQSxnQkFBZCxDQUFMLEVBQXNDO0FBQ2xDQSxNQUFBQSxnQkFBZ0IsR0FBSSxDQUFDQSxnQkFBRCxDQUFwQjtBQUNIOztBQUVELFdBQ0ksbUJBQUFoSyxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFNLEtBQUtVLEtBQVgsRUFBa0JvRSxJQUFJLElBQUk7QUFDdkIsYUFBTyx1QkFBQTlFLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQVVnSyxnQkFBVixFQUE0QmxGLElBQUksQ0FBQ21GLElBQWpDLENBQVI7QUFDSCxLQUZBLENBQUQsSUFFTSxJQUhWO0FBS0g7QUFDRDs7Ozs7Ozs7QUFNQUMsRUFBQUEsb0JBQW9CLENBQUNGLGdCQUFELEVBQTREO0FBQzVFLFFBQUksQ0FBQyxzQkFBY0EsZ0JBQWQsQ0FBTCxFQUFzQztBQUNsQ0EsTUFBQUEsZ0JBQWdCLEdBQUksQ0FBQ0EsZ0JBQUQsQ0FBcEI7QUFDSDs7QUFFRCxVQUFNdkosVUFBVSxHQUFHLEtBQUtBLFVBQXhCOztBQUNBLFFBQUlBLFVBQVUsSUFBSSx1QkFBQVQsQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBVWdLLGdCQUFWLEVBQTRCdkosVUFBVSxDQUFDd0osSUFBdkMsQ0FBbkIsRUFBaUU7QUFDN0QsYUFBT3hKLFVBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxhQUFPLEtBQUtzSixrQkFBTCxDQUF3QkMsZ0JBQXhCLENBQVA7QUFDSDtBQUNKLEdBcmpCd0UsQ0FzakJ6RTtBQUNBOzs7QUFDQSxRQUFNRyxrQ0FBTixDQUF5QzlFLElBQXpDLEVBRStCO0FBQzNCLFVBQU1SLE1BQU0sR0FBR1EsSUFBSSxJQUFJQSxJQUFJLENBQUNQLElBQWIsR0FBb0JPLElBQUksQ0FBQ1AsSUFBTCxDQUFVZCxFQUE5QixHQUFtQyxJQUFsRDtBQUNBLFVBQU00RSxtQkFBbUIsR0FBRyxNQUFNLEtBQUt2RyxrQkFBTCxDQUF3QitILG9DQUF4QixDQUM5QixLQUFLdkcsR0FEeUIsRUFFOUJnQixNQUY4QixDQUFsQztBQUlBLFdBQU8rRCxtQkFBUDtBQUNIO0FBQ0Q7Ozs7OztBQUlBLE1BQUl5QixzQkFBSixHQUFzQztBQUNsQyxXQUFPLENBQUMsQ0FBQyxLQUFLbEksS0FBTCxDQUFXcUQsV0FBcEI7QUFDSDtBQUNEOzs7Ozs7QUFJQSxRQUFNOEUsdUJBQU4sR0FBZ0M7QUFDNUIsV0FBTyxNQUFNLEtBQUtwSCw2QkFBTCxDQUFtQyxDQUM1QyxLQUFLTyx5Q0FBTCxFQUQ0QyxDQUFuQyxDQUFiO0FBR0g7QUFDRDs7O0FBQ0E4RyxFQUFBQSxvQkFBb0IsR0FBRztBQUNuQixTQUFLbEgsMEJBQUwsQ0FBZ0MsQ0FBQyxLQUFLSSx5Q0FBTCxFQUFELENBQWhDO0FBQ0g7O0FBQ0RBLEVBQUFBLHlDQUF5QyxHQUFXO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTyxLQUFLdkIsZUFBWjtBQUNIO0FBQ0Q7OztBQUNBc0ksRUFBQUEsNkJBQTZCLENBQUNsSCxPQUFELEVBQTJCO0FBQ3BELFdBQU8sS0FBS2lGLFlBQUwsSUFBcUIsS0FBS2pHLDZCQUFMLENBQW1DZ0IsT0FBbkMsQ0FBckIsSUFBb0UsS0FBM0U7QUFDSDtBQUNEOzs7Ozs7QUFJQSxRQUFNSiw2QkFBTixDQUFvQ3VILFFBQXBDLEVBQTZEO0FBQ3pELFVBQU1DLHlDQUF3RCxHQUFHLEVBQWpFO0FBQ0EsVUFBTUMsbUJBQTZELEdBQUcsRUFBdEU7O0FBQ0EsU0FBSyxNQUFNckgsT0FBWCxJQUFzQm1ILFFBQXRCLEVBQWdDO0FBQzVCLFVBQUksS0FBS2pJLCtCQUFMLENBQXFDYyxPQUFyQyxNQUFrRHNHLFNBQXRELEVBQWlFO0FBQzdELGFBQUtwSCwrQkFBTCxDQUFxQ2MsT0FBckM7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLZCwrQkFBTCxDQUFxQ2MsT0FBckMsSUFBZ0QsQ0FBaEQ7QUFDSCxPQUwyQixDQU81QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxVQUFJLENBQUMsS0FBS2hCLDZCQUFMLENBQW1DZ0IsT0FBbkMsQ0FBTCxFQUFrRDtBQUM5QyxjQUFNc0gsa0JBQWtCLEdBQUcsS0FBS3JJLHNDQUFMLENBQTRDZSxPQUE1QyxDQUEzQjs7QUFDQSxZQUFJc0gsa0JBQUosRUFBd0I7QUFDcEJELFVBQUFBLG1CQUFtQixDQUFDbkgsSUFBcEIsQ0FBeUJvSCxrQkFBekI7QUFDSCxTQUZELE1BRU87QUFDSEYsVUFBQUEseUNBQXlDLENBQUNsSCxJQUExQyxDQUErQ0YsT0FBL0M7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsUUFBSW9ILHlDQUF5QyxDQUFDMUgsTUFBMUMsR0FBbUQsQ0FBdkQsRUFBMEQ7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFNNkgsa0RBQWtELEdBQUcsS0FBS0MsOEJBQUwsQ0FDdkRKLHlDQUR1RCxDQUEzRDs7QUFHQUMsTUFBQUEsbUJBQW1CLENBQUNuSCxJQUFwQixDQUF5QnFILGtEQUF6Qjs7QUFDQSxXQUFLLE1BQU12SCxPQUFYLElBQXNCb0gseUNBQXRCLEVBQWlFO0FBQzdELGFBQUtuSSxzQ0FBTCxDQUNJZSxPQURKLElBRUl1SCxrREFGSjtBQUdILE9BYnFELENBY3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBQSxNQUFBQSxrREFBa0QsQ0FBQ0UsSUFBbkQsQ0FBd0RDLFdBQVcsSUFBSTtBQUNuRSxhQUFLLE1BQU0xSCxPQUFYLElBQXNCb0gseUNBQXRCLEVBQWlFO0FBQzdELGVBQUtwSSw2QkFBTCxDQUFtQ2dCLE9BQW5DLElBQThDLElBQTlDO0FBQ0EsZUFBS2Ysc0NBQUwsQ0FBNENlLE9BQTVDLElBQXVEc0csU0FBdkQ7QUFDSDs7QUFFRCxhQUFLLE1BQU16SSxHQUFYLElBQWtCNkosV0FBbEIsRUFBK0I7QUFDM0IsZUFBS0MsU0FBTCxDQUFlOUosR0FBZjtBQUNIO0FBQ0osT0FURDtBQVVIOztBQUNELFVBQU0saUJBQVErSixHQUFSLENBQVlQLG1CQUFaLENBQU47QUFDSDs7QUFDRCxRQUFNRyw4QkFBTixDQUNJTCxRQURKLEVBRXFDO0FBQ2pDLFVBQU07QUFDRmpGLE1BQUFBLFdBQVcsRUFBRTJGO0FBRFgsUUFFRixNQUFNLEtBQUs5SSxrQkFBTCxDQUF3QitJLDBDQUF4QixDQUNOLEtBQUt2SCxHQURDLEVBRU40RyxRQUZNLENBRlYsQ0FEaUMsQ0FRakM7O0FBQ0EsUUFBSSxDQUFDLEtBQUt0SSxLQUFMLENBQVdxRCxXQUFoQixFQUE2QjtBQUN6QixXQUFLckQsS0FBTCxDQUFXcUQsV0FBWCxHQUF5QixFQUF6QjtBQUNIOztBQUNELFVBQU07QUFBQ0EsTUFBQUEsV0FBVyxFQUFFNkY7QUFBZCxRQUFxQyxLQUFLbEosS0FBaEQ7QUFDQW5DLElBQUFBLENBQUMsQ0FBQ3NMLFVBQUYsQ0FBY0gsY0FBZCxFQUF5RCxDQUFDSSxZQUFELEVBQWU5RixRQUFmLEtBQTRCO0FBQ2pGLFVBQUksQ0FBQ3pGLENBQUMsQ0FBQ3dMLEdBQUYsQ0FBTUgsbUJBQU4sRUFBMkI1RixRQUEzQixDQUFMLEVBQTJDO0FBQ3ZDNEYsUUFBQUEsbUJBQW1CLENBQUM1RixRQUFELENBQW5CLEdBQWdDOEYsWUFBaEM7QUFDSCxPQUZELE1BRU87QUFDSCxjQUFNRSxpQkFBaUIsR0FBR0osbUJBQW1CLENBQUM1RixRQUFELENBQTdDLENBREcsQ0FFSDtBQUNBO0FBQ0E7O0FBQ0EsZ0NBQ0lnRyxpQkFBaUIsQ0FBQ3pDLFlBQWxCLEtBQW1DdUMsWUFBWSxDQUFDdkMsWUFEcEQsRUFFSSwyQkFGSjtBQUlBLGdDQUNJeUMsaUJBQWlCLENBQUN4QyxXQUFsQixLQUFrQ3NDLFlBQVksQ0FBQ3RDLFdBRG5ELEVBRUksMEJBRko7O0FBSUEsWUFBSSxDQUFDd0MsaUJBQWlCLENBQUM3QyxtQkFBdkIsRUFBNEM7QUFDeEM2QyxVQUFBQSxpQkFBaUIsQ0FBQzdDLG1CQUFsQixHQUF3QyxFQUF4QztBQUNIOztBQUNELGNBQU04QywyQkFBMkIsR0FBR0QsaUJBQWlCLENBQUM3QyxtQkFBdEQ7O0FBQ0EsYUFBSyxJQUFJRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHK0IsUUFBUSxDQUFDekgsTUFBN0IsRUFBcUMwRixDQUFDLEVBQXRDLEVBQTBDO0FBQ3RDLGdCQUFNcEYsT0FBTyxHQUFHbUgsUUFBUSxDQUFDL0IsQ0FBRCxDQUF4QjtBQUNBZ0QsVUFBQUEsMkJBQTJCLENBQUNwSSxPQUFELENBQTNCLEdBQXVDaUksWUFBWSxDQUFDM0MsbUJBQWIsR0FDakMyQyxZQUFZLENBQUMzQyxtQkFBYixDQUFpQ3RGLE9BQWpDLENBRGlDLEdBRWpDc0csU0FGTjtBQUdIO0FBQ0o7QUFDSixLQTNCRDtBQTZCQSxVQUFNb0IsV0FBVyxHQUFHLGtCQUFBUCxRQUFRLE1BQVIsQ0FBQUEsUUFBUSxFQUFLbkgsT0FBTyxJQUFJdkMsbUNBQW1DLEdBQUd1QyxPQUF0RCxDQUE1QixDQTFDaUMsQ0EyQ2pDO0FBQ0E7QUFDQTs7QUFDQTBILElBQUFBLFdBQVcsQ0FBQ3hILElBQVosQ0FBaUJqRCxrQkFBa0IsQ0FBQ0ssT0FBcEM7QUFDQW9LLElBQUFBLFdBQVcsQ0FBQ3hILElBQVosQ0FBaUJqRCxrQkFBa0IsQ0FBQ00sU0FBcEMsRUEvQ2lDLENBZ0RqQztBQUNBOztBQUNBbUssSUFBQUEsV0FBVyxDQUFDeEgsSUFBWixDQUFpQmpELGtCQUFrQixDQUFDTyxVQUFwQztBQUNBLFdBQU9rSyxXQUFQO0FBQ0g7QUFDRDs7O0FBQ0EzSCxFQUFBQSwwQkFBMEIsQ0FBQ29ILFFBQUQsRUFBMEI7QUFDaEQsVUFBTWtCLDJCQUEwQyxHQUFHLEVBQW5EOztBQUNBLFNBQUssTUFBTXJJLE9BQVgsSUFBc0JtSCxRQUF0QixFQUFnQztBQUM1QixVQUFJbUIsZ0JBQWdCLEdBQUcsS0FBS3BKLCtCQUFMLENBQXFDYyxPQUFyQyxLQUFpRCxDQUF4RTtBQUNBc0ksTUFBQUEsZ0JBQWdCOztBQUVoQixVQUFJQSxnQkFBZ0IsR0FBRyxDQUF2QixFQUEwQjtBQUN0QkMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMEJBQVosRUFEc0IsQ0FDbUI7O0FBQ3pDRixRQUFBQSxnQkFBZ0IsR0FBRyxDQUFuQjtBQUNIOztBQUNELFdBQUtwSiwrQkFBTCxDQUFxQ2MsT0FBckMsSUFBZ0RzSSxnQkFBaEQ7O0FBRUEsVUFBSUEsZ0JBQWdCLEtBQUssQ0FBekIsRUFBNEI7QUFDeEJELFFBQUFBLDJCQUEyQixDQUFDbkksSUFBNUIsQ0FBaUNGLE9BQWpDO0FBQ0g7QUFDSjs7QUFDRCxRQUFJcUksMkJBQTJCLENBQUMzSSxNQUE1QixHQUFxQyxDQUF6QyxFQUE0QztBQUN4QztBQUNBO0FBQ0E7QUFDQSxnQ0FBVyxNQUFNO0FBQ2I7QUFDQTtBQUNBLGNBQU1JLGdCQUFnQixHQUFHLHFCQUFBdUksMkJBQTJCLE1BQTNCLENBQUFBLDJCQUEyQixFQUFRckksT0FBTyxJQUFJO0FBQ25FLGlCQUFPLEtBQUtkLCtCQUFMLENBQXFDYyxPQUFyQyxNQUFrRCxDQUF6RDtBQUNILFNBRm1ELENBQXBEOztBQUdBLFlBQUlGLGdCQUFnQixDQUFDSixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUM3QjtBQUNBO0FBQ0EsZUFBSyxNQUFNTSxPQUFYLElBQXNCRixnQkFBdEIsRUFBd0M7QUFDcEMsaUJBQUtkLDZCQUFMLENBQW1DZ0IsT0FBbkMsSUFBOEMsS0FBOUM7QUFDSDs7QUFDRCxlQUFLeUksMkJBQUwsQ0FBaUMzSSxnQkFBakM7QUFDSDtBQUNKLE9BZEQsRUFjR25DLHdDQUEyQitLLHNCQWQ5QjtBQWVIO0FBQ0o7O0FBQ0RELEVBQUFBLDJCQUEyQixDQUFDdEIsUUFBRCxFQUEwQjtBQUNqRCxTQUFLcEksa0JBQUwsQ0FBd0I0SixpQ0FBeEIsQ0FBMEQsS0FBS3BJLEdBQS9ELEVBQW9FNEcsUUFBcEU7O0FBQ0EsU0FBS3lCLDRDQUFMLENBQWtEekIsUUFBbEQ7QUFDSDs7QUFDRCxRQUFNMEIsY0FBTixHQUEwRDtBQUN0RCxVQUFNQyxTQUFTLEdBQUcsTUFBTSxLQUFLL0osa0JBQUwsQ0FBd0JnSyxpQ0FBeEIsQ0FBMEQsS0FBS3hJLEdBQS9ELENBQXhCO0FBQ0EsU0FBSzFCLEtBQUwsQ0FBV3FELFdBQVgsR0FBeUI0RyxTQUFTLENBQUM1RyxXQUFuQztBQUVBLFVBQU13RixXQUFXLEdBQUcsQ0FDaEJ6SyxrQkFBa0IsQ0FBQ0ssT0FESCxFQUVoQkwsa0JBQWtCLENBQUNNLFNBRkgsRUFHaEJOLGtCQUFrQixDQUFDTyxVQUhILENBQXBCOztBQU1BLFNBQUssTUFBTXdDLE9BQVgsSUFBc0IsbUJBQVksS0FBS25CLEtBQUwsQ0FBV2lDLFVBQXZCLENBQXRCLEVBQTBEO0FBQ3RENEcsTUFBQUEsV0FBVyxDQUFDeEgsSUFBWixDQUFpQnpDLG1DQUFtQyxHQUFHdUMsT0FBdkQ7QUFDSDs7QUFFRCxXQUFPMEgsV0FBUDtBQUNIOztBQUNEc0IsRUFBQUEsV0FBVyxHQUFHO0FBQ1YsU0FBS2pLLGtCQUFMLENBQXdCa0ssd0JBQXhCLENBQWlELEtBQUsxSSxHQUF0RDs7QUFDQSxTQUFLcUksNENBQUw7QUFDSDs7QUFDREEsRUFBQUEsNENBQTRDLENBQUNNLGdCQUFELEVBQW1DO0FBQzNFLFVBQU1DLGtCQUFrQixHQUNwQixLQUFLbEUsWUFBTCxJQUNBLG1CQUFBdkksQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBTSxxQkFBQUEsQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBUSxLQUFLc0MsNkJBQWIsQ0FBUCxFQUFvRG9LLFFBQVEsSUFBSUEsUUFBaEUsQ0FGTDs7QUFHQSxRQUFJLENBQUMsS0FBS2pHLFNBQVYsRUFBcUI7QUFDakIsVUFBSSxDQUFDZ0csa0JBQUwsRUFBeUI7QUFDckIsYUFBS3RLLEtBQUwsQ0FBV3FELFdBQVgsR0FBeUJvRSxTQUF6QjtBQUNILE9BRkQsTUFFTyxJQUFJLENBQUMsS0FBS3JCLFlBQVYsRUFBd0I7QUFDM0IsWUFBSW9FLGVBQUo7O0FBQ0EsWUFBSUgsZ0JBQUosRUFBc0I7QUFDbEI7QUFDQUcsVUFBQUEsZUFBZSxHQUFHSCxnQkFBbEI7QUFDSCxTQUhELE1BR087QUFDSDtBQUNBO0FBQ0E7QUFDQSxnQkFBTS9CLFFBQVEsR0FBRyxtQkFBWSxLQUFLdEksS0FBTCxDQUFXaUMsVUFBdkIsQ0FBakI7QUFDQXVJLFVBQUFBLGVBQWUsR0FBRyxxQkFBQWxDLFFBQVEsTUFBUixDQUFBQSxRQUFRLEVBQ3RCbkgsT0FBTyxJQUFJLENBQUMsS0FBS2hCLDZCQUFMLENBQW1DZ0IsT0FBbkMsQ0FEVSxDQUExQjtBQUdIOztBQUNEdEQsUUFBQUEsQ0FBQyxDQUFDc0wsVUFBRixDQUFhLEtBQUtuSixLQUFMLENBQVdxRCxXQUF4QixFQUFxQ29ILFNBQVMsSUFBSTtBQUM5QyxlQUFLLElBQUlsRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHaUUsZUFBZSxDQUFDM0osTUFBcEMsRUFBNEMwRixDQUFDLEVBQTdDLEVBQWlEO0FBQzdDLGtCQUFNcEYsT0FBTyxHQUFHcUosZUFBZSxDQUFDakUsQ0FBRCxDQUEvQjs7QUFDQSxnQkFBSWtFLFNBQVMsQ0FBQ2hFLG1CQUFkLEVBQW1DO0FBQy9CZ0UsY0FBQUEsU0FBUyxDQUFDaEUsbUJBQVYsQ0FBOEJ0RixPQUE5QixJQUF5Q3NHLFNBQXpDO0FBQ0g7QUFDSjtBQUNKLFNBUEQ7QUFRSDtBQUNKOztBQUNELFFBQUksQ0FBQzZDLGtCQUFMLEVBQXlCO0FBQ3JCLFdBQUt6SyxpQkFBTCxHQUF5QixFQUF6QjtBQUNIO0FBQ0o7O0FBQ0RnRixFQUFBQSxrQkFBa0IsQ0FBQzZGLHlCQUFELEVBQTBEO0FBQ3hFLFFBQUl4SSxLQUFKOztBQUNBLFFBQUl3SSx5QkFBeUIsWUFBWXZJLGNBQXpDLEVBQWdEO0FBQzVDRCxNQUFBQSxLQUFLLEdBQUd3SSx5QkFBUjtBQUNILEtBRkQsTUFFTztBQUNIeEksTUFBQUEsS0FBSyxHQUNELEtBQUtGLFlBQUwsQ0FBa0IwSSx5QkFBbEIsS0FDQSxLQUFLdEksY0FBTCxDQUFvQnNJLHlCQUFwQixDQUZKO0FBR0g7O0FBQ0QsV0FBT3hJLEtBQVA7QUFDSDs7QUFDRHlJLEVBQUFBLGlCQUFpQixDQUFDQyxzQkFBRCxFQUFxRDtBQUNsRSxRQUFJakksSUFBSjs7QUFDQSxRQUFJaUksc0JBQXNCLFlBQVkvSCxhQUF0QyxFQUE0QztBQUN4Q0YsTUFBQUEsSUFBSSxHQUFHaUksc0JBQVA7QUFDSCxLQUZELE1BRU87QUFDSGpJLE1BQUFBLElBQUksR0FDQSxLQUFLSCxXQUFMLENBQWlCb0ksc0JBQWpCLEtBQ0EsS0FBSzlILGFBQUwsQ0FBbUI4SCxzQkFBbkIsQ0FGSjtBQUdIOztBQUNELFdBQU9qSSxJQUFQO0FBQ0g7O0FBQ0RrSSxFQUFBQSw4QkFBOEIsQ0FBQ0MsVUFBRCxFQUFxQjtBQUMvQyxRQUFJQSxVQUFVLENBQUN6TSxJQUFmLEVBQXFCO0FBQ2pCLFdBQUt5SyxTQUFMLENBQWUxSyxrQkFBa0IsQ0FBQ0MsSUFBbEM7QUFDSDs7QUFDRCxRQUFJeU0sVUFBVSxDQUFDdkksWUFBZixFQUE2QjtBQUN6QixXQUFLdUcsU0FBTCxDQUFlMUssa0JBQWtCLENBQUNFLFVBQWxDO0FBQ0g7O0FBQ0QsUUFBSXdNLFVBQVUsQ0FBQ3JJLFNBQWYsRUFBMEI7QUFDdEIsV0FBS3FHLFNBQUwsQ0FBZTFLLGtCQUFrQixDQUFDRyxLQUFsQyxFQURzQixDQUd0Qjs7O0FBQ0EsV0FBSyxNQUFNLENBQUNtRSxNQUFELEVBQVNxSSxTQUFULENBQVgsSUFBa0Msc0JBQUFsTixDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFTLEtBQUs4QixlQUFkLENBQW5DLEVBQW1FO0FBQy9ELFlBQUlvTCxTQUFTLENBQUN6RyxTQUFkLEVBQXlCO0FBQ3JCLGlCQUFPLEtBQUszRSxlQUFMLENBQXFCK0MsTUFBckIsQ0FBUDtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxRQUFJb0ksVUFBVSxDQUFDbEksU0FBZixFQUEwQjtBQUN0QixXQUFLLE1BQU0sQ0FBQ0YsTUFBRCxFQUFTc0ksY0FBVCxDQUFYLElBQXVDLHNCQUFBbk4sQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBU2lOLFVBQVUsQ0FBQ2xJLFNBQXBCLENBQXhDLEVBQXdFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLGNBQU1ELElBQUksR0FBRyxLQUFLaEQsZUFBTCxDQUFxQitDLE1BQXJCLENBQWI7O0FBQ0EsWUFBSUMsSUFBSixFQUFVO0FBQ05BLFVBQUFBLElBQUksQ0FBQ2tJLDhCQUFMLENBQW9DRyxjQUFwQztBQUNIO0FBQ0o7QUFDSjs7QUFDRCxRQUFJRixVQUFVLENBQUM3SSxVQUFmLEVBQTJCO0FBQ3ZCO0FBQ0E7QUFDQSxZQUFNZ0osYUFBYSxHQUFHLEVBQXRCO0FBQ0EsWUFBTUMsZUFBZSxHQUFHLEVBQXhCOztBQUNBLFdBQUssTUFBTSxDQUFDL0osT0FBRCxFQUFVZ0ssZUFBVixDQUFYLElBQXlDLHNCQUFBdE4sQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBU2lOLFVBQVUsQ0FBQzdJLFVBQXBCLENBQTFDLEVBQTJFO0FBQ3ZFLFlBQUlrSixlQUFlLENBQUNDLFFBQXBCLEVBQThCO0FBQzFCO0FBQ0EsY0FBSXZOLENBQUMsQ0FBQ3dMLEdBQUYsQ0FBTSxLQUFLckosS0FBTCxDQUFXaUMsVUFBakIsRUFBNkJkLE9BQTdCLENBQUosRUFBMkM7QUFDdkM4SixZQUFBQSxhQUFhLENBQUM1SixJQUFkLENBQW1CRixPQUFuQjtBQUNILFdBRkQsTUFFTztBQUNIK0osWUFBQUEsZUFBZSxDQUFDN0osSUFBaEIsQ0FBcUJGLE9BQXJCO0FBRUEsa0JBQU1rSyxVQUFVLEdBQUcsS0FBS3pMLGdCQUFMLENBQXNCdUIsT0FBdEIsQ0FBbkI7O0FBQ0EsZ0JBQUlrSyxVQUFKLEVBQWdCO0FBQ1o7QUFDQSxxQkFBTyxLQUFLekwsZ0JBQUwsQ0FBc0J1QixPQUF0QixDQUFQO0FBQ0g7QUFDSjtBQUNKLFNBYkQsTUFhTztBQUNIO0FBQ0E7QUFDQTtBQUNBLGdCQUFNZSxLQUFLLEdBQUcsS0FBS3RDLGdCQUFMLENBQXNCdUIsT0FBdEIsQ0FBZDs7QUFDQSxjQUFJZSxLQUFKLEVBQVc7QUFDUEEsWUFBQUEsS0FBSyxDQUFDMkksOEJBQU4sQ0FBcUNNLGVBQXJDO0FBQ0g7QUFDSjtBQUNKOztBQUVELFVBQUlGLGFBQWEsQ0FBQ3BLLE1BQWQsR0FBdUIsQ0FBdkIsSUFBNEJxSyxlQUFlLENBQUNySyxNQUFoQixHQUF5QixDQUF6RCxFQUE0RDtBQUN4RCxhQUFLaUksU0FBTCxDQUFlMUssa0JBQWtCLENBQUNJLE1BQWxDLEVBQTBDO0FBQ3RDeU0sVUFBQUEsYUFEc0M7QUFFdENDLFVBQUFBO0FBRnNDLFNBQTFDO0FBSUgsT0FuQ3NCLENBcUN2Qjs7O0FBQ0EsV0FBS3BMLHFCQUFMLEdBQTZCLElBQTdCO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLb0ksc0JBQUwsSUFBK0I0QyxVQUFVLENBQUN6SCxXQUE5QyxFQUEyRDtBQUN2RDtBQUNBO0FBQ0EsWUFBTWlJLGdCQUFnQixHQUFHLEVBQXpCO0FBQ0EsWUFBTUMsY0FBYyxHQUFHLEVBQXZCO0FBQ0EsWUFBTUMsZ0JBQWdCLEdBQUcsRUFBekI7O0FBQ0EsV0FBSyxNQUFNLENBQUNsSSxRQUFELEVBQVdtSSxnQkFBWCxDQUFYLElBQTJDLHNCQUFBNU4sQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBU2lOLFVBQVUsQ0FBQ3pILFdBQXBCLENBQTVDLEVBQThFO0FBQzFFLFlBQUlvSSxnQkFBZ0IsQ0FBQ0wsUUFBckIsRUFBK0I7QUFDM0I7QUFFQSxrQ0FBVSxLQUFLcEwsS0FBTCxDQUFXcUQsV0FBckIsRUFBa0MsZ0JBQWxDOztBQUNBLGNBQUl4RixDQUFDLENBQUN3TCxHQUFGLENBQU0sS0FBS3JKLEtBQUwsQ0FBV3FELFdBQWpCLEVBQThCQyxRQUE5QixDQUFKLEVBQTZDO0FBQ3pDaUksWUFBQUEsY0FBYyxDQUFDbEssSUFBZixDQUFvQmlDLFFBQXBCO0FBQ0gsV0FGRCxNQUVPO0FBQ0hrSSxZQUFBQSxnQkFBZ0IsQ0FBQ25LLElBQWpCLENBQXNCaUMsUUFBdEI7QUFFQSxrQkFBTThELFdBQVcsR0FBRyxLQUFLdkgsaUJBQUwsQ0FBdUJ5RCxRQUF2QixDQUFwQjs7QUFDQSxnQkFBSThELFdBQUosRUFBaUI7QUFDYjtBQUNBLHFCQUFPLEtBQUt2SCxpQkFBTCxDQUF1QnlELFFBQXZCLENBQVA7QUFDSDtBQUNKO0FBQ0osU0FmRCxNQWVPO0FBQ0gsZ0JBQU04RCxXQUFXLEdBQUcsS0FBS3ZILGlCQUFMLENBQXVCeUQsUUFBdkIsQ0FBcEI7O0FBQ0EsY0FBSThELFdBQUosRUFBaUI7QUFDYkEsWUFBQUEsV0FBVyxDQUFDeUQsOEJBQVosQ0FBMkNZLGdCQUEzQztBQUNIO0FBQ0o7O0FBRUQsY0FBTTtBQUFDaEYsVUFBQUE7QUFBRCxZQUF3QmdGLGdCQUE5Qjs7QUFDQSxZQUFJaEYsbUJBQUosRUFBeUI7QUFDckIsZUFBSyxNQUFNdEYsT0FBWCxJQUFzQixvQkFBQXRELENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQU00SSxtQkFBTixDQUF2QixFQUFtRDtBQUMvQzZFLFlBQUFBLGdCQUFnQixDQUFDbkssT0FBRCxDQUFoQixHQUE0QixJQUE1QjtBQUNIO0FBQ0o7QUFDSixPQW5Dc0QsQ0FxQ3ZEO0FBQ0E7OztBQUNBLFVBQUlvSyxjQUFjLENBQUMxSyxNQUFmLEdBQXdCLENBQXhCLElBQTZCMkssZ0JBQWdCLENBQUMzSyxNQUFqQixHQUEwQixDQUEzRCxFQUE4RDtBQUMxRCxhQUFLaUksU0FBTCxDQUFlMUssa0JBQWtCLENBQUNLLE9BQWxDLEVBQTJDO0FBQ3ZDOE0sVUFBQUEsY0FEdUM7QUFFdkNDLFVBQUFBO0FBRnVDLFNBQTNDOztBQUtBLGFBQUsxQyxTQUFMLENBQWUxSyxrQkFBa0IsQ0FBQ00sU0FBbEMsRUFBNkM7QUFDekM2TSxVQUFBQSxjQUR5QztBQUV6Q0MsVUFBQUE7QUFGeUMsU0FBN0M7QUFJSCxPQWpEc0QsQ0FtRHZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBTWxELFFBQVEsR0FBRyxxQkFBYyxtQkFBWWdELGdCQUFaLENBQWQsQ0FBakI7QUFDQSxZQUFNNU0sU0FBUyxHQUFHLHFCQUFjLG1CQUFZb00sVUFBVSxDQUFDekgsV0FBdkIsQ0FBZCxDQUFsQjs7QUFDQSxVQUFJaUYsUUFBUSxDQUFDekgsTUFBVCxHQUFrQixDQUFsQixJQUF1Qm5DLFNBQVMsQ0FBQ21DLE1BQVYsR0FBbUIsQ0FBOUMsRUFBaUQ7QUFDN0MsYUFBS2lJLFNBQUwsQ0FBZTFLLGtCQUFrQixDQUFDTyxVQUFsQyxFQUE4QztBQUMxQ0QsVUFBQUEsU0FEMEM7QUFFMUM0SixVQUFBQTtBQUYwQyxTQUE5QztBQUlIOztBQUNELFdBQUssTUFBTW5ILE9BQVgsSUFBc0JtSCxRQUF0QixFQUFnQztBQUM1QixhQUFLUSxTQUFMLENBQWVsSyxtQ0FBbUMsR0FBR3VDLE9BQXJELEVBQThEekMsU0FBOUQsRUFBeUV5QyxPQUF6RTtBQUNIO0FBQ0o7QUFDSjs7QUFDRHVLLEVBQUFBLG1CQUFtQixHQUF1QjtBQUN0QyxRQUFJLENBQUMsS0FBSzVMLHFCQUFWLEVBQWlDO0FBQzdCLFlBQU02TCxjQUFjLEdBQUcsRUFBdkI7O0FBQ0EsV0FBSyxNQUFNLENBQUN4SyxPQUFELEVBQVVtQixTQUFWLENBQVgsSUFBbUMsc0JBQUF6RSxDQUFDLE1BQUQsQ0FBQUEsQ0FBQyxFQUFTLEtBQUttQyxLQUFMLENBQVdpQyxVQUFwQixDQUFwQyxFQUFxRTtBQUNqRTBKLFFBQUFBLGNBQWMsQ0FBQ3hLLE9BQUQsQ0FBZCxHQUEwQm1CLFNBQVMsQ0FBQ2pFLElBQXBDO0FBQ0g7O0FBQ0QsV0FBS3lCLHFCQUFMLEdBQTZCNkwsY0FBN0I7QUFDSDs7QUFDRCxXQUFPLEtBQUs3TCxxQkFBWjtBQUNIOztBQXArQndFOzs4QkFBdkVqQixLLHVDQUd5QyxLOzhCQUh6Q0EsSyxnQkFLa0IsTztlQWsrQlRBLEsiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IHt0eXBlIFJlY29yZElkLCB0eXBlIFJlY29yZERhdGEsIHR5cGUgUmVjb3JkRGVmfSBmcm9tICcuLi90eXBlcy9yZWNvcmQnO1xuaW1wb3J0IHt0eXBlIEJhc2VEYXRhfSBmcm9tICcuLi90eXBlcy9iYXNlJztcbmltcG9ydCB7dHlwZSBUYWJsZURhdGF9IGZyb20gJy4uL3R5cGVzL3RhYmxlJztcbmltcG9ydCB7dHlwZSBWaWV3VHlwZX0gZnJvbSAnLi4vdHlwZXMvdmlldyc7XG5pbXBvcnQge1Blcm1pc3Npb25MZXZlbHN9IGZyb20gJy4uL3R5cGVzL3Blcm1pc3Npb25fbGV2ZWxzJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi9wcml2YXRlX3V0aWxzJztcbmltcG9ydCBnZXRTZGsgZnJvbSAnLi4vZ2V0X3Nkayc7XG5pbXBvcnQge3R5cGUgQWlydGFibGVJbnRlcmZhY2UsIHR5cGUgQWlydGFibGVXcml0ZUFjdGlvbn0gZnJvbSAnLi4vaW5qZWN0ZWQvYWlydGFibGVfaW50ZXJmYWNlJztcbmltcG9ydCBBYnN0cmFjdE1vZGVsV2l0aEFzeW5jRGF0YSBmcm9tICcuL2Fic3RyYWN0X21vZGVsX3dpdGhfYXN5bmNfZGF0YSc7XG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEZpZWxkIGZyb20gJy4vZmllbGQnO1xuaW1wb3J0IFJlY29yZCBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgY2VsbFZhbHVlVXRpbHMgZnJvbSAnLi9jZWxsX3ZhbHVlX3V0aWxzJztcbmltcG9ydCB0eXBlIEJhc2UgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7dHlwZSBRdWVyeVJlc3VsdE9wdHN9IGZyb20gJy4vcXVlcnlfcmVzdWx0JztcbmltcG9ydCBUYWJsZU9yVmlld1F1ZXJ5UmVzdWx0IGZyb20gJy4vdGFibGVfb3Jfdmlld19xdWVyeV9yZXN1bHQnO1xuXG5jb25zdCB7dX0gPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSgnY2xpZW50X3NlcnZlcl9zaGFyZWQvaHUnKTtcbmNvbnN0IGh5cGVySWQgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSgnY2xpZW50X3NlcnZlcl9zaGFyZWQvaHlwZXJfaWQnKTtcbmNvbnN0IHBlcm1pc3Npb25IZWxwZXJzID0gd2luZG93Ll9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUoXG4gICAgJ2NsaWVudF9zZXJ2ZXJfc2hhcmVkL3Blcm1pc3Npb25zL3Blcm1pc3Npb25faGVscGVycycsXG4pO1xuY29uc3QgY2xpZW50U2VydmVyU2hhcmVkQ29uZmlnU2V0dGluZ3MgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvY2xpZW50X3NlcnZlcl9zaGFyZWRfY29uZmlnX3NldHRpbmdzJyxcbik7XG5jb25zdCBhaXJ0YWJsZVVybHMgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvYWlydGFibGVfdXJscycsXG4pO1xuXG4vLyBUaGlzIGRvZXNuJ3QgZm9sbG93IG91ciBlbnVtIG5hbWluZyBjb252ZW50aW9ucyBiZWNhdXNlIHdlIHdhbnQgdGhlIGtleXNcbi8vIHRvIG1pcnJvciB0aGUgbWV0aG9kL2dldHRlciBuYW1lcyBvbiB0aGUgbW9kZWwgY2xhc3MuXG5jb25zdCBXYXRjaGFibGVUYWJsZUtleXMgPSB7XG4gICAgbmFtZTogJ25hbWUnLFxuICAgIGFjdGl2ZVZpZXc6ICdhY3RpdmVWaWV3JyxcbiAgICB2aWV3czogJ3ZpZXdzJyxcbiAgICBmaWVsZHM6ICdmaWVsZHMnLFxuICAgIHJlY29yZHM6ICdyZWNvcmRzJyxcbiAgICByZWNvcmRJZHM6ICdyZWNvcmRJZHMnLFxuICAgIC8vIFRPRE8oa2FzcmEpOiB0aGVzZSBrZXlzIGRvbid0IGhhdmUgbWF0Y2hpbmcgZ2V0dGVycyAobm90IHRoYXQgdGhleSBzaG91bGRcbiAgICAvLyBpdCdzIGp1c3QgaW5jb25zaXN0ZW50Li4uKVxuICAgIGNlbGxWYWx1ZXM6ICdjZWxsVmFsdWVzJyxcbn07XG5jb25zdCBXYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCA9ICdjZWxsVmFsdWVzSW5GaWVsZDonO1xuLy8gVGhlIHN0cmluZyBjYXNlIGlzIHRvIGFjY29tbW9kYXRlIGNlbGxWYWx1ZXNJbkZpZWxkOiRGaWVsZElkLlxuLy8gSXQgbWF5IGFsc28gYmUgdXNlZnVsIHRvIGhhdmUgY2VsbFZhbHVlc0luVmlldzokVmlld0lkLi4uXG5leHBvcnQgdHlwZSBXYXRjaGFibGVUYWJsZUtleSA9ICRLZXlzPHR5cGVvZiBXYXRjaGFibGVUYWJsZUtleXM+IHwgc3RyaW5nO1xuXG4vKiogTW9kZWwgY2xhc3MgcmVwcmVzZW50aW5nIGEgdGFibGUgaW4gdGhlIGJhc2UuICovXG5jbGFzcyBUYWJsZSBleHRlbmRzIEFic3RyYWN0TW9kZWxXaXRoQXN5bmNEYXRhPFRhYmxlRGF0YSwgV2F0Y2hhYmxlVGFibGVLZXk+IHtcbiAgICAvLyBPbmNlIGFsbCBibG9ja3MgdGhhdCBjdXJyZW50IHNldCB0aGlzIGZsYWcgdG8gdHJ1ZSBhcmUgbWlncmF0ZWQsXG4gICAgLy8gcmVtb3ZlIHRoaXMgZmxhZy5cbiAgICBzdGF0aWMgc2hvdWxkTG9hZEFsbENlbGxWYWx1ZXNGb3JSZWNvcmRzID0gZmFsc2U7XG5cbiAgICBzdGF0aWMgX2NsYXNzTmFtZSA9ICdUYWJsZSc7XG4gICAgc3RhdGljIF9pc1dhdGNoYWJsZUtleShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdXRpbHMuaXNFbnVtVmFsdWUoV2F0Y2hhYmxlVGFibGVLZXlzLCBrZXkpIHx8XG4gICAgICAgICAgICB1LnN0YXJ0c1dpdGgoa2V5LCBXYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeClcbiAgICAgICAgKTtcbiAgICB9XG4gICAgc3RhdGljIF9zaG91bGRMb2FkRGF0YUZvcktleShrZXk6IFdhdGNoYWJsZVRhYmxlS2V5KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFwiRGF0YVwiIG1lYW5zICphbGwqIGNlbGwgdmFsdWVzIGluIHRoZSB0YWJsZS4gSWYgb25seSB3YXRjaGluZyByZWNvcmRzL3JlY29yZElkcyxcbiAgICAgICAgLy8gd2UnbGwganVzdCBsb2FkIHJlY29yZCBtZXRhZGF0YSAoaWQsIGNyZWF0ZWRUaW1lLCBjb21tZW50Q291bnQpLlxuICAgICAgICAvLyBJZiBvbmx5IHdhdGNoaW5nIHNwZWNpZmljIGZpZWxkcywgd2UnbGwganVzdCBsb2FkIGNlbGwgdmFsdWVzIGluIHRob3NlXG4gICAgICAgIC8vIGZpZWxkcy4gQm90aCBvZiB0aG9zZSBzY2VuYXJpb3MgYXJlIGhhbmRsZWQgbWFudWFsbHkgYnkgdGhpcyBjbGFzcyxcbiAgICAgICAgLy8gaW5zdGVhZCBvZiByZWx5aW5nIG9uIEFic3RyYWN0TW9kZWxXaXRoQXN5bmNEYXRhLlxuICAgICAgICBpZiAoVGFibGUuc2hvdWxkTG9hZEFsbENlbGxWYWx1ZXNGb3JSZWNvcmRzKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGtleSA9PT0gV2F0Y2hhYmxlVGFibGVLZXlzLnJlY29yZHMgfHxcbiAgICAgICAgICAgICAgICBrZXkgPT09IFdhdGNoYWJsZVRhYmxlS2V5cy5yZWNvcmRJZHMgfHxcbiAgICAgICAgICAgICAgICBrZXkgPT09IFdhdGNoYWJsZVRhYmxlS2V5cy5jZWxsVmFsdWVzXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gV2F0Y2hhYmxlVGFibGVLZXlzLmNlbGxWYWx1ZXM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3BhcmVudEJhc2U6IEJhc2U7XG4gICAgX3ZpZXdNb2RlbHNCeUlkOiB7W3N0cmluZ106IFZpZXd9O1xuICAgIF9maWVsZE1vZGVsc0J5SWQ6IHtbc3RyaW5nXTogRmllbGR9O1xuICAgIF9yZWNvcmRNb2RlbHNCeUlkOiB7W3N0cmluZ106IFJlY29yZH07XG4gICAgX2NhY2hlZEZpZWxkTmFtZXNCeUlkOiB7W3N0cmluZ106IHN0cmluZ30gfCBudWxsO1xuICAgIF9wcmltYXJ5RmllbGRJZDogc3RyaW5nO1xuICAgIF9haXJ0YWJsZUludGVyZmFjZTogQWlydGFibGVJbnRlcmZhY2U7XG5cbiAgICAvLyBUT0RPOiB0cnkgbWFraW5nIEZpZWxkIG1vZGVscyBtYW5hZ2UgdGhlaXIgb3duIGxvYWQgc3RhdGU/XG4gICAgLy8gVGhlcmUgaXMgYSBsb3Qgb2YgZHVwbGljYXRpb24gaGVyZSBhbmQgaW4gQWJzdHJhY3RNb2RlbFdpdGhBc3luY0RhdGEuXG4gICAgLy8gQWx0ZXJuYXRpdmVseSwgcGhhc2Ugb3V0IEFic3RyYWN0TW9kZWxXaXRoQXN5bmNEYXRhIGFzIGEgc3VwZXJjbGFzc1xuICAgIC8vIGFuZCBpbnN0ZWFkIGNyZWF0ZSBhIGhlbHBlciBjbGFzcyBmb3IgbWFuYWdpbmcgZWFjaCBwYXJ0IG9mIHRoZSBkYXRhXG4gICAgLy8gdHJlZSB0aGF0IGlzIGxvYWRlZC5cbiAgICBfYXJlQ2VsbFZhbHVlc0xvYWRlZEJ5RmllbGRJZDoge1tzdHJpbmddOiBib29sZWFuIHwgdm9pZH07XG4gICAgX3BlbmRpbmdDZWxsVmFsdWVzTG9hZFByb21pc2VCeUZpZWxkSWQ6IHtbc3RyaW5nXTogUHJvbWlzZTxBcnJheTxXYXRjaGFibGVUYWJsZUtleT4+IHwgdm9pZH07XG4gICAgX2NlbGxWYWx1ZXNSZXRhaW5Db3VudEJ5RmllbGRJZDoge1tzdHJpbmddOiBudW1iZXIgfCB2b2lkfTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBiYXNlRGF0YTogQmFzZURhdGEsXG4gICAgICAgIHBhcmVudEJhc2U6IEJhc2UsXG4gICAgICAgIHRhYmxlSWQ6IHN0cmluZyxcbiAgICAgICAgYWlydGFibGVJbnRlcmZhY2U6IEFpcnRhYmxlSW50ZXJmYWNlLFxuICAgICkge1xuICAgICAgICBzdXBlcihiYXNlRGF0YSwgdGFibGVJZCk7XG5cbiAgICAgICAgdGhpcy5fcGFyZW50QmFzZSA9IHBhcmVudEJhc2U7XG4gICAgICAgIHRoaXMuX3ZpZXdNb2RlbHNCeUlkID0ge307IC8vIFZpZXcgaW5zdGFuY2VzIGFyZSBsYXppbHkgY3JlYXRlZCBieSBnZXRWaWV3QnlJZC5cbiAgICAgICAgdGhpcy5fZmllbGRNb2RlbHNCeUlkID0ge307IC8vIEZpZWxkIGluc3RhbmNlcyBhcmUgbGF6aWx5IGNyZWF0ZWQgYnkgZ2V0RmllbGRCeUlkLlxuICAgICAgICB0aGlzLl9yZWNvcmRNb2RlbHNCeUlkID0ge307IC8vIFJlY29yZCBpbnN0YW5jZXMgYXJlIGxhemlseSBjcmVhdGVkIGJ5IGdldFJlY29yZEJ5SWQuXG4gICAgICAgIHRoaXMuX2NhY2hlZEZpZWxkTmFtZXNCeUlkID0gbnVsbDtcblxuICAgICAgICAvLyBBIGJpdCBvZiBhIGhhY2ssIGJ1dCB3ZSB1c2UgdGhlIHByaW1hcnkgZmllbGQgSUQgdG8gbG9hZCByZWNvcmRcbiAgICAgICAgLy8gbWV0YWRhdGEgKHNlZSBfZ2V0RmllbGRJZEZvckNhdXNpbmdSZWNvcmRNZXRhZGF0YVRvTG9hZCkuIFdlIGNvcHkgdGhlXG4gICAgICAgIC8vIElEIGhlcmUgaW5zdGVhZCBvZiBjYWxsaW5nIHRoaXMucHJpbWFyeUZpZWxkLmlkIHNpbmNlIHRoYXQgd291bGQgY3Jhc2hcbiAgICAgICAgLy8gd2hlbiB0aGUgdGFibGUgaXMgZ2V0dGluZyB1bmxvYWRlZCBhZnRlciBiZWluZyBkZWxldGVkLlxuICAgICAgICB0aGlzLl9wcmltYXJ5RmllbGRJZCA9IHRoaXMuX2RhdGEucHJpbWFyeUZpZWxkSWQ7XG5cbiAgICAgICAgdGhpcy5fYWlydGFibGVJbnRlcmZhY2UgPSBhaXJ0YWJsZUludGVyZmFjZTtcblxuICAgICAgICB0aGlzLl9hcmVDZWxsVmFsdWVzTG9hZGVkQnlGaWVsZElkID0ge307XG4gICAgICAgIHRoaXMuX3BlbmRpbmdDZWxsVmFsdWVzTG9hZFByb21pc2VCeUZpZWxkSWQgPSB7fTtcbiAgICAgICAgdGhpcy5fY2VsbFZhbHVlc1JldGFpbkNvdW50QnlGaWVsZElkID0ge307XG5cbiAgICAgICAgT2JqZWN0LnNlYWwodGhpcyk7XG4gICAgfVxuICAgIHdhdGNoKFxuICAgICAgICBrZXlzOiBXYXRjaGFibGVUYWJsZUtleSB8IEFycmF5PFdhdGNoYWJsZVRhYmxlS2V5PixcbiAgICAgICAgY2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICBjb250ZXh0PzogP09iamVjdCxcbiAgICApOiBBcnJheTxXYXRjaGFibGVUYWJsZUtleT4ge1xuICAgICAgICBjb25zdCB2YWxpZEtleXMgPSBzdXBlci53YXRjaChrZXlzLCBjYWxsYmFjaywgY29udGV4dCk7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzVG9Mb2FkID0gdGhpcy5fZ2V0RmllbGRJZHNUb0xvYWRGcm9tV2F0Y2hhYmxlS2V5cyh2YWxpZEtleXMpO1xuICAgICAgICBpZiAoZmllbGRJZHNUb0xvYWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdXRpbHMuZmlyZUFuZEZvcmdldFByb21pc2UoXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNBc3luYy5iaW5kKHRoaXMsIGZpZWxkSWRzVG9Mb2FkKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkS2V5cztcbiAgICB9XG4gICAgdW53YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlVGFibGVLZXkgfCBBcnJheTxXYXRjaGFibGVUYWJsZUtleT4sXG4gICAgICAgIGNhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgY29udGV4dD86ID9PYmplY3QsXG4gICAgKTogQXJyYXk8V2F0Y2hhYmxlVGFibGVLZXk+IHtcbiAgICAgICAgY29uc3QgdmFsaWRLZXlzID0gc3VwZXIudW53YXRjaChrZXlzLCBjYWxsYmFjaywgY29udGV4dCk7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzVG9VbmxvYWQgPSB0aGlzLl9nZXRGaWVsZElkc1RvTG9hZEZyb21XYXRjaGFibGVLZXlzKHZhbGlkS2V5cyk7XG4gICAgICAgIGlmIChmaWVsZElkc1RvVW5sb2FkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHMoZmllbGRJZHNUb1VubG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkS2V5cztcbiAgICB9XG4gICAgX2dldEZpZWxkSWRzVG9Mb2FkRnJvbVdhdGNoYWJsZUtleXMoa2V5czogQXJyYXk8V2F0Y2hhYmxlVGFibGVLZXk+KTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzVG9Mb2FkID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGlmICh1LnN0YXJ0c1dpdGgoa2V5LCBXYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZElkID0ga2V5LnN1YnN0cmluZyhXYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZpZWxkSWRzVG9Mb2FkLnB1c2goZmllbGRJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFUYWJsZS5zaG91bGRMb2FkQWxsQ2VsbFZhbHVlc0ZvclJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBXYXRjaGFibGVUYWJsZUtleXMucmVjb3JkcyB8fCBrZXkgPT09IFdhdGNoYWJsZVRhYmxlS2V5cy5yZWNvcmRJZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRJZHNUb0xvYWQucHVzaCh0aGlzLl9nZXRGaWVsZElkRm9yQ2F1c2luZ1JlY29yZE1ldGFkYXRhVG9Mb2FkKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRJZHNUb0xvYWQ7XG4gICAgfVxuICAgIGdldCBfZGF0YU9yTnVsbElmRGVsZXRlZCgpOiBUYWJsZURhdGEgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VEYXRhLnRhYmxlc0J5SWRbdGhpcy5faWRdIHx8IG51bGw7XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGdldCBwYXJlbnRCYXNlKCk6IEJhc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50QmFzZTtcbiAgICB9XG4gICAgLyoqIFRoZSB0YWJsZSdzIG5hbWUuIENhbiBiZSB3YXRjaGVkLiAqL1xuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLm5hbWU7XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGdldCB1cmwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGFpcnRhYmxlVXJscy5nZXRVcmxGb3JUYWJsZSh0aGlzLmlkLCB7XG4gICAgICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEV2ZXJ5IHRhYmxlIGhhcyBleGFjdGx5IG9uZSBwcmltYXJ5IGZpZWxkLiBUaGUgcHJpbWFyeSBmaWVsZCBvZiBhIHRhYmxlXG4gICAgICogd2lsbCBub3QgY2hhbmdlLlxuICAgICAqL1xuICAgIGdldCBwcmltYXJ5RmllbGQoKTogRmllbGQge1xuICAgICAgICBjb25zdCBwcmltYXJ5RmllbGQgPSB0aGlzLmdldEZpZWxkQnlJZCh0aGlzLl9kYXRhLnByaW1hcnlGaWVsZElkKTtcbiAgICAgICAgaW52YXJpYW50KHByaW1hcnlGaWVsZCwgJ25vIHByaW1hcnkgZmllbGQnKTtcbiAgICAgICAgcmV0dXJuIHByaW1hcnlGaWVsZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGZpZWxkcyBpbiB0aGlzIHRhYmxlLiBUaGUgb3JkZXIgaXMgYXJiaXRyYXJ5LCBzaW5jZSBmaWVsZHMgYXJlXG4gICAgICogb25seSBvcmRlcmVkIGluIHRoZSBjb250ZXh0IG9mIGEgc3BlY2lmaWMgdmlldy5cbiAgICAgKlxuICAgICAqIENhbiBiZSB3YXRjaGVkIHRvIGtub3cgd2hlbiBmaWVsZHMgYXJlIGNyZWF0ZWQgb3IgZGVsZXRlZC5cbiAgICAgKi9cbiAgICBnZXQgZmllbGRzKCk6IEFycmF5PEZpZWxkPiB7XG4gICAgICAgIC8vIFRPRE8oa2FzcmEpOiBpcyBpdCBjb25mdXNpbmcgdGhhdCB0aGlzIHJldHVybnMgYW4gYXJyYXksIHNpbmNlIHRoZSBvcmRlclxuICAgICAgICAvLyBpcyBhcmJpdHJhcnk/XG4gICAgICAgIC8vIFRPRE8oa2FzcmEpOiBjYWNoZSBhbmQgZnJlZXplIHRoaXMgc28gaXQgaXNuJ3QgTyhuKVxuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIHUua2V5cyh0aGlzLl9kYXRhLmZpZWxkc0J5SWQpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZ2V0RmllbGRCeUlkKGZpZWxkSWQpO1xuICAgICAgICAgICAgaW52YXJpYW50KGZpZWxkLCAnbm8gZmllbGQgbW9kZWwnICsgZmllbGRJZCk7XG4gICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG4gICAgLyoqICovXG4gICAgZ2V0RmllbGRCeUlkKGZpZWxkSWQ6IHN0cmluZyk6IEZpZWxkIHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5fZGF0YS5maWVsZHNCeUlkW2ZpZWxkSWRdKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZmllbGRNb2RlbHNCeUlkW2ZpZWxkSWRdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmllbGRNb2RlbHNCeUlkW2ZpZWxkSWRdID0gbmV3IEZpZWxkKHRoaXMuX2Jhc2VEYXRhLCB0aGlzLCBmaWVsZElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWVsZE1vZGVsc0J5SWRbZmllbGRJZF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqICovXG4gICAgZ2V0RmllbGRCeU5hbWUoZmllbGROYW1lOiBzdHJpbmcpOiBGaWVsZCB8IG51bGwge1xuICAgICAgICBmb3IgKGNvbnN0IFtmaWVsZElkLCBmaWVsZERhdGFdIG9mIHUuZW50cmllcyh0aGlzLl9kYXRhLmZpZWxkc0J5SWQpKSB7XG4gICAgICAgICAgICBpZiAoZmllbGREYXRhLm5hbWUgPT09IGZpZWxkTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZpZWxkQnlJZChmaWVsZElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHZpZXcgbW9kZWwgY29ycmVzcG9uZGluZyB0byB0aGUgdmlldyB0aGUgdXNlciBpcyBjdXJyZW50bHkgdmlld2luZ1xuICAgICAqIGluIEFpcnRhYmxlLiBNYXkgYmUgYG51bGxgIGlmIHRoZSB1c2VyIGlzIHN3aXRjaGluZyBiZXR3ZWVuXG4gICAgICogdGFibGVzIG9yIHZpZXdzLiBDYW4gYmUgd2F0Y2hlZC5cbiAgICAgKi9cbiAgICBnZXQgYWN0aXZlVmlldygpOiBWaWV3IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHthY3RpdmVWaWV3SWR9ID0gdGhpcy5fZGF0YTtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZVZpZXdJZCA/IHRoaXMuZ2V0Vmlld0J5SWQoYWN0aXZlVmlld0lkKSA6IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2aWV3cyBpbiB0aGUgdGFibGUuIENhbiBiZSB3YXRjaGVkIHRvIGtub3cgd2hlbiB2aWV3cyBhcmUgY3JlYXRlZCxcbiAgICAgKiBkZWxldGVkLCBvciByZW9yZGVyZWQuXG4gICAgICovXG4gICAgZ2V0IHZpZXdzKCk6IEFycmF5PFZpZXc+IHtcbiAgICAgICAgLy8gVE9ETyhrYXNyYSk6IGNhY2hlIGFuZCBmcmVlemUgdGhpcyBzbyBpdCBpc24ndCBPKG4pXG4gICAgICAgIGNvbnN0IHZpZXdzID0gW107XG4gICAgICAgIHRoaXMuX2RhdGEudmlld09yZGVyLmZvckVhY2godmlld0lkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmdldFZpZXdCeUlkKHZpZXdJZCk7XG4gICAgICAgICAgICBpbnZhcmlhbnQodmlldywgJ25vIHZpZXcgbWF0Y2hpbmcgaWQgaW4gdmlldyBvcmRlcicpO1xuICAgICAgICAgICAgdmlld3MucHVzaCh2aWV3KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB2aWV3cztcbiAgICB9XG4gICAgLyoqICovXG4gICAgZ2V0Vmlld0J5SWQodmlld0lkOiBzdHJpbmcpOiBWaWV3IHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5fZGF0YS52aWV3c0J5SWRbdmlld0lkXSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3ZpZXdNb2RlbHNCeUlkW3ZpZXdJZF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3TW9kZWxzQnlJZFt2aWV3SWRdID0gbmV3IFZpZXcoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VEYXRhLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICB2aWV3SWQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FpcnRhYmxlSW50ZXJmYWNlLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmlld01vZGVsc0J5SWRbdmlld0lkXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogKi9cbiAgICBnZXRWaWV3QnlOYW1lKHZpZXdOYW1lOiBzdHJpbmcpOiBWaWV3IHwgbnVsbCB7XG4gICAgICAgIGZvciAoY29uc3QgW3ZpZXdJZCwgdmlld0RhdGFdIG9mIHUuZW50cmllcyh0aGlzLl9kYXRhLnZpZXdzQnlJZCkpIHtcbiAgICAgICAgICAgIGlmICh2aWV3RGF0YS5uYW1lID09PSB2aWV3TmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZpZXdCeUlkKHZpZXdJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIHNlbGVjdChvcHRzPzogUXVlcnlSZXN1bHRPcHRzKTogVGFibGVPclZpZXdRdWVyeVJlc3VsdCB7XG4gICAgICAgIHJldHVybiBUYWJsZU9yVmlld1F1ZXJ5UmVzdWx0Ll9fY3JlYXRlT3JSZXVzZVF1ZXJ5UmVzdWx0KHRoaXMsIG9wdHMgfHwge30pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcmVjb3JkcyBpbiB0aGlzIHRhYmxlLiBUaGUgb3JkZXIgaXMgYXJiaXRyYXJ5IHNpbmNlIHJlY29yZHMgYXJlXG4gICAgICogb25seSBvcmRlcmVkIGluIHRoZSBjb250ZXh0IG9mIGEgc3BlY2lmaWMgdmlldy5cbiAgICAgKi9cbiAgICBnZXQgcmVjb3JkcygpOiBBcnJheTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgcmVjb3Jkc0J5SWQgPSB0aGlzLl9kYXRhLnJlY29yZHNCeUlkO1xuICAgICAgICBpbnZhcmlhbnQocmVjb3Jkc0J5SWQsICdSZWNvcmQgbWV0YWRhdGEgaXMgbm90IGxvYWRlZCcpO1xuICAgICAgICBjb25zdCByZWNvcmRzID0gT2JqZWN0LmtleXMocmVjb3Jkc0J5SWQpLm1hcChyZWNvcmRJZCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFJlY29yZEJ5SWQocmVjb3JkSWQpO1xuICAgICAgICAgICAgaW52YXJpYW50KHJlY29yZCwgJ3JlY29yZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZWNvcmRzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcmVjb3JkIElEcyBpbiB0aGlzIHRhYmxlLiBUaGUgb3JkZXIgaXMgYXJiaXRyYXJ5IHNpbmNlIHJlY29yZHMgYXJlXG4gICAgICogb25seSBvcmRlcmVkIGluIHRoZSBjb250ZXh0IG9mIGEgc3BlY2lmaWMgdmlldy5cbiAgICAgKi9cbiAgICBnZXQgcmVjb3JkSWRzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBjb25zdCByZWNvcmRzQnlJZCA9IHRoaXMuX2RhdGEucmVjb3Jkc0J5SWQ7XG4gICAgICAgIGludmFyaWFudChyZWNvcmRzQnlJZCwgJ1JlY29yZCBtZXRhZGF0YSBpcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhyZWNvcmRzQnlJZCk7XG4gICAgfVxuICAgIC8qKiBOdW1iZXIgb2YgcmVjb3JkcyBpbiB0aGUgdGFibGUgKi9cbiAgICBnZXQgcmVjb3JkQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkSWRzLmxlbmd0aDtcbiAgICB9XG4gICAgLyoqIE1heGltdW0gbnVtYmVyIG9mIHJlY29yZHMgdGhhdCB0aGUgdGFibGUgY2FuIGNvbnRhaW4gKi9cbiAgICBnZXQgcmVjb3JkTGltaXQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGNsaWVudFNlcnZlclNoYXJlZENvbmZpZ1NldHRpbmdzLk1BWF9OVU1fUk9XU19QRVJfVEFCTEU7XG4gICAgfVxuICAgIC8qKiBNYXhpbXVtIG51bWJlciBvZiBhZGRpdGlvbmFsIHJlY29yZHMgdGhhdCBjYW4gYmUgY3JlYXRlZCBpbiB0aGUgdGFibGUgKi9cbiAgICBnZXQgcmVtYWluaW5nUmVjb3JkTGltaXQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkTGltaXQgLSB0aGlzLnJlY29yZENvdW50O1xuICAgIH1cbiAgICAvKiogKi9cbiAgICBnZXRSZWNvcmRCeUlkKHJlY29yZElkOiBzdHJpbmcpOiBSZWNvcmQgfCBudWxsIHtcbiAgICAgICAgY29uc3QgcmVjb3Jkc0J5SWQgPSB0aGlzLl9kYXRhLnJlY29yZHNCeUlkO1xuICAgICAgICBpbnZhcmlhbnQocmVjb3Jkc0J5SWQsICdSZWNvcmQgbWV0YWRhdGEgaXMgbm90IGxvYWRlZCcpO1xuICAgICAgICBpbnZhcmlhbnQodHlwZW9mIHJlY29yZElkID09PSAnc3RyaW5nJywgJ2dldFJlY29yZEJ5SWQgZXhwZWN0cyBhIHN0cmluZycpO1xuXG4gICAgICAgIGlmICghcmVjb3Jkc0J5SWRbcmVjb3JkSWRdKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVjb3JkTW9kZWxzQnlJZFtyZWNvcmRJZF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRNb2RlbHNCeUlkW3JlY29yZElkXSA9IG5ldyBSZWNvcmQodGhpcy5fYmFzZURhdGEsIHRoaXMsIHJlY29yZElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNvcmRNb2RlbHNCeUlkW3JlY29yZElkXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogKi9cbiAgICBjYW5TZXRDZWxsVmFsdWVzKGNlbGxWYWx1ZXNCeVJlY29yZElkVGhlbkZpZWxkSWRPckZpZWxkTmFtZToge1tzdHJpbmddOiBSZWNvcmREZWZ9KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFRoaXMgdGFrZXMgdGhlIGZpZWxkIGFuZCByZWNvcmQgSURzIHRvIGZ1dHVyZS1wcm9vZiBhZ2FpbnN0IGdyYW51bGFyIHBlcm1pc3Npb25zLlxuICAgICAgICAvLyBGb3Igbm93LCBqdXN0IG5lZWQgYXQgbGVhc3QgZWRpdCBwZXJtaXNzaW9ucy5cbiAgICAgICAgY29uc3Qge2Jhc2V9ID0gZ2V0U2RrKCk7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9uSGVscGVycy5jYW4oYmFzZS5fX3Jhd1Blcm1pc3Npb25MZXZlbCwgUGVybWlzc2lvbkxldmVscy5FRElUKTtcbiAgICB9XG4gICAgLyoqICovXG4gICAgc2V0Q2VsbFZhbHVlcyhjZWxsVmFsdWVzQnlSZWNvcmRJZFRoZW5GaWVsZElkT3JGaWVsZE5hbWU6IHtcbiAgICAgICAgW3N0cmluZ106IFJlY29yZERlZixcbiAgICB9KTogQWlydGFibGVXcml0ZUFjdGlvbjx2b2lkLCB7fT4ge1xuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFibGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY2FuU2V0Q2VsbFZhbHVlcyhjZWxsVmFsdWVzQnlSZWNvcmRJZFRoZW5GaWVsZElkT3JGaWVsZE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGVybWlzc2lvbiBsZXZlbCBkb2VzIG5vdCBhbGxvdyBlZGl0aW5nIGNlbGwgdmFsdWVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaGFuZ2VzID0gW107XG4gICAgICAgIGNvbnN0IGNlbGxWYWx1ZXNCeVJlY29yZElkVGhlbkZpZWxkSWQgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBbcmVjb3JkSWQsIGNlbGxWYWx1ZXNCeUZpZWxkSWRPckZpZWxkTmFtZV0gb2YgdS5lbnRyaWVzKFxuICAgICAgICAgICAgY2VsbFZhbHVlc0J5UmVjb3JkSWRUaGVuRmllbGRJZE9yRmllbGROYW1lLFxuICAgICAgICApKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFJlY29yZEJ5SWQocmVjb3JkSWQpO1xuICAgICAgICAgICAgaWYgKCFyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY29yZCBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxsVmFsdWVzQnlSZWNvcmRJZFRoZW5GaWVsZElkW3JlY29yZElkXSA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtmaWVsZElkT3JGaWVsZE5hbWUsIHB1YmxpY0NlbGxWYWx1ZV0gb2YgdS5lbnRyaWVzKFxuICAgICAgICAgICAgICAgIGNlbGxWYWx1ZXNCeUZpZWxkSWRPckZpZWxkTmFtZSxcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX19nZXRGaWVsZE1hdGNoaW5nKGZpZWxkSWRPckZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgaW52YXJpYW50KGZpZWxkLCAnRmllbGQgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgICAgICAgICBpbnZhcmlhbnQoIWZpZWxkLmlzRGVsZXRlZCwgJ0ZpZWxkIGhhcyBiZWVuIGRlbGV0ZWQnKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQdWJsaWNDZWxsVmFsdWUgPSByZWNvcmQuZ2V0Q2VsbFZhbHVlKGZpZWxkKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gY2VsbFZhbHVlVXRpbHMudmFsaWRhdGVQdWJsaWNDZWxsVmFsdWVGb3JVcGRhdGUoXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY0NlbGxWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFB1YmxpY0NlbGxWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkYXRpb25SZXN1bHQuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodmFsaWRhdGlvblJlc3VsdC5yZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRDZWxsVmFsdWUgPSBjZWxsVmFsdWVVdGlscy5ub3JtYWxpemVQdWJsaWNDZWxsVmFsdWVGb3JVcGRhdGUoXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY0NlbGxWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFibGVzQnlJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3JlY29yZHNCeUlkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NlbGxWYWx1ZXNCeUZpZWxkSWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuaWQsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBub3JtYWxpemVkQ2VsbFZhbHVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY2VsbFZhbHVlc0J5UmVjb3JkSWRUaGVuRmllbGRJZFtyZWNvcmRJZF1bZmllbGQuaWRdID0gbm9ybWFsaXplZENlbGxWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFyZW50QmFzZS5fX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzKTtcblxuICAgICAgICAvLyBOb3cgc2VuZCB0aGUgdXBkYXRlIHRvIEFpcnRhYmxlLlxuICAgICAgICBjb25zdCBjb21wbGV0aW9uUHJvbWlzZSA9IHRoaXMuX2FpcnRhYmxlSW50ZXJmYWNlLnNldENlbGxWYWx1ZXNBc3luYyhcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICBjZWxsVmFsdWVzQnlSZWNvcmRJZFRoZW5GaWVsZElkLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGxldGlvbjogY29tcGxldGlvblByb21pc2UsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGNhbkNyZWF0ZVJlY29yZChjZWxsVmFsdWVzQnlGaWVsZElkT3JGaWVsZE5hbWU6ID9SZWNvcmREZWYpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FuQ3JlYXRlUmVjb3JkcyhcbiAgICAgICAgICAgIGNlbGxWYWx1ZXNCeUZpZWxkSWRPckZpZWxkTmFtZSA/IFtjZWxsVmFsdWVzQnlGaWVsZElkT3JGaWVsZE5hbWVdIDogMSxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgLyoqICovXG4gICAgY3JlYXRlUmVjb3JkKFxuICAgICAgICBjZWxsVmFsdWVzQnlGaWVsZElkT3JGaWVsZE5hbWU6ID9SZWNvcmREZWYsXG4gICAgKTogQWlydGFibGVXcml0ZUFjdGlvbjxcbiAgICAgICAgdm9pZCxcbiAgICAgICAge1xuICAgICAgICAgICAgcmVjb3JkOiBSZWNvcmQsXG4gICAgICAgIH0sXG4gICAgPiB7XG4gICAgICAgIGNvbnN0IHJlY29yZERlZiA9IGNlbGxWYWx1ZXNCeUZpZWxkSWRPckZpZWxkTmFtZSB8fCB7fTtcbiAgICAgICAgY29uc3Qgd3JpdGVBY3Rpb24gPSB0aGlzLmNyZWF0ZVJlY29yZHMoW3JlY29yZERlZl0pO1xuICAgICAgICBjb25zdCByZWNvcmRzID0gd3JpdGVBY3Rpb24ucmVjb3JkcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb246IHdyaXRlQWN0aW9uLmNvbXBsZXRpb24sXG4gICAgICAgICAgICByZWNvcmQ6IHJlY29yZHNbMF0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGNhbkNyZWF0ZVJlY29yZHMocmVjb3JkRGVmc09yTnVtYmVyT2ZSZWNvcmRzOiBBcnJheTxSZWNvcmREZWY+IHwgbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFRoaXMgdGFrZXMgdGhlIGZpZWxkIElEcyB0byBmdXR1cmUtcHJvb2YgYWdhaW5zdCBncmFudWxhciBwZXJtaXNzaW9ucy5cbiAgICAgICAgLy8gRm9yIG5vdywganVzdCBuZWVkIGF0IGxlYXN0IGVkaXQgcGVybWlzc2lvbnMuXG4gICAgICAgIGNvbnN0IHtiYXNlfSA9IGdldFNkaygpO1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbkhlbHBlcnMuY2FuKGJhc2UuX19yYXdQZXJtaXNzaW9uTGV2ZWwsIFBlcm1pc3Npb25MZXZlbHMuRURJVCk7XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGNyZWF0ZVJlY29yZHMoXG4gICAgICAgIHJlY29yZERlZnNPck51bWJlck9mUmVjb3JkczogQXJyYXk8UmVjb3JkRGVmPiB8IG51bWJlcixcbiAgICApOiBBaXJ0YWJsZVdyaXRlQWN0aW9uPFxuICAgICAgICB2b2lkLFxuICAgICAgICB7XG4gICAgICAgICAgICByZWNvcmRzOiBBcnJheTxSZWNvcmQ+LFxuICAgICAgICB9LFxuICAgID4ge1xuICAgICAgICBpZiAoIXRoaXMuY2FuQ3JlYXRlUmVjb3JkcyhyZWNvcmREZWZzT3JOdW1iZXJPZlJlY29yZHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGVybWlzc2lvbiBsZXZlbCBkb2VzIG5vdCBhbGxvdyBjcmVhdGluZyByZWNvcmRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IGNyZWF0aW5nIHJlY29yZHMgd2hlbiBvbmx5IGEgcmVjb3JkIG1ldGFkYXRhIG9yIGFcbiAgICAgICAgLy8gc3Vic2V0IG9mIGZpZWxkcyBhcmUgbG9hZGVkLlxuICAgICAgICBpZiAoIXRoaXMuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYmxlIGRhdGEgaXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlY29yZERlZnM7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjb3JkRGVmc09yTnVtYmVyT2ZSZWNvcmRzID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3QgbnVtRW1wdHlSZWNvcmRzVG9DcmVhdGUgPSByZWNvcmREZWZzT3JOdW1iZXJPZlJlY29yZHM7XG4gICAgICAgICAgICByZWNvcmREZWZzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUVtcHR5UmVjb3Jkc1RvQ3JlYXRlOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZWNvcmREZWZzLnB1c2goe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVjb3JkRGVmcyA9IHJlY29yZERlZnNPck51bWJlck9mUmVjb3JkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ1JlY29yZExpbWl0IDwgcmVjb3JkRGVmcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnVGFibGUgb3ZlciByZWNvcmQgbGltaXQuIENoZWNrIHJlbWFpbmluZ1JlY29yZExpbWl0IGJlZm9yZSBjcmVhdGluZyByZWNvcmRzLicsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyc2VkUmVjb3JkRGVmcyA9IFtdO1xuICAgICAgICBjb25zdCByZWNvcmRJZHMgPSBbXTtcbiAgICAgICAgY29uc3QgY2hhbmdlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJlY29yZERlZiBvZiByZWNvcmREZWZzKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsVmFsdWVzQnlGaWVsZElkID0ge307XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtmaWVsZElkT3JGaWVsZE5hbWUsIGNlbGxWYWx1ZV0gb2YgdS5lbnRyaWVzKHJlY29yZERlZikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX19nZXRGaWVsZE1hdGNoaW5nKGZpZWxkSWRPckZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgaW52YXJpYW50KGZpZWxkLCBgRmllbGQgZG9lcyBub3QgZXhpc3Q6ICR7ZmllbGRJZE9yRmllbGROYW1lfWApO1xuICAgICAgICAgICAgICAgIGludmFyaWFudCghZmllbGQuaXNEZWxldGVkLCBgRmllbGQgaGFzIGJlZW4gZGVsZXRlZDogJHtmaWVsZElkT3JGaWVsZE5hbWV9YCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50IGNlbGwgdmFsdWUgaXMgbnVsbCBzaW5jZSB0aGUgcmVjb3JkIGRvZXNuJ3QgZXhpc3QuXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IGNlbGxWYWx1ZVV0aWxzLnZhbGlkYXRlUHVibGljQ2VsbFZhbHVlRm9yVXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICBjZWxsVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHZhbGlkYXRpb25SZXN1bHQucmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjZWxsVmFsdWVzQnlGaWVsZElkW2ZpZWxkLmlkXSA9IGNlbGxWYWx1ZVV0aWxzLm5vcm1hbGl6ZVB1YmxpY0NlbGxWYWx1ZUZvclVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgY2VsbFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVjb3JkSWQgPSBoeXBlcklkLmdlbmVyYXRlUm93SWQoKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFJlY29yZERlZiA9IHtcbiAgICAgICAgICAgICAgICBpZDogcmVjb3JkSWQsXG4gICAgICAgICAgICAgICAgY2VsbFZhbHVlc0J5RmllbGRJZCxcbiAgICAgICAgICAgICAgICBjb21tZW50Q291bnQ6IDAsXG4gICAgICAgICAgICAgICAgY3JlYXRlZFRpbWU6IG5ldyBEYXRlKCkudG9KU09OKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcGFyc2VkUmVjb3JkRGVmcy5wdXNoKHBhcnNlZFJlY29yZERlZik7XG4gICAgICAgICAgICByZWNvcmRJZHMucHVzaChyZWNvcmRJZCk7XG5cbiAgICAgICAgICAgIGNoYW5nZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgcGF0aDogWyd0YWJsZXNCeUlkJywgdGhpcy5pZCwgJ3JlY29yZHNCeUlkJywgcmVjb3JkSWRdLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXJzZWRSZWNvcmREZWYsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgdmlldyBvZiB0aGlzLnZpZXdzKSB7XG4gICAgICAgICAgICBpZiAodmlldy5pc0RhdGFMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLnB1c2goLi4udmlldy5fX2dlbmVyYXRlQ2hhbmdlc0ZvclBhcmVudFRhYmxlQWRkTXVsdGlwbGVSZWNvcmRzKHJlY29yZElkcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYXJlbnRCYXNlLl9fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZXRpb25Qcm9taXNlID0gdGhpcy5fYWlydGFibGVJbnRlcmZhY2UuY3JlYXRlUmVjb3Jkc0FzeW5jKFxuICAgICAgICAgICAgdGhpcy5pZCxcbiAgICAgICAgICAgIHBhcnNlZFJlY29yZERlZnMsXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgcmVjb3JkTW9kZWxzID0gcmVjb3JkSWRzLm1hcChyZWNvcmRJZCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRNb2RlbCA9IHRoaXMuZ2V0UmVjb3JkQnlJZChyZWNvcmRJZCk7XG4gICAgICAgICAgICBpbnZhcmlhbnQocmVjb3JkTW9kZWwsICdOZXdseSBjcmVhdGVkIHJlY29yZCBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZE1vZGVsO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGxldGlvbjogY29tcGxldGlvblByb21pc2UsXG4gICAgICAgICAgICByZWNvcmRzOiByZWNvcmRNb2RlbHMsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIGNhbkRlbGV0ZVJlY29yZChyZWNvcmQ6IFJlY29yZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5EZWxldGVSZWNvcmRzKFtyZWNvcmRdKTtcbiAgICB9XG4gICAgLyoqICovXG4gICAgZGVsZXRlUmVjb3JkKHJlY29yZDogUmVjb3JkKTogQWlydGFibGVXcml0ZUFjdGlvbjx2b2lkLCB7fT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxldGVSZWNvcmRzKFtyZWNvcmRdKTtcbiAgICB9XG4gICAgLyoqICovXG4gICAgY2FuRGVsZXRlUmVjb3JkcyhyZWNvcmRzOiBBcnJheTxSZWNvcmQ+KSB7XG4gICAgICAgIC8vIFRoaXMgdGFrZXMgdGhlIHJlY29yZHMgdG8gZnV0dXJlLXByb29mIGFnYWluc3QgZ3JhbnVsYXIgcGVybWlzc2lvbnMuXG4gICAgICAgIC8vIEZvciBub3csIGp1c3QgbmVlZCBhdCBsZWFzdCBlZGl0IHBlcm1pc3Npb25zLlxuICAgICAgICBjb25zdCB7YmFzZX0gPSBnZXRTZGsoKTtcbiAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25IZWxwZXJzLmNhbihiYXNlLl9fcmF3UGVybWlzc2lvbkxldmVsLCBQZXJtaXNzaW9uTGV2ZWxzLkVESVQpO1xuICAgIH1cbiAgICAvKiogKi9cbiAgICBkZWxldGVSZWNvcmRzKHJlY29yZHM6IEFycmF5PFJlY29yZD4pOiBBaXJ0YWJsZVdyaXRlQWN0aW9uPHZvaWQsIHt9PiB7XG4gICAgICAgIGlmICghdGhpcy5jYW5EZWxldGVSZWNvcmRzKHJlY29yZHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgcGVybWlzc2lvbiBsZXZlbCBkb2VzIG5vdCBhbGxvdyBkZWxldGluZyByZWNvcmRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IGRlbGV0aW5nIHJlY29yZHMgd2hlbiBvbmx5IGEgcmVjb3JkIG1ldGFkYXRhIG9yIGFcbiAgICAgICAgLy8gc3Vic2V0IG9mIGZpZWxkcyBhcmUgbG9hZGVkLlxuICAgICAgICBpZiAoIXRoaXMuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYmxlIGRhdGEgaXMgbm90IGxvYWRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkSWRzID0gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHJlY29yZC5pZCk7XG5cbiAgICAgICAgY29uc3QgY2hhbmdlcyA9IHJlY29yZElkcy5tYXAocmVjb3JkSWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtwYXRoOiBbJ3RhYmxlc0J5SWQnLCB0aGlzLmlkLCAncmVjb3Jkc0J5SWQnLCByZWNvcmRJZF0sIHZhbHVlOiB1bmRlZmluZWR9O1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IHZpZXcgb2YgdGhpcy52aWV3cykge1xuICAgICAgICAgICAgaWYgKHZpZXcuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAuLi52aWV3Ll9fZ2VuZXJhdGVDaGFuZ2VzRm9yUGFyZW50VGFibGVEZWxldGVNdWx0aXBsZVJlY29yZHMocmVjb3JkSWRzKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYXJlbnRCYXNlLl9fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZXRpb25Qcm9taXNlID0gdGhpcy5fYWlydGFibGVJbnRlcmZhY2UuZGVsZXRlUmVjb3Jkc0FzeW5jKHRoaXMuaWQsIHJlY29yZElkcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21wbGV0aW9uOiBjb21wbGV0aW9uUHJvbWlzZSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqICovXG4gICAgZ2V0Rmlyc3RWaWV3T2ZUeXBlKGFsbG93ZWRWaWV3VHlwZXM6IEFycmF5PFZpZXdUeXBlPiB8IFZpZXdUeXBlKTogVmlldyB8IG51bGwge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWxsb3dlZFZpZXdUeXBlcykpIHtcbiAgICAgICAgICAgIGFsbG93ZWRWaWV3VHlwZXMgPSAoW2FsbG93ZWRWaWV3VHlwZXNdOiBBcnJheTxWaWV3VHlwZT4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHUuZmluZCh0aGlzLnZpZXdzLCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdS5pbmNsdWRlcyhhbGxvd2VkVmlld1R5cGVzLCB2aWV3LnR5cGUpO1xuICAgICAgICAgICAgfSkgfHwgbnVsbFxuICAgICAgICApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgYWN0aXZlVmlldydzIHR5cGUgaXMgaW4gYWxsb3dlZFZpZXdUeXBlcywgdGhlbiB0aGUgYWN0aXZlVmlld1xuICAgICAqIGlzIHJldHVybmVkLiBPdGhlcndpc2UsIHRoZSBmaXJzdCB2aWV3IHdob3NlIHR5cGUgaXMgaW4gYWxsb3dlZFZpZXdUeXBlc1xuICAgICAqIHdpbGwgYmUgcmV0dXJuZWQuIFJldHVybnMgbnVsbCBpZiBubyB2aWV3IHNhdGlzZnlpbmcgYWxsb3dlZFZpZXdUeXBlc1xuICAgICAqIGV4aXN0cy5cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0Vmlld09mVHlwZShhbGxvd2VkVmlld1R5cGVzOiBBcnJheTxWaWV3VHlwZT4gfCBWaWV3VHlwZSk6IFZpZXcgfCBudWxsIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFsbG93ZWRWaWV3VHlwZXMpKSB7XG4gICAgICAgICAgICBhbGxvd2VkVmlld1R5cGVzID0gKFthbGxvd2VkVmlld1R5cGVzXTogQXJyYXk8Vmlld1R5cGU+KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLmFjdGl2ZVZpZXc7XG4gICAgICAgIGlmIChhY3RpdmVWaWV3ICYmIHUuaW5jbHVkZXMoYWxsb3dlZFZpZXdUeXBlcywgYWN0aXZlVmlldy50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZVZpZXc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGaXJzdFZpZXdPZlR5cGUoYWxsb3dlZFZpZXdUeXBlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRXhwZXJpbWVudGFsLCBkbyBub3QgZG9jdW1lbnQgeWV0LiBBbGxvd3MgZmV0Y2hpbmcgZGVmYXVsdCBjZWxsIHZhbHVlcyBmb3JcbiAgICAvLyBhIHRhYmxlIG9yIHZpZXcuIEJlZm9yZSBkb2N1bWVudGluZywgd2Ugc2hvdWxkIGV4cGxvcmUgbWFraW5nIHRoaXMgc3luY2hyb25vdXMuXG4gICAgYXN5bmMgZ2V0RGVmYXVsdENlbGxWYWx1ZXNCeUZpZWxkSWRBc3luYyhvcHRzPzoge1xuICAgICAgICB2aWV3PzogVmlldyB8IG51bGwsXG4gICAgfSk6IFByb21pc2U8e1tzdHJpbmddOiBtaXhlZH0+IHtcbiAgICAgICAgY29uc3Qgdmlld0lkID0gb3B0cyAmJiBvcHRzLnZpZXcgPyBvcHRzLnZpZXcuaWQgOiBudWxsO1xuICAgICAgICBjb25zdCBjZWxsVmFsdWVzQnlGaWVsZElkID0gYXdhaXQgdGhpcy5fYWlydGFibGVJbnRlcmZhY2UuZmV0Y2hEZWZhdWx0Q2VsbFZhbHVlc0J5RmllbGRJZEFzeW5jKFxuICAgICAgICAgICAgdGhpcy5faWQsXG4gICAgICAgICAgICB2aWV3SWQsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBjZWxsVmFsdWVzQnlGaWVsZElkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWNvcmQgbWV0YWRhdGEgbWVhbnMgcmVjb3JkIElEcywgY3JlYXRlZFRpbWUsIGFuZCBjb21tZW50Q291bnQgYXJlIGxvYWRlZC5cbiAgICAgKiBSZWNvcmQgbWV0YWRhdGEgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIGNyZWF0aW5nLCBkZWxldGluZywgb3IgdXBkYXRpbmcgcmVjb3Jkcy5cbiAgICAgKi9cbiAgICBnZXQgaXNSZWNvcmRNZXRhZGF0YUxvYWRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGF0YS5yZWNvcmRzQnlJZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTG9hZHMgcmVjb3JkIG1ldGFkYXRhLiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gcmVjb3JkXG4gICAgICogbWV0YWRhdGEgaXMgbG9hZGVkLlxuICAgICAqL1xuICAgIGFzeW5jIGxvYWRSZWNvcmRNZXRhZGF0YUFzeW5jKCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNBc3luYyhbXG4gICAgICAgICAgICB0aGlzLl9nZXRGaWVsZElkRm9yQ2F1c2luZ1JlY29yZE1ldGFkYXRhVG9Mb2FkKCksXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICAvKiogVW5sb2FkcyByZWNvcmQgbWV0YWRhdGEuICovXG4gICAgdW5sb2FkUmVjb3JkTWV0YWRhdGEoKSB7XG4gICAgICAgIHRoaXMudW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHMoW3RoaXMuX2dldEZpZWxkSWRGb3JDYXVzaW5nUmVjb3JkTWV0YWRhdGFUb0xvYWQoKV0pO1xuICAgIH1cbiAgICBfZ2V0RmllbGRJZEZvckNhdXNpbmdSZWNvcmRNZXRhZGF0YVRvTG9hZCgpOiBzdHJpbmcge1xuICAgICAgICAvLyBBcyBhIHNob3J0Y3V0LCB3ZSdsbCBsb2FkIHRoZSBwcmltYXJ5IGZpZWxkIGNlbGwgdmFsdWVzIHRvXG4gICAgICAgIC8vIGNhdXNlIHJlY29yZCBtZXRhZGF0YSAoaWQsIGNyZWF0ZWRUaW1lLCBjb21tZW50Q291bnQpIHRvIGJlIGxvYWRlZFxuICAgICAgICAvLyBhbmQgc3Vic2NyaWJlZCB0by4gSW4gdGhlIGZ1dHVyZSwgd2UgY291bGQgYWRkIGFuIGV4cGxpY2l0IG1vZGVsXG4gICAgICAgIC8vIGJyaWRnZSB0byBmZXRjaCBhbmQgc3Vic2NyaWJlIHRvIHJvdyBtZXRhZGF0YS5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByaW1hcnlGaWVsZElkO1xuICAgIH1cbiAgICAvKiogKi9cbiAgICBhcmVDZWxsVmFsdWVzTG9hZGVkRm9yRmllbGRJZChmaWVsZElkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNEYXRhTG9hZGVkIHx8IHRoaXMuX2FyZUNlbGxWYWx1ZXNMb2FkZWRCeUZpZWxkSWRbZmllbGRJZF0gfHwgZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYSBsb3ctbGV2ZWwgQVBJLiBJbiBtb3N0IGNhc2VzLCB1c2luZyBhIGBRdWVyeVJlc3VsdGAgb2J0YWluZWQgYnlcbiAgICAgKiBjYWxsaW5nIGB0YWJsZS5zZWxlY3RgIG9yIGB2aWV3LnNlbGVjdGAgaXMgcHJlZmVycmVkLlxuICAgICAqL1xuICAgIGFzeW5jIGxvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jKGZpZWxkSWRzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgIGNvbnN0IHBlbmRpbmdMb2FkUHJvbWlzZXM6IEFycmF5PFByb21pc2U8QXJyYXk8V2F0Y2hhYmxlVGFibGVLZXk+Pj4gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIGZpZWxkSWRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2VsbFZhbHVlc1JldGFpbkNvdW50QnlGaWVsZElkW2ZpZWxkSWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jZWxsVmFsdWVzUmV0YWluQ291bnRCeUZpZWxkSWRbZmllbGRJZF0rKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbFZhbHVlc1JldGFpbkNvdW50QnlGaWVsZElkW2ZpZWxkSWRdID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTk9URTogd2UgZG9uJ3QgdXNlIHRoaXMuYXJlQ2VsbFZhbHVlc0xvYWRlZEZvckZpZWxkSWQoKSBoZXJlIGJlY2F1c2VcbiAgICAgICAgICAgIC8vIHRoYXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgY2VsbCB2YWx1ZXMgYXJlIGxvYWRlZCBhcyBhIHJlc3VsdFxuICAgICAgICAgICAgLy8gb2YgdGhlIGVudGlyZSB0YWJsZSBiZWluZyBsb2FkZWQuIEluIHRoYXQgc2NlbmFyaW8sIHdlIHN0aWxsXG4gICAgICAgICAgICAvLyB3YW50IHRvIHNlcGFyYXRlbHkgbG9hZCB0aGUgY2VsbCB2YWx1ZXMgZm9yIHRoZSBmaWVsZCBzbyB0aGVyZVxuICAgICAgICAgICAgLy8gaXMgYSBzZXBhcmF0ZSBzdWJzY3JpcHRpb24uIE90aGVyd2lzZSwgd2hlbiB0aGUgdGFibGUgZGF0YSB1bmxvYWRzLFxuICAgICAgICAgICAgLy8gdGhlIGZpZWxkIGRhdGEgd291bGQgdW5sb2FkIGFzIHdlbGwuIFRoaXMgY2FuIGJlIGltcHJvdmVkIGJ5IGp1c3RcbiAgICAgICAgICAgIC8vIHN1YnNjcmliaW5nIHRvIHRoZSBmaWVsZCBkYXRhIHdpdGhvdXQgZmV0Y2hpbmcgaXQsIHNpbmNlIHRoZSBjZWxsXG4gICAgICAgICAgICAvLyB2YWx1ZXMgYXJlIGFscmVhZHkgaW4gdGhlIGJsb2NrIGZyYW1lLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9hcmVDZWxsVmFsdWVzTG9hZGVkQnlGaWVsZElkW2ZpZWxkSWRdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGVuZGluZ0xvYWRQcm9taXNlID0gdGhpcy5fcGVuZGluZ0NlbGxWYWx1ZXNMb2FkUHJvbWlzZUJ5RmllbGRJZFtmaWVsZElkXTtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ0xvYWRQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdMb2FkUHJvbWlzZXMucHVzaChwZW5kaW5nTG9hZFByb21pc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkSWRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nLnB1c2goZmllbGRJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZElkc1doaWNoQXJlTm90QWxyZWFkeUxvYWRlZE9yTG9hZGluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBDb3VsZCBpbmxpbmUgX2xvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jLCBidXQgZm9sbG93aW5nIHRoZVxuICAgICAgICAgICAgLy8gcGF0dGVybiBmcm9tIEFic3RyYWN0TW9kZWxXaXRoQXN5bmNEYXRhIHdoZXJlIHRoZSBwdWJsaWMgbWV0aG9kXG4gICAgICAgICAgICAvLyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgcmV0YWluIGNvdW50cyBhbmQgdGhlIHByaXZhdGUgbWV0aG9kXG4gICAgICAgICAgICAvLyBhY3R1YWxseSBmZXRjaGVzIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBsb2FkRmllbGRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nUHJvbWlzZSA9IHRoaXMuX2xvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jKFxuICAgICAgICAgICAgICAgIGZpZWxkSWRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHBlbmRpbmdMb2FkUHJvbWlzZXMucHVzaChsb2FkRmllbGRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nUHJvbWlzZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpZWxkSWQgb2YgZmllbGRJZHNXaGljaEFyZU5vdEFscmVhZHlMb2FkZWRPckxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nQ2VsbFZhbHVlc0xvYWRQcm9taXNlQnlGaWVsZElkW1xuICAgICAgICAgICAgICAgICAgICBmaWVsZElkXG4gICAgICAgICAgICAgICAgXSA9IGxvYWRGaWVsZHNXaGljaEFyZU5vdEFscmVhZHlMb2FkZWRPckxvYWRpbmdQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRG9pbmcgYC50aGVuYCBpbnN0ZWFkIG9mIHBlcmZvcm1pbmcgdGhlc2UgYWN0aW9ucyBkaXJlY3RseSBpblxuICAgICAgICAgICAgLy8gX2xvYWRDZWxsVmFsdWVzSW5GaWVsZElkc0FzeW5jIHNvIHRoaXMgaXMgc2ltaWxhciB0b1xuICAgICAgICAgICAgLy8gQWJzdHJhY3RNb2RlbFdpdGhBc3luY0RhdGEuIFRoZSBpZGVhIGlzIHRvIHJlZmFjdG9yIHRvIGF2b2lkIGNvZGVcbiAgICAgICAgICAgIC8vIGR1cGxpY2F0aW9uLCBzbyBrZWVwaW5nIHRoZW0gc2ltaWxhciBmb3Igbm93IGhvcGVmdWxseSB3aWxsIG1ha2UgdGhlXG4gICAgICAgICAgICAvLyByZWZhY3RvciBzaW1wbGVyLlxuICAgICAgICAgICAgbG9hZEZpZWxkc1doaWNoQXJlTm90QWxyZWFkeUxvYWRlZE9yTG9hZGluZ1Byb21pc2UudGhlbihjaGFuZ2VkS2V5cyA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIGZpZWxkSWRzV2hpY2hBcmVOb3RBbHJlYWR5TG9hZGVkT3JMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FyZUNlbGxWYWx1ZXNMb2FkZWRCeUZpZWxkSWRbZmllbGRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nQ2VsbFZhbHVlc0xvYWRQcm9taXNlQnlGaWVsZElkW2ZpZWxkSWRdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGNoYW5nZWRLZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocGVuZGluZ0xvYWRQcm9taXNlcyk7XG4gICAgfVxuICAgIGFzeW5jIF9sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNBc3luYyhcbiAgICAgICAgZmllbGRJZHM6IEFycmF5PHN0cmluZz4sXG4gICAgKTogUHJvbWlzZTxBcnJheTxXYXRjaGFibGVUYWJsZUtleT4+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgcmVjb3Jkc0J5SWQ6IG5ld1JlY29yZHNCeUlkLFxuICAgICAgICB9ID0gYXdhaXQgdGhpcy5fYWlydGFibGVJbnRlcmZhY2UuZmV0Y2hBbmRTdWJzY3JpYmVUb0NlbGxWYWx1ZXNJbkZpZWxkc0FzeW5jKFxuICAgICAgICAgICAgdGhpcy5faWQsXG4gICAgICAgICAgICBmaWVsZElkcyxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBNZXJnZSB3aXRoIGV4aXN0aW5nIGRhdGEuXG4gICAgICAgIGlmICghdGhpcy5fZGF0YS5yZWNvcmRzQnlJZCkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YS5yZWNvcmRzQnlJZCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHtyZWNvcmRzQnlJZDogZXhpc3RpbmdSZWNvcmRzQnlJZH0gPSB0aGlzLl9kYXRhO1xuICAgICAgICB1LnVuc2FmZUVhY2goKG5ld1JlY29yZHNCeUlkOiB7W1JlY29yZElkXTogUmVjb3JkRGF0YX0pLCAobmV3UmVjb3JkT2JqLCByZWNvcmRJZCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1LmhhcyhleGlzdGluZ1JlY29yZHNCeUlkLCByZWNvcmRJZCkpIHtcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlY29yZHNCeUlkW3JlY29yZElkXSA9IG5ld1JlY29yZE9iajtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdSZWNvcmRPYmogPSBleGlzdGluZ1JlY29yZHNCeUlkW3JlY29yZElkXTtcbiAgICAgICAgICAgICAgICAvLyBNZXRhZGF0YSAoY3JlYXRlZFRpbWUsIGNvbW1lbnRDb3VudCkgc2hvdWxkIGFscmVhZHkgYmUgdXAgdG8gZGF0ZSxcbiAgICAgICAgICAgICAgICAvLyBidXQganVzdCB2ZXJpZnkgZm9yIHNhbml0eS4gSWYgdGhpcyBkb2Vzbid0IGNhdGNoIGFueXRoaW5nLCBjYW5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQgZm9yIHBlcmYuXG4gICAgICAgICAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1JlY29yZE9iai5jb21tZW50Q291bnQgPT09IG5ld1JlY29yZE9iai5jb21tZW50Q291bnQsXG4gICAgICAgICAgICAgICAgICAgICdjb21tZW50IGNvdW50IG91dCBvZiBzeW5jJyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdSZWNvcmRPYmouY3JlYXRlZFRpbWUgPT09IG5ld1JlY29yZE9iai5jcmVhdGVkVGltZSxcbiAgICAgICAgICAgICAgICAgICAgJ2NyZWF0ZWQgdGltZSBvdXQgb2Ygc3luYycsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nUmVjb3JkT2JqLmNlbGxWYWx1ZXNCeUZpZWxkSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdSZWNvcmRPYmouY2VsbFZhbHVlc0J5RmllbGRJZCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ0NlbGxWYWx1ZXNCeUZpZWxkSWQgPSBleGlzdGluZ1JlY29yZE9iai5jZWxsVmFsdWVzQnlGaWVsZElkO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRJZCA9IGZpZWxkSWRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ0NlbGxWYWx1ZXNCeUZpZWxkSWRbZmllbGRJZF0gPSBuZXdSZWNvcmRPYmouY2VsbFZhbHVlc0J5RmllbGRJZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBuZXdSZWNvcmRPYmouY2VsbFZhbHVlc0J5RmllbGRJZFtmaWVsZElkXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjaGFuZ2VkS2V5cyA9IGZpZWxkSWRzLm1hcChmaWVsZElkID0+IFdhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4ICsgZmllbGRJZCk7XG4gICAgICAgIC8vIE5lZWQgdG8gdHJpZ2dlciBvbkNoYW5nZSBmb3IgcmVjb3JkcyBhbmQgcmVjb3JkSWRzIHNpbmNlIHdhdGNoaW5nIGVpdGhlclxuICAgICAgICAvLyBvZiB0aG9zZSBjYXVzZXMgcmVjb3JkIG1ldGFkYXRhIHRvIGJlIGxvYWRlZCAodmlhIF9nZXRGaWVsZElkRm9yQ2F1c2luZ1JlY29yZE1ldGFkYXRhVG9Mb2FkKVxuICAgICAgICAvLyBhbmQgYnkgY29udmVudGlvbiB3ZSB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50IHdoZW4gZGF0YSBsb2Fkcy5cbiAgICAgICAgY2hhbmdlZEtleXMucHVzaChXYXRjaGFibGVUYWJsZUtleXMucmVjb3Jkcyk7XG4gICAgICAgIGNoYW5nZWRLZXlzLnB1c2goV2F0Y2hhYmxlVGFibGVLZXlzLnJlY29yZElkcyk7XG4gICAgICAgIC8vIEFsc28gdHJpZ2dlciBjZWxsVmFsdWVzIGNoYW5nZXMgc2luY2UgdGhlIGNlbGwgdmFsdWVzIGluIHRoZSBmaWVsZHNcbiAgICAgICAgLy8gYXJlIG5vdyBsb2FkZWQuXG4gICAgICAgIGNoYW5nZWRLZXlzLnB1c2goV2F0Y2hhYmxlVGFibGVLZXlzLmNlbGxWYWx1ZXMpO1xuICAgICAgICByZXR1cm4gY2hhbmdlZEtleXM7XG4gICAgfVxuICAgIC8qKiAqL1xuICAgIHVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKGZpZWxkSWRzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzV2l0aFplcm9SZXRhaW5Db3VudDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkSWQgb2YgZmllbGRJZHMpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZFJldGFpbkNvdW50ID0gdGhpcy5fY2VsbFZhbHVlc1JldGFpbkNvdW50QnlGaWVsZElkW2ZpZWxkSWRdIHx8IDA7XG4gICAgICAgICAgICBmaWVsZFJldGFpbkNvdW50LS07XG5cbiAgICAgICAgICAgIGlmIChmaWVsZFJldGFpbkNvdW50IDwgMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaWVsZCBkYXRhIG92ZXItcmVsZWFzZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgZmllbGRSZXRhaW5Db3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jZWxsVmFsdWVzUmV0YWluQ291bnRCeUZpZWxkSWRbZmllbGRJZF0gPSBmaWVsZFJldGFpbkNvdW50O1xuXG4gICAgICAgICAgICBpZiAoZmllbGRSZXRhaW5Db3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZpZWxkSWRzV2l0aFplcm9SZXRhaW5Db3VudC5wdXNoKGZpZWxkSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZElkc1dpdGhaZXJvUmV0YWluQ291bnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gRG9uJ3QgdW5sb2FkIGltbWVkaWF0ZWx5LiBXYWl0IGEgd2hpbGUgaW4gY2FzZSBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgLy8gcmVxdWVzdHMgdGhlIGRhdGEsIHNvIHdlIGNhbiBhdm9pZCBnb2luZyBiYWNrIHRvIGxpdmVhcHAgb3JcbiAgICAgICAgICAgIC8vIHRoZSBuZXR3b3JrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSByZXRhaW4gY291bnQgaXMgc3RpbGwgemVybywgc2luY2UgaXQgbWF5XG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBiZWVuIGluY3JlbWVudGVkIGJlZm9yZSB0aGUgdGltZW91dCBmaXJlZC5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZElkc1RvVW5sb2FkID0gZmllbGRJZHNXaXRoWmVyb1JldGFpbkNvdW50LmZpbHRlcihmaWVsZElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxWYWx1ZXNSZXRhaW5Db3VudEJ5RmllbGRJZFtmaWVsZElkXSA9PT0gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRJZHNUb1VubG9hZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBfYXJlQ2VsbFZhbHVlc0xvYWRlZEJ5RmllbGRJZCB0byBmYWxzZSBiZWZvcmUgY2FsbGluZyBfdW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNcbiAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgX3VubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzIHdpbGwgY2hlY2sgaWYgKmFueSogZmllbGRzIGFyZSBzdGlsbCBsb2FkZWQuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGRJZCBvZiBmaWVsZElkc1RvVW5sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcmVDZWxsVmFsdWVzTG9hZGVkQnlGaWVsZElkW2ZpZWxkSWRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5sb2FkQ2VsbFZhbHVlc0luRmllbGRJZHMoZmllbGRJZHNUb1VubG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgQWJzdHJhY3RNb2RlbFdpdGhBc3luY0RhdGEuX19EQVRBX1VOTE9BRF9ERUxBWV9NUyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3VubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKGZpZWxkSWRzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIHRoaXMuX2FpcnRhYmxlSW50ZXJmYWNlLnVuc3Vic2NyaWJlRnJvbUNlbGxWYWx1ZXNJbkZpZWxkcyh0aGlzLl9pZCwgZmllbGRJZHMpO1xuICAgICAgICB0aGlzLl9hZnRlclVubG9hZERhdGFPclVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKGZpZWxkSWRzKTtcbiAgICB9XG4gICAgYXN5bmMgX2xvYWREYXRhQXN5bmMoKTogUHJvbWlzZTxBcnJheTxXYXRjaGFibGVUYWJsZUtleT4+IHtcbiAgICAgICAgY29uc3QgdGFibGVEYXRhID0gYXdhaXQgdGhpcy5fYWlydGFibGVJbnRlcmZhY2UuZmV0Y2hBbmRTdWJzY3JpYmVUb1RhYmxlRGF0YUFzeW5jKHRoaXMuX2lkKTtcbiAgICAgICAgdGhpcy5fZGF0YS5yZWNvcmRzQnlJZCA9IHRhYmxlRGF0YS5yZWNvcmRzQnlJZDtcblxuICAgICAgICBjb25zdCBjaGFuZ2VkS2V5cyA9IFtcbiAgICAgICAgICAgIFdhdGNoYWJsZVRhYmxlS2V5cy5yZWNvcmRzLFxuICAgICAgICAgICAgV2F0Y2hhYmxlVGFibGVLZXlzLnJlY29yZElkcyxcbiAgICAgICAgICAgIFdhdGNoYWJsZVRhYmxlS2V5cy5jZWxsVmFsdWVzLFxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAoY29uc3QgZmllbGRJZCBvZiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhLmZpZWxkc0J5SWQpKSB7XG4gICAgICAgICAgICBjaGFuZ2VkS2V5cy5wdXNoKFdhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4ICsgZmllbGRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hhbmdlZEtleXM7XG4gICAgfVxuICAgIF91bmxvYWREYXRhKCkge1xuICAgICAgICB0aGlzLl9haXJ0YWJsZUludGVyZmFjZS51bnN1YnNjcmliZUZyb21UYWJsZURhdGEodGhpcy5faWQpO1xuICAgICAgICB0aGlzLl9hZnRlclVubG9hZERhdGFPclVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKCk7XG4gICAgfVxuICAgIF9hZnRlclVubG9hZERhdGFPclVubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzKHVubG9hZGVkRmllbGRJZHM/OiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IGFyZUFueUZpZWxkc0xvYWRlZCA9XG4gICAgICAgICAgICB0aGlzLmlzRGF0YUxvYWRlZCB8fFxuICAgICAgICAgICAgdS5zb21lKHUudmFsdWVzKHRoaXMuX2FyZUNlbGxWYWx1ZXNMb2FkZWRCeUZpZWxkSWQpLCBpc0xvYWRlZCA9PiBpc0xvYWRlZCk7XG4gICAgICAgIGlmICghdGhpcy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIGlmICghYXJlQW55RmllbGRzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YS5yZWNvcmRzQnlJZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNEYXRhTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZpZWxkSWRzVG9DbGVhcjtcbiAgICAgICAgICAgICAgICBpZiAodW5sb2FkZWRGaWVsZElkcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWZpYyBmaWVsZHMgd2VyZSB1bmxvYWRlZCwgc28gY2xlYXIgb3V0IHRoZSBjZWxsIHZhbHVlcyBmb3IgdGhvc2UgZmllbGRzLlxuICAgICAgICAgICAgICAgICAgICBmaWVsZElkc1RvQ2xlYXIgPSB1bmxvYWRlZEZpZWxkSWRzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlbnRpcmUgdGFibGUgd2FzIHVubG9hZGVkLCBidXQgc29tZSBpbmRpdmlkdWFsIGZpZWxkcyBhcmUgc3RpbGwgbG9hZGVkLlxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGNsZWFyIG91dCB0aGUgY2VsbCB2YWx1ZXMgb2YgZXZlcnkgZmllbGQgdGhhdCB3YXMgdW5sb2FkZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMga2luZCBvZiBzbG93LCBidXQgaG9wZWZ1bGx5IHVuY29tbW9uLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZElkcyA9IE9iamVjdC5rZXlzKHRoaXMuX2RhdGEuZmllbGRzQnlJZCk7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkSWRzVG9DbGVhciA9IGZpZWxkSWRzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSWQgPT4gIXRoaXMuX2FyZUNlbGxWYWx1ZXNMb2FkZWRCeUZpZWxkSWRbZmllbGRJZF0sXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHUudW5zYWZlRWFjaCh0aGlzLl9kYXRhLnJlY29yZHNCeUlkLCByZWNvcmRPYmogPT4ge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkSWRzVG9DbGVhci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRJZCA9IGZpZWxkSWRzVG9DbGVhcltpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmRPYmouY2VsbFZhbHVlc0J5RmllbGRJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZE9iai5jZWxsVmFsdWVzQnlGaWVsZElkW2ZpZWxkSWRdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcmVBbnlGaWVsZHNMb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY29yZE1vZGVsc0J5SWQgPSB7fTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfX2dldEZpZWxkTWF0Y2hpbmcoZmllbGRPckZpZWxkSWRPckZpZWxkTmFtZTogRmllbGQgfCBzdHJpbmcpOiBGaWVsZCB8IG51bGwge1xuICAgICAgICBsZXQgZmllbGQ6IEZpZWxkIHwgbnVsbDtcbiAgICAgICAgaWYgKGZpZWxkT3JGaWVsZElkT3JGaWVsZE5hbWUgaW5zdGFuY2VvZiBGaWVsZCkge1xuICAgICAgICAgICAgZmllbGQgPSBmaWVsZE9yRmllbGRJZE9yRmllbGROYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGQgPVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGRCeUlkKGZpZWxkT3JGaWVsZElkT3JGaWVsZE5hbWUpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRGaWVsZEJ5TmFtZShmaWVsZE9yRmllbGRJZE9yRmllbGROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgfVxuICAgIF9fZ2V0Vmlld01hdGNoaW5nKHZpZXdPclZpZXdJZE9yVmlld05hbWU6IFZpZXcgfCBzdHJpbmcpOiBWaWV3IHwgbnVsbCB7XG4gICAgICAgIGxldCB2aWV3OiBWaWV3IHwgbnVsbDtcbiAgICAgICAgaWYgKHZpZXdPclZpZXdJZE9yVmlld05hbWUgaW5zdGFuY2VvZiBWaWV3KSB7XG4gICAgICAgICAgICB2aWV3ID0gdmlld09yVmlld0lkT3JWaWV3TmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Vmlld0J5SWQodmlld09yVmlld0lkT3JWaWV3TmFtZSkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmdldFZpZXdCeU5hbWUodmlld09yVmlld0lkT3JWaWV3TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICAgIF9fdHJpZ2dlck9uQ2hhbmdlRm9yRGlydHlQYXRocyhkaXJ0eVBhdGhzOiBPYmplY3QpIHtcbiAgICAgICAgaWYgKGRpcnR5UGF0aHMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlVGFibGVLZXlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJ0eVBhdGhzLmFjdGl2ZVZpZXdJZCkge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlVGFibGVLZXlzLmFjdGl2ZVZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJ0eVBhdGhzLnZpZXdPcmRlcikge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlVGFibGVLZXlzLnZpZXdzKTtcblxuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGVsZXRlZCB2aWV3c1xuICAgICAgICAgICAgZm9yIChjb25zdCBbdmlld0lkLCB2aWV3TW9kZWxdIG9mIHUuZW50cmllcyh0aGlzLl92aWV3TW9kZWxzQnlJZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmlld01vZGVsLmlzRGVsZXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdmlld01vZGVsc0J5SWRbdmlld0lkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcnR5UGF0aHMudmlld3NCeUlkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFt2aWV3SWQsIGRpcnR5Vmlld1BhdGhzXSBvZiB1LmVudHJpZXMoZGlydHlQYXRocy52aWV3c0J5SWQpKSB7XG4gICAgICAgICAgICAgICAgLy8gRGlyZWN0bHkgYWNjZXNzIGZyb20gX3ZpZXdNb2RlbHNCeUlkIHRvIGF2b2lkIGNyZWF0aW5nXG4gICAgICAgICAgICAgICAgLy8gYSB2aWV3IG1vZGVsIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gSWYgaXQgZG9lc24ndCBleGlzdCxcbiAgICAgICAgICAgICAgICAvLyBub3RoaW5nIGNhbiBiZSBzdWJzY3JpYmVkIHRvIGFueSBldmVudHMgb24gaXQuXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuX3ZpZXdNb2RlbHNCeUlkW3ZpZXdJZF07XG4gICAgICAgICAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5fX3RyaWdnZXJPbkNoYW5nZUZvckRpcnR5UGF0aHMoZGlydHlWaWV3UGF0aHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlydHlQYXRocy5maWVsZHNCeUlkKSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0YWJsZXMgZG9uJ3QgaGF2ZSBhIGZpZWxkIG9yZGVyLCBuZWVkIHRvIGRldGVjdCBpZiBhIGZpZWxkXG4gICAgICAgICAgICAvLyB3YXMgY3JlYXRlZCBvciBkZWxldGVkIGFuZCB0cmlnZ2VyIG9uQ2hhbmdlIGZvciBmaWVsZHMuXG4gICAgICAgICAgICBjb25zdCBhZGRlZEZpZWxkSWRzID0gW107XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkRmllbGRJZHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2ZpZWxkSWQsIGRpcnR5RmllbGRQYXRoc10gb2YgdS5lbnRyaWVzKGRpcnR5UGF0aHMuZmllbGRzQnlJZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGlydHlGaWVsZFBhdGhzLl9pc0RpcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbnRpcmUgZmllbGQgaXMgZGlydHksIGl0IHdhcyBlaXRoZXIgY3JlYXRlZCBvciBkZWxldGVkLlxuICAgICAgICAgICAgICAgICAgICBpZiAodS5oYXModGhpcy5fZGF0YS5maWVsZHNCeUlkLCBmaWVsZElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRGaWVsZElkcy5wdXNoKGZpZWxkSWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZEZpZWxkSWRzLnB1c2goZmllbGRJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkTW9kZWwgPSB0aGlzLl9maWVsZE1vZGVsc0J5SWRbZmllbGRJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgRmllbGQgbW9kZWwgaWYgaXQgd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2ZpZWxkTW9kZWxzQnlJZFtmaWVsZElkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERpcmVjdGx5IGFjY2VzcyBmcm9tIF9maWVsZE1vZGVsc0J5SWQgdG8gYXZvaWQgY3JlYXRpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBmaWVsZCBtb2RlbCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuIElmIGl0IGRvZXNuJ3QgZXhpc3QsXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgY2FuIGJlIHN1YnNjcmliZWQgdG8gYW55IGV2ZW50cyBvbiBpdC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLl9maWVsZE1vZGVsc0J5SWRbZmllbGRJZF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuX190cmlnZ2VyT25DaGFuZ2VGb3JEaXJ0eVBhdGhzKGRpcnR5RmllbGRQYXRocyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhZGRlZEZpZWxkSWRzLmxlbmd0aCA+IDAgfHwgcmVtb3ZlZEZpZWxkSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShXYXRjaGFibGVUYWJsZUtleXMuZmllbGRzLCB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkRmllbGRJZHMsXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRGaWVsZElkcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2xlYXIgb3V0IGNhY2hlZCBmaWVsZCBuYW1lcyBpbiBjYXNlIGEgZmllbGQgd2FzIGFkZGVkL3JlbW92ZWQvcmVuYW1lZC5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlZEZpZWxkTmFtZXNCeUlkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1JlY29yZE1ldGFkYXRhTG9hZGVkICYmIGRpcnR5UGF0aHMucmVjb3Jkc0J5SWQpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIHRhYmxlcyBkb24ndCBoYXZlIGEgcmVjb3JkIG9yZGVyLCBuZWVkIHRvIGRldGVjdCBpZiBhIHJlY29yZFxuICAgICAgICAgICAgLy8gd2FzIGNyZWF0ZWQgb3IgZGVsZXRlZCBhbmQgdHJpZ2dlciBvbkNoYW5nZSBmb3IgcmVjb3Jkcy5cbiAgICAgICAgICAgIGNvbnN0IGRpcnR5RmllbGRJZHNTZXQgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IGFkZGVkUmVjb3JkSWRzID0gW107XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkUmVjb3JkSWRzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtyZWNvcmRJZCwgZGlydHlSZWNvcmRQYXRoc10gb2YgdS5lbnRyaWVzKGRpcnR5UGF0aHMucmVjb3Jkc0J5SWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpcnR5UmVjb3JkUGF0aHMuX2lzRGlydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGVudGlyZSByZWNvcmQgaXMgZGlydHksIGl0IHdhcyBlaXRoZXIgY3JlYXRlZCBvciBkZWxldGVkLlxuXG4gICAgICAgICAgICAgICAgICAgIGludmFyaWFudCh0aGlzLl9kYXRhLnJlY29yZHNCeUlkLCAnTm8gcmVjb3Jkc0J5SWQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHUuaGFzKHRoaXMuX2RhdGEucmVjb3Jkc0J5SWQsIHJlY29yZElkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRSZWNvcmRJZHMucHVzaChyZWNvcmRJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkUmVjb3JkSWRzLnB1c2gocmVjb3JkSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRNb2RlbCA9IHRoaXMuX3JlY29yZE1vZGVsc0J5SWRbcmVjb3JkSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBSZWNvcmQgbW9kZWwgaWYgaXQgd2FzIGRlbGV0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3JlY29yZE1vZGVsc0J5SWRbcmVjb3JkSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkTW9kZWwgPSB0aGlzLl9yZWNvcmRNb2RlbHNCeUlkW3JlY29yZElkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRNb2RlbC5fX3RyaWdnZXJPbkNoYW5nZUZvckRpcnR5UGF0aHMoZGlydHlSZWNvcmRQYXRocyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7Y2VsbFZhbHVlc0J5RmllbGRJZH0gPSBkaXJ0eVJlY29yZFBhdGhzO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsVmFsdWVzQnlGaWVsZElkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGRJZCBvZiB1LmtleXMoY2VsbFZhbHVlc0J5RmllbGRJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcnR5RmllbGRJZHNTZXRbZmllbGRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSd2ZSBjb21wb3NlZCBvdXIgY3JlYXRlZC9kZWxldGVkIHJlY29yZCBpZHMgYXJyYXlzLCBsZXQncyBmaXJlXG4gICAgICAgICAgICAvLyB0aGUgcmVjb3JkcyBvbkNoYW5nZSBldmVudCBpZiBhbnkgcmVjb3JkcyB3ZXJlIGNyZWF0ZWQgb3IgZGVsZXRlZC5cbiAgICAgICAgICAgIGlmIChhZGRlZFJlY29yZElkcy5sZW5ndGggPiAwIHx8IHJlbW92ZWRSZWNvcmRJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlKFdhdGNoYWJsZVRhYmxlS2V5cy5yZWNvcmRzLCB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkUmVjb3JkSWRzLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkUmVjb3JkSWRzLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlVGFibGVLZXlzLnJlY29yZElkcywge1xuICAgICAgICAgICAgICAgICAgICBhZGRlZFJlY29yZElkcyxcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZFJlY29yZElkcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTk9URTogdGhpcyBpcyBhbiBleHBlcmltZW50YWwgKGFuZCBzb21ld2hhdCBtZXNzeSkgd2F5IHRvIHdhdGNoXG4gICAgICAgICAgICAvLyBmb3IgY2hhbmdlcyB0byBjZWxscyBpbiBhIHRhYmxlLCBhcyBhbiBhbHRlcm5hdGl2ZSB0byBpbXBsZW1lbnRpbmdcbiAgICAgICAgICAgIC8vIGZ1bGwgZXZlbnQgYnViYmxpbmcuIEZvciBub3csIGl0IHVuYmxvY2tzIHRoZSB0aGluZ3Mgd2Ugd2FudCB0b1xuICAgICAgICAgICAgLy8gYnVpbGQsIGJ1dCB3ZSBtYXkgcmVwbGFjZSBpdC5cbiAgICAgICAgICAgIC8vIElmIHdlIGtlZXAgaXQsIGNvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGJ5IG5vdCBjYWxsaW5nIF9vbkNoYW5nZVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG5vIHN1YnNjcmliZXJzLlxuICAgICAgICAgICAgLy8gVE9ETzogZG9uJ3QgdHJpZ2dlciBjaGFuZ2VzIGZvciBmaWVsZHMgdGhhdCBhcmVuJ3Qgc3VwcG9zZWQgdG8gYmUgbG9hZGVkXG4gICAgICAgICAgICAvLyAoaW4gc29tZSBjYXNlcywgZS5nLiByZWNvcmQgY3JlYXRlZCwgbGl2ZWFwcCB3aWxsIHNlbmQgY2VsbCB2YWx1ZXNcbiAgICAgICAgICAgIC8vIHRoYXQgd2UncmUgbm90IHN1YnNjcmliZWQgdG8pLlxuICAgICAgICAgICAgY29uc3QgZmllbGRJZHMgPSBPYmplY3QuZnJlZXplKE9iamVjdC5rZXlzKGRpcnR5RmllbGRJZHNTZXQpKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkcyA9IE9iamVjdC5mcmVlemUoT2JqZWN0LmtleXMoZGlydHlQYXRocy5yZWNvcmRzQnlJZCkpO1xuICAgICAgICAgICAgaWYgKGZpZWxkSWRzLmxlbmd0aCA+IDAgJiYgcmVjb3JkSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShXYXRjaGFibGVUYWJsZUtleXMuY2VsbFZhbHVlcywge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRJZHMsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkSWRzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIGZpZWxkSWRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXggKyBmaWVsZElkLCByZWNvcmRJZHMsIGZpZWxkSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9fZ2V0RmllbGROYW1lc0J5SWQoKToge1tzdHJpbmddOiBzdHJpbmd9IHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZWRGaWVsZE5hbWVzQnlJZCkge1xuICAgICAgICAgICAgY29uc3QgZmllbGROYW1lc0J5SWQgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2ZpZWxkSWQsIGZpZWxkRGF0YV0gb2YgdS5lbnRyaWVzKHRoaXMuX2RhdGEuZmllbGRzQnlJZCkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzQnlJZFtmaWVsZElkXSA9IGZpZWxkRGF0YS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY2FjaGVkRmllbGROYW1lc0J5SWQgPSBmaWVsZE5hbWVzQnlJZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVkRmllbGROYW1lc0J5SWQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJsZTtcbiJdfQ==