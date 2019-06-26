// @flow
const cliHelpers = require('./cli_helpers');
const Environments = require('../types/environments');
const {TEST_SERVER_PORT} = require('../config/block_cli_config_settings');

import type {Environment} from '../types/environments';

const domainByEnvironment = {
    [Environments.PRODUCTION]: 'airtable.com',
    [Environments.STAGING]: 'staging.airtable.com',
    [Environments.LOCAL]: 'hyperbasedev.com:3000',
    [Environments.TEST]: 'localhost:' + TEST_SERVER_PORT,
};

async function promptForApiKeyAsync(environment: Environment): Promise<string> {
    const domain = domainByEnvironment[environment];
    const result = await cliHelpers.promptAsync({
        name: 'apiKey',
        description: `Please enter your API key. You can generate one at https://${domain}/account`,
        message: 'API key is required for development',
        hidden: true,
        required: true,
    });
    return result.apiKey;
}

module.exports = promptForApiKeyAsync;
