import {type InterfaceSdkMode} from '../../sdk_mode';
import {invariant, spawnError} from '../../shared/error_utils';
import {
    RecordQueryResultCore,
    WatchableRecordQueryResultKeysCore,
} from '../../shared/models/record_query_result_core';
import {
    WatchableCellValuesInFieldKeyPrefix,
    WatchableDynamicQueryKeyPrefix,
} from '../../shared/models/record_store_core';
import {type ObjectValues} from '../../shared/private_utils';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type Field} from './field';
import {type Record} from './record';
import {type Table} from './table';

export const WatchableRecordQueryResultKeys = Object.freeze({
    ...WatchableRecordQueryResultKeysCore,
});

/**
 * A key in {@link RecordQueryResult} that can be watched
 * - `records`
 * - `recordIds`
 * - `cellValues`
 * - `isDataLoaded`
 * - `cellValuesInField:{FIELD_ID}`
 */
export type WatchableRecordQueryResultKey =
    | ObjectValues<typeof WatchableRecordQueryResultKeys>
    | string;

/**
 * A RecordQueryResult represents a set of records. It contains a list of
 * records, optionally projected onto a subset of fields. There are two types
 * of QueryResult:
 *
 * - {@link TableQueryResult} is a query result filtered to the records in a
 *   specific {@link Table}. You can get one of these with `table.selectRecords()`.
 * - {@link LinkedRecordsQueryResult} is a query result of all the records in a
 *   particular [linked record cell](https://support.airtable.com/hc/en-us/articles/206452848-Linked-record-fields).
 *   You can get one of these with `record.selectLinkedRecordsFromCell(someField)`.
 *
 * Once you've got a query result, you need to load it before you can start
 * working with it — extensions don't load record data by default. We recommend
 * using {@link useRecords} to handle this.
 *
 * If you're not using a query result in a React component, you can manually
 * load the data and unload it when you're finished:
 *
 * ```js
 * async function fetchRecordsAndDoSomethingAsync(myTable) {
 *     // query for all the records in "myTable"
 *     const queryResult = myTable.selectRecords();
 *
 *     // load the data in the query result:
 *     await queryResult.loadDataAsync();
 *
 *     // work with the data in the query result
 *     doSomething(queryResult);
 *
 *     // when you're done, unload the data:
 *     queryResult.unloadData();
 * }
 * ```
 *
 * Whilst loaded, a query result will automatically keep up to date with what's
 * in Airtable: records will get added or removed, cell values will be updated,
 * etc. If you're writing a React component then our hooks will look after that
 * for you. If not, you can get notified of these changes with `.watch()`.
 *
 * @docsPath models/query results/RecordQueryResult
 */
export abstract class RecordQueryResult<DataType = {}> extends RecordQueryResultCore<
    InterfaceSdkMode,
    DataType,
    WatchableRecordQueryResultKey
