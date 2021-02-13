import {System} from '../helpers/system';
import {JavascriptAssetOptions} from './webpack_config';

// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
const allSupportedBrowsers: Array<string> = [
    'firefox >= 52',
    'chrome >= 67',
    'safari >= 10',
    'edge >= 25',
];

const presetEnvOptions = {
    targets: {
        browsers: allSupportedBrowsers,
    },
    // Enable proposals that have been shipped by browsers that may not have
    // been accepted.
    //
    // > v7.10.0 Include class properties and private methods
    // https://babeljs.io/docs/en/babel-preset-env#shippedproposals
    shippedProposals: true,
};

const presets = [
    ['@babel/preset-env', presetEnvOptions],
    '@babel/preset-react',
    '@babel/preset-typescript',
] as const;

const babelOptions = {
    presets,
    babelrc: false,
    configFile: false,
};

export async function createJavascriptAssetConfigAsync({
    path,
}: System): Promise<JavascriptAssetOptions> {
    return {
        assetType: 'javascript',

        transpiler: 'babel',
        options: {
            ...babelOptions,
            presets: presets.map(preset => {
                if (typeof preset === 'string') {
                    return require.resolve(preset);
                } else {
                    return [require.resolve(preset[0]), ...preset.slice(1)];
                }
            }),
        },
    };
}
