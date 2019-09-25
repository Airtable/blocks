// @flow
import {type Color} from '../../colors';

const colors = {
    // neutrals
    white: 'hsl(0, 0%, 100%)',
    dark: 'hsl(0, 0%, 20%)',
    // light is the lightest text color possible.
    light: 'hsl(0, 0%, 46%)',

    lighten1: 'hsla(0, 0%, 100%, 0.05)',
    lighten2: 'hsla(0, 0%, 100%, 0.1)',
    lighten3: 'hsla(0, 0%, 100%, 0.25)',
    lighten4: 'hsla(0, 0%, 100%, 0.5)',

    darken1: 'hsla(0, 0%, 0%, 0.05)',
    darken2: 'hsla(0, 0%, 0%, 0.1)',
    darken3: 'hsla(0, 0%, 0%, 0.25)',
    darken4: 'hsla(0, 0%, 0%, 0.5)',

    // blue
    blueBright: 'rgb(45, 127, 249)',
    blue: 'rgb(18, 131, 218)',
    blueDark1: 'rgb(39, 80, 174)',
    blueLight1: 'rgb(156, 199, 255)',
    blueLight2: 'rgb(207, 223, 255)',

    // cyan
    cyanBright: 'rgb(24, 191, 255)',
    cyan: 'rgb(1, 169, 219)',
    cyanDark1: 'rgb(11, 118, 183)',
    cyanLight1: 'rgb(119, 209, 243)',
    cyanLight2: 'rgb(208, 240, 253)',

    // gray
    grayBright: 'rgb(102, 102, 102)',
    gray: 'rgb(102, 102, 102)',
    grayDark1: 'rgb(68, 68, 68)',
    grayLight1: 'rgb(204, 204, 204)',
    grayLight2: 'rgb(238, 238, 238)',

    // green
    greenBright: 'rgb(32, 201, 51)',
    green: 'rgb(17, 175, 34)',
    greenDark1: 'rgb(51, 138, 23)',
    greenLight1: 'rgb(147, 224, 136)',
    greenLight2: 'rgb(209, 247, 196)',

    // orange
    orangeBright: 'rgb(255, 111, 44)',
    orange: 'rgb(247, 101, 59)',
    orangeDark1: 'rgb(215, 77, 38)',
    orangeLight1: 'rgb(255, 169, 129)',
    orangeLight2: 'rgb(254, 226, 213)',

    // pink
    pinkBright: 'rgb(255, 8, 194)',
    pink: 'rgb(233, 41, 186)',
    pinkDark1: 'rgb(178, 21, 139)',
    pinkLight1: 'rgb(249, 157, 226)',
    pinkLight2: 'rgb(255, 218, 246)',

    // purple
    purpleBright: 'rgb(139, 70, 255)',
    purple: 'rgb(124, 57, 237)',
    purpleDark1: 'rgb(107, 28, 176)',
    purpleLight1: 'rgb(205, 176, 255)',
    purpleLight2: 'rgb(237, 226, 254)',

    // red
    redBright: 'rgb(248, 43, 96)',
    red: 'rgb(229, 46, 77)',
    redDark1: 'rgb(186, 30, 69)',
    redLight1: 'rgb(255, 158, 183)',
    redLight2: 'rgb(255, 220, 229)',

    // teal
    tealBright: 'rgb(32, 217, 210)',
    teal: 'rgb(2, 170, 164)',
    tealDark1: 'rgb(6, 160, 155)',
    tealLight1: 'rgb(114, 221, 195)',
    tealLight2: 'rgb(194, 245, 233)',

    // yellow
    yellowBright: 'rgb(252, 180, 0)',
    yellow: 'rgb(224, 141, 0)',
    yellowDark1: 'rgb(184, 117, 3)',
    yellowLight1: 'rgb(255, 214, 110)',
    yellowLight2: 'rgb(255, 234, 182)',
};

