/**
 * Dynamically-imported modules are evaluated just once, and the result is
 * shared by all occurrences of the "dynamic import" expression. In order to
 * verify the module's behavior when loaded under different conditions, each
 * test must be declared in a dedicated file (this subverts the cache because
 * the Jest test runner does not share a module cache between files).
 */
import {Sdk} from '@airtable/blocks/unstable_testing_utils';

Sdk.VERSION = '1.4.1';

describe('package index', () => {
    it('fails for unsupported versions of the Blocks SDK', async () => {
        await expect(import('../src/index')).rejects.toThrowError(
            /Version .+ of the blocks-testing library does not support version .+ of the Blocks SDK library\./,
        );
    });
});
