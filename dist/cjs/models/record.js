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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _private_utils = require("../private_utils");

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

var _field2 = _interopRequireDefault(require("./field"));

var _cell_value_utils = _interopRequireDefault(require("./cell_value_utils"));

var _linked_records_query_result = _interopRequireDefault(require("./linked_records_query_result"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

var airtableUrls = window.__requirePrivateModuleFromAirtable('client_server_shared/airtable_urls');

var clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

var ATTACHMENTS_V3_CDN_BASE_URL = clientServerSharedConfigSettings.ATTACHMENTS_V3_CDN_BASE_URL;
var WatchableRecordKeys = {
  primaryCellValue: 'primaryCellValue',
  commentCount: 'commentCount',
  // TODO(kasra): these keys don't have matching getters (not that they should
  // it's just inconsistent...)
  cellValues: 'cellValues'
}; // TODO: load cell values in field when this is watched? This will
// cause the CellRenderer component to load cell values, which seems okay,
// but needs a little more thought.

var WatchableCellValueInFieldKeyPrefix = 'cellValueInField:'; // TODO: load view data when this is watched. see previous comment.

var WatchableColorInViewKeyPrefix = 'colorInView:'; // The string case is to accommodate cellValueInField:$FieldId.

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. To create a new record, use `table.createRecord`.
 */
class Record extends _abstract_model.default {
  // Once all blocks set this flag to true, remove this flag.
  static _isWatchableKey(key) {
    return (0, _private_utils.isEnumValue)(WatchableRecordKeys, key) || u.startsWith(key, WatchableCellValueInFieldKeyPrefix) || u.startsWith(key, WatchableColorInViewKeyPrefix);
  }

  constructor(baseData, parentTable, recordId) {
    super(baseData, recordId);
    this._parentTable = parentTable;
  }

  get _dataOrNullIfDeleted() {
    var tableData = this._baseData.tablesById[this.parentTable.id];

    if (!tableData) {
      return null;
    }

    var recordsById = tableData.recordsById;
    (0, _invariant.default)(recordsById, 'Record data is not loaded');
    return recordsById[this._id] || null;
  }
  /** */


  get parentTable() {
    return this._parentTable;
  }

  __getRawCellValue(fieldId) {
    var publicCellValue = this.getCellValue(fieldId);
    var field = this.parentTable.getFieldById(fieldId);
    (0, _invariant.default)(field, 'Should have field');
    return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
  }

  __getRawRow() {
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
            (0, _invariant.default)(field, 'Should have field');
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

  _getFieldMatching(fieldOrFieldIdOrFieldName) {
    return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
  }

  _getViewMatching(viewOrViewIdOrViewName) {
    return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
  }
  /** */


  getCellValue(fieldOrFieldIdOrFieldName) {
    var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    (0, _invariant.default)(field.parentTable.id === this.parentTable.id, 'Field must have same parent table as record');
    (0, _invariant.default)(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');
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
        var cellValueForMigration = []; // flow-disable-next-line

        cellValueForMigration.linkedRecordIds = (0, _private_utils.cloneDeep)(cellValue.linkedRecordIds); // flow-disable-next-line

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
  /** */


  getCellValueAsString(fieldOrFieldIdOrFieldName) {
    var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

    (0, _invariant.default)(field, 'Field does not exist');
    (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
    (0, _invariant.default)(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');

    var rawCellValue = this.__getRawCellValue(field.id);

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
   * Get the color name for this record in the specified view, or null if
   * no color is available. Watch with the 'colorInView:${ViewId}' key.
   */


  getColorInView(viewOrViewIdOrViewName) {
    var view = this._getViewMatching(viewOrViewIdOrViewName);

    (0, _invariant.default)(view, 'View does not exist');
    (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
    return view.__getRecordColor(this);
  }
  /**
   * Get a CSS hex string for this record in the specified view, or null if
   * no color is available. Watch with the 'colorInView:${ViewId}' key
   */


  getColorHexInView(viewOrViewIdOrViewName) {
    var view = this._getViewMatching(viewOrViewIdOrViewName);

    (0, _invariant.default)(view, 'View does not exist');
    (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
    return view.__getRecordColorHex(this);
  }

  getLinkedRecordsFromCell(fieldOrFieldIdOrFieldName) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

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
    var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

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
    var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

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

  __triggerOnChangeForRecordColorInViewId(viewId) {
    this._onChange(WatchableColorInViewKeyPrefix + viewId);
  }

}

(0, _defineProperty2.default)(Record, "shouldUseNewLookupFormat", false);
(0, _defineProperty2.default)(Record, "_className", 'Record');
var _default = Record;
exports.default = _default;