// @flow
const promptForApiKeyAsync = require('../src/helpers/prompt_for_api_key_async');
const inquirer = require('inquirer');
const sinon = require('sinon');
const assert = require('assert');

describe('promptForApiKeyAsync', function() {
    beforeEach(function() {
        sinon.stub(inquirer, 'prompt').resolves({
            apiKey: 'key123ABC',
        });
    });

    it('prompts for an API key', async function() {
        assert.strictEqual(await promptForApiKeyAsync(), 'key123ABC');
    });
});
