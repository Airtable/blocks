"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

/** */
class RadioSynced extends React.Component {
  constructor(props) {
    super(props);
    this._input = null;
  }

  focus() {
    (0, _invariant.default)(this._input, 'No input to focus');

    this._input.focus();
  }

  blur() {
    (0, _invariant.default)(this._input, 'No input to blur');

    this._input.blur();
  }

  click() {
    (0, _invariant.default)(this._input, 'No input to click');

    this._input.click();
  }

  render() {
    var _getSdk = (0, _get_sdk.default)(),
        globalConfig = _getSdk.globalConfig;

    var globalConfigPathAsString = globalConfig.__formatKeyAsPath(this.props.globalConfigKey).join('~');

    var name = "RadioSynced::".concat(globalConfigPathAsString);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: (_ref) => {
        var value = _ref.value,
            canSetValue = _ref.canSetValue,
            setValue = _ref.setValue;
        return React.createElement("input", {
          ref: el => this._input = el,
          type: "radio",
          name: name,
          value: this.props.value,
          style: this.props.style,
          className: this.props.className,
          disabled: this.props.disabled || !canSetValue,
          onChange: e => {
            // <input type="radio"> is a bit weird. You put a bunch of them
            // on the page with the same `name` attribute, then whichever
            // gets checked will trigger its onChange callback with its `value` attribute.
            setValue(this.props.value);
          },
          checked: value === this.props.value
        });
      }
    });
  }

}

(0, _defineProperty2.default)(RadioSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  value: _propTypes.default.string.isRequired,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});
var _default = RadioSynced;
exports.default = _default;