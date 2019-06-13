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

var _private_utils = require("../private_utils");

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
  var clampedProgress = (0, _private_utils.clamp)(progress, 0, 1);
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