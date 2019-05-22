"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;
var AIRTABLE_INTERFACE_VERSION = 0;
var getAirtableInterfaceAtVersion = window.__getAirtableInterfaceAtVersion;

if (!getAirtableInterfaceAtVersion) {
  throw new Error('@airtable/blocks can only run inside the block frame');
}

var _default = getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);

exports.default = _default;