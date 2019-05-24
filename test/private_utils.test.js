// @flow
import {has} from '../src/private_utils';

describe('has', () => {
    it('returns true if the key is an "own" property of the object', () => {
        const obj = {
            foo: 'bar',
            baz: undefined,
        };
        expect(has(obj, 'foo')).toBe(true);
        expect(has(obj, 'baz')).toBe(true);
    });

    it('returns false if the key is not an "own" property of the object', () => {
        expect(has({}, 'foo')).toBe(false);
        expect(has({}, 'hasOwnProperty')).toBe(false);

        class Klass {
            onPrototype() {}
        }
        const obj = new Klass();
        expect(has(obj, 'onPrototype')).toBe(false);
    });
});
