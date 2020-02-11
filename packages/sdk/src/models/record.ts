/** @module @airtable/blocks/models: Record */ /** */
import getSdk from '../get_sdk';
import {Color} from '../colors';
import {BaseData} from '../types/base';
import {RecordData} from '../types/record';
import {FieldType, FieldId} from '../types/field';
import {ViewId} from '../types/view';
import {isEnumValue, cloneDeep, isObjectEmpty, ObjectValues, FlowAnyObject} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import colorUtils from '../color_utils';
import AbstractModel from './abstract_model';
import Field from './field';
import Table from './table';
import View from './view';
import {RecordQueryResultOpts} from './record_query_result';
import LinkedRecordsQueryResult from './linked_records_query_result';
import RecordStore from './record_store';

const WatchableRecordKeys = Object.freeze({
    primaryCellValue: 'primaryCellValue' as const,
    commentCount: 'commentCount' as const,
    cellValues: 'cellValues' as const,
});
const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:';
const WatchableColorInViewKeyPrefix = 'colorInView:';
/**
 * Any key within record that can be watched:
 * - `'primaryCellValue'`
 * - `'commentCount'`
 * - `'cellValues'`
 * - `'cellValueInField:' + someFieldId`
 * - `'colorInView:' + someViewId`
 */
type WatchableRecordKey = ObjectValues<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. You can get instances of this class by calling `table.selectRecords`
 * or `view.selectRecords` and using the resulting {@link RecordQueryResult}.
 *
 * @docsPath models/Record
 */
class Record extends AbstractModel<RecordData, WatchableRecordKey> {
    /** @hidden */
    static shouldUseNewLookupFormat = false;

