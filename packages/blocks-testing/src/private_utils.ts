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
export function has<T extends object>(obj: T, key: keyof any): key is keyof T {
    return Object.prototype.hasOwnProperty.call(obj, key);
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
