"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');

var Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); // TODO(kasra): don't depend on liveapp components.


var iconConfig = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/icon_config');

/** */
var Icon = function Icon(_ref) {
  var _context;

  var name = _ref.name,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 16 : _ref$size,
      fillColor = _ref.fillColor,
      className = _ref.className,
      style = _ref.style,
      pathClassName = _ref.pathClassName;
  var isMicro = size <= 12;
  var pathData = iconConfig[(0, _concat.default)(_context = "".concat(name)).call(_context, isMicro ? 'Micro' : '')];

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