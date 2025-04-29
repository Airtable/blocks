import {SdkMode} from '../../sdk_mode';
import {cloneDeep, FlowAnyObject, isEnumValue, isObjectEmpty, ObjectValues} from '../private_utils';
import {invariant} from '../error_utils';
import {FieldId, RecordId} from '../types/hyper_ids';
import {FieldType} from '../types/field';
import AbstractModel from './abstract_model';
import {FieldCore} from './field_core';

export const WatchableRecordKeysCore = Object.freeze({
    name: 'name' as const,
    cellValues: 'cellValues' as const,
});

/** @hidden */
type WatchableRecordKeyCore = ObjectValues<typeof WatchableRecordKeysCore>;

/** @hidden */
export abstract class RecordCore<
    SdkModeT extends SdkMode,
    WatchableKeys extends string = WatchableRecordKeyCore
> extends AbstractModel<SdkModeT, SdkModeT['RecordDataT'], WatchableRecordKeyCore | WatchableKeys> {
    /** @internal */
    static _className = 'RecordCore';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableRecordKeysCore, key);
    }
    /** @internal */
    _parentRecordStore: SdkModeT['RecordStoreT'];
    /** @internal */
    _parentTable: SdkModeT['TableT'];

    /**
     * @internal
     */
    constructor(
        sdk: SdkModeT['SdkT'],
        parentRecordStore: SdkModeT['RecordStoreT'],
        parentTable: SdkModeT['TableT'],
        recordId: string,
    ) {
        super(sdk, recordId);

        this._parentRecordStore = parentRecordStore;
        this._parentTable = parentTable;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): SdkModeT['RecordDataT'] | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        const recordsById = tableData.recordsById;
        invariant(recordsById, 'Record data is not loaded');
        return recordsById[this._id] ?? null;
    }

    /**
     * The table that this record belongs to. Should never change because records aren't moved between tables.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @example
     * ```js
     * import {useRecords} from '@airtable/blocks/ui';
     * const records = useRecords(myTable);
     * console.log(records[0].parentTable.id === myTable.id);
     * // => true
     * ```
     */
    get parentTable(): SdkModeT['TableT'] {
        return this._parentTable;
    }
    /**
     * @internal
     */
    _getFieldMatching(fieldOrFieldIdOrFieldName: SdkModeT['FieldT'] | string): SdkModeT['FieldT'] {
        if (fieldOrFieldIdOrFieldName instanceof FieldCore) {
            return this._parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName.id);
        }
        return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }

    /**
     * @internal
     *
     * For use when we need the raw public API cell value. Specifically makes a difference
     * for lookup fields, where we translate the format to a blocks-specific format in getCellValue.
     * That format is incompatible with fieldTypeProvider methods, which expect the public API
     * format - use _getRawCellValue instead.
     */
    _getRawCellValue(field: SdkModeT['FieldT']): unknown {
        const {cellValuesByFieldId} = this._data;
        if (!cellValuesByFieldId) {
            return null;
        }
        const cellValue =
            cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

        if (typeof cellValue === 'object' && cellValue !== null) {
            return cloneDeep(cellValue);
        } else {
            return cellValue;
        }
    }
    /**
     * Gets the cell value of the given field for this record.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @example
     * ```js
     * const cellValue = myRecord.getCellValue(mySingleLineTextField);
     * console.log(cellValue);
     * // => 'cell value'
     * ```
     */
    getCellValue(fieldOrFieldIdOrFieldName: SdkModeT['FieldT'] | FieldId | string): unknown {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        const cellValue = this._getRawCellValue(field);

        if (
            typeof cellValue === 'object' &&
            cellValue !== null &&
            field.type === FieldType.MULTIPLE_LOOKUP_VALUES &&
            !this._sdk.__airtableInterface.sdkInitData.isUsingNewLookupCellValueFormat
        ) {
            const cellValueForMigration: Array<{linkedRecordId: RecordId; value: unknown}> = [];
            invariant(Array.isArray((cellValue as any).linkedRecordIds), 'linkedRecordIds');
            for (const linkedRecordId of (cellValue as any).linkedRecordIds) {
                invariant(typeof linkedRecordId === 'string', 'linkedRecordId');
                const {valuesByLinkedRecordId} = cellValue as any;

                invariant(
                    valuesByLinkedRecordId && typeof valuesByLinkedRecordId === 'object',
                    'valuesByLinkedRecordId',
                );

                const value = valuesByLinkedRecordId[linkedRecordId];
                if (Array.isArray(value)) {
                    for (const v of value) {
                        cellValueForMigration.push({linkedRecordId, value: v});
                    }
                } else {
                    cellValueForMigration.push({linkedRecordId, value});
                }
            }
            return cellValueForMigration;
        }

        return cellValue;
    }
    /**
     * Gets the cell value of the given field for this record, formatted as a `string`.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @example
     * ```js
     * const stringValue = myRecord.getCellValueAsString(myNumberField);
     * console.log(stringValue);
     * // => '42'
     * ```
     */
    getCellValueAsString(fieldOrFieldIdOrFieldName: SdkModeT['FieldT'] | FieldId | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);

        const cellValue = this._getRawCellValue(field);

        if (cellValue === null || cellValue === undefined) {
            return '';
        } else {
            const airtableInterface = this._sdk.__airtableInterface;
            const appInterface = this._sdk.__appInterface;
            return airtableInterface.fieldTypeProvider.convertCellValueToString(
                appInterface,
                cellValue,
                field._data,
            );
        }
    }
    /**
     * The primary cell value in this record, formatted as a `string`.
     *
     * @example
     * ```js
     * console.log(myRecord.name);
     * // => '42'
     * ```
     */
    get name(): string {
        return this.getCellValueAsString(this.parentTable.primaryField);
    }
    /**
     * The created time of this record.
     *
     * @example
     * ```js
     * console.log(`
     *     This record was created at ${myRecord.createdTime.toISOString()}
     * `);
     * ```
     */
    get createdTime(): Date {
        return new Date(this._data.createdTime);
    }
    /**
     * @internal
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject) {
        const {cellValuesByFieldId} = dirtyPaths;

        if (cellValuesByFieldId && !isObjectEmpty(cellValuesByFieldId)) {

            this._onChange(WatchableRecordKeysCore.cellValues, Object.keys(cellValuesByFieldId));

            if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
                this._onChange(WatchableRecordKeysCore.name);
            }
        }
    }
}
