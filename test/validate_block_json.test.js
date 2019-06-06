// @flow
const validateBlockJson = require('../src/helpers/validate_block_json');
const assert = require('assert');

describe('validateBlockJson', () => {
    it('passes for a valid blockJson', function() {
        const validationResult = validateBlockJson({
            frontendEntry: './frontend/index.js',
        });
        assert.strictEqual(validationResult.pass, true);
    });

    it('fails for invalid blockJsons', function() {
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
            {
                // Old block.json format.
                'frontendEntryModuleName': 'index.js',
                'applicationId': 'app00000000000000',
                'blockId': 'blk00000000000000',
                'modules': [
                    {
                        'id': 'blm00000000000000',
                        'revision': 0,
                        'metadata': {
                            'type': 'frontend',
                            'name': 'index'
                        }
                    },
                ],
            },
        ];
        for (const testCase of testCases) {
            const validationResult = validateBlockJson(testCase);
            assert.strictEqual(validationResult.pass, false);
        }
    });
});
