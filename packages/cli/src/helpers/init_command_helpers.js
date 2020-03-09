// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {npmAsync, gitAsync} = require('./node_modules_command_helpers');

const TMP_DIRECTORY_NAME = 'tmp';

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    await gitAsync(blockDirPath, ['clone', template, TMP_DIRECTORY_NAME]);
    // Maybe add a flag to handle blocks that aren't at the top level of the repo?
    return path.join(blockDirPath, TMP_DIRECTORY_NAME);
}

async function cleanUpDownloadedTemplateAsync(blockDirPath: string): Promise<void> {
    await fsUtils.removeAsync(path.join(blockDirPath, TMP_DIRECTORY_NAME));
}

async function installBlockDependenciesAsync(blockDirPath: string): Promise<void> {
    await npmAsync(blockDirPath, ['install', '--loglevel=error']);
}

const initCommandHelpers = {
    downloadTemplateAsync,
    cleanUpDownloadedTemplateAsync,
    installBlockDependenciesAsync,
};

module.exports = initCommandHelpers;
