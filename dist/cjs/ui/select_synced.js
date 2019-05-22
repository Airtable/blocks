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

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _select = _interopRequireDefault(require("./select"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
/** */


class SelectSynced extends React.Component {
  constructor(props) {
    super(props);
    this._select = null;
  }

  focus() {
    (0, _invariant.default)(this._select, 'No select to focus');

    this._select.focus();
  }

  blur() {
    (0, _invariant.default)(this._select, 'No select to blur');

    this._select.blur();
  }

  click() {
    (0, _invariant.default)(this._select, 'No select to click');

    this._select.click();
  }

  render() {
    const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
    return React.createElement(_synced.default, {
      globalConfigKey: this.props.globalConfigKey,
      render: ({
        value,
        canSetValue,
        setValue
      }) => React.createElement(_select.default, (0, _extends2.default)({
        ref: el => this._select = el,
        disabled: this.props.disabled || !canSetValue,
        value: value,
        onChange: newValue => {
          setValue(newValue);

          if (this.props.onChange) {
            this.props.onChange(newValue);
          }
        }
      }, restOfProps))
    });
  }

}

(0, _defineProperty2.default)(SelectSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectSynced;
exports.default = _default;