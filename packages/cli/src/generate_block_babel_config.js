const babelPresetEnv = require('@babel/preset-env');
const babelPresetReact = require('@babel/preset-react');
const babelPresetFlow = require('@babel/preset-flow');
const babelPluginProposalClassProperties = require('@babel/plugin-proposal-class-properties');

function generateBlockBabelConfig(targets) {
    return {
        presets: [[babelPresetEnv, {targets}], babelPresetReact, babelPresetFlow],
        plugins: [babelPluginProposalClassProperties],
        retainLines: true,
        minified: true,
    };
}

module.exports = generateBlockBabelConfig;
