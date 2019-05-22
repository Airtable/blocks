"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

/** */
class Synced extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._setValue = (0, _bind.default)(_context = this._setValue).call(_context, this);
  }

  _setValue(newValue) {
    (0, _get_sdk.default)().globalConfig.set(this.props.globalConfigKey, newValue);
  }

  render() {
    const {
      globalConfig
    } = (0, _get_sdk.default)();
    const value = globalConfig.get(this.props.globalConfigKey);
    const canSetValue = globalConfig.canSet(this.props.globalConfigKey);
    return this.props.render({
      value,
      canSetValue,
      setValue: this._setValue
    });
  }

}

(0, _defineProperty2.default)(Synced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  render: _propTypes.default.func.isRequired
});

var _default = (0, _create_data_container.default)(Synced, props => {
  return _global_config_synced_component_helpers.default.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});

exports.default = _default;