"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.string.replace");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _field2 = _interopRequireDefault(require("./field"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _linked_records_query_result = _interopRequireDefault(require("./linked_records_query_result"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

const airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls');

const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

const ATTACHMENTS_V3_CDN_BASE_URL = clientServerSharedConfigSettings.ATTACHMENTS_V3_CDN_BASE_URL;
const WatchableRecordKeys = {
  primaryCellValue: 'primaryCellValue',
  commentCount: 'commentCount',
  // TODO(kasra): these keys don't have matching getters (not that they should
  // it's just inconsistent...)
  cellValues: 'cellValues'
}; // TODO: load cell values in field when this is watched? This will
// cause the CellRenderer component to load cell values, which seems okay,
// but needs a little more thought.

const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:'; // TODO: load view data when this is watched. see previous comment.

const WatchableColorInViewKeyPrefix = 'colorInView:'; // The string case is to accommodate cellValueInField:$FieldId.

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. To create a new record, use `table.createRecord`.
 */
class Record extends _abstract_model.default {
  // Once all blocks set this flag to true, remove this flag.
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableRecordKeys, key) || (0, _startsWith.default)(u).call(u, key, WatchableCellValueInFieldKeyPrefix) || (0, _startsWith.default)(u).call(u, key, WatchableColorInViewKeyPrefix);
  }

  constructor(baseData, parentTable, recordId) {
    super(baseData, recordId);
    this._parentTable = parentTable;
  }

  get _dataOrNullIfDeleted() {
    const tableData = this._baseData.tablesById[this.parentTable.id];

    if (!tableData) {
      return null;
    }

    const recordsById = tableData.recordsById;
    (0, _invariant.default)(recordsById, 'Record data is not loaded');
    return recordsById[this._id] || null;
  }
  /** */


  get parentTable() {
    return this._parentTable;
  }

  __getRawCellValue(fieldId) {
    const publicCellValue = this.getCellValue(fieldId);
    const field = this.parentTable.getFieldById(fieldId);
    (0, _invariant.default)(field, 'Should have field');
    return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
  }

  __getRawRow() {
    let cellValuesByColumnId;

    if (this._data.cellValuesByFieldId) {
      cellValuesByColumnId = {};

      for (const [fieldId, publicCellValue] of (0, _entries.default)(u).call(u, this._data.cellValuesByFieldId)) {
        // When fields are deleted, we set the previously loaded cell value to
        // undefined (vs deleting the key from the cellValuesByFieldId object, which
        // would cause de-opts). So ignore undefined cell values, since the field is deleted.
        if (publicCellValue !== undefined) {
          const field = this.parentTable.getFieldById(fieldId);
          (0, _invariant.default)(field, 'Should have field');
          cellValuesByColumnId[fieldId] = _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
        }
      }
    }

    return {
      id: this.id,
      createdTime: this._data.createdTime,
      cellValuesByColumnId
    };
  }

  _getFieldMatching(fieldOrFieldIdOrFieldName) {
    return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
  }

  _getViewMatching(viewOrViewIdOrViewName) {
    return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
  }
  /** */


  getCellValue(fieldOrFieldIdOrFieldName) {
    const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    (0, _invariant.default)(field.parentTable.id === this.parentTable.id, 'Field must have same parent table as record');
    (0, _invariant.default)(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');
    const {
      cellValuesByFieldId
    } = this._data;

    if (!cellValuesByFieldId) {
      return null;
    }

    const cellValue = cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

    if (typeof cellValue === 'object' && cellValue !== null) {
      // HACK: while we migrate our blocks to the new lookup cell value
      // format, make the public cell value look like an array for
      // backwards compatibility.
      if (!Record.shouldUseNewLookupFormat && field.type === _field.FieldTypes.LOOKUP) {
        const cellValueForMigration = []; // flow-disable-next-line

        cellValueForMigration.linkedRecordIds = _private_utils.default.cloneDeep(cellValue.linkedRecordIds); // flow-disable-next-line

        cellValueForMigration.valuesByLinkedRecordId = _private_utils.default.cloneDeep(cellValue.valuesByLinkedRecordId);
        (0, _invariant.default)((0, _isArray.default)(cellValue.linkedRecordIds), 'linkedRecordIds');

        for (const linkedRecordId of cellValue.linkedRecordIds) {
          (0, _invariant.default)(typeof linkedRecordId === 'string', 'linkedRecordId');
          const {
            valuesByLinkedRecordId
          } = cellValue;
          (0, _invariant.default)(valuesByLinkedRecordId && typeof valuesByLinkedRecordId === 'object', 'valuesByLinkedRecordId');
          const value = valuesByLinkedRecordId[linkedRecordId];

          if ((0, _isArray.default)(value)) {
            for (const v of value) {
              cellValueForMigration.push(v);
            }
          } else {
            cellValueForMigration.push(value);
          }
        }

        return cellValueForMigration;
      } // Copy non-primitives.
      // TODO(kasra): maybe freezeDeep instead?


      return _private_utils.default.cloneDeep(cellValue);
    } else {
      return cellValue;
    }
  }
  /** */


  getCellValueAsString(fieldOrFieldIdOrFieldName) {
    const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    (0, _invariant.default)(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');

    const rawCellValue = this.__getRawCellValue(field.id);

    if (rawCellValue === null || rawCellValue === undefined) {
      return '';
    } else {
      return columnTypeProvider.convertCellValueToString(rawCellValue, field.__getRawType(), field.__getRawTypeOptions(), this.parentTable.parentBase.__appInterface);
    }
  }
  /**
   * Call this method with an attachment ID and URL to get back a URL that is
   * suitable for rendering on the current client. The URL that is returned
   * will only work for the current user.
   */


  getAttachmentClientUrlFromCellValueUrl(attachmentId, attachmentUrl) {
    const appInterface = this.parentTable.parentBase.__appInterface;
    const isAttachmentsCdnV3Enabled = appInterface.isFeatureEnabled('attachmentsCdnV3');

    if (isAttachmentsCdnV3Enabled) {
      const applicationId = appInterface.getApplicationId();
      const userId = appInterface.getCurrentSessionUserId(); // NOTE: normal images must be active in the base. We don't support rendering historical values here. see attachment_object_methods.js for more

      const imagePathPrefix = 'attV3/';
      attachmentUrl = attachmentUrl.replace(/^https:\/\/([^/]+)\//, `${ATTACHMENTS_V3_CDN_BASE_URL}/${imagePathPrefix}${userId}/${applicationId}/${attachmentId}/`);
    }

    return attachmentUrl;
  }
  /**
   * Get the color name for this record in the specified view, or null if
   * no color is available. Watch with the 'colorInView:${ViewId}' key.
   */


  getColorInView(viewOrViewIdOrViewName) {
    const view = this._getViewMatching(viewOrViewIdOrViewName);

    (0, _invariant.default)(view, 'View does not exist');
    (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
    return view.getRecordColor(this);
  }
  /**
   * Get a CSS hex string for this record in the specified view, or null if
   * no color is available. Watch with the 'colorInView:${ViewId}' key
   */


  getColorHexInView(viewOrViewIdOrViewName) {
    const view = this._getViewMatching(viewOrViewIdOrViewName);

    (0, _invariant.default)(view, 'View does not exist');
    (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
    return view.getRecordColorHex(this);
  }

  getLinkedRecordsFromCell(fieldOrFieldIdOrFieldName, opts = {}) {
    const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    return _linked_records_query_result.default.__createOrReuseQueryResult(this, field, opts);
  }
  /** Returns the URL for this record. */


  get url() {
    return airtableUrls.getUrlForRow(this.id, this.parentTable.id, {
      absolute: true
    });
  }
  /** */


  get primaryCellValue() {
    return this.getCellValue(this.parentTable.primaryField);
  }
  /** */


  get primaryCellValueAsString() {
    return this.getCellValueAsString(this.parentTable.primaryField);
  }
  /**
   * Use this to check if the current user has permission to update a
   * specific cell value before calling `setCellValue`.
   */


  canSetCellValue(fieldOrFieldIdOrFieldName, publicCellValue) {
    const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    return this.canSetCellValues({
      [field.id]: publicCellValue
    });
  }
  /**
   * Use `canSetCellValue` to check if the current user has permission to update a
   * specific cell value before calling. Will throw if the user does not have
   * permission.
   */


  setCellValue(fieldOrFieldIdOrFieldName, publicCellValue) {
    const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    return this.setCellValues({
      [field.id]: publicCellValue
    });
  }
  /**
   * Use this to check if the current user has permission to update a
   * set of cell values before calling `setCellValues`.
   */


  canSetCellValues(cellValuesByFieldIdOrFieldName) {
    return this.parentTable.canSetCellValues({
      [this.id]: cellValuesByFieldIdOrFieldName
    });
  }
  /**
   * Use `canSetCellValues` to check if the current user has permission to update
   * the cell values before calling. Will throw if the user does not have
   * permission.
   */


  setCellValues(cellValuesByFieldIdOrFieldName) {
    return this.parentTable.setCellValues({
      [this.id]: cellValuesByFieldIdOrFieldName
    });
  }
  /** */


  canDelete() {
    return this.parentTable.canDeleteRecord(this);
  }
  /** */


  delete() {
    return this.parentTable.deleteRecord(this);
  }
  /** */


  get commentCount() {
    return this._data.commentCount;
  }
  /** */


  get createdTime() {
    return new Date(this._data.createdTime);
  }

  __triggerOnChangeForDirtyPaths(dirtyPaths) {
    const {
      cellValuesByFieldId,
      commentCount
    } = dirtyPaths;

    if (cellValuesByFieldId && u.isObjectNonEmpty(cellValuesByFieldId)) {
      // TODO: don't trigger changes for fields that aren't supposed to be loaded
      // (in some cases, e.g. record created, liveapp will send cell values
      // that we're not subscribed to).
      this._onChange(WatchableRecordKeys.cellValues, (0, _keys2.default)(cellValuesByFieldId));

      if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
        this._onChange(WatchableRecordKeys.primaryCellValue);
      }

      for (const fieldId of (0, _keys.default)(u).call(u, cellValuesByFieldId)) {
        this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
      }
    }

    if (commentCount) {
      this._onChange(WatchableRecordKeys.commentCount);
    }
  }

  __triggerOnChangeForRecordColorInViewId(viewId) {
    this._onChange(WatchableColorInViewKeyPrefix + viewId);
  }

}

(0, _defineProperty2.default)(Record, "shouldUseNewLookupFormat", false);
(0, _defineProperty2.default)(Record, "_className", 'Record');
var _default = Record;
exports.default = _default;