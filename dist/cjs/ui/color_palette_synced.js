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

var _color_palette = _interopRequireDefault(require("./color_palette"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** */
class ColorPaletteSynced extends React.Component {
  render() {
    const {
      globalConfigKey,
      disabled
    } = this.props;
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'disabled', 'onChange']);
    return React.createElement(_synced.default, {
      globalConfigKey: globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_color_palette.default, (0, _extends2.default)({
        color: value,
        onChange: newValue => {
          setValue(newValue);

          if (this.props.onChange) {
            this.props.onChange(newValue);
          }
        },
        disabled: disabled || !canSetValue
      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(ColorPaletteSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  disabled: _propTypes.default.bool,
  onChange: _propTypes.default.func
});
var _default = ColorPaletteSynced;
exports.default = _default;