/** @module @airtable/blocks/models: Cursor */ /** */
import Sdk from '../sdk';
import {ModelChange} from '../types/base';
import {RecordId} from '../types/record';
import {TableId} from '../types/table';
import {ViewId} from '../types/view';
import {FieldId} from '../types/field';
import {isEnumValue, entries, ObjectValues, ObjectMap} from '../private_utils';
import {invariant} from '../error_utils';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Table from './table';
import View from './view';
import Record from './record';

const WatchableCursorKeys = Object.freeze({
    selectedRecordIds: 'selectedRecordIds' as const,
    selectedFieldIds: 'selectedFieldIds' as const,
    activeTableId: 'activeTableId' as const,
    activeViewId: 'activeViewId' as const,
    isDataLoaded: 'isDataLoaded' as const,
});

/**
 * Watchable keys in {@link Cursor}.
 * - `selectedRecordIds`
 * - `selectedFieldIds`
 * - `activeTableId`
 * - `activeViewId`
 * - `isDataLoaded`
 */
type WatchableCursorKey = ObjectValues<typeof WatchableCursorKeys>;

/** @hidden */
interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean> | null;
    selectedFieldIdSet: ObjectMap<FieldId, boolean> | null;
    activeTableId: TableId | null;
    activeViewId: ViewId | null;
}

