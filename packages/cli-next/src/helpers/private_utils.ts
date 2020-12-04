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
