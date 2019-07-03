// @flow
/* eslint-disable no-console */
const configHelpers = require('../helpers/config_helpers');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');

import type {Argv} from 'yargs';
import type {ConfigLocation} from '../helpers/config_helpers';

async function runCommandAsync(argv: Argv): Promise<void> {
    const location = ((argv.location: any): ConfigLocation); // eslint-disable-line flowtype/no-weak-types
    const configPath = configHelpers.getConfigPath(location);

    console.log(`Updating config at ${configPath} (use --location to choose config scope)`);
    const apiKey = await promptForApiKeyAsync();

    await configHelpers.setApiKeyAsync(location, apiKey);

    console.log('✅ API key updated!');
}

module.exports = {runCommandAsync};
