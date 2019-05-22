// @flow
import invariant from 'invariant';

type ObjectPoolOptions<T, Opts> = {|
    getKeyFromObject: T => string,
    getKeyFromObjectOptions: Opts => string,
    canObjectBeReusedForOptions: (T, Opts) => boolean,
|};

class ObjectPool<T, Opts> {
    _objectsByKey: {[string]: Array<T> | void} = {};
    _getKeyFromObject: T => string;
    _getKeyFromObjectOptions: Opts => string;
    _canObjectBeReusedForOptions: (T, Opts) => boolean;

    constructor(config: ObjectPoolOptions<T, Opts>) {
        this._getKeyFromObject = config.getKeyFromObject;
        this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
        this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
    }

    registerObjectForReuse(object: T) {
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._objectsByKey[objectKey];
        if (pooledObjects) {
            pooledObjects.push(object);
        } else {
            this._objectsByKey[objectKey] = [object];
        }
    }
    unregisterObjectForReuse(object: T) {
        const objectKey = this._getKeyFromObject(object);
        const pooledObjects = this._objectsByKey[objectKey];
        invariant(pooledObjects, 'pooledObjects');
        const index = pooledObjects.indexOf(object);
        invariant(index !== -1, 'object not registered');
        pooledObjects.splice(index, 1);
        if (pooledObjects.length === 0) {
            // `delete` causes de-opts, which slows down subsequent reads,
            // so set to undefined instead (unverified that this is actually faster).
            this._objectsByKey[objectKey] = undefined;
        }
    }
    getObjectForReuse(objectOptions: Opts): T | null {
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
}

export default ObjectPool;
