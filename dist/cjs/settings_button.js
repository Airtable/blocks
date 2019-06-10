"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _watchable = _interopRequireDefault(require("./watchable"));

var _private_utils = require("./private_utils");

var WatchableSettingsButtonKeys = Object.freeze({
  isVisible: 'isVisible',
  click: 'click'
});

/**
 * Interface to the settings button that lives outside the block's viewport.
 *
 * Watch `click` to handle click events on the button.
 *
 * @alias settingsButton
 * @example
 * import {settingsButton} from 'airtable-block';
 * settingsButton.isVisible = true;
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 */
var SettingsButton =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(SettingsButton, _Watchable);
  (0, _createClass2.default)(SettingsButton, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableSettingsButtonKeys, key);
    }
  }]);

  function SettingsButton(airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, SettingsButton);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SettingsButton).call(this));
    _this._isVisible = false;
    _this._airtableInterface = airtableInterface;
    return _this;
  }
  /**
   * Whether the settings button is being shown.
   * Set to `true` to show the settings button.
   * Can be watched.
   * @memberof settingsButton
   */


  (0, _createClass2.default)(SettingsButton, [{
    key: "__onClick",
    value: function __onClick() {
      this._onChange(WatchableSettingsButtonKeys.click);
    }
  }, {
    key: "isVisible",
    get: function get() {
      return this._isVisible;
    },
    set: function set(isVisible) {
      this._isVisible = isVisible;

      this._onChange(WatchableSettingsButtonKeys.isVisible, isVisible);

      this._airtableInterface.setSettingsButtonVisibility(isVisible);
    }
  }]);
  return SettingsButton;
}(_watchable.default);

(0, _defineProperty2.default)(SettingsButton, "_className", 'SettingsButton');
var _default = SettingsButton;
exports.default = _default;