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
