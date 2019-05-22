"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _colors = _interopRequireDefault(require("../colors"));

var _color_utils = _interopRequireDefault(require("../color_utils"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** */
const ProgressBar = props => {
  const {
    progress,
    barColor = _color_utils.default.getHexForColor(_colors.default.BLUE_BRIGHT),
    backgroundColor = _color_utils.default.getHexForColor(_colors.default.GRAY_LIGHT_1),
    height = 4,
    className = '',
    style
  } = props;
  const clampedProgress = u.clamp(progress, 0, 1);
  return React.createElement("div", {
    className: `${className} relative pill overflow-hidden`,
    style: { ...style,
      height,
      backgroundColor
    }
  }, React.createElement("div", {
    className: "absolute animate top-0 left-0 height-full",
    style: {
      width: `${clampedProgress * 100}%`,
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