"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _classNamesByTheme;

var KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

var onEnterOrSpaceKey = function onEnterOrSpaceKey(handler) {
  return function (e) {
    if ((e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) && handler) {
      e.preventDefault();
      handler();
    }
  };
};

var themes = (0, _freeze.default)({
  GREEN: 'green',
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GRAY: 'gray'
});
var classNamesByTheme = (_classNamesByTheme = {}, (0, _defineProperty2.default)(_classNamesByTheme, themes.GREEN, 'green'), (0, _defineProperty2.default)(_classNamesByTheme, themes.BLUE, 'blue'), (0, _defineProperty2.default)(_classNamesByTheme, themes.RED, 'red'), (0, _defineProperty2.default)(_classNamesByTheme, themes.YELLOW, 'yellow'), (0, _defineProperty2.default)(_classNamesByTheme, themes.GRAY, 'gray'), _classNamesByTheme);

/** */
var Toggle =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Toggle, _React$Component);

  function Toggle(props) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, Toggle);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Toggle).call(this, props));
    _this._container = null;
    _this._toggleValue = (0, _bind.default)(_context = _this._toggleValue).call(_context, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Toggle, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._container, 'No toggle to focus');

      this._container.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._container, 'No toggle to blur');

      this._container.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._container, 'No toggle to click');

      this._container.click();
    }
  }, {
    key: "_toggleValue",
    value: function _toggleValue() {
      var _this$props = this.props,
          value = _this$props.value,
          onChange = _this$props.onChange;

      if (onChange) {
        onChange(!value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

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
        ref: function ref(el) {
          return _this2._container = el;
        },
        onClick: onClick,
        tabIndex: tabIndexToUse,
        onKeyDown: onEnterOrSpaceKey(onClick),
        className: (0, _classnames.default)('focusable flex-inline items-center', {
          'pointer link-quiet': !disabled,
          'noevents quieter': disabled
        }, className),
        style: style
      }, restOfProps), React.createElement("div", {
        className: (0, _classnames.default)('pill flex animate flex-none', (0, _defineProperty2.default)({
          'justify-start darken2': !value,
          'justify-end': value
        }, toggleClassNameForTheme || '', value)),
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
  }]);
  return Toggle;
}(React.Component);

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