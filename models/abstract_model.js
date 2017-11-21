// @flow
const Watchable = require('client/blocks/sdk/watchable');

import type {BaseDataForBlocks} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';

// Abstract superclass for all block SDK models.
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

        this._baseData = baseData;
        this._id = modelId;
    }
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
