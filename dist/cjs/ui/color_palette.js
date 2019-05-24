"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

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

var React = _interopRequireWildcard(require("react"));

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _icon = _interopRequireDefault(require("./icon"));

/** */
var ColorPalette =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ColorPalette, _React$Component);

  function ColorPalette() {
    (0, _classCallCheck2.default)(this, ColorPalette);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ColorPalette).apply(this, arguments));
  }

  (0, _createClass2.default)(ColorPalette, [{
    key: "_onChange",
    value: function _onChange(color) {
      if (this.props.onChange) {
        this.props.onChange(color);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          color = _this$props.color,
          allowedColors = _this$props.allowedColors,
          squareSize = _this$props.squareSize,
          squareMargin = _this$props.squareMargin,
          className = _this$props.className,
          style = _this$props.style,
          disabled = _this$props.disabled;
      return React.createElement("div", {
        className: "".concat(className, " overflow-hidden"),
        style: {
          style
        }
      }, React.createElement("div", {
        className: "flex flex-wrap",
        style: {
          // Add a negative margin to offset the margin of each swatch,
          // so the color swatches are flush with the outer container.
          margin: -squareMargin
        }
      }, allowedColors.map(allowedColor => React.createElement("label", {
        key: allowedColor,
        onClick: !disabled && (() => this._onChange(allowedColor)),
        style: {
          backgroundColor: _color_utils.default.getHexForColor(allowedColor),
          height: squareSize,
          width: squareSize,
          margin: squareMargin
        },
        className: (0, _classnames.default)('rounded flex items-center justify-center', {
          'pointer link-quiet': !disabled,
          quieter: disabled
        })
      }, allowedColor === color && React.createElement(_icon.default, {
        name: "check",
        size: 25,
        className: _color_utils.default.shouldUseLightTextOnColor(allowedColor) ? 'text-white' : 'text-dark'
      })))));
    }
  }]);
  return ColorPalette;
}(React.Component);

(0, _defineProperty2.default)(ColorPalette, "propTypes", {
  color: _propTypes.default.string,
  allowedColors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  onChange: _propTypes.default.func,
  squareSize: _propTypes.default.number,
  squareMargin: _propTypes.default.number,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  disabled: _propTypes.default.bool
});
(0, _defineProperty2.default)(ColorPalette, "defaultProps", {
  squareSize: 32,
  squareMargin: 4,
  className: '',
  style: {}
});
var _default = ColorPalette;
exports.default = _default;