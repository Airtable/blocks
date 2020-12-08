/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import {FieldType, FieldId} from '../types/field';
import Sdk from '../sdk';
import {FlowAnyFunction, FlowAnyObject, ObjectMap} from '../private_utils';
import {invariant} from '../error_utils';
import {RecordId} from '../types/record';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    NormalizedRecordQueryResultOpts,
} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';

import Table from './table';
import Field from './field';
import Record from './record';
import RecordStore from './record_store';

export const getLinkedTableId = (field: Field): string => {
    const options = field.options;
    const linkedTableId = options && options.linkedTableId;
    invariant(typeof linkedTableId === 'string', 'linkedTableId must exist');

    return linkedTableId;
};

/** internal */
interface LinkedRecordsQueryResultData {}

/**
 * Represents a set of records from a LinkedRecord cell value. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.selectLinkedRecordsFromCell`.
 *
 * @docsPath models/query results/LinkedRecordsQueryResult
 */
class LinkedRecordsQueryResult extends RecordQueryResult<LinkedRecordsQueryResultData> {
    /** @internal */
    static _className = 'LinkedRecordsQueryResult';

    /** @internal */
    _record: Record;
    /** @internal */
    _field: Field;
    /** @internal */
    _linkedTable: Table;
    /** @internal */
    _originRecordStore: RecordStore;
    /** @internal */
    _linkedRecordStore: RecordStore;
    /** @internal */
    _linkedQueryResult: TableOrViewQueryResult;
    /** @internal */
    _isValid: boolean = true;
    /** @internal */
    _computedRecordIdsSet: {[key: string]: true | void} | null = null;
    /** @internal */
    _computedFilteredSortedRecordIds: Array<string> | null = null;
    /** @internal */
    _cellValueChangeHandlerByFieldId: {
        [key: string]: (arg1: TableOrViewQueryResult, arg2: string, arg3: unknown) => void;
    } = {};

    /** @internal */
    constructor(
        record: Record,
        field: Field,
        normalizedOpts: NormalizedRecordQueryResultOpts,
        sdk: Sdk,
    ) {
        super(sdk, normalizedOpts);

        invariant(
            record.parentTable === field.parentTable,
            'record and field must belong to the same table',
        );

        this._record = record;
        this._field = field;
        this._linkedTable = normalizedOpts.table;
        this._originRecordStore = this._sdk.base.__getRecordStore(this._record.parentTable.id);
        this._linkedRecordStore = normalizedOpts.recordStore;

        this._linkedQueryResult = this._linkedTable.__tableOrViewQueryResultPool.getObjectForReuse(
            this._sdk,
            this._linkedTable,
            normalizedOpts,
        );
    }

    /**
     * Is the query result currently valid? This value always starts as 'true',
     * but can become false if the record from which this result was created is
     * deleted, if the field is deleted, if the field config changes to link to
     * a different table, or if the field config changes to link to a type
     * other than MULTIPLE_RECORD_LINKS. Once `isValid` has become false, it
     * will never become true again. Many fields will throw on attempting to
     * access them, and watches will no longer fire.
     */
    get isValid(): boolean {
        return this._isValid;
    }

    /**
     * The table that records in this RecordQueryResult are part of
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     */
    get parentTable(): Table {
        invariant(this.isValid, 'LinkedRecordsQueryResult is no longer valid');
        return this._linkedTable;
    }

    /**
     * Ordered array of all the linked record ids. Watchable.
     */
    get recordIds(): Array<string> {
        invariant(this.isValid, 'LinkedRecordsQueryResult is no longer valid');
        invariant(this.isDataLoaded, 'LinkedRecordsQueryResult data is not loaded');

        this._generateComputedDataIfNeeded();

        invariant(this._computedFilteredSortedRecordIds, 'no recordIds');
        return this._computedFilteredSortedRecordIds;
    }

    /**
     * Ordered array of all the linked records. Watchable.
     */
    get records(): Array<Record> {
        invariant(this.isValid, 'LinkedRecordsQueryResult is no longer valid');

        return this.recordIds.map(recordId => {
            const record = this._linkedRecordStore.getRecordByIdIfExists(recordId);
            invariant(record, 'No record for id: %s', recordId);
            return record;
        });
    }

