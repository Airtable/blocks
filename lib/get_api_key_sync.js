/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('../config/block_cli_config_settings');

module.exports = function getApiKeySync(blockDirPath) { // eslint-disable-line consistent-return
    try {
        const apiKey = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME), 'utf8');
        return apiKey.trim();
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(
                "There doesn't seem to be an API key configured.\n" +
                'Please go to https://airtable.com/account, copy your API key,\n' +
                'and put it in a file called ' + blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME
            );
            process.exit(1);
        } else {
            throw err;
        }
    }
};
