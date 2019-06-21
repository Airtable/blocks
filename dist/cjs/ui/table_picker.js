"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _table = _interopRequireDefault(require("../models/table"));

var _model_picker_select = _interopRequireDefault(require("./model_picker_select"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * Dropdown menu component for selecting tables.
 *
 * @example
 * import {TablePicker, useBase, useRecords} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     useBase();
 *     const [table, setTable] = useState(null);
 *     const queryResult = table ? table.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *
 *     const summaryText = table ? `${table.name} has ${records.length} record(s).` : 'No table selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePicker
 *                     table={table}
 *                     onChange={newTable => setTable(newTable)}
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *         </Fragment>
 *     );
 * }
 */
var TablePicker =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(TablePicker, _React$Component);

  function TablePicker(props) {
    var _this;

    (0, _classCallCheck2.default)(this, TablePicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TablePicker).call(this, props)); // TODO (stephen): use React.forwardRef

    _this._select = null;
    _this._onChange = _this._onChange.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(TablePicker, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._select, 'No select to focus');

      this._select.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._select, 'No select to blur');

      this._select.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._select, 'No select to click');

      this._select.click();
    }
  }, {
    key: "_onChange",
    value: function _onChange(tableId) {
      var onChange = this.props.onChange;

      if (onChange) {
        var table = tableId ? (0, _get_sdk.default)().base.getTableByIdIfExists(tableId) : null;
        onChange(table);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          table = _this$props.table,
          shouldAllowPickingNone = _this$props.shouldAllowPickingNone,
          disabled = _this$props.disabled,
          placeholder = _this$props.placeholder,
          id = _this$props.id,
          className = _this$props.className,
          style = _this$props.style,
          tabIndex = _this$props.tabIndex;
      var selectedTable = table && !table.isDeleted ? table : null;
      var placeholderToUse;

      if (placeholder === undefined) {
        // Let's set a good default value for the placeholder, depending
        // on the shouldAllowPickingNone flag.
        placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a table...';
      } else {
        placeholderToUse = placeholder;
      }

      return React.createElement(_model_picker_select.default, {
        ref: el => this._select = el,
        models: (0, _get_sdk.default)().base.tables,
        selectedModelId: selectedTable ? selectedTable.id : null,
        modelKeysToWatch: ['name'],
        onChange: this._onChange,
        disabled: disabled,
        shouldAllowPickingNone: shouldAllowPickingNone,
        placeholder: placeholderToUse,
        id: id,
        className: className,
        style: style,
        tabIndex: tabIndex,
        "aria-labelledby": this.props['aria-labelledby'],
        "aria-describedby": this.props['aria-describedby']
      });
    }
  }]);
  return TablePicker;
}(React.Component);

(0, _defineProperty2.default)(TablePicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  shouldAllowPickingNone: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  onChange: _propTypes.default.func,
  placeholder: _propTypes.default.string,
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOf([_propTypes.default.number, _propTypes.default.string]),
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});

var _default = (0, _with_hooks.default)(TablePicker, () => {
  (0, _use_watchable.default)((0, _get_sdk.default)().base, ['tables']);
  return {};
});

exports.default = _default;