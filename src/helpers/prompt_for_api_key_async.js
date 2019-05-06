// @flow
const cliHelpers = require('./cli_helpers');
const Environments = require('../types/environments');

import type {Environment} from '../types/environments';

const domainByEnvironment = {
    [Environments.PRODUCTION]: 'airtable.com',
    [Environments.STAGING]: 'staging.airtable.com',
    [Environments.LOCAL]: 'hyperbasedev.com:3000',
};

async function promptForApiKeyAsync(environment: Environment): Promise<string> {
    const domain = domainByEnvironment[environment];
    const result = await cliHelpers.promptAsync({
        name: 'apiKey',
        description: `Please enter your API key. You can generate one at https://${domain}/account`,
    });
    return result.apiKey;
}

module.exports = promptForApiKeyAsync;
