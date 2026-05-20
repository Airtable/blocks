import {type SdkMode} from '../../sdk_mode';
import {isEnumValue, type ObjectValues} from '../private_utils';
import {AbstractModelWithAsyncData} from './abstract_model_with_async_data';
import {WatchableCellValuesInFieldKeyPrefix} from './record_store_core';

/**
 * Watchable keys common to both base-mode and interface-mode `RecordQueryResult`s.
 * Each mode's subclass may spread these into its own key enum and add mode-specific
 * keys on top (e.g. `recordColors`/`groups`/`groupLevels` in base mode).
 *
 * @hidden
 */
export const WatchableRecordQueryResultKeysCore = Object.freeze({
    records: 'records' as const,
    recordIds: 'recordIds' as const,
    cellValues: 'cellValues' as const,
    isDataLoaded: 'isDataLoaded' as const,
});

/** @hidden */
export type WatchableRecordQueryResultKeyCore =
    | ObjectValues<typeof WatchableRecordQueryResultKeysCore>
    | string;

/**
 * Shared scaffolding for `RecordQueryResult` classes. Provides the watchable-key
 * machinery that both modes need; concrete record/recordId accessors and the
 * host-side load contract live on the mode-specific subclasses.
 *
 * @hidden
 */
export abstract class RecordQueryResultCore<
    SdkModeT extends SdkMode,
    DataType = {},
    WatchableKeys extends string = WatchableRecordQueryResultKeyCore,
> extends AbstractModelWithAsyncData<SdkModeT, DataType, WatchableKeys> {
    static _className = 'RecordQueryResultCore';

    /**
     * Any of the shared keys, or a `cellValuesInField:<fieldId>` prefix key.
     * Mode-specific subclasses should extend this with their own additional keys.
     */
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordQueryResultKeysCore, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    /**
     * Keys whose watchers should cause the underlying data to be loaded. Watching
     * `isDataLoaded` alone doesn't trigger a load — only the data keys do.
     */
    static _shouldLoadDataForKey(key: string): boolean {
        return (
            key === WatchableRecordQueryResultKeysCore.records ||
            key === WatchableRecordQueryResultKeysCore.recordIds ||
            key === WatchableRecordQueryResultKeysCore.cellValues ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    /**
     * Fires when the `isDataLoaded` state flips (called by
     * `AbstractModelWithAsyncData` after load/unload transitions).
     */
    _onChangeIsDataLoaded(): void {
        this._onChange(WatchableRecordQueryResultKeysCore.isDataLoaded as WatchableKeys);
    }
}
