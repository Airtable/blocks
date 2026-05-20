import {invariant, spawnError} from '../../shared/error_utils';
import {WatchableCellValueInFieldKeyPrefix} from '../../shared/models/record_core';
import {fireAndForgetPromise, getLocallyUniqueId} from '../../shared/private_utils';
import {FieldType} from '../../shared/types/field_core';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type InterfaceBlockSdk} from '../sdk';
import {Field} from './field';
import {type Record} from './record';
import {RecordQueryResult, type WatchableRecordQueryResultKey} from './record_query_result';
import {type Table} from './table';

/**
 * Used to control what data is loaded in a {@link LinkedRecordsQueryResult}. Used
 * when creating a query result using {@link Record.selectLinkedRecordsFromCell}.
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
 * const queryResult = record.selectLinkedRecordsFromCell(field, opts);
 * ```
 */
export interface LinkedRecordsQueryResultOpts {
    /** The fields (or field names or field ids) on the linked table to load. */
    fields?: ReadonlyArray<Field | FieldId | string> | null;
}

/** @hidden */
export interface NormalizedLinkedRecordsQueryResultOpts {
    originRecord: Record;
    /** A MULTIPLE_RECORD_LINKS field on `originRecord.parentTable`. */
    originField: Field;
    /** The table the origin field links to. */
    linkedTable: Table;
    /** Fields on `linkedTable` to load, or null for all fields. */
    fieldIdsOrNullIfAllFields: ReadonlyArray<FieldId> | null;
}

/** @hidden */
interface LinkedRecordsQueryResultData {}

/**
 * Reads a MULTIPLE_RECORD_LINKS field's `linkedTableId` type option. Throws if
 * the field isn't of that type or the option is missing.
 */
function getLinkedTableId(field: Field): string {
    const options = field.options;
    const linkedTableId = options && (options as {linkedTableId?: unknown}).linkedTableId;
    invariant(
        typeof linkedTableId === 'string',
        'linkedTableId must be present on a MULTIPLE_RECORD_LINKS field',
    );
    return linkedTableId;
}

/**
 * Represents a set of records from a LinkedRecord cell value. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `record.selectLinkedRecordsFromCell`.
 *
 * @docsPath models/query results/LinkedRecordsQueryResult
 */
export class LinkedRecordsQueryResult extends RecordQueryResult<LinkedRecordsQueryResultData> {
    /** @internal */
    static _className = 'LinkedRecordsQueryResult';

    /** @internal */
    _normalizedOpts: NormalizedLinkedRecordsQueryResultOpts;

    /** @internal */
    _cachedPoolKey: string;

    /**
     * Latches to `false` when this query result is no longer pointing at a
     * real (origin record, origin field → linked table) triple — e.g. origin
     * record deleted, origin field deleted / retyped / retargeted. Once false,
     * `_getRecordIdsToLoad` returns `[]` and the internal refresh is a no-op.
     * See `_checkValidity`.
     *
     * @internal
     */
    _isValid: boolean = true;

    /**
     * The linked-record-id list passed to the most recent host load (initial
     * load or cell-change refresh). `_onOriginCellChanged` compares against
     * this to skip redundant refreshes when the origin cell value object
     * changed but the id list is identical — e.g. a linked record's primary
     * field was renamed, so the cell's denormalized {id, name} pair updates
     * but the id set does not. Linked-record names propagate to consumers via
     * the linked table's record-store watchers, not via this refresh.
     *
     * @internal
     */
    _lastLoadedRecordIds: ReadonlyArray<RecordId> | null = null;

    /** @hidden */
    constructor(sdk: InterfaceBlockSdk, normalizedOpts: NormalizedLinkedRecordsQueryResultOpts) {
        super(sdk, getLocallyUniqueId('LinkedRecordsQueryResult'));
        this._normalizedOpts = normalizedOpts;
        this._cachedPoolKey = JSON.stringify([
            'linked',
            normalizedOpts.originRecord.id,
            normalizedOpts.originField.id,
            normalizedOpts.fieldIdsOrNullIfAllFields,
        ]);
    }

    /** @inheritdoc */
    get __poolKey(): string {
        return this._cachedPoolKey;
    }

    /**
     * Is the query result currently valid? This value always starts as 'true',
     * but can become false if the record from which this result was created is
     * deleted, if the field is deleted, if the field config changes to link to
     * a different table, or if the field config changes to link to a type
     * other than MULTIPLE_RECORD_LINKS. Once `isValid` has become false, it
     * will never become true again.
     */
    get isValid(): boolean {
        return this._checkValidity();
    }

    /**
     * The table that records in this RecordQueryResult are part of
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     */
    get parentTable(): Table {
        return this._normalizedOpts.linkedTable;
    }

