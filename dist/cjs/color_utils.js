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