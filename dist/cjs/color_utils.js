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

/** Utilities for working with {@link Color} names from the {@link colors} enum. */
var colorUtils = {
  /**
   * Given a {@link Color}, return the hex color value for that color, or null if the value isn't a {@link Color}
   *
   * @function
   * @param colorString {Color}
   * @returns {string | null}
   * @example
   * import {colorUtils, colors} from '@airtable/blocks/ui';
   *
   * colorUtils.getHexForColor(colors.RED);
   * // => '#ef3061'
   *
   * colorUtils.getHexForColor('uncomfortable beige');
   * // => null
   */
  getHexForColor: colorString => {
    var color = (0, _private_utils.getEnumValueIfExists)(_colors.default, colorString);

    if (!color) {
      // $FlowFixMe returning null doesn't work with the overload
      return null;
    }

    var rgbTuple = _colors.rgbTuplesByColor[color];
    var hexNumber = rgbTuple[0] << 16 | rgbTuple[1] << 8 | rgbTuple[2];
    return "#".concat(hexNumber.toString(16).padStart(6, '0'));
  },

  /**
   * Given a {@link Color}, return an {@link RGB} object representing it, or null if the value isn't a {@link Color}
   *
   * @function
   * @param colorString {Color}
   * @returns {RGB | null}
   * @example
   * import {colorUtils, colors} from '@airtable/blocks/ui';
   *
   * colorUtils.getRgbForColor(colors.PURPLE_DARK_1);
   * // => {r: 107, g: 28, b: 176}
   *
   * colorUtils.getRgbForColor('disgruntled pink');
   * // => null
   */
  getRgbForColor: colorString => {
    var color = (0, _private_utils.getEnumValueIfExists)(_colors.default, colorString);

    if (!color) {
      // $FlowFixMe returning null doesn't work with the overload
      return null;
    }

    var rgbTuple = _colors.rgbTuplesByColor[color];
    return {
      r: rgbTuple[0],
      g: rgbTuple[1],
      b: rgbTuple[2]
    };
  },

  /**
   * Given a {@link Color}, returns true or false to indicate whether that color should have light text on top of it when used as a background color.
   *
   * @function
   * @param colorString {Color}
   * @returns boolean
   * @example
   * import {colorUtils, colors} from '@airtable/blocks/ui';
   *
   * colorUtils.shouldUseLightTextOnColor(colors.PINK_LIGHT_1);
   * // => false
   *
   * colorUtils.shouldUseLightTextOnColor(colors.PINK_DARK_1);
   * // => true
   */
  shouldUseLightTextOnColor(colorString) {
    if (!_colors.rgbTuplesByColor[colorString]) {
      // Don't have a color for this. Let's just return false as a default
      // instead of throwing.
      return false;
    } // Light1 and Light2 colors use dark text.
    // Bright, Dark1 and no suffix colors use light text.
    // NOTE: use shouldUseDarkText instead of shouldUseLightText just to make
    // checking the suffix easier, since no suffix uses light text.


    var shouldUseDarkText = colorString.endsWith('Light1') || colorString.endsWith('Light2');
    return !shouldUseDarkText;
  }

};
var _default = colorUtils;
exports.default = _default;