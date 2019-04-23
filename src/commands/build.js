// @flow
const BlockBuilder = require('../builder/block_builder');
const path = require('path');

import type {Argv} from 'yargs';

function _getOutputDirPath(): string {
    const timestampString = new Date().getTime().toString();
    return path.join('/tmp', 'build', timestampString);
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const blockBuilder = new BlockBuilder();
    const outputDirPath = _getOutputDirPath();
    const buildResult = await blockBuilder.buildAsync(outputDirPath);
    if (!buildResult.success) {
        throw buildResult.error;
    }
}

module.exports = {runCommandAsync};
