"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

// Disable the "react/prop-types" rule in this file, since it doesn't support this
// "shared/reusable prop types" pattern:
// https://github.com/yannickcr/eslint-plugin-react/issues/476

/* eslint-disable react/prop-types */
var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

var KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');
/** */


var SelectButtons =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(SelectButtons, _React$Component);

  function SelectButtons() {
    (0, _classCallCheck2.default)(this, SelectButtons);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SelectButtons).apply(this, arguments));
  }

  (0, _createClass2.default)(SelectButtons, [{
    key: "_onChange",
    value: function _onChange(newValue) {
      var _this$props = this.props,
          value = _this$props.value,
          onChange = _this$props.onChange;

      if (onChange) {
        if (newValue !== value) {
          onChange(newValue);
        }
      }
    }
  }, {
    key: "_onKeyDown",
    value: function _onKeyDown(e, value) {
      if (e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) {
        this._onChange(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          style = _this$props2.style,
          options = _this$props2.options,
          disabled = _this$props2.disabled,
          value = _this$props2.value,
          _this$props2$tabIndex = _this$props2.tabIndex,
          tabIndex = _this$props2$tabIndex === void 0 ? 0 : _this$props2$tabIndex; // Check options here for a cleaner stack trace.
      // Also, even though options are required, still check if it's set because
      // the error is really ugly and covers up the prop type check.

      var validationResult = (0, _select_and_select_buttons_helpers.validateOptions)(options);

      if (!validationResult.isValid) {
        throw new Error("<SelectButtons> ".concat(validationResult.reason));
      }

      var restOfProps = u.omit(this.props, Object.keys(SelectButtons.propTypes));
      return React.createElement("div", (0, _extends2.default)({
        className: (0, _classnames.default)('flex rounded overflow-hidden p-half darken2', {
          quieter: disabled
        }, className),
        style: style
      }, restOfProps), options && options.map(option => {
        var isSelected = option.value === value;
        var isOptionDisabled = disabled || option.disabled;
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
  }]);
  return SelectButtons;
}(React.Component);

(0, _defineProperty2.default)(SelectButtons, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsPropTypes);
var _default = SelectButtons;
exports.default = _default;