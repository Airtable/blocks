"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _watchable = _interopRequireDefault(require("./watchable"));

var _private_utils = require("./private_utils");

var WatchableSettingsButtonKeys = {
  isVisible: 'isVisible',
  click: 'click'
};

/**
 * Interface to the settings button that lives outside the block's viewport.
 *
 * Watch `click` to handle click events on the button.
 *
 * @example
 * import {settingsButton} from 'airtable-block';
 * settingsButton.isVisible = true;
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 */
class SettingsButton extends _watchable.default {
  static _isWatchableKey(key) {
    return (0, _private_utils.isEnumValue)(WatchableSettingsButtonKeys, key);
  }

  constructor(airtableInterface) {
    super();
    this._isVisible = false;
    this._airtableInterface = airtableInterface;
  }
  /**
   * Whether the settings button is being shown.
   * Set to `true` to show the settings button.
   * Can be watched.
   */


  get isVisible() {
    return this._isVisible;
  }

  set isVisible(isVisible) {
    this._isVisible = isVisible;

    this._onChange(WatchableSettingsButtonKeys.isVisible, isVisible);

    this._airtableInterface.setSettingsButtonVisibility(isVisible);
  }

  __onClick() {
    this._onChange(WatchableSettingsButtonKeys.click);
  }

}

(0, _defineProperty2.default)(SettingsButton, "_className", 'SettingsButton');
var _default = SettingsButton;
exports.default = _default;