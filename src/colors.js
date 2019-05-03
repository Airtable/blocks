// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const liveappColors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');

const liveappColorsToInclude = [
    'blueLight2',
    'cyanLight2',
    'tealLight2',
    'pinkLight2',
    'redLight2',
    'orangeLight2',
    'yellowLight2',
    'greenLight2',
    'purpleLight2',
    'grayLight2',

    'blueLight1',
    'cyanLight1',
    'tealLight1',
    'pinkLight1',
    'redLight1',
    'orangeLight1',
    'yellowLight1',
    'greenLight1',
    'purpleLight1',
    'grayLight1',

    'blueBright',
    'cyanBright',
    'tealBright',
    'pinkBright',
    'redBright',
    'orangeBright',
    'yellowBright',
    'greenBright',
    'purpleBright',
    'grayBright',

    'blue',
    'cyan',
    'teal',
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'purple',
    'gray',

    'blueDark1',
    'cyanDark1',
    'tealDark1',
    'pinkDark1',
    'redDark1',
    'orangeDark1',
    'yellowDark1',
    'greenDark1',
    'purpleDark1',
    'grayDark1',
];

const colors: {[string]: string} = {};
for (const color of liveappColorsToInclude) {
    h.assert(liveappColors.ALL_COLORS[color], 'Liveapp color names out of sync');

    // The name of the enum is the snakecased and uppercased version of the color
    // name. i.e. redDark1 -> RED_DARK_1
    const enumNameForColor = u.snakeCase(color).toUpperCase();
    colors[enumNameForColor] = color;
}

export default colors;
