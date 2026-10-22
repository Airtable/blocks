import {type TableDataCore, type TablePermissionDataCore} from '../../shared/types/table_core';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type ObjectMap} from '../../shared/private_utils';
import {type RecordData} from './record';
import {type FieldData, type FieldPermissionData} from './field';

/**
 * Describes the first rows of this table that the host loaded before the extension asked for any
 * data. Present only while `dynamicQueriesByKey[queryKey]` holds those rows; its `recordOrder`
 * holds up to `rowLimit + 1` record ids, the extra one signalling that more records match.
 * The host never preloads records while a search term filters the element's records.
 *
 * @hidden
 */
export interface PreloadedRecordsData {
    queryKey: string;
    /** The only fields whose cell values are guaranteed to be loaded for these records. */
    fieldIds: Array<FieldId>;
    rowLimit: number;
}

/** @hidden */
export interface TableData extends TableDataCore {
    fieldsById: ObjectMap<FieldId, FieldData>;
    recordsById: ObjectMap<RecordId, RecordData>;
    recordOrder: Array<RecordId>;

    dynamicQueriesByKey: ObjectMap<
        string,
        {
            recordOrder: Array<RecordId>;
        }
    >;

    isRecordExpansionEnabled: boolean;
    areRecordCommentsEnabled?: boolean;
    isRecordRevisionHistoryEnabled?: boolean;
    preloadedRecords?: PreloadedRecordsData | null;
    canCreateRecordsInline: boolean;
    canEditRecordsInline: boolean;
    canDestroyRecordsInline: boolean;
}

/** @hidden */
export interface TablePermissionData extends TablePermissionDataCore {
    readonly fieldsById: ObjectMap<FieldId, FieldPermissionData>;
    readonly canCreateRecordsInline: boolean;
    readonly canEditRecordsInline: boolean;
    readonly canDestroyRecordsInline: boolean;
}
