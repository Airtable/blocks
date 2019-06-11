"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _colors = _interopRequireDefault(require("../colors"));

var _color_utils = _interopRequireDefault(require("../color_utils"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;
/**
 * @typedef
 * @type {object}
 * @property {number} progress A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete. If you include a number outside of the range, the value will be clamped to be inside of the range.
 * @property {string} [barColor] A CSS color, such as `#ff9900`.
 * @property {string} [backgroundColor] A CSS color, such as `#ff9900`.
 * @property {number} [height] A height, in pixels.
 * @property {string} [className=''] Extra `className`s to apply to the element, separated by spaces.
 * @property {object} [style={}] Extra styles to apply to the progress bar.
 */


/**
 * A progress bar.
 *
 * @example
 * import {UI} from '@airtable/blocks/ui';
 *
 * function MyComponent() {
 *     return (
 *         <ProgressBar
 *             progress={0.6}
 *             barColor='#ff9900'
 *         />
 *     );
 * }
 */
var ProgressBar = props => {
  var progress = props.progress,
      _props$barColor = props.barColor,
      barColor = _props$barColor === void 0 ? _color_utils.default.getHexForColor(_colors.default.BLUE_BRIGHT) : _props$barColor,
      _props$backgroundColo = props.backgroundColor,
      backgroundColor = _props$backgroundColo === void 0 ? _color_utils.default.getHexForColor(_colors.default.GRAY_LIGHT_1) : _props$backgroundColo,
      _props$height = props.height,
      height = _props$height === void 0 ? 4 : _props$height,
      _props$className = props.className,
      className = _props$className === void 0 ? '' : _props$className,
      style = props.style;
  var clampedProgress = u.clamp(progress, 0, 1);
  return React.createElement("div", {
    className: "".concat(className, " relative pill overflow-hidden"),
    style: (0, _objectSpread2.default)({}, style, {
      height,
      backgroundColor
    })
  }, React.createElement("div", {
    className: "absolute animate top-0 left-0 height-full",
    style: {
      width: "".concat(clampedProgress * 100, "%"),
      backgroundColor: barColor
    }
  }));
};

ProgressBar.propTypes = {
  progress: _propTypes.default.number.isRequired,
  barColor: _propTypes.default.string,
  backgroundColor: _propTypes.default.string,
  height: _propTypes.default.number,
  className: _propTypes.default.string,
  style: _propTypes.default.object
};
var _default = ProgressBar;
exports.default = _default;