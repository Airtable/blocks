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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _table_picker = _interopRequireDefault(require("./table_picker"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * Dropdown menu component for selecting tables, synced with {@link GlobalConfig}.
 *
 * @example
 * import {TablePickerSynced, useBase, useRecords, useWatchable} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React, {Fragment} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const tableId = globalConfig.get('tableId');
 *     const table = base.getTableByIdIfExists(tableId);
 *     const queryResult = table ? table.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *     useWatchable(globalConfig, ['tableId']);
 *
 *     const summaryText = table ? `${table.name} has ${records.length} record(s).` : 'No table selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePickerSynced
 *                     globalConfigKey="tableId"
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *         </Fragment>
 *     );
 * }
 */
var TablePickerSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(TablePickerSynced, _React$Component);

  function TablePickerSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, TablePickerSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TablePickerSynced).call(this, props)); // TODO (stephen): use React.forwardRef

    _this._tablePicker = null;
    return _this;
  }

  (0, _createClass2.default)(TablePickerSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to focus');

      this._tablePicker.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to blur');

      this._tablePicker.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to click');

      this._tablePicker.click();
    }
  }, {
    key: "_getTableFromGlobalConfigValue",
    value: function _getTableFromGlobalConfigValue(tableId) {
      return typeof tableId === 'string' ? (0, _get_sdk.default)().base.getTableByIdIfExists(tableId) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          globalConfigKey = _this$props.globalConfigKey,
          _onChange = _this$props.onChange,
          disabled = _this$props.disabled,
          shouldAllowPickingNone = _this$props.shouldAllowPickingNone,
          placeholder = _this$props.placeholder,
          id = _this$props.id,
          className = _this$props.className,
          style = _this$props.style,
          tabIndex = _this$props.tabIndex;
      return React.createElement(_synced.default, {
        globalConfigKey: globalConfigKey,
        render: (_ref) => {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_table_picker.default, {
            ref: el => this._tablePicker = el,
            table: this._getTableFromGlobalConfigValue(value),
            onChange: table => {
              setValue(table ? table.id : null);

              if (_onChange) {
                _onChange(table);
              }
            },
            disabled: disabled || !canSetValue,
            shouldAllowPickingNone: shouldAllowPickingNone,
            placeholder: placeholder,
            id: id,
            className: className,
            style: style,
            tabIndex: tabIndex,
            "aria-labelledby": this.props['aria-labelledby'],
            "aria-describedby": this.props['aria-describedby']
          });
        }
      });
    }
  }]);
  return TablePickerSynced;
}(React.Component);

(0, _defineProperty2.default)(TablePickerSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to TablePicker.
  shouldAllowPickingNone: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOf([_propTypes.default.number, _propTypes.default.string]),
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});

var _default = (0, _with_hooks.default)(TablePickerSynced, () => {
  (0, _use_watchable.default)((0, _get_sdk.default)().base, ['tables']);
  return {};
});

exports.default = _default;