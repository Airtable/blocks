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

// TODO(kasra): don't depend on liveapp components.
const _Loader = window.__requirePrivateModuleFromAirtable('client_server_shared/react/ui/loader/loader');

// Override the default props and then just proxy through to our loader.

/** */
const Loader = ({
  fillColor = '#888',
  scale = 0.3
}) => {
  return React.createElement(_Loader, {
    fillColor: fillColor,
    scale: scale
  });
};

Loader.propTypes = {
  fillColor: _propTypes.default.string,
  scale: _propTypes.default.number
};
var _default = Loader;
exports.default = _default;