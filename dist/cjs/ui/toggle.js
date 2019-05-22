"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

const onEnterOrSpaceKey = handler => {
  return function (e) {
    if ((e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) && handler) {
      e.preventDefault();
      handler();
    }
  };
};

const themes = (0, _freeze.default)({
  GREEN: 'green',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GRAY: 'gray'
});
const classNamesByTheme = {
  [themes.GREEN]: 'green',
  [themes.BLUE]: 'blue',
  [themes.RED]: 'red',
  [themes.YELLOW]: 'yellow',
  [themes.GRAY]: 'gray'
};

/** */
class Toggle extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._container = null;
    this._toggleValue = (0, _bind.default)(_context = this._toggleValue).call(_context, this);
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
    const {
      value,
      onChange
    } = this.props;

    if (onChange) {
      onChange(!value);
    }
  }

  render() {
    const {
      value,
      label,
      theme,
      disabled,
      className,
      style,
      tabIndex,
      // Filter these out so they're not
      // included in restOfProps:
      onChange,
      // eslint-disable-line no-unused-vars
      ...restOfProps
    } = this.props;
    const onClick = disabled ? null : this._toggleValue;
    const tabIndexToUse = disabled ? -1 : tabIndex;
    const toggleHeight = 12;
    const togglePadding = 2;
    const toggleClassNameForTheme = theme && classNamesByTheme[theme];
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
  theme: _propTypes.default.oneOf((0, _keys.default)(classNamesByTheme)),
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