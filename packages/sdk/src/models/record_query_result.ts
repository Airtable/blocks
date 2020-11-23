/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import Colors, {Color} from '../colors';
import {BaseData} from '../types/base';
import {RecordId} from '../types/record';
import {FieldType, FieldId} from '../types/field';
import {
    isEnumValue,
    assertEnumValue,
    getLocallyUniqueId,
    ObjectValues,
    ObjectMap,
    cast,
    FlowAnyFunction,
    FlowAnyObject,
} from '../private_utils';
import {spawnUnknownSwitchCaseError, spawnError, invariant} from '../error_utils';
import Watchable from '../watchable';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import Table from './table';
import Field from './field';
import Record from './record';
import RecordStore from './record_store';
import {
    ModeTypes as RecordColorModeTypes,
    modes as recordColorModes,
    serialize as serializeColorMode,
    RecordColorMode,
} from './record_coloring';

const WatchableRecordQueryResultKeys = Object.freeze({
    records: 'records' as const,
    recordIds: 'recordIds' as const,
    cellValues: 'cellValues' as const,
    recordColors: 'recordColors' as const,
    isDataLoaded: 'isDataLoaded' as const,
});
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';

/**
 * A key in {@link RecordQueryResult} that can be watched
 * - `records`
 * - `recordIds`
 * - `cellValues`
 * - `recordColors`
 * - `isDataLoaded`
 * - `cellValuesInField:{FIELD_ID}`
 */
export type WatchableRecordQueryResultKey =
    | ObjectValues<typeof WatchableRecordQueryResultKeys>
    | string;

/** */
interface SortConfig {
    /** A field, field id, or field name. */
    field: Field | FieldId | string;
    /** The order to sort in. Defaults to asc. */
    direction?: 'asc' | 'desc';
}

/** @hidden */
export interface NormalizedSortConfig {
    fieldId: string;
    direction: 'asc' | 'desc';
}

/**
 * Used to control what data is loaded in a {@link RecordQueryResult}. Used when creating a
 * query result using `table/view.selectRecords()` and in convenience hooks {@link useRecords}.
 *
 * ## sorts
 * Pass an array of sorts to control the order of records. The first sort in the array has the
 * highest priority. If you don't specify sorts, the result will use the inherent order of the
 * source model: the same order you'd see in the main UI for views and linked record fields, and
 * an arbitrary (but stable) order for tables.
 *
 * Record creation time is used as a tiebreaker: pass an empty array to sort by creation time.
 *
 * ```js
 * const opts = {
 *     sorts: [
 *         // sort by someField in ascending order...
 *         {field: someField},
 *         // then by someOtherField in descending order
 *         {field: someOtherField, direction: 'desc'},
 *     ]
 * };
 * const records = useRecords(table, opts);
 * const queryResult = table.selectRecords(opts);
 * ```
 *
 * ## fields
 * Generally, it's a good idea to load as little data into your app as possible - Airtable bases
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
 * const records = useRecords(table, opts);
 * const queryResult = table.selectRecords(opts);
 * ```
 *
 * ## recordColorMode
 * Just like a view in Airtable, you can control the colors of records in a field. There are three
 * supported record color modes: none, by a view, and by a select field.
 *
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 * // No record coloring:
 * const opts = {
 *     recordColorMode: recordColoring.modes.none(),
 * };
 *
 * // Color according to the rules of a view:
 * const opts = {
 *     recordColorMode: recordColoring.modes.byView(someView),
 * };
 *
 * // Color by a single select field:
 * const opts = {
 *     recordColorMode: recordColoring.modes.bySelectField(someSelectField),
 * });
 * ```
 *
 * You can access view coloring information directly from a {@link RecordQueryResult} or a
 * {@link Record}, but you can only directly access single select coloring from a RecordQueryResult:
 *
 * ```
 * const queryResult = table.selectRecords(opts);
 * const records = useRecords(table, opts);
 *
 * // Returns based on opts coloring mode
 * queryResult.getRecordColor(recordId);
 *
 * // Returns based on view
 * // Will throw if you did not pass recordColoring.modes.byView(view) in opts
 * records[0].getColorInView(view);
 * ```
 *
 * Use `record.getCellValue(singleSelectField).color` to access the color of a single select field
 * for a record.
 *
 * By default, views will have whichever coloring is set up in Airtable and tables won't have any
 * record coloring:
 *
 * ```js
 * // these two are the same:
 * someView.selectRecords();
 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.byView(someView),
 * });
 *
 * // as are these two:
 * someTable.selectRecords();
 * someTable.selectRecords({
 *     recordColorMode: recordColoring.modes.none(),
 * });
 * ```
 *
 * */
