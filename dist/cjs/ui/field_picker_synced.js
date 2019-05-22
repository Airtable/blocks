"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _field = require("../types/field");

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _field_picker = _interopRequireDefault(require("./field_picker"));

var _synced = _interopRequireDefault(require("./synced"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
class FieldPickerSynced extends React.Component {
  constructor(props) {
    super(props);
    this._fieldPicker = null;
  }

  focus() {
    (0, _invariant.default)(this._fieldPicker, 'No field picker to focus');

    this._fieldPicker.focus();
  }

  blur() {
    (0, _invariant.default)(this._fieldPicker, 'No field picker to blur');

    this._fieldPicker.blur();
  }

  click() {
    (0, _invariant.default)(this._fieldPicker, 'No field picker to click');

    this._fieldPicker.click();
  }

  _getFieldFromGlobalConfigValue(fieldId) {
    const {
      table
    } = this.props;

    if (!table || table.isDeleted) {
      return null;
    }

    return typeof fieldId === 'string' && table ? table.getFieldById(fieldId) : null;
  }

  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_field_picker.default, (0, _extends2.default)({
        ref: el => this._fieldPicker = el,
        disabled: this.props.disabled || !canSetValue,
        field: this._getFieldFromGlobalConfigValue(value),
        onChange: field => {
          setValue(field ? field.id : null);

          if (this.props.onChange) {
            this.props.onChange(field);
          }
        }
      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(FieldPickerSynced, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to FieldPicker:
  shouldAllowPickingNone: _propTypes.default.bool,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _values.default)(u).call(u, _field.FieldTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});

var _default = (0, _create_data_container.default)(FieldPickerSynced, props => {
  return [{
    watch: props.table,
    key: 'fields'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;