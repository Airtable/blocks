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

export const WatchableRecordStoreKeys = Object.freeze({
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
export type WatchableRecordStoreKey = ObjectValues<typeof WatchableRecordStoreKeys> | string;

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @internal
 */
abstract class RecordStoreCore<SdkModeT extends SdkMode> extends AbstractModel<
    SdkModeT,
    SdkModeT['TableDataT'],
    WatchableRecordStoreKey
> {
    static _className = 'RecordStore';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordStoreKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }

    readonly tableId: TableId;
    /** @internal */
    _recordModelsById: ObjectMap<RecordId, SdkModeT['RecordT']> = {};

    /** @internal */
    constructor(sdk: SdkModeT['SdkT'], tableId: TableId) {
        super(sdk, `${tableId}-RecordStore`);

        // this._airtableInterface = sdk.__airtableInterface;
        this.tableId = tableId;
        // // A bit of a hack, but we use the primary field ID to load record
        // // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
        // // ID here instead of calling this.primaryField.id since that would crash
        // // when the table is getting unloaded after being deleted.
        // this._primaryFieldId = this._data.primaryFieldId;
    }

    /** @internal */
    abstract _constructRecord(
        recordId: RecordId,
        parentTable: SdkModeT['TableT'],
    ): SdkModeT['RecordT'];

    /** @internal */
    get _dataOrNullIfDeleted(): SdkModeT['TableDataT'] | null {
        return this._baseData.tablesById[this.tableId] ?? null;
    }

    /** @internal */
    watch(
        keys: WatchableRecordStoreKey | ReadonlyArray<WatchableRecordStoreKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKey> {
        const validKeys = super.watch(keys, callback, context);
        return validKeys;
    }

    /** @internal */
    unwatch(
        keys: WatchableRecordStoreKey | ReadonlyArray<WatchableRecordStoreKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordStoreKey> {
        const validKeys = super.unwatch(keys, callback, context);
        return validKeys;
    }

    /**
     * The records in this table.
     * @internal
     */
    get records(): Array<SdkModeT['RecordT']> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        const records = Object.keys(recordsById).map(recordId => {
            const record = this.getRecordByIdIfExists(recordId);
            invariant(record, 'record');
            return record;
        });
        return records;
    }

    /**
     * The record IDs in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     * @internal
     */
    get recordIds(): Array<string> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        return Object.keys(recordsById);
    }

    /** @internal */
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

    /** @internal */
    triggerOnChangeForDirtyPaths(dirtyPaths: ChangedPathsForType<SdkModeT['TableDataT']>) {
        if (dirtyPaths.recordsById) {
            // Since tables don't have a record order, need to detect if a record
            // was created or deleted and trigger onChange for records.
            const dirtyFieldIdsSet: ObjectMap<FieldId, true> = {};
            const addedRecordIds: Array<RecordId> = [];
            const removedRecordIds: Array<RecordId> = [];
            for (const [recordId, dirtyRecordPaths] of entries(dirtyPaths.recordsById) as Array<
                [RecordId, ChangedPathsForType<SdkModeT['RecordDataT']>]
            >) {
                if (dirtyRecordPaths && dirtyRecordPaths._isDirty) {
                    // If the entire record is dirty, it was either created or deleted.
                    invariant(this._data.recordsById, 'No recordsById');

                    if (has(this._data.recordsById, recordId)) {
                        addedRecordIds.push(recordId);
                    } else {
                        removedRecordIds.push(recordId);

                        const recordModel = this._recordModelsById[recordId];
                        if (recordModel) {
                            // Remove the Record model if it was deleted.
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

            // Now that we've composed our created/deleted record ids arrays, let's fire
            // the records onChange event if any records were created or deleted.
            if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeys.records, {
                    addedRecordIds,
                    removedRecordIds,
                });

                this._onChange(WatchableRecordStoreKeys.recordIds, {
                    addedRecordIds,
                    removedRecordIds,
                });
            }

            // NOTE: this is an experimental (and somewhat messy) way to watch
            // for changes to cells in a table, as an alternative to implementing
            // full event bubbling. For now, it unblocks the things we want to
            // build, but we may replace it.
            // If we keep it, could be more efficient by not calling _onChange
            // if there are no subscribers.
            // TODO: don't trigger changes for fields that aren't supposed to be loaded
            // (in some cases, e.g. record created, liveapp will send cell values
            // that we're not subscribed to).
            const fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
            const recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));
            if (fieldIds.length > 0 && recordIds.length > 0) {
                this._onChange(WatchableRecordStoreKeys.cellValues, {
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
