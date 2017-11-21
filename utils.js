// @flow
const u = require('client_server_shared/u');

class Utils {
    *iterateKeys(obj: {[string]: any}): Iterable<string> { // eslint-disable-line flowtype/no-weak-types
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield key;
            }
        }
    }
    *iterateValues<T>(obj: {[string]: T}): Iterable<T> {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield obj[key];
            }
        }
    }
    *iterate<T>(obj: {[string]: T}): Iterable<[T, string]> {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                yield [obj[key], key];
            }
        }
    }
    cloneDeep<T: Object>(obj: T): T {
        // TODO(kasra): replace this with something faster.
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * Result values are discarded and errors are thrown asynchronously.
     * NOTE: this is different from the one in hyperUtils: the function passed
     * in must be fully bound with all of its arguments and will be immediately
     * called (this does not return a function). This makes it work better with
     * Flow: you get argument type checking by using `.bind`.
     */
    fireAndForgetPromise(fn: Function) {
        fn().catch(err => {
            // Defer til later, so the error doesn't cause the promise to be rejected.
            setTimeout(() => {
                throw err;
            }, 0);
        });
    }
    isEnumValue(enumObj: {[string]: string}, valueToCheck: string): boolean {
        for (const value of this.iterateValues(enumObj)) {
            if (value === valueToCheck) {
                return true;
            }
        }
        return false;
    }
    startsWith(string: string, target: string): boolean {
        return u.startsWith(string, target);
    }
}

module.exports = new Utils();
