"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _watchable = _interopRequireDefault(require("../watchable"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var WatchableGlobalAlertKeys = Object.freeze({
  __alertInfo: '__alertInfo'
});

/**
 * @alias globalAlert
 * @example
 * import {globalAlert} from '@airtable/blocks/ui';
 * globalAlert.showReloadPrompt();
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

  /** @private */
  function GlobalAlert() {
    var _this;

    (0, _classCallCheck2.default)(this, GlobalAlert);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GlobalAlert).call(this));
    _this._alertInfo = null;
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(GlobalAlert, [{
    key: "showReloadPrompt",

    /** @memberof globalAlert */
    value: function showReloadPrompt() {
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