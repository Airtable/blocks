"use strict";

Object.defineProperty(exports, "__esModule", {
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