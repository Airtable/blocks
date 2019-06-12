// @flow

import invariant from 'invariant';
import {type BaseData} from '../types/base';
import Watchable from '../watchable';

/**
 * Abstract superclass for all models. You won't use this class directly.
 */
class AbstractModel<DataType, WatchableKey: string> extends Watchable<WatchableKey> {
    static _className = 'AbstractModel';
    static _isWatchableKey(key: string): boolean {
        // Override to return whether `key` is a valid watchable key.
        return false;
    }
    _baseData: BaseData;
    _id: string;
    /**
     * @hideconstructor
     */
    constructor(baseData: BaseData, modelId: string) {
        super();

        invariant(
            typeof modelId === 'string',
            `${this.constructor._className} id should be a string`,
        );

        this._baseData = baseData;
        this._id = modelId;
    }
    /**
     * @function
     * @returns The ID for this model.
     */
    get id(): string {
        return this._id;
    }
    /**
     * @private
     */
    get _dataOrNullIfDeleted(): DataType | null {
        // Abstract, implement this.
        throw new Error('abstract method');
    }
    /**
     * @private
     */
    get _data(): DataType {
        const data = this._dataOrNullIfDeleted;
        if (data === null) {
            throw new Error(this._getErrorMessageForDeletion());
        }
        return data;
    }
    /**
     * A boolean denoting whether the model has been deleted.
     *
     * In general, it's best to avoid keeping a reference to an object past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted object (other than its ID) will throw. But if you keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * model's data.
     *
     * @function
     * @returns `true` if the model has been deleted, and `false` otherwise.
     */
    get isDeleted(): boolean {
        return this._dataOrNullIfDeleted === null;
    }
    /**
     * @private
     */
    get __baseData(): BaseData {
        return this._baseData;
    }
    /**
     * @private
     */
    _getErrorMessageForDeletion(): string {
        return this.constructor._className + ' has been deleted';
    }
    /**
     * @returns A string representation of the model for use in debugging.
     */
    toString(): string {
        return `[${this.constructor._className} ${this.id}]`;
    }
}

export default AbstractModel;
