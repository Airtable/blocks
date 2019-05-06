"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _seal = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/seal"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

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
var GlobalAlert =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(GlobalAlert, _Watchable);
  (0, _createClass2.default)(GlobalAlert, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableGlobalAlertKeys, key);
    }
  }]);

  function GlobalAlert() {
    var _this;

    (0, _classCallCheck2.default)(this, GlobalAlert);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GlobalAlert).call(this));
    _this._alertInfo = null;
    (0, _seal.default)((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(GlobalAlert, [{
    key: "showReloadPrompt",

    /** */
    value: function showReloadPrompt() {
      this._alertInfo = {
        content: React.createElement("span", {
          className: "center line-height-4 quiet strong"
        }, React.createElement("span", {
          className: "pointer understroke link-unquiet",
          onClick: function onClick() {
            (0, _get_sdk.default)().reload();
          }
        }, "Please reload"))
      };

      this._onChange(WatchableGlobalAlertKeys.__alertInfo);
    }
  }, {
    key: "__alertInfo",
    get: function get() {
      return this._alertInfo;
    }
  }]);
  return GlobalAlert;
}(_watchable.default);

(0, _defineProperty2.default)(GlobalAlert, "_className", 'GlobalAlert');
var _default = GlobalAlert;
exports.default = _default;