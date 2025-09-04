import getAirtableInterface from '../injected/airtable_interface';
import {spawnError} from './error_utils';

export {default as isDeepEqual} from 'fast-deep-equal';

/** @hidden */
export type FlowAnyObject = any;
/** @hidden */
export type FlowAnyFunction = any;
/** @hidden */
export type FlowAnyExistential = any;

/**
 * Get the type of all the values of an object.
 *
 * Same as the legacy Flow `$Values<T>` type.
 *
 * @hidden
 */
export type ObjectValues<T extends object> = T[keyof T];

/** @hidden */
export type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Allows creating an object map type with a dynamic key type.
 *
 * TypeScript only allows `string` for `K` in `{[key: K]: V}` so we need a utility to bridge
 * the gap.
 *
 * This is an alias for TypeScript’s `Record` type, but the name “record” is confusing given our
 * Airtable domain model.
 *
 * @hidden
 */
export type ObjectMap<K extends keyof any, V> = {[P in K]: V};

/**
 * Creates an enum from provided string arguments.
 *
 * Useful for consumer-facing enums (eg `Button#variant`) where we want to make the external
 * developer experience convenient by providing a string value, but also want to internally
 * reference enum values using object notation.
 *
 * @hidden
 */
export function createEnum<T extends string>(...enumValues: Array<T>): {[K in T]: K} {
    const spec: any = {};
    for (const value of enumValues) {
        spec[value] = value;
    }
    return Object.freeze(spec);
}

/**
 * Creates a Type for an enum created using `createEnum`.
 *
 * @hidden
 */
export type EnumType<T> = keyof T;

/**
 * Safely cast a value to the type passed in as a type parameter.
 *
 * This was added in the TypeScript migration to provide a safe translation for Flow’s type cast
 * operator `(x: T)`.
 *
 * @hidden
 */
export function cast<T>(x: T): T {
    return x;
}

/**
 * @hidden
 */
export function cloneDeep<T extends unknown>(obj: T): T {
    const jsonString = JSON.stringify(obj);
    if (jsonString === undefined) {
        return obj;
    }
    return JSON.parse(jsonString);
}

/**
 * @hidden
 */
export function keys<Obj extends object>(obj: Obj): Array<keyof Obj> {
    return Object.keys(obj) as any;
}

/**
 * @hidden
 */
export function values<Obj extends object>(obj: Obj): Array<ObjectValues<Obj>> {
    return Object.values(obj);
}

/**
 * @hidden
 */
export function entries<Obj extends object>(obj: Obj): Array<[keyof Obj, ObjectValues<Obj>]> {
    // @ts-ignore
    return Object.entries(obj);
}

/**
 * @hidden
 */
export function fireAndForgetPromise(fn: () => Promise<unknown>) {
    fn().catch(err => {
        setTimeout(() => {
            throw err;
        }, 0);
    });
}

/**
 * @hidden
 */
