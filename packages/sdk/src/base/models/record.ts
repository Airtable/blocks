/** @module @airtable/blocks/models: Record */ /** */
import {Color} from '../../shared/colors';
import {RecordCore, WatchableRecordKeysCore} from '../../shared/models/record_core';
import {ViewId, FieldId} from '../../shared/types/hyper_ids';
import {BaseSdkMode} from '../../sdk_mode';
import {isEnumValue, ObjectValues, FlowAnyObject, isObjectEmpty} from '../../shared/private_utils';
import BlockSdk from '../sdk';
import {invariant} from '../../shared/error_utils';
import colorUtils from '../../shared/color_utils';
import LinkedRecordsQueryResult from './linked_records_query_result';
import ObjectPool from './object_pool';
import RecordStore from './record_store';
import Field from './field';
import Table from './table';
import View from './view';
import RecordQueryResult, {RecordQueryResultOpts} from './record_query_result';

const WatchableRecordKeys = Object.freeze({
    ...WatchableRecordKeysCore,
    commentCount: 'commentCount' as const,
});
const WatchableCellValueInFieldKeyPrefix = 'cellValueInField:';
const WatchableColorInViewKeyPrefix = 'colorInView:';
/**
 * Any key within record that can be watched:
 * - `'name'`
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
class Record extends RecordCore<BaseSdkMode, WatchableRecordKey> {
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
    __linkedRecordsQueryResultPool: ObjectPool<
        LinkedRecordsQueryResult,
        typeof LinkedRecordsQueryResult
    >;

    /**
     * @internal
     */
    constructor(
        sdk: BlockSdk,
        parentRecordStore: RecordStore,
        parentTable: Table,
        recordId: string,
    ) {
        super(sdk, parentRecordStore, parentTable, recordId);
        this.__linkedRecordsQueryResultPool = new ObjectPool(LinkedRecordsQueryResult);
    }
    /**
     * @internal
     */
    _getViewMatching(viewOrViewIdOrViewName: View | string): View {
        return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
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
        invariant(
            this._parentRecordStore.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field %s are not loaded',
            field.id,
        );
        return super.getCellValueAsString(field.id);
    }
    _getRawCellValue(field: Field): unknown {
        invariant(
            this._parentRecordStore.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field %s are not loaded',
            field.id,
        );
        return super._getRawCellValue(field);
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
        const airtableInterface = this._sdk.__airtableInterface;
        const appInterface = this._sdk.__appInterface;
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
        const linkedTableId = field.options && field.options.linkedTableId;
        invariant(typeof linkedTableId === 'string', 'linkedTableId must be set');

        const linkedTable = this._sdk.base.getTableById(linkedTableId);
        const linkedRecordStore = this._sdk.base.__getRecordStore(linkedTableId);

        const normalizedOpts = RecordQueryResult._normalizeOpts(
            linkedTable,
            linkedRecordStore,
            opts,
        );
        return this.__linkedRecordsQueryResultPool.getObjectForReuse(
            this,
            field,
            normalizedOpts,
            this._sdk,
        );
    }
    /**
     * Select and load records referenced in a `multipleRecordLinks` cell value. Returns a query result
     * promise containing the records in the given `multipleRecordLinks` field.
     * See {@link RecordQueryResult} for more.
     *
     * Remember to call `queryResult.unloadData` once you're finished with the query.
     *
     * @param fieldOrFieldIdOrFieldName The `multipleRecordLinks` field (or field ID or field name) to use.
     * @param opts Options for the query, such as sorts and fields.
     */
    async selectLinkedRecordsFromCellAsync(
        fieldOrFieldIdOrFieldName: Field | FieldId | string,
        opts: RecordQueryResultOpts = {},
    ): Promise<LinkedRecordsQueryResult> {
        const queryResult = this.selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName, opts);
        await queryResult.loadDataAsync();
        return queryResult;
    }
    /**
     * The URL for the record. You can visit this URL in the browser to be taken to the record in the Airtable UI.
     *
     * @example
     * ```js
     * console.log(myRecord.url);
     * // => 'https://airtable.com/appxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx/recxxxxxxxxxxxxxx'
     * ```
     */
    get url(): string {
        return this._sdk.__airtableInterface.urlConstructor.getRecordUrl(
            this.id,
            this.parentTable.id,
        );
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
     * @internal
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject) {
        super.__triggerOnChangeForDirtyPaths(dirtyPaths);
        const {cellValuesByFieldId, commentCount} = dirtyPaths;
        if (cellValuesByFieldId && !isObjectEmpty(cellValuesByFieldId)) {
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
