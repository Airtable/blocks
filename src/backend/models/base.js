// @flow
import type {BaseDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';

class Base {
    _id: string;
    constructor(baseData: BaseDataForBlocks) {
        this._id = baseData.id;
    }
    get id(): string {
        return this._id;
    }
}

module.exports = Base;
