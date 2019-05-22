"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _table = _interopRequireDefault(require("../models/table"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _model_picker_select = _interopRequireDefault(require("./model_picker_select"));

/** */
class TablePicker extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._select = null;
    this._onChange = (0, _bind.default)(_context = this._onChange).call(_context, this);
  }

  focus() {
    (0, _invariant.default)(this._select, 'No select to focus');

    this._select.focus();
  }

  blur() {
    (0, _invariant.default)(this._select, 'No select to blur');

    this._select.blur();
  }

  click() {
    (0, _invariant.default)(this._select, 'No select to click');

    this._select.click();
  }

  _onChange(tableId) {
    const {
      onChange
    } = this.props;

    if (onChange) {
      const table = tableId ? (0, _get_sdk.default)().base.getTableById(tableId) : null;
      onChange(table);
    }
  }

  render() {
    const {
      table,
      shouldAllowPickingNone,
      style,
      className,
      disabled,
      placeholder,
      // Filter these out so they're not
      // included in restOfProps:
      onChange,
      // eslint-disable-line no-unused-vars
      ...restOfProps
    } = this.props;
    const selectedTable = table && !table.isDeleted ? table : null;
    let placeholderToUse;

    if (placeholder === undefined) {
      // Let's set a good default value for the placeholder, depending
      // on the shouldAllowPickingNone flag.
      placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a table...';
    } else {
      placeholderToUse = placeholder;
    }

    return React.createElement(_model_picker_select.default, (0, _extends2.default)({
      ref: el => this._select = el,
      models: (0, _get_sdk.default)().base.tables,
      selectedModelId: selectedTable ? selectedTable.id : null,
      onChange: this._onChange,
      style: style,
      className: className,
      disabled: disabled,
      placeholder: placeholderToUse,
      shouldAllowPickingNone: shouldAllowPickingNone,
      modelKeysToWatch: ['name']
    }, restOfProps));
  }

}

(0, _defineProperty2.default)(TablePicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  shouldAllowPickingNone: _propTypes.default.bool,
  onChange: _propTypes.default.func,
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});

var _default = (0, _create_data_container.default)(TablePicker, props => {
  return [{
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;