// @flow
import getSdk from '../get_sdk';
import {type Color} from '../colors';
import {type BaseData} from '../types/base';
import {type RecordData, type RecordDef} from '../types/record';
import {FieldTypes, type FieldId} from '../types/field';
import {type ViewId} from '../types/view';
import {isEnumValue, cloneDeep, entries} from '../private_utils';
import {invariant} from '../error_utils';
import colorUtils from '../color_utils';
import AbstractModel from './abstract_model';
import Field from './field';
import cellValueUtils from './cell_value_utils';
import type Table from './table';
import View from './view';
import {type RecordQueryResultOpts} from './record_query_result';
import LinkedRecordsQueryResult from './linked_records_query_result';
import RecordStore from './record_store';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const airtableUrls = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/airtable_urls',
);
const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);
const ATTACHMENTS_V3_CDN_BASE_URL = clientServerSharedConfigSettings.ATTACHMENTS_V3_CDN_BASE_URL;

const WatchableRecordKeys = Object.freeze({
    primaryCellValue: ('primaryCellValue': 'primaryCellValue'),
    commentCount: ('commentCount': 'commentCount'),
    cellValues: ('cellValues': 'cellValues'),
});
const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:';
const WatchableColorInViewKeyPrefix = 'colorInView:';
type WatchableRecordKey = $Values<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. You can get instances of this class by calling `table.selectRecords`
 * or `view.selectRecords` and using the resulting {@RecordQueryResult}.
 */
class Record extends AbstractModel<RecordData, WatchableRecordKey> {
    static shouldUseNewLookupFormat = false;

