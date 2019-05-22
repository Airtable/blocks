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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _classNamesByTheme;

var themes = (0, _freeze.default)({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  YELLOW: 'yellow',
  WHITE: 'white',
  GRAY: 'gray',
  DARK: 'dark',
  TRANSPARENT: 'transparent'
});
var classNamesByTheme = (_classNamesByTheme = {}, (0, _defineProperty2.default)(_classNamesByTheme, themes.RED, 'red text-white'), (0, _defineProperty2.default)(_classNamesByTheme, themes.GREEN, 'green text-white'), (0, _defineProperty2.default)(_classNamesByTheme, themes.BLUE, 'blue text-white'), (0, _defineProperty2.default)(_classNamesByTheme, themes.YELLOW, 'yellow text-dark'), (0, _defineProperty2.default)(_classNamesByTheme, themes.WHITE, 'white text-blue'), (0, _defineProperty2.default)(_classNamesByTheme, themes.DARK, 'dark text-white'), (0, _defineProperty2.default)(_classNamesByTheme, themes.GRAY, 'grayLight1 text-dark'), (0, _defineProperty2.default)(_classNamesByTheme, themes.TRANSPARENT, 'background-transparent text-dark'), _classNamesByTheme);
/**
 * Clickable button component.
 *
 * @example
 * import {UI} from 'airtable-block';
 * const button = (
 *     <UI.Button
 *        disabled={false}
 *        theme={UI.Button.themes.BLUE}
 *        onClick={() = alert('Clicked!')}>
 *         Done
 *     </UI.Button>
 * );
 */

var Button =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Button, _React$Component);

  function Button(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Button);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Button).call(this, props));
    _this._button = null;
    return _this;
  }

  (0, _createClass2.default)(Button, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._button, 'No button to focus');

      this._button.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._button, 'No button to blur');

      this._button.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._button, 'No button to click');

      this._button.click();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          theme = _this$props.theme,
          disabled = _this$props.disabled,
          children = _this$props.children,
          restOfProps = (0, _objectWithoutProperties2.default)(_this$props, ["className", "theme", "disabled", "children"]);
      var themeClassNames = classNamesByTheme[theme] || '';
      return React.createElement("button", (0, _extends2.default)({
        ref: function ref(el) {
          return _this2._button = el;
        },
        type: "button" // Default type is "submit", which will submit the parent <form> if it exists.
        ,
        disabled: disabled,
        className: (0, _classnames.default)('baymax rounded big strong p1 flex-inline items-center no-outline', themeClassNames, className, {
          'pointer link-quiet': !disabled,
          'noevents quieter': disabled
        })
      }, restOfProps), children);
    }
  }]);
  return Button;
}(React.Component);

(0, _defineProperty2.default)(Button, "propTypes", {
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  theme: _propTypes.default.oneOf((0, _keys.default)(classNamesByTheme))
});
(0, _defineProperty2.default)(Button, "defaultProps", {
  theme: themes.GRAY
});
(0, _defineProperty2.default)(Button, "themes", themes);
var _default = Button;
exports.default = _default;