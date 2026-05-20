import {type InterfaceSdkMode} from '../../sdk_mode';
import {spawnError} from '../../shared/error_utils';
import {ObjectPool} from '../../shared/models/object_pool';
import {
    RecordCore,
    WatchableCellValueInFieldKeyPrefix,
    WatchableRecordKeysCore,
} from '../../shared/models/record_core';
import {isEnumValue, type ObjectValues} from '../../shared/private_utils';
import {FieldType} from '../../shared/types/field_core';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type Field} from './field';
import {
    LinkedRecordsQueryResult,
    type LinkedRecordsQueryResultOpts,
} from './linked_records_query_result';

const WatchableRecordKeys = Object.freeze({
    ...WatchableRecordKeysCore,
});
/**
 * Any key within record that can be watched:
 * - `'name'`
 * - `'cellValues'`
 * - `'cellValueInField:' + someFieldId`
 */
type WatchableRecordKey = ObjectValues<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. You can get instances of this class by calling {@link useRecords}.
 *
 * @docsPath models/Record
 */
export class Record extends RecordCore<InterfaceSdkMode, WatchableRecordKey> {
    /** @internal */
    static _className = 'Record';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordKeys, key) ||
            key.startsWith(WatchableCellValueInFieldKeyPrefix)
        );
    }

    /**
     * Lazy-initialized backing store for `__linkedRecordsQueryResultPool`.
     * Most records never have their links queried; allocating a pool for
     * every record in the table up front would be wasteful.
     *
     * @internal
     */
    _linkedRecordsQueryResultPool: ObjectPool<
        LinkedRecordsQueryResult,
        typeof LinkedRecordsQueryResult
    > | null = null;

    /**
     * Pool of `LinkedRecordsQueryResult` instances keyed by `__poolKey`. Used
     * by `LinkedRecordsQueryResult._loadDataAsync` / `_unloadData` for strong
     * registration, and by `Record.selectLinkedRecordsFromCell` to dedupe
     * identical queries. Cell edits update the existing subscription under
     * the same pool key; only changing `(record id, field id, requested
     * fields)` yields a new pool entry.
     *
     * @internal
     */
    get __linkedRecordsQueryResultPool(): ObjectPool<
        LinkedRecordsQueryResult,
        typeof LinkedRecordsQueryResult
    > {
        if (this._linkedRecordsQueryResultPool === null) {
            this._linkedRecordsQueryResultPool = new ObjectPool(LinkedRecordsQueryResult);
        }
        return this._linkedRecordsQueryResultPool;
    }

    /**
     * Fetch foreign records for a field. Subsequent calls to this method will
     * override previous calls that are still pending. The previous call(s)
     * will immediately resolve with an empty `records` array.
     *
     * @param fieldId - The ID of the field to fetch foreign records for.
     * @param filterString - The filter string to use to filter the records.
     * @returns A promise that resolves to the foreign records.
     */
    fetchForeignRecordsAsync(
        field: Field,
        filterString: string,
    ): Promise<{
        records: ReadonlyArray<{id: RecordId; name: string}>;
    }> {
        const parentTable = this.parentTable;
        if (field.parentTable !== parentTable) {
            throw spawnError('Field %s is not in the same table as the record', field.name);
        }
        if (field.type !== FieldType.MULTIPLE_RECORD_LINKS) {
            throw spawnError('Field %s is not a multiple record links field', field.name);
        }
        const airtableInterface = this.parentTable.parentBase.__sdk.__airtableInterface;
        return airtableInterface.fetchForeignRecordsAsync(
            parentTable.id,
            this.id,
            field.id,
            filterString,
        );
    }

    /**
     * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result
     * containing the records in the given `multipleRecordLinks` field.
     * See {@link RecordQueryResult} for more.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param opts Options for the query, such as fields.
     */
    selectLinkedRecordsFromCell(
        fieldOrFieldIdOrFieldName: Field | FieldId | string,
        opts: LinkedRecordsQueryResultOpts = {},
    ): LinkedRecordsQueryResult {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        const normalizedOpts = LinkedRecordsQueryResult._normalizeOpts(this, field, opts);
        return this.__linkedRecordsQueryResultPool.getObjectForReuse(this._sdk, normalizedOpts);
    }

    /**
     * Select and load records referenced in a `multipleRecordLinks` cell value. Returns a query
     * result promise containing the records in the given `multipleRecordLinks` field.
     * See {@link RecordQueryResult} for more.
     *
     * Remember to call `queryResult.unloadData` once you're finished with the query.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param opts Options for the query, such as fields.
     */
    async selectLinkedRecordsFromCellAsync(
        fieldOrFieldIdOrFieldName: Field | FieldId | string,
        opts: LinkedRecordsQueryResultOpts = {},
    ): Promise<LinkedRecordsQueryResult> {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        const queryResult = this.selectLinkedRecordsFromCell(field, opts);
        await queryResult.loadDataAsync();
        return queryResult;
    }
}
