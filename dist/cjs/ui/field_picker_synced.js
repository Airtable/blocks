"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _field = require("../types/field");

var _private_utils = require("../private_utils");

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _field_picker = _interopRequireDefault(require("./field_picker"));

var _synced = _interopRequireDefault(require("./synced"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

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
    var table = this.props.table;

    if (!table || table.isDeleted) {
      return null;
    }

    return typeof fieldId === 'string' && table ? table.getFieldById(fieldId) : null;
  }

  render() {
    var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: (_ref) => {
        var value = _ref.value,
            canSetValue = _ref.canSetValue,
            setValue = _ref.setValue;
        return React.createElement(_field_picker.default, (0, _extends2.default)({
          ref: el => this._fieldPicker = el,
          disabled: this.props.disabled || !canSetValue,
          field: this._getFieldFromGlobalConfigValue(value),
          onChange: field => {
            setValue(field ? field.id : null);

            if (this.props.onChange) {
              this.props.onChange(field);
            }
          }
        }, restOfProps));
      }
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
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _private_utils.values)(_field.FieldTypes))),
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