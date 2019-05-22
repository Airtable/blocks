"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _table = _interopRequireDefault(require("./table"));

var _view = _interopRequireDefault(require("./view"));

var _query_result = _interopRequireDefault(require("./query_result"));

var _object_pool = _interopRequireDefault(require("./object_pool"));

var _record_coloring = require("./record_coloring");

const {
  h,
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const GroupedRowVisList = window.__requirePrivateModuleFromAirtable('client_server_shared/vis_lists/grouped_row_vis_list');

const GroupAssigner = window.__requirePrivateModuleFromAirtable('client_server_shared/filter_and_sort/group_assigner');

// eslint-disable-next-line no-use-before-define
const tableOrViewQueryResultPool = new _object_pool.default({
  getKeyFromObject: queryResult => queryResult.__sourceModelId,
  getKeyFromObjectOptions: ({
    sourceModel
  }) => sourceModel.id,
  canObjectBeReusedForOptions: (queryResult, {
    normalizedOpts
  }) => {
    return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
  }
});
/**
 * Represents a set of records directly from a view or table.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.select` or `view.select`.
 */

class TableOrViewQueryResult extends _query_result.default {
  static __createOrReuseQueryResult(sourceModel, opts) {
    const tableModel = sourceModel instanceof _view.default ? sourceModel.parentTable : sourceModel;

    const normalizedOpts = _query_result.default._normalizeOpts(tableModel, opts);

    const queryResult = tableOrViewQueryResultPool.getObjectForReuse({
      sourceModel,
      normalizedOpts
    });

    if (queryResult) {
      return queryResult;
    } else {
      return new TableOrViewQueryResult(sourceModel, opts);
    }
  }

  constructor(sourceModel, opts) {
    const table = sourceModel instanceof _view.default ? sourceModel.parentTable : sourceModel;

    const normalizedOpts = _query_result.default._normalizeOpts(table, opts);

    super(normalizedOpts, sourceModel.__baseData);
    (0, _defineProperty2.default)(this, "_recordIdsSet", null);
    this._sourceModel = sourceModel;
    this._mostRecentSourceModelLoadPromise = null;
    this._table = table;
    const {
      sorts
    } = this._normalizedOpts;

    if (sorts) {
      const groupLevels = (0, _map.default)(sorts).call(sorts, sort => {
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
      this._groupLevels = groupLevels;
    } else {
      this._groupLevels = null;
    }

    this._visList = null;
    this._orderedRecordIds = null;
    this._cellValueKeyWatchCounts = {};
    let fieldIdsSetToLoadOrNullIfAllFields = null;

    if (this._normalizedOpts.fieldIdsOrNullIfAllFields) {
      fieldIdsSetToLoadOrNullIfAllFields = {};

      for (const fieldId of this._normalizedOpts.fieldIdsOrNullIfAllFields) {
        fieldIdsSetToLoadOrNullIfAllFields[fieldId] = true;
      } // Need to load data for fields we're sorting by, even if
      // they're not explicitly requested in the `fields` opt.


      if (this._groupLevels) {
        for (const groupLevel of this._groupLevels) {
          if (!groupLevel.isCreatedTime) {
            fieldIdsSetToLoadOrNullIfAllFields[groupLevel.columnId] = true;
          }
        }
      }

      const recordColorMode = this._normalizedOpts.recordColorMode;

      if (recordColorMode && recordColorMode.type === _record_coloring.ModeTypes.BY_SELECT_FIELD) {
        fieldIdsSetToLoadOrNullIfAllFields[recordColorMode.selectField.id] = true;
      }
    }

    this._fieldIdsSetToLoadOrNullIfAllFields = fieldIdsSetToLoadOrNullIfAllFields;
    (0, _seal.default)(this);
  }

  get _dataOrNullIfDeleted() {
    if (this._sourceModel.isDeleted) {
      return null;
    }

    return {
      recordIds: this._orderedRecordIds
    };
  }

  get __sourceModelId() {
    return this._sourceModel.id;
  }
  /** */


  get parentTable() {
    return this._table;
  }
  /**
   * The view that was used to obtain this QueryResult by calling
   * `view.select`. Null if the QueryResult was obtained by calling
   * `table.select`.
   */


  get parentView() {
    return this._sourceModel instanceof _table.default ? null : this._sourceModel;
  }
  /**
   * The record IDs in this QueryResult.
   * Throws if data is not loaded yet.
   */


  get recordIds() {
    (0, _invariant.default)(this.isDataLoaded, 'QueryResult data is not loaded');
    (0, _invariant.default)(this._data.recordIds, 'No recordIds');
    return this._data.recordIds;
  }
  /**
   * The set of record IDs in this QueryResult.
   * Throws if data is not loaded yet.
   */


  _getOrGenerateRecordIdsSet() {
    if (!this._recordIdsSet) {
      const recordIdsSet = {};

      for (const recordId of this.recordIds) {
        recordIdsSet[recordId] = true;
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


  get fields() {
    const {
      fieldIdsOrNullIfAllFields
    } = this._normalizedOpts;

    if (fieldIdsOrNullIfAllFields) {
      const fields = []; // Filter out any deleted fields, since QueryResult is "live".
      // It would be too cumbersome (and defeat part of the purpose of
      // using QueryResult) if the user had to manually watch for deletion
      // on all the fields and recreate the QueryResult.

      for (const fieldId of fieldIdsOrNullIfAllFields) {
        const field = this._table.getFieldById(fieldId);

        if (field !== null) {
          fields.push(field);
        }
      }

      return fields;
    } else {
      return null;
    }
  }

  get _cellValuesForSortWatchKeys() {
    var _context;

    return this._groupLevels ? u.compact((0, _map.default)(_context = this._groupLevels).call(_context, groupLevel => {
      if (groupLevel.isCreatedTime) {
        return null;
      }

      return `cellValuesInField:${groupLevel.columnId}`;
    })) : [];
  }

  get _recordsWatchKey() {
    return this._sourceModel instanceof _table.default ? 'records' : 'visibleRecords';
  }

  get _fieldsWatchKey() {
    return 'fields';
  }

  get _sourceModelRecordIds() {
    return this._sourceModel instanceof _table.default ? this._sourceModel.recordIds : this._sourceModel.visibleRecordIds;
  }

  get _sourceModelRecords() {
    return this._sourceModel instanceof _table.default ? this._sourceModel.records : this._sourceModel.visibleRecords;
  }

  _incrementCellValueKeyWatchCountAndWatchIfNecessary(key, watchCallback) {
    if (!this._cellValueKeyWatchCounts[key]) {
      this._cellValueKeyWatchCounts[key] = 0;

      this._table.watch(key, watchCallback, this);
    }

    this._cellValueKeyWatchCounts[key]++;
  }

  _decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, watchCallback) {
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

  watch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = super.watch(keys, callback, context);

    for (const key of validKeys) {
      if ((0, _startsWith.default)(u).call(u, key, _query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
        const fieldId = key.substring(_query_result.default.WatchableCellValuesInFieldKeyPrefix.length);

        if (this._fieldIdsSetToLoadOrNullIfAllFields && !u.has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)) {
          throw new Error(`Can't watch field because it wasn't included in QueryResult fields: ${fieldId}`);
        }

        this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesInFieldChanged);
      }

      if (key === _query_result.default.WatchableKeys.cellValues) {
        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
          for (const fieldId of (0, _keys.default)(this._fieldIdsSetToLoadOrNullIfAllFields)) {
            this._incrementCellValueKeyWatchCountAndWatchIfNecessary(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._onCellValuesChanged);
          }
        } else {
          this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesChanged);
        }
      }
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = super.unwatch(keys, callback, context);

    for (const key of validKeys) {
      if ((0, _startsWith.default)(u).call(u, key, _query_result.default.WatchableCellValuesInFieldKeyPrefix)) {
        this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesInFieldChanged);
      }

      if (key === _query_result.default.WatchableKeys.cellValues) {
        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
          for (const fieldId of (0, _keys.default)(this._fieldIdsSetToLoadOrNullIfAllFields)) {
            this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId, this._onCellValuesChanged);
          }
        } else {
          this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesChanged);
        }
      }
    }

    return validKeys;
  }

  async loadDataAsync() {
    let sourceModelLoadPromise;
    let cellValuesInFieldsLoadPromise;

    if (this._fieldIdsSetToLoadOrNullIfAllFields) {
      cellValuesInFieldsLoadPromise = this._table.loadCellValuesInFieldIdsAsync((0, _keys.default)(this._fieldIdsSetToLoadOrNullIfAllFields));
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

    this._mostRecentSourceModelLoadPromise = _promise.default.all([sourceModelLoadPromise, cellValuesInFieldsLoadPromise, this._loadRecordColorsAsync()]);
    await super.loadDataAsync();
  }

  async _loadDataAsync() {
    var _context2;

    tableOrViewQueryResultPool.registerObjectForReuse(this);
    (0, _invariant.default)(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
    await this._mostRecentSourceModelLoadPromise;

    if (this._groupLevels) {
      this._replaceVisList();
    }

    this._orderedRecordIds = this._generateOrderedRecordIds();

    this._sourceModel.watch( // flow-disable-next-line since we know this watch key is valid.
    this._recordsWatchKey, this._onRecordsChanged, this);

    this._table.watch(this._cellValuesForSortWatchKeys, this._onCellValuesForSortChanged, this);

    this._table.watch(this._fieldsWatchKey, this._onTableFieldsChanged, this);

    if (this._groupLevels) {
      for (const groupLevel of this._groupLevels) {
        if (groupLevel.isCreatedTime) {
          continue;
        }

        const field = this._table.getFieldById(groupLevel.columnId);

        if (field) {
          field.watch('config', this._onFieldConfigChanged, this);
        }
      }
    }

    const changedKeys = [_query_result.default.WatchableKeys.records, _query_result.default.WatchableKeys.recordIds, _query_result.default.WatchableKeys.cellValues];
    const fieldIds = this._normalizedOpts.fieldIdsOrNullIfAllFields || (0, _map.default)(_context2 = this._table.fields).call(_context2, field => field.id);

    for (const fieldId of fieldIds) {
      changedKeys.push(_query_result.default.WatchableCellValuesInFieldKeyPrefix + fieldId);
    }

    return changedKeys;
  }

  unloadData() {
    super.unloadData();

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
      this._table.unloadCellValuesInFieldIds((0, _keys.default)(this._fieldIdsSetToLoadOrNullIfAllFields));
    }

    this._unloadRecordColors();
  }

  _unloadData() {
    this._mostRecentSourceModelLoadPromise = null;

    this._sourceModel.unwatch( // flow-disable-next-line since we know this watch key is valid.
    this._recordsWatchKey, this._onRecordsChanged, this);

    this._table.unwatch(this._cellValuesForSortWatchKeys, this._onCellValuesForSortChanged, this);

    this._table.unwatch(this._fieldsWatchKey, this._onTableFieldsChanged, this); // If the table is deleted, can't call getFieldById on it below.


    if (!this._table.isDeleted && this._groupLevels) {
      for (const groupLevel of this._groupLevels) {
        if (groupLevel.isCreatedTime) {
          continue;
        }

        const field = this._table.getFieldById(groupLevel.columnId);

        if (field) {
          field.unwatch('config', this._onFieldConfigChanged, this);
        }
      }
    }

    this._visList = null;
    this._orderedRecordIds = null;
    this._recordIdsSet = null;
    tableOrViewQueryResultPool.unregisterObjectForReuse(this);
  }

  _getColumnsById() {
    var _context3;

    return (0, _reduce.default)(_context3 = this._table.fields).call(_context3, (result, field) => {
      result[field.id] = field.__getRawColumn();
      return result;
    }, {});
  }

  _addRecordIdsToVisList(recordIds) {
    const columnsById = this._getColumnsById();

    const visList = this._visList;
    (0, _invariant.default)(visList, 'No vis list');

    for (const recordId of recordIds) {
      const record = this._table.getRecordById(recordId);

      (0, _invariant.default)(record, 'Record missing in table');

      const rowJson = record.__getRawRow();

      const groupPath = GroupAssigner.getGroupPathForRow(this._table.parentBase.__appInterface, this._getGroupLevelsWithDeletedFieldsFiltered(), columnsById, rowJson);
      visList.addIdToGroupAtEnd(recordId, true, groupPath);
    }
  }

  _onRecordsChanged(model, key, updates) {
    if (model instanceof _view.default) {
      // For a view model, we don't get updates sent with the onChange event,
      // so we need to manually generate updates based on the old and new
      // recordIds.
      if (this._orderedRecordIds) {
        const addedRecordIds = u.difference(model.visibleRecordIds, this._orderedRecordIds);
        const removedRecordIds = u.difference(this._orderedRecordIds, model.visibleRecordIds);
        updates = {
          addedRecordIds,
          removedRecordIds
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

    const {
      addedRecordIds,
      removedRecordIds
    } = updates;

    if (this._groupLevels) {
      const visList = this._visList;
      (0, _invariant.default)(visList, 'No vis list');

      if (removedRecordIds.length > 0) {
        visList.removeMultipleIds(removedRecordIds);
      }

      if (addedRecordIds.length > 0) {
        this._addRecordIdsToVisList(addedRecordIds);
      }
    }

    if (this._recordIdsSet) {
      for (const recordId of addedRecordIds) {
        this._recordIdsSet[recordId] = true;
      }

      for (const recordId of removedRecordIds) {
        this._recordIdsSet[recordId] = undefined;
      }
    } // Now that we've applied our changes (if applicable), let's regenerate our recordIds.


    this._orderedRecordIds = this._generateOrderedRecordIds();

    this._onChange(_query_result.default.WatchableKeys.records, updates);

    this._onChange(_query_result.default.WatchableKeys.recordIds, updates);
  }

  _onCellValuesForSortChanged(table, key, recordIds, fieldId) {
    if (!recordIds || !fieldId) {
      // If there are no updates, do nothing, since we'll handle the initial
      // callback when the record set is loaded (and we don't want to fire
      // a records change twice with no data).
      return;
    } // NOTE: this will only ever be called if we have sorts, so it's safe to assert that we have
    // a vis list here.


    const visList = this._visList;
    (0, _invariant.default)(visList, 'No vis list');

    if (recordIds.length === 0) {
      // Nothing actually changed, so just break out early.
      return;
    } // Move the record ids in the vis list.
    // Note: the cell value changes may have resulted in the records
    // being filtered out. So don't try to remove and re-add them if
    // they're no longer visible.


    const visibleRecordIds = (0, _filter.default)(recordIds).call(recordIds, recordId => visList.isIdVisible(recordId));
    visList.removeMultipleIds(visibleRecordIds);

    this._addRecordIdsToVisList(visibleRecordIds);

    this._orderedRecordIds = this._generateOrderedRecordIds();
    const changeData = {
      addedRecordIds: [],
      removedRecordIds: []
    };

    this._onChange(_query_result.default.WatchableKeys.records, changeData);

    this._onChange(_query_result.default.WatchableKeys.recordIds, changeData);
  }

  _onFieldConfigChanged(field, key) {
    // Field config changed for a field we rely on, so we need to replace our vis list.
    // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
    // are using a vis list here.
    this._replaceVisList();

    this._orderedRecordIds = this._generateOrderedRecordIds();
  }

  _onTableFieldsChanged(table, key, updates) {
    var _context4;

    if (!this._groupLevels) {
      // If we don't have any sorts, we don't have to do anything in response to field changes.
      return;
    }

    const {
      addedFieldIds,
      removedFieldIds
    } = updates;
    const fieldIdsSet = (0, _reduce.default)(_context4 = this._groupLevels).call(_context4, (result, groupLevel) => {
      if (!groupLevel.isCreatedTime) {
        result[groupLevel.columnId] = true;
      }

      return result;
    }, {}); // Check if any fields that we rely on were created or deleted. If they were,
    // replace our vis list.
    // NOTE: we need to check for created, since a field that we rely on can be
    // deleted and then undeleted.

    let wereAnyFieldsCreatedOrDeleted = false;

    for (const fieldId of addedFieldIds) {
      // If a field that we rely on was created (i.e. it was undeleted), we need to
      // make sure we're watching it's config.
      if (u.has(fieldIdsSet, fieldId)) {
        wereAnyFieldsCreatedOrDeleted = true;

        const field = this._table.getFieldById(fieldId);

        (0, _invariant.default)(field, 'Created field does not exist');
        field.watch('config', this._onFieldConfigChanged, this);
      }
    }

    if (!wereAnyFieldsCreatedOrDeleted) {
      wereAnyFieldsCreatedOrDeleted = (0, _some.default)(u).call(u, removedFieldIds, fieldId => u.has(fieldIdsSet, fieldId));
    }

    if (wereAnyFieldsCreatedOrDeleted) {
      // One of the fields we're relying on was deleted,
      this._replaceVisList();

      this._orderedRecordIds = this._generateOrderedRecordIds(); // Make sure we fire onChange events since the order may have changed
      // as a result.

      const changeData = {
        addedRecordIds: [],
        removedRecordIds: []
      };

      this._onChange(_query_result.default.WatchableKeys.records, changeData);

      this._onChange(_query_result.default.WatchableKeys.recordIds, changeData);
    }
  }

  _onCellValuesChanged(table, key, updates) {
    if (!updates) {
      // If there are no updates, do nothing, since we'll handle the initial
      // callback when the record set is loaded (and we don't want to fire
      // a cellValues change twice with no data).
      return;
    }

    this._onChange(_query_result.default.WatchableKeys.cellValues, updates);
  }

  _onCellValuesInFieldChanged(table, key, recordIds, fieldId) {
    if (!recordIds && !fieldId) {
      // If there are no updates, do nothing, since we'll handle the initial
      // callback when the record set is loaded (and we don't want to fire
      // a cellValuesInField change twice with no data).
      return;
    }

    this._onChange(key, recordIds, fieldId);
  }

  _generateOrderedRecordIds() {
    if (this._groupLevels) {
      (0, _invariant.default)(this._visList, 'Cannot generate record ids without a vis list');
      const recordIds = [];

      this._visList.eachVisibleIdInGroupedOrder(recordId => recordIds.push(recordId));

      return recordIds;
    } else {
      return this._sourceModelRecordIds;
    }
  }

  _replaceVisList() {
    const rowsById = {};
    const rowVisibilityObjArray = [];

    for (const record of this._sourceModelRecords) {
      rowsById[record.id] = record.__getRawRow();
      rowVisibilityObjArray.push({
        rowId: record.id,
        visibility: true
      });
    }

    const columnsById = this._getColumnsById();

    const groupLevels = this._getGroupLevelsWithDeletedFieldsFiltered();

    const groupAssigner = new GroupAssigner({
      appInterface: this._table.parentBase.__appInterface,
      groupLevels,
      rowsById,
      columnsById
    });
    const groupKeyComparators = groupAssigner.getGroupKeyComparators();
    const groupPathsByRowId = groupAssigner.getGroupPathsByRowId();
    this._visList = new GroupedRowVisList(groupKeyComparators, rowVisibilityObjArray, groupPathsByRowId);
  }

  _getGroupLevelsWithDeletedFieldsFiltered() {
    var _context5;

    (0, _invariant.default)(this._groupLevels, 'No group levels'); // Filter out any group levels that rely on deleted fields.
    // NOTE: we keep deleted fields around (rather than filtering them out
    // in realtime) in case a field gets undeleted, in which case we want to
    // keep using it.

    return (0, _filter.default)(_context5 = this._groupLevels).call(_context5, groupLevel => {
      if (groupLevel.isCreatedTime) {
        return true;
      }

      const field = this._table.getFieldById(groupLevel.columnId);

      return !!field;
    });
  }

  _getErrorMessageForDeletion() {
    const sourceModelName = this._sourceModel instanceof _table.default ? 'table' : 'view';
    return `QueryResult's underlying ${sourceModelName} has been deleted`;
  }

}

(0, _defineProperty2.default)(TableOrViewQueryResult, "_className", 'TableOrViewQueryResult');
var _default = TableOrViewQueryResult;
exports.default = _default;