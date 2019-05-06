// @flow
import {type CursorData} from './types/cursor';
import {type BaseData} from './types/base';
import {type RecordId} from './types/record';
import {isEnumValue} from './private_utils';
import AbstractModelWithAsyncData from './models/abstract_model_with_async_data';
import Record from './models/record';
import {type AirtableInterface} from './injected/airtable_interface';

const {h} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

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
class Cursor extends AbstractModelWithAsyncData<CursorData, WatchableCursorKey> {
    static _className = 'Cursor';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableCursorKeys, key);
    }
    static _shouldLoadDataForKey(key: WatchableCursorKey): boolean {
        return true;
    }
    _airtableInterface: AirtableInterface;
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, 'cursor');

        this._airtableInterface = airtableInterface;

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): CursorData | null {
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

export default Cursor;
