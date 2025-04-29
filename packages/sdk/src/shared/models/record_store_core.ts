import {
    isEnumValue,
    entries,
    has,
    ObjectValues,
    ObjectMap,
    FlowAnyFunction,
    FlowAnyObject,
} from '../../shared/private_utils';
import {invariant} from '../../shared/error_utils';
import {TableId, FieldId, RecordId} from '../../shared/types/hyper_ids';
import {ChangedPathsForType} from '../../shared/models/base_core';
import AbstractModel from '../../shared/models/abstract_model';
import {SdkMode} from '../../sdk_mode';

export const WatchableRecordStoreKeysCore = Object.freeze({
    records: 'records' as const,
    recordIds: 'recordIds' as const,
    cellValues: 'cellValues' as const,
});
export const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';

/**
 * The string case is to accommodate prefix keys
 *
 * @internal
 */
type WatchableRecordStoreKeyCore = ObjectValues<typeof WatchableRecordStoreKeysCore> | string;

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @internal
 */
abstract class RecordStoreCore<
    SdkModeT extends SdkMode,
    WatchableKeys extends string = WatchableRecordStoreKeyCore
> extends AbstractModel<
    SdkModeT,
    SdkModeT['TableDataT'],
    WatchableRecordStoreKeyCore | WatchableKeys
> {
    static _className = 'RecordStoreCore';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordStoreKeysCore, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    readonly tableId: TableId;
    _recordModelsById: ObjectMap<RecordId, SdkModeT['RecordT']> = {};

    constructor(sdk: SdkModeT['SdkT'], tableId: TableId) {
        super(sdk, `${tableId}-RecordStore`);
        this.tableId = tableId;
    }

    abstract _constructRecord(
        recordId: RecordId,
        parentTable: SdkModeT['TableT'],
    ): SdkModeT['RecordT'];

    get _dataOrNullIfDeleted(): SdkModeT['TableDataT'] | null {
        return this._baseData.tablesById[this.tableId] ?? null;
    }

    watch(
        keys: WatchableRecordStoreKeyCore | ReadonlyArray<WatchableRecordStoreKeyCore>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKeyCore> {
        const validKeys = super.watch(keys, callback, context);
        return validKeys;
    }

    unwatch(
        keys: WatchableRecordStoreKeyCore | ReadonlyArray<WatchableRecordStoreKeyCore>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKeyCore> {
        const validKeys = super.unwatch(keys, callback, context);
        return validKeys;
    }

    /**
     * The records in this table.
     */
    get records(): Array<SdkModeT['RecordT']> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        const records = this.recordIds.map(recordId => {
            const record = this.getRecordByIdIfExists(recordId);
            invariant(record, 'record');
            return record;
        });
        return records;
    }

    /**
     * The record IDs in this table.
     */
    abstract get recordIds(): Array<string>;

    getRecordByIdIfExists(recordId: string): SdkModeT['RecordT'] | null {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        invariant(typeof recordId === 'string', 'getRecordById expects a string');

        if (!recordsById[recordId]) {
            return null;
        } else {
            if (this._recordModelsById[recordId]) {
                return this._recordModelsById[recordId];
            }
            const newRecord = this._constructRecord(
                recordId,
                this._sdk.base.getTableById(this.tableId),
            );
            this._recordModelsById[recordId] = newRecord;
            return newRecord;
        }
    }

    triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<SdkModeT['TableDataT']>) {
        if (dirtyPaths.recordsById) {
            const dirtyFieldIdsSet: ObjectMap<FieldId, true> = {};
            const addedRecordIds: Array<RecordId> = [];
            const removedRecordIds: Array<RecordId> = [];
            for (const [recordId, dirtyRecordPaths] of entries(dirtyPaths.recordsById) as Array<
                [RecordId, ChangedPathsForType<SdkModeT['RecordDataT']>]
            >) {
                if (dirtyRecordPaths && dirtyRecordPaths._isDirty) {
                    invariant(this._data.recordsById, 'No recordsById');

                    if (has(this._data.recordsById, recordId)) {
                        addedRecordIds.push(recordId);
                    } else {
                        removedRecordIds.push(recordId);

                        const recordModel = this._recordModelsById[recordId];
                        if (recordModel) {
                            delete this._recordModelsById[recordId];
                        }
                    }
                } else {
                    const recordModel = this._recordModelsById[recordId];
                    if (recordModel) {
                        recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
                    }
                }

                const {cellValuesByFieldId} = dirtyRecordPaths;
                if (cellValuesByFieldId) {
                    for (const fieldId of Object.keys(cellValuesByFieldId)) {
                        dirtyFieldIdsSet[fieldId] = true;
                    }
                }
            }

            if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeysCore.records, {
                    addedRecordIds,
                    removedRecordIds,
                });

                this._onChange(WatchableRecordStoreKeysCore.recordIds, {
                    addedRecordIds,
                    removedRecordIds,
                });
            }

            const fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
            const recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));
            if (fieldIds.length > 0 && recordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeysCore.cellValues, {
                    recordIds,
                    fieldIds,
                });
            }
            for (const fieldId of fieldIds) {
                this._onChange(WatchableCellValuesInFieldKeyPrefix + fieldId, recordIds, fieldId);
            }
        }
    }
}

/** @internal */
export default RecordStoreCore;
