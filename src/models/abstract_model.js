// @flow
const Watchable = require('../watchable');
const invariant = require('invariant');

import type {BaseDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';

/**
 * Abstract superclass for all models.
 */
class AbstractModel<DataType, WatchableKey: string> extends Watchable<WatchableKey> {
    static _className = 'AbstractModel';
    static _isWatchableKey(key: string): boolean {
        // Override to return whether `key` is a valid watchable key.
        return false;
    }
    _baseData: BaseDataForBlocks;
    _id: string;
    constructor(baseData: BaseDataForBlocks, modelId: string) {
        super();

        invariant(
            typeof modelId === 'string',
            `${this.constructor._className} id should be a string`,
        );

        this._baseData = baseData;
        this._id = modelId;
    }
    /** The ID for this model. */
    get id(): string {
        return this._id;
    }
    get _dataOrNullIfDeleted(): DataType | null {
        // Abstract, implement this.
        throw new Error('abstract method');
    }
    get _data(): DataType {
        const data = this._dataOrNullIfDeleted;
        if (data === null) {
            throw new Error(this._getErrorMessageForDeletion());
        }
        return data;
    }
    /**
     * True if the model has been deleted.
     *
     * In general, it's best to avoid keeping a reference to an object past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted object (other than its ID) will throw. But if you keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * model's data.
     */
    get isDeleted(): boolean {
        return this._dataOrNullIfDeleted === null;
    }
    get __baseData(): BaseDataForBlocks {
        return this._baseData;
    }
    _getErrorMessageForDeletion(): string {
        return this.constructor._className + ' has been deleted';
    }
    toString(): string {
        return `[${this.constructor._className} ${this.id}]`;
    }
}

module.exports = AbstractModel;
