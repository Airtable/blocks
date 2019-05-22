"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

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

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

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

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

const attachmentPreviewRenderer = window.__requirePrivateModuleFromAirtable('client_server_shared/read_mode_renderers/attachment_preview_renderer');

const keyCodeUtils = window.__requirePrivateModuleFromAirtable('client/mylib/key_code_utils');

const {
  FALLBACK_ROW_NAME_FOR_DISPLAY
} = window.__requirePrivateModuleFromAirtable('client_server_shared/client_server_shared_config_settings');

const CARD_PADDING = 12;
const styles = {
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
const CellValueAndFieldLabel = (0, _create_data_container.default)(({
  record,
  cellValue,
  field,
  width
}) => {
  return React.createElement("div", {
    className: "borderBoxSizing relative inline-block m0 pr1",
    style: {
      width,
      ...styles.cellValueAndFieldLabel
    }
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
}, props => [{
  watch: props.field,
  key: ['name', 'config']
}]);
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
const FormulaicFieldTypes = {
  [_field.FieldTypes.FORMULA]: true,
  [_field.FieldTypes.ROLLUP]: true,
  [_field.FieldTypes.LOOKUP]: true
};

const isFieldFormulaic = field => {
  return !!FormulaicFieldTypes[field.config.type];
};

const getFieldResultType = field => {
  if (field.config.type === _field.FieldTypes.COUNT) {
    return _field.FieldTypes.NUMBER;
  }

  if (isFieldFormulaic(field)) {
    (0, _invariant.default)(field.config.options, 'options');

    if (!field.config.options.resultConfig) {
      // Formula is misconfigured.
      return _field.FieldTypes.SINGLE_LINE_TEXT;
    } else {
      return field.config.options.resultConfig.type;
    }
  } else {
    return field.config.type;
  }
};
/** */


class RecordCard extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._onClick = (0, _bind.default)(_context = this._onClick).call(_context, this);

    this._validateProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._validateProps(nextProps);
  }

  _validateProps(props) {
    const {
      record,
      view,
      fields,
      attachmentCoverField
    } = props;

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
      for (const field of fields) {
        if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
          throw new Error('All fields must have the same parent table as record');
        }
      }
    }

    if (record && record instanceof _record.default && view && !view.isDeleted) {
      if (view.parentTable.id !== record.parentTable.id) {
        throw new Error('View must have the same parent table as record');
      }
    }
  }

  _onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else if (this.props.onClick === undefined) {
      // NOTE: `null` disables the default click behavior.
      const {
        record
      } = this.props;
      const recordModel = record && record instanceof _record.default ? record : null;

      if (recordModel) {
        if (keyCodeUtils.isCommandModifierKeyEvent(e) || e.shiftKey) {// No-op, let the <a> tag handle opening in new tab or window.
        } else {
          e.preventDefault();
          const opts = this.props.getExpandRecordOptions ? this.props.getExpandRecordOptions(recordModel) : {};
          (0, _expand_record.default)(recordModel, opts);
        }
      }
    }
  }

  _getAttachmentCover(fieldsToUse) {
    const attachmentField = this._getAttachmentField(fieldsToUse);

    return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
  }

  _getAttachmentField(fieldsToUse) {
    const {
      attachmentCoverField,
      fields
    } = this.props;

    if (attachmentCoverField && !attachmentCoverField.isDeleted && this._isAttachment(attachmentCoverField)) {
      return attachmentCoverField;
    } else if (attachmentCoverField === undefined && !fields) {
      // The attachment field in this case is either coming from the view
      // if there is a view, or from the table's arbitrary field ordering
      // if there is no view.
      // TODO: use the real cover field if the view is gallery or kanban instead of
      // the first attachment field
      const firstAttachmentFieldInView = (0, _find.default)(u).call(u, fieldsToUse, field => {
        return this._isAttachment(field);
      });

      if (firstAttachmentFieldInView === undefined) {
        return null;
      }

      return firstAttachmentFieldInView;
    } else {
      return null;
    }
  }

  _isAttachment(field) {
    return getFieldResultType(field) === _field.FieldTypes.MULTIPLE_ATTACHMENTS;
  }

  _getRawCellValue(field) {
    const {
      record
    } = this.props;

    if (record && record instanceof _record.default) {
      return record.__getRawCellValue(field.id);
    } else {
      let publicCellValue = record[field.id];

      _cell_value_utils.default.validatePublicCellValueForUpdate(publicCellValue, null, field);

      publicCellValue = _cell_value_utils.default.normalizePublicCellValueForUpdate(publicCellValue, field);
      return _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);
    }
  }

  _getFirstAttachmentInField(attachmentField) {
    let attachmentsInField;

    if (attachmentField.config.type === _field.FieldTypes.LOOKUP) {
      const rawCellValue = this._getRawCellValue(attachmentField); // eslint-disable-line flowtype/no-weak-types


      attachmentsInField = u.flattenDeep((0, _values.default)(u).call(u, rawCellValue ? rawCellValue.valuesByForeignRowId : {}));
    } else {
      attachmentsInField = this._getRawCellValue(attachmentField); // eslint-disable-line flowtype/no-weak-types
    }

    return attachmentsInField && attachmentsInField.length > 0 ? attachmentsInField[0] : null;
  }

  _getFields() {
    const {
      view,
      fields,
      record
    } = this.props;
    let fieldsToUse;

    if (fields) {
      fieldsToUse = (0, _filter.default)(fields).call(fields, field => !field.isDeleted);
    } else if (view && !view.isDeleted) {
      fieldsToUse = view.visibleFields;
    } else if (record && record instanceof _record.default && !record.isDeleted) {
      const parentTable = record.parentTable;
      fieldsToUse = parentTable.fields;
    } else {
      console.warn('RecordCard: no fields, view, or record, so rendering an empty card'); // eslint-disable-line no-console

      fieldsToUse = [];
    }

    return u.uniqBy(fieldsToUse, field => field.id);
  }

  _getPossibleFieldsForCard() {
    const fields = this._getFields(); // remove primary field if it exists


    return (0, _filter.default)(fields).call(fields, field => {
      return !field.isPrimaryField;
    });
  }

  _getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse) {
    const widthAndFieldIdArray = [];
    let runningWidth = 0;

    for (const field of fieldsToUse) {
      const desiredWidth = columnTypeProvider.getDesiredCellWidthForRowCard(field.__getRawType(), field.__getRawTypeOptions());

      if (runningWidth + desiredWidth < cellContainerWidth) {
        widthAndFieldIdArray.push({
          width: desiredWidth,
          fieldId: field.id
        });
        runningWidth += desiredWidth;
      } else {
        const minWidth = columnTypeProvider.getMinCellWidthForRowCard(field.__getRawType(), field.__getRawTypeOptions());

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

    if (runningWidth < cellContainerWidth && widthAndFieldIdArray.length > 0) {
      const lastWidthAndFieldId = widthAndFieldIdArray[widthAndFieldIdArray.length - 1];
      lastWidthAndFieldId.width += cellContainerWidth - runningWidth;
    }

    return widthAndFieldIdArray;
  }

  _getRecordModel() {
    const {
      record
    } = this.props;

    if (record && record instanceof _record.default) {
      return record;
    } else {
      return null;
    }
  }

  _renderCellsAndFieldLabels(attachmentSize, fieldsToUse) {
    const {
      record,
      width
    } = this.props;
    (0, _invariant.default)(typeof width === 'number', 'width in defaultProps');
    const cellContainerWidth = width - CARD_PADDING - attachmentSize;

    const widthAndFieldIdArray = this._getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse);

    const fieldsById = u.keyBy(fieldsToUse, o => o.id);
    return (0, _map.default)(widthAndFieldIdArray).call(widthAndFieldIdArray, widthAndFieldId => {
      const field = fieldsById[widthAndFieldId.fieldId];
      return React.createElement(CellValueAndFieldLabel, (0, _extends2.default)({
        key: field.id,
        field: field,
        width: widthAndFieldId.width
      }, record instanceof _record.default ? {
        record
      } : {
        cellValue: record[field.id]
      }));
    });
  }

  render() {
    const {
      record,
      view,
      width,
      height,
      onClick,
      onMouseEnter,
      onMouseLeave,
      className,
      style
    } = this.props;

    if (record && record instanceof _record.default && record.isDeleted) {
      return null;
    }

    const allFields = this._getFields();

    const fieldsToUse = this._getPossibleFieldsForCard();

    const attachmentObjIfAvailable = this._getAttachmentCover(fieldsToUse);

    const hasAttachment = !!attachmentObjIfAvailable;
    const hasOnClick = !!onClick || !!this._getRecordModel();
    const containerClasses = (0, _classnames.default)('white rounded relative block overflow-hidden', {
      'pointer cardBoxShadow': hasOnClick,
      stroked1: !hasOnClick
    }, className); // use height as size in order to get square attachment

    (0, _invariant.default)(typeof height === 'number', 'height in defaultProps');
    const attachmentSize = hasAttachment ? height : 0;
    let imageHtml = '';

    if (hasAttachment) {
      const attachmentField = this._getAttachmentField(fieldsToUse);

      (0, _invariant.default)(attachmentField, 'attachmentField must be present when we have an attachment');
      (0, _invariant.default)(attachmentObjIfAvailable, 'attachmentObjIfAvailable is defined if hasAttachment');
      const attachmentObj = attachmentObjIfAvailable; // eslint-disable-line flowtype/no-weak-types

      const userScopedAppInterface = attachmentField.parentTable.parentBase.__appInterface;
      imageHtml = attachmentPreviewRenderer.renderSquarePreview(attachmentObj, userScopedAppInterface, {
        extraClassString: 'absolute right-0 height-full overflow-hidden noevents',
        extraStyles: {
          'border-top-right-radius': 2,
          'border-bottom-right-radius': 2
        },
        size: attachmentSize
      });
    }

    const containerStyles = { ...style,
      width,
      height
    };
    let primaryValue;
    let isUnnamed;
    let primaryCellValueAsString;
    let recordUrl;
    let recordColorClass;

    if (record instanceof _record.default) {
      recordUrl = record.url;
      primaryCellValueAsString = record.primaryCellValueAsString;

      if (view) {
        recordColorClass = record.getColorInView(view);
      }
    } else {
      const primaryField = allFields.length > 0 ? allFields[0].parentTable.primaryField : null;
      const primaryCellValue = primaryField ? record[primaryField.id] : null;
      primaryCellValueAsString = primaryCellValue === null || primaryCellValue === undefined ? null : String(primaryCellValue);
    }

    if (u.isNullOrUndefinedOrEmpty(primaryCellValueAsString)) {
      primaryValue = FALLBACK_ROW_NAME_FOR_DISPLAY;
      isUnnamed = true;
    } else {
      primaryValue = primaryCellValueAsString;
      isUnnamed = false;
    }

    const primaryClasses = (0, _classnames.default)('strong relative cellValue mt0 flex items-center line-height-4', {
      unnamed: isUnnamed
    });
    const primaryStyles = {
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
      className: `flex-none pill mr-half ${recordColorClass}`,
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

}

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

var _default = (0, _create_data_container.default)(RecordCard, props => {
  const recordModel = props.record && props.record instanceof _record.default ? props.record : null;
  let parentTable;

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
    key: `colorInView:${props.view.id}`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9yZWNvcmRfY2FyZC5qcyJdLCJuYW1lcyI6WyJ1Iiwid2luZG93IiwiX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSIsImNvbHVtblR5cGVQcm92aWRlciIsImF0dGFjaG1lbnRQcmV2aWV3UmVuZGVyZXIiLCJrZXlDb2RlVXRpbHMiLCJGQUxMQkFDS19ST1dfTkFNRV9GT1JfRElTUExBWSIsIkNBUkRfUEFERElORyIsInN0eWxlcyIsImNlbGxWYWx1ZUFuZEZpZWxkTGFiZWwiLCJ2ZXJ0aWNhbEFsaWduIiwiZmllbGRMYWJlbCIsImxpbmVIZWlnaHQiLCJmb250U2l6ZSIsImNvbG9yIiwiY2VsbFZhbHVlIiwiQ2VsbFZhbHVlQW5kRmllbGRMYWJlbCIsInJlY29yZCIsImZpZWxkIiwid2lkdGgiLCJuYW1lIiwicHJvcHMiLCJ3YXRjaCIsImtleSIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImluc3RhbmNlT2YiLCJSZWNvcmRNb2RlbCIsImFueSIsIkZpZWxkTW9kZWwiLCJpc1JlcXVpcmVkIiwibnVtYmVyIiwiRm9ybXVsYWljRmllbGRUeXBlcyIsIkZpZWxkVHlwZXMiLCJGT1JNVUxBIiwiUk9MTFVQIiwiTE9PS1VQIiwiaXNGaWVsZEZvcm11bGFpYyIsImNvbmZpZyIsInR5cGUiLCJnZXRGaWVsZFJlc3VsdFR5cGUiLCJDT1VOVCIsIk5VTUJFUiIsIm9wdGlvbnMiLCJyZXN1bHRDb25maWciLCJTSU5HTEVfTElORV9URVhUIiwiUmVjb3JkQ2FyZCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJfb25DbGljayIsIl92YWxpZGF0ZVByb3BzIiwiVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJ2aWV3IiwiZmllbGRzIiwiYXR0YWNobWVudENvdmVyRmllbGQiLCJpc0RlbGV0ZWQiLCJFcnJvciIsInBhcmVudFRhYmxlIiwiaWQiLCJlIiwib25DbGljayIsInVuZGVmaW5lZCIsInJlY29yZE1vZGVsIiwiaXNDb21tYW5kTW9kaWZpZXJLZXlFdmVudCIsInNoaWZ0S2V5IiwicHJldmVudERlZmF1bHQiLCJvcHRzIiwiZ2V0RXhwYW5kUmVjb3JkT3B0aW9ucyIsIl9nZXRBdHRhY2htZW50Q292ZXIiLCJmaWVsZHNUb1VzZSIsImF0dGFjaG1lbnRGaWVsZCIsIl9nZXRBdHRhY2htZW50RmllbGQiLCJfZ2V0Rmlyc3RBdHRhY2htZW50SW5GaWVsZCIsIl9pc0F0dGFjaG1lbnQiLCJmaXJzdEF0dGFjaG1lbnRGaWVsZEluVmlldyIsIk1VTFRJUExFX0FUVEFDSE1FTlRTIiwiX2dldFJhd0NlbGxWYWx1ZSIsIl9fZ2V0UmF3Q2VsbFZhbHVlIiwicHVibGljQ2VsbFZhbHVlIiwiY2VsbFZhbHVlVXRpbHMiLCJ2YWxpZGF0ZVB1YmxpY0NlbGxWYWx1ZUZvclVwZGF0ZSIsIm5vcm1hbGl6ZVB1YmxpY0NlbGxWYWx1ZUZvclVwZGF0ZSIsInBhcnNlUHVibGljQXBpQ2VsbFZhbHVlIiwiYXR0YWNobWVudHNJbkZpZWxkIiwicmF3Q2VsbFZhbHVlIiwiZmxhdHRlbkRlZXAiLCJ2YWx1ZXNCeUZvcmVpZ25Sb3dJZCIsImxlbmd0aCIsIl9nZXRGaWVsZHMiLCJ2aXNpYmxlRmllbGRzIiwiY29uc29sZSIsIndhcm4iLCJ1bmlxQnkiLCJfZ2V0UG9zc2libGVGaWVsZHNGb3JDYXJkIiwiaXNQcmltYXJ5RmllbGQiLCJfZ2V0V2lkdGhBbmRGaWVsZElkQXJyYXkiLCJjZWxsQ29udGFpbmVyV2lkdGgiLCJ3aWR0aEFuZEZpZWxkSWRBcnJheSIsInJ1bm5pbmdXaWR0aCIsImRlc2lyZWRXaWR0aCIsImdldERlc2lyZWRDZWxsV2lkdGhGb3JSb3dDYXJkIiwiX19nZXRSYXdUeXBlIiwiX19nZXRSYXdUeXBlT3B0aW9ucyIsInB1c2giLCJmaWVsZElkIiwibWluV2lkdGgiLCJnZXRNaW5DZWxsV2lkdGhGb3JSb3dDYXJkIiwibGFzdFdpZHRoQW5kRmllbGRJZCIsIl9nZXRSZWNvcmRNb2RlbCIsIl9yZW5kZXJDZWxsc0FuZEZpZWxkTGFiZWxzIiwiYXR0YWNobWVudFNpemUiLCJmaWVsZHNCeUlkIiwia2V5QnkiLCJvIiwid2lkdGhBbmRGaWVsZElkIiwicmVuZGVyIiwiaGVpZ2h0Iiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJhbGxGaWVsZHMiLCJhdHRhY2htZW50T2JqSWZBdmFpbGFibGUiLCJoYXNBdHRhY2htZW50IiwiaGFzT25DbGljayIsImNvbnRhaW5lckNsYXNzZXMiLCJzdHJva2VkMSIsImltYWdlSHRtbCIsImF0dGFjaG1lbnRPYmoiLCJ1c2VyU2NvcGVkQXBwSW50ZXJmYWNlIiwicGFyZW50QmFzZSIsIl9fYXBwSW50ZXJmYWNlIiwicmVuZGVyU3F1YXJlUHJldmlldyIsImV4dHJhQ2xhc3NTdHJpbmciLCJleHRyYVN0eWxlcyIsInNpemUiLCJjb250YWluZXJTdHlsZXMiLCJwcmltYXJ5VmFsdWUiLCJpc1VubmFtZWQiLCJwcmltYXJ5Q2VsbFZhbHVlQXNTdHJpbmciLCJyZWNvcmRVcmwiLCJyZWNvcmRDb2xvckNsYXNzIiwidXJsIiwiZ2V0Q29sb3JJblZpZXciLCJwcmltYXJ5RmllbGQiLCJwcmltYXJ5Q2VsbFZhbHVlIiwiU3RyaW5nIiwiaXNOdWxsT3JVbmRlZmluZWRPckVtcHR5IiwicHJpbWFyeUNsYXNzZXMiLCJ1bm5hbWVkIiwicHJpbWFyeVN0eWxlcyIsInJpZ2h0IiwiYmFja2dyb3VuZCIsInBhZGRpbmciLCJtYXJnaW5Ub3AiLCJfX2h0bWwiLCJvbmVPZlR5cGUiLCJvYmplY3QiLCJhcnJheU9mIiwiVmlld01vZGVsIiwiZnVuYyIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTTtBQUFDQSxFQUFBQTtBQUFELElB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SUFBYztBQUFDaEMsSUFBQUEsS0FBSyxFQUFFMEMsV0FBUjtBQUFxQnpDLElBQUFBLEdBQUcsRUFBRyxlQUFjRixLQUFLLENBQUNpQyxJQUFOLENBQVdNLEVBQUc7QUFBdkQsR0FGWCxFQUlIO0FBQ0E7QUFDQTtBQUFDdEMsSUFBQUEsS0FBSyxFQUFFcUMsV0FBUjtBQUFxQnBDLElBQUFBLEdBQUcsRUFBRTtBQUExQixHQU5HLEVBT0g7QUFBQ0QsSUFBQUEsS0FBSyxFQUFFRCxLQUFLLENBQUNpQyxJQUFkO0FBQW9CL0IsSUFBQUEsR0FBRyxFQUFFO0FBQXpCLEdBUEcsQ0FBUDtBQVNILENBbkJjLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHt0eXBlIEF0dGFjaG1lbnREYXRhfSBmcm9tICcuLi90eXBlcy9hdHRhY2htZW50JztcbmltcG9ydCB7RmllbGRUeXBlc30gZnJvbSAnLi4vdHlwZXMvZmllbGQnO1xuaW1wb3J0IHt0eXBlIFJlY29yZERlZn0gZnJvbSAnLi4vdHlwZXMvcmVjb3JkJztcbmltcG9ydCBGaWVsZE1vZGVsIGZyb20gJy4uL21vZGVscy9maWVsZCc7XG5pbXBvcnQgUmVjb3JkTW9kZWwgZnJvbSAnLi4vbW9kZWxzL3JlY29yZCc7XG5pbXBvcnQgVmlld01vZGVsIGZyb20gJy4uL21vZGVscy92aWV3JztcbmltcG9ydCBjZWxsVmFsdWVVdGlscyBmcm9tICcuLi9tb2RlbHMvY2VsbF92YWx1ZV91dGlscyc7XG5pbXBvcnQgY3JlYXRlRGF0YUNvbnRhaW5lciBmcm9tICcuL2NyZWF0ZV9kYXRhX2NvbnRhaW5lcic7XG5pbXBvcnQgZXhwYW5kUmVjb3JkLCB7dHlwZSBFeHBhbmRSZWNvcmRPcHRzfSBmcm9tICcuL2V4cGFuZF9yZWNvcmQnO1xuaW1wb3J0IENlbGxSZW5kZXJlciBmcm9tICcuL2NlbGxfcmVuZGVyZXInO1xuXG5jb25zdCB7dX0gPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSgnY2xpZW50X3NlcnZlcl9zaGFyZWQvaHUnKTtcbmNvbnN0IGNvbHVtblR5cGVQcm92aWRlciA9IHdpbmRvdy5fX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlKFxuICAgICdjbGllbnRfc2VydmVyX3NoYXJlZC9jb2x1bW5fdHlwZXMvY29sdW1uX3R5cGVfcHJvdmlkZXInLFxuKTtcbmNvbnN0IGF0dGFjaG1lbnRQcmV2aWV3UmVuZGVyZXIgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvcmVhZF9tb2RlX3JlbmRlcmVycy9hdHRhY2htZW50X3ByZXZpZXdfcmVuZGVyZXInLFxuKTtcbmNvbnN0IGtleUNvZGVVdGlscyA9IHdpbmRvdy5fX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlKCdjbGllbnQvbXlsaWIva2V5X2NvZGVfdXRpbHMnKTtcbmNvbnN0IHtGQUxMQkFDS19ST1dfTkFNRV9GT1JfRElTUExBWX0gPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvY2xpZW50X3NlcnZlcl9zaGFyZWRfY29uZmlnX3NldHRpbmdzJyxcbik7XG5cbmNvbnN0IENBUkRfUEFERElORyA9IDEyO1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gICAgY2VsbFZhbHVlQW5kRmllbGRMYWJlbDoge1xuICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICB9LFxuICAgIGZpZWxkTGFiZWw6IHtcbiAgICAgICAgbGluZUhlaWdodDogJzEzcHgnLFxuICAgICAgICBmb250U2l6ZTogMTEsXG4gICAgICAgIGNvbG9yOiAnIzg5ODk4OScsXG4gICAgfSxcbiAgICBjZWxsVmFsdWU6IHtcbiAgICAgICAgbGluZUhlaWdodDogJzE2cHgnLFxuICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgfSxcbn07XG5cbnR5cGUgQ2VsbFZhbHVlQW5kRmllbGRMYWJlbFByb3BzID0ge3xcbiAgICByZWNvcmQ6IFJlY29yZE1vZGVsIHwgbnVsbCxcbiAgICBjZWxsVmFsdWU6IG1peGVkLFxuICAgIGZpZWxkOiBGaWVsZE1vZGVsLFxuICAgIHdpZHRoOiBudW1iZXIsXG58fTtcblxuY29uc3QgQ2VsbFZhbHVlQW5kRmllbGRMYWJlbCA9IGNyZWF0ZURhdGFDb250YWluZXIoXG4gICAgKHtyZWNvcmQsIGNlbGxWYWx1ZSwgZmllbGQsIHdpZHRofTogQ2VsbFZhbHVlQW5kRmllbGRMYWJlbFByb3BzKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyQm94U2l6aW5nIHJlbGF0aXZlIGlubGluZS1ibG9jayBtMCBwcjFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMuY2VsbFZhbHVlQW5kRmllbGRMYWJlbCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dE92ZXJmbG93RWxsaXBzaXMgdXBwZXJjYXNlIHNtYWxsIGFwcEZvbnRXZWlnaHRSZWd1bGFyXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5maWVsZExhYmVsfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2ZpZWxkLm5hbWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPENlbGxSZW5kZXJlclxuICAgICAgICAgICAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbFZhbHVlPXtjZWxsVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkPXtmaWVsZH1cbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkV3JhcD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlY29yZENhcmRDZWxsVmFsdWUgYmxvY2sgdGV4dE92ZXJmbG93RWxsaXBzaXNcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLmNlbGxWYWx1ZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfSxcbiAgICBwcm9wcyA9PiBbe3dhdGNoOiBwcm9wcy5maWVsZCwga2V5OiBbJ25hbWUnLCAnY29uZmlnJ119XSxcbik7XG5cbkNlbGxWYWx1ZUFuZEZpZWxkTGFiZWwucHJvcFR5cGVzID0ge1xuICAgIHJlY29yZDogUHJvcFR5cGVzLmluc3RhbmNlT2YoUmVjb3JkTW9kZWwpLFxuXG4gICAgLy8gTk9URTogdGhpcyBjdXJyZW50bHkgd2lsbCBub3Qgd29yayBmb3IgbGlua2VkIHJlY29yZCBmaWVsZHMsIHNpbmNlIENlbGxSZW5kZXJlclxuICAgIC8vIGNhbm5vdCBjdXJyZW50bHkgaGFuZGxlIGFsbCBjZWxsIHR5cGVzLlxuICAgIC8vIFRPRE8oamIpOiBtYWtlIHRoZSBjb25zdHJhaW50cyBmb3IgcmVuZGVyaW5nIGNlbGwgdmFsdWVzIGxlc3Mgc3RyaWN0IHRoYW4gdGhlXG4gICAgLy8gY29uc3RyYWludHMgd2UgcHV0IG9uIHVwZGF0aW5nIGNlbGwgdmFsdWVzLlxuICAgIGNlbGxWYWx1ZTogUHJvcFR5cGVzLmFueSxcbiAgICBmaWVsZDogUHJvcFR5cGVzLmluc3RhbmNlT2YoRmllbGRNb2RlbCkuaXNSZXF1aXJlZCxcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxufTtcblxudHlwZSBSZWNvcmRDYXJkUHJvcHMgPSB7XG4gICAgcmVjb3JkOiBSZWNvcmRNb2RlbCB8IFJlY29yZERlZixcbiAgICBmaWVsZHM/OiBBcnJheTxGaWVsZE1vZGVsPixcbiAgICB2aWV3PzogVmlld01vZGVsLFxuICAgIGF0dGFjaG1lbnRDb3ZlckZpZWxkPzogRmllbGRNb2RlbCxcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBoZWlnaHQ/OiBudW1iZXIsXG4gICAgb25DbGljaz86IEZ1bmN0aW9uLFxuICAgIGdldEV4cGFuZFJlY29yZE9wdGlvbnM/OiBSZWNvcmRNb2RlbCA9PiBFeHBhbmRSZWNvcmRPcHRzLFxuICAgIG9uTW91c2VFbnRlcj86IG1peGVkLFxuICAgIG9uTW91c2VMZWF2ZT86IG1peGVkLFxuICAgIGNsYXNzTmFtZT86IHN0cmluZyxcbiAgICBzdHlsZT86IE9iamVjdCxcbn07XG5cbi8vIFRPRE8oamIpOiBtb3ZlIHRoaXMgc3R1ZmYgaW50byB0aGUgZmllbGQgbW9kZWwgd2hlbiB3ZSBkZWNpZGUgb24gYW4gYXBpIGZvciBpdC5cbmNvbnN0IEZvcm11bGFpY0ZpZWxkVHlwZXMgPSB7XG4gICAgW0ZpZWxkVHlwZXMuRk9STVVMQV06IHRydWUsXG4gICAgW0ZpZWxkVHlwZXMuUk9MTFVQXTogdHJ1ZSxcbiAgICBbRmllbGRUeXBlcy5MT09LVVBdOiB0cnVlLFxufTtcbmNvbnN0IGlzRmllbGRGb3JtdWxhaWMgPSAoZmllbGQ6IEZpZWxkTW9kZWwpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISFGb3JtdWxhaWNGaWVsZFR5cGVzW2ZpZWxkLmNvbmZpZy50eXBlXTtcbn07XG5jb25zdCBnZXRGaWVsZFJlc3VsdFR5cGUgPSAoZmllbGQ6IEZpZWxkTW9kZWwpOiBzdHJpbmcgPT4ge1xuICAgIGlmIChmaWVsZC5jb25maWcudHlwZSA9PT0gRmllbGRUeXBlcy5DT1VOVCkge1xuICAgICAgICByZXR1cm4gRmllbGRUeXBlcy5OVU1CRVI7XG4gICAgfVxuICAgIGlmIChpc0ZpZWxkRm9ybXVsYWljKGZpZWxkKSkge1xuICAgICAgICBpbnZhcmlhbnQoZmllbGQuY29uZmlnLm9wdGlvbnMsICdvcHRpb25zJyk7XG4gICAgICAgIGlmICghZmllbGQuY29uZmlnLm9wdGlvbnMucmVzdWx0Q29uZmlnKSB7XG4gICAgICAgICAgICAvLyBGb3JtdWxhIGlzIG1pc2NvbmZpZ3VyZWQuXG4gICAgICAgICAgICByZXR1cm4gRmllbGRUeXBlcy5TSU5HTEVfTElORV9URVhUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLmNvbmZpZy5vcHRpb25zLnJlc3VsdENvbmZpZy50eXBlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLmNvbmZpZy50eXBlO1xuICAgIH1cbn07XG5cbi8qKiAqL1xuY2xhc3MgUmVjb3JkQ2FyZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxSZWNvcmRDYXJkUHJvcHM+IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgICAvLyBSZWNvcmQgY2FuIGVpdGhlciBiZSBhIHJlY29yZCBtb2RlbCBvciBhIHJlY29yZCBkZWYgKGNlbGxWYWx1ZXNCeUZpZWxkSWQpXG4gICAgICAgIHJlY29yZDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmluc3RhbmNlT2YoUmVjb3JkTW9kZWwpLCBQcm9wVHlwZXMub2JqZWN0XSksXG5cbiAgICAgICAgLy8gU2hvdWxkIHByb3ZpZGUgb25lIG9mIGZpZWxkcyBhbmQgdmlld1xuICAgICAgICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5pbnN0YW5jZU9mKEZpZWxkTW9kZWwpLmlzUmVxdWlyZWQpLFxuICAgICAgICB2aWV3OiBQcm9wVHlwZXMuaW5zdGFuY2VPZihWaWV3TW9kZWwpLFxuXG4gICAgICAgIC8vIFRoaXMgY29tcG9uZW50IHdpbGwgYWx3YXlzIHJlc3BlY3QgYXR0YWNobWVudENvdmVyRmllbGQgaWYgb25lIGlzIHBhc3NlZCBpbi5cbiAgICAgICAgLy8gUGFzcyBhIG51bGwgdmFsdWUgdG8gZXhwbGljaXRseSBpbmRpY2F0ZSB0aGF0IGFuIGF0dGFjaG1lbnQgc2hvdWxkIG5vdCBiZVxuICAgICAgICAvLyBzaG93bi4gSWYgYXR0YWNobWVudENvdmVyRmllbGQgaXMgdW5kZWZpbmVkLCBpdCB3aWxsIGZhbGwgYmFjayB0byB1c2luZyB0aGVcbiAgICAgICAgLy8gZmlyc3QgYXR0YWNobWVudCBpbiB0aGUgdmlldyBwcm92aWRlZCAoaWYgYSB2aWV3IGlzIHByb3ZpZGVkKS5cbiAgICAgICAgYXR0YWNobWVudENvdmVyRmllbGQ6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZpZWxkTW9kZWwpLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Nb3VzZUVudGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Nb3VzZUxlYXZlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgLy8gVE9ETzogYWRkIGFsbCBvdGhlciBtb3VzZSBldmVudHM6IGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvZXZlbnRzLmh0bWwjbW91c2UtZXZlbnRzXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGdldEV4cGFuZFJlY29yZE9wdGlvbnM6IFByb3BUeXBlcy5mdW5jLFxuICAgIH07XG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgd2lkdGg6IDU2OCxcbiAgICAgICAgaGVpZ2h0OiA4MCxcbiAgICAgICAgY2xhc3NOYW1lOiAnJyxcbiAgICAgICAgc3R5bGU6IHt9LFxuICAgIH07XG5cbiAgICBfb25DbGljazogKGU6IFN5bnRoZXRpY01vdXNlRXZlbnQ8PikgPT4gdm9pZDtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogUmVjb3JkQ2FyZFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVByb3BzKHByb3BzKTtcbiAgICB9XG4gICAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBSZWNvcmRDYXJkUHJvcHMpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVQcm9wcyhuZXh0UHJvcHMpO1xuICAgIH1cbiAgICBfdmFsaWRhdGVQcm9wcyhwcm9wczogUmVjb3JkQ2FyZFByb3BzKSB7XG4gICAgICAgIGNvbnN0IHtyZWNvcmQsIHZpZXcsIGZpZWxkcywgYXR0YWNobWVudENvdmVyRmllbGR9ID0gcHJvcHM7XG5cbiAgICAgICAgaWYgKHJlY29yZCAmJiByZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCAmJiByZWNvcmQuaXNEZWxldGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlY29yZCBpcyBkZWxldGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlY29yZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgcmVjb3JkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZCBpbnN0YW5jZW9mIFJlY29yZE1vZGVsICYmIGF0dGFjaG1lbnRDb3ZlckZpZWxkKSB7XG4gICAgICAgICAgICBpZiAoYXR0YWNobWVudENvdmVyRmllbGQucGFyZW50VGFibGUuaWQgIT09IHJlY29yZC5wYXJlbnRUYWJsZS5pZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXR0YWNobWVudCBjb3ZlciBmaWVsZCBtdXN0IGhhdmUgdGhlIHNhbWUgcGFyZW50IHRhYmxlIGFzIHJlY29yZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlY29yZCAmJiByZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCAmJiBmaWVsZHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWVsZC5pc0RlbGV0ZWQgJiYgZmllbGQucGFyZW50VGFibGUuaWQgIT09IHJlY29yZC5wYXJlbnRUYWJsZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsbCBmaWVsZHMgbXVzdCBoYXZlIHRoZSBzYW1lIHBhcmVudCB0YWJsZSBhcyByZWNvcmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZCBpbnN0YW5jZW9mIFJlY29yZE1vZGVsICYmIHZpZXcgJiYgIXZpZXcuaXNEZWxldGVkKSB7XG4gICAgICAgICAgICBpZiAodmlldy5wYXJlbnRUYWJsZS5pZCAhPT0gcmVjb3JkLnBhcmVudFRhYmxlLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWaWV3IG11c3QgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgdGFibGUgYXMgcmVjb3JkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX29uQ2xpY2soZTogU3ludGhldGljTW91c2VFdmVudDw+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DbGljayhlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLm9uQ2xpY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gTk9URTogYG51bGxgIGRpc2FibGVzIHRoZSBkZWZhdWx0IGNsaWNrIGJlaGF2aW9yLlxuXG4gICAgICAgICAgICBjb25zdCB7cmVjb3JkfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRNb2RlbCA9IHJlY29yZCAmJiByZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCA/IHJlY29yZCA6IG51bGw7XG4gICAgICAgICAgICBpZiAocmVjb3JkTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Q29kZVV0aWxzLmlzQ29tbWFuZE1vZGlmaWVyS2V5RXZlbnQoZSkgfHwgZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOby1vcCwgbGV0IHRoZSA8YT4gdGFnIGhhbmRsZSBvcGVuaW5nIGluIG5ldyB0YWIgb3Igd2luZG93LlxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMucHJvcHMuZ2V0RXhwYW5kUmVjb3JkT3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnByb3BzLmdldEV4cGFuZFJlY29yZE9wdGlvbnMocmVjb3JkTW9kZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHt9O1xuICAgICAgICAgICAgICAgICAgICBleHBhbmRSZWNvcmQocmVjb3JkTW9kZWwsIG9wdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfZ2V0QXR0YWNobWVudENvdmVyKGZpZWxkc1RvVXNlOiBBcnJheTxGaWVsZE1vZGVsPik6IE9iamVjdCB8IG51bGwge1xuICAgICAgICBjb25zdCBhdHRhY2htZW50RmllbGQgPSB0aGlzLl9nZXRBdHRhY2htZW50RmllbGQoZmllbGRzVG9Vc2UpO1xuICAgICAgICByZXR1cm4gYXR0YWNobWVudEZpZWxkID8gdGhpcy5fZ2V0Rmlyc3RBdHRhY2htZW50SW5GaWVsZChhdHRhY2htZW50RmllbGQpIDogbnVsbDtcbiAgICB9XG4gICAgX2dldEF0dGFjaG1lbnRGaWVsZChmaWVsZHNUb1VzZTogQXJyYXk8RmllbGRNb2RlbD4pOiBGaWVsZE1vZGVsIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHthdHRhY2htZW50Q292ZXJGaWVsZCwgZmllbGRzfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYXR0YWNobWVudENvdmVyRmllbGQgJiZcbiAgICAgICAgICAgICFhdHRhY2htZW50Q292ZXJGaWVsZC5pc0RlbGV0ZWQgJiZcbiAgICAgICAgICAgIHRoaXMuX2lzQXR0YWNobWVudChhdHRhY2htZW50Q292ZXJGaWVsZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gYXR0YWNobWVudENvdmVyRmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0YWNobWVudENvdmVyRmllbGQgPT09IHVuZGVmaW5lZCAmJiAhZmllbGRzKSB7XG4gICAgICAgICAgICAvLyBUaGUgYXR0YWNobWVudCBmaWVsZCBpbiB0aGlzIGNhc2UgaXMgZWl0aGVyIGNvbWluZyBmcm9tIHRoZSB2aWV3XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHZpZXcsIG9yIGZyb20gdGhlIHRhYmxlJ3MgYXJiaXRyYXJ5IGZpZWxkIG9yZGVyaW5nXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB2aWV3LlxuICAgICAgICAgICAgLy8gVE9ETzogdXNlIHRoZSByZWFsIGNvdmVyIGZpZWxkIGlmIHRoZSB2aWV3IGlzIGdhbGxlcnkgb3Iga2FuYmFuIGluc3RlYWQgb2ZcbiAgICAgICAgICAgIC8vIHRoZSBmaXJzdCBhdHRhY2htZW50IGZpZWxkXG4gICAgICAgICAgICBjb25zdCBmaXJzdEF0dGFjaG1lbnRGaWVsZEluVmlldyA9IHUuZmluZChmaWVsZHNUb1VzZSwgZmllbGQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0F0dGFjaG1lbnQoZmllbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZmlyc3RBdHRhY2htZW50RmllbGRJblZpZXcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpcnN0QXR0YWNobWVudEZpZWxkSW5WaWV3O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2lzQXR0YWNobWVudChmaWVsZDogRmllbGRNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZ2V0RmllbGRSZXN1bHRUeXBlKGZpZWxkKSA9PT0gRmllbGRUeXBlcy5NVUxUSVBMRV9BVFRBQ0hNRU5UUztcbiAgICB9XG4gICAgX2dldFJhd0NlbGxWYWx1ZShmaWVsZDogRmllbGRNb2RlbCk6IG1peGVkIHtcbiAgICAgICAgY29uc3Qge3JlY29yZH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZCBpbnN0YW5jZW9mIFJlY29yZE1vZGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkLl9fZ2V0UmF3Q2VsbFZhbHVlKGZpZWxkLmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwdWJsaWNDZWxsVmFsdWUgPSByZWNvcmRbZmllbGQuaWRdO1xuICAgICAgICAgICAgY2VsbFZhbHVlVXRpbHMudmFsaWRhdGVQdWJsaWNDZWxsVmFsdWVGb3JVcGRhdGUocHVibGljQ2VsbFZhbHVlLCBudWxsLCBmaWVsZCk7XG4gICAgICAgICAgICBwdWJsaWNDZWxsVmFsdWUgPSBjZWxsVmFsdWVVdGlscy5ub3JtYWxpemVQdWJsaWNDZWxsVmFsdWVGb3JVcGRhdGUoXG4gICAgICAgICAgICAgICAgcHVibGljQ2VsbFZhbHVlLFxuICAgICAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBjZWxsVmFsdWVVdGlscy5wYXJzZVB1YmxpY0FwaUNlbGxWYWx1ZShwdWJsaWNDZWxsVmFsdWUsIGZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZ2V0Rmlyc3RBdHRhY2htZW50SW5GaWVsZChhdHRhY2htZW50RmllbGQ6IEZpZWxkTW9kZWwpOiBPYmplY3QgfCBudWxsIHtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnRzSW5GaWVsZDtcbiAgICAgICAgaWYgKGF0dGFjaG1lbnRGaWVsZC5jb25maWcudHlwZSA9PT0gRmllbGRUeXBlcy5MT09LVVApIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd0NlbGxWYWx1ZSA9ICgodGhpcy5fZ2V0UmF3Q2VsbFZhbHVlKGF0dGFjaG1lbnRGaWVsZCk6IGFueSk6IE9iamVjdCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZmxvd3R5cGUvbm8td2Vhay10eXBlc1xuICAgICAgICAgICAgYXR0YWNobWVudHNJbkZpZWxkID0gdS5mbGF0dGVuRGVlcChcbiAgICAgICAgICAgICAgICB1LnZhbHVlcyhyYXdDZWxsVmFsdWUgPyByYXdDZWxsVmFsdWUudmFsdWVzQnlGb3JlaWduUm93SWQgOiB7fSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0YWNobWVudHNJbkZpZWxkID0gKCh0aGlzLl9nZXRSYXdDZWxsVmFsdWUoYXR0YWNobWVudEZpZWxkKTogYW55KTogQXJyYXk8T2JqZWN0Pik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZmxvd3R5cGUvbm8td2Vhay10eXBlc1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRhY2htZW50c0luRmllbGQgJiYgYXR0YWNobWVudHNJbkZpZWxkLmxlbmd0aCA+IDAgPyBhdHRhY2htZW50c0luRmllbGRbMF0gOiBudWxsO1xuICAgIH1cbiAgICBfZ2V0RmllbGRzKCk6IEFycmF5PEZpZWxkTW9kZWw+IHtcbiAgICAgICAgY29uc3Qge3ZpZXcsIGZpZWxkcywgcmVjb3JkfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgbGV0IGZpZWxkc1RvVXNlO1xuICAgICAgICBpZiAoZmllbGRzKSB7XG4gICAgICAgICAgICBmaWVsZHNUb1VzZSA9IGZpZWxkcy5maWx0ZXIoZmllbGQgPT4gIWZpZWxkLmlzRGVsZXRlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodmlldyAmJiAhdmlldy5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIGZpZWxkc1RvVXNlID0gdmlldy52aXNpYmxlRmllbGRzO1xuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZCAmJiByZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCAmJiAhcmVjb3JkLmlzRGVsZXRlZCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50VGFibGUgPSByZWNvcmQucGFyZW50VGFibGU7XG4gICAgICAgICAgICBmaWVsZHNUb1VzZSA9IHBhcmVudFRhYmxlLmZpZWxkcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVjb3JkQ2FyZDogbm8gZmllbGRzLCB2aWV3LCBvciByZWNvcmQsIHNvIHJlbmRlcmluZyBhbiBlbXB0eSBjYXJkJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgZmllbGRzVG9Vc2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdS51bmlxQnkoZmllbGRzVG9Vc2UsIGZpZWxkID0+IGZpZWxkLmlkKTtcbiAgICB9XG4gICAgX2dldFBvc3NpYmxlRmllbGRzRm9yQ2FyZCgpOiBBcnJheTxGaWVsZE1vZGVsPiB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IHRoaXMuX2dldEZpZWxkcygpO1xuXG4gICAgICAgIC8vIHJlbW92ZSBwcmltYXJ5IGZpZWxkIGlmIGl0IGV4aXN0c1xuICAgICAgICByZXR1cm4gZmllbGRzLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIWZpZWxkLmlzUHJpbWFyeUZpZWxkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2dldFdpZHRoQW5kRmllbGRJZEFycmF5KGNlbGxDb250YWluZXJXaWR0aDogbnVtYmVyLCBmaWVsZHNUb1VzZTogQXJyYXk8RmllbGRNb2RlbD4pIHtcbiAgICAgICAgY29uc3Qgd2lkdGhBbmRGaWVsZElkQXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IHJ1bm5pbmdXaWR0aCA9IDA7XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHNUb1VzZSkge1xuICAgICAgICAgICAgY29uc3QgZGVzaXJlZFdpZHRoID0gY29sdW1uVHlwZVByb3ZpZGVyLmdldERlc2lyZWRDZWxsV2lkdGhGb3JSb3dDYXJkKFxuICAgICAgICAgICAgICAgIGZpZWxkLl9fZ2V0UmF3VHlwZSgpLFxuICAgICAgICAgICAgICAgIGZpZWxkLl9fZ2V0UmF3VHlwZU9wdGlvbnMoKSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChydW5uaW5nV2lkdGggKyBkZXNpcmVkV2lkdGggPCBjZWxsQ29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICB3aWR0aEFuZEZpZWxkSWRBcnJheS5wdXNoKHt3aWR0aDogZGVzaXJlZFdpZHRoLCBmaWVsZElkOiBmaWVsZC5pZH0pO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdXaWR0aCArPSBkZXNpcmVkV2lkdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pbldpZHRoID0gY29sdW1uVHlwZVByb3ZpZGVyLmdldE1pbkNlbGxXaWR0aEZvclJvd0NhcmQoXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLl9fZ2V0UmF3VHlwZSgpLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5fX2dldFJhd1R5cGVPcHRpb25zKCksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAocnVubmluZ1dpZHRoICsgbWluV2lkdGggPCBjZWxsQ29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGhBbmRGaWVsZElkQXJyYXkucHVzaCh7d2lkdGg6IG1pbldpZHRoLCBmaWVsZElkOiBmaWVsZC5pZH0pO1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nV2lkdGggKz0gbWluV2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJ1bm5pbmdXaWR0aCA8IGNlbGxDb250YWluZXJXaWR0aCAmJiB3aWR0aEFuZEZpZWxkSWRBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0V2lkdGhBbmRGaWVsZElkID0gd2lkdGhBbmRGaWVsZElkQXJyYXlbd2lkdGhBbmRGaWVsZElkQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBsYXN0V2lkdGhBbmRGaWVsZElkLndpZHRoICs9IGNlbGxDb250YWluZXJXaWR0aCAtIHJ1bm5pbmdXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aWR0aEFuZEZpZWxkSWRBcnJheTtcbiAgICB9XG4gICAgX2dldFJlY29yZE1vZGVsKCk6IFJlY29yZE1vZGVsIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHtyZWNvcmR9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgaWYgKHJlY29yZCAmJiByZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9yZW5kZXJDZWxsc0FuZEZpZWxkTGFiZWxzKFxuICAgICAgICBhdHRhY2htZW50U2l6ZTogbnVtYmVyLFxuICAgICAgICBmaWVsZHNUb1VzZTogQXJyYXk8RmllbGRNb2RlbD4sXG4gICAgKTogQXJyYXk8UmVhY3QuRWxlbWVudDx0eXBlb2YgQ2VsbFZhbHVlQW5kRmllbGRMYWJlbD4+IHtcbiAgICAgICAgY29uc3Qge3JlY29yZCwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgaW52YXJpYW50KHR5cGVvZiB3aWR0aCA9PT0gJ251bWJlcicsICd3aWR0aCBpbiBkZWZhdWx0UHJvcHMnKTtcblxuICAgICAgICBjb25zdCBjZWxsQ29udGFpbmVyV2lkdGggPSB3aWR0aCAtIENBUkRfUEFERElORyAtIGF0dGFjaG1lbnRTaXplO1xuICAgICAgICBjb25zdCB3aWR0aEFuZEZpZWxkSWRBcnJheSA9IHRoaXMuX2dldFdpZHRoQW5kRmllbGRJZEFycmF5KGNlbGxDb250YWluZXJXaWR0aCwgZmllbGRzVG9Vc2UpO1xuICAgICAgICBjb25zdCBmaWVsZHNCeUlkID0gdS5rZXlCeShmaWVsZHNUb1VzZSwgbyA9PiBvLmlkKTtcblxuICAgICAgICByZXR1cm4gd2lkdGhBbmRGaWVsZElkQXJyYXkubWFwKHdpZHRoQW5kRmllbGRJZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkc0J5SWRbd2lkdGhBbmRGaWVsZElkLmZpZWxkSWRdO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8Q2VsbFZhbHVlQW5kRmllbGRMYWJlbFxuICAgICAgICAgICAgICAgICAgICBrZXk9e2ZpZWxkLmlkfVxuICAgICAgICAgICAgICAgICAgICBmaWVsZD17ZmllbGR9XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aEFuZEZpZWxkSWQud2lkdGh9XG4gICAgICAgICAgICAgICAgICAgIHsuLi4ocmVjb3JkIGluc3RhbmNlb2YgUmVjb3JkTW9kZWwgPyB7cmVjb3JkfSA6IHtjZWxsVmFsdWU6IHJlY29yZFtmaWVsZC5pZF19KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgdmlldyxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgb25DbGljayxcbiAgICAgICAgICAgIG9uTW91c2VFbnRlcixcbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgIHN0eWxlLFxuICAgICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZCBpbnN0YW5jZW9mIFJlY29yZE1vZGVsICYmIHJlY29yZC5pc0RlbGV0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWxsRmllbGRzID0gdGhpcy5fZ2V0RmllbGRzKCk7XG4gICAgICAgIGNvbnN0IGZpZWxkc1RvVXNlID0gdGhpcy5fZ2V0UG9zc2libGVGaWVsZHNGb3JDYXJkKCk7XG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRPYmpJZkF2YWlsYWJsZSA9IHRoaXMuX2dldEF0dGFjaG1lbnRDb3ZlcihmaWVsZHNUb1VzZSk7XG4gICAgICAgIGNvbnN0IGhhc0F0dGFjaG1lbnQgPSAhIWF0dGFjaG1lbnRPYmpJZkF2YWlsYWJsZTtcblxuICAgICAgICBjb25zdCBoYXNPbkNsaWNrID0gISFvbkNsaWNrIHx8ICEhdGhpcy5fZ2V0UmVjb3JkTW9kZWwoKTtcblxuICAgICAgICBjb25zdCBjb250YWluZXJDbGFzc2VzID0gY2xhc3NOYW1lcyhcbiAgICAgICAgICAgICd3aGl0ZSByb3VuZGVkIHJlbGF0aXZlIGJsb2NrIG92ZXJmbG93LWhpZGRlbicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3BvaW50ZXIgY2FyZEJveFNoYWRvdyc6IGhhc09uQ2xpY2ssXG4gICAgICAgICAgICAgICAgc3Ryb2tlZDE6ICFoYXNPbkNsaWNrLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyB1c2UgaGVpZ2h0IGFzIHNpemUgaW4gb3JkZXIgdG8gZ2V0IHNxdWFyZSBhdHRhY2htZW50XG4gICAgICAgIGludmFyaWFudCh0eXBlb2YgaGVpZ2h0ID09PSAnbnVtYmVyJywgJ2hlaWdodCBpbiBkZWZhdWx0UHJvcHMnKTtcbiAgICAgICAgY29uc3QgYXR0YWNobWVudFNpemUgPSBoYXNBdHRhY2htZW50ID8gaGVpZ2h0IDogMDtcbiAgICAgICAgbGV0IGltYWdlSHRtbCA9ICcnO1xuICAgICAgICBpZiAoaGFzQXR0YWNobWVudCkge1xuICAgICAgICAgICAgY29uc3QgYXR0YWNobWVudEZpZWxkID0gdGhpcy5fZ2V0QXR0YWNobWVudEZpZWxkKGZpZWxkc1RvVXNlKTtcbiAgICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50RmllbGQsXG4gICAgICAgICAgICAgICAgJ2F0dGFjaG1lbnRGaWVsZCBtdXN0IGJlIHByZXNlbnQgd2hlbiB3ZSBoYXZlIGFuIGF0dGFjaG1lbnQnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50T2JqSWZBdmFpbGFibGUsXG4gICAgICAgICAgICAgICAgJ2F0dGFjaG1lbnRPYmpJZkF2YWlsYWJsZSBpcyBkZWZpbmVkIGlmIGhhc0F0dGFjaG1lbnQnLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgYXR0YWNobWVudE9iajogQXR0YWNobWVudERhdGEgPSAoYXR0YWNobWVudE9iaklmQXZhaWxhYmxlOiBhbnkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGZsb3d0eXBlL25vLXdlYWstdHlwZXNcbiAgICAgICAgICAgIGNvbnN0IHVzZXJTY29wZWRBcHBJbnRlcmZhY2UgPSBhdHRhY2htZW50RmllbGQucGFyZW50VGFibGUucGFyZW50QmFzZS5fX2FwcEludGVyZmFjZTtcbiAgICAgICAgICAgIGltYWdlSHRtbCA9IGF0dGFjaG1lbnRQcmV2aWV3UmVuZGVyZXIucmVuZGVyU3F1YXJlUHJldmlldyhcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50T2JqLFxuICAgICAgICAgICAgICAgIHVzZXJTY29wZWRBcHBJbnRlcmZhY2UsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBleHRyYUNsYXNzU3RyaW5nOiAnYWJzb2x1dGUgcmlnaHQtMCBoZWlnaHQtZnVsbCBvdmVyZmxvdy1oaWRkZW4gbm9ldmVudHMnLFxuICAgICAgICAgICAgICAgICAgICBleHRyYVN0eWxlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci10b3AtcmlnaHQtcmFkaXVzJzogMixcbiAgICAgICAgICAgICAgICAgICAgICAgICdib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cyc6IDIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IGF0dGFjaG1lbnRTaXplLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyU3R5bGVzID0ge1xuICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcHJpbWFyeVZhbHVlO1xuICAgICAgICBsZXQgaXNVbm5hbWVkO1xuXG4gICAgICAgIGxldCBwcmltYXJ5Q2VsbFZhbHVlQXNTdHJpbmc7XG4gICAgICAgIGxldCByZWNvcmRVcmw7XG4gICAgICAgIGxldCByZWNvcmRDb2xvckNsYXNzO1xuICAgICAgICBpZiAocmVjb3JkIGluc3RhbmNlb2YgUmVjb3JkTW9kZWwpIHtcbiAgICAgICAgICAgIHJlY29yZFVybCA9IHJlY29yZC51cmw7XG4gICAgICAgICAgICBwcmltYXJ5Q2VsbFZhbHVlQXNTdHJpbmcgPSByZWNvcmQucHJpbWFyeUNlbGxWYWx1ZUFzU3RyaW5nO1xuICAgICAgICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgICAgICAgICByZWNvcmRDb2xvckNsYXNzID0gcmVjb3JkLmdldENvbG9ySW5WaWV3KHZpZXcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcHJpbWFyeUZpZWxkID1cbiAgICAgICAgICAgICAgICBhbGxGaWVsZHMubGVuZ3RoID4gMCA/IGFsbEZpZWxkc1swXS5wYXJlbnRUYWJsZS5wcmltYXJ5RmllbGQgOiBudWxsO1xuICAgICAgICAgICAgY29uc3QgcHJpbWFyeUNlbGxWYWx1ZSA9IHByaW1hcnlGaWVsZCA/IHJlY29yZFtwcmltYXJ5RmllbGQuaWRdIDogbnVsbDtcbiAgICAgICAgICAgIHByaW1hcnlDZWxsVmFsdWVBc1N0cmluZyA9XG4gICAgICAgICAgICAgICAgcHJpbWFyeUNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBwcmltYXJ5Q2VsbFZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICAgICAgICAgIDogU3RyaW5nKHByaW1hcnlDZWxsVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1LmlzTnVsbE9yVW5kZWZpbmVkT3JFbXB0eShwcmltYXJ5Q2VsbFZhbHVlQXNTdHJpbmcpKSB7XG4gICAgICAgICAgICBwcmltYXJ5VmFsdWUgPSBGQUxMQkFDS19ST1dfTkFNRV9GT1JfRElTUExBWTtcbiAgICAgICAgICAgIGlzVW5uYW1lZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmltYXJ5VmFsdWUgPSBwcmltYXJ5Q2VsbFZhbHVlQXNTdHJpbmc7XG4gICAgICAgICAgICBpc1VubmFtZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmltYXJ5Q2xhc3NlcyA9IGNsYXNzTmFtZXMoXG4gICAgICAgICAgICAnc3Ryb25nIHJlbGF0aXZlIGNlbGxWYWx1ZSBtdDAgZmxleCBpdGVtcy1jZW50ZXIgbGluZS1oZWlnaHQtNCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdW5uYW1lZDogaXNVbm5hbWVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeVN0eWxlcyA9IHtcbiAgICAgICAgICAgIGhlaWdodDogMTgsXG4gICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgaHJlZj17b25DbGljayA9PT0gdW5kZWZpbmVkICYmIHJlY29yZFVybCA/IHJlY29yZFVybCA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NvbnRhaW5lckNsYXNzZXN9XG4gICAgICAgICAgICAgICAgc3R5bGU9e2NvbnRhaW5lclN0eWxlc31cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrfVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17b25Nb3VzZUVudGVyfVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17b25Nb3VzZUxlYXZlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTAgYm90dG9tLTAgbGVmdC0wIGFwcEZvbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogYXR0YWNobWVudFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogQ0FSRF9QQURESU5HLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3ByaW1hcnlDbGFzc2VzfSBzdHlsZT17cHJpbWFyeVN0eWxlc30+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cmVjb3JkQ29sb3JDbGFzcyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BmbGV4LW5vbmUgcGlsbCBtci1oYWxmICR7cmVjb3JkQ29sb3JDbGFzc31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDIwfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1hdXRvIHRydW5jYXRlXCI+e3ByaW1hcnlWYWx1ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGFwcEZvbnRDb2xvckxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuX3JlbmRlckNlbGxzQW5kRmllbGRMYWJlbHMoYXR0YWNobWVudFNpemUsIGZpZWxkc1RvVXNlKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogaW1hZ2VIdG1sfX0gLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZURhdGFDb250YWluZXIoUmVjb3JkQ2FyZCwgKHByb3BzOiBSZWNvcmRDYXJkUHJvcHMpID0+IHtcbiAgICBjb25zdCByZWNvcmRNb2RlbCA9IHByb3BzLnJlY29yZCAmJiBwcm9wcy5yZWNvcmQgaW5zdGFuY2VvZiBSZWNvcmRNb2RlbCA/IHByb3BzLnJlY29yZCA6IG51bGw7XG4gICAgbGV0IHBhcmVudFRhYmxlO1xuICAgIGlmIChyZWNvcmRNb2RlbCkge1xuICAgICAgICBwYXJlbnRUYWJsZSA9IHJlY29yZE1vZGVsLnBhcmVudFRhYmxlO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuZmllbGRzICYmIHByb3BzLmZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBhcmVudFRhYmxlID0gcHJvcHMuZmllbGRzWzBdLnBhcmVudFRhYmxlO1xuICAgIH0gZWxzZSBpZiAocHJvcHMudmlldykge1xuICAgICAgICBwYXJlbnRUYWJsZSA9IHByb3BzLnZpZXcucGFyZW50VGFibGU7XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAgIHt3YXRjaDogcmVjb3JkTW9kZWwsIGtleTogJ3ByaW1hcnlDZWxsVmFsdWUnfSxcbiAgICAgICAgcHJvcHMudmlldyAmJiB7d2F0Y2g6IHJlY29yZE1vZGVsLCBrZXk6IGBjb2xvckluVmlldzoke3Byb3BzLnZpZXcuaWR9YH0sXG5cbiAgICAgICAgLy8gSXQncyBzYWZlIHRvIHdhdGNoIHRoZSByZWNvcmQncyBwYXJlbnRUYWJsZSBzaW5jZSBhIHJlY29yZCdzXG4gICAgICAgIC8vIHBhcmVudCB0YWJsZSBuZXZlciBjaGFuZ2VzLlxuICAgICAgICB7d2F0Y2g6IHBhcmVudFRhYmxlLCBrZXk6ICdmaWVsZHMnfSxcbiAgICAgICAge3dhdGNoOiBwcm9wcy52aWV3LCBrZXk6ICd2aXNpYmxlRmllbGRzJ30sXG4gICAgXTtcbn0pO1xuIl19