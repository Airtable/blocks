// @flow
import invariant from 'invariant';
import {type BaseData, type ModelChange} from '../types/base';
import {type RecordId} from '../types/record';
import {type TableId} from '../types/table';
import {type ViewId} from '../types/view';
import {type AirtableInterface} from '../injected/airtable_interface';
import {isEnumValue, entries} from '../private_utils';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Record from './record';

const WatchableCursorKeys = Object.freeze({
    selectedRecordIds: ('selectedRecordIds': 'selectedRecordIds'),
    activeTableId: ('activeTableId': 'activeTableId'),
    activeViewId: ('activeViewId': 'activeViewId'),
    isDataLoaded: ('isDataLoaded': 'isDataLoaded'),
});

type WatchableCursorKey = $Values<typeof WatchableCursorKeys>;

type CursorData = {|
    selectedRecordIdSet: {[RecordId]: boolean} | null,
    activeTableId: TableId | null,
    activeViewId: ViewId | null,
|};

// NOTE: cursor is an AbstractModel because it includes loadable data.
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
    _cursorData: CursorData;
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, 'cursor');
        this._airtableInterface = airtableInterface;

        const selectedRecordIdSet = baseData.cursorData
            ? baseData.cursorData.selectedRecordIdSet || null
            : null;
        const activeTableId = baseData.activeTableId;
        const activeViewId = activeTableId ? baseData.tablesById[activeTableId].activeViewId : null;

        this._cursorData = {
            selectedRecordIdSet,
            activeTableId,
            activeViewId,
        };

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): CursorData {
        return this._cursorData;
    }
    _onChangeIsDataLoaded() {
        this._onChange(WatchableCursorKeys.isDataLoaded);
    }
    async _loadDataAsync(): Promise<Array<WatchableCursorKey>> {
        const cursorData = await this._airtableInterface.fetchAndSubscribeToCursorDataAsync();
        this._cursorData.selectedRecordIdSet = cursorData.selectedRecordIdSet;

        return [WatchableCursorKeys.selectedRecordIds];
    }
    _unloadData() {
        this._airtableInterface.unsubscribeFromCursorData();
        this._cursorData.selectedRecordIdSet = null;
    }
    get selectedRecordIds(): Array<RecordId> {
        const {selectedRecordIdSet} = this._data;
        invariant(selectedRecordIdSet, 'Cursor data is not loaded');
        const selectedRecordIds = Object.keys(selectedRecordIdSet);
        return selectedRecordIds;
    }
    isRecordSelected(recordOrRecordId: Record | string): boolean {
        const {selectedRecordIdSet} = this._data;
        invariant(selectedRecordIdSet, 'Cursor data is not loaded');
        let recordId: string;
        if (recordOrRecordId instanceof Record) {
            recordId = recordOrRecordId.id;
        } else {
            recordId = recordOrRecordId;
        }
        return !!selectedRecordIdSet[recordId];
    }
    /**
     * Returns the currently active table ID. Can return null when the active table has changed and
     * is not yet loaded.
     */
    get activeTableId(): TableId | null {
        return this._data.activeTableId;
    }
    /**
     * Returns the currently active view ID. This will always be a view belonging to
     * `activeTableId`. Returns `null` when the active view has changed and is not yet loaded.
     */
    get activeViewId(): ViewId | null {
        return this._data.activeViewId;
    }
    __applyChangesWithoutTriggeringEvents(
        changes: Array<ModelChange>,
    ): {[WatchableCursorKey]: boolean} {
        let changedKeys = {
            [WatchableCursorKeys.selectedRecordIds]: false,
            [WatchableCursorKeys.activeTableId]: false,
            [WatchableCursorKeys.activeViewId]: false,
        };
        for (const {path, value} of changes) {
            if (path[0] === 'cursorData' && path[1] === 'selectedRecordIdSet') {
                invariant(path.length === 2, 'cannot set within selectedRecordIdSet');
                this._cursorData.selectedRecordIdSet = (value: any);
                changedKeys[WatchableCursorKeys.selectedRecordIds] = true;
            }

            if (path[0] === 'activeTableId') {
                invariant(
                    value === null || typeof value === 'string',
                    'activeTableId must be string or null',
                );
                this._cursorData.activeTableId = value;
                changedKeys[WatchableCursorKeys.activeTableId] = true;

                if (value === null) {
                    this._cursorData.activeViewId = null;
                    changedKeys[WatchableCursorKeys.activeViewId] = true;
                }
            }

            if (
                path[0] === 'tablesById' &&
                path[1] === this.activeTableId &&
                path[2] === 'activeViewId'
            ) {
                invariant(
                    value === null || typeof value === 'string',
                    'activeTableId must be string or null',
                );
                this._cursorData.activeViewId = value;
                changedKeys[WatchableCursorKeys.activeViewId] = true;
            }
        }

        return changedKeys;
    }

    __triggerOnChangeForChangedKeys(changedKeys: {[WatchableCursorKey]: boolean}) {
        for (const [key, didChange] of entries(changedKeys)) {
            if (didChange) {
                this._onChange(key);
            }
        }
    }
}

export default Cursor;
