"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

const usedWarnings = {};

var _default = msg => {
  if ((0, _get_sdk.default)().runInfo.isDevelopmentMode && usedWarnings[msg] !== true) {
    usedWarnings[msg] = true; // eslint-disable-next-line no-console

    console.warn(`[airtable-block] ${msg}`);
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93YXJuaW5nLmpzIl0sIm5hbWVzIjpbInVzZWRXYXJuaW5ncyIsIm1zZyIsInJ1bkluZm8iLCJpc0RldmVsb3BtZW50TW9kZSIsImNvbnNvbGUiLCJ3YXJuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQTs7QUFFQSxNQUFNQSxZQUFZLEdBQUcsRUFBckI7O2VBRWdCQyxHQUFELElBQWlCO0FBQzVCLE1BQUksd0JBQVNDLE9BQVQsQ0FBaUJDLGlCQUFqQixJQUFzQ0gsWUFBWSxDQUFDQyxHQUFELENBQVosS0FBc0IsSUFBaEUsRUFBc0U7QUFDbEVELElBQUFBLFlBQVksQ0FBQ0MsR0FBRCxDQUFaLEdBQW9CLElBQXBCLENBRGtFLENBR2xFOztBQUNBRyxJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYyxvQkFBbUJKLEdBQUksRUFBckM7QUFDSDtBQUNKLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGdldFNkayBmcm9tICcuL2dldF9zZGsnO1xuXG5jb25zdCB1c2VkV2FybmluZ3MgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGdldFNkaygpLnJ1bkluZm8uaXNEZXZlbG9wbWVudE1vZGUgJiYgdXNlZFdhcm5pbmdzW21zZ10gIT09IHRydWUpIHtcbiAgICAgICAgdXNlZFdhcm5pbmdzW21zZ10gPSB0cnVlO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUud2FybihgW2FpcnRhYmxlLWJsb2NrXSAke21zZ31gKTtcbiAgICB9XG59O1xuIl19