const textColorsByBackgroundColor: {[Color]: string} = {
    // blue bg
    blueBright: 'white',
    blue: 'white',
    blueDark1: 'rgb(207, 223, 255)',
    blueLight1: 'rgb(0, 0, 60)',
    blueLight2: 'rgb(0, 0, 60)',

    // cyan bg
    cyanBright: 'white',
    cyan: 'white',
    cyanDark1: 'rgb(208, 240, 253)',
    cyanLight1: 'rgb(0, 17, 68)',
    cyanLight2: 'rgb(0, 17, 68)',

    // gray bg
    grayBright: 'white',
    gray: 'white',
    grayDark1: 'rgb(238, 238, 238)',
    grayLight1: 'rgb(0, 0, 0)',
    grayLight2: 'rgb(0, 0, 0)',

    // green bg
    greenBright: 'white',
    green: 'white',
    greenDark1: 'rgb(209, 247, 196)',
    greenLight1: 'rgb(0, 34, 0)',
    greenLight2: 'rgb(0, 34, 0)',

    // orange bg
    orangeBright: 'white',
    orange: 'white',
    orangeDark1: 'rgb(254, 226, 213)',
    orangeLight1: 'rgb(83, 0, 0)',
    orangeLight2: 'rgb(83, 0, 0)',

    // pink bg
    pinkBright: 'white',
    pink: 'white',
    pinkDark1: 'rgb(255, 218, 246)',
    pinkLight1: 'rgb(58, 0, 33)',
    pinkLight2: 'rgb(58, 0, 33)',

    // purple bg
    purpleBright: 'white',
    purple: 'white',
    purpleDark1: 'rgb(237, 226, 254)',
    purpleLight1: 'rgb(12, 0, 62)',
    purpleLight2: 'rgb(12, 0, 62)',

    // red bg
    redBright: 'white',
    red: 'white',
    redDark1: 'rgb(255, 220, 229)',
    redLight1: 'rgb(64, 0, 0)',
    redLight2: 'rgb(64, 0, 0)',

    // teal bg
    tealBright: 'white',
    teal: 'white',
    tealDark1: 'rgb(194, 245, 233)',
    tealLight1: 'rgb(0, 47, 46)',
    tealLight2: 'rgb(0, 47, 46)',

    // yellow bg
    yellowBright: 'white',
    yellow: 'white',
    yellowDark1: 'rgb(255, 234, 182)',
    yellowLight1: 'rgb(66, 10, 0)',
    yellowLight2: 'rgb(66, 10, 0)',
};

const textColors = {
    dark: colors.dark,
    default: colors.dark,
    light: colors.light,
};

const breakpoints = {
    xsmallViewport: '480px',
    smallViewport: '640px',
    mediumViewport: '832px',
    largeViewport: '1152px',
};

const borderWidths = {
    default: '1px',
    thick: '2px',
};

const borders = {
    default: `1px solid ${colors.darken2}`,
    thick: `2px solid ${colors.darken2}`,
};

const fontFamilies = {
    default:
        "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    monospace: ' Menlo, Courier, monospace',
};

// On Mac OS X when `-apple-system` is used, two different fonts are rendered at different font sizes.
// SF Pro Text is used under 21px (0-5) and SF Pro Display is used from 21px and up (6-9).
// SF Pro Text visually looks slightly bigger than SF Pro Display.
export const fontSizes = [
    '9px', // 0
    '11px', // 1
    '13px', // 2
    '15px', // 3
    '17px', // 4
    '19px', // 5
    '21px', // 6
    '23px', // 7
    '27px', // 8
    '35px', // 9
];

const textSizesByVariant = {
    default: {
        xsmall: {
            fontSize: 1,
            lineHeight: '14px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginY: 0,
        },
        small: {
            fontSize: 2,
            lineHeight: '16px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginY: 0,
        },
        default: {
            fontSize: 3,
            lineHeight: '20px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginY: 0,
        },
        large: {
            fontSize: 4,
            lineHeight: '24px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginY: 0,
        },
    },
    paragraph: {
        xsmall: {
            fontSize: 1,
            lineHeight: '16px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: '1em',
        },
        small: {
            fontSize: 2,
            lineHeight: '20px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: '1em',
        },
        default: {
            fontSize: 3,
            lineHeight: '22px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: '1em',
        },
        large: {
            fontSize: 4,
            lineHeight: '26px',
            fontWeight: 400,
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: '1em',
        },
    },
};

export const headingSizesByVariant = {
    default: {
        xsmall: {
            fontSize: 3,
            fontWeight: 700,
            lineHeight: '22px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        small: {
            fontSize: 4,
            fontWeight: 600,
            lineHeight: '24px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        // We skip fontSize 5, because font sizes below 6 (21px) the font will render SF Pro Text instead of SF Pro Display.
        // SF Pro Text visually looks slightly bigger than SF Pro Display and 5 and 6 would look very similar.
        default: {
            fontSize: 6,
            fontWeight: 500,
            lineHeight: '26px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        large: {
            fontSize: 7,
            fontWeight: 500,
            lineHeight: '29px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        xlarge: {
            fontSize: 8,
            fontWeight: 500,
            lineHeight: '34px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
        xxlarge: {
            fontSize: 9,
            fontWeight: 500,
            lineHeight: '44px',
            letterSpacing: '-0.01em',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
    },
    caps: {
        xsmall: {
            fontSize: 1,
            fontWeight: 700,
            lineHeight: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        small: {
            fontSize: 2,
            fontWeight: 600,
            lineHeight: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        default: {
            fontSize: 3,
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
        // Bigger all caps heading sizes are are omitted since they are not desirable.
    },
};

const fontWeights = {
    strong: 500,
};

const opacities = {
    normal: 1,
    quiet: 0.75,
    quieter: 0.5,
    quietest: 0.25,
    invisible: 0,
};

const radii = {
    default: 3,
    large: 6,
    circle: 9999,
};

const space = [0, 4, 8, 16, 32, 64, 128];

export default {
    colors,
    textColorsByBackgroundColor,
    textColors,
    breakpoints,
    borderWidths,
    borders,
    fontFamilies,
    fontSizes,
    textSizesByVariant,
    headingSizesByVariant,
    fontWeights,
    opacities,
    radii,
    space,
};
