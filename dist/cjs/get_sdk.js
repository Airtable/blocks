"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = getSdk;

var _sdk = _interopRequireDefault(require("./sdk"));

var _airtable_interface = _interopRequireDefault(require("./injected/airtable_interface"));

// TODO(alex): prevent sdk sharing across invocations of the same lambda container
let sdk;

function getSdk() {
  if (!sdk) {
    sdk = new _sdk.default(_airtable_interface.default);
  }

  return sdk;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZXRfc2RrLmpzIl0sIm5hbWVzIjpbInNkayIsImdldFNkayIsIlNkayIsImFpcnRhYmxlSW50ZXJmYWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTtBQUNBLElBQUlBLEdBQUo7O0FBQ2UsU0FBU0MsTUFBVCxHQUF1QjtBQUNsQyxNQUFJLENBQUNELEdBQUwsRUFBVTtBQUNOQSxJQUFBQSxHQUFHLEdBQUcsSUFBSUUsWUFBSixDQUFRQywyQkFBUixDQUFOO0FBQ0g7O0FBRUQsU0FBT0gsR0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBTZGsgZnJvbSAnLi9zZGsnO1xuaW1wb3J0IGFpcnRhYmxlSW50ZXJmYWNlIGZyb20gJy4vaW5qZWN0ZWQvYWlydGFibGVfaW50ZXJmYWNlJztcblxuLy8gVE9ETyhhbGV4KTogcHJldmVudCBzZGsgc2hhcmluZyBhY3Jvc3MgaW52b2NhdGlvbnMgb2YgdGhlIHNhbWUgbGFtYmRhIGNvbnRhaW5lclxubGV0IHNkaztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFNkaygpOiBTZGsge1xuICAgIGlmICghc2RrKSB7XG4gICAgICAgIHNkayA9IG5ldyBTZGsoYWlydGFibGVJbnRlcmZhY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBzZGs7XG59XG4iXX0=