export interface RecordQueryResultOpts {
    /** The order in which to sort the query result */
    sorts?: Array<SortConfig>;
    /** The fields (or field names or field ids) to load. Falsey values will be removed. */
    fields?: Array<Field | FieldId | string | void | null | false>;
    /** How records in this QueryResult should be colored. */
    recordColorMode?: null | RecordColorMode;
}

/**
 * A subset of {@link RecordQueryResultOpts} used in {@link useRecordById} that omits sorts, as
 * there is only a single record.
 *
 * See RecordQueryResultOpts for full details and examples.
 *
 * ```js
 * const opts = {
 *     fields: ['My field'],
 *     recordColorMode: recordColoring.modes.byView(view),
 * };
 * const record = useRecordById(table, recordId, opts);
 * */
export type SingleRecordQueryResultOpts = Pick<RecordQueryResultOpts, 'fields' | 'recordColorMode'>;

/**
 * A subset of {@link RecordQueryResultOpts} used in {@link useRecordIds} that omits fields and
 * recordColorMode, as record cell values and color are not accessible via this hook.
 *
 * See RecordQueryResultOpts for full details and examples.
 *
 * ```js
 * const opts = {
 *     sorts: [
 *         // sort by someField in ascending order...
 *         {field: someField},
 *         // then by someOtherField in descending order
 *         {field: someOtherField, direction: 'desc'},
 *     ]
 * };
 * const recordIds = useRecordIds(table, opts);
 * */
export type RecordIdQueryResultOpts = Pick<RecordQueryResultOpts, 'sorts'>;

/** @internal */
export interface NormalizedRecordQueryResultOpts {
    sorts: Array<NormalizedSortConfig> | null;
    fieldIdsOrNullIfAllFields: Array<string> | null;
    recordColorMode: RecordColorMode;
    table: Table;
    recordStore: RecordStore;
}

/** @internal */
interface UnknownColorMode {
    type: never;
}

/**
 * A RecordQueryResult represents a set of records. It's a little bit like a one-off View in Airtable: it
 * contains a bunch of records, filtered to a useful subset of the records in the table. Those
 * records can be sorted according to your specification, and they can be colored by a select field
 * or using the color from a view. Just like a view, you can either have all the fields in a table
 * available, or you can just ask for the fields that are relevant to you. There are two types of
 * QueryResult:
 *
 * - {@link TableOrViewQueryResult} is the most common, and is a query result filtered to all the
 *   records in a specific {@link Table} or {@link View}. You can get one of these with
 *   `table.selectRecords()` or `view.selectRecords()`.
 * - {@link LinkedRecordsQueryResult} is a query result of all the records in a particular
 *   [linked record cell](https://support.airtable.com/hc/en-us/articles/206452848-Linked-record-fields).
 *   You can get one of these with `record.selectLinkedRecordsFromCell(someField)`.
 *
 * Once you've got a query result, you need to load it before you can start working with it -
 * apps don't load record data by default. We recommend using {@link useRecords},
 * {@link useRecordIds}, {@link useRecordById} or {@link useLoadable} to handle this.
 *
 * If you're not using a query result in a React component, you can manually load the data and
 * unload it when you're finished:
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
 * Whilst loaded, a query result will automatically keep up to date with what's in Airtable:
 * records will get added or removed, the order will change, cell values will be updated, etc.
 * Again, if you're writing a React component then our hooks will look after that for you. If not,
 * you can get notified of these changes with `.watch()`.
 *
 * When calling a `.select*` method, you can pass in a number of options to control the sort order,
 * fields loaded and coloring mode of records: see {@link RecordQueryResultOpts} for examples.
 *
 * @docsPath models/query results/RecordQueryResult
 */
