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

var themes = Object.freeze({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  YELLOW: 'yellow',
  WHITE: 'white',
  GRAY: 'gray',
  DARK: 'dark',
  TRANSPARENT: 'transparent'
});
var classNamesByTheme = {
  [themes.RED]: 'red text-white',
  [themes.GREEN]: 'green text-white',
  [themes.BLUE]: 'blue text-white',
  [themes.YELLOW]: 'yellow text-dark',
  [themes.WHITE]: 'white text-blue',
  [themes.DARK]: 'dark text-white',
  [themes.GRAY]: 'grayLight1 text-dark',
  [themes.TRANSPARENT]: 'background-transparent text-dark'
};
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

class Button extends React.Component {
  constructor(props) {
    super(props);
    this._button = null;
  }

  focus() {
    (0, _invariant.default)(this._button, 'No button to focus');

    this._button.focus();
  }

  blur() {
    (0, _invariant.default)(this._button, 'No button to blur');

    this._button.blur();
  }

  click() {
    (0, _invariant.default)(this._button, 'No button to click');

    this._button.click();
  }

  render() {
    var _this$props = this.props,
        className = _this$props.className,
        theme = _this$props.theme,
        disabled = _this$props.disabled,
        children = _this$props.children,
        restOfProps = (0, _objectWithoutProperties2.default)(_this$props, ["className", "theme", "disabled", "children"]);
    var themeClassNames = classNamesByTheme[theme] || '';
    return React.createElement("button", (0, _extends2.default)({
      ref: el => this._button = el,
      type: "button" // Default type is "submit", which will submit the parent <form> if it exists.
      ,
      disabled: disabled,
      className: (0, _classnames.default)('baymax rounded big strong p1 flex-inline items-center no-outline', themeClassNames, className, {
        'pointer link-quiet': !disabled,
        'noevents quieter': disabled
      })
    }, restOfProps), children);
  }

}

(0, _defineProperty2.default)(Button, "propTypes", {
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  theme: _propTypes.default.oneOf(Object.keys(classNamesByTheme))
});
(0, _defineProperty2.default)(Button, "defaultProps", {
  theme: themes.GRAY
});
(0, _defineProperty2.default)(Button, "themes", themes);
var _default = Button;
exports.default = _default;