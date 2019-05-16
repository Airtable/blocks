/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const blockCliConfigSettings = require('./config/block_cli_config_settings');

// eslint-disable-next-line consistent-return
module.exports = function getApiKeySync(blockDirPath) {
    try {
        const apiKey = fs.readFileSync(
            path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
            'utf8',
        ).trim();

        // Validate that it looks like an API key.
        if (!/key[0-ZA-Za-z]{14}/.test(apiKey)) {
            console.log(
                'The Airtable API key looks invalid.\n' +
                    'Please go to https://airtable.com/account, copy your API key,\n' +
                    'and put it in a file called ' +
                    blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
            );
            process.exit(1);
        }

        return apiKey;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(
                "There doesn't seem to be an API key configured.\n" +
                    'Please go to https://airtable.com/account, copy your API key,\n' +
                    'and put it in a file called ' +
                    blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
            );
            process.exit(1);
        } else {
            throw err;
        }
    }
};
