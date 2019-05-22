"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _record = _interopRequireDefault(require("../models/record"));

var _field = _interopRequireDefault(require("../models/field"));

var _cell_value_utils = _interopRequireDefault(require("../models/cell_value_utils"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

const CellReadModeContext = window.__requirePrivateModuleFromAirtable('client_server_shared/cell_context/cell_read_mode_context');

const CellContextTypes = window.__requirePrivateModuleFromAirtable('client_server_shared/cell_context/cell_context_types');

/** */
class CellRenderer extends React.Component {
  constructor(props) {
    super(props);

    this._validateProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._validateProps(nextProps);
  }

  _validateProps(props) {
    if (props.record && !props.record.isDeleted && !props.field.isDeleted && props.record.parentTable.id !== props.field.parentTable.id) {
      throw new Error('CellRenderer: record and field must have the same parent table');
    }
  }

  render() {
    const {
      record,
      cellValue,
      field,
      shouldWrap
    } = this.props;

    if (field.isDeleted) {
      return null;
    }

    let publicCellValue;

    if (record) {
      if (cellValue !== undefined) {
        // eslint-disable-next-line
        console.warn('CellRenderer was given both record and cellValue, choosing to render record value');
      }

      if (record.isDeleted) {
        return null;
      }

      publicCellValue = record.getCellValue(field.id);
    } else {
      // NOTE: this will not work if you want to render a cell value for
      // foreign record, single/multi select, or single/multi collaborator
      // fields and the cell value is not *currently* valid for that field.
      // i.e. if you want to render a foreign record for a record that
      // does not yet exist, this will throw.
      // TODO: handle "preview" cell values that are not yet valid in the given field
      // but that *could* be.
      _cell_value_utils.default.validatePublicCellValueForUpdate(cellValue, null, field);

      publicCellValue = _cell_value_utils.default.normalizePublicCellValueForUpdate(cellValue, field);
    }

    const privateCellValue = _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);

    const cellContextType = shouldWrap ? CellContextTypes.BLOCKS_READ_WRAP : CellContextTypes.BLOCKS_READ_NO_WRAP;
    const rawHtml = columnTypeProvider.renderReadModeCellValue(privateCellValue, field.__getRawType(), field.__getRawTypeOptions(), field.parentTable.parentBase.__appInterface, CellReadModeContext.forContextType(cellContextType));
    const attributes = {
      'data-columntype': field.__getRawType()
    };

    const typeOptions = field.__getRawTypeOptions();

    if (typeOptions && typeOptions.resultType) {
      attributes['data-formatting'] = typeOptions.resultType;
    }

    return React.createElement("div", (0, _extends2.default)({
      style: this.props.style
    }, attributes, {
      className: `cell read ${this.props.className || ''}`,
      dangerouslySetInnerHTML: {
        __html: rawHtml
      }
    }));
  }

}

(0, _defineProperty2.default)(CellRenderer, "propTypes", {
  // NOTE: must pass in one of record or cellValue. It will default to using
  // the record if one is passed in, and cellValue otherwise.
  record: _propTypes.default.instanceOf(_record.default),
  cellValue: _propTypes.default.any,
  field: _propTypes.default.instanceOf(_field.default).isRequired,
  shouldWrap: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object
});
(0, _defineProperty2.default)(CellRenderer, "defaultProps", {
  shouldWrap: true
});

var _default = (0, _create_data_container.default)(CellRenderer, props => {
  return [{
    watch: props.record,
    key: `cellValueInField:${props.field.id}`
  }, {
    watch: props.field,
    key: 'config'
  }];
});

exports.default = _default;