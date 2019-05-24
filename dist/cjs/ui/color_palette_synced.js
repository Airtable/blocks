"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _color_palette = _interopRequireDefault(require("./color_palette"));

var _synced = _interopRequireDefault(require("./synced"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

/** */
var ColorPaletteSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ColorPaletteSynced, _React$Component);

  function ColorPaletteSynced() {
    (0, _classCallCheck2.default)(this, ColorPaletteSynced);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ColorPaletteSynced).apply(this, arguments));
  }

  (0, _createClass2.default)(ColorPaletteSynced, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          globalConfigKey = _this$props.globalConfigKey,
          disabled = _this$props.disabled;
      var restOfProps = u.omit(this.props, ['globalConfigKey', 'disabled', 'onChange']);
      return React.createElement(_synced.default, {
        globalConfigKey: globalConfigKey,
        render: (_ref) => {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_color_palette.default, (0, _extends2.default)({
            color: value,
            onChange: newValue => {
              setValue(newValue);

              if (this.props.onChange) {
                this.props.onChange(newValue);
              }
            },
            disabled: disabled || !canSetValue
          }, restOfProps));
        }
      });
    }
  }]);
  return ColorPaletteSynced;
}(React.Component);

(0, _defineProperty2.default)(ColorPaletteSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  disabled: _propTypes.default.bool,
  onChange: _propTypes.default.func
});
var _default = ColorPaletteSynced;
exports.default = _default;