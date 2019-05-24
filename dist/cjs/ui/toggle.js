"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

var onEnterOrSpaceKey = handler => {
  return function (e) {
    if ((e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) && handler) {
      e.preventDefault();
      handler();
    }
  };
};

var themes = Object.freeze({
  GREEN: 'green',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GRAY: 'gray'
});
var classNamesByTheme = {
  [themes.GREEN]: 'green',
  [themes.BLUE]: 'blue',
  [themes.RED]: 'red',
  [themes.YELLOW]: 'yellow',
  [themes.GRAY]: 'gray'
};

/** */
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this._container = null;
    this._toggleValue = this._toggleValue.bind(this);
  }

  focus() {
    (0, _invariant.default)(this._container, 'No toggle to focus');

    this._container.focus();
  }

  blur() {
    (0, _invariant.default)(this._container, 'No toggle to blur');

    this._container.blur();
  }

  click() {
    (0, _invariant.default)(this._container, 'No toggle to click');

    this._container.click();
  }

  _toggleValue() {
    var _this$props = this.props,
        value = _this$props.value,
        onChange = _this$props.onChange;

    if (onChange) {
      onChange(!value);
    }
  }

  render() {
    var _this$props2 = this.props,
        value = _this$props2.value,
        label = _this$props2.label,
        theme = _this$props2.theme,
        disabled = _this$props2.disabled,
        className = _this$props2.className,
        style = _this$props2.style,
        tabIndex = _this$props2.tabIndex,
        onChange = _this$props2.onChange,
        restOfProps = (0, _objectWithoutProperties2.default)(_this$props2, ["value", "label", "theme", "disabled", "className", "style", "tabIndex", "onChange"]);
    var onClick = disabled ? null : this._toggleValue;
    var tabIndexToUse = disabled ? -1 : tabIndex;
    var toggleHeight = 12;
    var togglePadding = 2;
    var toggleClassNameForTheme = theme && classNamesByTheme[theme];
    return React.createElement("div", (0, _extends2.default)({
      ref: el => this._container = el,
      onClick: onClick,
      tabIndex: tabIndexToUse,
      onKeyDown: onEnterOrSpaceKey(onClick),
      className: (0, _classnames.default)('focusable flex-inline items-center', {
        'pointer link-quiet': !disabled,
        'noevents quieter': disabled
      }, className),
      style: style
    }, restOfProps), React.createElement("div", {
      className: (0, _classnames.default)('pill flex animate flex-none', {
        'justify-start darken2': !value,
        'justify-end': value,
        [toggleClassNameForTheme || '']: value
      }),
      style: {
        height: toggleHeight,
        width: toggleHeight * 1.6,
        padding: togglePadding
      }
    }, React.createElement("div", {
      className: "white circle flex-none",
      style: {
        width: toggleHeight - 2 * togglePadding
      }
    })), label !== null && label !== undefined && label !== '' && React.createElement("div", {
      className: "flex-auto ml1 normal text-dark"
    }, label));
  }

}

(0, _defineProperty2.default)(Toggle, "themes", themes);
(0, _defineProperty2.default)(Toggle, "propTypes", {
  value: _propTypes.default.bool.isRequired,
  label: _propTypes.default.node,
  theme: _propTypes.default.oneOf(Object.keys(classNamesByTheme)),
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.number
});
(0, _defineProperty2.default)(Toggle, "defaultProps", {
  tabIndex: 0,
  theme: themes.GREEN
});
var _default = Toggle;
exports.default = _default;