/** @internal */ /** */
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import {TimeoutId} from '../private_utils';

type ObjectPoolOptions<T, Opts> = {
    getKeyFromObject: (arg1: T) => string;
    getKeyFromObjectOptions: (arg1: Opts) => string;
    canObjectBeReusedForOptions: (arg1: T, arg2: Opts) => boolean;
};

const WEAK_RETAIN_TIME_MS = 10000;

class ObjectPool<T, Opts> {
    /** @internal */
    _objectsByKey: {[key: string]: Array<T> | void} = {};
    /** @internal */
    _weakObjectsByKey: {[key: string]: Array<{object: T; timeoutId: TimeoutId}> | void} = {};
    /** @internal */
    _getKeyFromObject: (arg1: T) => string;
    /** @internal */
    _getKeyFromObjectOptions: (arg1: Opts) => string;
    /** @internal */
    _canObjectBeReusedForOptions: (arg1: T, arg2: Opts) => boolean;

    /** @hidden */
    constructor(config: ObjectPoolOptions<T, Opts>) {
        this._getKeyFromObject = config.getKeyFromObject;
        this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
        this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
    }

    // we have two different ways we can register an object for reuse - weak and strong. This one,
    // strong, will make sure that the object is kept in the pool until it is explicitly removed.
    /** @hidden */
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
    /** @hidden */
    unregisterObjectForReuseStrong(object: T) {
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._objectsByKey[objectKey];
        if (!pooledObjects) {
            throw spawnInvariantViolationError('pooledObjects');
        }
        const index = pooledObjects.indexOf(object);
        if (!(index !== -1)) {
            throw spawnInvariantViolationError('object not registered');
        }
        pooledObjects.splice(index, 1);
        if (pooledObjects.length === 0) {
            // `delete` causes de-opts, which slows down subsequent reads,
            // so set to undefined instead (unverified that this is actually faster).
            this._objectsByKey[objectKey] = undefined;
        }
    }

    // we have two different ways we can register an object for reuse - weak and strong. This one,
    // weak, will automatically unregister the object after a few seconds go by without it being
    // used.
    /** @hidden */
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
    /** @hidden */
    unregisterObjectForReuseWeak(object: T) {
        const didExist = this._unregisterObjectForReuseWeakIfExists(object);
        if (!didExist) {
            throw spawnError('Object was not registered for reuse');
        }
    }
    /** @internal */
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
            // `delete` causes de-opts, which slows down subsequent reads,
            // so set to undefined instead (unverified that this is actually faster).
            this._weakObjectsByKey[objectKey] = undefined;
        }

        return true;
    }

    /** @internal */
    _getObjectForReuseStrong(objectOptions: Opts): T | null {
        const key = this._getKeyFromObjectOptions(objectOptions);
        const pooledObjects = this._objectsByKey[key];
        if (pooledObjects) {
            // We expect that there won't be too many QueryResults for a given
            // model, so iterating over them should be okay. If this assumption
            // ends up being wrong, we can hash the opts or something.
            for (const object of pooledObjects) {
                if (this._canObjectBeReusedForOptions(object, objectOptions)) {
                    return object;
                }
            }
        }
        return null;
    }
    /** @internal */
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

        // reset the timer on this object if it's reused
        clearTimeout(timeoutId);
        stored.timeoutId = setTimeout(
            () => this.unregisterObjectForReuseWeak(object),
            WEAK_RETAIN_TIME_MS,
        );

        return object;
    }
    /** @hidden */
    getObjectForReuse(objectOptions: Opts): T | null {
        const strongObject = this._getObjectForReuseStrong(objectOptions);
        if (strongObject) {
            return strongObject;
        }

        return this._getObjectForReuseWeak(objectOptions);
    }
}

export default ObjectPool;
