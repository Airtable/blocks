"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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
  [themes.GRAY]: 'grayLight2 text-dark',
  [themes.TRANSPARENT]: 'background-transparent text-dark'
};
/**
 * Clickable button component.
 *
 * @example
 * import {Button} from '@airtable/blocks/ui';
 *
 * const button = (
 *     <Button
 *         onClick={() => alert('Clicked!')}
 *         disabled={false}
 *         theme={Button.themes.BLUE}
 *     >
 *         Click here!
 *     </Button>
 * );
 */

var Button =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Button, _React$Component);

  function Button(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Button);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Button).call(this, props)); // TODO (stephen): use React.forwardRef

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
      var _this$props = this.props,
          theme = _this$props.theme,
          id = _this$props.id,
          className = _this$props.className,
          style = _this$props.style,
          onClick = _this$props.onClick,
          type = _this$props.type,
          disabled = _this$props.disabled,
          tabIndex = _this$props.tabIndex,
          children = _this$props.children;
      var themeClassNames = classNamesByTheme[theme] || '';
      return React.createElement("button", {
        ref: el => this._button = el,
        id: id,
        className: (0, _classnames.default)('baymax rounded big strong p1 flex-inline items-center no-outline no-user-select', themeClassNames, className, {
          'pointer link-quiet': !disabled,
          'noevents quieter': disabled
        }),
        style: style,
        onClick: onClick,
        type: type,
        disabled: disabled,
        tabIndex: tabIndex,
        "aria-label": this.props['aria-label']
      }, children);
    }
  }]);
  return Button;
}(React.Component);

(0, _defineProperty2.default)(Button, "propTypes", {
  theme: _propTypes.default.oneOf(Object.keys(classNamesByTheme)),
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  onClick: _propTypes.default.func,
  type: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  'aria-label': _propTypes.default.string
});
(0, _defineProperty2.default)(Button, "defaultProps", {
  theme: themes.BLUE,
  // Default type is "submit", which will submit the parent <form> if it exists.
  type: 'button'
});
(0, _defineProperty2.default)(Button, "themes", themes);
var _default = Button;
exports.default = _default;