    /**
     * The fields that were used to create this LinkedRecordsQueryResult.
     */
    get fields(): Array<Field> | null {
        invariant(this.isValid, 'LinkedRecordsQueryResult is no longer valid');

        return this._linkedQueryResult.fields;
    }

    /** @inheritdoc */
    watch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        invariant(this.isValid, 'cannot watch an invalid LinkedRecordsQueryResult');

        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                this._watchLinkedQueryCellValuesIfNeededAfterWatch();
            }

            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                this._watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId);
            }
        }
        return validKeys;
    }

    /** @inheritdoc */
    unwatch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const arrayKeys = (Array.isArray(keys) ? keys : [keys]) as ReadonlyArray<
            WatchableRecordQueryResultKey
        >;

        for (const key of arrayKeys) {
            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                this._unwatchLinkedQueryCellValuesIfPossibleBeforeUnwatch();
            }

            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                this._unwatchLinkedQueryCellValuesInFieldIfPossibleBeforeUnwatch(fieldId);
            }
        }

        return super.unwatch(arrayKeys, callback, context);
    }

    /** @inheritdoc */
    async loadDataAsync(): Promise<void> {
        await super.loadDataAsync();

        if (!this.isDataLoaded) {
            await this.loadDataAsync();
            this.unloadData();
        }
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        this._record.__linkedRecordsQueryResultPool.registerObjectForReuseStrong(this);
        this._watchOrigin();
        this._watchLinkedQueryResult();
        const initiallyLoaded = this._linkedQueryResult.isDataLoaded;

        await Promise.all([
            this._sdk.base
                .__getRecordStore(this._record.parentTable.id)
                .loadCellValuesInFieldIdsAsync([this._field.id]),
            this._linkedQueryResult.loadDataAsync(),
            this._loadRecordColorsAsync(),
        ]);

        this._invalidateComputedData();

        const changedKeys = ['records', 'recordIds', 'recordColors'];

        if (initiallyLoaded) {
            changedKeys.push('cellValues');
        }

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this.parentTable.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }

    /** @internal */
    _unloadData() {
        if (this.isValid) {
            this._record.__linkedRecordsQueryResultPool.unregisterObjectForReuseStrong(this);
            this._unwatchOrigin();
            this._unwatchLinkedQueryResult();

            this._sdk.base
                .__getRecordStore(this._record.parentTable.id)
                .unloadCellValuesInFieldIds([this._field.id]);
            this._linkedQueryResult.unloadData();
            this._unloadRecordColors();

            this._invalidateComputedData();
        }
    }

    /**
     * the key used to identify this query result in ObjectPool
     *
     * @hidden
     */
    get __poolKey() {
        return `${this._serializedOpts}::${this._field.id}::${this._linkedTable.id}::${this.isValid}`;
    }

    /** @internal */
    get _cellValuesWatchCount(): number {
        return (this._changeWatchersByKey[RecordQueryResult.WatchableKeys.cellValues] || []).length;
    }

    /** @internal */
    _watchLinkedQueryCellValuesIfNeededAfterWatch() {
        if (this._cellValuesWatchCount === 1) {
            this._watchLinkedQueryCellValues();
        }
    }

    /** @internal */
    _unwatchLinkedQueryCellValuesIfPossibleBeforeUnwatch() {
        if (this._cellValuesWatchCount === 1 && this.isValid) {
            this._unwatchLinkedQueryCellValues();
        }
    }

    /** @internal */
    get _cellValueWatchCountByFieldId(): Readonly<{[key: string]: number}> {
        const countByFieldId: ObjectMap<FieldId, number> = {};
        const watchKeys = Object.keys(this._changeWatchersByKey).filter(key => {
            return key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix);
        });
        for (const watchKey of watchKeys) {
            const fieldId = watchKey.slice(
                RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
            );
            countByFieldId[fieldId] = this._changeWatchersByKey[watchKey].length;
        }

        return countByFieldId;
    }

    /** @internal */
    _watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId: string) {
        if (this._cellValueWatchCountByFieldId[fieldId] === 1 && this.isValid) {
            this._watchLinkedQueryCellValuesInField(fieldId);
        }
    }

    /** @internal */
    _unwatchLinkedQueryCellValuesInFieldIfPossibleBeforeUnwatch(fieldId: string) {
        invariant(
            this._cellValueWatchCountByFieldId[fieldId],
            "cellValuesInField:%s over-free'd",
            fieldId,
        );

        if (this._cellValueWatchCountByFieldId[fieldId] === 1 && this.isValid) {
            this._unwatchLinkedQueryCellValuesInField(fieldId);
        }
    }

    /** @internal */
    _watchOrigin() {
        this._record.watch(
            `cellValueInField:${this._field.id}`,
            this._onOriginCellValueChange,
            this,
        );
        this._field.watch('type', this._onOriginFieldConfigChange, this);
        this._field.watch('options', this._onOriginFieldConfigChange, this);
        this._originRecordStore.watch('recordIds', this._onOriginRecordsChange, this);
        this._record.parentTable.watch('fields', this._onOriginFieldsChange, this);
    }

    /** @internal */
    _unwatchOrigin() {
        this._record.unwatch(
            `cellValueInField:${this._field.id}`,
            this._onOriginCellValueChange,
            this,
        );
        this._field.unwatch('type', this._onOriginFieldConfigChange, this);
        this._field.unwatch('options', this._onOriginFieldConfigChange, this);
        this._originRecordStore.unwatch('recordIds', this._onOriginRecordsChange, this);
        this._record.parentTable.unwatch('fields', this._onOriginFieldsChange, this);
    }

    /** @internal */
    _watchLinkedQueryResult() {
        this._linkedQueryResult.watch('recordIds', this._onLinkedRecordIdsChange, this);
    }

    /** @internal */
    _unwatchLinkedQueryResult() {
        this._linkedQueryResult.unwatch('recordIds', this._onLinkedRecordIdsChange, this);
    }

    /** @internal */
    _watchLinkedQueryCellValues() {
        this._linkedQueryResult.watch('cellValues', this._onLinkedCellValuesChange, this);
    }

    /** @internal */
    _unwatchLinkedQueryCellValues() {
        this._linkedQueryResult.unwatch('cellValues', this._onLinkedCellValuesChange, this);
    }

    /** @internal */
    _watchLinkedQueryCellValuesInField(fieldId: string) {
        this._linkedQueryResult.watch(
            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
            this._getOnLinkedCellValuesInFieldChange(fieldId),
            this,
        );
    }

    /** @internal */
    _unwatchLinkedQueryCellValuesInField(fieldId: string) {
        this._linkedQueryResult.unwatch(
            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
            this._getOnLinkedCellValuesInFieldChange(fieldId),
            this,
        );
    }

    /** @internal */
    _onLinkedRecordIdsChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');
        if (!this.isDataLoaded) {
            return;
        }

        this._invalidateComputedData();

        this._onChange('records');
        this._onChange('recordIds');
    }

    /**
     * This model doesn't use the `_data` computed property it inherits from
     * AbstractModel. It implements the following method only so that internal
     * checks for model deletion behave appropriately (the data itself is
     * inconsequential).
     *
     * @internal
     */
    get _dataOrNullIfDeleted(): LinkedRecordsQueryResultData | null {
        if (this._record.isDeleted || this._linkedRecordStore.isDeleted) {
            return null;
        }

        return {};
    }

    /** @internal */
    _onLinkedCellValuesChange(
        queryResult: TableOrViewQueryResult,
        key: string,
        changes?: {fieldIds?: Array<FieldId>; recordIds?: Array<RecordId>},
    ) {
        invariant(this.isValid, 'watch key change event whilst invalid');

        if (changes && changes.fieldIds && changes.recordIds) {
            const recordIdsSet = this._getOrGenerateRecordIdsSet();
            const recordIds = changes.recordIds.filter(id => recordIdsSet[id] === true);
            if (recordIds.length) {
                this._onChange('cellValues', {fieldIds: changes.fieldIds, recordIds});
            }
        } else {
            this._onChange('cellValues');
        }
    }

    /** @internal */
    _getOnLinkedCellValuesInFieldChange(
        fieldId: string,
    ): (arg1: TableOrViewQueryResult, arg2: string, arg3: unknown) => void {
        if (!this._cellValueChangeHandlerByFieldId[fieldId]) {
            this._cellValueChangeHandlerByFieldId[fieldId] = (
                queryResult: TableOrViewQueryResult,
                key: string,
                recordIds: unknown,
            ) => {
                invariant(this.isValid, 'watch key change event whilst invalid');

                if (!this.isDataLoaded) {
                    return;
                }

                if (Array.isArray(recordIds)) {
                    const recordIdsSet = this._getOrGenerateRecordIdsSet();
                    const filteredRecordIds = recordIds.filter(
                        id => typeof id === 'string' && recordIdsSet[id] === true,
                    );
                    if (filteredRecordIds.length) {
                        this._onChange(
                            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            filteredRecordIds,
                        );
                    }
                } else {
                    this._onChange(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
                }
            };
        }

        return this._cellValueChangeHandlerByFieldId[fieldId];
    }

    /** @internal */
    _onOriginCellValueChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');

        if (!this.isDataLoaded) {
            return;
        }
        this._invalidateComputedData();

        this._onChange('records');
        this._onChange('recordIds');
    }

    /** @internal */
    _onOriginRecordsChange() {
        if (this._record.isDeleted) {
            this._isValid = false;
        }
    }

    /** @internal */
    _onOriginFieldsChange() {
        if (this._field.isDeleted) {
            this._isValid = false;
        }
    }

    /** @internal */
    _onOriginFieldConfigChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');

        const type = this._field.type;

        if (type !== FieldType.MULTIPLE_RECORD_LINKS) {
            this._invalidateQueryResult();
            return;
        }

        const linkedTableId = getLinkedTableId(this._field);
        if (linkedTableId !== this._linkedTable.id) {
            this._invalidateQueryResult();
            return;
        }
    }

    /** @internal */
    _invalidateQueryResult() {
        if (this.isDataLoaded) {
            this._unloadData();
        }
        if (this._cellValuesWatchCount > 0) {
            this._unwatchLinkedQueryCellValues();
        }
        for (const fieldId of Object.keys(this._cellValueWatchCountByFieldId)) {
            this._unwatchLinkedQueryCellValuesInField(fieldId);
        }

        this._isValid = false;
        this._onChange('records');
        this._onChange('recordIds');
    }

    /** @internal */
    _invalidateComputedData() {
        this._computedRecordIdsSet = null;
        this._computedFilteredSortedRecordIds = null;
    }

    /** @internal */
    _generateComputedDataIfNeeded() {
        if (!this._computedRecordIdsSet) {
            this._generateComputedData();
        }
    }

    /** @internal */
    _generateComputedData() {
        const recordIdsSet: ObjectMap<RecordId, true> = {};
        const rawCellValue = this._record.getCellValue(this._field);
        const cellValue = rawCellValue === null ? [] : rawCellValue;
        invariant(Array.isArray(cellValue), 'cellValue should be array');

        for (const linkedRecord of cellValue) {
            invariant(
                linkedRecord && typeof linkedRecord === 'object',
                'linked record should be object',
            );

            const recordId = linkedRecord.id;
            invariant(typeof recordId === 'string', 'id should be present');

            if (this._linkedQueryResult.hasRecord(recordId)) {
                recordIdsSet[recordId] = true;
            }
        }

        this._computedRecordIdsSet = recordIdsSet;

        if (this._normalizedOpts.sorts && this._normalizedOpts.sorts.length) {
            this._computedFilteredSortedRecordIds = this._linkedQueryResult.recordIds.filter(
                recordId => recordIdsSet[recordId] === true,
            );
        } else {
            this._computedFilteredSortedRecordIds = Object.keys(recordIdsSet);
        }
    }

    /** @internal */
    _getOrGenerateRecordIdsSet() {
        this._generateComputedDataIfNeeded();
        const recordIdsSet = this._computedRecordIdsSet;
        invariant(recordIdsSet, 'recordIdsSet must exist');
        return recordIdsSet;
    }
}

export default LinkedRecordsQueryResult;
