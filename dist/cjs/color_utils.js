"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _colors = _interopRequireDefault(require("./colors"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const liveappColors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors'); // Construct a set of all the possible color values, so the below
// methods have constant time lookup when validating that a color
// exists.


const colorValuesSet = u.arrayToSet((0, _values.default)(u).call(u, _colors.default));
/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.colorUtils.getHexForColor(UI.colors.RED);
 */

const colorUtils = {
  /** */
  getHexForColor(color) {
    if (!colorValuesSet[color]) {
      return null;
    }

    return liveappColors.getHexForColor(color);
  },

  /** */
  getRgbForColor(color) {
    if (!colorValuesSet[color]) {
      return null;
    }

    return liveappColors.getRgbObjForColor(color);
  },

  /** */
  shouldUseLightTextOnColor(color) {
    if (!colorValuesSet[color]) {
      // Don't have a color for this. Let's just return false as a default
      // instead of throwing.
      return false;
    } // Light1 and Light2 colors use dark text.
    // Bright, Dark1 and no suffix colors use light text.
    // NOTE: use shouldUseDarkText instead of shouldUseLightText just to make
    // checking the suffix easier, since no suffix uses light text.


    const shouldUseDarkText = (0, _some.default)(u).call(u, ['Light1', 'Light2'], suffix => {
      return (0, _endsWith.default)(u).call(u, color, suffix);
    });
    return !shouldUseDarkText;
  }

};
var _default = colorUtils;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2xvcl91dGlscy5qcyJdLCJuYW1lcyI6WyJ1Iiwid2luZG93IiwiX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZSIsImxpdmVhcHBDb2xvcnMiLCJjb2xvclZhbHVlc1NldCIsImFycmF5VG9TZXQiLCJjb2xvcnMiLCJjb2xvclV0aWxzIiwiZ2V0SGV4Rm9yQ29sb3IiLCJjb2xvciIsImdldFJnYkZvckNvbG9yIiwiZ2V0UmdiT2JqRm9yQ29sb3IiLCJzaG91bGRVc2VMaWdodFRleHRPbkNvbG9yIiwic2hvdWxkVXNlRGFya1RleHQiLCJzdWZmaXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUVBLE1BQU07QUFBQ0EsRUFBQUE7QUFBRCxJQUFNQyxNQUFNLENBQUNDLGtDQUFQLENBQTBDLHlCQUExQyxDQUFaOztBQUNBLE1BQU1DLGFBQWEsR0FBR0YsTUFBTSxDQUFDQyxrQ0FBUCxDQUEwQyw2QkFBMUMsQ0FBdEIsQyxDQUVBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTUUsY0FBYyxHQUFHSixDQUFDLENBQUNLLFVBQUYsQ0FBYSxxQkFBQUwsQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBUU0sZUFBUixDQUFkLENBQXZCO0FBRUE7Ozs7OztBQUtBLE1BQU1DLFVBQVUsR0FBRztBQUNmO0FBQ0FDLEVBQUFBLGNBQWMsQ0FBQ0MsS0FBRCxFQUErQjtBQUN6QyxRQUFJLENBQUNMLGNBQWMsQ0FBQ0ssS0FBRCxDQUFuQixFQUE0QjtBQUN4QixhQUFPLElBQVA7QUFDSDs7QUFFRCxXQUFPTixhQUFhLENBQUNLLGNBQWQsQ0FBNkJDLEtBQTdCLENBQVA7QUFDSCxHQVJjOztBQVNmO0FBQ0FDLEVBQUFBLGNBQWMsQ0FBQ0QsS0FBRCxFQUEwRDtBQUNwRSxRQUFJLENBQUNMLGNBQWMsQ0FBQ0ssS0FBRCxDQUFuQixFQUE0QjtBQUN4QixhQUFPLElBQVA7QUFDSDs7QUFFRCxXQUFPTixhQUFhLENBQUNRLGlCQUFkLENBQWdDRixLQUFoQyxDQUFQO0FBQ0gsR0FoQmM7O0FBaUJmO0FBQ0FHLEVBQUFBLHlCQUF5QixDQUFDSCxLQUFELEVBQXlCO0FBQzlDLFFBQUksQ0FBQ0wsY0FBYyxDQUFDSyxLQUFELENBQW5CLEVBQTRCO0FBQ3hCO0FBQ0E7QUFDQSxhQUFPLEtBQVA7QUFDSCxLQUw2QyxDQU85QztBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsVUFBTUksaUJBQWlCLEdBQUcsbUJBQUFiLENBQUMsTUFBRCxDQUFBQSxDQUFDLEVBQU0sQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFOLEVBQTRCYyxNQUFNLElBQUk7QUFDN0QsYUFBTyx1QkFBQWQsQ0FBQyxNQUFELENBQUFBLENBQUMsRUFBVVMsS0FBVixFQUFpQkssTUFBakIsQ0FBUjtBQUNILEtBRjBCLENBQTNCO0FBR0EsV0FBTyxDQUFDRCxpQkFBUjtBQUNIOztBQWpDYyxDQUFuQjtlQW9DZU4sVSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuY29uc3Qge3V9ID0gd2luZG93Ll9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUoJ2NsaWVudF9zZXJ2ZXJfc2hhcmVkL2h1Jyk7XG5jb25zdCBsaXZlYXBwQ29sb3JzID0gd2luZG93Ll9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUoJ2NsaWVudF9zZXJ2ZXJfc2hhcmVkL2NvbG9ycycpO1xuXG4vLyBDb25zdHJ1Y3QgYSBzZXQgb2YgYWxsIHRoZSBwb3NzaWJsZSBjb2xvciB2YWx1ZXMsIHNvIHRoZSBiZWxvd1xuLy8gbWV0aG9kcyBoYXZlIGNvbnN0YW50IHRpbWUgbG9va3VwIHdoZW4gdmFsaWRhdGluZyB0aGF0IGEgY29sb3Jcbi8vIGV4aXN0cy5cbmNvbnN0IGNvbG9yVmFsdWVzU2V0ID0gdS5hcnJheVRvU2V0KHUudmFsdWVzKGNvbG9ycykpO1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge1VJfSBmcm9tICdhaXJ0YWJsZS1ibG9jayc7XG4gKiBVSS5jb2xvclV0aWxzLmdldEhleEZvckNvbG9yKFVJLmNvbG9ycy5SRUQpO1xuICovXG5jb25zdCBjb2xvclV0aWxzID0ge1xuICAgIC8qKiAqL1xuICAgIGdldEhleEZvckNvbG9yKGNvbG9yOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgaWYgKCFjb2xvclZhbHVlc1NldFtjb2xvcl0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpdmVhcHBDb2xvcnMuZ2V0SGV4Rm9yQ29sb3IoY29sb3IpO1xuICAgIH0sXG4gICAgLyoqICovXG4gICAgZ2V0UmdiRm9yQ29sb3IoY29sb3I6IHN0cmluZyk6IHtyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyfSB8IG51bGwge1xuICAgICAgICBpZiAoIWNvbG9yVmFsdWVzU2V0W2NvbG9yXSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGl2ZWFwcENvbG9ycy5nZXRSZ2JPYmpGb3JDb2xvcihjb2xvcik7XG4gICAgfSxcbiAgICAvKiogKi9cbiAgICBzaG91bGRVc2VMaWdodFRleHRPbkNvbG9yKGNvbG9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFjb2xvclZhbHVlc1NldFtjb2xvcl0pIHtcbiAgICAgICAgICAgIC8vIERvbid0IGhhdmUgYSBjb2xvciBmb3IgdGhpcy4gTGV0J3MganVzdCByZXR1cm4gZmFsc2UgYXMgYSBkZWZhdWx0XG4gICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGlnaHQxIGFuZCBMaWdodDIgY29sb3JzIHVzZSBkYXJrIHRleHQuXG4gICAgICAgIC8vIEJyaWdodCwgRGFyazEgYW5kIG5vIHN1ZmZpeCBjb2xvcnMgdXNlIGxpZ2h0IHRleHQuXG4gICAgICAgIC8vIE5PVEU6IHVzZSBzaG91bGRVc2VEYXJrVGV4dCBpbnN0ZWFkIG9mIHNob3VsZFVzZUxpZ2h0VGV4dCBqdXN0IHRvIG1ha2VcbiAgICAgICAgLy8gY2hlY2tpbmcgdGhlIHN1ZmZpeCBlYXNpZXIsIHNpbmNlIG5vIHN1ZmZpeCB1c2VzIGxpZ2h0IHRleHQuXG4gICAgICAgIGNvbnN0IHNob3VsZFVzZURhcmtUZXh0ID0gdS5zb21lKFsnTGlnaHQxJywgJ0xpZ2h0MiddLCBzdWZmaXggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHUuZW5kc1dpdGgoY29sb3IsIHN1ZmZpeCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gIXNob3VsZFVzZURhcmtUZXh0O1xuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvclV0aWxzO1xuIl19