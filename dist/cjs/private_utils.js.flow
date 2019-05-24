// @flow
export function cloneDeep<T: mixed>(obj: T): T {
    const jsonString = JSON.stringify(obj);
    if (jsonString === undefined) {
        return obj;
    }
    return JSON.parse(jsonString);
}

// flow has a stricter definition for Object.values and Object.entries that return mixed in place
// of the actual values. This is because for non-exact objects, that's the only sound definition.
// You can call Object.values with a value typed as {x: number} that actually looks like
// {x: number, y: string}, for example. Returning mixed isn't particularly useful though, so we
// provide these unsound wrappers instead.
// TODO: consider renaming these with unsound_ prefixes.
export function values<V>(obj: {[string]: V}): Array<V> {
    // flow-disable-next-line
    return Object.values(obj);
}

export function entries<V>(obj: {[string]: V}): Array<[string, V]> {
    // flow-disable-next-line
    return Object.entries(obj);
}

// Result values are discarded and errors are thrown asynchronously.
// NOTE: this is different from the one in u: the function passed
// in must be fully bound with all of its arguments and will be immediately
// called (this does not return a function). This makes it work better with
// Flow: you get argument type checking by using `.bind`.
export function fireAndForgetPromise(fn: () => Promise<mixed>) {
    fn().catch(err => {
        // Defer til later, so the error doesn't cause the promise to be rejected.
        setTimeout(() => {
            throw err;
        }, 0);
    });
}

export function has(obj: {+[string]: mixed}, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

const invertedEnumCache: WeakMap<{+[string]: string}, {+[string]: ?string}> = new WeakMap();
function getInvertedEnumMemoized<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
    enumObj: EnumObj,
): {+[EnumValue]: ?$Keys<EnumObj>} {
    const existingInvertedEnum = invertedEnumCache.get(enumObj);
    if (existingInvertedEnum) {
        // flow-disable-next-line flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
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

export function assertEnumValue<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
    enumObj: EnumObj,
    valueToCheck: string,
): EnumValue {
    const enumValue = getEnumValueIfExists(enumObj, valueToCheck);
    if (!enumValue) {
        throw new Error(`Unknown enum value ${valueToCheck}`);
    }
    return enumValue;
}

export function isEnumValue(enumObj: {[string]: string}, valueToCheck: string): boolean {
    return getEnumValueIfExists(enumObj, valueToCheck) !== null;
}
