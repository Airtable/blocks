"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withHooks;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

// Helper method for using hooks with class components.
function withHooks(Component, getAdditionalPropsToInject) {
  return React.forwardRef((props, ref) => {
    var propsToInject = getAdditionalPropsToInject(props);
    return React.createElement(Component, (0, _extends2.default)({
      ref: ref
    }, props, propsToInject));
  });
}