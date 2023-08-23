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
export type ObjectMap<K extends PropertyKey, V> = {[P in K]: V};

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
 * Omit keys with values that are undefined.
 *
 * @param obj map of keys to undefined members and non-undefined values
 * @returns map of keys only mapping to non-undefined values
 */
export function omitUndefinedValues<T>(obj: T): T {
    const value = {} as T;
    for (const key of Object.keys(obj) as (keyof T)[]) {
        if (obj[key] !== undefined) {
            value[key] = obj[key];
        }
    }
    return value;
}
