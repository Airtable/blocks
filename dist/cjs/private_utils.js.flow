// @flow
class PrivateUtils {
    cloneDeep<T: mixed>(obj: T): T {
        const jsonString = JSON.stringify(obj);
        if (jsonString === undefined) {
            return obj;
        }
        return JSON.parse(jsonString);
    }
    values<V>(obj: {[string]: V}): Array<V> {
        return Object.keys(obj).map(key => obj[key]);
    }
    entries<V>(obj: {[string]: V}): Array<[string, V]> {
        return Object.keys(obj).map(key => [key, obj[key]]);
    }
    // Result values are discarded and errors are thrown asynchronously.
    // NOTE: this is different from the one in u: the function passed
    // in must be fully bound with all of its arguments and will be immediately
    // called (this does not return a function). This makes it work better with
    // Flow: you get argument type checking by using `.bind`.
    fireAndForgetPromise(fn: () => Promise<mixed>) {
        fn().catch(err => {
            // Defer til later, so the error doesn't cause the promise to be rejected.
            setTimeout(() => {
                throw err;
            }, 0);
        });
    }
    has(obj: {+[string]: mixed}, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    _invertedEnumCache: WeakMap<{+[string]: string}, {+[string]: ?string}> = new WeakMap();
    _getInvertedEnumMemoized<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
        enumObj: EnumObj,
    ): {+[EnumValue]: ?$Keys<EnumObj>} {
        const existingInvertedEnum = this._invertedEnumCache.get(enumObj);
        if (existingInvertedEnum) {
            // flow-disable-next-line flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
            return existingInvertedEnum;
        }

        const invertedEnum: {[EnumValue]: ?$Keys<EnumObj>} = {};
        for (const enumKey of Object.keys(enumObj)) {
            const enumValue = enumObj[enumKey];
            invertedEnum[enumValue] = enumKey;
        }
        this._invertedEnumCache.set(enumObj, invertedEnum);
        return invertedEnum;
    }
    getEnumValueIfExists<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
        enumObj: EnumObj,
        valueToCheck: string,
    ): EnumValue | null {
        const invertedEnum = this._getInvertedEnumMemoized(enumObj);
        if (this.has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
            const enumKey = invertedEnum[valueToCheck];
            return enumObj[enumKey];
        }
        return null;
    }
    assertEnumValue<EnumValue: string, EnumObj: {+[string]: EnumValue}>(
        enumObj: EnumObj,
        valueToCheck: string,
    ): EnumValue {
        const enumValue = this.getEnumValueIfExists(enumObj, valueToCheck);
        if (!enumValue) {
            throw new Error(`Unknown enum value ${valueToCheck}`);
        }
        return enumValue;
    }
    isEnumValue(enumObj: {[string]: string}, valueToCheck: string): boolean {
        return this.getEnumValueIfExists(enumObj, valueToCheck) !== null;
    }
}

export default new PrivateUtils();
