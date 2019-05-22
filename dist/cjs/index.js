"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

// we need to use module.exports syntax here because we want people to be able to do destructuring
// imports. Usually, this isn't possible when exporting a class with ESM - it's a quirk of how
// babel handles inter-op between commonjs and es modules.
// TODO: use direct es exports rather than an SDK instance
module.exports = (0, _get_sdk.default)();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQUEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLHVCQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgZ2V0U2RrIGZyb20gJy4vZ2V0X3Nkayc7XG5cbi8vIHdlIG5lZWQgdG8gdXNlIG1vZHVsZS5leHBvcnRzIHN5bnRheCBoZXJlIGJlY2F1c2Ugd2Ugd2FudCBwZW9wbGUgdG8gYmUgYWJsZSB0byBkbyBkZXN0cnVjdHVyaW5nXG4vLyBpbXBvcnRzLiBVc3VhbGx5LCB0aGlzIGlzbid0IHBvc3NpYmxlIHdoZW4gZXhwb3J0aW5nIGEgY2xhc3Mgd2l0aCBFU00gLSBpdCdzIGEgcXVpcmsgb2YgaG93XG4vLyBiYWJlbCBoYW5kbGVzIGludGVyLW9wIGJldHdlZW4gY29tbW9uanMgYW5kIGVzIG1vZHVsZXMuXG4vLyBUT0RPOiB1c2UgZGlyZWN0IGVzIGV4cG9ydHMgcmF0aGVyIHRoYW4gYW4gU0RLIGluc3RhbmNlXG5tb2R1bGUuZXhwb3J0cyA9IGdldFNkaygpO1xuIl19