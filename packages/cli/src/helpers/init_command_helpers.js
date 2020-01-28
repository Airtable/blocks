// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {npmAsync, gitAsync} = require('./node_modules_command_helpers');

const TMP_DIRECTORY_NAME = 'tmp';

function isGitTemplate(template: string): boolean {
    return template.startsWith('https://') || template.startsWith('git@');
}

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    if (isGitTemplate(template)) {
        await gitAsync(blockDirPath, ['clone', template, TMP_DIRECTORY_NAME]);
        // Maybe add a flag to handle blocks that aren't at the top level of the repo?
        return path.join(blockDirPath, TMP_DIRECTORY_NAME);
    } else {
        await npmAsync(blockDirPath, [
            'install',
            '--loglevel=error',
            `--prefix=${TMP_DIRECTORY_NAME}`,
            template,
        ]);
        return path.join(blockDirPath, TMP_DIRECTORY_NAME, 'node_modules', template);
    }
}

async function cleanUpDownloadedTemplateAsync(blockDirPath: string): Promise<void> {
    await fsUtils.removeAsync(path.join(blockDirPath, TMP_DIRECTORY_NAME));
}

async function installBlockDependenciesAsync(blockDirPath: string): Promise<void> {
    await npmAsync(blockDirPath, ['install', '--loglevel=error']);
}

const initCommandHelpers = {
    isGitTemplate,
    downloadTemplateAsync,
    cleanUpDownloadedTemplateAsync,
    installBlockDependenciesAsync,
};

module.exports = initCommandHelpers;
