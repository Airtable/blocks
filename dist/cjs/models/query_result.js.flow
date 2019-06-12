// @flow
import invariant from 'invariant';
import Colors, {type Color} from '../colors';
import {type BaseData} from '../types/base';
import {type RecordId} from '../types/record';
import {FieldTypes} from '../types/field';
import {
    isEnumValue,
    assertEnumValue,
    spawnAbstractMethodError,
    spawnUnknownSwitchCaseError,
} from '../private_utils';
import getSdk from '../get_sdk';
import AbstractModelWithAsyncData from './abstract_model_with_async_data';
import type Table from './table';
import Field from './field';
import type Record from './record';
import type RecordStore from './record_store';
import {
    ModeTypes as RecordColorModeTypes,
    modes as recordColorModes,
    type RecordColorMode,
} from './record_coloring';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const WatchableQueryResultKeys = Object.freeze({
    records: ('records': 'records'),
    recordIds: ('recordIds': 'recordIds'),
    cellValues: ('cellValues': 'cellValues'),
    recordColors: ('recordColors': 'recordColors'),
    isDataLoaded: ('isDataLoaded': 'isDataLoaded'),
});
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';

// The string case is to accommodate cellValuesInField:$FieldId.
export type WatchableQueryResultKey = $Values<typeof WatchableQueryResultKeys> | string;

type SortConfig = {
    field: Field | string,
    direction?: 'asc' | 'desc',
};

export type QueryResultOpts = {
    sorts?: Array<SortConfig>,
    // Allow falsey values for convenience of including
    // fields conditionally. They'll be filtered out.
    fields?: Array<Field | string | void | null | false>,
    recordColorMode?: null | RecordColorMode,
};

export type NormalizedQueryResultOpts = {|
    sorts: Array<{fieldId: string, direction: 'asc' | 'desc'}> | null,
    fieldIdsOrNullIfAllFields: Array<string> | null,
    recordColorMode: RecordColorMode,
|};

/**
 * A QueryResult represents a set of records. It's a little bit like a one-off View in Airtable: it
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
 *   {@link https://support.airtable.com/hc/en-us/articles/206452848-Linked-record-fields linked record cell}.
 *   You can get one of these with `record.selectLinkedRecordsFromCell(someField)`.
 *
 * Once you've got a query result, you need to load it before you can start working with it. When
 * you're finished, unload it:
 * ```js
 * // query for all the records in "myTable"
 * const queryResult = myTable.selectRecords();
 *
 * // load the data in the query result:
 * await queryResult.loadDataAsync();
 *
 * // work with the data in the query result
 * doSomething(queryResult);
 *
 * // when you're done, unload the data:
 * queryResult.unloadData();
 * ```
 *
 * If you're using a query result in a React component, you don't need to worry about this. Just
 * use {@link useRecords}, {@link useRecordIds}, {@link useRecordById} or {@link useLoadable},
 * which will handle all that for you.
 *
 * Whilst loaded, a query result will automatically keep up to date with what's in Airtable:
 * records will get added or removed, the order will change, cell values will be updated, etc.
 * Again, if you're writing a React component then our hooks will look after that for you. If not,
 * you can get notified of these changes with `.watch()`.
 *
 * When calling a `.select*` method, you can pass in a number of options:
 *
 * ##### sorts
 * Pass an array of sorts to control the order of records within the query result. The first sort
 * in the array has the highest priority. If you don't specify sorts, the query result will use the
 * inherent order of the source model: the same order you'd see in the main UI for views and linked
 * record fields, and an arbitrary (but stable) order for tables.
 *
 * ```js
 * view.selectRecords({
 *     sorts: [
 *         // sort by someField in ascending order...
 *         {field: someField},
 *         // then by someOtherField in descending order
 *         {field: someOtherField, direction: 'desc'},
 *     ]
 * });
 * ```
 *
 * ##### fields
 * Generally, it's a good idea to load as little data into your block as possible - Airtable bases
 * can get pretty big, and we have to keep all that information in memory and up to date if you ask
 * for it. The fields option lets you make sure that only data relevant to you is loaded.
 *
 * You can specify fields with a {@link Field}, by ID, or by name:
 * ```js
 * view.selectRecords({
 *     fields: [
 *         // we want to only load fieldA:
 *         fieldA,
 *         // the field with this id:
 *         'fldXXXXXXXXXXXXXX',
 *         // and the field named 'Rating':
 *         'Rating',
 *     ],
 * });
 * 
 * ##### recordColorMode
 * Just like a view in Airtable, you can control the colors of records in a field. There are three
 * supported record color modes:
 * 
 * By taking the colors the records have according to the rules of a specific view:
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';

 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.byView(someView),
 * });
 * ```
 * 
 * Based on the color of a single select field in the table:
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 * 
 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.bySelectField(someSelectField),
 * });
 * ```
 * 
 * Or with no color at all (the default):
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 * 
 * someView.selectRecords({
 *     recordColorMode: recordColoring.modes.none(),
 * });
 * ```
 */
