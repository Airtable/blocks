import {getLocallyUniqueId} from '../../shared/private_utils';
import {WatchableRecordQueryResultKeysCore} from '../../shared/models/record_query_result_core';
import {WatchableDynamicQueryKeyPrefix} from '../../shared/models/record_store_core';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type InterfaceBlockSdk} from '../sdk';
import {type PreloadedRecordsData} from '../types/table';
import {type Field} from './field';
import {RecordQueryResult, type WatchableRecordQueryResultKey} from './record_query_result';
import {type Table} from './table';

/**
 * Watchable keys in {@link PreloadedRecordsQueryResult}, in addition to the keys of
 * {@link RecordQueryResult}:
 * - `hasMoreRecords`
 */
export const WatchablePreloadedRecordsQueryResultKeys = Object.freeze({
    hasMoreRecords: 'hasMoreRecords' as const,
});

/** @hidden */
interface PreloadedRecordsQueryResultData {}

/**
 * The first records of a table, preloaded by Airtable before your extension asked for any data.
 * The builder chooses, per table, whether to preload records, which fields to preload, and how
 * many records (`rowLimit`). The records use the same filters and sort order as
 * `useRecords(table)`, so they are the first `rowLimit` records that `useRecords(table)` returns.
 *
 * Unlike other query results, a `PreloadedRecordsQueryResult` is loaded from the start: reading
 * its records never suspends and never asks Airtable for more data. It only contains the fields in
 * {@link fields}; reading any other field throws. It stays up to date as records change.
 *
 * Do not instantiate. You can get an instance by calling `table.unstable_selectPreloadedRecords()`,
 * or use {@link unstable_usePreloadedRecords}.
 *
 * @docsPath models/query results/PreloadedRecordsQueryResult
 */
