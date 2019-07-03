// @flow
const promptForApiKeyAsync = require('../src/helpers/prompt_for_api_key_async');
const cliHelpers = require('../src/helpers/cli_helpers');
const sinon = require('sinon');
const assert = require('assert');

describe('promptForApiKeyAsync', function() {
    beforeEach(function() {
        sinon.stub(cliHelpers, 'promptAsync').resolves({
            apiKey: 'key123ABC',
        });
    });

    it('prompts for an API key', async function() {
        assert.strictEqual(await promptForApiKeyAsync(), 'key123ABC');
    });
});
