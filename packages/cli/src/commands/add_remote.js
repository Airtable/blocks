// @flow
/* eslint-disable no-console */
const path = require('path');
const invariant = require('invariant');
const chalk = require('chalk');
const CommandNames = require('./command_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const getBlockDirPathModule = require('../helpers/get_block_dir_path');
const fsUtils = require('../helpers/fs_utils');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const validateRemoteName = require('../helpers/validate_remote_name');

import type {Argv} from 'yargs';
import type {RemoteJson} from '../types/remote_json_type';

async function runCommandAsync(argv: Argv): Promise<void> {
    const {blockIdentifier, remoteName} = argv;
    invariant(typeof blockIdentifier === 'string', 'expects blockIdentifier to be a string');
    invariant(typeof remoteName === 'string', 'expects remoteName to be a string');

    const serverIfExists = argv.server || null;
    invariant(
        serverIfExists === null || typeof serverIfExists === 'string',
        'expects server to be null or a string',
    );
    const apiKeyNameIfExists = argv.apiKeyName || null;
    invariant(
        apiKeyNameIfExists === null || typeof apiKeyNameIfExists === 'string',
        'expects apiKeyName to be null or a string',
    );

    const remoteNameValidationResult = validateRemoteName(remoteName);
    if (!remoteNameValidationResult.pass) {
        throw new Error(`❌ ${remoteNameValidationResult.reason}`);
    }

    const blockIdentifierParseResult = parseBlockIdentifier(blockIdentifier);
    if (!blockIdentifierParseResult.success) {
        throw blockIdentifierParseResult.error;
    }
    const {baseId, blockId} = blockIdentifierParseResult.value;

    const remoteJsonObject: RemoteJson = {
        baseId,
        blockId,
    };
    if (serverIfExists !== null) {
        remoteJsonObject.server = serverIfExists;
    }
    if (apiKeyNameIfExists !== null) {
        remoteJsonObject.apiKeyName = apiKeyNameIfExists;
    }

    const blockDirPath = getBlockDirPathModule.getBlockDirPath();
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );
    const remoteNameWithPrefix = `${remoteName}.${blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH}`;
    const remoteJsonFilePath = path.join(blockConfigDirPath, remoteNameWithPrefix);
    const remoteJsonFilePathRelative = path.relative(process.cwd(), remoteJsonFilePath);

    if (await fsUtils.existsAsync(remoteJsonFilePath)) {
        console.error(`❌ The ${chalk.bold(remoteName)} remote already exists!
If you want to update the remote, please run ${chalk.bold(
            `block ${CommandNames.REMOVE_REMOTE} ${remoteName}`,
        )} and re-run ${chalk.bold(`block ${CommandNames.ADD_REMOTE}`)}!`);
        return;
    }

    await fsUtils.mkdirPathAsync(blockConfigDirPath);
    await fsUtils.writeFileAsync(
        remoteJsonFilePath,
        JSON.stringify(remoteJsonObject, null, 4) + '\n',
    );
    console.log(`✅ Successfully added a new remote at ${remoteJsonFilePathRelative}!`);
}

module.exports = {runCommandAsync};
