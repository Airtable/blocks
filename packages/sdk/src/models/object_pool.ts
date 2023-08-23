/** @hidden */ /** */
import {invariant} from '../error_utils';
import {TimeoutId} from '../private_utils';

const WEAK_RETAIN_TIME_MS = 10000;

export interface Poolable {
    __poolKey: string;
}

class ObjectPool<T extends Poolable, Ctor extends new (...args: any[]) => T> {
    /** @internal */
    _objectsByKey: {[key: string]: Array<T> | void} = {};
    /** @internal */
    _weakObjectsByKey: {[key: string]: Array<{object: T; timeoutId: TimeoutId}> | void} = {};
    /** @internal */
    _Ctor: Ctor;

    /** @hidden */
    constructor(ctor: Ctor) {
        this._Ctor = ctor;
    }

    /** @hidden */
    registerObjectForReuseStrong(object: T) {
        this._unregisterObjectForReuseWeakIfExists(object);
        const objectKey = object.__poolKey;
        const pooledObjects = this._objectsByKey[objectKey];
        if (pooledObjects) {
            pooledObjects.push(object);
        } else {
            this._objectsByKey[objectKey] = [object];
        }
    }
    /** @hidden */
    unregisterObjectForReuseStrong(object: T) {
        const objectKey = object.__poolKey;
        const pooledObjects = this._objectsByKey[objectKey];
        invariant(pooledObjects, 'pooledObjects');
        const index = pooledObjects.indexOf(object);
        invariant(index !== -1, 'object not registered');
        pooledObjects.splice(index, 1);
        if (pooledObjects.length === 0) {
            this._objectsByKey[objectKey] = undefined;
        }
    }

    /** @hidden */
    _registerObjectForReuseWeak(object: T) {
        const objectKey = object.__poolKey;
        const pooledObjects = this._weakObjectsByKey[objectKey];

        const toStore = {
            object,
            timeoutId: setTimeout(
                () => this._unregisterObjectForReuseWeakIfExists(object),
                WEAK_RETAIN_TIME_MS,
            ),
        };

        if (pooledObjects) {
            pooledObjects.push(toStore);
        } else {
            this._weakObjectsByKey[objectKey] = [toStore];
        }
    }
    /** @internal */
    _unregisterObjectForReuseWeakIfExists(object: T): boolean {
        const objectKey = object.__poolKey;
        const pooledObjects = this._weakObjectsByKey[objectKey];
        if (!pooledObjects) {
            return false;
        }
        const index = pooledObjects.findIndex(stored => stored.object === object);
        if (index === -1) {
            return false;
        }

        const stored = pooledObjects[index];
        clearTimeout(stored.timeoutId);

        pooledObjects.splice(index, 1);
        if (pooledObjects.length === 0) {
            this._weakObjectsByKey[objectKey] = undefined;
        }

        return true;
    }

    /** @internal */
    _getObjectForReuseStrong(key: string): T | null {
        const pooledObjects = this._objectsByKey[key];
        if (pooledObjects) {
            for (const object of pooledObjects) {
                if (object.__poolKey === key) {
                    return object;
                }
            }
        }
        return null;
    }
    /** @internal */
    _getObjectForReuseWeak(key: string): T | null {
        const pooledObjects = this._weakObjectsByKey[key];
        if (!pooledObjects) {
            return null;
        }

        const stored = pooledObjects.find(({object}) => object.__poolKey === key);
        if (!stored) {
            return null;
        }

        const {object, timeoutId} = stored;

        clearTimeout(timeoutId);
        stored.timeoutId = setTimeout(
            () => this._unregisterObjectForReuseWeakIfExists(object),
            WEAK_RETAIN_TIME_MS,
        );

        return object;
    }
    /** @hidden */
    getObjectForReuse(...args: ConstructorParameters<Ctor>): T {
        const newObject = new this._Ctor(...args);
        const key = newObject.__poolKey;
        const existingObject =
            this._getObjectForReuseStrong(key) || this._getObjectForReuseWeak(key);

        if (existingObject) {
            return existingObject;
        }

        this._registerObjectForReuseWeak(newObject);

        return newObject;
    }
}

export default ObjectPool;
