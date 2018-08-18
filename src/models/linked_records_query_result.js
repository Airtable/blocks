// @flow
const invariant = require('invariant');
const {h, u} = require('client_server_shared/hu');
const AbstractModelWithAsyncData = require('client/blocks/sdk/models/abstract_model_with_async_data');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const getSdk = require('client/blocks/sdk/get_sdk');
const ObjectPool = require('client/blocks/sdk/models/object_pool');
const QueryResult = require('client/blocks/sdk/models/query_result');
const utils = require('client/blocks/sdk/utils');

import type TableModel from 'client/blocks/sdk/models/table';
import type FieldModel from 'client/blocks/sdk/models/field';
import type RecordModel from 'client/blocks/sdk/models/record';
import type {
    PublicQueryResult,
    QueryResultOpts,
    NormalizedQueryResultOpts,
    WatchableQueryResultKey,
} from 'client/blocks/sdk/models/query_result';

const getLinkedTableId = (field: FieldModel): string => {
    const options = field.config.options;
    const linkedTableId = options && options.linkedTableId;
    invariant(linkedTableId, 'linkedTableId must exist');

    return linkedTableId;
};

// eslint-disable-next-line no-use-before-define
const pool: ObjectPool<LinkedRecordsQueryResult,
    {
        field: FieldModel,
        record: RecordModel,
        normalizedOpts: NormalizedQueryResultOpts,
    }> = new ObjectPool({
        getKeyFromObject: queryResult => queryResult._poolKey,
        getKeyFromObjectOptions: ({field, record}) => {
            return `${record.id}::${field.id}::${getLinkedTableId(field)}`;
        },
        canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
            return queryResult.isValid && queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
        },
    });

export type LinkedRecordsQueryResultOpts = QueryResultOpts;

/**
 * Represents a set of records from a LinkedRecord cell value.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.getLinkedRecordsFromCell`.
 */
