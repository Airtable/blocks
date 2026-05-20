import {spawnError, invariant} from '../../shared/error_utils';
import {getLocallyUniqueId} from '../../shared/private_utils';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type InterfaceBlockSdk} from '../sdk';
import {Field} from './field';
import {Record} from './record';
import {RecordQueryResult, type WatchableRecordQueryResultKey} from './record_query_result';
import {type Table} from './table';

/**
 * Used to control what data is loaded in a {@link TableQueryResult}. Used
 * when creating a query result using {@link Table.selectRecords}.
 *
 * ## fields
 * Generally, it's a good idea to load as little data into your extension as possible - Airtable bases
 * can get pretty big, and we have to keep all that information in memory and up to date if you ask
 * for it. The fields option lets you make sure that only data relevant to you is loaded.
 *
 * You can specify fields with a {@link Field}, by ID, or by name:
 * ```js
 * const opts = {
 *     fields: [
 *         // we want to only load fieldA:
 *         fieldA,
 *         // the field with this id:
 *         'fldXXXXXXXXXXXXXX',
 *         // and the field named 'Rating':
 *         'Rating',
 *     ],
 * };
 * const queryResult = table.selectRecords(opts);
 * const records = useRecords(queryResult);
 * ```
 *
 * ## records
 * You can also scope the query to a specific set of records. This is useful
 * if, for example, you have a UI that displays a list of records with only
 * their primary field and allows the user to click on a record to open a
 * detailed view of that record. You can load the list of records with only
 * the primary field, and then issue a new query to load all of the fields
 * for a single record when the detailed view is opened.
 *
 * ```js
 * const opts = {
 *     fields: table.fields,
 *     records: ['recXXXXXXXXXXXXXX'],
 * };
 * const queryResult = table.selectRecords(opts);
 * const records = useRecords(queryResult);
 * ```
 */
export interface TableQueryResultOpts {
    /** The fields (or field names or field ids) to load. Falsey values will be removed. */
    fields?: ReadonlyArray<Field | FieldId | string> | null;
    /**
     * Specific records to load. Even if you already have the record,
     * you may want to load it again in order to load additional cell
     * values for that record.
     */
    records?: ReadonlyArray<Record | RecordId> | null;
}

/** @hidden */
export interface NormalizedTableQueryResultOpts {
    table: Table;
    fieldIdsOrNullIfAllFields: ReadonlyArray<FieldId> | null;
    recordIdsOrNullIfAllRecords: ReadonlyArray<RecordId> | null;
}

/** @hidden */
interface TableQueryResultData {}

/**
 * Represents a set of records from a table. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling `table.selectRecords`.
 *
 * @docsPath models/query results/TableQueryResult
 */
export class TableQueryResult extends RecordQueryResult<TableQueryResultData> {
    /** @internal */
    static _className = 'TableQueryResult';

    /** @internal */
    _normalizedOpts: NormalizedTableQueryResultOpts;

    /** @internal */
    _cachedPoolKey: string;

    /** @hidden */
    constructor(sdk: InterfaceBlockSdk, normalizedOpts: NormalizedTableQueryResultOpts) {
        super(sdk, getLocallyUniqueId('TableQueryResult'));
        this._normalizedOpts = normalizedOpts;
        this._cachedPoolKey = JSON.stringify([
            'table',
            normalizedOpts.table.id,
            normalizedOpts.fieldIdsOrNullIfAllFields,
            normalizedOpts.recordIdsOrNullIfAllRecords,
        ]);
    }

    /** @internal */
    get __poolKey(): string {
        return this._cachedPoolKey;
    }

    /**
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this RecordQueryResult are part of
     */
    get parentTable(): Table {
        return this._normalizedOpts.table;
    }

    /**
     * The fields that were used to create this RecordQueryResult.
     * Null if fields were not specified, which means the RecordQueryResult
     * will load all fields in the table.
     */
    get fields(): ReadonlyArray<Field> | null {
        const {fieldIdsOrNullIfAllFields, table} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields === null) {
            return null;
        }
        const fields: Array<Field> = [];
        for (const fieldId of fieldIdsOrNullIfAllFields) {
            const field = table.getFieldByIdIfExists(fieldId);
            if (field !== null) {
                fields.push(field);
            }
        }
        return fields;
    }

    /** @internal */
    get _fieldIdsOrNullIfAllFields(): ReadonlyArray<FieldId> | null {
        return this._normalizedOpts.fieldIdsOrNullIfAllFields;
    }

    /**
     * Input to the host loader — either the explicit recordIds from
     * opts (if provided), else null to let the host decide which
     * records belong to the query.
     *
     * @internal
     */
    _getRecordIdsToLoad(): ReadonlyArray<RecordId> | null {
        return this._normalizedOpts.recordIdsOrNullIfAllRecords;
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        const pool = this._normalizedOpts.table.__tableQueryResultPool;
        if (!pool._objectsByKey[this.__poolKey]?.includes(this)) {
            pool.registerObjectForReuseStrong(this);
        }
        return await super._loadDataAsync();
    }

    /** @internal */
    _unloadData(): void {
        super._unloadData();
        this._normalizedOpts.table.__tableQueryResultPool.unregisterObjectForReuseStrong(this);
    }

    /**
     * Validates user-supplied opts against the table's schema and normalizes
     * them into the internal shape. Throws a helpful error if a field value is
     * not a `Field` / id / name.
     *
     * @internal
     */
    static _normalizeOpts(
        table: Table,
        opts: TableQueryResultOpts,
    ): NormalizedTableQueryResultOpts {
        let fieldIdsOrNullIfAllFields: Array<FieldId> | null = null;
        if (opts.fields !== undefined && opts.fields !== null) {
            invariant(Array.isArray(opts.fields), 'Must specify an array of fields');
            const fieldIdSet = new Set<FieldId>();
            for (const fieldOrIdOrName of opts.fields) {
                if (!fieldOrIdOrName) {
                    continue;
                }
                if (typeof fieldOrIdOrName !== 'string' && !(fieldOrIdOrName instanceof Field)) {
                    throw spawnError(
                        'Invalid value for field, expected a field, id, or name but got: %s',
                        fieldOrIdOrName,
                    );
                }
                const field = table.__getFieldMatching(fieldOrIdOrName);
                fieldIdSet.add(field.id);
            }
            fieldIdSet.add(table.primaryField.id);
            fieldIdsOrNullIfAllFields = [...fieldIdSet].sort();
        }

        let recordIdsOrNullIfAllRecords: Array<RecordId> | null = null;
        if (opts.records !== undefined && opts.records !== null) {
            invariant(Array.isArray(opts.records), 'Must specify an array of records');
            const recordIdSet = new Set<RecordId>();
            for (const recordOrId of opts.records) {
                if (!recordOrId) {
                    continue;
                }
                if (typeof recordOrId !== 'string' && !(recordOrId instanceof Record)) {
                    throw spawnError(
                        'Invalid value for record, expected a record or id, but got: %s',
                        recordOrId,
                    );
                }
                if (recordOrId instanceof Record) {
                    recordIdSet.add(recordOrId.id);
                } else {
                    recordIdSet.add(recordOrId);
                }
            }
            recordIdsOrNullIfAllRecords = [...recordIdSet].sort();
        }
        return {table, fieldIdsOrNullIfAllFields, recordIdsOrNullIfAllRecords};
    }
}
