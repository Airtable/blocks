import {MutationTypes} from '../src';

describe('MutationTypes', () => {
    it('exports an array of string values for use by consumers', () => {
        expect(MutationTypes).toBeTruthy();
        const keys = Object.keys(MutationTypes) as Array<keyof typeof MutationTypes>;
        expect(keys.length).toBeGreaterThan(0);

        for (const key of keys) {
            expect(typeof MutationTypes[key]).toBe('string');
        }
    });
});
