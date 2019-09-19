// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {npmAsync} = require('./node_modules_command_helpers');

const TMP_DIRECTORY_NAME = 'tmp';

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    await npmAsync(blockDirPath, [
        'install',
        '--loglevel=error',
        `--prefix=${TMP_DIRECTORY_NAME}`,
        template,
    ]);
    const templatePath = path.join(blockDirPath, TMP_DIRECTORY_NAME, 'node_modules', template);
    return templatePath;
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
