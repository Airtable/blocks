// @flow
/* eslint-disable no-console */
'use strict';

const blockCliConfigSettings = require('./config/block_cli_config_settings');
const configHelpers = require('./helpers/config_helpers');
const invariant = require('invariant');

async function getApiKeyWithWarningsAsync(): Promise<string> {
    // TODO(emma): When `block setApiKey` exists, update messages here to include it instead of
    // these instructions
    const instructions = `Please go to ${blockCliConfigSettings.AIRTABLE_ACCOUNT_URL}, copy your API key,\n` +
        'and put it in a file called ' +
        blockCliConfigSettings.CONFIG_FILE_NAME +
        ' with the following format:\n {airtableApiKey: YOUR_KEY_HERE}';

    const apiKey = await configHelpers.getApiKeyIfExistsAsync();

    if (apiKey === null) {
        console.log(
            "There doesn't seem to be an API key configured.\n" + instructions,
        );
        process.exit(1);
    }

    invariant(typeof apiKey === 'string', 'apiKey should be string');
    // Validate that it looks like an API key.
    if (!/key[0-ZA-Za-z]{14}/.test(apiKey)) {
        console.log(
            'The Airtable API key looks invalid.\n' + instructions,
        );
        process.exit(1);
    }

    return apiKey;
}

module.exports = getApiKeyWithWarningsAsync;
