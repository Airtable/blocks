// @flow

/**
 * An enum of color names
 * @alias colors
 */
const Colors = {
    /**
     * @alias colors.BLUE_BRIGHT
     * @memberof colors
     */
    BLUE_BRIGHT: ('blueBright': 'blueBright'),
    /**
     * @alias colors.BLUE_DARK_1
     * @memberof colors
     */
    BLUE_DARK_1: ('blueDark1': 'blueDark1'),
    /**
     * @alias colors.BLUE_LIGHT_1
     * @memberof colors
     */
    BLUE_LIGHT_1: ('blueLight1': 'blueLight1'),
    /**
     * @alias colors.BLUE_LIGHT_2
     * @memberof colors
     */
    BLUE_LIGHT_2: ('blueLight2': 'blueLight2'),
    /**
     * @alias colors.BLUE
     * @memberof colors
     */
    BLUE: ('blue': 'blue'),

    /**
     * @alias colors.CYAN_BRIGHT
     * @memberof colors
     */
    CYAN_BRIGHT: ('cyanBright': 'cyanBright'),
    /**
     * @alias colors.CYAN_DARK_1
     * @memberof colors
     */
    CYAN_DARK_1: ('cyanDark1': 'cyanDark1'),
    /**
     * @alias colors.CYAN_LIGHT_1
     * @memberof colors
     */
    CYAN_LIGHT_1: ('cyanLight1': 'cyanLight1'),
    /**
     * @alias colors.CYAN_LIGHT_2
     * @memberof colors
     */
    CYAN_LIGHT_2: ('cyanLight2': 'cyanLight2'),
    /**
     * @alias colors.CYAN
     * @memberof colors
     */
    CYAN: ('cyan': 'cyan'),

    /**
     * @alias colors.GRAY_BRIGHT
     * @memberof colors
     */
    GRAY_BRIGHT: ('grayBright': 'grayBright'),
    /**
     * @alias colors.GRAY_DARK_1
     * @memberof colors
     */
    GRAY_DARK_1: ('grayDark1': 'grayDark1'),
    /**
     * @alias colors.GRAY_LIGHT_1
     * @memberof colors
     */
    GRAY_LIGHT_1: ('grayLight1': 'grayLight1'),
    /**
     * @alias colors.GRAY_LIGHT_2
     * @memberof colors
     */
    GRAY_LIGHT_2: ('grayLight2': 'grayLight2'),
    /**
     * @alias colors.GRAY
     * @memberof colors
     */
    GRAY: ('gray': 'gray'),

    /**
     * @alias colors.GREEN_BRIGHT
     * @memberof colors
     */
    GREEN_BRIGHT: ('greenBright': 'greenBright'),
    /**
     * @alias colors.GREEN_DARK_1
     * @memberof colors
     */
    GREEN_DARK_1: ('greenDark1': 'greenDark1'),
    /**
     * @alias colors.GREEN_LIGHT_1
     * @memberof colors
     */
    GREEN_LIGHT_1: ('greenLight1': 'greenLight1'),
    /**
     * @alias colors.GREEN_LIGHT_2
     * @memberof colors
     */
    GREEN_LIGHT_2: ('greenLight2': 'greenLight2'),
    /**
     * @alias colors.GREEN
     * @memberof colors
     */
    GREEN: ('green': 'green'),

    /**
     * @alias colors.ORANGE_BRIGHT
     * @memberof colors
     */
    ORANGE_BRIGHT: ('orangeBright': 'orangeBright'),
    /**
     * @alias colors.ORANGE_DARK_1
     * @memberof colors
     */
    ORANGE_DARK_1: ('orangeDark1': 'orangeDark1'),
    /**
     * @alias colors.ORANGE_LIGHT_1
     * @memberof colors
     */
    ORANGE_LIGHT_1: ('orangeLight1': 'orangeLight1'),
    /**
     * @alias colors.ORANGE_LIGHT_2
     * @memberof colors
     */
    ORANGE_LIGHT_2: ('orangeLight2': 'orangeLight2'),
    /**
     * @alias colors.ORANGE
     * @memberof colors
     */
    ORANGE: ('orange': 'orange'),

    /**
     * @alias colors.PINK_BRIGHT
     * @memberof colors
     */
    PINK_BRIGHT: ('pinkBright': 'pinkBright'),
    /**
     * @alias colors.PINK_DARK_1
     * @memberof colors
     */
    PINK_DARK_1: ('pinkDark1': 'pinkDark1'),
    /**
     * @alias colors.PINK_LIGHT_1
     * @memberof colors
     */
    PINK_LIGHT_1: ('pinkLight1': 'pinkLight1'),
    /**
     * @alias colors.PINK_LIGHT_2
     * @memberof colors
     */
    PINK_LIGHT_2: ('pinkLight2': 'pinkLight2'),
    /**
     * @alias colors.PINK
     * @memberof colors
     */
    PINK: ('pink': 'pink'),

    /**
     * @alias colors.PURPLE_BRIGHT
     * @memberof colors
     */
    PURPLE_BRIGHT: ('purpleBright': 'purpleBright'),
    /**
     * @alias colors.PURPLE_DARK_1
     * @memberof colors
     */
    PURPLE_DARK_1: ('purpleDark1': 'purpleDark1'),
    /**
     * @alias colors.PURPLE_LIGHT_1
     * @memberof colors
     */
    PURPLE_LIGHT_1: ('purpleLight1': 'purpleLight1'),
    /**
     * @alias colors.PURPLE_LIGHT_2
     * @memberof colors
     */
    PURPLE_LIGHT_2: ('purpleLight2': 'purpleLight2'),
    /**
     * @alias colors.PURPLE
     * @memberof colors
     */
    PURPLE: ('purple': 'purple'),

    /**
     * @alias colors.RED_BRIGHT
     * @memberof colors
     */
    RED_BRIGHT: ('redBright': 'redBright'),
    /**
     * @alias colors.RED_DARK_1
     * @memberof colors
     */
    RED_DARK_1: ('redDark1': 'redDark1'),
    /**
     * @alias colors.RED_LIGHT_1
     * @memberof colors
     */
    RED_LIGHT_1: ('redLight1': 'redLight1'),
    /**
     * @alias colors.RED_LIGHT_2
     * @memberof colors
     */
    RED_LIGHT_2: ('redLight2': 'redLight2'),
    /**
     * @alias colors.RED
     * @memberof colors
     */
    RED: ('red': 'red'),

    /**
     * @alias colors.TEAL_BRIGHT
     * @memberof colors
     */
    TEAL_BRIGHT: ('tealBright': 'tealBright'),
    /**
     * @alias colors.TEAL_DARK_1
     * @memberof colors
     */
    TEAL_DARK_1: ('tealDark1': 'tealDark1'),
    /**
     * @alias colors.TEAL_LIGHT_1
     * @memberof colors
     */
    TEAL_LIGHT_1: ('tealLight1': 'tealLight1'),
    /**
     * @alias colors.TEAL_LIGHT_2
     * @memberof colors
     */
    TEAL_LIGHT_2: ('tealLight2': 'tealLight2'),
    /**
     * @alias colors.TEAL
     * @memberof colors
     */
    TEAL: ('teal': 'teal'),

    /**
     * @alias colors.YELLOW_BRIGHT
     * @memberof colors
     */
    YELLOW_BRIGHT: ('yellowBright': 'yellowBright'),
    /**
     * @alias colors.YELLOW_DARK_1
     * @memberof colors
     */
    YELLOW_DARK_1: ('yellowDark1': 'yellowDark1'),
    /**
     * @alias colors.YELLOW_LIGHT_1
     * @memberof colors
     */
    YELLOW_LIGHT_1: ('yellowLight1': 'yellowLight1'),
    /**
     * @alias colors.YELLOW_LIGHT_2
     * @memberof colors
     */
    YELLOW_LIGHT_2: ('yellowLight2': 'yellowLight2'),
    /**
     * @alias colors.YELLOW
     * @memberof colors
     */
    YELLOW: ('yellow': 'yellow'),
};

export default Colors;

/**
 * A value from the {@link colors} enum
 * @typedef string
 */
export type Color = $Values<typeof Colors>;

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
