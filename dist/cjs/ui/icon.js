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


var iconConfig = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/icon_config'); // TODO (stephen): remove link to styleguide

/**
 * @typedef {object} IconProps
 * @property {string} name The name of the icon. For a comprehensive list, refer to the "Icon" section of the [styleguide](https://airtable.com/styleguide).
 * @property {number} [size=16] The width/height of the icon.
 * @property {string} [fillColor] The color of the icon.
 * @property {string} [className] Additional class names to apply to the icon.
 * @property {object} [style] Additional styles to apply to the icon.
 * @property {string} [pathClassName] Additional class names to apply to the icon path.
 * @property {object} [pathStyle] Additional styles to apply to the icon path.
 */


/**
 * A vector icon from the Airtable icon set.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {IconProps} props
 *
 * @example
 * import {Button, Icon} from '@airtable/blocks/ui';
 *
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
var Icon = props => {
  var name = props.name,
      size = props.size,
      fillColor = props.fillColor,
      className = props.className,
      style = props.style,
      pathClassName = props.pathClassName,
      pathStyle = props.pathStyle;
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
  size: _propTypes.default.number.isRequired,
  fillColor: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  pathClassName: _propTypes.default.string,
  pathStyle: _propTypes.default.object
};
Icon.defaultProps = {
  size: 16
};
var _default = Icon;
exports.default = _default;