export class PreloadedRecordsQueryResult extends RecordQueryResult<PreloadedRecordsQueryResultData> {
    /** @internal */
    static _className = 'PreloadedRecordsQueryResult';

    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return (
            key === WatchablePreloadedRecordsQueryResultKeys.hasMoreRecords ||
            RecordQueryResult._isWatchableKey(key)
        );
    }

    /**
     * `hasMoreRecords` changes are only forwarded from the record store while loaded.
     *
     * @internal
     */
    static _shouldLoadDataForKey(key: string): boolean {
        return (
            key === WatchablePreloadedRecordsQueryResultKeys.hasMoreRecords ||
            RecordQueryResult._shouldLoadDataForKey(key)
        );
    }

    /** @internal */
    _table: Table;
    /** @internal */
    _queryKey: string;
    /**
     * The preloaded fields, as the host described them.
     *
     * @internal
     */
    _preloadedFieldIds: ReadonlyArray<FieldId>;
    /**
     * The fields that reads are gated to: the preloaded fields, or the requested ones among them.
     *
     * @internal
     */
    _fieldIds: ReadonlyArray<FieldId>;
    /** @internal */
    _rowLimit: number;
    /** @internal */
    _queryResultByRequestedFieldIdsKey: Map<string, PreloadedRecordsQueryResult> = new Map();

    /** @hidden */
    constructor(
        sdk: InterfaceBlockSdk,
        table: Table,
        preloadedRecordsData: PreloadedRecordsData,
        requestedFieldIds: ReadonlyArray<FieldId> | null = null,
    ) {
        super(sdk, getLocallyUniqueId('PreloadedRecordsQueryResult'));
        this._table = table;
        this._queryKey = preloadedRecordsData.queryKey;
        this._preloadedFieldIds = [...preloadedRecordsData.fieldIds];
        if (requestedFieldIds === null) {
            this._fieldIds = this._preloadedFieldIds;
        } else {
            const requestedFieldIdSet = new Set(requestedFieldIds);
            this._fieldIds = this._preloadedFieldIds.filter((fieldId) =>
                requestedFieldIdSet.has(fieldId),
            );
        }
        this._rowLimit = preloadedRecordsData.rowLimit;
    }

    /**
     * The same preloaded records, with reads gated to the preloaded fields among
     * `requestedFieldIds`, kept in the preloaded order. Returns the same instance for the same
     * fields until the host replaces or releases the preloaded records.
     *
     * @internal
     */
    _selectForRequestedFieldIds(
        requestedFieldIds: ReadonlyArray<FieldId>,
    ): PreloadedRecordsQueryResult {
        const key = JSON.stringify([...requestedFieldIds].sort());
        let queryResult = this._queryResultByRequestedFieldIdsKey.get(key);
        if (queryResult === undefined) {
            queryResult = new PreloadedRecordsQueryResult(
                this._sdk,
                this._table,
                {
                    queryKey: this._queryKey,
                    fieldIds: [...this._preloadedFieldIds],
                    rowLimit: this._rowLimit,
                },
                requestedFieldIds,
            );
            this._queryResultByRequestedFieldIdsKey.set(key, queryResult);
        }
        return queryResult;
    }

    /**
     * Whether this instance describes the given host data. The host replaces the description
     * when the builder changes the preloading configuration, which makes older instances stale.
     *
     * @internal
     */
    _isForPreloadedRecordsData(preloadedRecordsData: PreloadedRecordsData): boolean {
        return (
            preloadedRecordsData.queryKey === this._queryKey &&
            preloadedRecordsData.rowLimit === this._rowLimit &&
            preloadedRecordsData.fieldIds.length === this._preloadedFieldIds.length &&
            preloadedRecordsData.fieldIds.every(
                (fieldId, index) => fieldId === this._preloadedFieldIds[index],
            )
        );
    }

    /** @internal */
    _getPreloadedRecordsDataIfCurrent(): PreloadedRecordsData | null {
        if (this._table.isDeleted) {
            return null;
        }
        const tableData = this._baseData.tablesById[this._table.id];
        const preloadedRecordsData = tableData.preloadedRecords ?? null;
        if (
            preloadedRecordsData === null ||
            !this._isForPreloadedRecordsData(preloadedRecordsData) ||
            !tableData.dynamicQueriesByKey?.[this._queryKey]
        ) {
            return null;
        }
        return preloadedRecordsData;
    }

    /**
     * Deleted once the host stops providing these preloaded records, e.g. when the builder turns
     * preloading off or changes its configuration.
     *
     * @internal
     */
    get _dataOrNullIfDeleted(): PreloadedRecordsQueryResultData | null {
        return this._getPreloadedRecordsDataIfCurrent() === null ? null : {};
    }

    /**
     * Always true while the preloaded records exist: the host only describes preloaded records
     * once their data is present.
     */
    get isDataLoaded(): boolean {
        return !this.isDeleted;
    }

    /** @internal */
    get __poolKey(): string {
        return this._queryKey;
    }

    /** @internal */
    get parentTable(): Table {
        return this._table;
    }

    /**
     * The preloaded fields. Reading the cell value of any other field from these records throws.
     */
    get fields(): ReadonlyArray<Field> {
        const fields: Array<Field> = [];
        for (const fieldId of this._fieldIds) {
            const field = this._table.getFieldByIdIfExists(fieldId);
            if (field !== null) {
                fields.push(field);
            }
        }
        return fields;
    }

    /** @internal */
    get _fieldIdsOrNullIfAllFields(): ReadonlyArray<FieldId> {
        return this._fieldIds;
    }

    /** The maximum number of records that were preloaded. */
    get rowLimit(): number {
        return this._rowLimit;
    }

    /**
     * The record IDs in this query result: at most {@link rowLimit} of them, in the same order as
     * `useRecords(table)`. Can be watched.
     */
    get recordIds(): ReadonlyArray<RecordId> {
        const recordIds = super.recordIds;
        const preloadedRecordIds = new Set(this._getRecordOrderFromHost().slice(0, this._rowLimit));
        return recordIds.filter((recordId) => preloadedRecordIds.has(recordId));
    }

    /**
     * Whether more records match than were preloaded. Can be watched.
     */
    get hasMoreRecords(): boolean {
        if (this._getPreloadedRecordsDataIfCurrent() === null) {
            return false;
        }
        return this._getRecordOrderFromHost().length > this._rowLimit;
    }

    /**
     * The preloaded record IDs as the host sent them, including the extra one and any records
     * deleted since.
     *
     * @internal
     */
    _getRecordOrderFromHost(): ReadonlyArray<RecordId> {
        const recordStore = this._table.parentBase.__getRecordStore(this._table.id);
        return recordStore._data.dynamicQueriesByKey?.[this._queryKey]?.recordOrder ?? [];
    }

    /** @internal */
    _getRecordIdsToLoad(): null {
        return null;
    }

    /** @internal */
    _onPreloadedRecordOrderChanged = (): void => {
        this._onChange(WatchablePreloadedRecordsQueryResultKeys.hasMoreRecords);
    };

    /**
     * Fires when the host adds, replaces or removes the description of the preloaded records,
     * and on base `schema` changes, the only event when the host replaces `tablesById` as a whole.
     *
     * @internal
     */
    _onPreloadedRecordsDataChanged = (): void => {
        this._cachedRecordIdsSet = null;
        this._onChange(WatchablePreloadedRecordsQueryResultKeys.hasMoreRecords);
        this._onChange(WatchableRecordQueryResultKeysCore.recordIds);
        this._onChange(WatchableRecordQueryResultKeysCore.records);
    };

    /**
     * Only wires up change forwarding: the records are already loaded, so this never asks the
     * host for data.
     *
     * @internal
     */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        this._cachedRecordIdsSet = null;
        this._watchRecordStore();
        const recordStore = this._table.parentBase.__getRecordStore(this._table.id);
        recordStore.watch('preloadedRecords', this._onPreloadedRecordsDataChanged, this);
        recordStore.watch(
            WatchableDynamicQueryKeyPrefix + this._queryKey,
            this._onPreloadedRecordOrderChanged,
            this,
        );
        this._table.parentBase.watch('schema', this._onPreloadedRecordsDataChanged, this);
        return [
            WatchableRecordQueryResultKeysCore.records,
            WatchableRecordQueryResultKeysCore.recordIds,
            WatchablePreloadedRecordsQueryResultKeys.hasMoreRecords,
        ];
    }

    /** @internal */
    _unloadData(): void {
        this._table.parentBase.unwatch('schema', this._onPreloadedRecordsDataChanged, this);
        const recordStore = this._table.parentBase.__getRecordStore(this._table.id);
        recordStore.unwatch('preloadedRecords', this._onPreloadedRecordsDataChanged, this);
        recordStore.unwatch(
            WatchableDynamicQueryKeyPrefix + this._queryKey,
            this._onPreloadedRecordOrderChanged,
            this,
        );
        this._unwatchRecordStore();
        this._proxyByRecordId.clear();
    }
}
