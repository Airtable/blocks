// @flow
import invariant from 'invariant';
import {type Color} from '../colors';
import {type BaseData} from '../types/base';
import {type RecordData, type RecordDef} from '../types/record';
import {FieldTypes} from '../types/field';
import {isEnumValue, cloneDeep, entries} from '../private_utils';
import {type AirtableWriteAction} from '../injected/airtable_interface';
import AbstractModel from './abstract_model';
import Field from './field';
import cellValueUtils from './cell_value_utils';
import type TableType from './table';
import type ViewType from './view';
import {type QueryResultOpts} from './query_result';
import LinkedRecordsQueryResult from './linked_records_query_result';

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
// TODO: load view data when this is watched. see previous comment.
const WatchableColorInViewKeyPrefix = 'colorInView:';
// The string case is to accommodate cellValueInField:$FieldId.
type WatchableRecordKey = $Keys<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. To create a new record, use `table.createRecord`.
 */
class Record extends AbstractModel<RecordData, WatchableRecordKey> {
    // Once all blocks set this flag to true, remove this flag.
    static shouldUseNewLookupFormat = false;

    static _className = 'Record';
    static _isWatchableKey(key: string): boolean {
        return (
            isEnumValue(WatchableRecordKeys, key) ||
            u.startsWith(key, WatchableCellValueInFieldKeyPrefix) ||
            u.startsWith(key, WatchableColorInViewKeyPrefix)
        );
    }
    _parentTable: TableType;
    constructor(baseData: BaseData, parentTable: TableType, recordId: string) {
        super(baseData, recordId);

        this._parentTable = parentTable;
    }
    get _dataOrNullIfDeleted(): RecordData | null {
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
    __getRawCellValue(fieldId: string): mixed {
        const publicCellValue = this.getCellValue(fieldId);
        const field = this.parentTable.getFieldById(fieldId);
        invariant(field, 'Should have field');
        return cellValueUtils.parsePublicApiCellValue(publicCellValue, field);
    }
    __getRawRow(): {id: string, createdTime: string, cellValuesByColumnId?: RecordDef} {
        let cellValuesByColumnId;
        const cellValuesByFieldId = this._data.cellValuesByFieldId;
        if (cellValuesByFieldId) {
            cellValuesByColumnId = {};
            for (const [fieldId, publicCellValue] of entries(cellValuesByFieldId)) {
                // When fields are deleted, we set the previously loaded cell value to
                // undefined (vs deleting the key from the cellValuesByFieldId object, which
                // would cause de-opts). So ignore undefined cell values, since the field is deleted.
                if (publicCellValue !== undefined) {
                    const field = this.parentTable.getFieldById(fieldId);
                    invariant(field, 'Should have field');
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
    _getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field | null {
        return this.parentTable.__getFieldMatching(fieldOrFieldIdOrFieldName);
    }
    _getViewMatching(viewOrViewIdOrViewName: ViewType | string): ViewType | null {
        return this.parentTable.__getViewMatching(viewOrViewIdOrViewName);
    }
    /** */
    getCellValue(fieldOrFieldIdOrFieldName: Field | string): mixed {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        invariant(
            field.parentTable.id === this.parentTable.id,
            'Field must have same parent table as record',
        );
        invariant(
            field.parentTable.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field are not loaded',
        );
        const {cellValuesByFieldId} = this._data;
        if (!cellValuesByFieldId) {
            return null;
        }
        const cellValue =
            cellValuesByFieldId[field.id] !== undefined ? cellValuesByFieldId[field.id] : null;

        if (typeof cellValue === 'object' && cellValue !== null) {
            // HACK: while we migrate our blocks to the new lookup cell value
            // format, make the public cell value look like an array for
            // backwards compatibility.
            if (!Record.shouldUseNewLookupFormat && field.type === FieldTypes.LOOKUP) {
                const cellValueForMigration = [];
                // flow-disable-next-line
                cellValueForMigration.linkedRecordIds = cloneDeep(cellValue.linkedRecordIds);
                // flow-disable-next-line
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

            // Copy non-primitives.
            // TODO(kasra): maybe freezeDeep instead?
            return cloneDeep(cellValue);
        } else {
            return cellValue;
        }
    }
    /** */
    getCellValueAsString(fieldOrFieldIdOrFieldName: Field | string): string {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        invariant(
            field.parentTable.areCellValuesLoadedForFieldId(field.id),
            'Cell values for field are not loaded',
        );
        const rawCellValue = this.__getRawCellValue(field.id);

        if (rawCellValue === null || rawCellValue === undefined) {
            return '';
        } else {
            return columnTypeProvider.convertCellValueToString(
                rawCellValue,
                field.__getRawType(),
                field.__getRawTypeOptions(),
                this.parentTable.parentBase.__appInterface,
            );
        }
    }
    /**
     * Call this method with an attachment ID and URL to get back a URL that is
     * suitable for rendering on the current client. The URL that is returned
     * will only work for the current user.
     */
    getAttachmentClientUrlFromCellValueUrl(attachmentId: string, attachmentUrl: string): string {
        const appInterface = this.parentTable.parentBase.__appInterface;
        const isAttachmentsCdnV3Enabled = appInterface.isFeatureEnabled('attachmentsCdnV3');

        if (isAttachmentsCdnV3Enabled) {
            const applicationId = appInterface.getApplicationId();
            const userId = appInterface.getCurrentSessionUserId();
            // NOTE: normal images must be active in the base. We don't support rendering historical values here. see attachment_object_methods.js for more
            const imagePathPrefix = 'attV3/';
            attachmentUrl = attachmentUrl.replace(
                /^https:\/\/([^/]+)\//,
                `${ATTACHMENTS_V3_CDN_BASE_URL}/${imagePathPrefix}${userId}/${applicationId}/${attachmentId}/`,
            );
        }
        return attachmentUrl;
    }
    /**
     * Get the color name for this record in the specified view, or null if
     * no color is available. Watch with the 'colorInView:${ViewId}' key.
     */
    getColorInView(viewOrViewIdOrViewName: ViewType | string): Color | null {
        const view = this._getViewMatching(viewOrViewIdOrViewName);
        invariant(view, 'View does not exist');
        invariant(!view.isDeleted, 'View has been deleted');

        return view.__getRecordColor(this);
    }
    /**
     * Get a CSS hex string for this record in the specified view, or null if
     * no color is available. Watch with the 'colorInView:${ViewId}' key
     */
    getColorHexInView(viewOrViewIdOrViewName: ViewType | string): string | null {
        const view = this._getViewMatching(viewOrViewIdOrViewName);
        invariant(view, 'View does not exist');
        invariant(!view.isDeleted, 'View has been deleted');

        return view.__getRecordColorHex(this);
    }
    getLinkedRecordsFromCell(
        fieldOrFieldIdOrFieldName: Field | string,
        opts: QueryResultOpts = {},
    ): LinkedRecordsQueryResult {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');
        return LinkedRecordsQueryResult.__createOrReuseQueryResult(this, field, opts);
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
    setCellValue(
        fieldOrFieldIdOrFieldName: Field | string,
        publicCellValue: mixed,
    ): AirtableWriteAction<void, {}> {
        const field = this._getFieldMatching(fieldOrFieldIdOrFieldName);
        invariant(field, 'Field does not exist');
        invariant(!field.isDeleted, 'Field has been deleted');

        return this.setCellValues({
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
    setCellValues(cellValuesByFieldIdOrFieldName: RecordDef): AirtableWriteAction<void, {}> {
        return this.parentTable.setCellValues({
            [this.id]: cellValuesByFieldIdOrFieldName,
        });
    }
    /** */
    canDelete(): boolean {
        return this.parentTable.canDeleteRecord(this);
    }
    /** */
    delete(): AirtableWriteAction<void, {}> {
        return this.parentTable.deleteRecord(this);
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

        if (cellValuesByFieldId && u.isObjectNonEmpty(cellValuesByFieldId)) {
            // TODO: don't trigger changes for fields that aren't supposed to be loaded
            // (in some cases, e.g. record created, liveapp will send cell values
            // that we're not subscribed to).

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
    __triggerOnChangeForRecordColorInViewId(viewId: string) {
        this._onChange(WatchableColorInViewKeyPrefix + viewId);
    }
}

export default Record;
