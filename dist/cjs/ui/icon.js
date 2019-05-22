"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

const React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');

const Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); // TODO(kasra): don't depend on liveapp components.


const iconConfig = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/icon_config');

/** */
const Icon = ({
  name,
  size = 16,
  fillColor,
  className,
  style,
  pathClassName
}) => {
  const isMicro = size <= 12;
  const pathData = iconConfig[`${name}${isMicro ? 'Micro' : ''}`];

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
  pathClassName: _propTypes.default.string
};
var _default = Icon;
exports.default = _default;