class QueryResult<DataType = {}> extends AbstractModelWithAsyncData<
    DataType,
    WatchableQueryResultKey,
> {
    // Abstract properties - classes extending QueryResult must override these:
    static _className = 'QueryResult';

    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get recordIds(): Array<RecordId> {
        throw spawnAbstractMethodError();
    }
    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     * @private
     */
    _getOrGenerateRecordIdsSet(): {[RecordId]: true | void} {
        throw spawnAbstractMethodError();
    }
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    get fields(): Array<Field> | null {
        throw spawnAbstractMethodError();
    }

    /**
     * The table that records in this QueryResult are part of
     */
    get parentTable(): Table {
        throw spawnAbstractMethodError();
    }

    // provided properties + methods:
    static WatchableKeys = WatchableQueryResultKeys;
    static WatchableCellValuesInFieldKeyPrefix = WatchableCellValuesInFieldKeyPrefix;
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableQueryResultKeys, key) ||
            key.startsWith(WatchableCellValuesInFieldKeyPrefix)
        );
    }
    static _shouldLoadDataForKey(key: WatchableQueryResultKey): boolean {
        return (
            key === QueryResult.WatchableKeys.records ||
            key === QueryResult.WatchableKeys.recordIds ||
            key === QueryResult.WatchableKeys.cellValues ||
            key === QueryResult.WatchableKeys.recordColors ||
            key.startsWith(QueryResult.WatchableCellValuesInFieldKeyPrefix)
        );
    }

    static _normalizeOpts(table: Table, opts: QueryResultOpts = {}): NormalizedQueryResultOpts {
        const sorts = !opts.sorts
            ? null
            : opts.sorts.map(sort => {
                  const field = table.__getFieldMatching(sort.field);
                  if (!field) {
                      throw new Error(
                          `No field found for sort: ${
                              sort.field ? sort.field.toString() : typeof sort.field
                          }`,
                      );
                  }
                  if (
                      sort.direction !== undefined &&
                      sort.direction !== 'asc' &&
                      sort.direction !== 'desc'
                  ) {
                      throw new Error(`Invalid sort direction: ${sort.direction}`);
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
                    // Filter out false-y values so users of this API
                    // can conveniently list conditional fields, e.g. [field1, isFoo && field2]
                    continue;
                }
                if (
                    typeof fieldOrFieldIdOrFieldName !== 'string' &&
                    !(fieldOrFieldIdOrFieldName instanceof Field)
                ) {
                    throw new Error(
                        `Invalid value for field, expected a field, id, or name but got: ${fieldOrFieldIdOrFieldName.toString()}`,
                    );
                }
                const field = table.__getFieldMatching(fieldOrFieldIdOrFieldName);
                if (!field) {
                    throw new Error(`No field found: ${fieldOrFieldIdOrFieldName.toString()}`);
                }
                fieldIdsOrNullIfAllFields.push(field.id);
            }
        }

        const recordColorMode = opts.recordColorMode || recordColorModes.none();
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                break;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                invariant(
                    recordColorMode.selectField.type === FieldTypes.SINGLE_SELECT,
                    `Invalid field for coloring records by select field: expected a ${
                        FieldTypes.SINGLE_SELECT
                    }, but got a ${recordColorMode.selectField.type}`,
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
                throw new Error(`Unknown record coloring mode: ${(recordColorMode.type: empty)}`);
        }

        return {
            sorts,
            fieldIdsOrNullIfAllFields,
            recordColorMode,
        };
    }

    _normalizedOpts: NormalizedQueryResultOpts;
    _recordStore: RecordStore;
    _recordColorChangeHandler: Function | null = null;

    /**
     * @hideconstructor
     * @private
     */
    constructor(
        recordStore: RecordStore,
        normalizedOpts: NormalizedQueryResultOpts,
        baseData: BaseData,
    ) {
        super(baseData, getSdk().models.generateGuid());
        this._normalizedOpts = normalizedOpts;
        this._recordStore = recordStore;
    }

    __canBeReusedForNormalizedOpts(normalizedOpts: NormalizedQueryResultOpts): boolean {
        return u.isEqual(this._normalizedOpts, normalizedOpts);
    }

    /**
     * The records in this QueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     *
     * @returns all of the records in this query result
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
     * @returns the record
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
     * @returns the record
     */
    getRecordById(recordId: RecordId): Record {
        const record = this.getRecordByIdIfExists(recordId);
        if (!record) {
            throw new Error(`No record with ID ${recordId} in this query result`);
        }
        return record;
    }

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
     * @returns whether the record exists in this query result
     */
    hasRecord(recordOrRecordId: RecordId | Record): boolean {
        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
        return this._getOrGenerateRecordIdsSet()[recordId] === true;
    }

    /**
     * Get the color of a specific record in the query result. Throws if the record isn't in the
     * QueryResult. Watch with the `'recordColors'` and `'recordIds` keys.
     *
     * @param recordOrRecordId the record or record ID you want the color of.
     * @returns a {@link Color}, or null if the record has no color in this query result.
     */
    getRecordColor(recordOrRecordId: RecordId | Record): Color | null {
        const record = this._getRecord(recordOrRecordId);
        const recordColorMode = this._normalizedOpts.recordColorMode;

        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return null;
            case RecordColorModeTypes.BY_SELECT_FIELD: {
                if (recordColorMode.selectField.type !== FieldTypes.SINGLE_SELECT) {
                    return null;
                }
                const value = record.getCellValue(recordColorMode.selectField);
                return value && typeof value === 'object' && typeof value.color === 'string'
                    ? assertEnumValue(Colors, value.color)
                    : null;
            }
            case RecordColorModeTypes.BY_VIEW:
                return this._recordStore
                    .getViewDataStore(recordColorMode.view.id)
                    .getRecordColor(record);
            default:
                throw new Error(`Unknown record coloring mode: ${(recordColorMode.type: empty)}`);
        }
    }

    _onChangeIsDataLoaded() {
        this._onChange(WatchableQueryResultKeys.isDataLoaded);
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
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */
    watch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        const validKeys = super.watch(keys, callback, context);
        for (const key of validKeys) {
            if (key === WatchableQueryResultKeys.recordColors) {
                this._watchRecordColorsIfNeeded();
            }
        }
        return validKeys;
    }

    /**
     * Unwatch keys watched with `.watch`.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */
    unwatch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        const validKeys = super.unwatch(keys, callback, context);
        for (const key of validKeys) {
            if (key === WatchableQueryResultKeys.recordColors) {
                this._unwatchRecordColorsIfPossible();
            }
        }
        return validKeys;
    }

    _watchRecordColorsIfNeeded() {
        const watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || [])
            .length;
        if (!this._recordColorChangeHandler && watchCount >= 1) {
            this._watchRecordColors();
        }
    }

    _watchRecordColors() {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        const handler = (model, key, recordIds) => {
            if (model === this) {
                this._onChange(WatchableQueryResultKeys.recordColors, recordIds);
            } else {
                this._onChange(WatchableQueryResultKeys.recordColors);
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
                throw new Error(`unknown record coloring type ${(recordColorMode.type: empty)}`);
        }

        this._recordColorChangeHandler = handler;
    }

    _unwatchRecordColorsIfPossible() {
        const watchCount = (this._changeWatchersByKey[WatchableQueryResultKeys.recordColors] || [])
            .length;
        if (this._recordColorChangeHandler && watchCount === 0) {
            this._unwatchRecordColors();
        }
    }

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
                throw new Error(`unknown record coloring type ${(recordColorMode.type: empty)}`);
        }

        this._recordColorChangeHandler = null;
    }

    async _loadRecordColorsAsync(): Promise<void> {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                // The select field id gets added to fieldIdsOrNullIfAllFields,
                // so we don't need to handle it here
                return;
            case RecordColorModeTypes.BY_VIEW:
                await this._recordStore.getViewDataStore(recordColorMode.view.id).loadDataAsync();
                return;
            default:
                throw spawnUnknownSwitchCaseError(
                    'record color mode type',
                    (recordColorMode.type: empty),
                );
        }
    }

    _unloadRecordColors() {
        const recordColorMode = this._normalizedOpts.recordColorMode;
        switch (recordColorMode.type) {
            case RecordColorModeTypes.NONE:
                return;
            case RecordColorModeTypes.BY_SELECT_FIELD:
                // handled as part of fieldIdsOrNullIfAllFields
                return;
            case RecordColorModeTypes.BY_VIEW:
                this._recordStore.getViewDataStore(recordColorMode.view.id).unloadData();
                break;
            default:
                throw spawnUnknownSwitchCaseError(
                    'record color mode type',
                    (recordColorMode.type: empty),
                );
        }
    }
}

export default QueryResult;
