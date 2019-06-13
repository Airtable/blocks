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

var _toggle = _interopRequireDefault(require("./toggle"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

/**
 * A toggleable switch for controlling boolean values, synced with {@link GlobalConfig}. Functionally analogous to a checkbox.
 *
 * @example
 * import {ToggleSynced, useWatchable} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function Block() {
 *     useWatchable(globalConfig, ['isEnabled']);
 *     return (
 *         <Toggle
 *             globalConfigKey="isEnabled"
 *             label={globalConfig.get('isEnabled') ? 'On' : 'Off'}
 *         />
 *     );
 * }
 */
var ToggleSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ToggleSynced, _React$Component);

  function ToggleSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ToggleSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ToggleSynced).call(this, props)); // TODO (stephen): use React.forwardRef

    _this._toggle = null;
    return _this;
  }

  (0, _createClass2.default)(ToggleSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._toggle, 'No toggle to focus');

      this._toggle.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._toggle, 'No toggle to blur');

      this._toggle.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._toggle, 'No toggle to click');

      this._toggle.click();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          globalConfigKey = _this$props.globalConfigKey,
          _onChange = _this$props.onChange,
          disabled = _this$props.disabled,
          label = _this$props.label,
          theme = _this$props.theme,
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
          return React.createElement(_toggle.default, {
            ref: el => this._toggle = el,
            value: value || false,
            onChange: newValue => {
              setValue(newValue);

              if (_onChange) {
                _onChange(newValue);
              }
            },
            disabled: disabled || !canSetValue,
            label: label,
            theme: theme,
            id: id,
            className: className,
            style: style,
            tabIndex: tabIndex,
            "aria-label": this.props['aria-label'],
            "aria-labelledby": this.props['aria-labelledby'],
            "aria-describedby": this.props['aria-describedby']
          });
        }
      });
    }
  }]);
  return ToggleSynced;
}(React.Component);

(0, _defineProperty2.default)(ToggleSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  label: _propTypes.default.node,
  theme: _propTypes.default.oneOf(Object.keys(_toggle.default.themes)),
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  'aria-label': _propTypes.default.string,
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});
var _default = ToggleSynced;
exports.default = _default;