    /**
     * The fields that were used to create this LinkedRecordsQueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the linked table.
     */
    get fields(): ReadonlyArray<Field> | null {
        const {fieldIdsOrNullIfAllFields, linkedTable} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields === null) {
            return null;
        }
        const fields: Array<Field> = [];
        for (const fieldId of fieldIdsOrNullIfAllFields) {
            const field = linkedTable.getFieldByIdIfExists(fieldId);
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
     * Input to the host loader — the linked record IDs currently referenced by
     * the origin cell. Returns `[]` if the cell is null, non-array, or if this
     * query result has been invalidated.
     *
     * Note the asymmetry with `get recordIds()` (inherited): that getter
     * returns the *loaded* set, not the cell's current contents.
     *
     * @internal
     */
    _getRecordIdsToLoad(): ReadonlyArray<RecordId> | null {
        if (!this._checkValidity()) {
            return [];
        }
        const cellValue = this._normalizedOpts.originRecord.getCellValue(
            this._normalizedOpts.originField,
        );
        if (!Array.isArray(cellValue)) {
            return [];
        }
        return cellValue
            .map((entry) => (entry && typeof entry.id === 'string' ? entry.id : null))
            .filter((id): id is RecordId => id !== null);
    }

    /**
     * Tighter than the abstract default: invalidates on origin record / field /
     * linked-table deletion, on origin field retype (no longer
     * MULTIPLE_RECORD_LINKS), and on `linkedTableId` drift.
     *
     * @internal
     */
    get _dataOrNullIfDeleted(): LinkedRecordsQueryResultData | null {
        return this._checkValidity() ? {} : null;
    }

    /**
     * Evaluates the full validity condition and latches `_isValid` to false on
     * the first failure (never flips back). Used by the getters above and by
     * `_onOriginCellChanged` to short-circuit.
     *
     * @internal
     */
    _checkValidity(): boolean {
        if (!this._isValid) {
            return false;
        }
        const {originRecord, originField, linkedTable} = this._normalizedOpts;
        if (originRecord.isDeleted) {
            this._isValid = false;
            return false;
        }
        if (originField.isDeleted) {
            this._isValid = false;
            return false;
        }
        if (linkedTable.isDeleted) {
            this._isValid = false;
            return false;
        }
        if (originField.type !== FieldType.MULTIPLE_RECORD_LINKS) {
            this._isValid = false;
            return false;
        }
        let currentLinkedTableId: string | null = null;
        try {
            currentLinkedTableId = getLinkedTableId(originField);
        } catch {
            this._isValid = false;
            return false;
        }
        if (currentLinkedTableId !== linkedTable.id) {
            this._isValid = false;
            return false;
        }
        return true;
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        const pool = this._normalizedOpts.originRecord.__linkedRecordsQueryResultPool;
        if (!pool._objectsByKey[this.__poolKey]?.includes(this)) {
            pool.registerObjectForReuseStrong(this);
        }
        const idsAtLoadTime = this._getRecordIdsToLoad();
        const keys = await super._loadDataAsync();
        this._lastLoadedRecordIds = idsAtLoadTime;
        this._normalizedOpts.originRecord.watch(
            WatchableCellValueInFieldKeyPrefix + this._normalizedOpts.originField.id,
            this._onOriginCellChanged,
            this,
        );
        this._onOriginCellChanged();
        return keys;
    }

    /** @internal */
    _unloadData(): void {
        this._normalizedOpts.originRecord.unwatch(
            WatchableCellValueInFieldKeyPrefix + this._normalizedOpts.originField.id,
            this._onOriginCellChanged,
            this,
        );
        super._unloadData();
        this._normalizedOpts.originRecord.__linkedRecordsQueryResultPool.unregisterObjectForReuseStrong(
            this,
        );
    }

    /**
     * Internal refresh: the origin cell changed, so re-issue the host load
     * under the *same* `key` with the new recordIds. The host treats this as
     * an update to the existing subscription (per the interface contract).
     * This does NOT touch `_dataRetainCount` / `_isDataLoaded` — it's a
     * side-channel host call, not a fresh load lifecycle.
     *
     * No `_onChange` emitted here: the loaded set (`get recordIds()`) reads
     * from `dynamicQueriesByKey[__poolKey].recordOrder`, which the host
     * updates when the refresh response lands; the `recordOrder` watcher
     * wired up by `super._loadDataAsync` then forwards the change to this
     * query's watchers atomically — no partial/empty-record flicker.
     *
     * @internal
     */
    _onOriginCellChanged = (): void => {
        if (this._isForceUnloaded) {
            return;
        }
        if (!this._checkValidity()) {
            return;
        }
        const newRecordIds = this._getRecordIdsToLoad() ?? [];
        if (
            this._lastLoadedRecordIds !== null &&
            this._lastLoadedRecordIds.length === newRecordIds.length &&
            this._lastLoadedRecordIds.every((id, i) => id === newRecordIds[i])
        ) {
            return;
        }
        const fields = this.fields ?? this._normalizedOpts.linkedTable.fields;

        this._lastLoadedRecordIds = newRecordIds;
        fireAndForgetPromise(async () => {
            await this._sdk.__airtableInterface.loadDynamicQueryAsync({
                key: this.__poolKey,
                tableId: this._normalizedOpts.linkedTable.id,
                fieldIds: fields.map((f) => f.id),
                recordIds: newRecordIds,
            });
        });
    };

    /**
     * Validates the origin record / field pair and the requested linked-table
     * fields. Throws on invalid input. Derives the linked table from the
     * origin field's `typeOptions.linkedTableId`.
     *
     * @internal
     */
    static _normalizeOpts(
        originRecord: Record,
        originField: Field,
        opts: LinkedRecordsQueryResultOpts,
    ): NormalizedLinkedRecordsQueryResultOpts {
        invariant(
            originField.parentTable === originRecord.parentTable,
            'originField must belong to the same table as originRecord',
        );
        invariant(
            originField.type === FieldType.MULTIPLE_RECORD_LINKS,
            'originField must be a MULTIPLE_RECORD_LINKS field (got %s)',
            originField.type,
        );
        const linkedTableId = getLinkedTableId(originField);
        const linkedTable = originRecord.parentTable.parentBase.getTableByIdIfExists(linkedTableId);
        invariant(linkedTable !== null, 'linked table %s not found', linkedTableId);

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
                const field = linkedTable.__getFieldMatching(fieldOrIdOrName);
                fieldIdSet.add(field.id);
            }
            fieldIdSet.add(linkedTable.primaryField.id);
            fieldIdsOrNullIfAllFields = [...fieldIdSet].sort();
        }

        return {originRecord, originField, linkedTable, fieldIdsOrNullIfAllFields};
    }
}
