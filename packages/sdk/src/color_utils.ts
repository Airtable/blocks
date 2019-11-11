/** @module @airtable/blocks/ui: colorUtils */ /** */
import {getEnumValueIfExists, has} from './private_utils';
import Colors, {Color, rgbTuplesByColor} from './colors';

/** A red/green/blue color object. Each property is a number from 0 to 255. */
interface RGB {
    /** The red component. */
    r: number;
    /** The green component. */
    g: number;
    /** The blue component. */
    b: number;
}

/** Utilities for working with {@link Color} names from the {@link colors} enum. */
interface ColorUtils {
    /**
     * Given a {@link Color}, return the hex color value for that color, or null if the value isn't a {@link Color}
     *
     * @param colorString
     * @returns the color hex string or null
     * @example
     * ```js
     * import {colorUtils, colors} from '@airtable/blocks/ui';
     *
     * colorUtils.getHexForColor(colors.RED);
     * // => '#ef3061'
     *
     * colorUtils.getHexForColor('uncomfortable beige');
     * // => null
     * ```
     */
    getHexForColor(colorString: string): null | string;
    /** @hidden */
    getHexForColor(colorString: Color): string;

    /**
     * Given a {@link Color}, return an {@link RGB} object representing it, or null if the value isn't a {@link Color}
     *
     * @param colorString
     * @returns the color object or null
     * @example
     * ```js
     * import {colorUtils, colors} from '@airtable/blocks/ui';
     *
     * colorUtils.getRgbForColor(colors.PURPLE_DARK_1);
     * // => {r: 107, g: 28, b: 176}
     *
     * colorUtils.getRgbForColor('disgruntled pink');
     * // => null
     * ```
     */
    getRgbForColor(colorString: string): RGB | null;
    /** @hidden */
    getRgbForColor(colorString: Color): RGB;

    /**
     * Given a {@link Color}, returns true or false to indicate whether that color should have light text on top of it when used as a background color.
     *
     * @param colorString
     * @returns boolean
     * @example
     * ```js
     * import {colorUtils, colors} from '@airtable/blocks/ui';
     *
     * colorUtils.shouldUseLightTextOnColor(colors.PINK_LIGHT_1);
     * // => false
     *
     * colorUtils.shouldUseLightTextOnColor(colors.PINK_DARK_1);
     * // => true
     * ```
     */
    shouldUseLightTextOnColor(colorString: string): boolean;
}

const colorUtils: ColorUtils = {
    getHexForColor: ((colorString: string): null | string => {
        const color = getEnumValueIfExists(Colors, colorString);
        if (!color) {
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];

        const hexNumber = (rgbTuple[0] << 16) | (rgbTuple[1] << 8) | rgbTuple[2];
        return `#${hexNumber.toString(16).padStart(6, '0')}`;
    }) as ColorUtils['getHexForColor'],

    getRgbForColor: ((colorString: string): RGB | null => {
        const color = getEnumValueIfExists(Colors, colorString);
        if (!color) {
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];
        return {r: rgbTuple[0], g: rgbTuple[1], b: rgbTuple[2]};
    }) as ColorUtils['getRgbForColor'],

    shouldUseLightTextOnColor: (colorString: string): boolean => {
        if (!has(rgbTuplesByColor, colorString)) {
            return false;
        }

        const shouldUseDarkText = colorString.endsWith('Light1') || colorString.endsWith('Light2');
        return !shouldUseDarkText;
    },
};

export default colorUtils;
