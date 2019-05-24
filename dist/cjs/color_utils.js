"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.ends-with");

require("core-js/modules/es.string.pad-start");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _private_utils = require("./private_utils");

var _colors = _interopRequireWildcard(require("./colors"));

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.colorUtils.getHexForColor(UI.colors.RED);
 */
var colorUtils = {
  /** */
  getHexForColor: colorString => {
    var color = (0, _private_utils.getEnumValueIfExists)(_colors.default, colorString);

    if (!color) {
      // flow-disable-next-line returning null doesn't work with the overload
      return null;
    }

    var rgbTuple = _colors.rgbTuplesByColor[color];
    var hexNumber = rgbTuple[0] << 16 | rgbTuple[1] << 8 | rgbTuple[2];
    return "#".concat(hexNumber.toString(16).padStart(6, '0'));
  },

  /** */
  getRgbForColor: colorString => {
    var color = (0, _private_utils.getEnumValueIfExists)(_colors.default, colorString);

    if (!color) {
      // flow-disable-next-line returning null doesn't work with the overload
      return null;
    }

    var rgbTuple = _colors.rgbTuplesByColor[color];
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


    var shouldUseDarkText = color.endsWith('Light1') || color.endsWith('Light2');
    return !shouldUseDarkText;
  }

};
var _default = colorUtils;
exports.default = _default;