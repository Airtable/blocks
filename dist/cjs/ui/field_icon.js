"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _field = _interopRequireDefault(require("../models/field"));

var _icon = _interopRequireDefault(require("./icon"));

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');
/**
 * @typedef {object} FieldIconProps
 * @property {Field} field The field model to display an icon for.
 * @property {number} [size=16] The width/height of the icon.
 * @property {string} [fillColor] The color of the icon.
 * @property {string} [className] Additional class names to apply to the icon.
 * @property {object} [style] Additional styles to apply to the icon.
 * @property {string} [pathClassName] Additional class names to apply to the icon path.
 * @property {object} [pathStyle] Additional styles to apply to the icon path.
 */


/**
 * A vector icon for a field's type.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {FieldIconProps} props
 *
 * @example
 * import {FieldIcon, useBase} from '@airtable/blocks/ui';
 *
 * const base = useBase();
 * const table = base.tables[0];
 * const {primaryField} = table;
 *
 * const FieldToken = (
 *     <div style={{
 *         display: 'inline-flex',
 *         alignItems: 'center',
 *         padding: 8,
 *         fontWeight: 500,
 *         backgroundColor: '#eee',
 *         borderRadius: 3,
 *     }}>
 *         <FieldIcon
 *             field={primaryField}
 *             style={{marginRight: 8}}
 *         />
 *         {primaryField.name}
 *     </div>
 * );
 */
var FieldIcon = props => {
  var field = props.field,
      size = props.size,
      fillColor = props.fillColor,
      className = props.className,
      style = props.style,
      pathClassName = props.pathClassName,
      pathStyle = props.pathStyle;

  var type = field.__getRawType();

  var typeOptions = field.__getRawTypeOptions();

  var appInterface = field.parentTable.parentBase.__appInterface;
  var displayType = columnTypeProvider.getDisplayType(type, typeOptions, appInterface);
  var displayTypeConfigs = columnTypeProvider.getDisplayTypeConfigs(type);
  var config = displayTypeConfigs[displayType];
  var name = config.displayTypeIcon;
  return React.createElement(_icon.default, {
    name: name,
    size: size,
    fillColor: fillColor,
    className: className,
    style: style,
    pathClassName: pathClassName,
    pathStyle: pathStyle
  });
};

FieldIcon.propTypes = {
  field: _propTypes.default.instanceOf(_field.default).isRequired,
  size: _propTypes.default.number,
  fillColor: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  pathClassName: _propTypes.default.string,
  pathStyle: _propTypes.default.object
};
var _default = FieldIcon;
exports.default = _default;