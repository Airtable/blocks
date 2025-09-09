import {type TableDataCore, type TablePermissionDataCore} from '../../shared/types/table_core';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';
import {type ObjectMap} from '../../shared/private_utils';
import {type RecordData} from './record';
import {type FieldData, type FieldPermissionData} from './field';

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
