// @flow
const {getBlockDirPath} = require('../get_block_dir_path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const validateRemoteJson = require('./validate_remote_json');
const fsUtils = require('../fs_utils');
const path = require('path');

import type {Result} from '../types/result';
import type {RemoteJson} from '../types/remote_json_type';

async function parseAndValidateRemoteJsonAsync(
    remoteName: string | null,
): Promise<Result<RemoteJson>> {
    const blockDirPath = getBlockDirPath();

    let remoteJsonFileName = blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH;
    if (remoteName) {
        remoteJsonFileName = `${remoteName}.${remoteJsonFileName}`;
    }

    const remoteJsonRelativePath = path.join(
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
        remoteJsonFileName,
    );
    const remoteJsonAbsolutePath = path.join(blockDirPath, remoteJsonRelativePath);
    const remoteJsonStr = await fsUtils.readFileIfExistsAsync(remoteJsonAbsolutePath);
    if (remoteJsonStr === null) {
        return {err: new Error(`Could not find file at ${remoteJsonRelativePath}`)};
    }
    let remoteJson;
    try {
        remoteJson = JSON.parse(remoteJsonStr);
    } catch (err) {
        return {err: new Error(`Could not parse ${remoteJsonFileName}`)};
    }
    const validationResult = validateRemoteJson(remoteJson);
    if (!validationResult.pass) {
        return {err: new Error(validationResult.reason)};
    }
    return {
        value: ((remoteJson: any): RemoteJson), // eslint-disable-line flowtype/no-weak-types
    };
}

module.exports = parseAndValidateRemoteJsonAsync;
