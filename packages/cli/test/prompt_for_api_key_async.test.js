// @flow
const promptForApiKeyAsync = require('../src/helpers/prompt_for_api_key_async');
const inquirer = require('inquirer');
const sinon = require('sinon');
const assert = require('assert');

describe('promptForApiKeyAsync', function() {
    it('returns a user API key when prompted', async function() {
        sinon.stub(inquirer, 'prompt').resolves({
            apiKey: 'key123ABC',
        });
        assert.strictEqual(await promptForApiKeyAsync(), 'key123ABC');
    });

    it('returns a personal access token when prompted', async function() {
        sinon.stub(inquirer, 'prompt').resolves({
            apiKey:
                'pat1234567890abcd.1234567890123456789012345678901234567890123456789012345678901234',
        });
        assert.strictEqual(
            await promptForApiKeyAsync(),
            'pat1234567890abcd.1234567890123456789012345678901234567890123456789012345678901234',
        );
    });
});
