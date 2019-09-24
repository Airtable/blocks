// @flow
/* eslint-disable no-console */
const path = require('path');
const invariant = require('invariant');
const chalk = require('chalk');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const getBlockDirPathModule = require('../get_block_dir_path');
const fsUtils = require('../helpers/fs_utils');
const validateRemoteName = require('../helpers/validate_remote_name');

import type {Argv} from 'yargs';

async function runCommandAsync(argv: Argv): Promise<void> {
    const {remoteName} = argv;
    invariant(typeof remoteName === 'string', 'expects remoteName to be a string');

    const remoteNameValidationResult = validateRemoteName(remoteName);
    if (!remoteNameValidationResult.pass) {
        throw new Error(`❌ ${remoteNameValidationResult.reason}`);
    }

    const blockDirPath = getBlockDirPathModule.getBlockDirPath();
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );
    const remoteNameWithPrefix = `${remoteName}.${blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH}`;
    const remoteJsonFilePath = path.join(blockConfigDirPath, remoteNameWithPrefix);
    const remoteJsonFilePathRelative = path.relative(process.cwd(), remoteJsonFilePath);

    if (!(await fsUtils.existsAsync(remoteJsonFilePath))) {
        console.error(`❌ The ${chalk.bold(remoteName)} remote does not exist.`);
        return;
    }

    await fsUtils.unlinkAsync(remoteJsonFilePath);
    console.log(`✅ Successfully removed the remote from ${remoteJsonFilePathRelative}!`);
}

module.exports = {runCommandAsync};