abstract class RecordQueryResult<DataType = {}> extends AbstractModelWithAsyncData<
    DataType,
    WatchableRecordQueryResultKey
> {
    /** @internal */
    static _className = 'RecordQueryResult';

    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    abstract get recordIds(): Array<RecordId>;
    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     *
     * @internal
     */
    abstract _getOrGenerateRecordIdsSet(): ObjectMap<RecordId, true | void>;
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    abstract get fields(): Array<Field> | null;

    /**
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this QueryResult are part of
     */
    abstract get parentTable(): Table;

    /** @internal */
    static WatchableKeys = WatchableRecordQueryResultKeys;
    /** @internal */
    static WatchableCellValuesInFieldKeyPrefix = WatchableCellValuesInFieldKeyPrefix;
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordQueryResultKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }
    /** @internal */
    static _shouldLoadDataForKey(key: WatchableRecordQueryResultKey): boolean {
        return (
            key === RecordQueryResult.WatchableKeys.records ||
            key === RecordQueryResult.WatchableKeys.recordIds ||
            key === RecordQueryResult.WatchableKeys.cellValues ||
            key === RecordQueryResult.WatchableKeys.recordColors ||
            key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)
        );
    }

    /** @internal */
    static _normalizeOpts(
        table: Table,
        recordStore: RecordStore,
        opts: RecordQueryResultOpts,
    ): NormalizedRecordQueryResultOpts {
        const sorts = !opts.sorts
            ? null
            : opts.sorts.map(sort => {
                  const field = table.__getFieldMatching(sort.field);
                  if (
                      sort.direction !== undefined &&
                      sort.direction !== 'asc' &&
                      sort.direction !== 'desc'
                  ) {
                      throw spawnError('Invalid sort direction: %s', sort.direction);
                  }
                  return {
                      fieldId: field.id,
                      direction: sort.direction || 'asc',
                  };
              });

        let fieldIdsOrNullIfAllFields = null;
        if (opts.fields) {
            invariant(Array.isArray(opts.fields), 'Must specify an array of fields');
            fieldIdsOrNullIfAllFields = [];
            for (const fieldOrFieldIdOrFieldName of opts.fields) {
                if (!fieldOrFieldIdOrFieldName) {
                    continue;
                }
                if (
                    typeof fieldOrFieldIdOrFieldName !== 'string' &&
                    !(fieldOrFieldIdOrFieldName instanceof Field)
                ) {
                    throw spawnError(
                        'Invalid value for field, expected a field, id, or name but got: %s',
                        fieldOrFieldIdOrFieldName,
                    );
                }
                const field = table.__getFieldMatching(fieldOrFieldIdOrFieldName);
                fieldIdsOrNullIfAllFields.push(field.id);
            }
        }

        const recordColorMode = opts.recordColorMode || recordColorModes.none();
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                break;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                invariant(
                    recordColorMode.selectField.type === FieldType.SINGLE_SELECT,
                    'Invalid field for coloring records by select field: expected a %s, but got a %s',
                    FieldType.SINGLE_SELECT,
                    recordColorMode.selectField.type,
                );

                invariant(
                    recordColorMode.selectField.parentTable === table,
                    'Invalid field for coloring records by select field: the single select field is not in the same table as the records',
                );

                if (fieldIdsOrNullIfAllFields) {
                    fieldIdsOrNullIfAllFields.push(recordColorMode.selectField.id);
                }
                break;
            case RecordColorModeTypes.BY_VIEW:
                invariant(
                    recordColorMode.view.parentTable === table,
                    'Invalid view for coloring records from view: the view is not in the same table as the records',
                );

                break;
            default:
                throw spawnError(
                    'Unknown record coloring mode type: %s',
                    cast<UnknownColorMode>(recordColorMode).type,
                );
        }

        invariant(table.id === recordStore.tableId, 'record store and table must match');

        return {
            sorts,
            fieldIdsOrNullIfAllFields,
            recordColorMode,
            table,
            recordStore,
        };
    }

    /** @internal */
    _normalizedOpts: NormalizedRecordQueryResultOpts;
    /** @internal */
    _recordStore: RecordStore;
    /** @internal */
    _recordColorChangeHandler: FlowAnyFunction | null = null;

    /**
     * @internal
     */
    constructor(normalizedOpts: NormalizedRecordQueryResultOpts, baseData: BaseData) {
        super(baseData, getLocallyUniqueId('RecordQueryResult'));
        this._normalizedOpts = normalizedOpts;
        this._recordStore = normalizedOpts.recordStore;
    }

    /**
     * @internal
     */
    get _serializedOpts() {
        return JSON.stringify([
            this._normalizedOpts.sorts,
            this._normalizedOpts.fieldIdsOrNullIfAllFields,
            this._normalizedOpts.table.id,
            serializeColorMode(this._normalizedOpts.recordColorMode),
        ]);
    }

    /**
     * The records in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get records(): Array<Record> {
        return this.recordIds.map(recordId => {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
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
        const record = this._recordStore.getRecordByIdIfExists(recordId);
        if (!record || !this.hasRecord(record)) {
            return null;
        }

        return record;
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
     * @internal
     */
    _getRecord(recordOrRecordId: RecordId | Record): Record {
        return this.getRecordById(
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id,
        );
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
        return this._getOrGenerateRecordIdsSet()[recordId] === true;
    }

    /**
     * Get the {@link Color} of a specific record in the query result. Returns null if the record
     * has no color in this query result. Throws if the record isn't in the RecordQueryResult. Watch
     * with the `'recordColors'` and `'recordIds` keys.
     *
     * @param recordOrRecordId the record or record ID you want the color of.
     */
    getRecordColor(recordOrRecordId: RecordId | Record): Color | null {
        const record = this._getRecord(recordOrRecordId);
        const recordColorMode = this._normalizedOpts.recordColorMode;

        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return null;
            case RecordColorModeTypes.BY_SELECT_FIELD: {
                if (recordColorMode.selectField.type !== FieldType.SINGLE_SELECT) {
                    return null;
                }
                const value = record.getCellValue(recordColorMode.selectField);
                return value &&
                    typeof value === 'object' &&
                    typeof (value as any).color === 'string'
                    ? assertEnumValue(Colors, (value as any).color)
                    : null;
            }
            case RecordColorModeTypes.BY_VIEW:
                return this._recordStore
                    .getViewDataStore(recordColorMode.view.id)
                    .getRecordColor(record);
            default:
                throw spawnError(
                    'Unknown record coloring mode type: %s',
                    cast<UnknownColorMode>(recordColorMode).type,
                );
        }
    }

    /**
     * @internal
     */
    _onChangeIsDataLoaded() {
        this._onChange(WatchableRecordQueryResultKeys.isDataLoaded);
    }

    /**
     * Get notified of changes to the query result.
     *
     * Watchable keys are:
     * - `'records'`
     * - `'recordIds'`
     * - `'cellValues'`
     * - `'recordColors'`
     * - `'isDataLoaded'`
     * - `'cellValuesInField:' + someFieldId`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * Watching a key that needs to load data asynchronously will automatically
     * cause the data to be fetched. Once the data is available, the `callback`
     * will be called.
     *
     * Returns the array of keys that were watched.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param context an optional context for `this` in `callback`.
     */
    watch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (key === WatchableRecordQueryResultKeys.recordColors) {
                this._watchRecordColorsIfNeeded();
            }
        }
        return validKeys;
    }

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * Unwatching a key that needs to load data asynchronously will automatically
     * cause the data to be unloaded.
     *
     * Returns the array of keys that were unwatched
     *
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param context the context that was passed to `.watch` for this `callback`
     */
    unwatch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const validKeys = super.unwatch(keys, callback, context);
        for (const key of validKeys) {
            if (key === WatchableRecordQueryResultKeys.recordColors) {
                this._unwatchRecordColorsIfPossible();
            }
        }
        return validKeys;
    }

    /**
     * @internal
     */
    _watchRecordColorsIfNeeded() {
        invariant(
            this._changeWatchersByKey[WatchableRecordQueryResultKeys.recordColors],
            'method may only be called when `recordColors` key has been watched',
        );
        const watchCount = this._changeWatchersByKey[WatchableRecordQueryResultKeys.recordColors]
            .length;
        if (!this._recordColorChangeHandler && watchCount >= 1) {
            this._watchRecordColors();
        }
    }

    /**
     * @internal
     */
    _watchRecordColors() {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        const handler = (model: Watchable<any>, key: string, recordIds?: Array<RecordId>) => {
            if (model === this) {
                this._onChange(WatchableRecordQueryResultKeys.recordColors, recordIds);
            } else {
                this._onChange(WatchableRecordQueryResultKeys.recordColors);
            }
        };

        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                break;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                this.watch(
                    `${WatchableCellValuesInFieldKeyPrefix}${recordColorMode.selectField.id}`,
                    handler,
                );
                recordColorMode.selectField.watch('options', handler);
                break;
            case RecordColorModeTypes.BY_VIEW: {
                this._recordStore
                    .getViewDataStore(recordColorMode.view.id)
                    .watch('recordColors', handler);
                break;
            }
            default:
                throw spawnError(
                    'Unknown record coloring mode type: %s',
                    cast<UnknownColorMode>(recordColorMode).type,
                );
        }

        this._recordColorChangeHandler = handler;
    }

    /**
     * @internal
     */
    _unwatchRecordColorsIfPossible() {
        const watchCount = (
            this._changeWatchersByKey[WatchableRecordQueryResultKeys.recordColors] || []
        ).length;
        if (this._recordColorChangeHandler && watchCount === 0) {
            this._unwatchRecordColors();
        }
    }

    /**
     * @internal
     */
    _unwatchRecordColors() {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        const handler = this._recordColorChangeHandler;
        invariant(handler, 'record color change handler must exist');

        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                break;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                this.unwatch(
                    `${WatchableCellValuesInFieldKeyPrefix}${recordColorMode.selectField.id}`,
                    handler,
                );
                recordColorMode.selectField.unwatch('options', handler);
                break;
            case RecordColorModeTypes.BY_VIEW: {
                this._recordStore
                    .getViewDataStore(recordColorMode.view.id)
                    .unwatch('recordColors', handler);
                break;
            }
            default:
                throw spawnError(
                    'Unknown record coloring mode type: %s',
                    cast<UnknownColorMode>(recordColorMode).type,
                );
        }

        this._recordColorChangeHandler = null;
    }

    /**
     * @internal
     */
    async _loadRecordColorsAsync(): Promise<void> {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                return;
            case RecordColorModeTypes.BY_VIEW:
                await this._recordStore.getViewDataStore(recordColorMode.view.id).loadDataAsync();
                return;
            default:
                throw spawnUnknownSwitchCaseError(
                    'record color mode type',
                    recordColorMode,
                    'type',
                );
        }
    }

    /**
     * @internal
     */
    _unloadRecordColors() {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                return;
            case RecordColorModeTypes.BY_VIEW:
                this._recordStore.getViewDataStore(recordColorMode.view.id).unloadData();
                break;
            default:
                throw spawnUnknownSwitchCaseError(
                    'record color mode type',
                    recordColorMode,
                    'type',
                );
        }
    }
}

export default RecordQueryResult;
