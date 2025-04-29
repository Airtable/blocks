import {RecordId} from '../../shared/types/hyper_ids';
import {InterfaceSdkMode} from '../../sdk_mode';
import RecordStoreCore, {
    WatchableCellValuesInFieldKeyPrefix,
    WatchableRecordStoreKeysCore,
} from '../../shared/models/record_store_core';
import {TableData} from '../types/table';
import {ChangedPathsForType} from '../../shared/models/base_core';
import {isEnumValue, ObjectValues} from '../../shared/private_utils';
import {Table} from './table';
import {Record} from './record';

const WatchableRecordStoreKeys = Object.freeze({
    ...WatchableRecordStoreKeysCore,
    recordOrder: 'recordOrder' as const,
});

/**
 * The string case is to accommodate prefix keys
 *
 * @internal
 */
type WatchableRecordStoreKey = ObjectValues<typeof WatchableRecordStoreKeys> | string;

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @internal
 */
export class RecordStore extends RecordStoreCore<InterfaceSdkMode, WatchableRecordStoreKey> {
    static _className = 'RecordStore';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordStoreKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    _constructRecord(recordId: RecordId, parentTable: Table): Record {
        return new Record(this._sdk, this, parentTable, recordId);
    }

    /**
     * The record Ids in this table.
     */
    get recordIds(): Array<RecordId> {
        return this._data.recordOrder;
    }

    triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<TableData>) {
        super.triggerOnChangeForDirtyPaths(dirtyPaths);
        if (dirtyPaths.recordOrder) {
            this._onChange(WatchableRecordStoreKeys.recordOrder);
        }
    }
}
