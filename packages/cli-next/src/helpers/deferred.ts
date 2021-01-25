const deferResolveInit = (value: any) => {};
const deferRejectInit = (reason?: any) => {};

export class Deferred<T> implements PromiseLike<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    promise: Promise<T>;

    constructor() {
        this.resolve = deferResolveInit;
        this.reject = deferRejectInit;
        this.promise = new Promise((_resolve, _reject) => {
            this.resolve = _resolve;
            this.reject = _reject;
        });
    }

    then<T1, T2 = T1>(
        resolve: (value: T) => T1 | PromiseLike<T1>,
        reject: (reason?: any) => T2 | PromiseLike<T2>,
    ) {
        return this.promise.then(resolve, reject);
    }
}
