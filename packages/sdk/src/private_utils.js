// @flow
import {spawnError} from './error_utils';

export {default as isDeepEqual} from 'fast-deep-equal';

/**
 * @private
 */
export function cloneDeep<T: mixed>(obj: T): T {
    const jsonString = JSON.stringify(obj);
    if (jsonString === undefined) {
        return obj;
    }
    return JSON.parse(jsonString);
}

/**
 * @private
 */
export function values<Obj: {+[string]: mixed}>(obj: Obj): Array<$Values<Obj>> {
    return Object.values(obj);
}

/**
 * @private
 */
export function entries<Obj: {+[string]: mixed}>(obj: Obj): Array<[$Keys<Obj>, $Values<Obj>]> {
    return Object.entries(obj);
}

/**
 * @private
 */
export function fireAndForgetPromise(fn: () => Promise<mixed>) {
    fn().catch(err => {
        setTimeout(() => {
            throw err;
        }, 0);
    });
}

/**
 * @private
 */
export function has(obj: {+[string]: mixed}, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const invertedEnumCache: WeakMap<{+[string]: string}, {+[string]: ?string}> = new WeakMap();
/**
 * @private
 */
function getInvertedEnumMemoized<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
    enumObj: EnumObj,
): {+[EnumValue]: ?$Keys<EnumObj>} {
    const existingInvertedEnum = invertedEnumCache.get(enumObj);
    if (existingInvertedEnum) {
        return existingInvertedEnum;
    }

    const invertedEnum: {[EnumValue]: ?$Keys<EnumObj>} = {};
    for (const enumKey of Object.keys(enumObj)) {
        const enumValue = enumObj[enumKey];
        invertedEnum[enumValue] = enumKey;
    }
    invertedEnumCache.set(enumObj, invertedEnum);
    return invertedEnum;
}

/**
 * @private
 */
export function getEnumValueIfExists<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
    enumObj: EnumObj,
    valueToCheck: string,
): EnumValue | null {
    const invertedEnum = getInvertedEnumMemoized(enumObj);
    if (has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
        const enumKey = invertedEnum[valueToCheck];
        return enumObj[enumKey];
    }
    return null;
}

/**
 * @private
 */
export function assertEnumValue<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
    enumObj: EnumObj,
    valueToCheck: string,
): EnumValue {
    const enumValue = getEnumValueIfExists(enumObj, valueToCheck);
    if (!enumValue) {
        throw spawnError('Unknown enum value %s', valueToCheck);
    }
    return enumValue;
}

/**
 * @private
 */
export function isEnumValue(enumObj: {[string]: string}, valueToCheck: string): boolean {
    return getEnumValueIfExists(enumObj, valueToCheck) !== null;
}

/**
 * @private
 */
export function isObjectEmpty(obj: {+[string]: mixed}): boolean {
    for (const key in obj) {
        if (has(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * @private
 */
export function isNullOrUndefinedOrEmpty(value: mixed): boolean %checks {
    return (
        value === null ||
        value === undefined ||
        ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) ||
        (typeof value === 'object' && isObjectEmpty(value))
    );
}

/**
 * @private
 */
export function compact<T>(array: $ReadOnlyArray<?T>): Array<T> {
    const result = [];
    for (const item of array) {
        if (item !== null && item !== undefined) {
            result.push(item);
        }
    }
    return result;
}

/**
 * @private
 */
export function clamp(n: number, lowerBound: number, upperBound: number): number {
    if (n < lowerBound) {
        return lowerBound;
    } else if (n > upperBound) {
        return upperBound;
    } else {
        return n;
    }
}

type ReadOnlyDeepArray<T> = $ReadOnlyArray<T | ReadOnlyDeepArray<T>>;

/**
 * @private
 */
export function flattenDeep<T>(array: ReadOnlyDeepArray<T>): Array<T> {
    return array.flat(Infinity);
}

/**
 * @private
 */
export function keyBy<Item, Key: string>(
    array: $ReadOnlyArray<Item>,
    getKey: Item => Key,
): {[Key]: Item} {
    const result = {};
    for (const item of array) {
        result[getKey(item)] = item;
    }
    return result;
}

/**
 * @private
 */
export function uniqBy<Item, Key>(array: $ReadOnlyArray<Item>, getKey: Item => Key): Array<Item> {
    const usedKeys = new Set();
    const result = [];

    for (const item of array) {
        const key = getKey(item);
        if (!usedKeys.has(key)) {
            result.push(item);
            usedKeys.add(key);
        }
    }

    return result;
}

let idCount = 0;
/** @private */
export function getLocallyUniqueId(prefix: string = ''): string {
    return `${prefix}.${idCount++}`;
}

const plainObjectPrototype = Object.getPrototypeOf({});
/**
 * A more restrictive version of Lodash's `get`. Notable differences:
 * - Will only search an object's own properties
 * - Only allows indexing into plain objects - searching in `number`, `string`, `Array`, `null`, or non-plain objects will throw
 * @private
 */
export function getValueAtOwnPath(value: mixed, path: $ReadOnlyArray<string>): mixed {
    let currentValue = value;
    for (const part of path) {
        if (currentValue === undefined) {
            return undefined;
        }

        if (currentValue === null || typeof currentValue !== 'object') {
            throw spawnError("Cannot get '%s' in primitive value", part);
        }

        if (Array.isArray(currentValue)) {
            throw spawnError("Cannot get '%s' in array", part);
        }

        const prototype = Object.getPrototypeOf(currentValue);
        if (prototype !== null && prototype !== plainObjectPrototype) {
            throw spawnError("Cannot get '%s' in non-plain object", part);
        }

        currentValue = has(currentValue, part) ? currentValue[part] : undefined;
    }
    return currentValue;
}

/** @private */
export function arrayDifference<T>(a: $ReadOnlyArray<T>, b: $ReadOnlyArray<T>): Array<T> {
    const bSet = new Set(b);
    return a.filter(item => !bSet.has(item));
}

/** @private */
export function debounce<Args: Array<any>>(
    fn: (...args: Args) => void,
    timeoutMs: number,
): (...args: Args) => void {
    let lastTimeoutId = null;

    return (...args) => {
        if (lastTimeoutId !== null) {
            clearTimeout(lastTimeoutId);
        }
        lastTimeoutId = setTimeout(() => {
            lastTimeoutId = null;
            fn(...args);
        }, timeoutMs);
    };
}
