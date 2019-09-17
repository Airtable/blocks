// @flow
/* eslint-disable no-console */
const parseBlockJsonAsync = require('../helpers/parse_block_json_async');
const doesBlockJsonResembleOldFormat = require('../helpers/does_block_json_resemble_old_format');
const SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const {getBlockDirPath} = require('../get_block_dir_path');
const fsUtils = require('../fs_utils');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

import type {BlockJson} from '../types/block_json_type';
import type {Argv} from 'yargs';

/**
 * WARNING: We should only migrate backend blocks if it does not make use of the dev creds feature.
 */
async function _promptToContinueBackendRoutesMigrationAsync(): Promise<boolean> {
    const {shouldContinueBackendMigration} = await inquirer.prompt({
        type: 'confirm',
        default: false,
        name: 'shouldContinueBackendMigration',
        message:
            "Detected backend routes! Not all backend routes are supported for migration. Continue anyway because I know what I'm doing?",
    });

    return shouldContinueBackendMigration;
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const blockDirPath = getBlockDirPath();

    // NOTE: don't use parseAndValidateBlockJsonAsync, since we're explicitly looking
    // for the old (now invalid) format of block json.
    const blockJsonParseResult = await parseBlockJsonAsync();
    if (blockJsonParseResult.err) {
        throw blockJsonParseResult.err;
    }

    const blockJson = blockJsonParseResult.value;
    if (!(blockJson instanceof Object) || !doesBlockJsonResembleOldFormat(blockJson)) {
        throw new Error('You can only migrate blocks with the old block.json format');
    }

    const {frontendEntryModuleName, applicationId, blockId, environment, modules} = blockJson;

    const hasBackend =
        modules.findIndex(blockModule => blockModule.metadata.type === 'backendRoute') > -1;
    if (hasBackend) {
        const shouldContinueBackendMigration = await _promptToContinueBackendRoutesMigrationAsync();
        if (!shouldContinueBackendMigration) {
            console.log(chalk.bold.yellow('Canceled migration!'));
            return;
        }
    }

    // 1. Migrate frontendEntry module
    const newBlockJson: BlockJson = {
        frontendEntry: `./${SupportedTopLevelDirectoryNames.FRONTEND}/${frontendEntryModuleName}`,
    };

    // 2. Migrate backend routes if necessary. Old blocks have a strict folder structure, and
    //    all the handler files are under the `backendRoute` directory.
    if (hasBackend) {
        newBlockJson.routes = [];
        for (const blockModule of modules) {
            if (blockModule.metadata.type === 'backendRoute') {
                newBlockJson.routes.push({
                    urlPath: blockModule.metadata.urlPath,
                    handler: `./backendRoute/${blockModule.metadata.name}`,
                    methods: [blockModule.metadata.method],
                });
            }
        }
    }

    let server;
    if (environment) {
        switch (environment) {
            case 'production':
                server = blockCliConfigSettings.AIRTABLE_API_URL;
                break;
            case 'staging':
                server = 'https://api-staging.airtable.com';
                break;
            case 'local':
                server = 'https://api.hyperbasedev.com:3000';
                break;
            default:
                throw new Error(`unrecognized environment: ${environment}`);
        }
    }

    const remoteJson = {
        blockId,
        baseId: applicationId,
        ...(server ? {server} : {}),
    };

    // Write remote.json
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );
    await fsUtils.mkdirPathAsync(blockConfigDirPath);
    await fsUtils.writeFileAsync(
        path.join(blockConfigDirPath, blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
        JSON.stringify(remoteJson, null, 4) + '\n',
    );

    // Overwrite block.json
    await fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(newBlockJson, null, 4) + '\n',
    );

    console.log(
        `${chalk.bold.white('✅ Migration succeeded!')} Please double check the modified files`,
    );
}

module.exports = {runCommandAsync};
