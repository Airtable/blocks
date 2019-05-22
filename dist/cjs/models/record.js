"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.string.replace");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _field = require("../types/field");

var _private_utils = _interopRequireDefault(require("../private_utils"));

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
var Record =
/*#__PURE__*/
function (_AbstractModel) {
  (0, _inherits2.default)(Record, _AbstractModel);
  (0, _createClass2.default)(Record, null, [{
    key: "_isWatchableKey",
    // Once all blocks set this flag to true, remove this flag.
    value: function _isWatchableKey(key) {
      return _private_utils.default.isEnumValue(WatchableRecordKeys, key) || (0, _startsWith.default)(u).call(u, key, WatchableCellValueInFieldKeyPrefix) || (0, _startsWith.default)(u).call(u, key, WatchableColorInViewKeyPrefix);
    }
  }]);

  function Record(baseData, parentTable, recordId) {
    var _this;

    (0, _classCallCheck2.default)(this, Record);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Record).call(this, baseData, recordId));
    _this._parentTable = parentTable;
    return _this;
  }

  (0, _createClass2.default)(Record, [{
    key: "__getRawCellValue",
    value: function __getRawCellValue(fieldId) {
      var publicCellValue = this.getCellValue(fieldId);
      var field = this.parentTable.getFieldById(fieldId);
      (0, _invariant.default)(field, 'Should have field');
      return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
    }
  }, {
    key: "__getRawRow",
    value: function __getRawRow() {
      var cellValuesByColumnId;

      if (this._data.cellValuesByFieldId) {
        cellValuesByColumnId = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)((0, _entries.default)(u).call(u, this._data.cellValuesByFieldId)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        cellValuesByColumnId: cellValuesByColumnId
      };
    }
  }, {
    key: "_getFieldMatching",
    value: function _getFieldMatching(fieldOrFieldIdOrFieldName) {
      return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
  }, {
    key: "_getViewMatching",
    value: function _getViewMatching(viewOrViewIdOrViewName) {
      return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
    }
    /** */

  }, {
    key: "getCellValue",
    value: function getCellValue(fieldOrFieldIdOrFieldName) {
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

      if ((0, _typeof2.default)(cellValue) === 'object' && cellValue !== null) {
        // HACK: while we migrate our blocks to the new lookup cell value
        // format, make the public cell value look like an array for
        // backwards compatibility.
        if (!Record.shouldUseNewLookupFormat && field.type === _field.FieldTypes.LOOKUP) {
          var cellValueForMigration = []; // flow-disable-next-line

          cellValueForMigration.linkedRecordIds = _private_utils.default.cloneDeep(cellValue.linkedRecordIds); // flow-disable-next-line

          cellValueForMigration.valuesByLinkedRecordId = _private_utils.default.cloneDeep(cellValue.valuesByLinkedRecordId);
          (0, _invariant.default)((0, _isArray.default)(cellValue.linkedRecordIds), 'linkedRecordIds');
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator2.default)(cellValue.linkedRecordIds), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var linkedRecordId = _step2.value;
              (0, _invariant.default)(typeof linkedRecordId === 'string', 'linkedRecordId');
              var valuesByLinkedRecordId = cellValue.valuesByLinkedRecordId;
              (0, _invariant.default)(valuesByLinkedRecordId && (0, _typeof2.default)(valuesByLinkedRecordId) === 'object', 'valuesByLinkedRecordId');
              var value = valuesByLinkedRecordId[linkedRecordId];

              if ((0, _isArray.default)(value)) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = (0, _getIterator2.default)(value), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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


        return _private_utils.default.cloneDeep(cellValue);
      } else {
        return cellValue;
      }
    }
    /** */

  }, {
    key: "getCellValueAsString",
    value: function getCellValueAsString(fieldOrFieldIdOrFieldName) {
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

  }, {
    key: "getAttachmentClientUrlFromCellValueUrl",
    value: function getAttachmentClientUrlFromCellValueUrl(attachmentId, attachmentUrl) {
      var appInterface = this.parentTable.parentBase.__appInterface;
      var isAttachmentsCdnV3Enabled = appInterface.isFeatureEnabled('attachmentsCdnV3');

      if (isAttachmentsCdnV3Enabled) {
        var _context, _context2, _context3, _context4;

        var applicationId = appInterface.getApplicationId();
        var userId = appInterface.getCurrentSessionUserId(); // NOTE: normal images must be active in the base. We don't support rendering historical values here. see attachment_object_methods.js for more

        var imagePathPrefix = 'attV3/';
        attachmentUrl = attachmentUrl.replace(/^https:\/\/([^/]+)\//, (0, _concat.default)(_context = (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = (0, _concat.default)(_context4 = "".concat(ATTACHMENTS_V3_CDN_BASE_URL, "/")).call(_context4, imagePathPrefix)).call(_context3, userId, "/")).call(_context2, applicationId, "/")).call(_context, attachmentId, "/"));
      }

      return attachmentUrl;
    }
    /**
     * Get the color name for this record in the specified view, or null if
     * no color is available. Watch with the 'colorInView:${ViewId}' key.
     */

  }, {
    key: "getColorInView",
    value: function getColorInView(viewOrViewIdOrViewName) {
      var view = this._getViewMatching(viewOrViewIdOrViewName);

      (0, _invariant.default)(view, 'View does not exist');
      (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
      return view.getRecordColor(this);
    }
    /**
     * Get a CSS hex string for this record in the specified view, or null if
     * no color is available. Watch with the 'colorInView:${ViewId}' key
     */

  }, {
    key: "getColorHexInView",
    value: function getColorHexInView(viewOrViewIdOrViewName) {
      var view = this._getViewMatching(viewOrViewIdOrViewName);

      (0, _invariant.default)(view, 'View does not exist');
      (0, _invariant.default)(!view.isDeleted, 'View has been deleted');
      return view.getRecordColorHex(this);
    }
  }, {
    key: "getLinkedRecordsFromCell",
    value: function getLinkedRecordsFromCell(fieldOrFieldIdOrFieldName) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return _linked_records_query_result.default.__createOrReuseQueryResult(this, field, opts);
    }
    /** Returns the URL for this record. */

  }, {
    key: "canSetCellValue",

    /**
     * Use this to check if the current user has permission to update a
     * specific cell value before calling `setCellValue`.
     */
    value: function canSetCellValue(fieldOrFieldIdOrFieldName, publicCellValue) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return this.canSetCellValues((0, _defineProperty2.default)({}, field.id, publicCellValue));
    }
    /**
     * Use `canSetCellValue` to check if the current user has permission to update a
     * specific cell value before calling. Will throw if the user does not have
     * permission.
     */

  }, {
    key: "setCellValue",
    value: function setCellValue(fieldOrFieldIdOrFieldName, publicCellValue) {
      var field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

      (0, _invariant.default)(field, 'Field does not exist');
      (0, _invariant.default)(!field.isDeleted, 'Field has been deleted');
      return this.setCellValues((0, _defineProperty2.default)({}, field.id, publicCellValue));
    }
    /**
     * Use this to check if the current user has permission to update a
     * set of cell values before calling `setCellValues`.
     */

  }, {
    key: "canSetCellValues",
    value: function canSetCellValues(cellValuesByFieldIdOrFieldName) {
      return this.parentTable.canSetCellValues((0, _defineProperty2.default)({}, this.id, cellValuesByFieldIdOrFieldName));
    }
    /**
     * Use `canSetCellValues` to check if the current user has permission to update
     * the cell values before calling. Will throw if the user does not have
     * permission.
     */

  }, {
    key: "setCellValues",
    value: function setCellValues(cellValuesByFieldIdOrFieldName) {
      return this.parentTable.setCellValues((0, _defineProperty2.default)({}, this.id, cellValuesByFieldIdOrFieldName));
    }
    /** */

  }, {
    key: "canDelete",
    value: function canDelete() {
      return this.parentTable.canDeleteRecord(this);
    }
    /** */

  }, {
    key: "delete",
    value: function _delete() {
      return this.parentTable.deleteRecord(this);
    }
    /** */

  }, {
    key: "__triggerOnChangeForDirtyPaths",
    value: function __triggerOnChangeForDirtyPaths(dirtyPaths) {
      var cellValuesByFieldId = dirtyPaths.cellValuesByFieldId,
          commentCount = dirtyPaths.commentCount;

      if (cellValuesByFieldId && u.isObjectNonEmpty(cellValuesByFieldId)) {
        // TODO: don't trigger changes for fields that aren't supposed to be loaded
        // (in some cases, e.g. record created, liveapp will send cell values
        // that we're not subscribed to).
        this._onChange(WatchableRecordKeys.cellValues, (0, _keys2.default)(cellValuesByFieldId));

        if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
          this._onChange(WatchableRecordKeys.primaryCellValue);
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator2.default)((0, _keys.default)(u).call(u, cellValuesByFieldId)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var fieldId = _step4.value;

            this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
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

      if (commentCount) {
        this._onChange(WatchableRecordKeys.commentCount);
      }
    }
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
    /** */

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
    /** */

  }, {
    key: "primaryCellValue",
    get: function get() {
      return this.getCellValue(this.parentTable.primaryField);
    }
    /** */

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
    /** */

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