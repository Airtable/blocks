"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

var globalConfigSyncedComponentHelpers = {
  globalConfigKeyPropType: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]).isRequired,

  useDefaultWatchesForSyncedComponent(globalConfigKey) {
    var _getSdk = (0, _get_sdk.default)(),
        globalConfig = _getSdk.globalConfig,
        base = _getSdk.base;

    (0, _use_watchable.default)(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
    (0, _use_watchable.default)(base, ['permissionLevel']);
  }

};
var _default = globalConfigSyncedComponentHelpers;
exports.default = _default;