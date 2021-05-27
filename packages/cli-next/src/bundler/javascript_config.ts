import {System} from '../helpers/system';
import {JavascriptAssetOptions} from './webpack_config';

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