    /** @internal */
    static _className = 'Record';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordKeys, key) ||
            key.startsWith(WatchableCellValueInFieldKeyPrefix) ||
            key.startsWith(WatchableColorInViewKeyPrefix)
        );
    }
    /** @internal */
    _parentRecordStore: RecordStore;
    /** @internal */
    _parentTable: Table;

    /**
     * @internal
     */
    constructor(
        baseData: BaseData,
        parentRecordStore: RecordStore,
        parentTable: Table,
        recordId: string,
    ) {
        super(baseData, recordId);

        this._parentRecordStore = parentRecordStore;
        this._parentTable = parentTable;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): RecordData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        const recordsById = tableData.recordsById;
        if (!recordsById) {
            throw spawnInvariantViolationError('Record data is not loaded');
        }
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
    get parentTable(): Table {
        return this._parentTable;
    }
    /**
     * @internal
     */
    _getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field {
        return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
    /**
     * @internal
     */
    _getViewMatching(viewOrViewIdOrViewName: View | string): View {
        return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
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
    getCellValue(fieldOrFieldIdOrFieldName: Field | FieldId | string): unknown {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        if (!this._parentRecordStore.areCellValuesLoadedForFieldId(field.id)) {
            throw spawnInvariantViolationError('Cell values for field %s are not loaded', field.id);
        }
        const {cellValuesByFieldId} = this._data;
        if (!cellValuesByFieldId) {
            return null;
        }
        const cellValue =
            cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

        if (typeof cellValue === 'object' && cellValue !== null) {
            if (
                !Record.shouldUseNewLookupFormat &&
                field.type === FieldType.MULTIPLE_LOOKUP_VALUES
            ) {
                const cellValueForMigration: any = [];
                cellValueForMigration.linkedRecordIds = cloneDeep(
                    (cellValue as any).linkedRecordIds,
                );
                cellValueForMigration.valuesByLinkedRecordId = cloneDeep(
                    (cellValue as any).valuesByLinkedRecordId,
                );
                if (!Array.isArray((cellValue as any).linkedRecordIds)) {
                    throw spawnInvariantViolationError('linkedRecordIds');
                }
                for (const linkedRecordId of (cellValue as any).linkedRecordIds) {
                    if (!(typeof linkedRecordId === 'string')) {
                        throw spawnInvariantViolationError('linkedRecordId');
                    }
                    const {valuesByLinkedRecordId} = cellValue as any;
                    if (!(valuesByLinkedRecordId && typeof valuesByLinkedRecordId === 'object')) {
                        throw spawnInvariantViolationError('valuesByLinkedRecordId');
                    }
                    const value = valuesByLinkedRecordId[linkedRecordId];
                    if (Array.isArray(value)) {
                        for (const v of value) {
                            cellValueForMigration.push(v);
                        }
                    } else {
                        cellValueForMigration.push(value);
                    }
                }
                return cellValueForMigration;
            }

            return cloneDeep(cellValue);
        } else {
            return cellValue;
        }
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
    getCellValueAsString(fieldOrFieldIdOrFieldName: Field | FieldId | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        if (!this._parentRecordStore.areCellValuesLoadedForFieldId(field.id)) {
            throw spawnInvariantViolationError('Cell values for field %s are not loaded', field.id);
        }
        const cellValue = this.getCellValue(field.id);

        if (cellValue === null || cellValue === undefined) {
            return '';
        } else {
            const airtableInterface = getSdk().__airtableInterface;
            const appInterface = getSdk().__appInterface;
            return airtableInterface.fieldTypeProvider.convertCellValueToString(
                appInterface,
                cellValue,
                field._data,
            );
        }
    }
    /**
     * Returns a URL that is suitable for rendering an attachment on the current client.
     * The URL that is returned will only work for the current user.
     *
     * @param attachmentId The ID of the attachment.
     * @param attachmentUrl The attachment's URL (which is not suitable for rendering on the client).
     * @example
     * ```js
     * import React from 'react';
     *
     * function RecordAttachments(props) {
     *     const {record, attachmentField} = props;
     *     const attachmentCellValue = record.getCellValue(attachmentField);
     *     if (attachmentCellValue === null) {
     *         return null;
     *     }
     *     return (
     *         <div>
     *             {attachmentCellValue.map(attachmentObj => {
     *                 const clientUrl =
     *                     record.getAttachmentClientUrlFromCellValueUrl(
     *                         attachmentObj.id,
     *                         attachmentObj.url
     *                     );
     *                 return (
     *                     <img key={attachmentObj.id} src={clientUrl} width={200} />
     *                 );
     *             })}
     *         </div>
     *     );
     * }
     * ```
     */
    getAttachmentClientUrlFromCellValueUrl(attachmentId: string, attachmentUrl: string): string {
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;
        return airtableInterface.urlConstructor.getAttachmentClientUrl(
            appInterface,
            attachmentId,
            attachmentUrl,
        );
    }
    /**
     * Gets the color of this record in a given view, or null if the record has no color in that
     * view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     */
    getColorInView(viewOrViewIdOrViewName: View | ViewId | string): Color | null {
        const view = this._getViewMatching(viewOrViewIdOrViewName);

        return this._parentRecordStore.getViewDataStore(view.id).getRecordColor(this);
    }
    /**
     * Gets the CSS hex string for this record in a given view, or null if the record has no color
     * in that view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     */
    getColorHexInView(viewOrViewIdOrViewName: View | string): string | null {
        const color = this.getColorInView(viewOrViewIdOrViewName);
        if (!color) {
            return null;
        }
        return colorUtils.getHexForColor(color);
    }
    /**
     * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result
     * containing the records in the given `multipleRecordLinks` field.
     * See {@link RecordQueryResult} for more.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param opts Options for the query, such as sorts and fields.
     */
    selectLinkedRecordsFromCell(
        fieldOrFieldIdOrFieldName: Field | FieldId | string,
        opts: RecordQueryResultOpts = {},
    ): LinkedRecordsQueryResult {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        return LinkedRecordsQueryResult.__createOrReuseQueryResult(this, field, opts);
    }
    /**
     * The URL for the record. You can visit this URL in the browser to be taken to the record in the Airtable UI.
     *
     * @example
     * ```js
     * console.log(myRecord.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx/recxxxxxxxxxxxxxx'
     * ```
     */
    get url(): string {
        return this.parentTable._airtableInterface.urlConstructor.getRecordUrl(
            this.id,
            this.parentTable.id,
        );
    }
    /**
     * The primary cell value in this record.
     *
     * @example
     * ```js
     * console.log(myRecord.primaryCellValue);
     * // => 'primary cell value'
     * ```
     */
    get primaryCellValue(): unknown {
        return this.getCellValue(this.parentTable.primaryField);
    }
    /**
     * The primary cell value in this record, formatted as a `string`.
     *
     * @example
     * ```js
     * console.log(myRecord.primaryCellValueAsString);
     * // => '42'
     * ```
     */
    get primaryCellValueAsString(): string {
        return this.getCellValueAsString(this.parentTable.primaryField);
    }
    /**
     * The number of comments on this record.
     *
     * @example
     * ```js
     * const commentCount = myRecord.commentCount;
     * const isSingular = commentCount === 1;
     * console.log(
     *     `This record has ${commentCount} comment${isSingular ? '' : 's'}`
     * );
     * ```
     */
    get commentCount(): number {
        return this._data.commentCount;
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
        const {cellValuesByFieldId, commentCount} = dirtyPaths;

        if (cellValuesByFieldId && !isObjectEmpty(cellValuesByFieldId)) {

            this._onChange(WatchableRecordKeys.cellValues, Object.keys(cellValuesByFieldId));

            if (cellValuesByFieldId[this.parentTable.primaryField.id]) {
                this._onChange(WatchableRecordKeys.primaryCellValue);
            }

            for (const fieldId of Object.keys(cellValuesByFieldId)) {
                this._onChange(WatchableCellValueInFieldKeyPrefix + fieldId, fieldId);
            }
        }

        if (commentCount) {
            this._onChange(WatchableRecordKeys.commentCount);
        }
    }
    /**
     * @internal
     */
    __triggerOnChangeForRecordColorInViewId(viewId: string) {
        this._onChange(WatchableColorInViewKeyPrefix + viewId);
    }
}

export default Record;
