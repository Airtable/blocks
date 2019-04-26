// @flow
const utils = require('block_sdk/shared/private_utils');
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const AbstractModelWithAsyncData = require('block_sdk/shared/models/abstract_model_with_async_data');
const Record = require('block_sdk/shared/models/record');

import type {
    BaseDataForBlocks,
    CursorDataForBlocks,
} from 'client_server_shared/blocks/block_sdk_init_data';
import type {RowId as RecordId} from 'client_server_shared/hyper_id';
import type AirtableInterfaceFrontend from 'block_sdk/frontend/airtable_interface_frontend';

const WatchableCursorKeys = {
    selectedRecordIds: ('selectedRecordIds': 'selectedRecordIds'),
};

type WatchableCursorKey = $Values<typeof WatchableCursorKeys>;

// NOTE: cursor is an AbstractModel because it needs access to the base data.
/**
 * Contains information about the state of the user's current interactions in Airtable
 *
 * @example
 * import {cursor} from 'airtable-block';
 */
class Cursor extends AbstractModelWithAsyncData<CursorDataForBlocks, WatchableCursorKey> {
    static _className = 'Cursor';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableCursorKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableCursorKey): boolean {
        return true;
    }
    _airtableInterface: AirtableInterfaceFrontend;
    constructor(baseData: BaseDataForBlocks, airtableInterface: AirtableInterfaceFrontend) {
        super(baseData, 'cursor');

        this._airtableInterface = airtableInterface;

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): CursorDataForBlocks | null {
        return this._baseData.cursorData;
    }
    async _loadDataAsync(): Promise<Array<WatchableCursorKey>> {
        const cursorData = await this._airtableInterface.fetchAndSubscribeToCursorDataAsync();
        this._baseData.cursorData = cursorData;

        return [WatchableCursorKeys.selectedRecordIds];
    }
    _unloadData() {
        this._airtableInterface.unsubscribeFromCursorData();
        this._baseData.cursorData = null;
    }
    /** */
    get selectedRecordIds(): Array<RecordId> {
        h.assert(this._isDataLoaded, 'Cursor data is not loaded');
        const selectedRecordIds = Object.keys(this._data.selectedRecordIdSet);
        return selectedRecordIds;
    }
    /** */
    isRecordSelected(recordOrRecordId: Record | string): boolean {
        h.assert(this._isDataLoaded, 'Cursor data is not loaded');
        let recordId: string;
        if (recordOrRecordId instanceof Record) {
            recordId = recordOrRecordId.id;
        } else {
            recordId = recordOrRecordId;
        }
        return !!this._data.selectedRecordIdSet[recordId];
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (this.isDataLoaded && dirtyPaths.selectedRecordIdSet) {
            this._onChange(WatchableCursorKeys.selectedRecordIds);
        }
    }
}

module.exports = Cursor;
