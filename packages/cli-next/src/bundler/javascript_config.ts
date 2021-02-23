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

const plugins = ['@babel/plugin-transform-flow-strip-types'] as const;

const babelOptions = {
    presets,
    plugins,
    babelrc: false,
    configFile: false,
};

function resolveBabelDependency(dependency: string | readonly [string, ...any[]]) {
    if (typeof dependency === 'string') {
        return require.resolve(dependency);
    } else {
        return [require.resolve(dependency[0]), ...dependency.slice(1)];
    }
}

export async function createJavascriptAssetConfigAsync({
    path,
}: System): Promise<JavascriptAssetOptions> {
    return {
        assetType: 'javascript',

        transpiler: 'babel',
        options: {
            ...babelOptions,
            presets: presets.map(resolveBabelDependency),
            plugins: plugins.map(resolveBabelDependency),
        },
    };
}
