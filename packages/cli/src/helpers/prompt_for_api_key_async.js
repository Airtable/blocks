// @flow
const cliHelpers = require('./cli_helpers');
const {AIRTABLE_ACCOUNT_URL} = require('../config/block_cli_config_settings');

async function promptForApiKeyAsync(): Promise<string> {
    const result = await cliHelpers.promptAsync({
        name: 'apiKey',
        description: `Please enter your API key. You can generate one at ${AIRTABLE_ACCOUNT_URL}`,
        message: 'API key is required for development',
        hidden: true,
        required: true,
    });
    return result.apiKey;
}

module.exports = promptForApiKeyAsync;