    static _className = 'Record';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordKeys, key) ||
            key.startsWith(WatchableCellValueInFieldKeyPrefix) ||
            key.startsWith(WatchableColorInViewKeyPrefix)
        );
    }
    _parentRecordStore: RecordStore;
    _parentTable: Table;

    /**
     * @hideconstructor
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
     * @function id
     * @memberof Record
     * @instance
     * @returns {string} This record's ID.
     * @example
     * console.log(myRecord.id);
     * // => 'recxxxxxxxxxxxxxx'
     */

    /**
     * True if this record has been deleted.
     *
     * In general, it's best to avoid keeping a reference to a record past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted record (other than its ID) will throw. But if you do keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * record's data.
     *
     * @function isDeleted
     * @memberof Record
     * @instance
     * @returns {boolean} `true` if the record has been deleted, `false` otherwise.
     * @example
     * if (!myRecord.isDeleted) {
     *     // Do things with myRecord
     * }
     */

    /**
     * Get notified of changes to the record.
     *
     * Watchable keys are:
     * - `'primaryCellValue'`
     * - `'commentCount'`
     * - `'cellValues'`
     * - `'cellValueInField:' + someFieldId`
     * - `'colorInView:' + someViewId`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof Record
     * @instance
     * @param {(WatchableRecordKey|Array<WatchableRecordKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {Object?} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableRecordKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof Record
     * @instance
     * @param {(WatchableRecordKey|Array<WatchableRecordKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableRecordKey>} the array of keys that were unwatched
     */

    /**
     * @private
     */
    get _dataOrNullIfDeleted(): RecordData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        if (!tableData) {
            return null;
        }
        const recordsById = tableData.recordsById;
        invariant(recordsById, 'Record data is not loaded');
        return recordsById[this._id] || null;
    }
    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * @function
     * @returns The table that this record belongs to. Should never change because records aren't moved between tables.
     *
     * @example
     * import {useRecords, withHooks} from '@airtable/blocks/ui';
     * const queryResult = myTable.selectRecords();
     * const records = useRecords(queryResult);
     * console.log(records[0].parentTable.id === myTable.id);
     * // => true
     */
    get parentTable(): Table {
        return this._parentTable;
    }
    /**
     * @private
     */
    __getRawCellValue(fieldId: string): mixed {
        const publicCellValue = this.getCellValue(fieldId);
        const field = this.parentTable.getFieldById(fieldId);
        return cellValueUtils.parsePublicApiCellValue(publicCellValue, field);
    }
    /**
     * @private
     */
    __getRawRow(): {id: string, createdTime: string, cellValuesByColumnId?: RecordDef} {
        let cellValuesByColumnId;
        const cellValuesByFieldId = this._data.cellValuesByFieldId;
        if (cellValuesByFieldId) {
            cellValuesByColumnId = {};
            for (const [fieldId, publicCellValue] of entries(cellValuesByFieldId)) {
                if (publicCellValue !== undefined) {
                    const field = this.parentTable.getFieldById(fieldId);
                    cellValuesByColumnId[fieldId] = cellValueUtils.parsePublicApiCellValue(
                        publicCellValue,
                        field,
                    );
                }
            }
        }
        return {
            id: this.id,
            createdTime: this._data.createdTime,
            cellValuesByColumnId,
        };
    }
    /**
     * @private
     */
    _getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field {
        return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
    /**
     * @private
     */
    _getViewMatching(viewOrViewIdOrViewName: View | string): View {
        return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
    }
    /**
     * Gets a specific cell value in this record.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @returns The cell value in the given field.
     * @example
     * const cellValue = myRecord.getCellValue(mySingleLineTextField);
     * console.log(cellValue);
     * // => 'cell value'
     */
    getCellValue(fieldOrFieldIdOrFieldName: Field | FieldId | string): mixed {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(
            this._parentRecordStore.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field %s are not loaded',
            field.id,
        );
        const {cellValuesByFieldId} = this._data;
        if (!cellValuesByFieldId) {
            return null;
        }
        const cellValue =
            cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

        if (typeof cellValue === 'object' && cellValue !== null) {
            if (!Record.shouldUseNewLookupFormat && field.type === FieldTypes.LOOKUP) {
                const cellValueForMigration = [];
                cellValueForMigration.linkedRecordIds = cloneDeep(cellValue.linkedRecordIds);
                cellValueForMigration.valuesByLinkedRecordId = cloneDeep(
                    cellValue.valuesByLinkedRecordId,
                );
                invariant(Array.isArray(cellValue.linkedRecordIds), 'linkedRecordIds');
                for (const linkedRecordId of cellValue.linkedRecordIds) {
                    invariant(typeof linkedRecordId === 'string', 'linkedRecordId');
                    const {valuesByLinkedRecordId} = cellValue;
                    invariant(
                        valuesByLinkedRecordId && typeof valuesByLinkedRecordId === 'object',
                        'valuesByLinkedRecordId',
                    );
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
     * Gets a specific cell value in this record, formatted as a `string`.
     *
     * @param fieldOrFieldIdOrFieldName The field (or field ID or field name) whose cell value you'd like to get.
     * @returns The cell value in the given field, formatted as a `string`.
     * @example
     * const cellValueAsString = myRecord.getCellValueAsString(myNumberField);
     * console.log(cellValueAsString);
     * // => '42'
     */
    getCellValueAsString(fieldOrFieldIdOrFieldName: Field | FieldId | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(
            this._parentRecordStore.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field %s are not loaded',
            field.id,
        );
        const rawCellValue = this.__getRawCellValue(field.id);

        if (rawCellValue === null || rawCellValue === undefined) {
            return '';
        } else {
            return columnTypeProvider.convertCellValueToString(
                rawCellValue,
                field.__getRawType(),
                field.__getRawTypeOptions(),
                getSdk().__appInterface,
            );
        }
    }
    /**
     * Returns a URL that is suitable for rendering an attachment on the current client.
     * The URL that is returned will only work for the current user.
     *
     * @param attachmentId The ID of the attachment.
     * @param attachmentUrl The attachment's URL (which is not suitable for rendering on the client).
     * @returns A URL that is suitable for rendering on the current client.
     * @example
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
     *                 const clientUrl = record.getAttachmentClientUrlFromCellValueUrl(attachmentObj.id, attachmentObj.url);
     *                 return (
     *                     <img key={attachmentObj.id} src={clientUrl} width={200} />
     *                 );
     *             })}
     *         </div>
     *     );
     * }
     */
    getAttachmentClientUrlFromCellValueUrl(attachmentId: string, attachmentUrl: string): string {
        const appInterface = getSdk().__appInterface;
        const isAttachmentsCdnV3Enabled = appInterface.isFeatureEnabled('attachmentsCdnV3');

        if (isAttachmentsCdnV3Enabled) {
            const applicationId = appInterface.getApplicationId();
            const userId = appInterface.getCurrentSessionUserId();
            const imagePathPrefix = 'attV3/';
            attachmentUrl = attachmentUrl.replace(
                /^https:\/\/([^/]+)\//,
                `${ATTACHMENTS_V3_CDN_BASE_URL}/${imagePathPrefix}${userId}/${applicationId}/${attachmentId}/`,
            );
        }
        return attachmentUrl;
    }
    /**
     * Gets the color of this record in a given view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     * @returns The color of this record in the given view, or null if the record has no color in that view.
     */
    getColorInView(viewOrViewIdOrViewName: View | ViewId | string): Color | null {
        const view = this._getViewMatching(viewOrViewIdOrViewName);

        return this._parentRecordStore.getViewDataStore(view.id).getRecordColor(this);
    }
    /**
     * Gets the CSS hex string for this record in a given view.
     *
     * Can be watched with the 'colorInView:${ViewId}' key.
     *
     * @param viewOrViewIdOrViewName The view (or view ID or view name) to use for record coloring.
     * @returns The CSS hex color for this record in the given view, or null if the record has no color in that view.
     */
    getColorHexInView(viewOrViewIdOrViewName: View | string): string | null {
        const color = this.getColorInView(viewOrViewIdOrViewName);
        if (!color) {
            return null;
        }
        return colorUtils.getHexForColor(color);
    }
    /**
     * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result.
     * See {@link RecordQueryResult} for more.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param [opts={}] Options for the query, such as sorts and fields.
     * @returns A query result containing the records in the given `multipleRecordLinks` field.
     */
    selectLinkedRecordsFromCell(
        fieldOrFieldIdOrFieldName: Field | FieldId | string,
        opts: RecordQueryResultOpts = {},
    ): LinkedRecordsQueryResult {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        return LinkedRecordsQueryResult.__createOrReuseQueryResult(this, field, opts);
    }
    /**
     * @function
     * @returns The URL for the record. You can visit this URL in the browser to be taken to the record in the Airtable UI.
     * @example
     * console.log(myRecord.url);
     * // => 'https://airtable.com/tblxxxxxxxxxxxxxx/recxxxxxxxxxxxxxx'
     */
    get url(): string {
        return airtableUrls.getUrlForRow(this.id, this.parentTable.id, {
            absolute: true,
        });
    }
    /**
     * Gets the primary cell value in this record.
     *
     * @function
     * @returns The primary cell value in this record.
     * @example
     * console.log(myRecord.primaryCellValue);
     * // => 'primary cell value'
     */
    get primaryCellValue(): mixed {
        return this.getCellValue(this.parentTable.primaryField);
    }
    /**
     * Gets the primary cell value in this record, formatted as a `string`.
     *
     * @function
     * @returns The primary cell value in this record, formatted as a `string`.
     * @example
     * console.log(myRecord.primaryCellValueAsString);
     * // => '42'
     */
    get primaryCellValueAsString(): string {
        return this.getCellValueAsString(this.parentTable.primaryField);
    }
    /**
     * @function
     * @returns The number of comments on this record.
     * @example
     * const comentCount = myRecord.commentCount;
     * console.log(`This record has ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`);
     */
    get commentCount(): number {
        return this._data.commentCount;
    }
    /**
     * @function
     * @returns The created time of this record.
     * @example
     * console.log(`This record was created at ${myRecord.createdTime.toISOString()}`)
     */
    get createdTime(): Date {
        return new Date(this._data.createdTime);
    }
    /**
     * @private
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        const {cellValuesByFieldId, commentCount} = dirtyPaths;

        if (cellValuesByFieldId && u.isObjectNonEmpty(cellValuesByFieldId)) {

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
     * @private
     */
    __triggerOnChangeForRecordColorInViewId(viewId: string) {
        this._onChange(WatchableColorInViewKeyPrefix + viewId);
    }
}

export default Record;
