// @flow
class PrivateUtils {
    cloneDeep<T: mixed>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
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
    fireAndForgetPromise(fn: Function) {
        fn().catch(err => {
            // Defer til later, so the error doesn't cause the promise to be rejected.
            setTimeout(() => {
                throw err;
            }, 0);
        });
    }
    isEnumValue(enumObj: {[string]: string}, valueToCheck: string): boolean {
        for (const value of this.values(enumObj)) {
            if (value === valueToCheck) {
                return true;
            }
        }
        return false;
    }
}

export default new PrivateUtils();
