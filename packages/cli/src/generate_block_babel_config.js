// @flow
const babelPresetEnv = require('@babel/preset-env');
const babelPresetReact = require('@babel/preset-react');
const babelPresetFlow = require('@babel/preset-flow');
const babelPluginProposalClassProperties = require('@babel/plugin-proposal-class-properties');

/**
 * See documented formats for presets:
 * https://babeljs.io/docs/en/presets
 */
type BabelPresets = Array<mixed>;

/**
 * See documented formats for presets:
 * https://babeljs.io/docs/en/plugins
 */
type BabelPlugins = Array<mixed>;

type BabelConfig = {
    presets: BabelPresets,
    plugins: BabelPlugins,
    retainLines: boolean,
    minified: boolean,
};

/**
 * See documented format for 'targets' option on @babel/preset-env:
 * https://babeljs.io/docs/en/babel-preset-env#targets
 */
type BabelPresetEnvTargetsOption =
    | string
    | Array<string>
    | {
          [string]: string,

          // see: https://babeljs.io/docs/en/babel-preset-env#targetsesmodules
          esmodules?: boolean,

          // see: https://babeljs.io/docs/en/babel-preset-env#targetsnode
          node?: string | 'current' | true,

          // see: https://babeljs.io/docs/en/babel-preset-env#targetssafari
          safari?: string | 'tp',

          // NOTE(richsinn): Babel docs note that this will be removed in later versions.
          // see: https://babeljs.io/docs/en/babel-preset-env#targetsbrowsers
          browsers?: string | Array<string>,
      };

function generateBlockBabelConfig(targets: BabelPresetEnvTargetsOption): BabelConfig {
    return {
        presets: [[babelPresetEnv, {targets}], babelPresetReact, babelPresetFlow],
        plugins: [babelPluginProposalClassProperties],
        retainLines: true,
        minified: true,
    };
}

module.exports = generateBlockBabelConfig;
