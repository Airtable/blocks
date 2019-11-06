/** @module @airtable/blocks/ui: colors */ /** */
import {ObjectValues} from './private_utils';
/**
 * Airtable color names.
 */
const Colors = {
    /** */
    BLUE_BRIGHT: 'blueBright' as const,
    /** */
    BLUE_DARK_1: 'blueDark1' as const,
    /** */
    BLUE_LIGHT_1: 'blueLight1' as const,
    /** */
    BLUE_LIGHT_2: 'blueLight2' as const,
    /** */
    BLUE: 'blue' as const,

    /** */
    CYAN_BRIGHT: 'cyanBright' as const,
    /** */
    CYAN_DARK_1: 'cyanDark1' as const,
    /** */
    CYAN_LIGHT_1: 'cyanLight1' as const,
    /** */
    CYAN_LIGHT_2: 'cyanLight2' as const,
    /** */
    CYAN: 'cyan' as const,

    /** */
    GRAY_BRIGHT: 'grayBright' as const,
    /** */
    GRAY_DARK_1: 'grayDark1' as const,
    /** */
    GRAY_LIGHT_1: 'grayLight1' as const,
    /** */
    GRAY_LIGHT_2: 'grayLight2' as const,
    /** */
    GRAY: 'gray' as const,

    /** */
    GREEN_BRIGHT: 'greenBright' as const,
    /** */
    GREEN_DARK_1: 'greenDark1' as const,
    /** */
    GREEN_LIGHT_1: 'greenLight1' as const,
    /** */
    GREEN_LIGHT_2: 'greenLight2' as const,
    /** */
    GREEN: 'green' as const,

    /** */
    ORANGE_BRIGHT: 'orangeBright' as const,
    /** */
    ORANGE_DARK_1: 'orangeDark1' as const,
    /** */
    ORANGE_LIGHT_1: 'orangeLight1' as const,
    /** */
    ORANGE_LIGHT_2: 'orangeLight2' as const,
    /** */
    ORANGE: 'orange' as const,

    /** */
    PINK_BRIGHT: 'pinkBright' as const,
    /** */
    PINK_DARK_1: 'pinkDark1' as const,
    /** */
    PINK_LIGHT_1: 'pinkLight1' as const,
    /** */
    PINK_LIGHT_2: 'pinkLight2' as const,
    /** */
    PINK: 'pink' as const,

    /** */
    PURPLE_BRIGHT: 'purpleBright' as const,
    /** */
    PURPLE_DARK_1: 'purpleDark1' as const,
    /** */
    PURPLE_LIGHT_1: 'purpleLight1' as const,
    /** */
    PURPLE_LIGHT_2: 'purpleLight2' as const,
    /** */
    PURPLE: 'purple' as const,

    /** */
    RED_BRIGHT: 'redBright' as const,
    /** */
    RED_DARK_1: 'redDark1' as const,
    /** */
    RED_LIGHT_1: 'redLight1' as const,
    /** */
    RED_LIGHT_2: 'redLight2' as const,
    /** */
    RED: 'red' as const,

    /** */
    TEAL_BRIGHT: 'tealBright' as const,
    /** */
    TEAL_DARK_1: 'tealDark1' as const,
    /** */
    TEAL_LIGHT_1: 'tealLight1' as const,
    /** */
    TEAL_LIGHT_2: 'tealLight2' as const,
    /** */
    TEAL: 'teal' as const,

    /** */
    YELLOW_BRIGHT: 'yellowBright' as const,
    /** */
    YELLOW_DARK_1: 'yellowDark1' as const,
    /** */
    YELLOW_LIGHT_1: 'yellowLight1' as const,
    /** */
    YELLOW_LIGHT_2: 'yellowLight2' as const,
    /** */
    YELLOW: 'yellow' as const,
};

export default Colors;

/**
 * A color name.
 */
export type Color = ObjectValues<typeof Colors>;

/** @hidden */
export const rgbTuplesByColor = {
    [Colors.BLUE_BRIGHT]: [45, 127, 249],
    [Colors.BLUE_DARK_1]: [39, 80, 174],
    [Colors.BLUE_LIGHT_1]: [156, 199, 255],
    [Colors.BLUE_LIGHT_2]: [207, 223, 255],
    [Colors.BLUE]: [18, 131, 218],

    [Colors.CYAN_BRIGHT]: [24, 191, 255],
    [Colors.CYAN_DARK_1]: [11, 118, 183],
    [Colors.CYAN_LIGHT_1]: [119, 209, 243],
    [Colors.CYAN_LIGHT_2]: [208, 240, 253],
    [Colors.CYAN]: [1, 169, 219],

    [Colors.GRAY_BRIGHT]: [102, 102, 102],
    [Colors.GRAY_DARK_1]: [68, 68, 68],
    [Colors.GRAY_LIGHT_1]: [204, 204, 204],
    [Colors.GRAY_LIGHT_2]: [238, 238, 238],
    [Colors.GRAY]: [102, 102, 102],

    [Colors.GREEN_BRIGHT]: [32, 201, 51],
    [Colors.GREEN_DARK_1]: [51, 138, 23],
    [Colors.GREEN_LIGHT_1]: [147, 224, 136],
    [Colors.GREEN_LIGHT_2]: [209, 247, 196],
    [Colors.GREEN]: [17, 175, 34],

    [Colors.ORANGE_BRIGHT]: [255, 111, 44],
    [Colors.ORANGE_DARK_1]: [215, 77, 38],
    [Colors.ORANGE_LIGHT_1]: [255, 169, 129],
    [Colors.ORANGE_LIGHT_2]: [254, 226, 213],
    [Colors.ORANGE]: [247, 101, 59],

    [Colors.PINK_BRIGHT]: [255, 8, 194],
    [Colors.PINK_DARK_1]: [178, 21, 139],
    [Colors.PINK_LIGHT_1]: [249, 157, 226],
    [Colors.PINK_LIGHT_2]: [255, 218, 246],
    [Colors.PINK]: [233, 41, 186],

    [Colors.PURPLE_BRIGHT]: [139, 70, 255],
    [Colors.PURPLE_DARK_1]: [107, 28, 176],
    [Colors.PURPLE_LIGHT_1]: [205, 176, 255],
    [Colors.PURPLE_LIGHT_2]: [237, 226, 254],
    [Colors.PURPLE]: [124, 57, 237],

    [Colors.RED_BRIGHT]: [248, 43, 96],
    [Colors.RED_DARK_1]: [186, 30, 69],
    [Colors.RED_LIGHT_1]: [255, 158, 183],
    [Colors.RED_LIGHT_2]: [255, 220, 229],
    [Colors.RED]: [239, 48, 97],

    [Colors.TEAL_BRIGHT]: [32, 217, 210],
    [Colors.TEAL_DARK_1]: [6, 160, 155],
    [Colors.TEAL_LIGHT_1]: [114, 221, 195],
    [Colors.TEAL_LIGHT_2]: [194, 245, 233],
    [Colors.TEAL]: [2, 170, 164],

    [Colors.YELLOW_BRIGHT]: [252, 180, 0],
    [Colors.YELLOW_DARK_1]: [184, 117, 3],
    [Colors.YELLOW_LIGHT_1]: [255, 214, 110],
    [Colors.YELLOW_LIGHT_2]: [255, 234, 182],
    [Colors.YELLOW]: [224, 141, 0],
};
