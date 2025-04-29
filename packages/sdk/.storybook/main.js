import {join, dirname} from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config = {
    stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

    addons: [
        getAbsolutePath('@storybook/addon-actions'),
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {},
    },

    webpackFinal: async config => {
        return config;
    },
};
export default config;
