"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _input = _interopRequireDefault(require("./input"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

/** */
class InputSynced extends React.Component {
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

  select() {
    (0, _invariant.default)(this._input, 'No input to select');

    this._input.select();
  }

  render() {
    var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: (_ref) => {
        var value = _ref.value,
            canSetValue = _ref.canSetValue,
            setValue = _ref.setValue;
        var isCheckbox = this.props.type === 'checkbox'; // If an input gets null or undefined for value, React treats it as uncontrolled
        // and will throw warnings when it becomes controlled.

        var isNullOrUndefined = value === null || value === undefined;
        var valueObj = isCheckbox ? {
          checked: isNullOrUndefined ? false : value
        } : {
          value: isNullOrUndefined ? '' : value
        };
        return React.createElement(_input.default, (0, _extends2.default)({
          ref: el => this._input = el,
          disabled: this.props.disabled || !canSetValue,
          onChange: e => {
            setValue(isCheckbox ? e.target.checked : e.target.value);

            if (this.props.onChange) {
              this.props.onChange(e);
            }
          },
          spellCheck: this.props.spellCheck
        }, valueObj, restOfProps));
      }
    });
  }

}

(0, _defineProperty2.default)(InputSynced, "defaultProps", {
  type: 'text',
  spellCheck: true
});
(0, _defineProperty2.default)(InputSynced, "propTypes", {
  type: _propTypes.default.oneOf(Object.keys(_input.default.validTypesSet)),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  placeholder: _propTypes.default.string,
  onChange: _propTypes.default.func,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  spellCheck: _propTypes.default.bool
});
var _default = InputSynced;
exports.default = _default;