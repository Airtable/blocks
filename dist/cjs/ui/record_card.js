"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

require("core-js/modules/es.function.name");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectSpread"));

var _invariant = _interopRequireDefault(require("invariant"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _field = require("../types/field");

var _field2 = _interopRequireDefault(require("../models/field"));

var _record = _interopRequireDefault(require("../models/record"));

var _view = _interopRequireDefault(require("../models/view"));

var _cell_value_utils = _interopRequireDefault(require("../models/cell_value_utils"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _expand_record = _interopRequireDefault(require("./expand_record"));

var _cell_renderer = _interopRequireDefault(require("./cell_renderer"));

var _FormulaicFieldTypes;

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

var attachmentPreviewRenderer = window.__requirePrivateModuleFromAirtable('client_server_shared/read_mode_renderers/attachment_preview_renderer');

var keyCodeUtils = window.__requirePrivateModuleFromAirtable('client/mylib/key_code_utils');

var _window$__requirePriv2 = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings'),
    FALLBACK_ROW_NAME_FOR_DISPLAY = _window$__requirePriv2.FALLBACK_ROW_NAME_FOR_DISPLAY;

var CARD_PADDING = 12;
var styles = {
  cellValueAndFieldLabel: {
    verticalAlign: 'top'
  },
  fieldLabel: {
    lineHeight: '13px',
    fontSize: 11,
    color: '#898989'
  },
  cellValue: {
    lineHeight: '16px',
    fontSize: 12
  }
};
var CellValueAndFieldLabel = (0, _create_data_container.default)(function (_ref) {
  var record = _ref.record,
      cellValue = _ref.cellValue,
      field = _ref.field,
      width = _ref.width;
  return React.createElement("div", {
    className: "borderBoxSizing relative inline-block m0 pr1",
    style: (0, _objectSpread2.default)({
      width: width
    }, styles.cellValueAndFieldLabel)
  }, React.createElement("div", {
    className: "block textOverflowEllipsis uppercase small appFontWeightRegular",
    style: styles.fieldLabel
  }, field.name), React.createElement(_cell_renderer.default, {
    record: record,
    cellValue: cellValue,
    field: field,
    shouldWrap: false,
    className: "recordCardCellValue block textOverflowEllipsis",
    style: styles.cellValue
  }));
}, function (props) {
  return [{
    watch: props.field,
    key: ['name', 'config']
  }];
});
CellValueAndFieldLabel.propTypes = {
  record: _propTypes.default.instanceOf(_record.default),
  // NOTE: this currently will not work for linked record fields, since CellRenderer
  // cannot currently handle all cell types.
  // TODO(jb): make the constraints for rendering cell values less strict than the
  // constraints we put on updating cell values.
  cellValue: _propTypes.default.any,
  field: _propTypes.default.instanceOf(_field2.default).isRequired,
  width: _propTypes.default.number.isRequired
};
// TODO(jb): move this stuff into the field model when we decide on an api for it.
var FormulaicFieldTypes = (_FormulaicFieldTypes = {}, (0, _defineProperty2.default)(_FormulaicFieldTypes, _field.FieldTypes.FORMULA, true), (0, _defineProperty2.default)(_FormulaicFieldTypes, _field.FieldTypes.ROLLUP, true), (0, _defineProperty2.default)(_FormulaicFieldTypes, _field.FieldTypes.LOOKUP, true), _FormulaicFieldTypes);

var isFieldFormulaic = function isFieldFormulaic(field) {
  return !!FormulaicFieldTypes[field.type];
};

var getFieldResultType = function getFieldResultType(field) {
  if (field.type === _field.FieldTypes.COUNT) {
    return _field.FieldTypes.NUMBER;
  }

  if (isFieldFormulaic(field)) {
    (0, _invariant.default)(field.options, 'options');
    var resultConfig = field.options.resultConfig;

    if (resultConfig && (0, _typeof2.default)(resultConfig) === 'object') {
      var resultConfigType = resultConfig.type;
      (0, _invariant.default)(typeof resultConfigType === 'string', 'resultConfigType must be string');
      return resultConfigType;
    } else {
      // Formula is misconfigured.
      return _field.FieldTypes.SINGLE_LINE_TEXT;
    }
  } else {
    return field.type;
  }
};
/** */


var RecordCard =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RecordCard, _React$Component);

  function RecordCard(props) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, RecordCard);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordCard).call(this, props));
    _this._onClick = (0, _bind.default)(_context = _this._onClick).call(_context, (0, _assertThisInitialized2.default)(_this));

    _this._validateProps(props);

    return _this;
  }

  (0, _createClass2.default)(RecordCard, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this._validateProps(nextProps);
    }
  }, {
    key: "_validateProps",
    value: function _validateProps(props) {
      var record = props.record,
          view = props.view,
          fields = props.fields,
          attachmentCoverField = props.attachmentCoverField;

      if (record && record instanceof _record.default && record.isDeleted) {
        throw new Error('Record is deleted');
      }

      if (!record) {
        throw new Error('Must provide record');
      }

      if (record && record instanceof _record.default && attachmentCoverField) {
        if (attachmentCoverField.parentTable.id !== record.parentTable.id) {
          throw new Error('Attachment cover field must have the same parent table as record');
        }
      }

      if (record && record instanceof _record.default && fields) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(fields), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var field = _step.value;

            if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
              throw new Error('All fields must have the same parent table as record');
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

      if (record && record instanceof _record.default && view && !view.isDeleted) {
        if (view.parentTable.id !== record.parentTable.id) {
          throw new Error('View must have the same parent table as record');
        }
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(e) {
      if (this.props.onClick) {
        this.props.onClick(e);
      } else if (this.props.onClick === undefined) {
        // NOTE: `null` disables the default click behavior.
        var record = this.props.record;
        var recordModel = record && record instanceof _record.default ? record : null;

        if (recordModel) {
          if (keyCodeUtils.isCommandModifierKeyEvent(e) || e.shiftKey) {// No-op, let the <a> tag handle opening in new tab or window.
          } else {
            e.preventDefault();
            var opts = this.props.getExpandRecordOptions ? this.props.getExpandRecordOptions(recordModel) : {};
            (0, _expand_record.default)(recordModel, opts);
          }
        }
      }
    }
  }, {
    key: "_getAttachmentCover",
    value: function _getAttachmentCover(fieldsToUse) {
      var attachmentField = this._getAttachmentField(fieldsToUse);

      return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
  }, {
    key: "_getAttachmentField",
    value: function _getAttachmentField(fieldsToUse) {
      var _this2 = this;

      var _this$props = this.props,
          attachmentCoverField = _this$props.attachmentCoverField,
          fields = _this$props.fields;

      if (attachmentCoverField && !attachmentCoverField.isDeleted && this._isAttachment(attachmentCoverField)) {
        return attachmentCoverField;
      } else if (attachmentCoverField === undefined && !fields) {
        // The attachment field in this case is either coming from the view
        // if there is a view, or from the table's arbitrary field ordering
        // if there is no view.
        // TODO: use the real cover field if the view is gallery or kanban instead of
        // the first attachment field
        var firstAttachmentFieldInView = (0, _find.default)(u).call(u, fieldsToUse, function (field) {
          return _this2._isAttachment(field);
        });

        if (firstAttachmentFieldInView === undefined) {
          return null;
        }

        return firstAttachmentFieldInView;
      } else {
        return null;
      }
    }
  }, {
    key: "_isAttachment",
    value: function _isAttachment(field) {
      return getFieldResultType(field) === _field.FieldTypes.MULTIPLE_ATTACHMENTS;
    }
  }, {
    key: "_getRawCellValue",
    value: function _getRawCellValue(field) {
      var record = this.props.record;

      if (record && record instanceof _record.default) {
        return record.__getRawCellValue(field.id);
      } else {
        var publicCellValue = record[field.id];

        _cell_value_utils.default.validatePublicCellValueForUpdate(publicCellValue, null, field);

        publicCellValue = _cell_value_utils.default.normalizePublicCellValueForUpdate(publicCellValue, field);
        return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
      }
    }
  }, {
    key: "_getFirstAttachmentInField",
    value: function _getFirstAttachmentInField(attachmentField) {
      var attachmentsInField;

      if (attachmentField.type === _field.FieldTypes.LOOKUP) {
        var rawCellValue = this._getRawCellValue(attachmentField); // eslint-disable-line flowtype/no-weak-types


        attachmentsInField = u.flattenDeep((0, _values.default)(u).call(u, rawCellValue ? rawCellValue.valuesByForeignRowId : {}));
      } else {
        attachmentsInField = this._getRawCellValue(attachmentField); // eslint-disable-line flowtype/no-weak-types
      }

      return attachmentsInField && attachmentsInField.length > 0 ? attachmentsInField[0] : null;
    }
  }, {
    key: "_getFields",
    value: function _getFields() {
      var _this$props2 = this.props,
          view = _this$props2.view,
          fields = _this$props2.fields,
          record = _this$props2.record;
      var fieldsToUse;

      if (fields) {
        fieldsToUse = (0, _filter.default)(fields).call(fields, function (field) {
          return !field.isDeleted;
        });
      } else if (view && !view.isDeleted) {
        fieldsToUse = view.visibleFields;
      } else if (record && record instanceof _record.default && !record.isDeleted) {
        var parentTable = record.parentTable;
        fieldsToUse = parentTable.fields;
      } else {
        console.warn('RecordCard: no fields, view, or record, so rendering an empty card'); // eslint-disable-line no-console

        fieldsToUse = [];
      }

      return u.uniqBy(fieldsToUse, function (field) {
        return field.id;
      });
    }
  }, {
    key: "_getPossibleFieldsForCard",
    value: function _getPossibleFieldsForCard() {
      var fields = this._getFields(); // remove primary field if it exists


      return (0, _filter.default)(fields).call(fields, function (field) {
        return !field.isPrimaryField;
      });
    }
  }, {
    key: "_getWidthAndFieldIdArray",
    value: function _getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse) {
      var widthAndFieldIdArray = [];
      var runningWidth = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator2.default)(fieldsToUse), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var field = _step2.value;
          var desiredWidth = columnTypeProvider.getDesiredCellWidthForRowCard(field.__getRawType(), field.__getRawTypeOptions());

          if (runningWidth + desiredWidth < cellContainerWidth) {
            widthAndFieldIdArray.push({
              width: desiredWidth,
              fieldId: field.id
            });
            runningWidth += desiredWidth;
          } else {
            var minWidth = columnTypeProvider.getMinCellWidthForRowCard(field.__getRawType(), field.__getRawTypeOptions());

            if (runningWidth + minWidth < cellContainerWidth) {
              widthAndFieldIdArray.push({
                width: minWidth,
                fieldId: field.id
              });
              runningWidth += minWidth;
            } else {
              break;
            }
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

      if (runningWidth < cellContainerWidth && widthAndFieldIdArray.length > 0) {
        var lastWidthAndFieldId = widthAndFieldIdArray[widthAndFieldIdArray.length - 1];
        lastWidthAndFieldId.width += cellContainerWidth - runningWidth;
      }

      return widthAndFieldIdArray;
    }
  }, {
    key: "_getRecordModel",
    value: function _getRecordModel() {
      var record = this.props.record;

      if (record && record instanceof _record.default) {
        return record;
      } else {
        return null;
      }
    }
  }, {
    key: "_renderCellsAndFieldLabels",
    value: function _renderCellsAndFieldLabels(attachmentSize, fieldsToUse) {
      var _this$props3 = this.props,
          record = _this$props3.record,
          width = _this$props3.width;
      (0, _invariant.default)(typeof width === 'number', 'width in defaultProps');
      var cellContainerWidth = width - CARD_PADDING - attachmentSize;

      var widthAndFieldIdArray = this._getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse);

      var fieldsById = u.keyBy(fieldsToUse, function (o) {
        return o.id;
      });
      return (0, _map.default)(widthAndFieldIdArray).call(widthAndFieldIdArray, function (widthAndFieldId) {
        var field = fieldsById[widthAndFieldId.fieldId];
        return React.createElement(CellValueAndFieldLabel, (0, _extends2.default)({
          key: field.id,
          field: field,
          width: widthAndFieldId.width
        }, record instanceof _record.default ? {
          record: record
        } : {
          cellValue: record[field.id]
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          record = _this$props4.record,
          view = _this$props4.view,
          width = _this$props4.width,
          height = _this$props4.height,
          onClick = _this$props4.onClick,
          onMouseEnter = _this$props4.onMouseEnter,
          onMouseLeave = _this$props4.onMouseLeave,
          className = _this$props4.className,
          style = _this$props4.style;

      if (record && record instanceof _record.default && record.isDeleted) {
        return null;
      }

      var allFields = this._getFields();

      var fieldsToUse = this._getPossibleFieldsForCard();

      var attachmentObjIfAvailable = this._getAttachmentCover(fieldsToUse);

      var hasAttachment = !!attachmentObjIfAvailable;
      var hasOnClick = !!onClick || !!this._getRecordModel();
      var containerClasses = (0, _classnames.default)('white rounded relative block overflow-hidden', {
        'pointer cardBoxShadow': hasOnClick,
        stroked1: !hasOnClick
      }, className); // use height as size in order to get square attachment

      (0, _invariant.default)(typeof height === 'number', 'height in defaultProps');
      var attachmentSize = hasAttachment ? height : 0;
      var imageHtml = '';

      if (hasAttachment) {
        var attachmentField = this._getAttachmentField(fieldsToUse);

        (0, _invariant.default)(attachmentField, 'attachmentField must be present when we have an attachment');
        (0, _invariant.default)(attachmentObjIfAvailable, 'attachmentObjIfAvailable is defined if hasAttachment');
        var attachmentObj = attachmentObjIfAvailable; // eslint-disable-line flowtype/no-weak-types

        var userScopedAppInterface = attachmentField.parentTable.parentBase.__appInterface;
        imageHtml = attachmentPreviewRenderer.renderSquarePreview(attachmentObj, userScopedAppInterface, {
          extraClassString: 'absolute right-0 height-full overflow-hidden noevents',
          extraStyles: {
            'border-top-right-radius': 2,
            'border-bottom-right-radius': 2
          },
          size: attachmentSize
        });
      }

      var containerStyles = (0, _objectSpread2.default)({}, style, {
        width: width,
        height: height
      });
      var primaryValue;
      var isUnnamed;
      var primaryCellValueAsString;
      var recordUrl;
      var recordColorClass;

      if (record instanceof _record.default) {
        recordUrl = record.url;
        primaryCellValueAsString = record.primaryCellValueAsString;

        if (view) {
          recordColorClass = record.getColorInView(view);
        }
      } else {
        var primaryField = allFields.length > 0 ? allFields[0].parentTable.primaryField : null;
        var primaryCellValue = primaryField ? record[primaryField.id] : null;
        primaryCellValueAsString = primaryCellValue === null || primaryCellValue === undefined ? null : String(primaryCellValue);
      }

      if (u.isNullOrUndefinedOrEmpty(primaryCellValueAsString)) {
        primaryValue = FALLBACK_ROW_NAME_FOR_DISPLAY;
        isUnnamed = true;
      } else {
        primaryValue = primaryCellValueAsString;
        isUnnamed = false;
      }

      var primaryClasses = (0, _classnames.default)('strong relative cellValue mt0 flex items-center line-height-4', {
        unnamed: isUnnamed
      });
      var primaryStyles = {
        height: 18,
        fontSize: 14
      };
      return React.createElement("a", {
        href: onClick === undefined && recordUrl ? recordUrl : undefined,
        className: containerClasses,
        style: containerStyles,
        onClick: this._onClick,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave
      }, React.createElement("div", {
        className: "absolute top-0 bottom-0 left-0 appFontColor",
        style: {
          right: attachmentSize,
          background: 'transparent',
          padding: CARD_PADDING
        }
      }, React.createElement("div", {
        className: primaryClasses,
        style: primaryStyles
      }, recordColorClass && React.createElement("div", {
        className: "flex-none pill mr-half ".concat(recordColorClass),
        style: {
          width: 6,
          height: 20
        }
      }), React.createElement("div", {
        className: "flex-auto truncate"
      }, primaryValue)), React.createElement("div", {
        className: "absolute appFontColorLight",
        style: {
          marginTop: 3
        }
      }, this._renderCellsAndFieldLabels(attachmentSize, fieldsToUse))), React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: imageHtml
        }
      }));
    }
  }]);
  return RecordCard;
}(React.Component);

