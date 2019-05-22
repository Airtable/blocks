"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

/** */
var Synced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Synced, _React$Component);

  function Synced(props) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, Synced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Synced).call(this, props));
    _this._setValue = (0, _bind.default)(_context = _this._setValue).call(_context, (0, _assertThisInitialized2.default)(_this));
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
        value: value,
        canSetValue: canSetValue,
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

var _default = (0, _create_data_container.default)(Synced, function (props) {
  return _global_config_synced_component_helpers.default.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});

exports.default = _default;