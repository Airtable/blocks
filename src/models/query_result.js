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
import type TableModel from './table';
import FieldModel from './field';
import type RecordModel from './record';
import {
    ModeTypes as RecordColorModeTypes,
    modes as recordColorModes,
    type RecordColorMode,
} from './record_coloring';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const WatchableQueryResultKeys = {
    records: 'records',
    recordIds: 'recordIds',
    cellValues: 'cellValues',
    recordColors: 'recordColors',
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';

// The string case is to accommodate cellValuesInField:$FieldId.
export type WatchableQueryResultKey = $Keys<typeof WatchableQueryResultKeys> | string;

type SortConfig = {
    field: FieldModel | string,
    direction?: 'asc' | 'desc',
};

export type QueryResultOpts = {
    sorts?: Array<SortConfig>,
    // Allow falsey values for convenience of including
    // fields conditionally. They'll be filtered out.
    fields?: Array<FieldModel | string | void | null | false>,
    recordColorMode?: null | RecordColorMode,
};

export type NormalizedQueryResultOpts = {|
    sorts: Array<{fieldId: string, direction: 'asc' | 'desc'}> | null,
    fieldIdsOrNullIfAllFields: Array<string> | null,
    recordColorMode: RecordColorMode,
|};

/** */
class QueryResult<DataType = {}> extends AbstractModelWithAsyncData<
    DataType,
    WatchableQueryResultKey,
> {
    // Abstract properties - classes extending QueryResult must override these:
    static _className = 'QueryResult';

    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     */
    get recordIds(): Array<RecordId> {
        throw spawnAbstractMethodError();
    }
    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     */
    _getOrGenerateRecordIdsSet(): {[RecordId]: true | void} {
        throw spawnAbstractMethodError();
    }
    /**
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    get fields(): Array<FieldModel> | null {
        throw spawnAbstractMethodError();
    }

    /**
     * The table that records in this QueryResult are part of
     */
    get parentTable(): TableModel {
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

    static _normalizeOpts(
        table: TableModel,
        opts: QueryResultOpts = {},
    ): NormalizedQueryResultOpts {
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
                    !(fieldOrFieldIdOrFieldName instanceof FieldModel)
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
    _recordColorChangeHandler: Function | null = null;

    constructor(normalizedOpts: NormalizedQueryResultOpts, baseData: BaseData) {
        super(baseData, getSdk().models.generateGuid());
        this._normalizedOpts = normalizedOpts;
    }

    __canBeReusedForNormalizedOpts(normalizedOpts: NormalizedQueryResultOpts): boolean {
        return u.isEqual(this._normalizedOpts, normalizedOpts);
    }

    /**
     * The records in this QueryResult.
     * Throws if data is not loaded yet.
     */
    get records(): Array<RecordModel> {
        return this.recordIds.map(recordId => {
            const record = this.parentTable.__getRecordByIdIfExists(recordId);
            invariant(record, 'Record missing in table');
            return record;
        });
    }

    getRecordByIdIfExists(recordId: RecordId): RecordModel | null {
        const record = this.parentTable.__getRecordByIdIfExists(recordId);
        if (!record || !this.hasRecord(record)) {
            return null;
        }

        return record;
    }

    _getRecord(recordOrRecordId: RecordId | RecordModel): RecordModel {
        const record = this.getRecordByIdIfExists(
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id,
        );
        invariant(record, 'record must exist');
        return record;
    }

    hasRecord(recordOrRecordId: RecordId | RecordModel): boolean {
        const recordId =
            typeof recordOrRecordId === 'string' ? recordOrRecordId : recordOrRecordId.id;
        return this._getOrGenerateRecordIdsSet()[recordId] === true;
    }

    getRecordColor(recordOrRecordId: RecordId | RecordModel): Color | null {
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
                return recordColorMode.view.__getRecordColor(record);
            default:
                throw new Error(`Unknown record coloring mode: ${(recordColorMode.type: empty)}`);
        }
    }

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
                recordColorMode.view.watch('__recordColors', handler);
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
                recordColorMode.view.unwatch('__recordColors', handler);
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
                await recordColorMode.view.loadDataAsync();
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
                recordColorMode.view.unloadData();
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
