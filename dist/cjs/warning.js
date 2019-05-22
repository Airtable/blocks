"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

var usedWarnings = {};

var _default = function _default(msg) {
  if ((0, _get_sdk.default)().runInfo.isDevelopmentMode && usedWarnings[msg] !== true) {
    usedWarnings[msg] = true; // eslint-disable-next-line no-console

    console.warn("[airtable-block] ".concat(msg));
  }
};

exports.default = _default;