/**
 * Model class containing information about the state of the user's current interactions in
 * Airtable - specifically, their active table, active view, selected records and selected fields.
 * Also allows you to set the active table and active view.
 *
 * Selected records and fields are not loaded by default and the cursor must be loaded with
 * {@link useLoadable} to access them.
 *
 * ```js
 * import {useCursor, useWatchable} from '@airtable/blocks/ui';
 *
 *  function ActiveTableAndView() {
 *      const cursor = useCursor();
 *
 *      return (
 *          <div>
 *              Active table: {cursor.activeTableId}
 *              Active view: {cursor.activeViewId}
 *          </div>
 *      );
 *  }
 * ```
 *
 * ```js
 * import {useCursor, useLoadable, useWatchable} from '@airtable/blocks/ui';
 *
 *  function SelectedRecordAndFieldIds() {
 *      const cursor = useCursor();
 *      // load selected records and fields
 *      useLoadable(cursor);
 *
 *      // re-render whenever the list of selected records or fields changes
 *      useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
 *
 *      return (
 *          <div>
 *              Selected records: {cursor.selectedRecordIds.join(', ')}
 *              Selected fields: {cursor.selectedFieldIds.join(', ')}
 *          </div>
 *      );
 *  }
 * ```
 *
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
    _cursorData: CursorData;

    /** @internal */
    constructor(sdk: Sdk) {
        super(sdk, 'cursor');

        const baseData = sdk.__airtableInterface.sdkInitData.baseData;
        const selectedRecordIdSet = baseData.cursorData?.selectedRecordIdSet ?? null;
        const selectedFieldIdSet = baseData.cursorData?.selectedFieldIdSet ?? null;
        const activeTableId = baseData.activeTableId;
        const activeTable = activeTableId ? baseData.tablesById[activeTableId] : null;
        const activeViewId = activeTable?.activeViewId ?? null;

        this._cursorData = {
            selectedRecordIdSet,
            selectedFieldIdSet,
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
        const cursorData = await this._sdk.__airtableInterface.fetchAndSubscribeToCursorDataAsync();
        this._cursorData.selectedRecordIdSet = cursorData.selectedRecordIdSet;
        this._cursorData.selectedFieldIdSet = cursorData.selectedFieldIdSet;

        return [WatchableCursorKeys.selectedRecordIds, WatchableCursorKeys.selectedFieldIds];
    }
    /**
     * @internal
     */
    _unloadData() {
        this._sdk.__airtableInterface.unsubscribeFromCursorData();
        this._cursorData.selectedRecordIdSet = null;
        this._cursorData.selectedFieldIdSet = null;
    }
    /**
     * The record IDs of all currently selected records, or an empty array if no records are selected.
     *
     * Not loaded by default. You must load cursor data with `useLoadable(cursor)` (recommended) or
     * `cursor.loadDataAsync()` before use.
     *
     * Can be watched.
     */
    get selectedRecordIds(): Array<RecordId> {
        const {selectedRecordIdSet} = this._data;
        invariant(selectedRecordIdSet, 'Cursor data is not loaded');
        const selectedRecordIds = Object.keys(selectedRecordIdSet);
        return selectedRecordIds;
    }
    /**
     * The field IDs of all currently selected fields, or an empty array if no fields are selected.
     *
     * Not loaded by default: you must load cursor data with `useLoadable(cursor)` (recommended) or
     * `cursor.loadDataAsync()` before use.
     *
     * Can be watched.
     */
    get selectedFieldIds(): Array<RecordId> {
        const {selectedFieldIdSet} = this._data;
        invariant(selectedFieldIdSet, 'Cursor data is not loaded');
        const selectedRecordIds = Object.keys(selectedFieldIdSet);
        return selectedRecordIds;
    }
    /**
     * Checks whether a given record is selected.
     *
     * Selected records are not loaded by default. You must load cursor data with
     * `useLoadable(cursor)` (recommended) or `cursor.loadDataAsync()` before use.
     *
     * @param recordOrRecordId The record or record ID to check for.
     */
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
     * The currently active table ID. Can be null when the active table has changed and is not yet
     * loaded, and can also refer to a table that is not yet loaded.
     *
     * When fetching the {@link Table}, use `base.getTableByIdIfExists(cursor.activeTableId)` and
     * check the return value is not `null` to be resilient to those cases.
     *
     * Can be watched.
     */
    get activeTableId(): TableId | null {
        return this._data.activeTableId;
    }
    /**
     * The currently active view ID. This will always be a view belonging to `activeTableId`. Can be
     * null when the active view has changed and is not yet loaded, and can also refer to a view
     * that is not yet loaded.
     *
     * When fetching the {@link View}, use `table.getViewByIdIfExists(cursor.activeViewId)` and
     * check the return value is not `null` to be resilient to those cases.
     *
     * Can be watched.
     */
    get activeViewId(): ViewId | null {
        return this._data.activeViewId;
    }
    /**
     * Sets the specified table to active in the Airtable UI. If the apps pane is fullscreen, the
     * table will still be set as active, but the apps pane will continue to be displayed
     * fullscreen.
     *
     * @param tableOrTableId The target table or table ID to set as active in the Airtable main page.
     */
    setActiveTable(tableOrTableId: Table | TableId): void {
        const tableId = tableOrTableId instanceof Table ? tableOrTableId.id : tableOrTableId;
        this._sdk.__airtableInterface.setActiveViewOrTable(tableId);
    }
    /**
     * Sets the specified view (and corresponding table) to active in the Airtable UI. If the apps
     * pane is fullscreen, the view will still be set as active, but the apps pane will continue
     * to be displayed fullscreen.
     *
     * @param tableOrTableId The table or table ID that the target view belongs to.
     * @param viewOrViewId The target view or view ID to set as active in the Airtable main page.
     */
    setActiveView(tableOrTableId: Table | TableId, viewOrViewId: View | ViewId): void {
        const tableId = tableOrTableId instanceof Table ? tableOrTableId.id : tableOrTableId;
        const viewId = viewOrViewId instanceof View ? viewOrViewId.id : viewOrViewId;
        this._sdk.__airtableInterface.setActiveViewOrTable(tableId, viewId);
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
            if (path[0] === 'cursorData') {
                switch (path[1]) {
                    case 'selectedRecordIdSet': {
                        invariant(path.length === 2, 'cannot set within selectedRecordIdSet');
                        this._cursorData.selectedRecordIdSet = value as any;
                        changedKeys[WatchableCursorKeys.selectedRecordIds] = true;
                        break;
                    }
                    case 'selectedFieldIdSet': {
                        invariant(path.length === 2, 'cannot set within selectedFieldIdSet');
                        this._cursorData.selectedFieldIdSet = value as any;
                        changedKeys[WatchableCursorKeys.selectedFieldIds] = true;
                        break;
                    }
                    default:
                }
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
