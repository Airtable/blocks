"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _watchable = _interopRequireDefault(require("../watchable"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

const WatchableGlobalAlertKeys = {
  __alertInfo: '__alertInfo'
};

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.globalAlert.showReloadPrompt();
 */
class GlobalAlert extends _watchable.default {
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableGlobalAlertKeys, key);
  }

  constructor() {
    super();
    this._alertInfo = null;
    (0, _seal.default)(this);
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