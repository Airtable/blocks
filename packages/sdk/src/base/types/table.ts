import {TableDataCore, TablePermissionDataCore} from '../../shared/types/table_core';
import {FieldId, RecordId, ViewId} from '../../shared/types/hyper_ids';
import {ObjectMap} from '../../shared/private_utils';
import {ViewData} from './view';
import {RecordData} from './record';
import {FieldData, FieldPermissionData} from './field';

/** @hidden */
export interface TableData extends TableDataCore {
    fieldsById: ObjectMap<FieldId, FieldData>;
    activeViewId: ViewId | null;
    viewOrder: Array<ViewId>;
    viewsById: ObjectMap<ViewId, ViewData>;
    recordsById?: ObjectMap<RecordId, RecordData>;
}

/** @hidden */
export interface TablePermissionData extends TablePermissionDataCore {
    readonly fieldsById: ObjectMap<FieldId, FieldPermissionData>;
}
