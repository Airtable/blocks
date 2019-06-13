"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');

var Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); // TODO(kasra): don't depend on liveapp components.


var iconConfig = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/icon_config');

/**
 * A vector icon from the Airtable icon set.
 *
 * @param {object} props The props for the component.
 * @param {string} props.name The name of the icon. For a comprehensive list, refer to the "Icon" section of the [styleguide](https://airtable.com/styleguide).
 * @param {number} [props.size=16] The width/height of the icon.
 * @param {string} [props.fillColor] The color of the icon.
 * @param {string} [props.className] Additional class names to apply to the icon.
 * @param {object} [props.style] Additional styles to apply to the icon.
 * @param {string} [props.pathClassName] Additional class names to apply to the icon path.
 * @param {object} [props.pathStyle] Additional styles to apply to the icon path.
 * @returns A React node.
 *
 * @example
 * const LikeButton = (
 *     <Button
 *         theme={Button.themes.RED}
 *         onClick={() => alert('Liked!')}
 *     >
 *         <Icon
 *             name="heart"
 *             fillColor="#fff"
 *             style={{marginRight: 8}}
 *         />
 *         Like
 *     </Button>
 * );
 */
var Icon = (_ref) => {
  var name = _ref.name,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 16 : _ref$size,
      fillColor = _ref.fillColor,
      className = _ref.className,
      style = _ref.style,
      pathClassName = _ref.pathClassName,
      pathStyle = _ref.pathStyle;
  var isMicro = size <= 12;
  var pathData = iconConfig["".concat(name).concat(isMicro ? 'Micro' : '')];

  if (!pathData) {
    return null;
  }

  return React.createElement(Svg, {
    width: size,
    height: size,
    originalWidth: isMicro ? 12 : 16,
    originalHeight: isMicro ? 12 : 16,
    className: className,
    style: style
  }, React.createElement("path", {
    fillRule: "evenodd",
    className: pathClassName,
    style: pathStyle,
    fill: fillColor,
    d: pathData
  }));
};

Icon.propTypes = {
  name: _propTypes.default.string.isRequired,
  size: _propTypes.default.number,
  fillColor: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  pathClassName: _propTypes.default.string,
  pathStyle: _propTypes.default.object
};
var _default = Icon;
exports.default = _default;