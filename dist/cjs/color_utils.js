"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));

var _padStart = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-start"));

var _private_utils = _interopRequireDefault(require("./private_utils"));

var _colors = _interopRequireWildcard(require("./colors"));

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.colorUtils.getHexForColor(UI.colors.RED);
 */
const colorUtils = {
  /** */
  getHexForColor: colorString => {
    var _context;

    const color = _private_utils.default.getEnumValueIfExists(_colors.default, colorString);

    if (!color) {
      // flow-disable-next-line returning null doesn't work with the overload
      return null;
    }

    const rgbTuple = _colors.rgbTuplesByColor[color];
    const hexNumber = rgbTuple[0] << 16 | rgbTuple[1] << 8 | rgbTuple[2];
    return `#${(0, _padStart.default)(_context = hexNumber.toString(16)).call(_context, 6, '0')}`;
  },

  /** */
  getRgbForColor: colorString => {
    const color = _private_utils.default.getEnumValueIfExists(_colors.default, colorString);

    if (!color) {
      // flow-disable-next-line returning null doesn't work with the overload
      return null;
    }

    const rgbTuple = _colors.rgbTuplesByColor[color];
    return {
      r: rgbTuple[0],
      g: rgbTuple[1],
      b: rgbTuple[2]
    };
  },

  /** */
  shouldUseLightTextOnColor(color) {
    if (!_colors.rgbTuplesByColor[color]) {
      // Don't have a color for this. Let's just return false as a default
      // instead of throwing.
      return false;
    } // Light1 and Light2 colors use dark text.
    // Bright, Dark1 and no suffix colors use light text.
    // NOTE: use shouldUseDarkText instead of shouldUseLightText just to make
    // checking the suffix easier, since no suffix uses light text.


    const shouldUseDarkText = (0, _endsWith.default)(color).call(color, 'Light1') || (0, _endsWith.default)(color).call(color, 'Light2');
    return !shouldUseDarkText;
  }

};
var _default = colorUtils;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2xvcl91dGlscy5qcyJdLCJuYW1lcyI6WyJjb2xvclV0aWxzIiwiZ2V0SGV4Rm9yQ29sb3IiLCJjb2xvclN0cmluZyIsImNvbG9yIiwidXRpbHMiLCJnZXRFbnVtVmFsdWVJZkV4aXN0cyIsIkNvbG9ycyIsInJnYlR1cGxlIiwicmdiVHVwbGVzQnlDb2xvciIsImhleE51bWJlciIsInRvU3RyaW5nIiwiZ2V0UmdiRm9yQ29sb3IiLCJyIiwiZyIsImIiLCJzaG91bGRVc2VMaWdodFRleHRPbkNvbG9yIiwic2hvdWxkVXNlRGFya1RleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQVFBOzs7OztBQUtBLE1BQU1BLFVBQVUsR0FBRztBQUNmO0FBQ0FDLEVBQUFBLGNBQWMsRUFBR0MsV0FBVyxJQUFJO0FBQUE7O0FBQzVCLFVBQU1DLEtBQUssR0FBR0MsdUJBQU1DLG9CQUFOLENBQTJCQyxlQUEzQixFQUFtQ0osV0FBbkMsQ0FBZDs7QUFDQSxRQUFJLENBQUNDLEtBQUwsRUFBWTtBQUNSO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsVUFBTUksUUFBUSxHQUFHQyx5QkFBaUJMLEtBQWpCLENBQWpCO0FBRUEsVUFBTU0sU0FBUyxHQUFJRixRQUFRLENBQUMsQ0FBRCxDQUFSLElBQWUsRUFBaEIsR0FBdUJBLFFBQVEsQ0FBQyxDQUFELENBQVIsSUFBZSxDQUF0QyxHQUEyQ0EsUUFBUSxDQUFDLENBQUQsQ0FBckU7QUFDQSxXQUFRLElBQUcsa0NBQUFFLFNBQVMsQ0FBQ0MsUUFBVixDQUFtQixFQUFuQixrQkFBZ0MsQ0FBaEMsRUFBbUMsR0FBbkMsQ0FBd0MsRUFBbkQ7QUFDSCxHQVpjOztBQWFmO0FBQ0FDLEVBQUFBLGNBQWMsRUFBR1QsV0FBVyxJQUFJO0FBQzVCLFVBQU1DLEtBQUssR0FBR0MsdUJBQU1DLG9CQUFOLENBQTJCQyxlQUEzQixFQUFtQ0osV0FBbkMsQ0FBZDs7QUFDQSxRQUFJLENBQUNDLEtBQUwsRUFBWTtBQUNSO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsVUFBTUksUUFBUSxHQUFHQyx5QkFBaUJMLEtBQWpCLENBQWpCO0FBQ0EsV0FBTztBQUFDUyxNQUFBQSxDQUFDLEVBQUVMLFFBQVEsQ0FBQyxDQUFELENBQVo7QUFBaUJNLE1BQUFBLENBQUMsRUFBRU4sUUFBUSxDQUFDLENBQUQsQ0FBNUI7QUFBaUNPLE1BQUFBLENBQUMsRUFBRVAsUUFBUSxDQUFDLENBQUQ7QUFBNUMsS0FBUDtBQUNILEdBdEJjOztBQXVCZjtBQUNBUSxFQUFBQSx5QkFBeUIsQ0FBQ1osS0FBRCxFQUF5QjtBQUM5QyxRQUFJLENBQUNLLHlCQUFpQkwsS0FBakIsQ0FBTCxFQUE4QjtBQUMxQjtBQUNBO0FBQ0EsYUFBTyxLQUFQO0FBQ0gsS0FMNkMsQ0FPOUM7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFVBQU1hLGlCQUFpQixHQUFHLHVCQUFBYixLQUFLLE1BQUwsQ0FBQUEsS0FBSyxFQUFVLFFBQVYsQ0FBTCxJQUE0Qix1QkFBQUEsS0FBSyxNQUFMLENBQUFBLEtBQUssRUFBVSxRQUFWLENBQTNEO0FBQ0EsV0FBTyxDQUFDYSxpQkFBUjtBQUNIOztBQXJDYyxDQUFuQjtlQXdDZWhCLFUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHV0aWxzIGZyb20gJy4vcHJpdmF0ZV91dGlscyc7XG5pbXBvcnQgQ29sb3JzLCB7dHlwZSBDb2xvciwgcmdiVHVwbGVzQnlDb2xvcn0gZnJvbSAnLi9jb2xvcnMnO1xuXG50eXBlIFJHQiA9IHt8cjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcnx9O1xuXG4vLyBvdmVybG9hZCByZXR1cm4gc2lnbmF0dXJlcyB0byBhdm9pZCBudWxsIGNoZWNrcyBpZiB0eXBlIG9mIGlucHV0IGlzIENvbG9yOlxudHlwZSBHZXRIZXhGb3JDb2xvclR5cGUgPSAoQ29sb3IgPT4gc3RyaW5nKSAmIChzdHJpbmcgPT4gc3RyaW5nIHwgbnVsbCk7XG50eXBlIEdldFJnYkZvckNvbG9yVHlwZSA9IChDb2xvciA9PiBSR0IpICYgKHN0cmluZyA9PiBSR0IgfCBudWxsKTtcblxuLyoqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHtVSX0gZnJvbSAnYWlydGFibGUtYmxvY2snO1xuICogVUkuY29sb3JVdGlscy5nZXRIZXhGb3JDb2xvcihVSS5jb2xvcnMuUkVEKTtcbiAqL1xuY29uc3QgY29sb3JVdGlscyA9IHtcbiAgICAvKiogKi9cbiAgICBnZXRIZXhGb3JDb2xvcjogKGNvbG9yU3RyaW5nID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB1dGlscy5nZXRFbnVtVmFsdWVJZkV4aXN0cyhDb2xvcnMsIGNvbG9yU3RyaW5nKTtcbiAgICAgICAgaWYgKCFjb2xvcikge1xuICAgICAgICAgICAgLy8gZmxvdy1kaXNhYmxlLW5leHQtbGluZSByZXR1cm5pbmcgbnVsbCBkb2Vzbid0IHdvcmsgd2l0aCB0aGUgb3ZlcmxvYWRcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJnYlR1cGxlID0gcmdiVHVwbGVzQnlDb2xvcltjb2xvcl07XG5cbiAgICAgICAgY29uc3QgaGV4TnVtYmVyID0gKHJnYlR1cGxlWzBdIDw8IDE2KSB8IChyZ2JUdXBsZVsxXSA8PCA4KSB8IHJnYlR1cGxlWzJdO1xuICAgICAgICByZXR1cm4gYCMke2hleE51bWJlci50b1N0cmluZygxNikucGFkU3RhcnQoNiwgJzAnKX1gO1xuICAgIH06IEdldEhleEZvckNvbG9yVHlwZSksXG4gICAgLyoqICovXG4gICAgZ2V0UmdiRm9yQ29sb3I6IChjb2xvclN0cmluZyA9PiB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gdXRpbHMuZ2V0RW51bVZhbHVlSWZFeGlzdHMoQ29sb3JzLCBjb2xvclN0cmluZyk7XG4gICAgICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgICAgIC8vIGZsb3ctZGlzYWJsZS1uZXh0LWxpbmUgcmV0dXJuaW5nIG51bGwgZG9lc24ndCB3b3JrIHdpdGggdGhlIG92ZXJsb2FkXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZ2JUdXBsZSA9IHJnYlR1cGxlc0J5Q29sb3JbY29sb3JdO1xuICAgICAgICByZXR1cm4ge3I6IHJnYlR1cGxlWzBdLCBnOiByZ2JUdXBsZVsxXSwgYjogcmdiVHVwbGVbMl19O1xuICAgIH06IEdldFJnYkZvckNvbG9yVHlwZSksXG4gICAgLyoqICovXG4gICAgc2hvdWxkVXNlTGlnaHRUZXh0T25Db2xvcihjb2xvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghcmdiVHVwbGVzQnlDb2xvcltjb2xvcl0pIHtcbiAgICAgICAgICAgIC8vIERvbid0IGhhdmUgYSBjb2xvciBmb3IgdGhpcy4gTGV0J3MganVzdCByZXR1cm4gZmFsc2UgYXMgYSBkZWZhdWx0XG4gICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGlnaHQxIGFuZCBMaWdodDIgY29sb3JzIHVzZSBkYXJrIHRleHQuXG4gICAgICAgIC8vIEJyaWdodCwgRGFyazEgYW5kIG5vIHN1ZmZpeCBjb2xvcnMgdXNlIGxpZ2h0IHRleHQuXG4gICAgICAgIC8vIE5PVEU6IHVzZSBzaG91bGRVc2VEYXJrVGV4dCBpbnN0ZWFkIG9mIHNob3VsZFVzZUxpZ2h0VGV4dCBqdXN0IHRvIG1ha2VcbiAgICAgICAgLy8gY2hlY2tpbmcgdGhlIHN1ZmZpeCBlYXNpZXIsIHNpbmNlIG5vIHN1ZmZpeCB1c2VzIGxpZ2h0IHRleHQuXG4gICAgICAgIGNvbnN0IHNob3VsZFVzZURhcmtUZXh0ID0gY29sb3IuZW5kc1dpdGgoJ0xpZ2h0MScpIHx8IGNvbG9yLmVuZHNXaXRoKCdMaWdodDInKTtcbiAgICAgICAgcmV0dXJuICFzaG91bGRVc2VEYXJrVGV4dDtcbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JVdGlscztcbiJdfQ==