import * as remoteUtils from '../../src/shared/ui/remote_utils';

describe('remoteUtils', () => {
    describe('loadCSSFromString', () => {
        it('inserts the provided styling', () => {
            const div = document.createElement('div');
            div.className = 'airtable-remote-utils-test-1';

            expect(getComputedStyle(div).zIndex).not.toBe('1234');
            remoteUtils.loadCSSFromString(`
                .airtable-remote-utils-test-1 {
                    z-index: 1234;
                }
            `);
            expect(getComputedStyle(div).zIndex).toBe('1234');
        });
    });
});
