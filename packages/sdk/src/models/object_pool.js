// @flow
import {invariant, spawnError} from '../error_utils';

type ObjectPoolOptions<T, Opts> = {|
    getKeyFromObject: T => string,
    getKeyFromObjectOptions: Opts => string,
    canObjectBeReusedForOptions: (T, Opts) => boolean,
|};

const WEAK_RETAIN_TIME_MS = 10000;

class ObjectPool<T, Opts> {
    _objectsByKey: {[string]: Array<T> | void} = {};
    _weakObjectsByKey: {[string]: Array<{|object: T, timeoutId: TimeoutID|}> | void} = {};
    _getKeyFromObject: T => string;
    _getKeyFromObjectOptions: Opts => string;
    _canObjectBeReusedForOptions: (T, Opts) => boolean;

    constructor(config: ObjectPoolOptions<T, Opts>) {
        this._getKeyFromObject = config.getKeyFromObject;
        this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
        this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
    }

    registerObjectForReuseStrong(object: T) {
        this._unregisterObjectForReuseWeakIfExists(object);
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._objectsByKey[objectKey];
        if (pooledObjects) {
            pooledObjects.push(object);
        } else {
            this._objectsByKey[objectKey] = [object];
        }
    }
    unregisterObjectForReuseStrong(object: T) {
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._objectsByKey[objectKey];
        invariant(pooledObjects, 'pooledObjects');
        const index = pooledObjects.indexOf(object);
        invariant(index !== -1, 'object not registered');
        pooledObjects.splice(index, 1);
        if (pooledObjects.length === 0) {
            this._objectsByKey[objectKey] = undefined;
        }
    }

    registerObjectForReuseWeak(object: T) {
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._weakObjectsByKey[objectKey];

        const toStore = {
            object,
            timeoutId: setTimeout(
                () => this.unregisterObjectForReuseWeak(object),
                WEAK_RETAIN_TIME_MS,
            ),
        };

        if (pooledObjects) {
            pooledObjects.push(toStore);
        } else {
            this._weakObjectsByKey[objectKey] = [toStore];
        }
    }
    unregisterObjectForReuseWeak(object: T) {
        const didExist = this._unregisterObjectForReuseWeakIfExists(object);
        if (!didExist) {
            throw spawnError('Object was not registered for reuse');
        }
    }
    _unregisterObjectForReuseWeakIfExists(object: T): boolean {
        const objectKey = this._getKeyFromObject(object);
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
            this._objectsByKey[objectKey] = undefined;
        }

        return true;
    }

    _getObjectForReuseStrong(objectOptions: Opts): T | null {
        const key = this._getKeyFromObjectOptions(objectOptions);
        const pooledObjects = this._objectsByKey[key];
        if (pooledObjects) {
            for (const object of pooledObjects) {
                if (this._canObjectBeReusedForOptions(object, objectOptions)) {
                    return object;
                }
            }
        }
        return null;
    }
    _getObjectForReuseWeak(objectOptions: Opts): T | null {
        const key = this._getKeyFromObjectOptions(objectOptions);
        const pooledObjects = this._weakObjectsByKey[key];
        if (!pooledObjects) {
            return null;
        }

        const stored = pooledObjects.find(({object}) =>
            this._canObjectBeReusedForOptions(object, objectOptions),
        );
        if (!stored) {
            return null;
        }

        const {object, timeoutId} = stored;

        clearTimeout(timeoutId);
        stored.timeoutId = setTimeout(
            () => this.unregisterObjectForReuseWeak(object),
            WEAK_RETAIN_TIME_MS,
        );

        return object;
    }
    getObjectForReuse(objectOptions: Opts): T | null {
        const strongObject = this._getObjectForReuseStrong(objectOptions);
        if (strongObject) {
            return strongObject;
        }

        return this._getObjectForReuseWeak(objectOptions);
    }
}

export default ObjectPool;
