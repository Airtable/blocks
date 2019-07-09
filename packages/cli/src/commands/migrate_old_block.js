// @flow
const parseBlockJsonAsync = require('../helpers/parse_block_json_async');
const doesBlockJsonResembleOldFormat = require('../helpers/does_block_json_resemble_old_format');
const SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const {getBlockDirPath} = require('../get_block_dir_path');
const fsUtils = require('../fs_utils');
const path = require('path');

import type {Argv} from 'yargs';

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

    for (const module of modules) {
        if (module.metadata.type === 'backendRoute') {
            throw new Error('Migrating blocks with backend routes is not currently supported');
        }
    }

    const newBlockJson = {
        frontendEntry: `./${SupportedTopLevelDirectoryNames.FRONTEND}/${frontendEntryModuleName}`,
    };

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
        JSON.stringify(remoteJson, null, 4),
    );

    // Overwrite block.json
    await fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(newBlockJson, null, 4),
    );
}

module.exports = {runCommandAsync};
