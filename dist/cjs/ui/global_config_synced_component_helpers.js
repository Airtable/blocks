"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

const globalConfigSyncedComponentHelpers = {
  globalConfigKeyPropType: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]).isRequired,

  getDefaultWatchesForSyncedComponent(globalConfigKey) {
    const {
      globalConfig,
      base
    } = (0, _get_sdk.default)();
    return [{
      watch: globalConfig,
      key: globalConfig.__getTopLevelKey(globalConfigKey)
    }, {
      watch: base,
      key: 'permissionLevel'
    }];
  }

};
var _default = globalConfigSyncedComponentHelpers;
exports.default = _default;