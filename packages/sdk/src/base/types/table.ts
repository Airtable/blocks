import {type TableDataCore, type TablePermissionDataCore} from '../../shared/types/table_core';
import {type FieldId, type RecordId, type ViewId} from '../../shared/types/hyper_ids';
import {type ObjectMap} from '../../shared/private_utils';
import {type ViewData} from './view';
import {type RecordData} from './record';
import {type FieldData, type FieldPermissionData} from './field';

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
