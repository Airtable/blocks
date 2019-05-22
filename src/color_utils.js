// @flow
import utils from './private_utils';
import Colors, {type Color, rgbTuplesByColor} from './colors';

type RGB = {|r: number, g: number, b: number|};

// overload return signatures to avoid null checks if type of input is Color:
type GetHexForColorType = (Color => string) & (string => string | null);
type GetRgbForColorType = (Color => RGB) & (string => RGB | null);

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.colorUtils.getHexForColor(UI.colors.RED);
 */
const colorUtils = {
    /** */
    getHexForColor: (colorString => {
        const color = utils.getEnumValueIfExists(Colors, colorString);
        if (!color) {
            // flow-disable-next-line returning null doesn't work with the overload
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];

        const hexNumber = (rgbTuple[0] << 16) | (rgbTuple[1] << 8) | rgbTuple[2];
        return `#${hexNumber.toString(16).padStart(6, '0')}`;
    }: GetHexForColorType),
    /** */
    getRgbForColor: (colorString => {
        const color = utils.getEnumValueIfExists(Colors, colorString);
        if (!color) {
            // flow-disable-next-line returning null doesn't work with the overload
            return null;
        }
        const rgbTuple = rgbTuplesByColor[color];
        return {r: rgbTuple[0], g: rgbTuple[1], b: rgbTuple[2]};
    }: GetRgbForColorType),
    /** */
    shouldUseLightTextOnColor(color: string): boolean {
        if (!rgbTuplesByColor[color]) {
            // Don't have a color for this. Let's just return false as a default
            // instead of throwing.
            return false;
        }

        // Light1 and Light2 colors use dark text.
        // Bright, Dark1 and no suffix colors use light text.
        // NOTE: use shouldUseDarkText instead of shouldUseLightText just to make
        // checking the suffix easier, since no suffix uses light text.
        const shouldUseDarkText = color.endsWith('Light1') || color.endsWith('Light2');
        return !shouldUseDarkText;
    },
};

export default colorUtils;