class LinkedRecordsQueryResult extends AbstractModelWithAsyncData<void, WatchableQueryResultKey>
    implements PublicQueryResult {
    static _className = 'LinkedRecordsQueryResult';
    static _isWatchableKey(key: string): boolean {
        return QueryResult._isWatchableKey(key);
    }

    static __createOrReuseLinkedRecordsQueryResult(
        record: RecordModel,
        field: FieldModel,
        opts: QueryResultOpts,
    ): LinkedRecordsQueryResult {
        invariant(
            record.parentTable === field.parentTable,
            'record and field must belong to the same table',
        );
        invariant(
            field.config.type === ApiFieldTypes.MULTIPLE_RECORD_LINKS,
            'field must be MULTIPLE_RECORD_LINKS',
        );
        const linkedTableId = field.config.options && field.config.options.linkedTableId;
        invariant(linkedTableId, 'linkedTableId must be set');

        const linkedTable = getSdk().base.getTableById(linkedTableId);
        invariant(linkedTable, 'linkedTable must exist');

        const normalizedOpts = QueryResult._normalizeOpts(linkedTable, opts);
        const queryResult = pool.getObjectForReuse({record, field, normalizedOpts});
        if (queryResult) {
            return queryResult;
        } else {
            return new LinkedRecordsQueryResult(record, field, opts);
        }
    }

    // the record containing the linked-record cell this is a query of.
    _record: RecordModel;
    // the cell's field in the record
    _field: FieldModel;
    // the key used to identify this query result in ObjectPool
    _poolKey: string;
    // the table we're linking to
    _linkedTable: TableModel;
    // normalized options passed in when creating this instance
    _normalizedOpts: NormalizedQueryResultOpts;
    // a QueryResult containing all the rows in the linked table
    _linkedQueryResult: QueryResult;
    // is the query result currently valid. if the field config changes to link
    // to another table or not be a linked record field at all, isValid will
    // become false. once a LinkedRecordQueryResult has become invalid, it will
    // not become valid again.
    _isValid: boolean = true;
    // a lazily-generated set of the record ids in the result set - derived
    // from the origin cell value
    _recordIdsSet: {[string]: ?true} | null = null;
    // a lazily-generated array of the record ids in the query result. the sort
    // order comes from linkedQueryResult, and it's filtered by presence in
    // _recordIdsSet
    _filteredSortedRecordIds: Array<string> | null = null;
    // how many times has each 'cellValuesInField:$FieldId' been watched?
    _cellValueChangeHandlerByFieldId: {[string]: (QueryResult, string, mixed) => void} = {};

    constructor(record: RecordModel, field: FieldModel, opts: QueryResultOpts) {
        super(record.parentTable.__baseData, getSdk().models.generateGuid());
        invariant(
            record.parentTable === field.parentTable,
            'record and field must belong to the same table',
        );
        this._record = record;
        this._field = field;

        const linkedTableId = getLinkedTableId(field);
        this._poolKey = `${record.id}::${field.id}::${linkedTableId}`;

        const linkedTable = getSdk().base.getTableById(linkedTableId);
        invariant(linkedTable, 'table must exist');
        this._linkedTable = linkedTable;

        this._normalizedOpts = QueryResult._normalizeOpts(linkedTable, opts);

        // we could rely on QueryResult's reuse pool to make sure we get back
        // the same QueryResult every time, but that would make it much harder
        // to make sure we unwatch everything from the old QueryResult if e.g.
        // the field config changes to point at a different table
        this._linkedQueryResult = QueryResult.__createOrReuseQueryResult(linkedTable, opts);
    }

    __canBeReusedForNormalizedOpts(normalizedOpts: NormalizedQueryResultOpts): boolean {
        return u.isEqual(this._normalizedOpts, normalizedOpts);
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
     * The table that the records in the QueryResult are a part of
     */
    get parentTable(): TableModel {
        invariant(this.isValid, 'LinkedRecordQueryResult is no longer valid');
        return this._linkedTable;
    }

    /**
     * Ordered array of all the linked record ids.
     * Watchable.
     */
    get recordIds(): Array<string> {
        invariant(this.isValid, 'LinkedRecordQueryResult is no longer valid');
        invariant(this.isDataLoaded, 'LinkedRecordsQueryResult data is not loaded');

        // record ids are lazily generated
        this._generateDataIfNeeded();

        invariant(this._filteredSortedRecordIds, 'no recordIds');
        return this._filteredSortedRecordIds;
    }

    /**
     * Ordered array of all the linked records.
     * Watchable.
     */
    get records(): Array<RecordModel> {
        invariant(this.isValid, 'LinkedRecordQueryResult is no longer valid');

        const linkedTable = this._linkedTable;
        return this.recordIds.map(recordId => {
            const record = linkedTable.getRecordById(recordId);
            invariant(record, `No record for id: ${recordId}`);
            return record;
        });
    }

    /**
     * The fields that were used to create this LinkedRecordsQueryResult.
     */
    get fields(): Array<FieldModel> | null {
        invariant(this.isValid, 'LinkedRecordQueryResult is no longer valid');

        return this._linkedQueryResult.fields;
    }

    watch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
    ): Array<WatchableQueryResultKey> {
        invariant(this.isValid, 'cannot watch an invalid LinkedRecordQueryResult');

        const validKeys = super.watch(keys, callback);
        for (const key of validKeys) {
            utils.fireAndForgetPromise(this.loadDataAsync.bind(this));

            if (key === QueryResult.WatchableKeys.cellValues) {
                this._watchLinkedQueryCellValuesIfNeededAfterWatch();
            }

            if (key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    QueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                this._watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId);
            }
        }
        return validKeys;
    }

    unwatch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
    ): Array<WatchableQueryResultKey> {
        const validKeys = super.unwatch(keys, callback);

        for (const key of validKeys) {
            this.unloadData();

            if (key === QueryResult.WatchableKeys.cellValues) {
                this._unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch();
            }

            if (key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    QueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                this._unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId);
            }
        }

        return validKeys;
    }

    async loadDataAsync(): Promise<void> {
        await super.loadDataAsync();

        if (!this.isDataLoaded) {
            // data still might not be loaded after the promise resolves if the
            // linked table changed. in that case, call again:
            await this.loadDataAsync();
            // there has to be an unloadData call for every loadDataAsync call.
            // call it here to offset calling loadDataAsync a second time
            this.unloadData();
        }
    }

    async _loadDataAsync(): Promise<Array<WatchableQueryResultKey>> {
        pool.registerObjectForReuse(this);
        this._watchOrigin();
        this._watchLinkedQueryResult();

        await Promise.all([
            this._record.parentTable.loadCellValuesInFieldIdsAsync([this._field.id]),
            this._linkedQueryResult.loadDataAsync(),
        ]);

        this._recordIdsSet = null;
        this._filteredSortedRecordIds = null;

        return ['records', 'recordIds'];
    }

    _unloadData() {
        if (this.isValid) {
            pool.unregisterObjectForReuse(this);
            this._unwatchOrigin();
            this._unwatchLinkedQueryResult();

            this._record.parentTable.unloadCellValuesInFieldIds([this._field.id]);
            this._linkedQueryResult.unloadData();

            this._recordIdsSet = null;
            this._filteredSortedRecordIds = null;
        }
    }

    get _cellValuesWatchCount(): number {
        return (this._changeWatchersByKey[QueryResult.WatchableKeys.cellValues] || []).length;
    }

    _watchLinkedQueryCellValuesIfNeededAfterWatch() {
        if (this._cellValuesWatchCount === 1) {
            this._watchLinkedQueryCellValues();
        }
    }

    _unwatchLinkedQueryCellValuesIfPossibleAfterUnwatch() {
        invariant(this._cellValuesWatchCount > 0, 'overfree cellValues watch');
        if (this._cellValuesWatchCount === 0 && this.isValid) {
            this._unwatchLinkedQueryCellValues();
        }
    }

    get _cellValueWatchCountByFieldId(): $ReadOnly<{[string]: number}> {
        const countByFieldId = {};
        const watchKeys = Object.keys(this._changeWatchersByKey).filter(key => {
            return key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix);
        });
        for (const watchKey of watchKeys) {
            const fieldId = watchKey.slice(QueryResult.WatchableCellValuesInFieldKeyPrefix.length);
            countByFieldId[fieldId] = (this._changeWatchersByKey[watchKey] || []).length;
        }

        return countByFieldId;
    }

    _watchLinkedQueryCellValuesInFieldIfNeededAfterWatch(fieldId: string) {
        if (this._cellValueWatchCountByFieldId[fieldId] === 1 && this.isValid) {
            this._watchLinkedQueryCellValuesInField(fieldId);
        }
    }

    _unwatchLinkedQueryCellValuesInFieldIfPossibleAfterUnwatch(fieldId: string) {
        invariant(
            this._cellValueWatchCountByFieldId[fieldId] &&
                this._cellValueWatchCountByFieldId[fieldId] > 0,
            `cellValuesInField:${fieldId} over-free'd`,
        );

        if (this._cellValueWatchCountByFieldId[fieldId] === 0 && this.isValid) {
            this._unwatchLinkedQueryCellValuesInField(fieldId);
        }
    }

    _watchOrigin() {
        // if the cell values in the record change, we need to invalidate our
        // cached data and notify watchers
        this._record.watch(
            `cellValueInField:${this._field.id}`,
            this._onOriginCellValueChange,
            this,
        );
        // if the field config changes, we need to invalidate cached data,
        // and potentially start watching a different table
        this._field.watch('config', this._onOriginFieldConfigChange, this);
    }

    _unwatchOrigin() {
        this._record.unwatch(
            `cellValueInField:${this._field.id}`,
            this._onOriginCellValueChange,
            this,
        );
        this._field.unwatch('config', this._onOriginFieldConfigChange, this);
    }

    _watchLinkedQueryResult() {
        // in the linked table, all we care about is the set of recordIds.
        // this watch fire when they're added/removed and when they change
        // order. we only care about order, because add/remove is handled by
        // watching the origin record
        this._linkedQueryResult.watch('recordIds', this._onLinkedRecordIdsChange, this);
    }

    _unwatchLinkedQueryResult() {
        this._linkedQueryResult.unwatch('recordIds', this._onLinkedRecordIdsChange, this);
    }

    _watchLinkedQueryCellValues() {
        this._linkedQueryResult.watch('cellValues', this._onLinkedCellValuesChange, this);
    }

    _unwatchLinkedQueryCellValues() {
        this._linkedQueryResult.unwatch('cellValues', this._onLinkedCellValuesChange, this);
    }

    _watchLinkedQueryCellValuesInField(fieldId: string) {
        this._linkedQueryResult.watch(
            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
            this._getOnLinkedCellValuesInFieldChange(fieldId),
            this,
        );
    }

    _unwatchLinkedQueryCellValuesInField(fieldId: string) {
        this._linkedQueryResult.unwatch(
            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
            this._getOnLinkedCellValuesInFieldChange(fieldId),
            this,
        );
    }

    _onLinkedRecordIdsChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');
        if (!this.isDataLoaded) {
            return;
        }
        // if the set of records in the query result changes, we need to
        // invalidate just our filtered version of the set
        this._filteredSortedRecordIds = null;

        // we don't actually know at this stage whether anything changed or
        // not. it may have done though, so notify watchers
        this._onChange('records');
        this._onChange('recordIds');
    }

    // eslint-disable-next-line flowtype/no-weak-types
    _onLinkedCellValuesChange(queryResult: QueryResult, key: string, changes: any) {
        invariant(this.isValid, 'watch key change event whilst invalid');

        if (changes && changes.fieldIds && changes.recordIds) {
            if (!this._recordIdsSet) {
                this._generateRecordSet();
            }
            const recordIdsSet = this._recordIdsSet;
            invariant(recordIdsSet, 'recordIdsSet must exist');

            const recordIds = changes.recordIds.filter(id => recordIdsSet[id] === true);
            if (recordIds.length) {
                this._onChange('cellValues', {fieldIds: changes.fieldIds, recordIds});
            }
        } else {
            this._onChange('cellValues');
        }
    }

    _getOnLinkedCellValuesInFieldChange(fieldId: string): (QueryResult, string, mixed) => void {
        if (!this._cellValueChangeHandlerByFieldId[fieldId]) {
            this._cellValueChangeHandlerByFieldId[fieldId] = (
                queryResult: QueryResult,
                key: string,
                recordIds: mixed,
            ) => {
                invariant(this.isValid, 'watch key change event whilst invalid');

                if (Array.isArray(recordIds)) {
                    if (!this._recordIdsSet) {
                        this._generateRecordSet();
                    }

                    const recordIdsSet = this._recordIdsSet;
                    invariant(recordIdsSet, 'recordIdsSet must exist');

                    const filteredRecordIds = recordIds.filter(
                        id => typeof id === 'string' && recordIdsSet[id] === true,
                    );
                    if (filteredRecordIds.length) {
                        this._onChange(
                            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            filteredRecordIds,
                        );
                    }
                } else {
                    this._onChange(QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
                }
            };
        }

        return this._cellValueChangeHandlerByFieldId[fieldId];
    }

    _onOriginCellValueChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');

        if (!this.isDataLoaded) {
            return;
        }
        // when the origin cell value (listing all the linked records) changes,
        // invalidate all the data we have stored - we need to completely
        // regenerate it
        this._recordIdsSet = null;
        this._filteredSortedRecordIds = null;

        // notify watchers that our set of linked records has changed
        this._onChange('records');
        this._onChange('recordIds');
    }

    _onOriginFieldConfigChange() {
        invariant(this.isValid, 'watch key change event whilst invalid');

        const type = this._field.config.type;

        if (type !== ApiFieldTypes.MULTIPLE_RECORD_LINKS) {
            this._invalidate();
            return;
        }

        const linkedTableId = getLinkedTableId(this._field);
        if (linkedTableId !== this._linkedTable.id) {
            this._invalidate();
            return;
        }
    }

    _invalidate() {
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

    _generateDataIfNeeded() {
        if (!this._recordIdsSet) {
            // filterdSortedRecordIds depends on recordIdsSet, so if we
            // re-generate recordIdsSet, we need to regenerate
            // filteredSortedRecordIds
            this._generateRecordSet();
            this._generateFilteredSortedRecordIds();
        } else if (!this._filteredSortedRecordIds) {
            this._generateFilteredSortedRecordIds();
        }
    }

    _generateRecordSet() {
        const recordIdsSet = {};
        const cellValue = this._record.getCellValue(this._field);
        invariant(Array.isArray(cellValue), 'cellValue should be array');

        for (const linkedRecord of cellValue) {
            invariant(
                linkedRecord && typeof linkedRecord === 'object',
                'linked record should be object',
            );
            invariant(typeof linkedRecord.id === 'string', 'id should be present');
            recordIdsSet[linkedRecord.id] = true;
        }

        this._recordIdsSet = recordIdsSet;
    }

    _generateFilteredSortedRecordIds() {
        const recordIdsSet = this._recordIdsSet;
        invariant(recordIdsSet, 'recordIdsSet must exist');

        if (this._normalizedOpts.sorts && this._normalizedOpts.sorts.length) {
            // when sorts are present, record order comes from the query result
            this._filteredSortedRecordIds = this._linkedQueryResult.recordIds.filter(
                recordId => recordIdsSet[recordId] === true,
            );
        } else {
            // with no sorts, record order is the same as in the cell in the
            // main Airtable UI
            const cellValue = this._record.getCellValue(this._field);
            invariant(Array.isArray(cellValue), 'cellValue should be array');

            this._filteredSortedRecordIds = cellValue.map(record => {
                invariant(record && typeof record === 'object', 'linked record should be object');
                invariant(typeof record.id === 'string', 'id should be present');
                return record.id;
            });
        }
    }
}

module.exports = LinkedRecordsQueryResult;
