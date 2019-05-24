"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _record = _interopRequireDefault(require("../models/record"));

var _field = _interopRequireDefault(require("../models/field"));

var _cell_value_utils = _interopRequireDefault(require("../models/cell_value_utils"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

var CellReadModeContext = window.__requirePrivateModuleFromAirtable('client_server_shared/cell_context/cell_read_mode_context');

var CellContextTypes = window.__requirePrivateModuleFromAirtable('client_server_shared/cell_context/cell_context_types');

/** */
var CellRenderer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(CellRenderer, _React$Component);

  function CellRenderer(props) {
    var _this;

    (0, _classCallCheck2.default)(this, CellRenderer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CellRenderer).call(this, props));

    _this._validateProps(props);

    return _this;
  }

  (0, _createClass2.default)(CellRenderer, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      this._validateProps(nextProps);
    }
  }, {
    key: "_validateProps",
    value: function _validateProps(props) {
      if (props.record && !props.record.isDeleted && !props.field.isDeleted && props.record.parentTable.id !== props.field.parentTable.id) {
        throw new Error('CellRenderer: record and field must have the same parent table');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          record = _this$props.record,
          cellValue = _this$props.cellValue,
          field = _this$props.field,
          shouldWrap = _this$props.shouldWrap;

      if (field.isDeleted) {
        return null;
      }

      var publicCellValue;

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

      var privateCellValue = _cell_value_utils.default.parsePublicApiCellValue(publicCellValue, field);

      var cellContextType = shouldWrap ? CellContextTypes.BLOCKS_READ_WRAP : CellContextTypes.BLOCKS_READ_NO_WRAP;
      var rawHtml = columnTypeProvider.renderReadModeCellValue(privateCellValue, field.__getRawType(), field.__getRawTypeOptions(), field.parentTable.parentBase.__appInterface, CellReadModeContext.forContextType(cellContextType));
      var attributes = {
        'data-columntype': field.__getRawType()
      };

      var typeOptions = field.__getRawTypeOptions();

      if (typeOptions && typeOptions.resultType) {
        attributes['data-formatting'] = typeOptions.resultType;
      }

      return React.createElement("div", (0, _extends2.default)({
        style: this.props.style
      }, attributes, {
        className: "cell read ".concat(this.props.className || ''),
        dangerouslySetInnerHTML: {
          __html: rawHtml
        }
      }));
    }
  }]);
  return CellRenderer;
}(React.Component);

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
    key: "cellValueInField:".concat(props.field.id)
  }, {
    watch: props.field,
    key: 'config'
  }];
});

exports.default = _default;