/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import {FieldTypes, FieldId} from '../types/field';
import getSdk from '../get_sdk';
import {fireAndForgetPromise, FlowAnyFunction, FlowAnyObject, ObjectMap} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import {RecordId} from '../types/record';
import ObjectPool from './object_pool';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    RecordQueryResultOpts,
    NormalizedRecordQueryResultOpts,
} from './record_query_result';
import TableOrViewQueryResult from './table_or_view_query_result';

import Table from './table';
import Field from './field';
import Record from './record';
import RecordStore from './record_store';

const getLinkedTableId = (field: Field): string => {
    const options = field.options;
    const linkedTableId = options && options.linkedTableId;
    if (!(typeof linkedTableId === 'string')) {
        throw spawnInvariantViolationError('linkedTableId must exist');
    }

    return linkedTableId;
};

const pool: ObjectPool<
    LinkedRecordsQueryResult,
    {
        field: Field;
        record: Record;
        normalizedOpts: NormalizedRecordQueryResultOpts;
    }
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult._poolKey,
    getKeyFromObjectOptions: ({field, record}) => {
        return `${record.id}::${field.id}::${getLinkedTableId(field)}`;
    },
    canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
        return queryResult.isValid && queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
    },
});

/**
 * Represents a set of records from a LinkedRecord cell value. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.getLinkedRecordsFromCell`.
 *
 * @docsPath models/Query results/LinkedRecordsQueryResult
 */
class LinkedRecordsQueryResult extends RecordQueryResult {
    /** @internal */
    static _className = 'LinkedRecordsQueryResult';

    /** @internal */
    static __createOrReuseQueryResult(
        record: Record,
        field: Field,
        opts: RecordQueryResultOpts,
    ): LinkedRecordsQueryResult {
        if (!(record.parentTable === field.parentTable)) {
            throw spawnInvariantViolationError('record and field must belong to the same table');
        }
        if (!(field.type === FieldTypes.MULTIPLE_RECORD_LINKS)) {
            throw spawnInvariantViolationError('field must be MULTIPLE_RECORD_LINKS');
        }
        const linkedTableId = field.options && field.options.linkedTableId;
        if (!(typeof linkedTableId === 'string')) {
            throw spawnInvariantViolationError('linkedTableId must be set');
        }

        const linkedTable = getSdk().base.getTableById(linkedTableId);
        const linkedRecordStore = getSdk().base.__getRecordStore(linkedTableId);

        const normalizedOpts = TableOrViewQueryResult._normalizeOpts(
            linkedTable,
            linkedRecordStore,
            opts,
        );
        const queryResult = pool.getObjectForReuse({record, field, normalizedOpts});
        if (queryResult) {
            return queryResult;
        } else {
            return new LinkedRecordsQueryResult(record, field, normalizedOpts);
        }
    }

    /** @internal */
    _record: Record;
    /** @internal */
    _field: Field;
    /** @internal */
    _poolKey: string;
    /** @internal */
    _linkedTable: Table;
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

    /** @hidden */
    constructor(record: Record, field: Field, normalizedOpts: NormalizedRecordQueryResultOpts) {
        super(normalizedOpts, record.parentTable.__baseData);

        if (!(record.parentTable === field.parentTable)) {
            throw spawnInvariantViolationError('record and field must belong to the same table');
        }
        this._record = record;
        this._field = field;
        this._linkedTable = normalizedOpts.table;
        this._linkedRecordStore = normalizedOpts.recordStore;
        this._poolKey = `${record.id}::${field.id}::${this._linkedTable.id}`;

        this._linkedQueryResult = TableOrViewQueryResult.__createOrReuseQueryResultWithNormalizedOpts(
            this._linkedTable,
            normalizedOpts,
        );

        pool.registerObjectForReuseWeak(this);
    }

    /**
     * Is the query result currently valid? This value always starts as 'true',
     * but can become false if the field config changes to link to a different
     * table or a type other than MULTIPLE_RECORD_LINKS. Once `isValid` has
     * become false, it will never become true again. Many fields will throw on
     * attempting to access them, and watches will no longer fire.
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
        if (!this.isValid) {
            throw spawnInvariantViolationError('LinkedRecordQueryResult is no longer valid');
        }
        return this._linkedTable;
    }

    /**
     * Ordered array of all the linked record ids. Watchable.
     */
    get recordIds(): Array<string> {
        if (!this.isValid) {
            throw spawnInvariantViolationError('LinkedRecordQueryResult is no longer valid');
        }
        if (!this.isDataLoaded) {
            throw spawnInvariantViolationError('LinkedRecordsQueryResult data is not loaded');
        }

        this._generateComputedDataIfNeeded();

        if (!this._computedFilteredSortedRecordIds) {
            throw spawnInvariantViolationError('no recordIds');
        }
        return this._computedFilteredSortedRecordIds;
    }