export function has<T extends object>(obj: T, key: keyof any): key is keyof T {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const invertedEnumCache: WeakMap<object, object> = new WeakMap();
/**
 * @hidden
 */
function getInvertedEnumMemoized<K extends string, V extends string>(
    enumObj: ObjectMap<K, V>,
): ObjectMap<V, K> {
    const existingInvertedEnum = invertedEnumCache.get(enumObj);
    if (existingInvertedEnum) {
        return existingInvertedEnum as any;
    }

    const invertedEnum = {} as ObjectMap<V, K>;
    for (const enumKey of keys(enumObj)) {
        const enumValue = enumObj[enumKey];
        invertedEnum[enumValue] = enumKey;
    }
    invertedEnumCache.set(enumObj, invertedEnum);
    return invertedEnum;
}

/**
 * @hidden
 */
export function getEnumValueIfExists<K extends string, V extends string>(
    enumObj: ObjectMap<K, V>,
    valueToCheck: string,
): V | null {
    const invertedEnum = getInvertedEnumMemoized(enumObj);
    if (has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
        const enumKey = invertedEnum[valueToCheck];
        return enumObj[enumKey];
    }
    return null;
}

/**
 * @hidden
 */
export function assertEnumValue<K extends string, V extends string>(
    enumObj: ObjectMap<K, V>,
    valueToCheck: string,
): V {
    const enumValue = getEnumValueIfExists(enumObj, valueToCheck);
    if (!enumValue) {
        throw spawnError('Unknown enum value %s', valueToCheck);
    }
    return enumValue;
}

/**
 * @hidden
 */
export function isEnumValue(enumObj: {[key: string]: string}, valueToCheck: string): boolean {
    return getEnumValueIfExists(enumObj, valueToCheck) !== null;
}

/**
 * @hidden
 */
export function isObjectEmpty(obj: object): boolean {
    for (const key in obj) {
        if (has(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * @hidden
 */
export function isNullOrUndefinedOrEmpty(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) ||
        (typeof value === 'object' && value !== null && isObjectEmpty(value))
    );
}

/**
 * @hidden
 */
export function compact<T>(array: ReadonlyArray<T | null | undefined>): Array<T> {
    const result = [];
    for (const item of array) {
        if (item !== null && item !== undefined) {
            result.push(item);
        }
    }
    return result;
}

/**
 * @hidden
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

/** @hidden */
interface ReadonlyDeepArray<T> extends Array<T | ReadonlyDeepArray<T>> {}

/**
 * @hidden
 */
export function flattenDeep<T>(array: ReadonlyDeepArray<T>): Array<T> {
    // @ts-ignore
    return array.flat(Infinity);
}

/**
 * @hidden
 */
export function keyBy<Item, Key extends string>(
    array: ReadonlyArray<Item>,
    getKey: (arg1: Item) => Key,
): ObjectMap<Key, Item> {
    const result = {} as ObjectMap<Key, Item>;
    for (const item of array) {
        result[getKey(item)] = item;
    }
    return result;
}

/**
 * @hidden
 */
export function getId({id}: {id: string}) {
    return id;
}

/**
 * @hidden
 */
export function uniqBy<Item, Key>(
    array: ReadonlyArray<Item>,
    getKey: (arg1: Item) => Key,
): Array<Item> {
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
/** @hidden */
export function getLocallyUniqueId(prefix: string = ''): string {
    return `${prefix}.${idCount++}`;
}

const plainObjectPrototype = Object.getPrototypeOf({});
/**
 * A more restrictive version of Lodash's `get`. Notable differences:
 * - Will only search an object's own properties
 * - Only allows indexing into plain objects - searching in `number`, `string`, `Array`, `null`, or non-plain objects will throw
 *
 * @hidden
 */
export function getValueAtOwnPath(value: unknown, path: ReadonlyArray<string>): unknown {
    let currentValue = value;
    for (const part of path) {
        if (currentValue === undefined) {
            return undefined;
        }

        if (typeof currentValue !== 'object' || currentValue === null) {
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

/** @hidden */
export function arrayDifference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): Array<T> {
    const bSet = new Set(b);
    return a.filter(item => !bSet.has(item));
}

/** @hidden */
export function debounce<Args extends Array<any>>(
    fn: (...args: Args) => void,
    timeoutMs: number,
): (...args: Args) => void {
    let lastTimeoutId: TimeoutId | null = null;

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

/** @hidden */
export function isBlockDevelopmentRestrictionEnabled(): boolean {
    return getAirtableInterface().sdkInitData.baseData.isBlockDevelopmentRestrictionEnabled;
}

/**
 * Added for use in Gantt View, to enable i18n.
 *
 * @hidden
 * */
export function getLocaleAndDefaultLocale(): {locale?: string; defaultLocale?: string} {
    const sdkInitData = getAirtableInterface().sdkInitData;
    return {
        locale: 'locale' in sdkInitData ? sdkInitData.locale : undefined,
        defaultLocale: 'defaultLocale' in sdkInitData ? sdkInitData.defaultLocale : undefined,
    };
}
