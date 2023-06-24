// @flow
/* eslint-disable no-console */
const invariant = require('invariant');
const path = require('path');
const {ux} = require('@oclif/core');
const fsUtils = require('../helpers/fs_utils');
const parseAndValidateRemoteJsonAsync = require('../helpers/parse_and_validate_remote_json_async');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const getBlockDirPathModule = require('../helpers/get_block_dir_path');
const outputRemotesBetaWarning = require('../helpers/output_remotes_beta_warning');

import type {Argv} from 'yargs';
import type {RemoteJson} from '../types/remote_json_type';

type RemoteJsonWithName = {
    ...RemoteJson,
    name: string,
};

function _getRemoteName(fileName: string): string | null {
    const names = fileName.split('.');
    if (names.length === 2 && names[0] === 'remote') {
        return null;
    } else if (names.length !== 3) {
        throw new Error(
            `'${fileName}' is an incorrect remote filename format! Please remove the file and use 'block add-remote' to create it.`,
        );
    }
    return names[0];
}

async function _getRemoteJsonWithNameAsync(
    blockDirPath: string,
    blockConfigDirPath: string,
    fileName: string,
): Promise<RemoteJsonWithName> {
    const remoteName = _getRemoteName(fileName);
    const parseResult = await parseAndValidateRemoteJsonAsync(remoteName, {blockDirPath});
    if (parseResult.err) {
        throw parseResult.err;
    }
    const remoteJson = parseResult.value;

    return {
        name: remoteName === null ? 'default' : remoteName,
        ...remoteJson,
    };
}

async function runCommandAsync(argv: Argv): Promise<void> {
    outputRemotesBetaWarning();

    const blockDirPath = getBlockDirPathModule.getBlockDirPath();
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );

    const fileNames = await fsUtils.readDirIfExistsAsync(blockConfigDirPath);

    if (fileNames === null) {
        throw new Error('Block configuration directory missing!');
    }

    if (fileNames.length === 0) {
        throw new Error('No remotes found!');
    }
    invariant(Array.isArray(fileNames), 'expect fileNames to be Array');
    const remoteJsonFileNames = fileNames.filter(fileName =>
        fileName.endsWith(blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
    );
    if (remoteJsonFileNames.length === 0) {
        console.log('No remotes found!');
        return;
    }

    const remoteJsonsWithName = await Promise.all(
        remoteJsonFileNames.map(fileName => {
            return _getRemoteJsonWithNameAsync(blockDirPath, blockConfigDirPath, fileName);
        }),
    );

    const doesServerValueExist = remoteJsonsWithName.some(remoteJson => !!remoteJson.server);
    const doesApiKeyNameValueExist = remoteJsonsWithName.some(
        remoteJson => !!remoteJson.apiKeyName,
    );

    const columns: ux.Table.Columns = {
        name: {},
        'Block identifier': {
            get: row => `${row.baseId}/${row.blockId}`,
        },
    };
    if (doesServerValueExist) {
        columns.server = {};
    }
    if (doesApiKeyNameValueExist) {
        columns['Api key name'] = {
            get: row => row.apiKeyName,
        };
    }

    await ux.table(remoteJsonsWithName, columns);
}

module.exports = {runCommandAsync};
