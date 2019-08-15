// @flow
import {
    has,
    isObjectEmpty,
    isNullOrUndefinedOrEmpty,
    compact,
    clamp,
    flattenDeep,
    keyBy,
    uniqBy,
} from '../src/private_utils';
import {flowTest} from './test_helpers';

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

describe('isObjectEmpty', () => {
    it('returns true if the object has no "own" properties', () => {
        expect(isObjectEmpty({})).toBe(true);

        const someInstance = new (class {
            onPrototype() {}
        })();

        expect(isObjectEmpty(someInstance)).toBe(true);
    });

    it('returns false if the object has any "own" properties', () => {
        expect(isObjectEmpty({foo: 'bar'})).toBe(false);

        const someInstance = new (class {
            instanceVariable = true;
        })();

        expect(isObjectEmpty(someInstance)).toBe(false);
    });
});

describe('isNullOrUndefinedOrEmpty', () => {
    it('returns true for null, undefined, and empty strings/arrays/objects', () => {
        expect(isNullOrUndefinedOrEmpty(null)).toBe(true);
        expect(isNullOrUndefinedOrEmpty(undefined)).toBe(true);
        expect(isNullOrUndefinedOrEmpty('')).toBe(true);
        expect(isNullOrUndefinedOrEmpty([])).toBe(true);
        expect(isNullOrUndefinedOrEmpty({})).toBe(true);
    });

    it('returns false for numbers, booleans, non-empty strings/arrays/objects', () => {
        expect(isNullOrUndefinedOrEmpty(0)).toBe(false);
        expect(isNullOrUndefinedOrEmpty(true)).toBe(false);
        expect(isNullOrUndefinedOrEmpty(false)).toBe(false);
        expect(isNullOrUndefinedOrEmpty('hello')).toBe(false);
        expect(isNullOrUndefinedOrEmpty(' ')).toBe(false);
        expect(isNullOrUndefinedOrEmpty(['hello'])).toBe(false);
        expect(isNullOrUndefinedOrEmpty([undefined])).toBe(false);
        expect(isNullOrUndefinedOrEmpty({foo: true})).toBe(false);
        expect(isNullOrUndefinedOrEmpty({foo: undefined})).toBe(false);
    });
});

describe('compact', () => {
    it('removes null and undefined values from the passed array', () => {
        expect(compact([1, 2, 'hello', {}, null, false, '', undefined, true])).toEqual([
            1,
            2,
            'hello',
            {},
            false,
            '',
            true,
        ]);
    });

    flowTest('refines the flow type of its return value', () => {
        const inputArray = [1, 2, null, 3, undefined];

        const compacted = compact(inputArray);
        (compacted: Array<number>);
        // flow-expect-error
        (compacted: Array<?number>);
    });
});

describe('clamp', () => {
    it('keeps a number between two bounds', () => {
        expect(clamp(0, -1.2, 3.4)).toBe(0);

        expect(clamp(-1, -1.2, 3.4)).toBe(-1);
        expect(clamp(-1.2, -1.2, 3.4)).toBe(-1.2);
        expect(clamp(-1.3, -1.2, 3.4)).toBe(-1.2);
        expect(clamp(-100, -1.2, 3.4)).toBe(-1.2);
        expect(clamp(-Infinity, -1.2, 3.4)).toBe(-1.2);

        expect(clamp(3, -1.2, 3.4)).toBe(3);
        expect(clamp(3.4, -1.2, 3.4)).toBe(3.4);
        expect(clamp(3.5, -1.2, 3.4)).toBe(3.4);
        expect(clamp(100, -1.2, 3.4)).toBe(3.4);
        expect(clamp(Infinity, -1.2, 3.4)).toBe(3.4);
    });
});

describe('flattenDeep', () => {
    it('flattens a nested array', () => {
        expect(flattenDeep([1, 2, [3, 4]])).toEqual([1, 2, 3, 4]);
        expect(flattenDeep([[1, 2, 3, 4]])).toEqual([1, 2, 3, 4]);
        expect(flattenDeep([1, [2, 3], [[4]]])).toEqual([1, 2, 3, 4]);
        expect(flattenDeep([[], []])).toEqual([]);
    });

    it('no-ops for a flat array', () => {
        expect(flattenDeep([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });
});

describe('keyBy', () => {
    it('converts arrays into objects keyed by the result of a given function', () => {
        expect(keyBy([1, 2, 3, 4], o => String(o))).toEqual({
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
        });
        expect(keyBy([{id: 1}, {id: 2}, {id: 3}, {id: 4}], o => String(o.id))).toEqual({
            '1': {id: 1},
            '2': {id: 2},
            '3': {id: 3},
            '4': {id: 4},
        });
    });

    it('uses the value of the last element for repeated keys', () => {
        expect(
            keyBy(
                [
                    {id: 1, group: 'a'},
                    {id: 2, group: 'b'},
                    {id: 3, group: 'a'},
                    {id: 4, group: 'b'},
                ],
                o => o.group,
            ),
        ).toEqual({
            a: {id: 3, group: 'a'},
            b: {id: 4, group: 'b'},
        });
    });
});

describe('uniqBy', () => {
    it('removes non-unique array elements based on a given function', () => {
        expect(uniqBy([1, 2, 3, 4], o => o)).toEqual([1, 2, 3, 4]);
        expect(uniqBy([1, 1, 1, 1], o => o)).toEqual([1]);
        expect(
            uniqBy(
                [
                    {id: 1, group: 'a'},
                    {id: 2, group: 'b'},
                    {id: 3, group: 'a'},
                    {id: 4, group: 'b'},
                ],
                o => o.group,
            ),
        ).toEqual([{id: 1, group: 'a'}, {id: 2, group: 'b'}]);
        expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
    });
});
