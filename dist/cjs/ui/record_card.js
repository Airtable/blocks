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