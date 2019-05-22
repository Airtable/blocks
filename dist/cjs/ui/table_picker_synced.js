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

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _table_picker = _interopRequireDefault(require("./table_picker"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** */
class TablePickerSynced extends React.Component {
  constructor(props) {
    super(props);
    this._tablePicker = null;
  }

  focus() {
    (0, _invariant.default)(this._tablePicker, 'No table picker to focus');

    this._tablePicker.focus();
  }

  blur() {
    (0, _invariant.default)(this._tablePicker, 'No table picker to blur');

    this._tablePicker.blur();
  }

  click() {
    (0, _invariant.default)(this._tablePicker, 'No table picker to click');

    this._tablePicker.click();
  }

  _getTableFromGlobalConfigValue(tableId) {
    return typeof tableId === 'string' ? (0, _get_sdk.default)().base.getTableById(tableId) : null;
  }

  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_table_picker.default, (0, _extends2.default)({
        ref: el => this._tablePicker = el,
        table: this._getTableFromGlobalConfigValue(value),
        disabled: this.props.disabled || !canSetValue,
        onChange: table => {
          setValue(table ? table.id : null);

          if (this.props.onChange) {
            this.props.onChange(table);
          }
        }
      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(TablePickerSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to TablePicker.
  shouldAllowPickingNone: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});

var _default = (0, _create_data_container.default)(TablePickerSynced, props => {
  return [{
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;