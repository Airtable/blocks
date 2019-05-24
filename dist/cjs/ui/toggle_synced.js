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

var _private_utils = require("../private_utils");

var _toggle = _interopRequireDefault(require("./toggle"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

/** */
class ToggleSynced extends React.Component {
  constructor(props) {
    super(props);
    this._toggle = null;
  }

  focus() {
    (0, _invariant.default)(this._toggle, 'No toggle to focus');

    this._toggle.focus();
  }

  blur() {
    (0, _invariant.default)(this._toggle, 'No toggle to blur');

    this._toggle.blur();
  }

  click() {
    (0, _invariant.default)(this._toggle, 'No toggle to click');

    this._toggle.click();
  }

  render() {
    var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: (_ref) => {
        var value = _ref.value,
            canSetValue = _ref.canSetValue,
            setValue = _ref.setValue;
        return React.createElement(_toggle.default, (0, _extends2.default)({
          ref: el => this._toggle = el,
          value: value || false,
          disabled: this.props.disabled || !canSetValue,
          onChange: newValue => {
            setValue(newValue);

            if (this.props.onChange) {
              this.props.onChange(newValue);
            }
          }
        }, restOfProps));
      }
    });
  }

}

(0, _defineProperty2.default)(ToggleSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  label: _propTypes.default.node,
  theme: _propTypes.default.oneOf((0, _private_utils.values)(_toggle.default.themes)),
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.number
});
var _default = ToggleSynced;
exports.default = _default;