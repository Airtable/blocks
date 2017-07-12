// @flow
const _ = require('client_server_shared/lodash.custom');
const invariant = require('invariant');
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');
const Field = require('client/blocks/sdk/models/field');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const cellValueUtils = require('client/blocks/sdk/models/cell_value_utils');

import type {BaseDataForBlocks, RecordDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type TableType from 'client/blocks/sdk/models/table';

const WatchableRecordKeys = {
    primaryCellValue: 'primaryCellValue',
    commentCount: 'commentCount',
    // TODO(kasra): these keys don't have matching getters (not that they should
    // it's just inconsistent...)
    cellValues: 'cellValues',
};
const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:';
// The string case is to accomodate cellValueInField:$FieldId.
type WatchableRecordKey = $Keys<typeof WatchableRecordKeys> | string;

class Record extends AbstractModel<RecordDataForBlocks, WatchableRecordKey> {
    static _className = 'Record';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableRecordKeys, key) ||
            utils.startsWith(key, WatchableCellValueInFieldKeyPrefix);
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
    get parentTable(): TableType {
        return this._parentTable;
    }
    __getRawCellValue(fieldId: string): mixed {
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
    getCellValue(fieldOrFieldIdOrFieldName: Field | string): mixed {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        invariant(field.parentTable.id === this.parentTable.id, 'Field must have same parent table as record');
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
    getCellValueAsString(fieldOrFieldIdOrFieldName: Field | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
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
    get primaryCellValue(): mixed {
        return this.getCellValue(this.parentTable.primaryField);
    }
    get primaryCellValueAsString(): string {
        return this.getCellValueAsString(this.parentTable.primaryField);
    }
    setCellValue(fieldOrFieldIdOrFieldName: Field | string, publicCellValue: mixed) {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');

        this.setCellValues({
            [field.id]: publicCellValue,
        });
    }
    setCellValues(cellValuesByFieldIdOrFieldName: {[key: string]: mixed}) {
        this.parentTable.setCellValues({
            [this.id]: cellValuesByFieldIdOrFieldName,
        });
    }
    delete() {
        this.parentTable.deleteRecord(this);
    }
    get commentCount(): number {
        return this._data.commentCount;
    }
    get createdTime(): Date {
        return new Date(this._data.createdTime);
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        const {cellValuesByFieldId, commentCount} = dirtyPaths;

        if (cellValuesByFieldId && _.size(cellValuesByFieldId) > 0) {
            this._onChange(WatchableRecordKeys.cellValues, Object.keys(cellValuesByFieldId));

            if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
                this._onChange(WatchableRecordKeys.primaryCellValue);
            }

            for (const fieldId of utils.iterateKeys(cellValuesByFieldId)) {
                this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
            }
        }

        if (commentCount) {
            this._onChange(WatchableRecordKeys.commentCount);
        }
    }
}

module.exports = Record;
