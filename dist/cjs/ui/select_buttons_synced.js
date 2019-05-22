"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _select_buttons = _interopRequireDefault(require("./select_buttons"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
/** */


class SelectButtonsSynced extends React.Component {
  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_select_buttons.default, (0, _extends2.default)({
        disabled: this.props.disabled || !canSetValue,
        value: value,
        onChange: newValue => {
          setValue(newValue);

          if (this.props.onChange) {
            this.props.onChange(newValue);
          }
        } // NOTE: blocks rely on being able to override `value` because
        // of this implementation detail. It's helpful when you want the
        // reads to go through some getter instead of using the raw globalConfig
        // value (e.g. to respect defaults).

      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(SelectButtonsSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectButtonsSynced;
exports.default = _default;