> {
    /** @internal */
    static _className = 'RecordQueryResult';

    /**
     * Cache of field-gating proxies keyed by record id. Cleared on unload so a
     * subsequent load starts fresh. Stale entries for deleted records are purged
     * opportunistically the next time `_getProxiedRecordByIdIfExists` runs.
     *
     * @internal
     */
    _proxyByRecordId: Map<RecordId, Record> = new Map();

    /**
     * Lazily-built `ProxyHandler` shared by every proxy this query creates.
     * The handler's `get` trap uses its `target` (the record being accessed)
     * for field matching, so it has no per-record state — one handler per
     * query is sufficient. Captures a `Set<FieldId>` in its closure for O(1)
     * membership checks on the hot cell-access path.
     *
     * @internal
     */
    _cachedProxyHandler: ProxyHandler<Record> | null = null;

    /**
     * Lazily-built Set of `recordIds` for O(1) membership checks in
     * `_onRecordStoreCellValuesChanged`. Invalidated by
     * `_onRecordStoreRecordOrderChanged` so the cache always reflects the
     * current result set without rebuilding on every cell-value event.
     *
     * @internal
     */
    _cachedRecordIdsSet: Set<RecordId> | null = null;

    /**
     * Fires on any change to the parent table's `recordOrder` or the
     * `dynamicQueriesByKey[*].recordOrder` — either means our query's result set
     * may have shifted. We re-emit to our own watchers of `recordIds` / `records`.
     * Arrow syntax preserves a stable reference for watch / unwatch symmetry.
     *
     * @internal
     */
    _onRecordStoreRecordOrderChanged = (): void => {
        this._cachedRecordIdsSet = null;
        this._onChange(WatchableRecordQueryResultKeysCore.recordIds);
        this._onChange(WatchableRecordQueryResultKeysCore.records);
    };

    /**
     * Fires when the table-level `recordsById` map changes (records added or
     * removed at the table level). Complements `_onRecordStoreRecordOrderChanged`,
     * which only fires when the host pushes a per-query `recordOrder` update.
     *
     * When a record is deleted optimistically, `recordsById` updates
     * immediately but the host-mirrored `dynamicQueriesByKey[key].recordOrder`
     * doesn't until the host syncs. `recordIds` is filtered against
     * `recordsById`, so our view changes — but without this handler our
     * `recordIds` / `records` watchers wouldn't fire until the host catches up.
     * Filter on intersection with the raw recordOrder so we only fire for
     * changes that actually affect this query.
     *
     * @internal
     */
    _onRecordStoreRecordsChanged = (
        _model: unknown,
        _key: string,
        payload:
            | {
                  addedRecordIds: ReadonlyArray<RecordId>;
                  removedRecordIds: ReadonlyArray<RecordId>;
              }
            | undefined,
    ): void => {
        if (!this.isDataLoaded || payload === undefined) {
            return;
        }
        if (payload.removedRecordIds.length === 0) {
            return;
        }
        const recordStore = this.parentTable.parentBase.__getRecordStore(this.parentTable.id);
        const rawRecordOrder =
            recordStore._data.dynamicQueriesByKey?.[this.__poolKey]?.recordOrder ?? [];
        const rawSet = new Set<RecordId>(rawRecordOrder);
        if (!payload.removedRecordIds.some((id) => rawSet.has(id))) {
            return;
        }
        this._cachedRecordIdsSet = null;
        this._onChange(WatchableRecordQueryResultKeysCore.recordIds);
        this._onChange(WatchableRecordQueryResultKeysCore.records);
    };

    /**
     * Fires on changes to cell values for fields this query asked for (or any
     * cell value, if `fields === null`). We re-emit as `cellValues` + `records`
     * so consumers using `useWatchable(queryResult, ['records', 'cellValues'])`
     * re-render on data updates.
     *
     * The record store fires one event per field (or per cell-values change)
     * with the changed recordIds as a payload arg:
     *   - `cellValuesInField:<fieldId>` handler signature: `(recordIds, fieldId)`
     *   - `cellValues` handler signature: `({recordIds, fieldIds})`
     *
     * We filter both down to "at least one of the changed records is in my
     * result set" before re-emitting — otherwise any cell-value change on the
     * table triggers every query on that table to re-fire, even queries whose
     * result set doesn't include the changed record.
     *
     * @internal
     */
    _onRecordStoreCellValuesChanged = (
        _model: unknown,
        _key: string,
        changedRecordIdsOrPayload:
            | ReadonlyArray<RecordId>
            | {recordIds: ReadonlyArray<RecordId>}
            | undefined,
    ): void => {
        if (changedRecordIdsOrPayload === undefined) {
            return;
        }
        const changedRecordIds: ReadonlyArray<RecordId> = Array.isArray(changedRecordIdsOrPayload)
            ? (changedRecordIdsOrPayload as ReadonlyArray<RecordId>)
            : (changedRecordIdsOrPayload as {recordIds: ReadonlyArray<RecordId>}).recordIds;
        if (changedRecordIds.length === 0) {
            return;
        }
        if (!this.isDataLoaded) {
            return;
        }
        if (this._cachedRecordIdsSet === null) {
            this._cachedRecordIdsSet = new Set<RecordId>(this.recordIds);
        }
        const myRecordIdsSet = this._cachedRecordIdsSet;
        if (!changedRecordIds.some((id: RecordId) => myRecordIdsSet.has(id))) {
            return;
        }
        this._onChange(WatchableRecordQueryResultKeysCore.cellValues);
        this._onChange(WatchableRecordQueryResultKeysCore.records);
    };

    /**
     * Canonical identity for this query result. Used as both the `ObjectPool` key
     * (see `shared/models/object_pool.ts`) and the `key` argument passed to the
     * host's `loadDynamicQueryAsync` / `unloadDynamicQuery`. Identical `__poolKey`
     * ⇒ same pooled instance ⇒ same host-side subscription.
     *
     * @internal
     */
    abstract get __poolKey(): string;

    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    abstract get fields(): ReadonlyArray<Field> | null;

    /**
     * The stable list of field IDs this query was created with. Unlike
     * `fields`, this does NOT filter out deleted fields — so load-time and
     * unload-time registrations stay symmetric even if a field is deleted
     * between the two. Used only for watch/unwatch on `RecordStore`.
     *
     * @internal
     */
    abstract get _fieldIdsOrNullIfAllFields(): ReadonlyArray<FieldId> | null;

    /**
     * The table that records in this QueryResult are part of.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     */
    abstract get parentTable(): Table;

    /**
     * Input to the host loader — the recordIds this query wants loaded. Distinct
     * from `get recordIds()` which returns the records that have actually been
     * loaded. `TableQueryResult` returns `null` (load every record the host sends
     * back for this table + fields); `LinkedRecordsQueryResult` returns the origin
     * cell's current linked IDs.
     *
     * @internal
     */
    abstract _getRecordIdsToLoad(): ReadonlyArray<RecordId> | null;

    /**
     * A query result is "deleted" (in the `AbstractModel` sense) when its parent
     * table is deleted. Subclasses may tighten this — e.g.
     * `LinkedRecordsQueryResult` also invalidates when the origin record or
     * field is deleted. Returning `null` causes `isDeleted` to be true and makes
     * framework assertions fire on further use.
     *
     * `DataType` on the interface query results is `{}` — there's no
     * per-instance data to carry; `_data.*` never gets read. The empty object is
     * just a non-null marker.
     *
     * @internal
     */
    get _dataOrNullIfDeleted(): DataType | null {
        return this.parentTable.isDeleted ? null : ({} as DataType);
    }

    /**
     * The record IDs in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get recordIds(): ReadonlyArray<RecordId> {
        invariant(this.isDataLoaded, 'RecordQueryResult data is not loaded');
        const recordStore = this.parentTable.parentBase.__getRecordStore(this.parentTable.id);
        const recordOrder =
            recordStore._data.dynamicQueriesByKey?.[this.__poolKey]?.recordOrder ?? [];
        return recordOrder.filter(
            (recordId) => recordStore.getRecordByIdIfExists(recordId) !== null,
        );
    }

    /**
     * The records in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get records(): Array<Record> {
        return this.recordIds.map((recordId) => {
            const record = this._getProxiedRecordByIdIfExists(recordId);
            invariant(record, 'Record missing in table');
            return record;
        });
    }

    /**
     * Get a specific record in the query result, or null if that record doesn't exist or is
     * filtered out. Throws if data is not loaded yet. Watch using `'recordIds'`.
     *
     * @param recordId the ID of the {@link Record} you want
     */
    getRecordByIdIfExists(recordId: RecordId): Record | null {
        if (!this.hasRecord(recordId)) {
            return null;
        }
        return this._getProxiedRecordByIdIfExists(recordId);
    }

    /**
     * Get a specific record in the query result, or throws if that record doesn't exist or is
     * filtered out. Throws if data is not loaded yet. Watch using `'recordIds'`.
     *
     * @param recordId the ID of the {@link Record} you want
     */
    getRecordById(recordId: RecordId): Record {
        const record = this.getRecordByIdIfExists(recordId);
        if (!record) {
            throw spawnError('No record with ID %s in this query result', recordId);
        }
        return record;
    }

    /**
     * Check to see if a particular record or record id is present in this query result. Returns
     * false if the record has been deleted or is filtered out.
     *
     * @param recordOrRecordId the record or record id to check the presence of
     */
    hasRecord(recordOrRecordId: RecordId | Record): boolean {
        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
        if (this._cachedRecordIdsSet === null) {
            this._cachedRecordIdsSet = new Set<RecordId>(this.recordIds);
        }
        return this._cachedRecordIdsSet.has(recordId);
    }

    /** @internal */
    _getProxiedRecordByIdIfExists(recordId: RecordId): Record | null {
        const recordStore = this.parentTable.parentBase.__getRecordStore(this.parentTable.id);
        const rawRecord = recordStore.getRecordByIdIfExists(recordId);
        if (rawRecord === null) {
            this._proxyByRecordId.delete(recordId);
            return null;
        }
        const fieldIds = this._fieldIdsOrNullIfAllFields;
        if (fieldIds === null) {
            return rawRecord;
        }
        const cached = this._proxyByRecordId.get(recordId);
        if (cached) {
            return cached;
        }
        if (this._cachedProxyHandler === null) {
            this._cachedProxyHandler = this._buildProxyHandler(new Set(fieldIds));
        }
        const proxied = new Proxy(rawRecord, this._cachedProxyHandler);
        this._proxyByRecordId.set(recordId, proxied);
        return proxied;
    }

    /**
     * Builds the `ProxyHandler` used to wrap every raw `Record` this query
     * returns, so cell-value accessors throw when a caller asks for a field
     * that this query did not declare.
     *
     * Background: the `RecordStore` stores one canonical `Record` per record id.
     * If two query results on the same table load different field sets and both
     * cover the same record, naive access to the raw instance would let a
     * consumer of Query A read a field that only Query B loaded — a silent
     * cross-query leak. The handler routes all cell-reading methods and
     * `selectLinkedRecordsFromCell*` (which reads the cell's links as its
     * input) through a field-membership check.
     *
     * Not gated: `id`, `name`, `parentTable`, `isDeleted`, and any other
     * pass-through property.
     *
     * The handler closes over `fieldIds` but not over any specific `Record`,
     * so one handler instance is reused for every proxy this query creates.
     *
     * @internal
     */
    _buildProxyHandler(fieldIds: ReadonlySet<FieldId>): ProxyHandler<Record> {
        const assertFieldLoaded = (
            target: Record,
            fieldOrIdOrName: Field | FieldId | string,
        ): Field => {
            const field = target._getFieldMatching(fieldOrIdOrName);
            if (!fieldIds.has(field.id)) {
                throw spawnError(
                    "Field %s was not declared in this query result's fields. Declared fields: %s",
                    field.id,
                    [...fieldIds].join(', ') || '<none>',
                );
            }
            return field;
        };

        const DENIED_PROPS = new Set<string | symbol>(['_data', '_baseData', '_getRawCellValue']);

        return {
            has(target, prop) {
                if (DENIED_PROPS.has(prop)) {
                    return false;
                }
                return Reflect.has(target, prop);
            },
            ownKeys(target) {
                return Reflect.ownKeys(target).filter((key) => !DENIED_PROPS.has(key));
            },
            getOwnPropertyDescriptor(target, prop) {
                if (DENIED_PROPS.has(prop)) {
                    return undefined;
                }
                return Reflect.getOwnPropertyDescriptor(target, prop);
            },
            get(target, prop, receiver) {
                if (prop === 'getCellValue') {
                    return (fieldOrIdOrName: Field | FieldId | string) => {
                        const field = assertFieldLoaded(target, fieldOrIdOrName);
                        return target.getCellValue(field);
                    };
                }
                if (prop === 'getCellValueAsString') {
                    return (fieldOrIdOrName: Field | FieldId | string) => {
                        const field = assertFieldLoaded(target, fieldOrIdOrName);
                        return target.getCellValueAsString(field);
                    };
                }
                if (prop === 'fetchForeignRecordsAsync') {
                    return (field: Field, filterString: string) => {
                        assertFieldLoaded(target, field);
                        return target.fetchForeignRecordsAsync(field, filterString);
                    };
                }
                if (prop === 'selectLinkedRecordsFromCell') {
                    return (...args: Parameters<Record['selectLinkedRecordsFromCell']>) => {
                        assertFieldLoaded(target, args[0]);
                        return target.selectLinkedRecordsFromCell(...args);
                    };
                }
                if (prop === 'selectLinkedRecordsFromCellAsync') {
                    return (...args: Parameters<Record['selectLinkedRecordsFromCellAsync']>) => {
                        assertFieldLoaded(target, args[0]);
                        return target.selectLinkedRecordsFromCellAsync(...args);
                    };
                }
                if (DENIED_PROPS.has(prop)) {
                    throw spawnError(
                        'Direct access to %s on a field-gated record is not allowed; ' +
                            'use getCellValue / getCellValueAsString',
                        String(prop),
                    );
                }
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'function') {
                    return value.bind(receiver);
                }
                return value;
            },
        };
    }

    /**
     * Does the host-side subscribe for this query, wires up `RecordStore` change
     * forwarding, and returns the watchable keys whose values are now initially
     * known.
     *
     * Subclasses (`TableQueryResult`, `LinkedRecordsQueryResult`) override this
     * to also register strongly with their parent's `ObjectPool` (so they can't
     * be weakly evicted while loaded) and to set up any subclass-specific
     * watchers (e.g. `LinkedRecordsQueryResult` watches the origin cell).
     * Overrides should `await super._loadDataAsync()` to reuse this host call +
     * record-store wiring and return its keys unioned with any subclass keys.
     *
     * @internal
     */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        const fields = this.fields ?? this.parentTable.fields;

        await this._sdk.__airtableInterface.loadDynamicQueryAsync({
            key: this.__poolKey,
            tableId: this.parentTable.id,
            fieldIds: fields.map((field) => field.id),
            recordIds: this._getRecordIdsToLoad(),
        });

        const recordStore = this.parentTable.parentBase.__getRecordStore(this.parentTable.id);
        recordStore.watch(
            WatchableDynamicQueryKeyPrefix + this.__poolKey,
            this._onRecordStoreRecordOrderChanged,
            this,
        );
        recordStore.watch('recordIds', this._onRecordStoreRecordsChanged, this);
        const fieldIds = this._fieldIdsOrNullIfAllFields;
        if (fieldIds === null) {
            recordStore.watch('cellValues', this._onRecordStoreCellValuesChanged, this);
        } else {
            for (const fieldId of fieldIds) {
                recordStore.watch(
                    WatchableCellValuesInFieldKeyPrefix + fieldId,
                    this._onRecordStoreCellValuesChanged,
                    this,
                );
            }
        }

        return [
            WatchableRecordQueryResultKeysCore.records,
            WatchableRecordQueryResultKeysCore.recordIds,
        ];
    }

    /**
     * Tears down record-store watchers, unsubscribes on the host, and clears the
     * proxy cache. Subclasses should do their own teardown (unwatch
     * subclass-specific sources, strong-unregister from the parent pool) before
     * calling `super._unloadData()`.
     *
     * @internal
     */
    _unloadData(): void {
        const recordStore = this.parentTable.parentBase.__getRecordStore(this.parentTable.id);
        recordStore.unwatch(
            WatchableDynamicQueryKeyPrefix + this.__poolKey,
            this._onRecordStoreRecordOrderChanged,
            this,
        );
        recordStore.unwatch('recordIds', this._onRecordStoreRecordsChanged, this);
        const fieldIds = this._fieldIdsOrNullIfAllFields;
        if (fieldIds === null) {
            recordStore.unwatch('cellValues', this._onRecordStoreCellValuesChanged, this);
        } else {
            for (const fieldId of fieldIds) {
                recordStore.unwatch(
                    WatchableCellValuesInFieldKeyPrefix + fieldId,
                    this._onRecordStoreCellValuesChanged,
                    this,
                );
            }
        }

        this._sdk.__airtableInterface.unloadDynamicQuery({
            key: this.__poolKey,
        });
        this._proxyByRecordId.clear();
    }
}
