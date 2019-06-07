"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useBase;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _base = _interopRequireDefault(require("../models/base"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

function useBase() {
  var base = (0, _get_sdk.default)().base;
  (0, _use_watchable.default)(base, ['__schema']);
  return base;
}