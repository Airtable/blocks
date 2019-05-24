"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSdk;

var _sdk = _interopRequireDefault(require("./sdk"));

var _airtable_interface = _interopRequireDefault(require("./injected/airtable_interface"));

// TODO(alex): prevent sdk sharing across invocations of the same lambda container
var sdk;

function getSdk() {
  if (!sdk) {
    sdk = new _sdk.default(_airtable_interface.default);
  }

  return sdk;
}