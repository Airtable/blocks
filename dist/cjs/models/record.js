"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _private_utils = require("../private_utils");

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _field2 = _interopRequireDefault(require("./field"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _linked_records_query_result = _interopRequireDefault(require("./linked_records_query_result"));

var _record_store = _interopRequireDefault(require("./record_store"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls');

var clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

var ATTACHMENTS_V3_CDN_BASE_URL = clientServerSharedConfigSettings.ATTACHMENTS_V3_CDN_BASE_URL;
var WatchableRecordKeys = Object.freeze({
  primaryCellValue: 'primaryCellValue',
  commentCount: 'commentCount',
  // TODO(kasra): these keys don't have matching getters (not that they should
  // it's just inconsistent...)
  cellValues: 'cellValues'
}); // TODO: load cell values in field when this is watched? This will
// cause the CellRenderer component to load cell values, which seems okay,
// but needs a little more thought.

var WatchableCellValueInFieldKeyPrefix = 'cellValueInField:'; // TODO: load view data when this is watched. see previous comment.

var WatchableColorInViewKeyPrefix = 'colorInView:'; // The string case is to accommodate cellValueInField:$FieldId.

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. To create a new record, use `table.createRecord`.
 */
var Record =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(Record, _AbstractModel);
  (0, _createClass2.default)(Record, null, [{
    key: "_isWatchableKey",
    // Once all blocks set this flag to true, remove this flag.
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableRecordKeys, key) || key.startsWith(WatchableCellValueInFieldKeyPrefix) || key.startsWith(WatchableColorInViewKeyPrefix);
    }
  }]);

  /**
   * @hideconstructor
   */
  function Record(baseData, parentRecordStore, parentTable, recordId) {
    var _this;

    (0, _classCallCheck2.default)(this, Record);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Record).call(this, baseData, recordId));
    _this._parentRecordStore = parentRecordStore;
    _this._parentTable = parentTable;
    return _this;
  }
  /**
   * @function id
   * @memberof Record
   * @instance
   * @returns {string} This record's ID.
   * @example
   * console.log(myRecord.id);
   * // => 'recxxxxxxxxxxxxxx'
   */

  /**
   * True if this record has been deleted.
   *
   * In general, it's best to avoid keeping a reference to a record past the
   * current event loop, since it may be deleted and trying to access any data
   * of a deleted record (other than its ID) will throw. But if you do keep a
   * reference, you can use `isDeleted` to check that it's safe to access the
   * record's data.
   *
   * @function isDeleted
   * @memberof Record
   * @instance
   * @returns {boolean} `true` if the record has been deleted, `false` otherwise.
   * @example
   * if (!myRecord.isDeleted) {
   *     // Do things with myRecord
   * }
   */

  /**
   * @private
   */


  (0, _createClass2.default)(Record, [{
    key: "__getRawCellValue",

    /**
     * @private
     */
    value: function __getRawCellValue(fieldId) {
      var publicCellValue = this.getCellValue(fieldId);
      var field = this.parentTable.getFieldById(fieldId);
      return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
    }
    /**
     * @private
     */

  }, {
    key: "__getRawRow",
    value: function __getRawRow() {
      var cellValuesByColumnId;
      var cellValuesByFieldId = this._data.cellValuesByFieldId;

      if (cellValuesByFieldId) {
        cellValuesByColumnId = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _private_utils.entries)(cellValuesByFieldId)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
                fieldId = _step$value[0],
                publicCellValue = _step$value[1];

            // When fields are deleted, we set the previously loaded cell value to
            // undefined (vs deleting the key from the cellValuesByFieldId object, which
            // would cause de-opts). So ignore undefined cell values, since the field is deleted.
            if (publicCellValue !== undefined) {
              var field = this.parentTable.getFieldById(fieldId);
              cellValuesByColumnId[fieldId] = _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
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
      }

      return {
        id: this.id,
        createdTime: this._data.createdTime,
        cellValuesByColumnId
      };
    }
    /**
     * @private
     */

  }, {
    key: "_getFieldMatching",
    value: function _getFieldMatching(fieldOrFieldIdOrFieldName) {
      return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
    /**
     * @private
     */

  }, {
    key: "_getViewMatching",
    value: function _getViewMatching(viewOrViewIdOrViewName) {
      return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
    }
    /**
     * Gets a specific cell value in this record.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @returns The cell value in the given field.
     * @example
     * const cellValue = myRecord.getCellValue(mySingleLineTextField);
     * console.log(cellValue);
     * // => 'cell value'
     */

  }, {
    key: "getCellValue",
    value: function getCellValue(fieldOrFieldIdOrFieldName) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      (0, _invariant.default)(field.parentTable.id === this.parentTable.id, 'Field must have same parent table as record');
      (0, _invariant.default)(this._parentRecordStore.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');
      var cellValuesByFieldId = this._data.cellValuesByFieldId;

      if (!cellValuesByFieldId) {
        return null;
      }

      var cellValue = cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

      if (typeof cellValue === 'object' && cellValue !== null) {
        // HACK: while we migrate our blocks to the new lookup cell value
        // format, make the public cell value look like an array for
        // backwards compatibility.
        if (!Record.shouldUseNewLookupFormat && field.type === _field.FieldTypes.LOOKUP) {
          var cellValueForMigration = []; // $FlowFixMe

          cellValueForMigration.linkedRecordIds = (0, _private_utils.cloneDeep)(cellValue.linkedRecordIds); // $FlowFixMe

          cellValueForMigration.valuesByLinkedRecordId = (0, _private_utils.cloneDeep)(cellValue.valuesByLinkedRecordId);
          (0, _invariant.default)(Array.isArray(cellValue.linkedRecordIds), 'linkedRecordIds');
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = cellValue.linkedRecordIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var linkedRecordId = _step2.value;
              (0, _invariant.default)(typeof linkedRecordId === 'string', 'linkedRecordId');
              var valuesByLinkedRecordId = cellValue.valuesByLinkedRecordId;
              (0, _invariant.default)(valuesByLinkedRecordId && typeof valuesByLinkedRecordId === 'object', 'valuesByLinkedRecordId');
              var value = valuesByLinkedRecordId[linkedRecordId];

              if (Array.isArray(value)) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = value[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var v = _step3.value;
                    cellValueForMigration.push(v);
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
              } else {
                cellValueForMigration.push(value);
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

          return cellValueForMigration;
        } // Copy non-primitives.
        // TODO(kasra): maybe freezeDeep instead?


        return (0, _private_utils.cloneDeep)(cellValue);
      } else {
        return cellValue;
      }
    }
    /**
     * Gets a specific cell value in this record, formatted as a `string`.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @returns The cell value in the given field, formatted as a `string`.
     * @example
     * const cellValueAsString = myRecord.getCellValueAsString(myNumberField);
     * console.log(cellValueAsString);
     * // => '42'
     */

  }, {
    key: "getCellValueAsString",
    value: function getCellValueAsString(fieldOrFieldIdOrFieldName) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      (0, _invariant.default)(this._parentRecordStore.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');

      var rawCellValue = this.__getRawCellValue(field.id);

      if (rawCellValue === null || rawCellValue === undefined) {
        return '';
      } else {
        return columnTypeProvider.convertCellValueToString(rawCellValue, field.__getRawType(), field.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface);
      }
    }
    /**
     * Returns a URL that is suitable for rendering an attachment on the current client.
     * The URL that is returned will only work for the current user.
     *
     * @param attachmentId The ID of the attachment.
     * @param attachmentUrl The attachment's URL (which is not suitable for rendering on the client).
     * @returns A URL that is suitable for rendering on the current client.
     * @example
     * import React from 'react';
     *
     * function RecordAttachments(props) {
     *     const {record, attachmentField} = props;
     *     const attachmentCellValue = record.getCellValue(attachmentField);
     *     if (attachmentCellValue === null) {
     *         return null;
     *     }
     *     return (
     *         <div>
     *             {attachmentCellValue.map(attachmentObj => {
     *                 const clientUrl = record.getAttachmentClientUrlFromCellValueUrl(attachmentObj.id, attachmentObj.url);
     *                 return (
     *                     <img key={attachmentObj.id} src={clientUrl} width={200} />
     *                 );
     *             })}
     *         </div>
     *     );
     * }
     */

  }, {
    key: "getAttachmentClientUrlFromCellValueUrl",
    value: function getAttachmentClientUrlFromCellValueUrl(attachmentId, attachmentUrl) {
      var appInterface = this.parentTable.parentBase.__appInterface;
      var isAttachmentsCdnV3Enabled = appInterface.isFeatureEnabled('attachmentsCdnV3');

      if (isAttachmentsCdnV3Enabled) {
        var applicationId = appInterface.getApplicationId();
        var userId = appInterface.getCurrentSessionUserId(); // NOTE: normal images must be active in the base. We don't support rendering historical values here. see attachment_object_methods.js for more

        var imagePathPrefix = 'attV3/';
        attachmentUrl = attachmentUrl.replace(/^https:\/\/([^/]+)\//, "".concat(ATTACHMENTS_V3_CDN_BASE_URL, "/").concat(imagePathPrefix).concat(userId, "/").concat(applicationId, "/").concat(attachmentId, "/"));
      }

      return attachmentUrl;
    }
    /**
     * Gets the color of this record in a given view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     * @returns The color of this record in the given view, or null if the record has no color in that view.
     */

  }, {
    key: "getColorInView",
    value: function getColorInView(viewOrViewIdOrViewName) {
      var view = this._getViewMatching(viewOrViewIdOrViewName);

      (0, _invariant.default)(view, 'View does not exist');
      (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
      return this._parentRecordStore.getViewDataStore(view.id).getRecordColor(this);
    }
    /**
     * Gets the CSS hex string for this record in a given view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     * @returns The CSS hex color for this record in the given view, or null if the record has no color in that view.
     */

  }, {
    key: "getColorHexInView",
    value: function getColorHexInView(viewOrViewIdOrViewName) {
      var color = this.getColorInView(viewOrViewIdOrViewName);

      if (!color) {
        return null;
      }

      return _color_utils.default.getHexForColor(color);
    }
    /**
     * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result.
     * See {@link QueryResult} for more.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param [opts={}] Options for the query, such as sorts and fields.
     * @returns A query result containing the records in the given `multipleRecordLinks` field.
     */

  }, {
    key: "selectLinkedRecordsFromCell",
    value: function selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return _linked_records_query_result.default.__createOrReuseQueryResult(this, field, opts);
    }
    /**
     * @function
     * @returns The URL for the record. You can visit this URL in the browser to be taken to the record in the Airtable UI.
     * @example
     * console.log(myRecord.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx/recxxxxxxxxxxxxxx'
     */

  }, {
    key: "canSetCellValue",

    /**
     * Use this to check whether the current user can update a specific cell value.
     * Should be called before calling {@link setCellValue}.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) to use.
     * @param cellValue The cell value to set.
     * @returns `true` if the current user can set the given cell value, `false` otherwise.
     * @example
     * const newCellValue = 'new cell value';
     * if (myRecord.canSetCellValue(mySingleLineTextField, newCellValue)) {
     *     myRecord.setCellValue(mySingleLineTextField, newCellValue);
     * }
     */
    value: function canSetCellValue(fieldOrFieldIdOrFieldName, cellValue) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return this.canSetCellValues({
        [field.id]: cellValue
      });
    }
    /**
     * Sets a cell value.
     *
     * Throws if the current user cannot update this cell value. Call {@link canSetCellValue}
     * before calling this to check if the current user can update this cell value.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) to use.
     * @param cellValue The cell value to set.
     * @returns {{}}
     * @example
     * const newCellValue = 'new cell value';
     * if (myRecord.canSetCellValue(mySingleLineTextField, newCellValue)) {
     *     myRecord.setCellValue(mySingleLineTextField, newCellValue);
     * }
     */

  }, {
    key: "setCellValue",
    value: function setCellValue(fieldOrFieldIdOrFieldName, cellValue) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return this.setCellValues({
        [field.id]: cellValue
      });
    }
    /**
     * Use this to check whether the current user can update a set of cell values. Should be
     * called before calling {@link setCellValues}.
     *
     * @param {object.<(FieldId|string), CellValue>} cellValuesByFieldIdOrFieldName The cell values to set.
     * @returns `true` if the current user can set the given cell values, `false` otherwise.
     * @example
     * const cellValuesByFieldId = {
     *     [mySingleLineTextField.id]: 'another cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myRecord.canSetCellValues(cellValuesByFieldId)) {
     *     myRecord.setCellValues(cellValuesByFieldId);
     * }
     */

  }, {
    key: "canSetCellValues",
    value: function canSetCellValues(cellValuesByFieldIdOrFieldName) {
      return this.parentTable.canSetCellValues({
        [this.id]: cellValuesByFieldIdOrFieldName
      });
    }
    /**
     * Sets cell values.
     *
     * Throws if the current user cannot update all of the given cell values. Call
     * {@link canSetCellValues} before calling this to check whether the current user
     * can perform the given updates.
     *
     * @param {object.<(FieldId|string), CellValue>} cellValuesByFieldIdOrFieldName The cell values to set.
     * @returns {{}}
     * @example
     * const cellValuesByFieldId = {
     *     [mySingleLineTextField.id]: 'another cell value',
     *     [myNumberField.id]: 42,
     * };
     * if (myRecord.canSetCellValues(cellValuesByFieldId)) {
     *     myRecord.setCellValues(cellValuesByFieldId);
     * }
     */

  }, {
    key: "setCellValues",
    value: function setCellValues(cellValuesByFieldIdOrFieldName) {
      return this.parentTable.setCellValues({
        [this.id]: cellValuesByFieldIdOrFieldName
      });
    }
    /**
     * Use this to check whether the current user can delete this record. Should be
     * called before calling {@link delete}.
     *
     * @returns `true` if the current user can delete this record, `false` otherwise.
     * @example
     * if (myRecord.canDelete()) {
     *     myRecord.delete();
     * }
     */

  }, {
    key: "canDelete",
    value: function canDelete() {
      return this.parentTable.canDeleteRecord(this);
    }
    /**
     * Deletes this record.
     *
     * Throws if the current user cannot delete this record. Call {@link canDelete}
     * before calling this to check whether the current user can delete this record.
     *
     * @returns {{}}
     * @example
     * if (myRecord.canDelete()) {
     *     myRecord.delete();
     * }
     */

  }, {
    key: "delete",
    value: function _delete() {
      return this.parentTable.deleteRecord(this);
    }
    /**
     * @function
     * @returns The number of comments on this record.
     * @example
     * const comentCount = myRecord.commentCount;
     * console.log(`This record has ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`);
     */

  }, {
    key: "__triggerOnChangeForDirtyPaths",

    /**
     * @private
     */
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      var cellValuesByFieldId = dirtyPaths.cellValuesByFieldId,
          commentCount = dirtyPaths.commentCount;

      if (cellValuesByFieldId && u.isObjectNonEmpty(cellValuesByFieldId)) {
        // TODO: don't trigger changes for fields that aren't supposed to be loaded
        // (in some cases, e.g. record created, liveapp will send cell values
        // that we're not subscribed to).
        this._onChange(WatchableRecordKeys.cellValues, Object.keys(cellValuesByFieldId));

        if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
          this._onChange(WatchableRecordKeys.primaryCellValue);
        }

        for (var _i = 0, _Object$keys = Object.keys(cellValuesByFieldId); _i < _Object$keys.length; _i++) {
          var fieldId = _Object$keys[_i];

          this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
        }
      }

      if (commentCount) {
        this._onChange(WatchableRecordKeys.commentCount);
      }
    }
    /**
     * @private
     */

  }, {
    key: "__triggerOnChangeForRecordColorInViewId",
    value: function __triggerOnChangeForRecordColorInViewId(viewId) {
      this._onChange(WatchableColorInViewKeyPrefix + viewId);
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      var tableData = this._baseData.tablesById[this.parentTable.id];

      if (!tableData) {
        return null;
      }

      var recordsById = tableData.recordsById;
      (0, _invariant.default)(recordsById, 'Record data is not loaded');
      return recordsById[this._id] || null;
    }
    /**
     * @function
     * @returns The table that this record belongs to. Should never change because records aren't moved between tables.
     *
     * @example
     * import {useRecords, withHooks} from '@airtable/blocks/ui';
     * const queryResult = myTable.selectRecords();
     * const records = useRecords(queryResult);
     * console.log(records[0].parentTable.id === myTable.id);
     * // => true
     */

  }, {
    key: "parentTable",
    get: function get() {
      return this._parentTable;
    }
  }, {
    key: "url",
    get: function get() {
      return airtableUrls.getUrlForRow(this.id, this.parentTable.id, {
        absolute: true
      });
    }
    /**
     * Gets the primary cell value in this record.
     *
     * @function
     * @returns The primary cell value in this record.
     * @example
     * console.log(myRecord.primaryCellValue);
     * // => 'primary cell value'
     */

  }, {
    key: "primaryCellValue",
    get: function get() {
      return this.getCellValue(this.parentTable.primaryField);
    }
    /**
     * Gets the primary cell value in this record, formatted as a `string`.
     *
     * @function
     * @returns The primary cell value in this record, formatted as a `string`.
     * @example
     * console.log(myRecord.primaryCellValueAsString);
     * // => '42'
     */

  }, {
    key: "primaryCellValueAsString",
    get: function get() {
      return this.getCellValueAsString(this.parentTable.primaryField);
    }
  }, {
    key: "commentCount",
    get: function get() {
      return this._data.commentCount;
    }
    /**
     * @function
     * @returns The created time of this record.
     * @example
     * console.log(`This record was created at ${myRecord.createdTime.toISOString()}`)
     */

  }, {
    key: "createdTime",
    get: function get() {
      return new Date(this._data.createdTime);
    }
  }]);
  return Record;
}(_abstract_model.default);

(0, _defineProperty2.default)(Record, "shouldUseNewLookupFormat", false);
(0, _defineProperty2.default)(Record, "_className", 'Record');
var _default = Record;
exports.default = _default;