(0, _defineProperty2.default)(RecordCard, "propTypes", {
  // Record can either be a record model or a record def (cellValuesByFieldId)
  record: _propTypes.default.oneOfType([_propTypes.default.instanceOf(_record.default), _propTypes.default.object]),
  // Should provide one of fields and view
  fields: _propTypes.default.arrayOf(_propTypes.default.instanceOf(_field2.default).isRequired),
  view: _propTypes.default.instanceOf(_view.default),
  // This component will always respect attachmentCoverField if one is passed in.
  // Pass a null value to explicitly indicate that an attachment should not be
  // shown. If attachmentCoverField is undefined, it will fall back to using the
  // first attachment in the view provided (if a view is provided).
  attachmentCoverField: _propTypes.default.instanceOf(_field2.default),
  width: _propTypes.default.number,
  height: _propTypes.default.number,
  onClick: _propTypes.default.func,
  onMouseEnter: _propTypes.default.func,
  onMouseLeave: _propTypes.default.func,
  // TODO: add all other mouse events: https://facebook.github.io/react/docs/events.html#mouse-events
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  getExpandRecordOptions: _propTypes.default.func
});
(0, _defineProperty2.default)(RecordCard, "defaultProps", {
  width: 568,
  height: 80,
  className: '',
  style: {}
});

var _default = (0, _create_data_container.default)(RecordCard, function (props) {
  var recordModel = props.record && props.record instanceof _record.default ? props.record : null;
  var parentTable;

  if (recordModel) {
    parentTable = recordModel.parentTable;
  } else if (props.fields && props.fields.length > 0) {
    parentTable = props.fields[0].parentTable;
  } else if (props.view) {
    parentTable = props.view.parentTable;
  }

  return [{
    watch: recordModel,
    key: 'primaryCellValue'
  }, props.view && {
    watch: recordModel,
    key: "colorInView:".concat(props.view.id)
  }, // It's safe to watch the record's parentTable since a record's
  // parent table never changes.
  {
    watch: parentTable,
    key: 'fields'
  }, {
    watch: props.view,
    key: 'visibleFields'
  }];
});

exports.default = _default;