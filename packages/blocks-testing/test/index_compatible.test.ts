/**
 * Dynamically-imported modules are evaluated just once, and the result is
 * shared by all occurrences of the "dynamic import" expression. In order to
 * verify the module's behavior when loaded under different conditions, each
 * test must be declared in a dedicated file (this subverts the cache because
 * the Jest test runner does not share a module cache between files).
 */

describe('package index', () => {
    it('succeeds for supported versions of the Blocks SDK', async () => {
        const index = await import('../src/index');
        expect(typeof index.default).toBe('function');
    });
});
