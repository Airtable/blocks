import {
    has,
    isObjectEmpty,
    isNullOrUndefinedOrEmpty,
    compact,
    clamp,
    flattenDeep,
    keyBy,
    uniqBy,
    getValueAtOwnPath,
    arrayDifference,
    debounce,
    cast,
} from '../src/private_utils';
import {flowTest} from './test_helpers';

jest.useFakeTimers();

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
        cast<Array<number>>(compacted);
        // flow-expect-error
        cast<Array<number | null | undefined>>(compacted);
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
        ).toEqual([
            {id: 1, group: 'a'},
            {id: 2, group: 'b'},
        ]);
        expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
    });
});

describe('getValueAtOwnPath', () => {
    const object = {
        a: 1,
        b: {c: 'foo', notThere: null},
        bool: true,
        array: [1, {x: 4}],
        nonPlain: new Map([
            ['a', 1],
            ['b', 2],
        ]),
    };

    it('returns the value at that path', () => {
        expect(getValueAtOwnPath(object, ['a'])).toBe(object.a);
        expect(getValueAtOwnPath(object, ['b'])).toBe(object.b);
        expect(getValueAtOwnPath(object, ['b', 'c'])).toBe(object.b.c);
    });

    it("returns undefined if the value isn't found", () => {
        expect(getValueAtOwnPath(object, ['unknown'])).toBe(undefined);
        expect(getValueAtOwnPath(object, ['b', 'd'])).toBe(undefined);
        expect(getValueAtOwnPath(object, ['very', 'unknown'])).toBe(undefined);
    });

    it('throws an error if you try and index into a primitive', () => {
        expect(() => getValueAtOwnPath(object, ['a', 'a'])).toThrowErrorMatchingInlineSnapshot(
            '"Cannot get \'a\' in primitive value"',
        );
        expect(() =>
            getValueAtOwnPath(object, ['b', 'c', 'length']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'length\' in primitive value"');
        expect(() =>
            getValueAtOwnPath(object, ['b', 'notThere', 'length']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'length\' in primitive value"');
        expect(() =>
            getValueAtOwnPath(object, ['bool', 'length']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'length\' in primitive value"');
    });

    it('throws an error if you try and index into an array', () => {
        expect(() =>
            getValueAtOwnPath(object, ['array', 'length']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'length\' in array"');
        expect(() => getValueAtOwnPath(object, ['array', '0'])).toThrowErrorMatchingInlineSnapshot(
            '"Cannot get \'0\' in array"',
        );
    });

    it("treats non-own properties as if they aren't there", () => {
        expect(getValueAtOwnPath(object, ['toString'])).toBe(undefined);
        expect(getValueAtOwnPath(object, ['hasOwnProperty'])).toBe(undefined);
        expect(getValueAtOwnPath(object, ['b', 'hasOwnProperty'])).toBe(undefined);
        expect(getValueAtOwnPath(object, ['__proto__'])).toBe(undefined);
    });

    it('throws an error if you try and index into a non-plain object', () => {
        expect(() =>
            getValueAtOwnPath(object, ['nonPlain', 'size']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'size\' in non-plain object"');
        expect(() =>
            getValueAtOwnPath(object, ['nonPlain', 'a']),
        ).toThrowErrorMatchingInlineSnapshot('"Cannot get \'a\' in non-plain object"');
    });
});

describe('arrayDifference', () => {
    it('returns a copy of the first array with any items also present in the second array removed', () => {
        expect(arrayDifference([1, 2, 3], [])).toEqual([1, 2, 3]);
        expect(arrayDifference([1, 2, 3], [3, 4, 5])).toEqual([1, 2]);
        expect(arrayDifference([1, 2, 3], [3, 2, 1])).toEqual([]);

        const obj = {x: 1};
        expect(arrayDifference([obj, {x: 2}], [{x: 1}, {x: 2}])).toEqual([{x: 1}, {x: 2}]);
        expect(arrayDifference([obj, {x: 2}], [obj, {x: 2}])).toEqual([{x: 2}]);
    });
});

describe('debounce', () => {
    it('returns a debounced version of the function that gets called with the last arg', () => {
        const fn = jest.fn();
        const debounced = debounce(fn, 100);

        debounced(1);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(99);
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenLastCalledWith(1);

        debounced(2);
        debounced(3);

        jest.advanceTimersByTime(99);
        expect(fn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenLastCalledWith(3);

        debounced(4);
        jest.advanceTimersByTime(99);
        debounced(5);

        jest.advanceTimersByTime(99);
        expect(fn).toHaveBeenCalledTimes(2);

        jest.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(3);
        expect(fn).toHaveBeenLastCalledWith(5);
    });
});
