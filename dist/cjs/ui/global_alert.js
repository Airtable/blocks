"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _watchable = _interopRequireDefault(require("../watchable"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var WatchableGlobalAlertKeys = {
  __alertInfo: '__alertInfo'
};

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.globalAlert.showReloadPrompt();
 */
class GlobalAlert extends _watchable.default {
  static _isWatchableKey(key) {
    return (0, _private_utils.isEnumValue)(WatchableGlobalAlertKeys, key);
  }

  constructor() {
    super();
    this._alertInfo = null;
    Object.seal(this);
  }

  get __alertInfo() {
    return this._alertInfo;
  }
  /** */


  showReloadPrompt() {
    this._alertInfo = {
      content: React.createElement("span", {
        className: "center line-height-4 quiet strong"
      }, React.createElement("span", {
        className: "pointer understroke link-unquiet",
        onClick: () => {
          (0, _get_sdk.default)().reload();
        }
      }, "Please reload"))
    };

    this._onChange(WatchableGlobalAlertKeys.__alertInfo);
  }

}

(0, _defineProperty2.default)(GlobalAlert, "_className", 'GlobalAlert');
var _default = GlobalAlert;
exports.default = _default;