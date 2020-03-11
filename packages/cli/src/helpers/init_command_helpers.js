// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {npmAsync, gitAsync} = require('./node_modules_command_helpers');

const TMP_DIRECTORY_NAME = 'tmp';

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    await gitAsync(blockDirPath, ['clone', '--quiet', template, TMP_DIRECTORY_NAME]);
    // We remove the .git directory since users might find the git history confusing especially
    // since we make some uncommitted changes and the git remote isn't one they can push to.
    await fsUtils.removeAsync(path.join(blockDirPath, TMP_DIRECTORY_NAME, '.git'));
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