    /**
     * Ordered array of all the linked records. Watchable.
     */
    get records(): Array<Record> {
        if (!this.isValid) {
            throw spawnInvariantViolationError('LinkedRecordQueryResult is no longer valid');
        }

        return this.recordIds.map(recordId => {
            const record = this._linkedRecordStore.getRecordByIdIfExists(recordId);
            if (!record) {
                throw spawnInvariantViolationError('No record for id: %s', recordId);
            }
            return record;
        });
    }

    /**
     * The fields that were used to create this LinkedRecordsQueryResult.
     */
    get fields(): Array<Field> | null {
        if (!this.isValid) {
            throw spawnInvariantViolationError('LinkedRecordQueryResult is no longer valid');
        }

        return this._linkedQueryResult.fields;
    }

    /** @inheritdoc */
    watch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        if (!this.isValid) {
            throw spawnInvariantViolationError('cannot watch an invalid LinkedRecordQueryResult');
        }

        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            fireAndForgetPromise(this.loadDataAsync.bind(this));

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
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            this.unloadData();

            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                this._unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch();
            }

            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                this._unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId);
            }
        }

        return validKeys;
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
        pool.registerObjectForReuseStrong(this);
        this._watchOrigin();
        this._watchLinkedQueryResult();

        await Promise.all([
            getSdk()
                .base.__getRecordStore(this._record.parentTable.id)
                .loadCellValuesInFieldIdsAsync([this._field.id]),
            this._linkedQueryResult.loadDataAsync(),
            this._loadRecordColorsAsync(),
        ]);

        this._invalidateComputedData();

        return ['records', 'recordIds'];
    }

    /** @internal */
    _unloadData() {
        if (this.isValid) {
            pool.unregisterObjectForReuseStrong(this);
            this._unwatchOrigin();
            this._unwatchLinkedQueryResult();

            getSdk()
                .base.__getRecordStore(this._record.parentTable.id)
                .unloadCellValuesInFieldIds([this._field.id]);
            this._linkedQueryResult.unloadData();
            this._unloadRecordColors();

            this._invalidateComputedData();
        }
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
    _unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch() {
        if (this._cellValuesWatchCount === 0 && this.isValid) {
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
            countByFieldId[fieldId] = (this._changeWatchersByKey[watchKey] || []).length;
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
    _unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId: string) {
        if (
            !(
                this._cellValueWatchCountByFieldId[fieldId] &&
                this._cellValueWatchCountByFieldId[fieldId] > 0
            )
        ) {
            throw spawnInvariantViolationError("cellValuesInField:%s over-free'd", fieldId);
        }

        if (this._cellValueWatchCountByFieldId[fieldId] === 0 && this.isValid) {
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
        if (!this.isValid) {
            throw spawnInvariantViolationError('watch key change event whilst invalid');
        }
        if (!this.isDataLoaded) {
            return;
        }

        this._invalidateComputedData();

        this._onChange('records');
        this._onChange('recordIds');
    }

    /** @internal */
    _onLinkedCellValuesChange(
        queryResult: TableOrViewQueryResult,
        key: string,
        changes?: {fieldIds?: Array<FieldId>; recordIds?: Array<RecordId>},
    ) {
        if (!this.isValid) {
            throw spawnInvariantViolationError('watch key change event whilst invalid');
        }

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
                if (!this.isValid) {
                    throw spawnInvariantViolationError('watch key change event whilst invalid');
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
        if (!this.isValid) {
            throw spawnInvariantViolationError('watch key change event whilst invalid');
        }

        if (!this.isDataLoaded) {
            return;
        }
        this._invalidateComputedData();

        this._onChange('records');
        this._onChange('recordIds');
    }

    /** @internal */
    _onOriginFieldConfigChange() {
        if (!this.isValid) {
            throw spawnInvariantViolationError('watch key change event whilst invalid');
        }

        const type = this._field.type;

        if (type !== FieldTypes.MULTIPLE_RECORD_LINKS) {
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
            if (this._cellValueWatchCountByFieldId[fieldId] > 0) {
                this._unwatchLinkedQueryCellValuesInField(fieldId);
            }
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
        if (!Array.isArray(cellValue)) {
            throw spawnInvariantViolationError('cellValue should be array');
        }

        for (const linkedRecord of cellValue) {
            if (!(linkedRecord && typeof linkedRecord === 'object')) {
                throw spawnInvariantViolationError('linked record should be object');
            }
            const recordId = linkedRecord.id;
            if (!(typeof recordId === 'string')) {
                throw spawnInvariantViolationError('id should be present');
            }

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
        if (!recordIdsSet) {
            throw spawnInvariantViolationError('recordIdsSet must exist');
        }
        return recordIdsSet;
    }
}

export default LinkedRecordsQueryResult;
