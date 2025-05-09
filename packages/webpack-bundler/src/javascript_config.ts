import {JavascriptAssetOptions} from './webpack_config';

const presetEnvOptions = {
    targets: {
        browsers: [
            'firefox >= 52',
            'chrome >= 67',
            'safari >= 11',
            'edge >= 25',
        ],
    },
    shippedProposals: true,
};

export function createJavascriptAssetConfig(): JavascriptAssetOptions {
    return {
        assetType: 'javascript',

        transpiler: 'babel',
        options: {
            babelrc: false,
            configFile: false,
            presets: [
                [require.resolve('@babel/preset-env'), presetEnvOptions],
                [require.resolve('@babel/preset-react'), {runtime: 'automatic'}],
                require.resolve('@babel/preset-typescript'),
            ],
            plugins: [],
        },
    };
}
