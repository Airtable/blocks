// @flow
import {getEnumValueIfExists} from './private_utils';
import Colors, {type Color, rgbTuplesByColor} from './colors';

/** @typedef */
type RGB = {|r: number, g: number, b: number|};

type GetHexForColorType = (Color => string) & (string => string | null);
type GetRgbForColorType = (Color => RGB) & (string => RGB | null);

/** Utilities for working with {@link Color} names from the {@link colors} enum. */
const colorUtils = {
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
    getHexForColor: (colorString => {
        const color = getEnumValueIfExists(Colors, colorString);
        if (!color) {
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];

        const hexNumber = (rgbTuple[0] << 16) | (rgbTuple[1] << 8) | rgbTuple[2];
        return `#${hexNumber.toString(16).padStart(6, '0')}`;
    }: GetHexForColorType),
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
    getRgbForColor: (colorString => {
        const color = getEnumValueIfExists(Colors, colorString);
        if (!color) {
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];
        return {r: rgbTuple[0], g: rgbTuple[1], b: rgbTuple[2]};
    }: GetRgbForColorType),
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
    shouldUseLightTextOnColor(colorString: string): boolean {
        if (!rgbTuplesByColor[colorString]) {
            return false;
        }

        const shouldUseDarkText = colorString.endsWith('Light1') || colorString.endsWith('Light2');
        return !shouldUseDarkText;
    },
};

export default colorUtils;
