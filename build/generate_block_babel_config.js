"use strict";var babelPresetEnv = require('@babel/preset-env');
var babelPresetReact = require('@babel/preset-react');
var babelPresetFlow = require('@babel/preset-flow');
var babelPluginProposalClassProperties = require('@babel/plugin-proposal-class-properties');

function generateBlockBabelConfig(targets) {
  return {
    presets: [
    [babelPresetEnv, { targets: targets }],
    babelPresetReact,
    babelPresetFlow],

    plugins: [babelPluginProposalClassProperties],
    retainLines: true,
    minified: true };

}

module.exports = generateBlockBabelConfig;