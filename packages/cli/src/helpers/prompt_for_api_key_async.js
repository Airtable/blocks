// @flow
const inquirer = require('inquirer');
const {AIRTABLE_ACCOUNT_URL} = require('../config/block_cli_config_settings');

async function promptForApiKeyAsync(): Promise<string> {
    const {apiKey} = await inquirer.prompt({
        type: 'password',
        name: 'apiKey',
        message: `Please enter your API key. You can generate one at ${AIRTABLE_ACCOUNT_URL}`,
    });

    return apiKey;
}

module.exports = promptForApiKeyAsync;
