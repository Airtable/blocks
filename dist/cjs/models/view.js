"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

const viewTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/view_types/view_type_provider');

const airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


const WatchableViewKeys = {
  name: 'name',
  visibleRecords: 'visibleRecords',
  visibleRecordIds: 'visibleRecordIds',
  allFields: 'allFields',
  visibleFields: 'visibleFields',
  recordColors: 'recordColors'
};

/** Model class representing a view in a table. */
class View extends _abstract_model_with_async_data.default {
  // Once all blocks that current set this flag to true are migrated,
  // remove this flag.
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableViewKeys, key);
  }

  static _shouldLoadDataForKey(key) {
    return key === WatchableViewKeys.visibleRecords || key === WatchableViewKeys.visibleRecordIds || key === WatchableViewKeys.allFields || key === WatchableViewKeys.visibleFields || key === WatchableViewKeys.recordColors;
  }

  constructor(baseData, parentTable, viewId, airtableInterface) {
    super(baseData, viewId);
    this._parentTable = parentTable;
    this._mostRecentTableLoadPromise = null;
    this._airtableInterface = airtableInterface;
    (0, _seal.default)(this);
  }

  get _dataOrNullIfDeleted() {
    const tableData = this._baseData.tablesById[this.parentTable.id];

    if (!tableData) {
      return null;
    }

    return tableData.viewsById[this._id] || null;
  }

  get _isRecordMetadataLoaded() {
    const parentTable = this.parentTable;
    const isParentTableLoaded = View.shouldLoadAllCellValuesForRecords ? parentTable.isDataLoaded : parentTable.isRecordMetadataLoaded;
    return isParentTableLoaded;
  }
  /** */


  get isDataLoaded() {
    return this._isDataLoaded && this._isRecordMetadataLoaded;
  }
  /** */


  get parentTable() {
    return this._parentTable;
  }
  /** The name of the view. Can be watched. */


  get name() {
    return this._data.name;
  }
  /** The type of the view. Will not change. */


  get type() {
    return viewTypeProvider.getApiViewType(this._data.type);
  }
  /** */


  get url() {
    return airtableUrls.getUrlForView(this.id, this.parentTable.id, {
      absolute: true
    });
  }
  /** */


  select(opts) {
    return _table_or_view_query_result.default.__createOrReuseQueryResult(this, opts || {});
  }

  async loadDataAsync() {
    // Override this method to also load table data.
    // NOTE: it's important that we call loadDataAsync on the table here and not in
    // _loadDataAsync since we want the retain counts for the view and table to increase/decrease
    // in lock-step. If we load table data in _loadDataAsync, the table's retain
    // count only increments some of the time, which leads to unexpected behavior.
    if (View.shouldLoadAllCellValuesForRecords) {
      // Legacy behavior.
      const tableLoadPromise = this.parentTable.loadDataAsync();
      this._mostRecentTableLoadPromise = tableLoadPromise;
    } else {
      const tableLoadPromise = this.parentTable.loadRecordMetadataAsync();
      this._mostRecentTableLoadPromise = tableLoadPromise;
    }

    await super.loadDataAsync();
  }

  async _loadDataAsync() {
    // We need to be sure that the table data is loaded *before* we return
    // from this method.
    (0, _invariant.default)(this._mostRecentTableLoadPromise, 'No table load promise');
    const tableLoadPromise = this._mostRecentTableLoadPromise;
    const [viewData] = await _promise.default.all([this._airtableInterface.fetchAndSubscribeToViewDataAsync(this.parentTable.id, this._id), tableLoadPromise]);
    this._data.visibleRecordIds = viewData.visibleRecordIds;
    this._data.fieldOrder = viewData.fieldOrder;
    this._data.colorsByRecordId = viewData.colorsByRecordId;

    for (const record of this.visibleRecords) {
      if (this._data.colorsByRecordId[record.id]) {
        record.__triggerOnChangeForRecordColorInViewId(this.id);
      }
    }

    return [WatchableViewKeys.visibleRecords, WatchableViewKeys.visibleRecordIds, WatchableViewKeys.allFields, WatchableViewKeys.visibleFields, WatchableViewKeys.recordColors];
  }

  unloadData() {
    // Override this method to also unload the table's data.
    // NOTE: it's important that we do this here, since we want the view and table's
    // retain counts to increment/decrement in lock-step. If we unload the table's
    // data in _unloadData, it leads to unexpected behavior.
    super.unloadData();

    if (View.shouldLoadAllCellValuesForRecords) {
      // Legacy behavior.
      this.parentTable.unloadData();
    } else {
      this.parentTable.unloadRecordMetadata();
    }
  }

  _unloadData() {
    this._mostRecentTableLoadPromise = null;

    this._airtableInterface.unsubscribeFromViewData(this.parentTable.id, this._id);

    if (!this.isDeleted) {
      this._data.visibleRecordIds = undefined;
      this._data.colorsByRecordId = undefined;
    }
  }

  __generateChangesForParentTableAddMultipleRecords(recordIds) {
    const newVisibleRecordIds = [...this.visibleRecordIds, ...recordIds];
    return [{
      path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'],
      value: newVisibleRecordIds
    }];
  }

  __generateChangesForParentTableDeleteMultipleRecords(recordIds) {
    var _context;

    const recordIdsToDeleteSet = {};

    for (const recordId of recordIds) {
      recordIdsToDeleteSet[recordId] = true;
    }

    const newVisibleRecordIds = (0, _filter.default)(_context = this.visibleRecordIds).call(_context, recordId => {
      return !recordIdsToDeleteSet[recordId];
    });
    return [{
      path: ['tablesById', this.parentTable.id, 'viewsById', this.id, 'visibleRecordIds'],
      value: newVisibleRecordIds
    }];
  }
  /**
   * The record IDs that are not filtered out of this view.
   * Can be watched to know when records are created, deleted, reordered, or
   * filtered in and out of this view.
   */


  get visibleRecordIds() {
    const visibleRecordIds = this._data.visibleRecordIds;
    (0, _invariant.default)(visibleRecordIds, 'View data is not loaded'); // Freeze visibleRecordIds so users can't mutate it.
    // If it changes from liveapp, we get an entire new array which will
    // replace this one, so it's okay to freeze it.

    if (!(0, _isFrozen.default)(visibleRecordIds)) {
      (0, _freeze.default)(visibleRecordIds);
    }

    return visibleRecordIds;
  }
  /**
   * The records that are not filtered out of this view.
   * Can be watched to know when records are created, deleted, reordered, or
   * filtered in and out of this view.
   */


  get visibleRecords() {
    const {
      parentTable
    } = this;
    (0, _invariant.default)(this._isRecordMetadataLoaded, 'Table data is not loaded');
    const visibleRecordIds = this._data.visibleRecordIds;
    (0, _invariant.default)(visibleRecordIds, 'View data is not loaded');
    return (0, _map.default)(visibleRecordIds).call(visibleRecordIds, recordId => {
      const record = parentTable.getRecordById(recordId);
      (0, _invariant.default)(record, 'Record in view does not exist');
      return record;
    });
  }
  /**
   * All the fields in the table, including fields that are hidden in this
   * view. Can be watched to know when fields are created, deleted, or reordered.
   */


  get allFields() {
    var _context2;

    const fieldOrder = this._data.fieldOrder;
    (0, _invariant.default)(fieldOrder, 'View data is not loaded');
    return (0, _map.default)(_context2 = fieldOrder.fieldIds).call(_context2, fieldId => {
      const field = this.parentTable.getFieldById(fieldId);
      (0, _invariant.default)(field, 'Field in view does not exist');
      return field;
    });
  }
  /**
   * The fields that are not hidden in this view.
   * view. Can be watched to know when fields are created, deleted, or reordered.
   */


  get visibleFields() {
    const fieldOrder = this._data.fieldOrder;
    (0, _invariant.default)(fieldOrder, 'View data is not loaded');
    const {
      fieldIds
    } = fieldOrder;
    const visibleFields = [];

    for (let i = 0; i < fieldOrder.visibleFieldCount; i++) {
      const field = this.parentTable.getFieldById(fieldIds[i]);
      (0, _invariant.default)(field, 'Field in view does not exist');
      visibleFields.push(field);
    }

    return visibleFields;
  }
  /**
   * Get the color name for the specified record in this view, or null if no
   * color is available. Watch with 'recordColors'
   */


  getRecordColor(recordOrRecordId) {
    (0, _invariant.default)(this.isDataLoaded, 'View data is not loaded');
    const colorsByRecordId = this._data.colorsByRecordId;

    if (!colorsByRecordId) {
      return null;
    }

    const recordId = typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
    const color = colorsByRecordId[recordId];
    return color || null;
  }
  /**
   * Get the CSS hex color for the specified record in this view, or null if
   * no color is available. Watch with 'recordColors'
   */


  getRecordColorHex(recordOrRecordId) {
    const colorName = this.getRecordColor(recordOrRecordId);

    if (!colorName) {
      return null;
    }

    return _color_utils.default.getHexForColor(colorName);
  }

  __triggerOnChangeForDirtyPaths(dirtyPaths) {
    if (dirtyPaths.name) {
      this._onChange(WatchableViewKeys.name);
    }

    if (dirtyPaths.visibleRecordIds) {
      this._onChange(WatchableViewKeys.visibleRecords);

      this._onChange(WatchableViewKeys.visibleRecordIds);
    }

    if (dirtyPaths.fieldOrder) {
      this._onChange(WatchableViewKeys.allFields); // TODO(kasra): only trigger visibleFields if the *visible* field ids changed.


      this._onChange(WatchableViewKeys.visibleFields);
    }

    if (dirtyPaths.colorsByRecordId) {
      const changedRecordIds = dirtyPaths.colorsByRecordId._isDirty ? null : (0, _keys.default)(dirtyPaths.colorsByRecordId);

      if (changedRecordIds) {
        // Checking isRecordMetadataLoaded fixes a timing issue:
        // When a new table loads in liveapp, we'll receive the record
        // colors before getting the response to our loadData call.
        // This is a temporary fix: we need a more general solution to
        // avoid processing events associated with subscriptions whose
        // data we haven't received yet.
        if (this.parentTable.isRecordMetadataLoaded) {
          for (const recordId of changedRecordIds) {
            const record = this.parentTable.getRecordById(recordId);
            (0, _invariant.default)(record, 'record must exist');

            record.__triggerOnChangeForRecordColorInViewId(this.id);
          }
        }
      }

      this._onChange(WatchableViewKeys.recordColors, changedRecordIds);
    }
  }

}

(0, _defineProperty2.default)(View, "shouldLoadAllCellValuesForRecords", false);
(0, _defineProperty2.default)(View, "_className", 'View');
var _default = View;
exports.default = _default;