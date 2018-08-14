const babelPresetEnv = require('babel-preset-env');
const babelPresetReact = require('babel-preset-react');
const stage3BabelPreset = require('babel-preset-stage-3');

module.exports = {
    presets: [babelPresetEnv, babelPresetReact, stage3BabelPreset],
    retainLines: true,
    minified: true,
};
