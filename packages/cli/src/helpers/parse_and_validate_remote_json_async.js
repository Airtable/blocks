// @flow
const {getBlockDirPath} = require('./get_block_dir_path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const validateRemoteJson = require('./validate_remote_json');
const fsUtils = require('./fs_utils');
const path = require('path');
const invariant = require('invariant');

import type {Result} from '../types/result';
import type {RemoteJson} from '../types/remote_json_type';

async function parseAndValidateRemoteJsonAsync(
    remoteName: string | null,
    opts: {blockDirPath?: string} = {},
): Promise<Result<RemoteJson>> {
    const {blockDirPath = getBlockDirPath()} = opts;

    let remoteJsonFileName = blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH;
    if (remoteName) {
        remoteJsonFileName = `${remoteName}.${remoteJsonFileName}`;
    }

    const remoteJsonRelativePath = path.join(
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
        remoteJsonFileName,
    );
    const remoteJsonAbsolutePath = path.join(blockDirPath, remoteJsonRelativePath);
    const remoteJsonStr = await fsUtils.readFileIfExistsAsync(remoteJsonAbsolutePath, 'utf8');
    if (remoteJsonStr === null) {
        return {err: new Error(`Could not find file at ${remoteJsonRelativePath}`)};
    }
    invariant(typeof remoteJsonStr === 'string', 'expect remoteJsonStr to be string');
    let remoteJson;
    try {
        remoteJson = JSON.parse(remoteJsonStr);
    } catch (err) {
        return {err: new Error(`Could not parse ${remoteJsonFileName}`)};
    }

    // We are capturing the remoteName in the RemoteJson object because we will later use it to infer the
    // hyperbase RunEnvironment for fetching the correct backend blocks SDK (i.e. see downloadBackendSdkAsync() in
    // the download_backend_sdk_async.js file).
    // For 1P blocks, we have an internal, albeit loose, "pattern" of using the remoteName to infer the
    // hyperbase runEnvironment (for example, see https://github.com/Hyperbase/hyperbase/tree/4df2c56dd5feddbb789a490956d079378caabb48/blocks/org_chart/.block
    // directory for example of the various remote.json flavors).
    // A couple other notes:
    //   1/ The remoteName is the "prefix" before the first period in the "remote.json-based" filename (e.g.
    //      if the filename is staging.remote.json then the hyperbase RunEnvironment is "staging").
    //   2/ Only a subset of 1P blocks use the backend blocks SDK (e.g. org chart, web clipper, etc).
    if (remoteName) {
        remoteJson.remoteName = remoteName;
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
