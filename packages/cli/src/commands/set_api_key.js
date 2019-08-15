// @flow
/* eslint-disable no-console */
const invariant = require('invariant');
const configHelpers = require('../helpers/config_helpers');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');

import type {Argv} from 'yargs';
import type {ConfigLocation} from '../types/config_helpers_type';

async function runCommandAsync(argv: Argv): Promise<void> {
    const location = ((argv.location: any): ConfigLocation); // eslint-disable-line flowtype/no-weak-types
    const apiKeyName = argv.apiKeyName || null;
    invariant(
        apiKeyName === null || typeof apiKeyName === 'string',
        'expects apiKeyName to be null or a string',
    );
    const configPath = configHelpers.getConfigPath(location);

    console.log(`Updating config at ${configPath} (use --location to choose config scope)`);
    const apiKey = await promptForApiKeyAsync();

    await configHelpers.setApiKeyAsync(location, apiKey, apiKeyName);

    console.log('✅ API key updated!');
}

module.exports = {runCommandAsync};
