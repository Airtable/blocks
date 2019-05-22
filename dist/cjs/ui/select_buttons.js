"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

// Disable the "react/prop-types" rule in this file, since it doesn't support this
// "shared/reusable prop types" pattern:
// https://github.com/yannickcr/eslint-plugin-react/issues/476

/* eslint-disable react/prop-types */
const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');
/** */


class SelectButtons extends React.Component {
  _onChange(newValue) {
    const {
      value,
      onChange
    } = this.props;

    if (onChange) {
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  }

  _onKeyDown(e, value) {
    if (e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) {
      this._onChange(value);
    }
  }

  render() {
    const {
      className,
      style,
      options,
      disabled,
      value,
      tabIndex = 0
    } = this.props; // Check options here for a cleaner stack trace.
    // Also, even though options are required, still check if it's set because
    // the error is really ugly and covers up the prop type check.

    const validationResult = (0, _select_and_select_buttons_helpers.validateOptions)(options);

    if (!validationResult.isValid) {
      throw new Error(`<SelectButtons> ${validationResult.reason}`);
    }

    const restOfProps = u.omit(this.props, (0, _keys.default)(SelectButtons.propTypes));
    return React.createElement("div", (0, _extends2.default)({
      className: (0, _classnames.default)('flex rounded overflow-hidden p-half darken2', {
        quieter: disabled
      }, className),
      style: style
    }, restOfProps), options && (0, _map.default)(options).call(options, option => {
      const isSelected = option.value === value;
      const isOptionDisabled = disabled || option.disabled;
      return React.createElement("div", {
        key: (0, _select_and_select_buttons_helpers.optionValueToString)(option.value),
        onClick: !isOptionDisabled && (() => this._onChange(option.value)),
        onKeyDown: !isOptionDisabled && (e => this._onKeyDown(e, option.value)),
        tabIndex: isOptionDisabled ? -1 : tabIndex,
        className: (0, _classnames.default)('flex-auto rounded p-half normal center no-outline', {
          'link-unquiet pointer focusable': !isOptionDisabled,
          'darken4 text-white': isSelected,
          'text-dark': !isSelected,
          quiet: !isSelected && !disabled
        }),
        style: {
          flexBasis: 0
        }
      }, option.label);
    }));
  }

}

(0, _defineProperty2.default)(SelectButtons, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsPropTypes);
var _default = SelectButtons;
exports.default = _default;