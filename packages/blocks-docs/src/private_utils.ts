/**
 * @hidden
 */
export function has<T extends object>(obj: T, key: PropertyKey): key is keyof T {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
