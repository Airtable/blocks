"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

var usedWarnings = {};

var _default = msg => {
  if ((0, _get_sdk.default)().runInfo.isDevelopmentMode && usedWarnings[msg] !== true) {
    usedWarnings[msg] = true; // eslint-disable-next-line no-console

    console.warn("[@airtable/blocks] ".concat(msg));
  }
};

exports.default = _default;