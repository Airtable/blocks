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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvdGFibGVfb3Jfdmlld19xdWVyeV9yZXN1bHQuanMiXSwibmFtZXMiOlsiaCIsInUiLCJ3aW5kb3ciLCJfX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlIiwiR3JvdXBlZFJvd1Zpc0xpc3QiLCJHcm91cEFzc2lnbmVyIiwidGFibGVPclZpZXdRdWVyeVJlc3VsdFBvb2wiLCJPYmplY3RQb29sIiwiZ2V0S2V5RnJvbU9iamVjdCIsInF1ZXJ5UmVzdWx0IiwiX19zb3VyY2VNb2RlbElkIiwiZ2V0S2V5RnJvbU9iamVjdE9wdGlvbnMiLCJzb3VyY2VNb2RlbCIsImlkIiwiY2FuT2JqZWN0QmVSZXVzZWRGb3JPcHRpb25zIiwibm9ybWFsaXplZE9wdHMiLCJfX2NhbkJlUmV1c2VkRm9yTm9ybWFsaXplZE9wdHMiLCJUYWJsZU9yVmlld1F1ZXJ5UmVzdWx0IiwiUXVlcnlSZXN1bHQiLCJfX2NyZWF0ZU9yUmV1c2VRdWVyeVJlc3VsdCIsIm9wdHMiLCJ0YWJsZU1vZGVsIiwiVmlld01vZGVsIiwicGFyZW50VGFibGUiLCJfbm9ybWFsaXplT3B0cyIsImdldE9iamVjdEZvclJldXNlIiwiY29uc3RydWN0b3IiLCJ0YWJsZSIsIl9fYmFzZURhdGEiLCJfc291cmNlTW9kZWwiLCJfbW9zdFJlY2VudFNvdXJjZU1vZGVsTG9hZFByb21pc2UiLCJfdGFibGUiLCJzb3J0cyIsIl9ub3JtYWxpemVkT3B0cyIsImdyb3VwTGV2ZWxzIiwic29ydCIsImdlbmVyYXRlR3JvdXBMZXZlbElkIiwiY29sdW1uSWQiLCJmaWVsZElkIiwib3JkZXIiLCJkaXJlY3Rpb24iLCJncm91cGluZ09wdGlvbnMiLCJzaG91bGRVc2VSYXdDZWxsVmFsdWUiLCJwdXNoIiwiaXNDcmVhdGVkVGltZSIsIl9ncm91cExldmVscyIsIl92aXNMaXN0IiwiX29yZGVyZWRSZWNvcmRJZHMiLCJfY2VsbFZhbHVlS2V5V2F0Y2hDb3VudHMiLCJmaWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzIiwiZmllbGRJZHNPck51bGxJZkFsbEZpZWxkcyIsImdyb3VwTGV2ZWwiLCJyZWNvcmRDb2xvck1vZGUiLCJ0eXBlIiwiUmVjb3JkQ29sb3JNb2RlVHlwZXMiLCJCWV9TRUxFQ1RfRklFTEQiLCJzZWxlY3RGaWVsZCIsIl9maWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzIiwiX2RhdGFPck51bGxJZkRlbGV0ZWQiLCJpc0RlbGV0ZWQiLCJyZWNvcmRJZHMiLCJwYXJlbnRWaWV3IiwiVGFibGVNb2RlbCIsImlzRGF0YUxvYWRlZCIsIl9kYXRhIiwiX2dldE9yR2VuZXJhdGVSZWNvcmRJZHNTZXQiLCJfcmVjb3JkSWRzU2V0IiwicmVjb3JkSWRzU2V0IiwicmVjb3JkSWQiLCJmaWVsZHMiLCJmaWVsZCIsImdldEZpZWxkQnlJZCIsIl9jZWxsVmFsdWVzRm9yU29ydFdhdGNoS2V5cyIsImNvbXBhY3QiLCJfcmVjb3Jkc1dhdGNoS2V5IiwiX2ZpZWxkc1dhdGNoS2V5IiwiX3NvdXJjZU1vZGVsUmVjb3JkSWRzIiwidmlzaWJsZVJlY29yZElkcyIsIl9zb3VyY2VNb2RlbFJlY29yZHMiLCJyZWNvcmRzIiwidmlzaWJsZVJlY29yZHMiLCJfaW5jcmVtZW50Q2VsbFZhbHVlS2V5V2F0Y2hDb3VudEFuZFdhdGNoSWZOZWNlc3NhcnkiLCJrZXkiLCJ3YXRjaENhbGxiYWNrIiwid2F0Y2giLCJfZGVjcmVtZW50Q2VsbFZhbHVlS2V5V2F0Y2hDb3VudEFuZFVud2F0Y2hJZlBvc3NpYmxlIiwidW53YXRjaCIsImtleXMiLCJjYWxsYmFjayIsImNvbnRleHQiLCJ2YWxpZEtleXMiLCJXYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCIsInN1YnN0cmluZyIsImxlbmd0aCIsImhhcyIsIkVycm9yIiwiX29uQ2VsbFZhbHVlc0luRmllbGRDaGFuZ2VkIiwiV2F0Y2hhYmxlS2V5cyIsImNlbGxWYWx1ZXMiLCJfb25DZWxsVmFsdWVzQ2hhbmdlZCIsImxvYWREYXRhQXN5bmMiLCJzb3VyY2VNb2RlbExvYWRQcm9taXNlIiwiY2VsbFZhbHVlc0luRmllbGRzTG9hZFByb21pc2UiLCJsb2FkQ2VsbFZhbHVlc0luRmllbGRJZHNBc3luYyIsImxvYWRSZWNvcmRNZXRhZGF0YUFzeW5jIiwiYWxsIiwiX2xvYWRSZWNvcmRDb2xvcnNBc3luYyIsIl9sb2FkRGF0YUFzeW5jIiwicmVnaXN0ZXJPYmplY3RGb3JSZXVzZSIsIl9yZXBsYWNlVmlzTGlzdCIsIl9nZW5lcmF0ZU9yZGVyZWRSZWNvcmRJZHMiLCJfb25SZWNvcmRzQ2hhbmdlZCIsIl9vbkNlbGxWYWx1ZXNGb3JTb3J0Q2hhbmdlZCIsIl9vblRhYmxlRmllbGRzQ2hhbmdlZCIsIl9vbkZpZWxkQ29uZmlnQ2hhbmdlZCIsImNoYW5nZWRLZXlzIiwiZmllbGRJZHMiLCJ1bmxvYWREYXRhIiwidW5sb2FkUmVjb3JkTWV0YWRhdGEiLCJ1bmxvYWRDZWxsVmFsdWVzSW5GaWVsZElkcyIsIl91bmxvYWRSZWNvcmRDb2xvcnMiLCJfdW5sb2FkRGF0YSIsInVucmVnaXN0ZXJPYmplY3RGb3JSZXVzZSIsIl9nZXRDb2x1bW5zQnlJZCIsInJlc3VsdCIsIl9fZ2V0UmF3Q29sdW1uIiwiX2FkZFJlY29yZElkc1RvVmlzTGlzdCIsImNvbHVtbnNCeUlkIiwidmlzTGlzdCIsInJlY29yZCIsImdldFJlY29yZEJ5SWQiLCJyb3dKc29uIiwiX19nZXRSYXdSb3ciLCJncm91cFBhdGgiLCJnZXRHcm91cFBhdGhGb3JSb3ciLCJwYXJlbnRCYXNlIiwiX19hcHBJbnRlcmZhY2UiLCJfZ2V0R3JvdXBMZXZlbHNXaXRoRGVsZXRlZEZpZWxkc0ZpbHRlcmVkIiwiYWRkSWRUb0dyb3VwQXRFbmQiLCJtb2RlbCIsInVwZGF0ZXMiLCJhZGRlZFJlY29yZElkcyIsImRpZmZlcmVuY2UiLCJyZW1vdmVkUmVjb3JkSWRzIiwicmVtb3ZlTXVsdGlwbGVJZHMiLCJ1bmRlZmluZWQiLCJfb25DaGFuZ2UiLCJpc0lkVmlzaWJsZSIsImNoYW5nZURhdGEiLCJhZGRlZEZpZWxkSWRzIiwicmVtb3ZlZEZpZWxkSWRzIiwiZmllbGRJZHNTZXQiLCJ3ZXJlQW55RmllbGRzQ3JlYXRlZE9yRGVsZXRlZCIsImVhY2hWaXNpYmxlSWRJbkdyb3VwZWRPcmRlciIsInJvd3NCeUlkIiwicm93VmlzaWJpbGl0eU9iakFycmF5Iiwicm93SWQiLCJ2aXNpYmlsaXR5IiwiZ3JvdXBBc3NpZ25lciIsImFwcEludGVyZmFjZSIsImdyb3VwS2V5Q29tcGFyYXRvcnMiLCJnZXRHcm91cEtleUNvbXBhcmF0b3JzIiwiZ3JvdXBQYXRoc0J5Um93SWQiLCJnZXRHcm91cFBhdGhzQnlSb3dJZCIsIl9nZXRFcnJvck1lc3NhZ2VGb3JEZWxldGlvbiIsInNvdXJjZU1vZGVsTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBQ0E7O0FBSUEsTUFBTTtBQUFDQSxFQUFBQSxDQUFEO0FBQUlDLEVBQUFBO0FBQUosSUFBU0MsTUFBTSxDQUFDQyxrQ0FBUCxDQUEwQyx5QkFBMUMsQ0FBZjs7QUFDQSxNQUFNQyxpQkFBaUIsR0FBR0YsTUFBTSxDQUFDQyxrQ0FBUCxDQUN0QixxREFEc0IsQ0FBMUI7O0FBR0EsTUFBTUUsYUFBYSxHQUFHSCxNQUFNLENBQUNDLGtDQUFQLENBQ2xCLHFEQURrQixDQUF0Qjs7QUF3QkE7QUFDQSxNQUFNRywwQkFNTCxHQUFHLElBQUlDLG9CQUFKLENBQWU7QUFDZkMsRUFBQUEsZ0JBQWdCLEVBQUVDLFdBQVcsSUFBSUEsV0FBVyxDQUFDQyxlQUQ5QjtBQUVmQyxFQUFBQSx1QkFBdUIsRUFBRSxDQUFDO0FBQUNDLElBQUFBO0FBQUQsR0FBRCxLQUFtQkEsV0FBVyxDQUFDQyxFQUZ6QztBQUdmQyxFQUFBQSwyQkFBMkIsRUFBRSxDQUFDTCxXQUFELEVBQWM7QUFBQ00sSUFBQUE7QUFBRCxHQUFkLEtBQW1DO0FBQzVELFdBQU9OLFdBQVcsQ0FBQ08sOEJBQVos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WixDQUF5QnBCLFVBQVUsQ0FBQ2QsUUFBcEMsQ0FBZDs7QUFDQSxhQUFPLENBQUMsQ0FBQ2lDLEtBQVQ7QUFDSCxLQU5NLENBQVA7QUFPSDs7QUFDRDhGLEVBQUFBLDJCQUEyQixHQUFXO0FBQ2xDLFVBQU1DLGVBQWUsR0FBRyxLQUFLeEksWUFBTCxZQUE2QmlDLGNBQTdCLEdBQTBDLE9BQTFDLEdBQW9ELE1BQTVFO0FBQ0EsV0FBUSw0QkFBMkJ1RyxlQUFnQixtQkFBbkQ7QUFDSDs7QUE3c0J3RTs7OEJBQXZFcEosc0IsZ0JBQ2tCLHdCO2VBK3NCVEEsc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IHt0eXBlIEZpZWxkSWR9IGZyb20gJy4uL3R5cGVzL2ZpZWxkJztcbmltcG9ydCBUYWJsZU1vZGVsLCB7dHlwZSBXYXRjaGFibGVUYWJsZUtleX0gZnJvbSAnLi90YWJsZSc7XG5pbXBvcnQgVmlld01vZGVsLCB7dHlwZSBXYXRjaGFibGVWaWV3S2V5fSBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IFF1ZXJ5UmVzdWx0LCB7XG4gICAgdHlwZSBXYXRjaGFibGVRdWVyeVJlc3VsdEtleSxcbiAgICB0eXBlIFF1ZXJ5UmVzdWx0T3B0cyxcbiAgICB0eXBlIE5vcm1hbGl6ZWRRdWVyeVJlc3VsdE9wdHMsXG59IGZyb20gJy4vcXVlcnlfcmVzdWx0JztcbmltcG9ydCBPYmplY3RQb29sIGZyb20gJy4vb2JqZWN0X3Bvb2wnO1xuaW1wb3J0IHtNb2RlVHlwZXMgYXMgUmVjb3JkQ29sb3JNb2RlVHlwZXN9IGZyb20gJy4vcmVjb3JkX2NvbG9yaW5nJztcbmltcG9ydCB0eXBlIEZpZWxkTW9kZWwgZnJvbSAnLi9maWVsZCc7XG5pbXBvcnQgdHlwZSBSZWNvcmRNb2RlbCBmcm9tICcuL3JlY29yZCc7XG5cbmNvbnN0IHtoLCB1fSA9IHdpbmRvdy5fX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlKCdjbGllbnRfc2VydmVyX3NoYXJlZC9odScpO1xuY29uc3QgR3JvdXBlZFJvd1Zpc0xpc3QgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvdmlzX2xpc3RzL2dyb3VwZWRfcm93X3Zpc19saXN0Jyxcbik7XG5jb25zdCBHcm91cEFzc2lnbmVyID0gd2luZG93Ll9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUoXG4gICAgJ2NsaWVudF9zZXJ2ZXJfc2hhcmVkL2ZpbHRlcl9hbmRfc29ydC9ncm91cF9hc3NpZ25lcicsXG4pO1xuXG50eXBlIEdyb3VwTGV2ZWxPcmRlclR5cGUgPSAnYXNjZW5kaW5nJyB8ICdkZXNjZW5kaW5nJztcbnR5cGUgR3JvdXBMZXZlbElkID0gc3RyaW5nO1xudHlwZSBHcm91cExldmVsT2JqID1cbiAgICB8IHt8XG4gICAgICAgICAgaWQ6IEdyb3VwTGV2ZWxJZCxcbiAgICAgICAgICBjb2x1bW5JZDogRmllbGRJZCxcbiAgICAgICAgICBvcmRlcjogR3JvdXBMZXZlbE9yZGVyVHlwZSxcbiAgICAgICAgICBncm91cGluZ09wdGlvbnM/OiBPYmplY3QsXG4gICAgICB8fVxuICAgIHwge3xcbiAgICAgICAgICBpZDogR3JvdXBMZXZlbElkLFxuICAgICAgICAgIGlzQ3JlYXRlZFRpbWU6IHRydWUsXG4gICAgICAgICAgb3JkZXI6IEdyb3VwTGV2ZWxPcmRlclR5cGUsXG4gICAgICAgICAgZ3JvdXBpbmdPcHRpb25zPzogT2JqZWN0LFxuICAgICAgfH07XG5cbnR5cGUgVGFibGVPclZpZXdRdWVyeVJlc3VsdERhdGEgPSB7XG4gICAgcmVjb3JkSWRzOiBBcnJheTxzdHJpbmc+IHwgbnVsbCwgLy8gbnVsbCBpZiBkYXRhIGlzbid0IGxvYWRlZCAob3IgaWYgaXQgaGFzbid0IGJlZW4gbGF6aWx5IGluaXRpYWxpemVkKS5cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuY29uc3QgdGFibGVPclZpZXdRdWVyeVJlc3VsdFBvb2w6IE9iamVjdFBvb2w8XG4gICAgVGFibGVPclZpZXdRdWVyeVJlc3VsdCxcbiAgICB7XG4gICAgICAgIHNvdXJjZU1vZGVsOiBUYWJsZU1vZGVsIHwgVmlld01vZGVsLFxuICAgICAgICBub3JtYWxpemVkT3B0czogTm9ybWFsaXplZFF1ZXJ5UmVzdWx0T3B0cyxcbiAgICB9LFxuPiA9IG5ldyBPYmplY3RQb29sKHtcbiAgICBnZXRLZXlGcm9tT2JqZWN0OiBxdWVyeVJlc3VsdCA9PiBxdWVyeVJlc3VsdC5fX3NvdXJjZU1vZGVsSWQsXG4gICAgZ2V0S2V5RnJvbU9iamVjdE9wdGlvbnM6ICh7c291cmNlTW9kZWx9KSA9PiBzb3VyY2VNb2RlbC5pZCxcbiAgICBjYW5PYmplY3RCZVJldXNlZEZvck9wdGlvbnM6IChxdWVyeVJlc3VsdCwge25vcm1hbGl6ZWRPcHRzfSkgPT4ge1xuICAgICAgICByZXR1cm4gcXVlcnlSZXN1bHQuX19jYW5CZVJldXNlZEZvck5vcm1hbGl6ZWRPcHRzKG5vcm1hbGl6ZWRPcHRzKTtcbiAgICB9LFxufSk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHNldCBvZiByZWNvcmRzIGRpcmVjdGx5IGZyb20gYSB2aWV3IG9yIHRhYmxlLlxuICpcbiAqIERvIG5vdCBpbnN0YW50aWF0ZS4gWW91IGNhbiBnZXQgaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgYnkgY2FsbGluZ1xuICogYHRhYmxlLnNlbGVjdGAgb3IgYHZpZXcuc2VsZWN0YC5cbiAqL1xuY2xhc3MgVGFibGVPclZpZXdRdWVyeVJlc3VsdCBleHRlbmRzIFF1ZXJ5UmVzdWx0PFRhYmxlT3JWaWV3UXVlcnlSZXN1bHREYXRhPiB7XG4gICAgc3RhdGljIF9jbGFzc05hbWUgPSAnVGFibGVPclZpZXdRdWVyeVJlc3VsdCc7XG5cbiAgICBzdGF0aWMgX19jcmVhdGVPclJldXNlUXVlcnlSZXN1bHQoc291cmNlTW9kZWw6IFRhYmxlTW9kZWwgfCBWaWV3TW9kZWwsIG9wdHM6IFF1ZXJ5UmVzdWx0T3B0cykge1xuICAgICAgICBjb25zdCB0YWJsZU1vZGVsID0gc291cmNlTW9kZWwgaW5zdGFuY2VvZiBWaWV3TW9kZWwgPyBzb3VyY2VNb2RlbC5wYXJlbnRUYWJsZSA6IHNvdXJjZU1vZGVsO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkT3B0cyA9IFF1ZXJ5UmVzdWx0Ll9ub3JtYWxpemVPcHRzKHRhYmxlTW9kZWwsIG9wdHMpO1xuICAgICAgICBjb25zdCBxdWVyeVJlc3VsdCA9IHRhYmxlT3JWaWV3UXVlcnlSZXN1bHRQb29sLmdldE9iamVjdEZvclJldXNlKHtcbiAgICAgICAgICAgIHNvdXJjZU1vZGVsLFxuICAgICAgICAgICAgbm9ybWFsaXplZE9wdHMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocXVlcnlSZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWVyeVJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGFibGVPclZpZXdRdWVyeVJlc3VsdChzb3VyY2VNb2RlbCwgb3B0cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3NvdXJjZU1vZGVsOiBUYWJsZU1vZGVsIHwgVmlld01vZGVsO1xuICAgIF9tb3N0UmVjZW50U291cmNlTW9kZWxMb2FkUHJvbWlzZTogUHJvbWlzZTwqPiB8IG51bGw7XG4gICAgX3RhYmxlOiBUYWJsZU1vZGVsO1xuXG4gICAgX2ZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHM6IHtbc3RyaW5nXTogdHJ1ZX0gfCBudWxsO1xuXG4gICAgLy8gSWYgY3VzdG9tIHNvcnRzIGFyZSBzcGVjaWZpZWQsIHdlJ2xsIHVzZSBhIHZpcyBsaXN0IHRvIGhhbmRsZSBzb3J0aW5nLiBJZiBubyBzb3J0c1xuICAgIC8vIGFyZSBzcGVjaWZpZWQsIHdlJ2xsIHVzZSB0aGUgdW5kZXJseWluZyByb3cgb3JkZXIgb2YgdGhlIHNvdXJjZSBtb2RlbC5cbiAgICBfdmlzTGlzdDogR3JvdXBlZFJvd1Zpc0xpc3QgfCBudWxsO1xuICAgIF9ncm91cExldmVsczogQXJyYXk8R3JvdXBMZXZlbE9iaj4gfCBudWxsO1xuXG4gICAgLy8gVGhpcyBpcyB0aGUgb3JkZXJlZCBsaXN0IG9mIHJlY29yZCBpZHMgKGJlZm9yZSBhbnkgZmlsdGVycyBhcmUgYXBwbGllZCkuXG4gICAgX29yZGVyZWRSZWNvcmRJZHM6IEFycmF5PHN0cmluZz4gfCBudWxsO1xuXG4gICAgLy8gbGF6aWx5IGdlbmVyYXRlZCBzZXQgb2YgcmVjb3JkIGlkc1xuICAgIF9yZWNvcmRJZHNTZXQ6IHtbc3RyaW5nXTogdHJ1ZSB8IHZvaWR9IHwgbnVsbCA9IG51bGw7XG5cbiAgICAvLyBOT1RFOiB3aGVuIGEgY2VsbFZhbHVlIGtleSAoY2VsbFZhbHVlcyBvciBjZWxsVmFsdWVzSW5GaWVsZDopIGlzIHdhdGNoZWQsIHdlIHdhbnRcbiAgICAvLyB0byBtYWtlIHN1cmUgd2Ugd2F0Y2ggdGhlIGFzc29jaWF0ZWQga2V5IG9uIHRoZSB0YWJsZS4gSG93ZXZlciwgd2UgbmVlZCB0byBtYWtlXG4gICAgLy8gc3VyZSB0aGF0IHdlIG9ubHkgd2F0Y2ggdGhlIHRhYmxlIG9uY2UgZm9yIGVhY2gga2V5LiBPdGhlcndpc2UsIHRoZSBjYWxsYmFja3NcbiAgICAvLyBmb3IgZWFjaCBrZXkgd2lsbCBnZXQgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIGZvciBlYWNoIGNoYW5nZSBldmVudC4gVGhpcyBpcyBiZWNhdXNlXG4gICAgLy8gV2F0Y2hhYmxlIHN0b3JlcyByZWZlcmVuY2VzIHRvIGNhbGxiYWNrcyBmb3IgZWFjaCBrZXksIGFuZCBvbiBlYWNoIF9vbkNoYW5nZSBldmVudFxuICAgIC8vIGNhbGxzIGVhY2ggY2FsbGJhY2sgZm9yIHRoYXQga2V5LiBJZiB3ZSB3YXRjaCB0aGUgdGFibGUgbW9yZSB0aGFuIG9uY2UsIHRoZW4gd2UnbGxcbiAgICAvLyBjYWxsIF9vbkNoYW5nZSBtb3JlIHRoYW4gb25jZSwgYW5kIGVhY2ggY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UsIHdoaWNoXG4gICAgLy8gaXMgdW5kZXNpcmFibGUuIEluc3RlYWQsIHdlJ2xsIHN0b3JlIHdhdGNoIGNvdW50cyBmb3IgZWFjaCBrZXkgdG8gbWFrZSBzdXJlIHdlIG9ubHlcbiAgICAvLyB3YXRjaCB0aGUgdGFibGUgb25jZS5cbiAgICBfY2VsbFZhbHVlS2V5V2F0Y2hDb3VudHM6IHtbc3RyaW5nXTogbnVtYmVyfTtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VNb2RlbDogVGFibGVNb2RlbCB8IFZpZXdNb2RlbCwgb3B0cz86IFF1ZXJ5UmVzdWx0T3B0cykge1xuICAgICAgICBjb25zdCB0YWJsZSA9IHNvdXJjZU1vZGVsIGluc3RhbmNlb2YgVmlld01vZGVsID8gc291cmNlTW9kZWwucGFyZW50VGFibGUgOiBzb3VyY2VNb2RlbDtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZE9wdHMgPSBRdWVyeVJlc3VsdC5fbm9ybWFsaXplT3B0cyh0YWJsZSwgb3B0cyk7XG4gICAgICAgIHN1cGVyKG5vcm1hbGl6ZWRPcHRzLCBzb3VyY2VNb2RlbC5fX2Jhc2VEYXRhKTtcblxuICAgICAgICB0aGlzLl9zb3VyY2VNb2RlbCA9IHNvdXJjZU1vZGVsO1xuICAgICAgICB0aGlzLl9tb3N0UmVjZW50U291cmNlTW9kZWxMb2FkUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RhYmxlID0gdGFibGU7XG5cbiAgICAgICAgY29uc3Qge3NvcnRzfSA9IHRoaXMuX25vcm1hbGl6ZWRPcHRzO1xuICAgICAgICBpZiAoc29ydHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwTGV2ZWxzOiBBcnJheTxHcm91cExldmVsT2JqPiA9IHNvcnRzLm1hcChzb3J0ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpZDogaC5pZC5nZW5lcmF0ZUdyb3VwTGV2ZWxJZCgpLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5JZDogc29ydC5maWVsZElkLFxuICAgICAgICAgICAgICAgICAgICBvcmRlcjogc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJyA/ICdkZXNjZW5kaW5nJyA6ICdhc2NlbmRpbmcnLFxuICAgICAgICAgICAgICAgICAgICBncm91cGluZ09wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsd2F5cyB1c2UgdGhlIHJhdyBjZWxsIHZhbHVlIChyYXRoZXIgdGhhbiBub3JtYWxpemluZyBmb3IgZ3JvdXBpbmcpIHNvXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGF0IGdyb3VwIGJlaGF2aW9yIG1hdGNoZXMgc29ydCByYXRoZXIgdGhhbiBncm91cCBieS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFVzZVJhd0NlbGxWYWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRpZS1icmVhayB1c2luZyByZWNvcmQgY3JlYXRlZCB0aW1lLlxuICAgICAgICAgICAgZ3JvdXBMZXZlbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IGguaWQuZ2VuZXJhdGVHcm91cExldmVsSWQoKSxcbiAgICAgICAgICAgICAgICBpc0NyZWF0ZWRUaW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJyxcbiAgICAgICAgICAgICAgICBncm91cGluZ09wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkVXNlUmF3Q2VsbFZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fZ3JvdXBMZXZlbHMgPSBncm91cExldmVscztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dyb3VwTGV2ZWxzID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Zpc0xpc3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9jZWxsVmFsdWVLZXlXYXRjaENvdW50cyA9IHt9O1xuXG4gICAgICAgIGxldCBmaWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuX25vcm1hbGl6ZWRPcHRzLmZpZWxkSWRzT3JOdWxsSWZBbGxGaWVsZHMpIHtcbiAgICAgICAgICAgIGZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGRJZCBvZiB0aGlzLl9ub3JtYWxpemVkT3B0cy5maWVsZElkc09yTnVsbElmQWxsRmllbGRzKSB7XG4gICAgICAgICAgICAgICAgZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkc1tmaWVsZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOZWVkIHRvIGxvYWQgZGF0YSBmb3IgZmllbGRzIHdlJ3JlIHNvcnRpbmcgYnksIGV2ZW4gaWZcbiAgICAgICAgICAgIC8vIHRoZXkncmUgbm90IGV4cGxpY2l0bHkgcmVxdWVzdGVkIGluIHRoZSBgZmllbGRzYCBvcHQuXG4gICAgICAgICAgICBpZiAodGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdyb3VwTGV2ZWwgb2YgdGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFncm91cExldmVsLmlzQ3JlYXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHNbZ3JvdXBMZXZlbC5jb2x1bW5JZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZWNvcmRDb2xvck1vZGUgPSB0aGlzLl9ub3JtYWxpemVkT3B0cy5yZWNvcmRDb2xvck1vZGU7XG4gICAgICAgICAgICBpZiAocmVjb3JkQ29sb3JNb2RlICYmIHJlY29yZENvbG9yTW9kZS50eXBlID09PSBSZWNvcmRDb2xvck1vZGVUeXBlcy5CWV9TRUxFQ1RfRklFTEQpIHtcbiAgICAgICAgICAgICAgICBmaWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzW3JlY29yZENvbG9yTW9kZS5zZWxlY3RGaWVsZC5pZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2ZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHMgPSBmaWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzO1xuXG4gICAgICAgIE9iamVjdC5zZWFsKHRoaXMpO1xuICAgIH1cbiAgICBnZXQgX2RhdGFPck51bGxJZkRlbGV0ZWQoKTogVGFibGVPclZpZXdRdWVyeVJlc3VsdERhdGEgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvdXJjZU1vZGVsLmlzRGVsZXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVjb3JkSWRzOiB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXQgX19zb3VyY2VNb2RlbElkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VNb2RlbC5pZDtcbiAgICB9XG4gICAgLyoqICovXG4gICAgZ2V0IHBhcmVudFRhYmxlKCk6IFRhYmxlTW9kZWwge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB2aWV3IHRoYXQgd2FzIHVzZWQgdG8gb2J0YWluIHRoaXMgUXVlcnlSZXN1bHQgYnkgY2FsbGluZ1xuICAgICAqIGB2aWV3LnNlbGVjdGAuIE51bGwgaWYgdGhlIFF1ZXJ5UmVzdWx0IHdhcyBvYnRhaW5lZCBieSBjYWxsaW5nXG4gICAgICogYHRhYmxlLnNlbGVjdGAuXG4gICAgICovXG4gICAgZ2V0IHBhcmVudFZpZXcoKTogVmlld01vZGVsIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VNb2RlbCBpbnN0YW5jZW9mIFRhYmxlTW9kZWwgPyBudWxsIDogdGhpcy5fc291cmNlTW9kZWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSByZWNvcmQgSURzIGluIHRoaXMgUXVlcnlSZXN1bHQuXG4gICAgICogVGhyb3dzIGlmIGRhdGEgaXMgbm90IGxvYWRlZCB5ZXQuXG4gICAgICovXG4gICAgZ2V0IHJlY29yZElkcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuaXNEYXRhTG9hZGVkLCAnUXVlcnlSZXN1bHQgZGF0YSBpcyBub3QgbG9hZGVkJyk7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9kYXRhLnJlY29yZElkcywgJ05vIHJlY29yZElkcycpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5yZWNvcmRJZHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBzZXQgb2YgcmVjb3JkIElEcyBpbiB0aGlzIFF1ZXJ5UmVzdWx0LlxuICAgICAqIFRocm93cyBpZiBkYXRhIGlzIG5vdCBsb2FkZWQgeWV0LlxuICAgICAqL1xuICAgIF9nZXRPckdlbmVyYXRlUmVjb3JkSWRzU2V0KCk6IHtbc3RyaW5nXTogdHJ1ZSB8IHZvaWR9IHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZWNvcmRJZHNTZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZElkc1NldCA9IHt9O1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiB0aGlzLnJlY29yZElkcykge1xuICAgICAgICAgICAgICAgIHJlY29yZElkc1NldFtyZWNvcmRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVjb3JkSWRzU2V0ID0gcmVjb3JkSWRzU2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlY29yZElkc1NldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGZpZWxkcyB0aGF0IHdlcmUgdXNlZCB0byBjcmVhdGUgdGhpcyBRdWVyeVJlc3VsdC5cbiAgICAgKiBOdWxsIGlmIGZpZWxkcyB3ZXJlIG5vdCBzcGVjaWZpZWQsIHdoaWNoIG1lYW5zIHRoZSBRdWVyeVJlc3VsdFxuICAgICAqIHdpbGwgbG9hZCBhbGwgZmllbGRzIGluIHRoZSB0YWJsZS5cbiAgICAgKi9cbiAgICBnZXQgZmllbGRzKCk6IEFycmF5PEZpZWxkTW9kZWw+IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHtmaWVsZElkc09yTnVsbElmQWxsRmllbGRzfSA9IHRoaXMuX25vcm1hbGl6ZWRPcHRzO1xuICAgICAgICBpZiAoZmllbGRJZHNPck51bGxJZkFsbEZpZWxkcykge1xuICAgICAgICAgICAgY29uc3QgZmllbGRzID0gW107XG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSBkZWxldGVkIGZpZWxkcywgc2luY2UgUXVlcnlSZXN1bHQgaXMgXCJsaXZlXCIuXG4gICAgICAgICAgICAvLyBJdCB3b3VsZCBiZSB0b28gY3VtYmVyc29tZSAoYW5kIGRlZmVhdCBwYXJ0IG9mIHRoZSBwdXJwb3NlIG9mXG4gICAgICAgICAgICAvLyB1c2luZyBRdWVyeVJlc3VsdCkgaWYgdGhlIHVzZXIgaGFkIHRvIG1hbnVhbGx5IHdhdGNoIGZvciBkZWxldGlvblxuICAgICAgICAgICAgLy8gb24gYWxsIHRoZSBmaWVsZHMgYW5kIHJlY3JlYXRlIHRoZSBRdWVyeVJlc3VsdC5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGRJZCBvZiBmaWVsZElkc09yTnVsbElmQWxsRmllbGRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLl90YWJsZS5nZXRGaWVsZEJ5SWQoZmllbGRJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IF9jZWxsVmFsdWVzRm9yU29ydFdhdGNoS2V5cygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwTGV2ZWxzXG4gICAgICAgICAgICA/IHUuY29tcGFjdChcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2dyb3VwTGV2ZWxzLm1hcChncm91cExldmVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBMZXZlbC5pc0NyZWF0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYGNlbGxWYWx1ZXNJbkZpZWxkOiR7Z3JvdXBMZXZlbC5jb2x1bW5JZH1gO1xuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogW107XG4gICAgfVxuICAgIGdldCBfcmVjb3Jkc1dhdGNoS2V5KCk6IFdhdGNoYWJsZVRhYmxlS2V5IHwgV2F0Y2hhYmxlVmlld0tleSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VNb2RlbCBpbnN0YW5jZW9mIFRhYmxlTW9kZWwgPyAncmVjb3JkcycgOiAndmlzaWJsZVJlY29yZHMnO1xuICAgIH1cbiAgICBnZXQgX2ZpZWxkc1dhdGNoS2V5KCk6IFdhdGNoYWJsZVRhYmxlS2V5IHtcbiAgICAgICAgcmV0dXJuICdmaWVsZHMnO1xuICAgIH1cbiAgICBnZXQgX3NvdXJjZU1vZGVsUmVjb3JkSWRzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlTW9kZWwgaW5zdGFuY2VvZiBUYWJsZU1vZGVsXG4gICAgICAgICAgICA/IHRoaXMuX3NvdXJjZU1vZGVsLnJlY29yZElkc1xuICAgICAgICAgICAgOiB0aGlzLl9zb3VyY2VNb2RlbC52aXNpYmxlUmVjb3JkSWRzO1xuICAgIH1cbiAgICBnZXQgX3NvdXJjZU1vZGVsUmVjb3JkcygpOiBBcnJheTxSZWNvcmRNb2RlbD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlTW9kZWwgaW5zdGFuY2VvZiBUYWJsZU1vZGVsXG4gICAgICAgICAgICA/IHRoaXMuX3NvdXJjZU1vZGVsLnJlY29yZHNcbiAgICAgICAgICAgIDogdGhpcy5fc291cmNlTW9kZWwudmlzaWJsZVJlY29yZHM7XG4gICAgfVxuICAgIF9pbmNyZW1lbnRDZWxsVmFsdWVLZXlXYXRjaENvdW50QW5kV2F0Y2hJZk5lY2Vzc2FyeShrZXk6IHN0cmluZywgd2F0Y2hDYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jZWxsVmFsdWVLZXlXYXRjaENvdW50c1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLl9jZWxsVmFsdWVLZXlXYXRjaENvdW50c1trZXldID0gMDtcblxuICAgICAgICAgICAgdGhpcy5fdGFibGUud2F0Y2goa2V5LCB3YXRjaENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NlbGxWYWx1ZUtleVdhdGNoQ291bnRzW2tleV0rKztcbiAgICB9XG4gICAgX2RlY3JlbWVudENlbGxWYWx1ZUtleVdhdGNoQ291bnRBbmRVbndhdGNoSWZQb3NzaWJsZShrZXk6IHN0cmluZywgd2F0Y2hDYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jZWxsVmFsdWVLZXlXYXRjaENvdW50c1trZXldKSB7XG4gICAgICAgICAgICAvLyBLZXkgaXNuJ3Qgd2F0Y2hlZCwgc28ganVzdCBza2lwIGl0LiBUaGlzIG1hdGNoZXMgYmVoYXZpb3Igb2YgV2F0Y2hhYmxlLFxuICAgICAgICAgICAgLy8gd2hlcmUgY2FsbGluZyB1bndhdGNoIG9uIGEga2V5IHRoYXQgaXNuJ3Qgd2F0Y2hlZCBqdXN0IG5vLW9wcy5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NlbGxWYWx1ZUtleVdhdGNoQ291bnRzW2tleV0tLTtcblxuICAgICAgICBpZiAodGhpcy5fY2VsbFZhbHVlS2V5V2F0Y2hDb3VudHNba2V5XSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UncmUgZG93biB0byB6ZXJvIHdhdGNoZXMgZm9yIHRoaXMga2V5LCBzbyB3ZSBjYW4gYWN0dWFsbHkgdW53YXRjaCBpdCBub3cuXG4gICAgICAgICAgICB0aGlzLl90YWJsZS51bndhdGNoKGtleSwgd2F0Y2hDYWxsYmFjaywgdGhpcyk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2VsbFZhbHVlS2V5V2F0Y2hDb3VudHNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXkgfCBBcnJheTxXYXRjaGFibGVRdWVyeVJlc3VsdEtleT4sXG4gICAgICAgIGNhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgY29udGV4dD86ID9PYmplY3QsXG4gICAgKTogQXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgICAgICAgICBrZXlzID0gW2tleXNdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkS2V5cyA9IHN1cGVyLndhdGNoKGtleXMsIGNhbGxiYWNrLCBjb250ZXh0KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB2YWxpZEtleXMpIHtcbiAgICAgICAgICAgIGlmICh1LnN0YXJ0c1dpdGgoa2V5LCBRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZElkID0ga2V5LnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlQ2VsbFZhbHVlc0luRmllbGRLZXlQcmVmaXgubGVuZ3RoLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzICYmXG4gICAgICAgICAgICAgICAgICAgICF1Lmhhcyh0aGlzLl9maWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzLCBmaWVsZElkKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgQ2FuJ3Qgd2F0Y2ggZmllbGQgYmVjYXVzZSBpdCB3YXNuJ3QgaW5jbHVkZWQgaW4gUXVlcnlSZXN1bHQgZmllbGRzOiAke2ZpZWxkSWR9YCxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5faW5jcmVtZW50Q2VsbFZhbHVlS2V5V2F0Y2hDb3VudEFuZFdhdGNoSWZOZWNlc3NhcnkoXG4gICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DZWxsVmFsdWVzSW5GaWVsZENoYW5nZWQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5jZWxsVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIE9iamVjdC5rZXlzKHRoaXMuX2ZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmNyZW1lbnRDZWxsVmFsdWVLZXlXYXRjaENvdW50QW5kV2F0Y2hJZk5lY2Vzc2FyeShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCArIGZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DZWxsVmFsdWVzQ2hhbmdlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmNyZW1lbnRDZWxsVmFsdWVLZXlXYXRjaENvdW50QW5kV2F0Y2hJZk5lY2Vzc2FyeShcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQ2VsbFZhbHVlc0NoYW5nZWQsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbGlkS2V5cztcbiAgICB9XG4gICAgdW53YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXkgfCBBcnJheTxXYXRjaGFibGVRdWVyeVJlc3VsdEtleT4sXG4gICAgICAgIGNhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgY29udGV4dD86ID9PYmplY3QsXG4gICAgKTogQXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgICAgICAgICBrZXlzID0gW2tleXNdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkS2V5cyA9IHN1cGVyLnVud2F0Y2goa2V5cywgY2FsbGJhY2ssIGNvbnRleHQpO1xuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHZhbGlkS2V5cykge1xuICAgICAgICAgICAgaWYgKHUuc3RhcnRzV2l0aChrZXksIFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlY3JlbWVudENlbGxWYWx1ZUtleVdhdGNoQ291bnRBbmRVbndhdGNoSWZQb3NzaWJsZShcbiAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkNlbGxWYWx1ZXNJbkZpZWxkQ2hhbmdlZCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBRdWVyeVJlc3VsdC5XYXRjaGFibGVLZXlzLmNlbGxWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZpZWxkSWQgb2YgT2JqZWN0LmtleXModGhpcy5fZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlY3JlbWVudENlbGxWYWx1ZUtleVdhdGNoQ291bnRBbmRVbndhdGNoSWZQb3NzaWJsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBRdWVyeVJlc3VsdC5XYXRjaGFibGVDZWxsVmFsdWVzSW5GaWVsZEtleVByZWZpeCArIGZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DZWxsVmFsdWVzQ2hhbmdlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWNyZW1lbnRDZWxsVmFsdWVLZXlXYXRjaENvdW50QW5kVW53YXRjaElmUG9zc2libGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkNlbGxWYWx1ZXNDaGFuZ2VkLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZEtleXM7XG4gICAgfVxuICAgIGFzeW5jIGxvYWREYXRhQXN5bmMoKSB7XG4gICAgICAgIGxldCBzb3VyY2VNb2RlbExvYWRQcm9taXNlO1xuICAgICAgICBsZXQgY2VsbFZhbHVlc0luRmllbGRzTG9hZFByb21pc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2ZpZWxkSWRzU2V0VG9Mb2FkT3JOdWxsSWZBbGxGaWVsZHMpIHtcbiAgICAgICAgICAgIGNlbGxWYWx1ZXNJbkZpZWxkc0xvYWRQcm9taXNlID0gdGhpcy5fdGFibGUubG9hZENlbGxWYWx1ZXNJbkZpZWxkSWRzQXN5bmMoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkcyksXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTG9hZCBhbGwgZmllbGRzLlxuICAgICAgICAgICAgY2VsbFZhbHVlc0luRmllbGRzTG9hZFByb21pc2UgPSB0aGlzLl90YWJsZS5sb2FkRGF0YUFzeW5jKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fc291cmNlTW9kZWwgaW5zdGFuY2VvZiBUYWJsZU1vZGVsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkcykge1xuICAgICAgICAgICAgICAgIHNvdXJjZU1vZGVsTG9hZFByb21pc2UgPSB0aGlzLl90YWJsZS5sb2FkUmVjb3JkTWV0YWRhdGFBc3luYygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0YWJsZS5sb2FkRGF0YUFzeW5jIGlzIGEgc3VwZXJzZXQgb2YgbG9hZFJlY29yZE1ldGFkYXRhQXN5bmMsXG4gICAgICAgICAgICAgICAgLy8gc28gbm8gbmVlZCB0byBsb2FkIHJlY29yZCBtZXRhZGF0YSBhZ2Fpbi5cbiAgICAgICAgICAgICAgICBzb3VyY2VNb2RlbExvYWRQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZU1vZGVsTG9hZFByb21pc2UgPSB0aGlzLl9zb3VyY2VNb2RlbC5sb2FkRGF0YUFzeW5jKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3N0UmVjZW50U291cmNlTW9kZWxMb2FkUHJvbWlzZSA9IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHNvdXJjZU1vZGVsTG9hZFByb21pc2UsXG4gICAgICAgICAgICBjZWxsVmFsdWVzSW5GaWVsZHNMb2FkUHJvbWlzZSxcbiAgICAgICAgICAgIHRoaXMuX2xvYWRSZWNvcmRDb2xvcnNBc3luYygpLFxuICAgICAgICBdKTtcblxuICAgICAgICBhd2FpdCBzdXBlci5sb2FkRGF0YUFzeW5jKCk7XG4gICAgfVxuICAgIGFzeW5jIF9sb2FkRGF0YUFzeW5jKCk6IFByb21pc2U8QXJyYXk8V2F0Y2hhYmxlUXVlcnlSZXN1bHRLZXk+PiB7XG4gICAgICAgIHRhYmxlT3JWaWV3UXVlcnlSZXN1bHRQb29sLnJlZ2lzdGVyT2JqZWN0Rm9yUmV1c2UodGhpcyk7XG5cbiAgICAgICAgaW52YXJpYW50KHRoaXMuX21vc3RSZWNlbnRTb3VyY2VNb2RlbExvYWRQcm9taXNlLCAnTm8gc291cmNlIG1vZGVsIGxvYWQgcHJvbWlzZXMnKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fbW9zdFJlY2VudFNvdXJjZU1vZGVsTG9hZFByb21pc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuX2dyb3VwTGV2ZWxzKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXBsYWNlVmlzTGlzdCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29yZGVyZWRSZWNvcmRJZHMgPSB0aGlzLl9nZW5lcmF0ZU9yZGVyZWRSZWNvcmRJZHMoKTtcblxuICAgICAgICB0aGlzLl9zb3VyY2VNb2RlbC53YXRjaChcbiAgICAgICAgICAgIC8vIGZsb3ctZGlzYWJsZS1uZXh0LWxpbmUgc2luY2Ugd2Uga25vdyB0aGlzIHdhdGNoIGtleSBpcyB2YWxpZC5cbiAgICAgICAgICAgIHRoaXMuX3JlY29yZHNXYXRjaEtleSxcbiAgICAgICAgICAgIHRoaXMuX29uUmVjb3Jkc0NoYW5nZWQsXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuX3RhYmxlLndhdGNoKHRoaXMuX2NlbGxWYWx1ZXNGb3JTb3J0V2F0Y2hLZXlzLCB0aGlzLl9vbkNlbGxWYWx1ZXNGb3JTb3J0Q2hhbmdlZCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fdGFibGUud2F0Y2godGhpcy5fZmllbGRzV2F0Y2hLZXksIHRoaXMuX29uVGFibGVGaWVsZHNDaGFuZ2VkLCB0aGlzKTtcblxuICAgICAgICBpZiAodGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZ3JvdXBMZXZlbCBvZiB0aGlzLl9ncm91cExldmVscykge1xuICAgICAgICAgICAgICAgIGlmIChncm91cExldmVsLmlzQ3JlYXRlZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fdGFibGUuZ2V0RmllbGRCeUlkKGdyb3VwTGV2ZWwuY29sdW1uSWQpO1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC53YXRjaCgnY29uZmlnJywgdGhpcy5fb25GaWVsZENvbmZpZ0NoYW5nZWQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYW5nZWRLZXlzID0gW1xuICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRzLFxuICAgICAgICAgICAgUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRJZHMsXG4gICAgICAgICAgICBRdWVyeVJlc3VsdC5XYXRjaGFibGVLZXlzLmNlbGxWYWx1ZXMsXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgZmllbGRJZHMgPVxuICAgICAgICAgICAgdGhpcy5fbm9ybWFsaXplZE9wdHMuZmllbGRJZHNPck51bGxJZkFsbEZpZWxkcyB8fFxuICAgICAgICAgICAgdGhpcy5fdGFibGUuZmllbGRzLm1hcChmaWVsZCA9PiBmaWVsZC5pZCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIGZpZWxkSWRzKSB7XG4gICAgICAgICAgICBjaGFuZ2VkS2V5cy5wdXNoKFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUNlbGxWYWx1ZXNJbkZpZWxkS2V5UHJlZml4ICsgZmllbGRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hhbmdlZEtleXM7XG4gICAgfVxuICAgIHVubG9hZERhdGEoKSB7XG4gICAgICAgIHN1cGVyLnVubG9hZERhdGEoKTtcblxuICAgICAgICBpZiAodGhpcy5fc291cmNlTW9kZWwgaW5zdGFuY2VvZiBUYWJsZU1vZGVsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZmllbGRJZHNTZXRUb0xvYWRPck51bGxJZkFsbEZpZWxkcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZU1vZGVsLnVubG9hZFJlY29yZE1ldGFkYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZU1vZGVsLnVubG9hZERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZU1vZGVsLnVubG9hZERhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9maWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzKSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZS51bmxvYWRDZWxsVmFsdWVzSW5GaWVsZElkcyhcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9maWVsZElkc1NldFRvTG9hZE9yTnVsbElmQWxsRmllbGRzKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91bmxvYWRSZWNvcmRDb2xvcnMoKTtcbiAgICB9XG4gICAgX3VubG9hZERhdGEoKSB7XG4gICAgICAgIHRoaXMuX21vc3RSZWNlbnRTb3VyY2VNb2RlbExvYWRQcm9taXNlID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9zb3VyY2VNb2RlbC51bndhdGNoKFxuICAgICAgICAgICAgLy8gZmxvdy1kaXNhYmxlLW5leHQtbGluZSBzaW5jZSB3ZSBrbm93IHRoaXMgd2F0Y2gga2V5IGlzIHZhbGlkLlxuICAgICAgICAgICAgdGhpcy5fcmVjb3Jkc1dhdGNoS2V5LFxuICAgICAgICAgICAgdGhpcy5fb25SZWNvcmRzQ2hhbmdlZCxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fdGFibGUudW53YXRjaChcbiAgICAgICAgICAgIHRoaXMuX2NlbGxWYWx1ZXNGb3JTb3J0V2F0Y2hLZXlzLFxuICAgICAgICAgICAgdGhpcy5fb25DZWxsVmFsdWVzRm9yU29ydENoYW5nZWQsXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuX3RhYmxlLnVud2F0Y2godGhpcy5fZmllbGRzV2F0Y2hLZXksIHRoaXMuX29uVGFibGVGaWVsZHNDaGFuZ2VkLCB0aGlzKTtcblxuICAgICAgICAvLyBJZiB0aGUgdGFibGUgaXMgZGVsZXRlZCwgY2FuJ3QgY2FsbCBnZXRGaWVsZEJ5SWQgb24gaXQgYmVsb3cuXG4gICAgICAgIGlmICghdGhpcy5fdGFibGUuaXNEZWxldGVkICYmIHRoaXMuX2dyb3VwTGV2ZWxzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGdyb3VwTGV2ZWwgb2YgdGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBMZXZlbC5pc0NyZWF0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3RhYmxlLmdldEZpZWxkQnlJZChncm91cExldmVsLmNvbHVtbklkKTtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQudW53YXRjaCgnY29uZmlnJywgdGhpcy5fb25GaWVsZENvbmZpZ0NoYW5nZWQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Zpc0xpc3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVjb3JkSWRzU2V0ID0gbnVsbDtcblxuICAgICAgICB0YWJsZU9yVmlld1F1ZXJ5UmVzdWx0UG9vbC51bnJlZ2lzdGVyT2JqZWN0Rm9yUmV1c2UodGhpcyk7XG4gICAgfVxuICAgIF9nZXRDb2x1bW5zQnlJZCgpOiB7W3N0cmluZ106IE9iamVjdH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFibGUuZmllbGRzLnJlZHVjZSgocmVzdWx0LCBmaWVsZCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2ZpZWxkLmlkXSA9IGZpZWxkLl9fZ2V0UmF3Q29sdW1uKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxuICAgIF9hZGRSZWNvcmRJZHNUb1Zpc0xpc3QocmVjb3JkSWRzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbnNCeUlkID0gdGhpcy5fZ2V0Q29sdW1uc0J5SWQoKTtcbiAgICAgICAgY29uc3QgdmlzTGlzdCA9IHRoaXMuX3Zpc0xpc3Q7XG4gICAgICAgIGludmFyaWFudCh2aXNMaXN0LCAnTm8gdmlzIGxpc3QnKTtcbiAgICAgICAgZm9yIChjb25zdCByZWNvcmRJZCBvZiByZWNvcmRJZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuX3RhYmxlLmdldFJlY29yZEJ5SWQocmVjb3JkSWQpO1xuICAgICAgICAgICAgaW52YXJpYW50KHJlY29yZCwgJ1JlY29yZCBtaXNzaW5nIGluIHRhYmxlJyk7XG4gICAgICAgICAgICBjb25zdCByb3dKc29uID0gcmVjb3JkLl9fZ2V0UmF3Um93KCk7XG4gICAgICAgICAgICBjb25zdCBncm91cFBhdGggPSBHcm91cEFzc2lnbmVyLmdldEdyb3VwUGF0aEZvclJvdyhcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZS5wYXJlbnRCYXNlLl9fYXBwSW50ZXJmYWNlLFxuICAgICAgICAgICAgICAgIHRoaXMuX2dldEdyb3VwTGV2ZWxzV2l0aERlbGV0ZWRGaWVsZHNGaWx0ZXJlZCgpLFxuICAgICAgICAgICAgICAgIGNvbHVtbnNCeUlkLFxuICAgICAgICAgICAgICAgIHJvd0pzb24sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdmlzTGlzdC5hZGRJZFRvR3JvdXBBdEVuZChyZWNvcmRJZCwgdHJ1ZSwgZ3JvdXBQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfb25SZWNvcmRzQ2hhbmdlZChcbiAgICAgICAgbW9kZWw6IFRhYmxlTW9kZWwgfCBWaWV3TW9kZWwsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICB1cGRhdGVzOiA/e2FkZGVkUmVjb3JkSWRzOiBBcnJheTxzdHJpbmc+LCByZW1vdmVkUmVjb3JkSWRzOiBBcnJheTxzdHJpbmc+fSxcbiAgICApIHtcbiAgICAgICAgaWYgKG1vZGVsIGluc3RhbmNlb2YgVmlld01vZGVsKSB7XG4gICAgICAgICAgICAvLyBGb3IgYSB2aWV3IG1vZGVsLCB3ZSBkb24ndCBnZXQgdXBkYXRlcyBzZW50IHdpdGggdGhlIG9uQ2hhbmdlIGV2ZW50LFxuICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBtYW51YWxseSBnZW5lcmF0ZSB1cGRhdGVzIGJhc2VkIG9uIHRoZSBvbGQgYW5kIG5ld1xuICAgICAgICAgICAgLy8gcmVjb3JkSWRzLlxuICAgICAgICAgICAgaWYgKHRoaXMuX29yZGVyZWRSZWNvcmRJZHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRlZFJlY29yZElkcyA9IHUuZGlmZmVyZW5jZShtb2RlbC52aXNpYmxlUmVjb3JkSWRzLCB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVkUmVjb3JkSWRzID0gdS5kaWZmZXJlbmNlKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzLFxuICAgICAgICAgICAgICAgICAgICBtb2RlbC52aXNpYmxlUmVjb3JkSWRzLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdXBkYXRlcyA9IHthZGRlZFJlY29yZElkcywgcmVtb3ZlZFJlY29yZElkc307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZXMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1cGRhdGVzKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdXBkYXRlcywgZG8gbm90aGluZywgc2luY2Ugd2UnbGwgaGFuZGxlIHRoZSBpbml0aWFsXG4gICAgICAgICAgICAvLyBjYWxsYmFjayB3aGVuIHRoZSByZWNvcmQgc2V0IGlzIGxvYWRlZCAoYW5kIHdlIGRvbid0IHdhbnQgdG8gZmlyZVxuICAgICAgICAgICAgLy8gYSByZWNvcmRzIGNoYW5nZSB0d2ljZSB3aXRoIG5vIGRhdGEpLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge2FkZGVkUmVjb3JkSWRzLCByZW1vdmVkUmVjb3JkSWRzfSA9IHVwZGF0ZXM7XG5cbiAgICAgICAgaWYgKHRoaXMuX2dyb3VwTGV2ZWxzKSB7XG4gICAgICAgICAgICBjb25zdCB2aXNMaXN0ID0gdGhpcy5fdmlzTGlzdDtcbiAgICAgICAgICAgIGludmFyaWFudCh2aXNMaXN0LCAnTm8gdmlzIGxpc3QnKTtcblxuICAgICAgICAgICAgaWYgKHJlbW92ZWRSZWNvcmRJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZpc0xpc3QucmVtb3ZlTXVsdGlwbGVJZHMocmVtb3ZlZFJlY29yZElkcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhZGRlZFJlY29yZElkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkUmVjb3JkSWRzVG9WaXNMaXN0KGFkZGVkUmVjb3JkSWRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZWNvcmRJZHNTZXQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgYWRkZWRSZWNvcmRJZHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRJZHNTZXRbcmVjb3JkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkSWQgb2YgcmVtb3ZlZFJlY29yZElkcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29yZElkc1NldFtyZWNvcmRJZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSd2ZSBhcHBsaWVkIG91ciBjaGFuZ2VzIChpZiBhcHBsaWNhYmxlKSwgbGV0J3MgcmVnZW5lcmF0ZSBvdXIgcmVjb3JkSWRzLlxuICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzID0gdGhpcy5fZ2VuZXJhdGVPcmRlcmVkUmVjb3JkSWRzKCk7XG5cbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRzLCB1cGRhdGVzKTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRJZHMsIHVwZGF0ZXMpO1xuICAgIH1cbiAgICBfb25DZWxsVmFsdWVzRm9yU29ydENoYW5nZWQoXG4gICAgICAgIHRhYmxlOiBUYWJsZU1vZGVsLFxuICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgcmVjb3JkSWRzOiA/QXJyYXk8c3RyaW5nPixcbiAgICAgICAgZmllbGRJZDogP3N0cmluZyxcbiAgICApIHtcbiAgICAgICAgaWYgKCFyZWNvcmRJZHMgfHwgIWZpZWxkSWQpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyB1cGRhdGVzLCBkbyBub3RoaW5nLCBzaW5jZSB3ZSdsbCBoYW5kbGUgdGhlIGluaXRpYWxcbiAgICAgICAgICAgIC8vIGNhbGxiYWNrIHdoZW4gdGhlIHJlY29yZCBzZXQgaXMgbG9hZGVkIChhbmQgd2UgZG9uJ3Qgd2FudCB0byBmaXJlXG4gICAgICAgICAgICAvLyBhIHJlY29yZHMgY2hhbmdlIHR3aWNlIHdpdGggbm8gZGF0YSkuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOT1RFOiB0aGlzIHdpbGwgb25seSBldmVyIGJlIGNhbGxlZCBpZiB3ZSBoYXZlIHNvcnRzLCBzbyBpdCdzIHNhZmUgdG8gYXNzZXJ0IHRoYXQgd2UgaGF2ZVxuICAgICAgICAvLyBhIHZpcyBsaXN0IGhlcmUuXG4gICAgICAgIGNvbnN0IHZpc0xpc3QgPSB0aGlzLl92aXNMaXN0O1xuICAgICAgICBpbnZhcmlhbnQodmlzTGlzdCwgJ05vIHZpcyBsaXN0Jyk7XG5cbiAgICAgICAgaWYgKHJlY29yZElkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIE5vdGhpbmcgYWN0dWFsbHkgY2hhbmdlZCwgc28ganVzdCBicmVhayBvdXQgZWFybHkuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZlIHRoZSByZWNvcmQgaWRzIGluIHRoZSB2aXMgbGlzdC5cbiAgICAgICAgLy8gTm90ZTogdGhlIGNlbGwgdmFsdWUgY2hhbmdlcyBtYXkgaGF2ZSByZXN1bHRlZCBpbiB0aGUgcmVjb3Jkc1xuICAgICAgICAvLyBiZWluZyBmaWx0ZXJlZCBvdXQuIFNvIGRvbid0IHRyeSB0byByZW1vdmUgYW5kIHJlLWFkZCB0aGVtIGlmXG4gICAgICAgIC8vIHRoZXkncmUgbm8gbG9uZ2VyIHZpc2libGUuXG4gICAgICAgIGNvbnN0IHZpc2libGVSZWNvcmRJZHMgPSByZWNvcmRJZHMuZmlsdGVyKHJlY29yZElkID0+IHZpc0xpc3QuaXNJZFZpc2libGUocmVjb3JkSWQpKTtcbiAgICAgICAgdmlzTGlzdC5yZW1vdmVNdWx0aXBsZUlkcyh2aXNpYmxlUmVjb3JkSWRzKTtcbiAgICAgICAgdGhpcy5fYWRkUmVjb3JkSWRzVG9WaXNMaXN0KHZpc2libGVSZWNvcmRJZHMpO1xuICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzID0gdGhpcy5fZ2VuZXJhdGVPcmRlcmVkUmVjb3JkSWRzKCk7XG5cbiAgICAgICAgY29uc3QgY2hhbmdlRGF0YSA9IHthZGRlZFJlY29yZElkczogW10sIHJlbW92ZWRSZWNvcmRJZHM6IFtdfTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRzLCBjaGFuZ2VEYXRhKTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRJZHMsIGNoYW5nZURhdGEpO1xuICAgIH1cbiAgICBfb25GaWVsZENvbmZpZ0NoYW5nZWQoZmllbGQ6IEZpZWxkTW9kZWwsIGtleTogc3RyaW5nKSB7XG4gICAgICAgIC8vIEZpZWxkIGNvbmZpZyBjaGFuZ2VkIGZvciBhIGZpZWxkIHdlIHJlbHkgb24sIHNvIHdlIG5lZWQgdG8gcmVwbGFjZSBvdXIgdmlzIGxpc3QuXG4gICAgICAgIC8vIE5PVEU6IHRoaXMgd2lsbCBvbmx5IGV2ZXIgYmUgY2FsbGVkIGlmIHdlIGhhdmUgc29ydHMsIHNvIGl0J3Mgc2FmZSB0byBhc3N1bWUgd2VcbiAgICAgICAgLy8gYXJlIHVzaW5nIGEgdmlzIGxpc3QgaGVyZS5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVZpc0xpc3QoKTtcbiAgICAgICAgdGhpcy5fb3JkZXJlZFJlY29yZElkcyA9IHRoaXMuX2dlbmVyYXRlT3JkZXJlZFJlY29yZElkcygpO1xuICAgIH1cbiAgICBfb25UYWJsZUZpZWxkc0NoYW5nZWQoXG4gICAgICAgIHRhYmxlOiBUYWJsZU1vZGVsLFxuICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgdXBkYXRlczoge2FkZGVkRmllbGRJZHM6IEFycmF5PHN0cmluZz4sIHJlbW92ZWRGaWVsZElkczogQXJyYXk8c3RyaW5nPn0sXG4gICAgKSB7XG4gICAgICAgIGlmICghdGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYW55IHNvcnRzLCB3ZSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nIGluIHJlc3BvbnNlIHRvIGZpZWxkIGNoYW5nZXMuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7YWRkZWRGaWVsZElkcywgcmVtb3ZlZEZpZWxkSWRzfSA9IHVwZGF0ZXM7XG4gICAgICAgIGNvbnN0IGZpZWxkSWRzU2V0ID0gdGhpcy5fZ3JvdXBMZXZlbHMucmVkdWNlKChyZXN1bHQsIGdyb3VwTGV2ZWwpID0+IHtcbiAgICAgICAgICAgIGlmICghZ3JvdXBMZXZlbC5pc0NyZWF0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2dyb3VwTGV2ZWwuY29sdW1uSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICAvLyBDaGVjayBpZiBhbnkgZmllbGRzIHRoYXQgd2UgcmVseSBvbiB3ZXJlIGNyZWF0ZWQgb3IgZGVsZXRlZC4gSWYgdGhleSB3ZXJlLFxuICAgICAgICAvLyByZXBsYWNlIG91ciB2aXMgbGlzdC5cbiAgICAgICAgLy8gTk9URTogd2UgbmVlZCB0byBjaGVjayBmb3IgY3JlYXRlZCwgc2luY2UgYSBmaWVsZCB0aGF0IHdlIHJlbHkgb24gY2FuIGJlXG4gICAgICAgIC8vIGRlbGV0ZWQgYW5kIHRoZW4gdW5kZWxldGVkLlxuICAgICAgICBsZXQgd2VyZUFueUZpZWxkc0NyZWF0ZWRPckRlbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZElkIG9mIGFkZGVkRmllbGRJZHMpIHtcbiAgICAgICAgICAgIC8vIElmIGEgZmllbGQgdGhhdCB3ZSByZWx5IG9uIHdhcyBjcmVhdGVkIChpLmUuIGl0IHdhcyB1bmRlbGV0ZWQpLCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UncmUgd2F0Y2hpbmcgaXQncyBjb25maWcuXG4gICAgICAgICAgICBpZiAodS5oYXMoZmllbGRJZHNTZXQsIGZpZWxkSWQpKSB7XG4gICAgICAgICAgICAgICAgd2VyZUFueUZpZWxkc0NyZWF0ZWRPckRlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fdGFibGUuZ2V0RmllbGRCeUlkKGZpZWxkSWQpO1xuICAgICAgICAgICAgICAgIGludmFyaWFudChmaWVsZCwgJ0NyZWF0ZWQgZmllbGQgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgICAgICAgICBmaWVsZC53YXRjaCgnY29uZmlnJywgdGhpcy5fb25GaWVsZENvbmZpZ0NoYW5nZWQsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3ZXJlQW55RmllbGRzQ3JlYXRlZE9yRGVsZXRlZCkge1xuICAgICAgICAgICAgd2VyZUFueUZpZWxkc0NyZWF0ZWRPckRlbGV0ZWQgPSB1LnNvbWUocmVtb3ZlZEZpZWxkSWRzLCBmaWVsZElkID0+XG4gICAgICAgICAgICAgICAgdS5oYXMoZmllbGRJZHNTZXQsIGZpZWxkSWQpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3ZXJlQW55RmllbGRzQ3JlYXRlZE9yRGVsZXRlZCkge1xuICAgICAgICAgICAgLy8gT25lIG9mIHRoZSBmaWVsZHMgd2UncmUgcmVseWluZyBvbiB3YXMgZGVsZXRlZCxcbiAgICAgICAgICAgIHRoaXMuX3JlcGxhY2VWaXNMaXN0KCk7XG4gICAgICAgICAgICB0aGlzLl9vcmRlcmVkUmVjb3JkSWRzID0gdGhpcy5fZ2VuZXJhdGVPcmRlcmVkUmVjb3JkSWRzKCk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBmaXJlIG9uQ2hhbmdlIGV2ZW50cyBzaW5jZSB0aGUgb3JkZXIgbWF5IGhhdmUgY2hhbmdlZFxuICAgICAgICAgICAgLy8gYXMgYSByZXN1bHQuXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VEYXRhID0ge2FkZGVkUmVjb3JkSWRzOiBbXSwgcmVtb3ZlZFJlY29yZElkczogW119O1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoUXVlcnlSZXN1bHQuV2F0Y2hhYmxlS2V5cy5yZWNvcmRzLCBjaGFuZ2VEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlKFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUtleXMucmVjb3JkSWRzLCBjaGFuZ2VEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfb25DZWxsVmFsdWVzQ2hhbmdlZCh0YWJsZTogVGFibGVNb2RlbCwga2V5OiBzdHJpbmcsIHVwZGF0ZXM6ID9PYmplY3QpIHtcbiAgICAgICAgaWYgKCF1cGRhdGVzKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gdXBkYXRlcywgZG8gbm90aGluZywgc2luY2Ugd2UnbGwgaGFuZGxlIHRoZSBpbml0aWFsXG4gICAgICAgICAgICAvLyBjYWxsYmFjayB3aGVuIHRoZSByZWNvcmQgc2V0IGlzIGxvYWRlZCAoYW5kIHdlIGRvbid0IHdhbnQgdG8gZmlyZVxuICAgICAgICAgICAgLy8gYSBjZWxsVmFsdWVzIGNoYW5nZSB0d2ljZSB3aXRoIG5vIGRhdGEpLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKFF1ZXJ5UmVzdWx0LldhdGNoYWJsZUtleXMuY2VsbFZhbHVlcywgdXBkYXRlcyk7XG4gICAgfVxuICAgIF9vbkNlbGxWYWx1ZXNJbkZpZWxkQ2hhbmdlZChcbiAgICAgICAgdGFibGU6IFRhYmxlTW9kZWwsXG4gICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICByZWNvcmRJZHM6ID9BcnJheTxzdHJpbmc+LFxuICAgICAgICBmaWVsZElkOiA/c3RyaW5nLFxuICAgICkge1xuICAgICAgICBpZiAoIXJlY29yZElkcyAmJiAhZmllbGRJZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHVwZGF0ZXMsIGRvIG5vdGhpbmcsIHNpbmNlIHdlJ2xsIGhhbmRsZSB0aGUgaW5pdGlhbFxuICAgICAgICAgICAgLy8gY2FsbGJhY2sgd2hlbiB0aGUgcmVjb3JkIHNldCBpcyBsb2FkZWQgKGFuZCB3ZSBkb24ndCB3YW50IHRvIGZpcmVcbiAgICAgICAgICAgIC8vIGEgY2VsbFZhbHVlc0luRmllbGQgY2hhbmdlIHR3aWNlIHdpdGggbm8gZGF0YSkuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25DaGFuZ2Uoa2V5LCByZWNvcmRJZHMsIGZpZWxkSWQpO1xuICAgIH1cbiAgICBfZ2VuZXJhdGVPcmRlcmVkUmVjb3JkSWRzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBpZiAodGhpcy5fZ3JvdXBMZXZlbHMpIHtcbiAgICAgICAgICAgIGludmFyaWFudCh0aGlzLl92aXNMaXN0LCAnQ2Fubm90IGdlbmVyYXRlIHJlY29yZCBpZHMgd2l0aG91dCBhIHZpcyBsaXN0Jyk7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRJZHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc0xpc3QuZWFjaFZpc2libGVJZEluR3JvdXBlZE9yZGVyKHJlY29yZElkID0+IHJlY29yZElkcy5wdXNoKHJlY29yZElkKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkSWRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZU1vZGVsUmVjb3JkSWRzO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZXBsYWNlVmlzTGlzdCgpIHtcbiAgICAgICAgY29uc3Qgcm93c0J5SWQgPSB7fTtcbiAgICAgICAgY29uc3Qgcm93VmlzaWJpbGl0eU9iakFycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgdGhpcy5fc291cmNlTW9kZWxSZWNvcmRzKSB7XG4gICAgICAgICAgICByb3dzQnlJZFtyZWNvcmQuaWRdID0gcmVjb3JkLl9fZ2V0UmF3Um93KCk7XG4gICAgICAgICAgICByb3dWaXNpYmlsaXR5T2JqQXJyYXkucHVzaCh7cm93SWQ6IHJlY29yZC5pZCwgdmlzaWJpbGl0eTogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29sdW1uc0J5SWQgPSB0aGlzLl9nZXRDb2x1bW5zQnlJZCgpO1xuXG4gICAgICAgIGNvbnN0IGdyb3VwTGV2ZWxzID0gdGhpcy5fZ2V0R3JvdXBMZXZlbHNXaXRoRGVsZXRlZEZpZWxkc0ZpbHRlcmVkKCk7XG5cbiAgICAgICAgY29uc3QgZ3JvdXBBc3NpZ25lciA9IG5ldyBHcm91cEFzc2lnbmVyKHtcbiAgICAgICAgICAgIGFwcEludGVyZmFjZTogdGhpcy5fdGFibGUucGFyZW50QmFzZS5fX2FwcEludGVyZmFjZSxcbiAgICAgICAgICAgIGdyb3VwTGV2ZWxzLFxuICAgICAgICAgICAgcm93c0J5SWQsXG4gICAgICAgICAgICBjb2x1bW5zQnlJZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZ3JvdXBLZXlDb21wYXJhdG9ycyA9IGdyb3VwQXNzaWduZXIuZ2V0R3JvdXBLZXlDb21wYXJhdG9ycygpO1xuICAgICAgICBjb25zdCBncm91cFBhdGhzQnlSb3dJZCA9IGdyb3VwQXNzaWduZXIuZ2V0R3JvdXBQYXRoc0J5Um93SWQoKTtcbiAgICAgICAgdGhpcy5fdmlzTGlzdCA9IG5ldyBHcm91cGVkUm93VmlzTGlzdChcbiAgICAgICAgICAgIGdyb3VwS2V5Q29tcGFyYXRvcnMsXG4gICAgICAgICAgICByb3dWaXNpYmlsaXR5T2JqQXJyYXksXG4gICAgICAgICAgICBncm91cFBhdGhzQnlSb3dJZCxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgX2dldEdyb3VwTGV2ZWxzV2l0aERlbGV0ZWRGaWVsZHNGaWx0ZXJlZCgpOiBBcnJheTxHcm91cExldmVsT2JqPiB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9ncm91cExldmVscywgJ05vIGdyb3VwIGxldmVscycpO1xuXG4gICAgICAgIC8vIEZpbHRlciBvdXQgYW55IGdyb3VwIGxldmVscyB0aGF0IHJlbHkgb24gZGVsZXRlZCBmaWVsZHMuXG4gICAgICAgIC8vIE5PVEU6IHdlIGtlZXAgZGVsZXRlZCBmaWVsZHMgYXJvdW5kIChyYXRoZXIgdGhhbiBmaWx0ZXJpbmcgdGhlbSBvdXRcbiAgICAgICAgLy8gaW4gcmVhbHRpbWUpIGluIGNhc2UgYSBmaWVsZCBnZXRzIHVuZGVsZXRlZCwgaW4gd2hpY2ggY2FzZSB3ZSB3YW50IHRvXG4gICAgICAgIC8vIGtlZXAgdXNpbmcgaXQuXG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cExldmVscy5maWx0ZXIoZ3JvdXBMZXZlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBMZXZlbC5pc0NyZWF0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3RhYmxlLmdldEZpZWxkQnlJZChncm91cExldmVsLmNvbHVtbklkKTtcbiAgICAgICAgICAgIHJldHVybiAhIWZpZWxkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2dldEVycm9yTWVzc2FnZUZvckRlbGV0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHNvdXJjZU1vZGVsTmFtZSA9IHRoaXMuX3NvdXJjZU1vZGVsIGluc3RhbmNlb2YgVGFibGVNb2RlbCA/ICd0YWJsZScgOiAndmlldyc7XG4gICAgICAgIHJldHVybiBgUXVlcnlSZXN1bHQncyB1bmRlcmx5aW5nICR7c291cmNlTW9kZWxOYW1lfSBoYXMgYmVlbiBkZWxldGVkYDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlT3JWaWV3UXVlcnlSZXN1bHQ7XG4iXX0=