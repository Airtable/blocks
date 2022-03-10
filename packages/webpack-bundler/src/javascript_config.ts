import {JavascriptAssetOptions} from './webpack_config';

const presetEnvOptions = {
    targets: {
        browsers: [
            // From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
            'firefox >= 52',
            'chrome >= 67',
            'safari >= 11',
            'edge >= 25',
        ],
    },
    // Enable proposals that have been shipped by browsers that may not have
    // been accepted.
    //
    // > v7.10.0 Include class properties and private methods
    // https://babeljs.io/docs/en/babel-preset-env#shippedproposals
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
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript'),
            ],
            plugins: [],
        },
    };
}
