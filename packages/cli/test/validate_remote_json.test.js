// @flow
const validateRemoteJson = require('../src/helpers/validate_remote_json');
const assert = require('assert');

describe('validateRemoteJson', () => {
    it('passes for a valid remote', function() {
        const validationResult = validateRemoteJson({
            blockId: 'blk00000000000000',
            baseId: 'app00000000000000',
        });
        assert.strictEqual(validationResult.pass, true);
    });

    it('passes for a valid remote with a server endpoint specified', function() {
        const validationResult = validateRemoteJson({
            blockId: 'blk00000000000000',
            baseId: 'app00000000000000',
            server: 'https://api.airtable.com',
        });
        assert.strictEqual(validationResult.pass, true);
    });

    it('passes for a valid remote with a apiKeyName specified', function() {
        const validationResult = validateRemoteJson({
            blockId: 'blk00000000000000',
            baseId: 'app00000000000000',
            apiKeyName: 'some-api-key',
        });
        assert.strictEqual(validationResult.pass, true);
    });

    it('fails for invalid remotes', function() {
        const testCases = [
            null,
            'foo',
            12,
            new Date(),
            true,
            false,
            () => {},
            [],
            ['foo'],
            {},
            {blockId: 'blk00000000000000'}, // no baseId
            {baseId: 'app00000000000000'}, // no blockId
            {
                blockId: 'blk00000000000000',
                baseId: 'app00000000000000',
                server: 12, // invalid server
            },
            {
                blockId: 'blk00000000000000',
                baseId: 'app00000000000000',
                apiKeyName: 12, // invalid apiKeyName
            },
        ];
        for (const testCase of testCases) {
            const validationResult = validateRemoteJson(testCase);
            assert.strictEqual(validationResult.pass, false);
        }
    });
});
