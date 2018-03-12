// @flow
const {h, u} = require('client_server_shared/hu');
const invariant = require('invariant');
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');
const Field = require('client/blocks/sdk/models/field');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const cellValueUtils = require('client/blocks/sdk/models/cell_value_utils');
const airtableUrls = require('client_server_shared/airtable_urls');
const Sorter = require('client_server_shared/filter_and_sort/sorter');

import type {BaseDataForBlocks, RecordDataForBlocks} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';

// A record def is a cellValuesByFieldId object.
export type RecordDef = {[string]: mixed};

const WatchableRecordKeys = {
    primaryCellValue: 'primaryCellValue',
    commentCount: 'commentCount',
    // TODO(kasra): these keys don't have matching getters (not that they should
    // it's just inconsistent...)
    cellValues: 'cellValues',
};
// TODO: load cell values in field when this is watched? This will
// cause the CellRenderer component to load cell values, which seems okay,
// but needs a little more thought.
const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:';
// The string case is to accomodate cellValueInField:$FieldId.
type WatchableRecordKey = $Keys<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. To create a new record, use `table.createRecord`.
 */
class Record extends AbstractModel<RecordDataForBlocks, WatchableRecordKey> {
    static _className = 'Record';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableRecordKeys, key) ||
            u.startsWith(key, WatchableCellValueInFieldKeyPrefix);
    }
    /**
     * Static helper to perform a one-time sort of array of records.
     *
     * If you want a sorted list of records that stays sorted as cell values
     * change, use QueryResult.
     */
    static sortRecords(records: Array<Record>, sortConfigs: Array<{field: string, direction?: 'asc' | 'desc'}>): Array<Record> {
        if (records.length === 0 || sortConfigs.length === 0) {
            return records;
        }
        const table = records[0].parentTable;
        const sorter = new Sorter({
            rowsArray: records.map(record => {
                return record.__getRawRow();
            }),
            columnsArray: table.fields.map(field => {
                return field.__getRawColumn();
            }),
            sorts: sortConfigs.map(sortConfig => {
                const field = table.__getFieldMatching(sortConfig.field);
                if (!field) {
                    throw new Error('Unknown field for sorting: ' + sortConfig.field);
                }
                return {
                    columnId: field.id,
                    ascending: sortConfig.direction === undefined || sortConfig.direction === 'asc',
                };
            }),
            appBlanket: table.parentBase.__appBlanket,
        });
        const sortedRecords = sorter.getSortedRowIds().map(recordId => table.getRecordById(recordId));
        return u.compact(sortedRecords);
    }
    _parentTable: TableType;
    constructor(baseData: BaseDataForBlocks, parentTable: TableType, recordId: string) {
        super(baseData, recordId);

        this._parentTable = parentTable;

        Object.freeze(this);
    }
    get _dataOrNullIfDeleted(): RecordDataForBlocks | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        const recordsById = tableData.recordsById;
        invariant(recordsById, 'Record data is not loaded');
        return recordsById[this._id] || null;
    }
    /** */
    get parentTable(): TableType {
        return this._parentTable;
    }
    __getRawRow(): {id: string, createdTime: string, cellValuesByColumnId?: RecordDef} {
        return {
            id: this.id,
            createdTime: this._data.createdTime,
            ...(this._data.cellValuesByFieldId ? {
                cellValuesByColumnId: this._data.cellValuesByFieldId,
            } : {}),
        };
    }
    __getRawCellValue(fieldId: string): mixed {
        invariant(this.parentTable.areCellValuesLoadedForFieldId(fieldId), 'Cell values for field are not loaded');
        const {cellValuesByFieldId} = this._data;
        if (!cellValuesByFieldId) {
            return null;
        }

        const rawCellValue = cellValuesByFieldId[fieldId];
        return rawCellValue;
    }
    _getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field | null {
        return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
    /** */
    getCellValue(fieldOrFieldIdOrFieldName: Field | string): mixed {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        invariant(field.parentTable.id === this.parentTable.id, 'Field must have same parent table as record');
        invariant(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');
        const rawCellValue = this.__getRawCellValue(field.id);

        const publicCellValue = cellValueUtils.getPublicCellValueFromPrivateCellValue(rawCellValue, field);

        if (typeof publicCellValue === 'object' && publicCellValue !== null) {
            // Copy non-primitives.
            // TODO(kasra): maybe freezeDeep instead?
            return utils.cloneDeep(publicCellValue);
        } else {
            return publicCellValue;
        }
    }
    /** */
    getCellValueAsString(fieldOrFieldIdOrFieldName: Field | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        invariant(field.parentTable.areCellValuesLoadedForFieldId(field.id), 'Cell values for field are not loaded');
        const rawCellValue = this.__getRawCellValue(field.id);

        if (rawCellValue === null || rawCellValue === undefined) {
            return '';
        } else {
            return columnTypeProvider.convertCellValueToString(
                rawCellValue,
                field.__getRawType(),
                field.__getRawTypeOptions(),
                this.parentTable.parentBase.__appBlanket,
            );
        }
    }
    /** Returns the URL for this record. */
    get url(): string {
        return airtableUrls.getUrlForRow(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    /** */
    get primaryCellValue(): mixed {
        return this.getCellValue(this.parentTable.primaryField);
    }
    /** */
    get primaryCellValueAsString(): string {
        return this.getCellValueAsString(this.parentTable.primaryField);
    }
    /**
     * Use this to check if the current user has permission to update a
     * specific cell value before calling `setCellValue`.
     */
    canSetCellValue(fieldOrFieldIdOrFieldName: Field | string, publicCellValue: mixed) {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');

        return this.canSetCellValues({
            [field.id]: publicCellValue,
        });
    }
    /**
     * Use `canSetCellValue` to check if the current user has permission to update a
     * specific cell value before calling. Will throw if the user does not have
     * permission.
     */
    setCellValue(fieldOrFieldIdOrFieldName: Field | string, publicCellValue: mixed) {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');

        this.setCellValues({
            [field.id]: publicCellValue,
        });
    }
    /**
     * Use this to check if the current user has permission to update a
     * set of cell values before calling `setCellValues`.
     */
    canSetCellValues(cellValuesByFieldIdOrFieldName: RecordDef): boolean {
        return this.parentTable.canSetCellValues({
            [this.id]: cellValuesByFieldIdOrFieldName,
        });
    }
    /**
     * Use `canSetCellValues` to check if the current user has permission to update
     * the cell values before calling. Will throw if the user does not have
     * permission.
     */
    setCellValues(cellValuesByFieldIdOrFieldName: RecordDef) {
        this.parentTable.setCellValues({
            [this.id]: cellValuesByFieldIdOrFieldName,
        });
    }
    /** */
    canDelete(): boolean {
        return this.parentTable.canDeleteRecord(this);
    }
    /** */
    delete() {
        this.parentTable.deleteRecord(this);
    }
    /** */
    get commentCount(): number {
        return this._data.commentCount;
    }
    /** */
    get createdTime(): Date {
        return new Date(this._data.createdTime);
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        const {cellValuesByFieldId, commentCount} = dirtyPaths;

        if (cellValuesByFieldId && u.size(cellValuesByFieldId) > 0) {
            // TODO: don't trigger changes for fields that aren't supposed to be loaded
            // (in some cases, e.g. record created, liveapp will send cell values
            // that we're not subscribed to).

            this._onChange(WatchableRecordKeys.cellValues, Object.keys(cellValuesByFieldId));

            if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
                this._onChange(WatchableRecordKeys.primaryCellValue);
            }

            for (const fieldId of u.keys(cellValuesByFieldId)) {
                this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
            }
        }

        if (commentCount) {
            this._onChange(WatchableRecordKeys.commentCount);
        }
    }
}

module.exports = Record;
