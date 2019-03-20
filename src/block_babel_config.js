const babelPresetEnv = require('babel-preset-env');
const babelPresetReact = require('babel-preset-react');
const stage2BabelPreset = require('babel-preset-stage-2');

module.exports = {
    presets: [babelPresetEnv, babelPresetReact, stage2BabelPreset],
    retainLines: true,
    minified: true,
};
