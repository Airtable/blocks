// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const getBlockDirPath = require('./get_block_dir_path');
const blocksConfigSettings = require('./config/block_cli_config_settings');

import type {BlockDeveloperCredentialEncrypted} from './types/block_developer_credential_types';

async function getDeveloperCredentialsEncryptedIfExistsAsync(): Promise<Array<BlockDeveloperCredentialEncrypted> | null> {
    const blockDirPath = getBlockDirPath();

    const developerCredentialsFilePath = path.join(blockDirPath, blocksConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME);
    const developerCredentialsFile = await fsUtils.readFileIfExistsAsync(developerCredentialsFilePath);
    if (developerCredentialsFile === null) {
        return null;
    }

    let developerCredentialsEncrypted;
    if (developerCredentialsFile) {
        const {developerCredentials} = JSON.parse(developerCredentialsFile);
        developerCredentialsEncrypted = developerCredentials ?
            JSON.parse(Buffer.from(developerCredentials, 'base64').toString('utf8')) :
            null;
    } else {
        developerCredentialsEncrypted = null;
    }

    return developerCredentialsEncrypted;
}

module.exports = getDeveloperCredentialsEncryptedIfExistsAsync;
