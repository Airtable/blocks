// @flow
/* eslint-disable no-console */
'use strict';

const CommandNames = require('./commands/command_names');
const configHelpers = require('./helpers/config_helpers');
const invariant = require('invariant');

async function getApiKeyWithWarningsAsync(): Promise<string> {
    const instructions = `Please use 'block ${CommandNames.SET_API_KEY}' to update it.`;

    const apiKey = await configHelpers.getApiKeyIfExistsAsync();

    if (apiKey === null) {
        console.log("There doesn't seem to be an API key configured.\n" + instructions);
        process.exit(1);
    }

    invariant(typeof apiKey === 'string', 'apiKey should be string');
    // Validate that it looks like an API key.
    if (!/key[0-ZA-Za-z]{14}/.test(apiKey)) {
        console.log('The Airtable API key looks invalid.\n' + instructions);
        process.exit(1);
    }

    return apiKey;
}

module.exports = getApiKeyWithWarningsAsync;
