"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

/** */
var RadioSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RadioSynced, _React$Component);

  function RadioSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, RadioSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RadioSynced).call(this, props));
    _this._input = null;
    return _this;
  }

  (0, _createClass2.default)(RadioSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._input, 'No input to focus');

      this._input.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._input, 'No input to blur');

      this._input.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._input, 'No input to click');

      this._input.click();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _getSdk = (0, _get_sdk.default)(),
          globalConfig = _getSdk.globalConfig;

      var globalConfigPathAsString = globalConfig.__formatKeyAsPath(this.props.globalConfigKey).join('~');

      var name = "RadioSynced::".concat(globalConfigPathAsString);
      return React.createElement(_synced.default, {
        globalConfigKey: this.props.globalConfigKey,
        render: function render(_ref) {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement("input", {
            ref: function ref(el) {
              return _this2._input = el;
            },
            type: "radio",
            name: name,
            value: _this2.props.value,
            style: _this2.props.style,
            className: _this2.props.className,
            disabled: _this2.props.disabled || !canSetValue,
            onChange: function onChange(e) {
              // <input type="radio"> is a bit weird. You put a bunch of them
              // on the page with the same `name` attribute, then whichever
              // gets checked will trigger its onChange callback with its `value` attribute.
              setValue(_this2.props.value);
            },
            checked: value === _this2.props.value
          });
        }
      });
    }
  }]);
  return RadioSynced;
}(React.Component);

(0, _defineProperty2.default)(RadioSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  value: _propTypes.default.string.isRequired,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});
var _default = RadioSynced;
exports.default = _default;