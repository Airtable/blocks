import {TableDataCore, TablePermissionDataCore} from '../../shared/types/table_core';
import {FieldId, RecordId} from '../../shared/types/hyper_ids';
import {ObjectMap} from '../../shared/private_utils';
import {RecordData} from './record';
import {FieldData, FieldPermissionData} from './field';

/** @hidden */
export interface TableData extends TableDataCore {
    fieldsById: ObjectMap<FieldId, FieldData>;
    recordsById: ObjectMap<RecordId, RecordData>;
    recordOrder: Array<RecordId>;
    isRecordExpansionEnabled: boolean;
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
