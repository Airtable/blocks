"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.url.to-json");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WatchableTableKeys = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _permission_levels = require("../types/permission_levels");

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _view = _interopRequireDefault(require("./view"));

var _field = _interopRequireDefault(require("./field"));

var _record = _interopRequireDefault(require("./record"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var hyperId = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id');

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls'); // This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.


var WatchableTableKeys = Object.freeze({
  name: 'name',
  views: 'views',
  fields: 'fields'
});
exports.WatchableTableKeys = WatchableTableKeys;

/**
 * Model class representing a table. Every {@link Base} has one or more tables.
 */
var Table =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(Table, _AbstractModel);
  (0, _createClass2.default)(Table, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableTableKeys, key);
    }
  }]);

  /**
   * @hideconstructor
   */
  function Table(baseData, parentBase, recordStore, tableId, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, Table);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Table).call(this, baseData, tableId));
    _this._parentBase = parentBase;
    _this._recordStore = recordStore;
    _this._viewModelsById = {}; // View instances are lazily created by getViewById.

    _this._fieldModelsById = {}; // Field instances are lazily created by getFieldById.

    _this._cachedFieldNamesById = null;
    _this._airtableInterface = airtableInterface;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }
  /**
   * @function id
   * @memberof Table
   * @instance
   * @returns {string} This table's ID.
   * @example
   * console.log(myTable.id);
   * // => 'tblxxxxxxxxxxxxxx'
   */

  /**
   * True if this table has been deleted.
   *
   * In general, it's best to avoid keeping a reference to a table past the
   * current event loop, since it may be deleted and trying to access any data
   * of a deleted table (other than its ID) will throw. But if you do keep a
   * reference, you can use `isDeleted` to check that it's safe to access the
   * table's data.
   *
   * @function isDeleted
   * @memberof Table
   * @instance
   * @returns {boolean} `true` if the table has been deleted, `false` otherwise.
   * @example
   * if (!myTable.isDeleted) {
   *     // Do things with myTable
   * }
   */

  /**
   * Get notified of changes to the table.
   *
   * Watchable keys are:
   * - `'name'`
   * - `'views'`
   * - `'fields'`
   *
   * Every call to `.watch` should have a matching call to `.unwatch`.
   *
   * @function watch
   * @memberof Table
   * @instance
   * @param {(WatchableTableKey|Array<WatchableTableKey>)} keys the keys to watch
   * @param {Function} callback a function to call when those keys change
   * @param {Object?} [context] an optional context for `this` in `callback`.
   * @returns {Array<WatchableTableKey>} the array of keys that were watched
   */

  /**
   * Unwatch keys watched with `.watch`.
   *
   * Should be called with the same arguments given to `.watch`.
   *
   * @function unwatch
   * @memberof Table
   * @instance
   * @param {(WatchableTableKey|Array<WatchableTableKey>)} keys the keys to unwatch
   * @param {Function} callback the function passed to `.watch` for these keys
   * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
   * @returns {Array<WatchableTableKey>} the array of keys that were unwatched
   */

  /**
   * @private
   */


  (0, _createClass2.default)(Table, [{
    key: "getFieldByIdIfExists",

    /**
     * @param fieldId The ID of the field.
     * @returns The field matching the given ID, or `null` if that field does not exist in this table.
     * @example
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldByIdIfExists(fieldId);
     * if (field !== null) {
     *     console.log(field.name);
     * } else {
     *     console.log('No field exists with that ID');
     * }
     */
    value: function getFieldByIdIfExists(fieldId) {
      if (!this._data.fieldsById[fieldId]) {
        return null;
      } else {
        if (!this._fieldModelsById[fieldId]) {
          this._fieldModelsById[fieldId] = new _field.default(this._baseData, this, fieldId);
        }

        return this._fieldModelsById[fieldId];
      }
    }
    /**
     * @param fieldId The ID of the field.
     * @returns The field matching the given ID. Throws if that field does not exist in this table. Use {@link getFieldByIdIfExists} instead if you are unsure whether a field exists with the given ID.
     * @example
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldById(fieldId);
     * console.log(field.name);
     * // => 'Name'
     */

  }, {
    key: "getFieldById",
    value: function getFieldById(fieldId) {
      var field = this.getFieldByIdIfExists(fieldId);

      if (!field) {
        throw new Error("No field with ID ".concat(fieldId, " in table ").concat(this.id));
      }

      return field;
    }
    /**
     * @param fieldName The name of the field you're looking for.
     * @returns The field matching the given name, or `null` if no field exists with that name in this table.
     * @example
     * const field = myTable.getFieldByNameIfExists('Name');
     * if (field !== null) {
     *     console.log(field.id);
     * } else {
     *     console.log('No field exists with that name');
     * }
     */

  }, {
    key: "getFieldByNameIfExists",
    value: function getFieldByNameIfExists(fieldName) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _private_utils.entries)(this._data.fieldsById)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
              fieldId = _step$value[0],
              fieldData = _step$value[1];

          if (fieldData.name === fieldName) {
            return this.getFieldByIdIfExists(fieldId);
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

      return null;
    }
    /**
     * @param fieldName The name of the field you're looking for.
     * @returns The field matching the given name. Throws if no field exists with that name in this table. Use {@link getFieldByNameIfExists} instead if you are unsure whether a field exists with the given name.
     * @example
     * const field = myTable.getFieldByName('Name');
     * console.log(field.id);
     * // => 'fldxxxxxxxxxxxxxx'
     */

  }, {
    key: "getFieldByName",
    value: function getFieldByName(fieldName) {
      var field = this.getFieldByNameIfExists(fieldName);

      if (!field) {
        throw new Error("No field named ".concat(fieldName, " in table ").concat(this.id));
      }

      return field;
    }
    /**
     * @function
     * @returns The views in this table. Can be watched to know when views are created,
     * deleted, or reordered.
     * @example
     * console.log(`This table has ${myTable.views.length} views`);
     */

  }, {
    key: "getViewByIdIfExists",

    /**
     * @param viewId The ID of the view.
     * @returns The view matching the given ID, or `null` if that view does not exist in this table.
     * @example
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewByIdIfExists(viewId);
     * if (view !== null) {
     *     console.log(view.name);
     * } else {
     *     console.log('No view exists with that ID');
     * }
     */
    value: function getViewByIdIfExists(viewId) {
      if (!this._data.viewsById[viewId]) {
        return null;
      } else {
        if (!this._viewModelsById[viewId]) {
          this._viewModelsById[viewId] = new _view.default(this._baseData, this, this._recordStore.getViewDataStore(viewId), viewId);
        }

        return this._viewModelsById[viewId];
      }
    }
    /**
     * @param viewId The ID of the view.
     * @returns The view matching the given ID. Throws if that view does not exist in this table. Use {@link getViewByIdIfExists} instead if you are unsure whether a view exists with the given ID.
     * @example
     * const viewId = 'viwxxxxxxxxxxxxxx';
     * const view = myTable.getViewById(viewId);
     * console.log(view.name);
     * // => 'Grid view'
     */

  }, {
    key: "getViewById",
    value: function getViewById(viewId) {
      var view = this.getViewByIdIfExists(viewId);

      if (!view) {
        throw new Error("No view with ID ".concat(viewId, " in table ").concat(this.id));
      }

      return view;
    }
    /**
     * @param viewName The name of the view you're looking for.
     * @returns The view matching the given name, or `null` if no view exists with that name in this table.
     * @example
     * const view = myTable.getViewByNameIfExists('Name');
     * if (view !== null) {
     *     console.log(view.id);
     * } else {
     *     console.log('No view exists with that name');
     * }
     */

  }, {
    key: "getViewByNameIfExists",
    value: function getViewByNameIfExists(viewName) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _private_utils.entries)(this._data.viewsById)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
              viewId = _step2$value[0],
              viewData = _step2$value[1];

          if (viewData.name === viewName) {
            return this.getViewByIdIfExists(viewId);
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
     * @param viewName The name of the view you're looking for.
     * @returns The view matching the given name. Throws if no view exists with that name in this table. Use {@link getViewByNameIfExists} instead if you are unsure whether a view exists with the given name.
     * @example
     * const view = myTable.getViewByName('Name');
     * console.log(view.id);
     * // => 'viwxxxxxxxxxxxxxx'
     */

  }, {
    key: "getViewByName",
    value: function getViewByName(viewName) {
      var view = this.getViewByNameIfExists(viewName);

      if (!view) {
        throw new Error("No view named ".concat(viewName, " in table ").concat(this.id));
      }

      return view;
    }
    /**
     * Select records from the table. Returns a query result. See {@link QueryResult} for more.
     *
     * @param [opts={}] Options for the query, such as sorts and fields.
     * @returns A query result.
     * @example
     * import {UI} from '@airtable/blocks';
     * import React from 'react';
     *
     * function TodoList() {
     *     const base = UI.useBase();
     *     const table = base.getTableByName('Tasks');
     *
     *     const queryResult = table.selectRecords();
     *     const records = UI.useRecords(queryResult);
     *
     *     return (
     *         <ul>
     *             {records.map(record => (
     *                 <li key={record.id}>
     *                     {record.primaryCellValueAsString || 'Unnamed record'}
     *                 </li>
     *             ))}
     *         </ul>
     *     );
     * }
     */

  }, {
    key: "selectRecords",
    value: function selectRecords(opts) {
      return _table_or_view_query_result.default.__createOrReuseQueryResult(this, this._recordStore, opts || {});
    }
    /**
     * @function
     * @private (not documenting, since this should really be part of the canCreateRecords check)
     * @returns The maximum number of records that the table can contain.
     */

  }, {
    key: "canSetCellValues",

    /**
     * Use this to check whether the current user can update a set of cell values. Should be
     * called before calling {@link setCellValues}.
     *
     * @param {object.<RecordId, object.<(FieldId|string), CellValue>>} cellValuesByRecordIdThenFieldIdOrFieldName The cell values to set.
     * @returns `true` if the current user can set the given cell values, `false` otherwise.
     * @example
     * const cellValuesByRecordIdThenFieldId = {
     *     [record1.id]: {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     [record2.id]: {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * };
     * if (myTable.canSetCellValues(cellValuesByRecordIdThenFieldId)) {
     *     myTable.setCellValues(cellValuesByRecordIdThenFieldId);
     * }
     */
    value: function canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName) {
      // This takes the field and record IDs to future-proof against granular permissions.
      // For now, just need at least edit permissions.
      var _getSdk = (0, _get_sdk.default)(),
          base = _getSdk.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Sets cell values.
     *
     * Throws if the current user cannot update all of the given cell values. Call
     * {@link canSetCellValues} before calling this to check whether the current user
     * can perform the given updates.
     *
     * @param {object.<RecordId, object.<(FieldId|string), CellValue>>} cellValuesByRecordIdThenFieldIdOrFieldName The cell values to set.
     * @returns {{}}
     * @example
     * const cellValuesByRecordIdThenFieldId = {
     *     [record1.id]: {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     [record2.id]: {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * };
     * if (myTable.canSetCellValues(cellValuesByRecordIdThenFieldId)) {
     *     myTable.setCellValues(cellValuesByRecordIdThenFieldId);
     * }
     */

  }, {
    key: "setCellValues",
    value: function setCellValues(cellValuesByRecordIdThenFieldIdOrFieldName) {
      if (this.isDeleted) {
        throw new Error('Table does not exist');
      }

      if (!this.canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName)) {
        throw new Error('Your permission level does not allow editing cell values');
      }

      var changes = [];
      var cellValuesByRecordIdThenFieldId = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _private_utils.entries)(cellValuesByRecordIdThenFieldIdOrFieldName)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
              recordId = _step3$value[0],
              cellValuesByFieldIdOrFieldName = _step3$value[1];

          var record = this._recordStore.getRecordByIdIfExists(recordId);

          if (!record) {
            throw new Error('Record does not exist');
          }

          cellValuesByRecordIdThenFieldId[recordId] = {};
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = (0, _private_utils.entries)(cellValuesByFieldIdOrFieldName)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _step4$value = (0, _slicedToArray2.default)(_step4.value, 2),
                  fieldIdOrFieldName = _step4$value[0],
                  publicCellValue = _step4$value[1];

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

      (0, _get_sdk.default)().__applyModelChanges(changes); // Now send the update to Airtable.


      var completionPromise = this._airtableInterface.setCellValuesAsync(this.id, cellValuesByRecordIdThenFieldId);

      return {
        completion: completionPromise
      };
    }
    /**
     * Use this to check whether the current user can create a record. Should be
     * called before calling {@link createRecord}.
     *
     * @param {(object.<(FieldId|string), CellValue>)?} cellValuesByFieldIdOrFieldName The record to create. If nothing is supplied, this will check whether the current user can create a single, empty record.
     * @returns `true` if the current user can create the given record, `false` otherwise.
     * @example
     * const recordDef = {
     *     [mySingleLineTextField.id]: 'new cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myTable.canCreateRecord(recordDef)) {
     *     const {record} = myTable.createRecord(recordDef);
     *     console.log(record.id);
     * }
     *
     * @example
     * if (myTable.canCreateRecord()) {
     *     const {record} = myTable.createRecord();
     *     console.log(record.id);
     * }
     */

  }, {
    key: "canCreateRecord",
    value: function canCreateRecord(cellValuesByFieldIdOrFieldName) {
      return this.canCreateRecords(cellValuesByFieldIdOrFieldName ? [cellValuesByFieldIdOrFieldName] : 1);
    }
    /**
     * Creates a record in the table.
     *
     * Throws if the current user cannot create the given record. Call {@link canCreateRecord}
     * before calling this to check whether the current user can create the given record.
     *
     * @param {(object.<(FieldId|string), CellValue>)?} cellValuesByFieldIdOrFieldName The record to create. If nothing is supplied, this will create a single, empty record.
     * @returns {{record: Record}} An object with the optimistically-created record.
     * @example
     * const recordDef = {
     *     [mySingleLineTextField.id]: 'new cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myTable.canCreateRecord(recordDef)) {
     *     const {record} = myTable.createRecord(recordDef);
     *     console.log(record.id);
     * }
     *
     * @example
     * if (myTable.canCreateRecord()) {
     *     const {record} = myTable.createRecord();
     *     console.log(record.id);
     * }
     */

  }, {
    key: "createRecord",
    value: function createRecord(cellValuesByFieldIdOrFieldName) {
      var recordDef = cellValuesByFieldIdOrFieldName || {};
      var writeAction = this.createRecords([recordDef]);
      var records = writeAction.records;
      return {
        completion: writeAction.completion,
        record: records[0]
      };
    }
    /**
     * Use this to check whether the current user can create records. Should be
     * called before calling {@link createRecords}.
     *
     * @param {(Array<object.<(FieldId|string), CellValue>>|number)} recordDefsOrNumberOfRecords The records to create, or a number of empty records to create.
     * @returns `true` if the current user can create the given records, `false` otherwise.
     * @example
     * const recordDefs = [
     *     {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * ];
     * if (myTable.canCreateRecords(recordDefs)) {
     *     const {records} = myTable.createRecords(recordDefs);
     *     console.log(`Created ${records.length} records`);
     * }
     *
     * @example
     * const numRecordsToCreate = 10;
     * if (myTable.canCreateRecords(numRecordsToCreate)) {
     *     const {records} = myTable.createRecords(numRecordsToCreate);
     *     console.log(`Created ${records.length} records`);
     * }
     */

  }, {
    key: "canCreateRecords",
    value: function canCreateRecords(recordDefsOrNumberOfRecords) {
      // This takes the field IDs to future-proof against granular permissions.
      // For now, just need at least edit permissions.
      var _getSdk2 = (0, _get_sdk.default)(),
          base = _getSdk2.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Creates records in the table.
     *
     * Throws if the current user cannot create the given records. Call {@link canCreateRecords}
     * before calling this to check whether the current user can create the given records.
     *
     * @param {(Array<object.<(FieldId|string), CellValue>>|number)} recordDefsOrNumberOfRecords The records to create, or a number of empty records to create.
     * @returns {{records: Array<Record>}} An object with the optimistically-created records.
     * @example
     * const recordDefs = [
     *     {
     *         [mySingleLineTextField.id]: 'new cell value',
     *     },
     *     {
     *         [mySingleLineTextField.id]: 'another cell value',
     *         [myNumberField.id]: 42,
     *     },
     * ];
     * if (myTable.canCreateRecords(recordDefs)) {
     *     const {records} = myTable.createRecords(recordDefs);
     *     console.log(`Created ${records.length} records`);
     * }
     *
     * @example
     * const numRecordsToCreate = 10;
     * if (myTable.canCreateRecords(numRecordsToCreate)) {
     *     const {records} = myTable.createRecords(numRecordsToCreate);
     *     console.log(`Created ${records.length} records`);
     * }
     */

  }, {
    key: "createRecords",
    value: function createRecords(recordDefsOrNumberOfRecords) {
      if (!this.canCreateRecords(recordDefsOrNumberOfRecords)) {
        throw new Error('Your permission level does not allow creating records');
      } // TODO: support creating records when only a record metadata or a
      // subset of fields are loaded.


      if (!this._recordStore.isDataLoaded) {
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

      if (this.recordLimit - this._recordStore.recordIds.length < recordDefs.length) {
        throw new Error('Table over record limit. Check remainingRecordLimit before creating records.');
      }

      var parsedRecordDefs = [];
      var recordIds = [];
      var changes = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = recordDefs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var recordDef = _step5.value;
          var cellValuesByFieldId = {};
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = (0, _private_utils.entries)(recordDef)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _step7$value = (0, _slicedToArray2.default)(_step7.value, 2),
                  fieldIdOrFieldName = _step7$value[0],
                  cellValue = _step7$value[1];

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

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.views[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var view = _step6.value;

          var viewDataStore = this._recordStore.getViewDataStore(view.id);

          if (viewDataStore.isDataLoaded) {
            changes.push(...viewDataStore.__generateChangesForParentTableAddMultipleRecords(recordIds));
          }
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

      (0, _get_sdk.default)().__applyModelChanges(changes);

      var completionPromise = this._airtableInterface.createRecordsAsync(this.id, parsedRecordDefs);

      var recordModels = recordIds.map(recordId => {
        var recordModel = this._recordStore.getRecordByIdIfExists(recordId);

        (0, _invariant.default)(recordModel, 'Newly created record does not exist');
        return recordModel;
      });
      return {
        completion: completionPromise,
        records: recordModels
      };
    }
    /**
     * Use this to check whether the current user can delete a record. Should be
     * called before calling {@link deleteRecord}.
     *
     * @param record The record to delete.
     * @returns `true` if the current user can delete the given record, `false` otherwise.
     * @example
     * if (myTable.canDeleteRecord(myRecord)) {
     *     myTable.deleteRecord(myRecord);
     * }
     */

  }, {
    key: "canDeleteRecord",
    value: function canDeleteRecord(record) {
      return this.canDeleteRecords([record]);
    }
    /**
     * Deletes a record.
     *
     * Throws if the current user cannot delete the given record. Call {@link canDeleteRecord}
     * before calling this to check whether the current user can delete the given record.
     *
     * @param record The record to delete.
     * @returns {{}}
     * @example
     * if (myTable.canDeleteRecord(myRecord)) {
     *     myTable.deleteRecord(myRecord);
     * }
     */

  }, {
    key: "deleteRecord",
    value: function deleteRecord(record) {
      return this.deleteRecords([record]);
    }
    /**
     * Use this to check whether the current user can delete records. Should be
     * called before calling {@link deleteRecords}.
     *
     * @param records The records to delete.
     * @returns `true` if the current user can delete the given records, `false` otherwise.
     * @example
     * const recordsToDelete = [myRecord1, myRecord2];
     * if (myTable.canDeleteRecords(recordsToDelete)) {
     *     myTable.deleteRecords(recordsToDelete);
     * }
     */

  }, {
    key: "canDeleteRecords",
    value: function canDeleteRecords(records) {
      // This takes the records to future-proof against granular permissions.
      // For now, just need at least edit permissions.
      var _getSdk3 = (0, _get_sdk.default)(),
          base = _getSdk3.base;

      return permissionHelpers.can(base.__rawPermissionLevel, _permission_levels.PermissionLevels.EDIT);
    }
    /**
     * Deletes records.
     *
     * Throws if the current user cannot delete the given records. Call {@link canDeleteRecords}
     * before calling this to check whether the current user can delete the given records.
     *
     * @param records The records to delete.
     * @returns {{}}
     * @example
     * const recordsToDelete = [myRecord1, myRecord2];
     * if (myTable.canDeleteRecords(recordsToDelete)) {
     *     myTable.deleteRecords(recordsToDelete);
     * }
     */

  }, {
    key: "deleteRecords",
    value: function deleteRecords(records) {
      if (!this.canDeleteRecords(records)) {
        throw new Error('Your permission level does not allow deleting records');
      } // TODO: support deleting records when only a record metadata or a
      // subset of fields are loaded.


      if (!this._recordStore.isDataLoaded) {
        throw new Error('Table data is not loaded');
      }

      var recordIds = records.map(record => record.id);
      var changes = recordIds.map(recordId => {
        return {
          path: ['tablesById', this.id, 'recordsById', recordId],
          value: undefined
        };
      });
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.views[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var view = _step8.value;

          var viewDataStore = this._recordStore.getViewDataStore(view.id);

          if (viewDataStore.isDataLoaded) {
            changes.push(...viewDataStore.__generateChangesForParentTableDeleteMultipleRecords(recordIds));
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

      (0, _get_sdk.default)().__applyModelChanges(changes);

      var completionPromise = this._airtableInterface.deleteRecordsAsync(this.id, recordIds);

      return {
        completion: completionPromise
      };
    }
    /**
     * Returns the first view in the table where the type is one of `allowedViewTypes`.
     *
     * @param allowedViewTypes An array of view types or a single view type to match against.
     * @param preferredViewOrViewId If a view or view ID is supplied and that view exists & has the correct type, that view
     * will be returned before checking the other views in the table.
     * @returns The first view where the type is one of `allowedViewTypes` or `null` if no such view exists in the table.
     * @example
     * import {viewTypes} from '@airtable/blocks/models';
     * const firstCalendarView = myTable.getFirstViewOfType(viewTypes.CALENDAR);
     * if (firstCalendarView !== null) {
     *     console.log(firstCalendarView.name);
     * } else {
     *     console.log('No calendar views exist in the table');
     * }
     */

  }, {
    key: "getFirstViewOfType",
    value: function getFirstViewOfType(allowedViewTypes, preferredViewOrViewId) {
      if (!Array.isArray(allowedViewTypes)) {
        allowedViewTypes = [allowedViewTypes];
      }

      if (preferredViewOrViewId) {
        var preferredView = this.getViewByIdIfExists(typeof preferredViewOrViewId === 'string' ? preferredViewOrViewId : preferredViewOrViewId.id);

        if (preferredView && allowedViewTypes.includes(preferredView.type)) {
          return preferredView;
        }
      }

      return this.views.find(view => {
        return allowedViewTypes.includes(view.type);
      }) || null;
    } // Experimental, do not document yet. Allows fetching default cell values for
    // a table or view. Before documenting, we should explore making this synchronous.

    /**
     * @private
     */

  }, {
    key: "getDefaultCellValuesByFieldIdAsync",
    value: function () {
      var _getDefaultCellValuesByFieldIdAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(opts) {
        var viewId, cellValuesByFieldId;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                viewId = opts && opts.view ? opts.view.id : null;
                _context.next = 3;
                return this._airtableInterface.fetchDefaultCellValuesByFieldIdAsync(this._id, viewId);

              case 3:
                cellValuesByFieldId = _context.sent;
                return _context.abrupt("return", cellValuesByFieldId);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getDefaultCellValuesByFieldIdAsync(_x) {
        return _getDefaultCellValuesByFieldIdAsync.apply(this, arguments);
      }

      return getDefaultCellValuesByFieldIdAsync;
    }()
    /**
     * @private
     */

  }, {
    key: "__getFieldMatching",
    value: function __getFieldMatching(fieldOrFieldIdOrFieldName) {
      var field;

      if (fieldOrFieldIdOrFieldName instanceof _field.default) {
        field = fieldOrFieldIdOrFieldName;
      } else {
        field = this.getFieldByIdIfExists(fieldOrFieldIdOrFieldName) || this.getFieldByNameIfExists(fieldOrFieldIdOrFieldName);
      }

      return field;
    }
    /**
     * @private
     */

  }, {
    key: "__getViewMatching",
    value: function __getViewMatching(viewOrViewIdOrViewName) {
      var view;

      if (viewOrViewIdOrViewName instanceof _view.default) {
        view = viewOrViewIdOrViewName;
      } else {
        view = this.getViewByIdIfExists(viewOrViewIdOrViewName) || this.getViewByNameIfExists(viewOrViewIdOrViewName);
      }

      return view;
    }
    /**
     * @private
     */

  }, {
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      var didTableSchemaChange = false;

      this._recordStore.triggerOnChangeForDirtyPaths(dirtyPaths);

      if (dirtyPaths.name) {
        this._onChange(WatchableTableKeys.name);

        didTableSchemaChange = true;
      }

      if (dirtyPaths.viewOrder) {
        this._onChange(WatchableTableKeys.views);

        didTableSchemaChange = true; // Clean up deleted views

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = (0, _private_utils.entries)(this._viewModelsById)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _step9$value = (0, _slicedToArray2.default)(_step9.value, 2),
                viewId = _step9$value[0],
                viewModel = _step9$value[1];

            if (viewModel.isDeleted) {
              delete this._viewModelsById[viewId];
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
      }

      if (dirtyPaths.viewsById) {
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = (0, _private_utils.entries)(dirtyPaths.viewsById)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var _step10$value = (0, _slicedToArray2.default)(_step10.value, 2),
                viewId = _step10$value[0],
                dirtyViewPaths = _step10$value[1];

            // Directly access from _viewModelsById to avoid creating
            // a view model if it doesn't already exist. If it doesn't exist,
            // nothing can be subscribed to any events on it.
            var view = this._viewModelsById[viewId];

            if (view) {
              var didViewSchemaChange = view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);

              if (didViewSchemaChange) {
                didTableSchemaChange = true;
              }
            }
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
      }

      if (dirtyPaths.fieldsById) {
        // TODO: don't trigger schema change when autonumber typeOptions change.
        // That currently happens every time you create a row in a table with an
        // autonumber field.
        didTableSchemaChange = true; // Since tables don't have a field order, need to detect if a field
        // was created or deleted and trigger onChange for fields.

        var addedFieldIds = [];
        var removedFieldIds = [];
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = (0, _private_utils.entries)(dirtyPaths.fieldsById)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var _step11$value = (0, _slicedToArray2.default)(_step11.value, 2),
                fieldId = _step11$value[0],
                dirtyFieldPaths = _step11$value[1];

            if (dirtyFieldPaths._isDirty) {
              // If the entire field is dirty, it was either created or deleted.
              if ((0, _private_utils.has)(this._data.fieldsById, fieldId)) {
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

        if (addedFieldIds.length > 0 || removedFieldIds.length > 0) {
          this._onChange(WatchableTableKeys.fields, {
            addedFieldIds,
            removedFieldIds
          });
        } // Clear out cached field names in case a field was added/removed/renamed.


        this._cachedFieldNamesById = null;
      }

      return didTableSchemaChange;
    }
    /**
     * @private
     */

  }, {
    key: "__getFieldNamesById",
    value: function __getFieldNamesById() {
      if (!this._cachedFieldNamesById) {
        var fieldNamesById = {};
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
          for (var _iterator12 = (0, _private_utils.entries)(this._data.fieldsById)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var _step12$value = (0, _slicedToArray2.default)(_step12.value, 2),
                fieldId = _step12$value[0],
                fieldData = _step12$value[1];

            fieldNamesById[fieldId] = fieldData.name;
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

        this._cachedFieldNamesById = fieldNamesById;
      }

      return this._cachedFieldNamesById;
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      return this._baseData.tablesById[this._id] || null;
    }
    /**
     * @function
     * @returns The base that this table belongs to.
     *
     * @example
     * import {base} from '@airtable/blocks';
     * const table = base.getTableByName('Table 1');
     * console.log(table.parentBase.id === base.id);
     * // => true
     */

  }, {
    key: "parentBase",
    get: function get() {
      return this._parentBase;
    }
    /**
     * @function
     * @returns The name of the table. Can be watched.
     * @example
     * console.log(myTable.name);
     * // => 'Table 1'
     */

  }, {
    key: "name",
    get: function get() {
      return this._data.name;
    }
    /**
     * @function
     * @returns The URL for the table. You can visit this URL in the browser to be taken to the table in the Airtable UI.
     * @example
     * console.log(myTable.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx'
     */

  }, {
    key: "url",
    get: function get() {
      return airtableUrls.getUrlForTable(this.id, {
        absolute: true
      });
    }
    /**
     * @function
     * @returns The table's primary field. Every table has exactly one primary
     * field. The primary field of a table will not change.
     * @example
     * console.log(myTable.primaryField.name);
     * // => 'Name'
     */

  }, {
    key: "primaryField",
    get: function get() {
      var primaryField = this.getFieldById(this._data.primaryFieldId);
      return primaryField;
    }
    /**
     * @function
     * @returns The fields in this table. The order is arbitrary, since fields are
     * only ordered in the context of a specific view.
     *
     * Can be watched to know when fields are created or deleted.
     * @example
     * console.log(`This table has ${myTable.fields.length} fields`);
     */

  }, {
    key: "fields",
    get: function get() {
      // TODO(kasra): is it confusing that this returns an array, since the order
      // is arbitrary?
      // TODO(kasra): cache and freeze this so it isn't O(n)
      var fields = [];

      for (var _i = 0, _Object$keys = Object.keys(this._data.fieldsById); _i < _Object$keys.length; _i++) {
        var fieldId = _Object$keys[_i];
        var field = this.getFieldById(fieldId);
        fields.push(field);
      }

      return fields;
    }
  }, {
    key: "views",
    get: function get() {
      // TODO(kasra): cache and freeze this so it isn't O(n)
      var views = [];

      this._data.viewOrder.forEach(viewId => {
        var view = this.getViewById(viewId);
        views.push(view);
      });

      return views;
    }
  }, {
    key: "recordLimit",
    get: function get() {
      return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
    }
  }]);
  return Table;
}(_abstract_model.default);

(0, _defineProperty2.default)(Table, "_className", 'Table');
var _default = Table;
exports.default = _default;