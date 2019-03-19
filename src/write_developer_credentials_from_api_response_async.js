// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const blocksConfigSettings = require('./config/block_cli_config_settings');

import type {BlockDeveloperCredentialEncrypted} from './types/block_developer_credential_types';

async function writeDeveloperCredentialsFromApiResponseAsync(
    developerCredentialsEncrypted: ?Array<BlockDeveloperCredentialEncrypted>,
    blockDirPath: string,
): Promise<void> {

    if (!developerCredentialsEncrypted) {
        return;
    }

    let developerCredentialsBase64;
    if (developerCredentialsEncrypted.length > 0) {
        // NOTE(richsinn): We stringify then base64 encode here to discourage
        //   direct tampering of developer credential values. Access and modifications
        //   to developer credentials should only be done via the cli commands.
        developerCredentialsBase64 =
            Buffer.from(JSON.stringify(developerCredentialsEncrypted), 'utf8').toString('base64');
    } else {
        developerCredentialsBase64 = null;
    }

    await fsUtils.writeFileAsync(
        path.join(blockDirPath, blocksConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME),
        JSON.stringify(
            {
                developerCredentials: developerCredentialsBase64,
            },
            null,
            4,
        ),
    );
}

module.exports = writeDeveloperCredentialsFromApiResponseAsync;
