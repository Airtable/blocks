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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

/** @private */
var Synced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Synced, _React$Component);

  function Synced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Synced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Synced).call(this, props));
    _this._setValue = _this._setValue.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Synced, [{
    key: "_setValue",
    value: function _setValue(newValue) {
      (0, _get_sdk.default)().globalConfig.set(this.props.globalConfigKey, newValue);
    }
  }, {
    key: "render",
    value: function render() {
      var _getSdk = (0, _get_sdk.default)(),
          globalConfig = _getSdk.globalConfig;

      var value = globalConfig.get(this.props.globalConfigKey);
      var canSetValue = globalConfig.canSet(this.props.globalConfigKey);
      return this.props.render({
        value,
        canSetValue,
        setValue: this._setValue
      });
    }
  }]);
  return Synced;
}(React.Component);

(0, _defineProperty2.default)(Synced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  render: _propTypes.default.func.isRequired
});

var _default = (0, _with_hooks.default)(Synced, props => {
  _global_config_synced_component_helpers.default.useDefaultWatchesForSyncedComponent(props.globalConfigKey);

  return {};
});

exports.default = _default;