/** @module @airtable/blocks/models: Cursor */ /** */
import {BaseData, ModelChange} from '../types/base';
import {RecordId} from '../types/record';
import {TableId} from '../types/table';
import {ViewId} from '../types/view';
import {AirtableInterface} from '../injected/airtable_interface';
import {isEnumValue, entries, ObjectValues, ObjectMap} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Table from './table';
import View from './view';
import Record from './record';

const WatchableCursorKeys = Object.freeze({
    selectedRecordIds: 'selectedRecordIds' as const,
    activeTableId: 'activeTableId' as const,
    activeViewId: 'activeViewId' as const,
    isDataLoaded: 'isDataLoaded' as const,
});

/**
 * Watchable keys in {@link Cursor}.
 * - `selectedRecordIds`
 * - `activeTableId`
 * - `activeViewId`
 * - `isDataLoaded`
 */
type WatchableCursorKey = ObjectValues<typeof WatchableCursorKeys>;

/** @hidden */
interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean> | null;
    activeTableId: TableId | null;
    activeViewId: ViewId | null;
}

/**
 * Contains information about the state of the user's current interactions in Airtable
 *
 * @example
 * ```js
 * import {cursor} from '@airtable/blocks';
 * ```
 * @docsPath models/Cursor
 */
class Cursor extends AbstractModelWithAsyncData<CursorData, WatchableCursorKey> {
    /** @internal */
    static _className = 'Cursor';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableCursorKeys, key);
    }
    /** @internal */
    static _shouldLoadDataForKey(key: WatchableCursorKey): boolean {
        return true;
    }
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _cursorData: CursorData;

    /** @internal */
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, 'cursor');
        this._airtableInterface = airtableInterface;

        const selectedRecordIdSet = baseData.cursorData?.selectedRecordIdSet ?? null;
        const activeTableId = baseData.activeTableId;
        const activeViewId = activeTableId ? baseData.tablesById[activeTableId].activeViewId : null;

        this._cursorData = {
            selectedRecordIdSet,
            activeTableId,
            activeViewId,
        };

        Object.seal(this);
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): CursorData {
        return this._cursorData;
    }
    /**
     * @internal
     */
    _onChangeIsDataLoaded() {
        this._onChange(WatchableCursorKeys.isDataLoaded);
    }
    /**
     * @internal
     */
    async _loadDataAsync(): Promise<Array<WatchableCursorKey>> {
        const cursorData = await this._airtableInterface.fetchAndSubscribeToCursorDataAsync();
        this._cursorData.selectedRecordIdSet = cursorData.selectedRecordIdSet;

        return [WatchableCursorKeys.selectedRecordIds];
    }
    /**
     * @internal
     */
    _unloadData() {
        this._airtableInterface.unsubscribeFromCursorData();
        this._cursorData.selectedRecordIdSet = null;
    }
    /**
     * The record IDs of all currently selected records, or an empty array if no records are selected.
     *
     * Can be watched.
     */
    get selectedRecordIds(): Array<RecordId> {
        const {selectedRecordIdSet} = this._data;
        if (!selectedRecordIdSet) {
            throw spawnInvariantViolationError('Cursor data is not loaded');
        }
        const selectedRecordIds = Object.keys(selectedRecordIdSet);
        return selectedRecordIds;
    }
    /**
     * Checks whether a given record is selected.
     *
     * @param recordOrRecordId The record or record ID to check for.
     * @returns `true` if the given record is selected, `false` otherwise.
     */
    isRecordSelected(recordOrRecordId: Record | string): boolean {
        const {selectedRecordIdSet} = this._data;
        if (!selectedRecordIdSet) {
            throw spawnInvariantViolationError('Cursor data is not loaded');
        }
        let recordId: string;
        if (recordOrRecordId instanceof Record) {
            recordId = recordOrRecordId.id;
        } else {
            recordId = recordOrRecordId;
        }
        return !!selectedRecordIdSet[recordId];
    }
    /**
     * The currently active table ID. Can be null when the active table has changed and is not yet
     * loaded.
     *
     * Can be watched.
     */
    get activeTableId(): TableId | null {
        return this._data.activeTableId;
    }
    /**
     * The currently active view ID. This will always be a view belonging to `activeTableId`. Can be
     * null when the active view has changed and is not yet loaded.
     *
     * Can be watched.
     */
    get activeViewId(): ViewId | null {
        return this._data.activeViewId;
    }
    /**
     * Sets the specified table to active in the Airtable UI. If the blocks pane is fullscreen, the
     * table will still be set as active, but the blocks pane will continue to be displayed
     * fullscreen.
     *
     * @param tableOrTableId The target table or table ID to set as active in the Airtable main page.
     */
    setActiveTable(tableOrTableId: Table | TableId): void {
        const tableId = tableOrTableId instanceof Table ? tableOrTableId.id : tableOrTableId;
        this._airtableInterface.setActiveViewOrTable(tableId);
    }
    /**
     * Sets the specified view (and corresponding table) to active in the Airtable UI. If the blocks
     * pane is fullscreen, the view will still be set as active, but the blocks pane will continue
     * to be displayed fullscreen.
     *
     * @param tableOrTableId The table or table ID that the target view belongs to.
     * @param viewOrViewId The target view or view ID to set as active in the Airtable main page.
     */
    setActiveView(tableOrTableId: Table | TableId, viewOrViewId: View | ViewId): void {
        const tableId = tableOrTableId instanceof Table ? tableOrTableId.id : tableOrTableId;
        const viewId = viewOrViewId instanceof View ? viewOrViewId.id : viewOrViewId;
        this._airtableInterface.setActiveViewOrTable(tableId, viewId);
    }

    /**
     * @internal
     */
    __applyChangesWithoutTriggeringEvents(
        changes: ReadonlyArray<ModelChange>,
    ): ObjectMap<WatchableCursorKey, boolean> {
        let changedKeys = {
            [WatchableCursorKeys.selectedRecordIds]: false,
            [WatchableCursorKeys.activeTableId]: false,
            [WatchableCursorKeys.activeViewId]: false,
        } as ObjectMap<WatchableCursorKey, boolean>;
        for (const {path, value} of changes) {
            if (path[0] === 'cursorData' && path[1] === 'selectedRecordIdSet') {
                if (!(path.length === 2)) {
                    throw spawnInvariantViolationError('cannot set within selectedRecordIdSet');
                }
                this._cursorData.selectedRecordIdSet = value as any;
                changedKeys[WatchableCursorKeys.selectedRecordIds] = true;
            }

            if (path[0] === 'activeTableId') {
                if (!(value === null || typeof value === 'string')) {
                    throw spawnInvariantViolationError('activeTableId must be string or null');
                }
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
                if (!(value === null || typeof value === 'string')) {
                    throw spawnInvariantViolationError('activeTableId must be string or null');
                }
                this._cursorData.activeViewId = value;
                changedKeys[WatchableCursorKeys.activeViewId] = true;
            }
        }

        return changedKeys;
    }
    /**
     * @internal
     */
    __triggerOnChangeForChangedKeys(changedKeys: ObjectMap<WatchableCursorKey, boolean>) {
        for (const [key, didChange] of entries(changedKeys)) {
            if (didChange) {
                this._onChange(key);
            }
        }
    }
}

export default Cursor;
