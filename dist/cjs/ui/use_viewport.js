"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useViewport;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _viewport = _interopRequireDefault(require("../viewport"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

function useViewport() {
  var viewport = (0, _get_sdk.default)().viewport;
  (0, _use_watchable.default)(viewport, ['isFullscreen', 'size', 'minSize', 'maxFullscreenSize']);
  return viewport;
}