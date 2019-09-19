// @flow
import {type FieldData, type FieldPermissionData, type FieldId} from './field';
import {type ViewData, type ViewId} from './view';
import {type RecordData, type RecordId} from './record';

export type TableId = string;
export opaque type TableLock = mixed;

export type TableData = {|
    id: TableId,
    name: string,
    primaryFieldId: string,
    fieldsById: {[FieldId]: FieldData},
    activeViewId: ViewId | null,
    viewOrder: Array<ViewId>,
    viewsById: {[ViewId]: ViewData},
    recordsById?: {[RecordId]: RecordData},
    lock: TableLock | null,
|};

export type TablePermissionData = {
    +id: TableId,
    +name: string,
    +fieldsById: {+[string]: FieldPermissionData},
    +lock: TableLock | null,
};
