import {ObjectMap} from '../private_utils';
import {FieldData, FieldPermissionData, FieldId} from './field';
import {ViewData, ViewId} from './view';
import {RecordData, RecordId} from './record';

export type TableId = string;
export type TableLock = unknown;

export type TableData = {
    id: TableId;
    name: string;
    primaryFieldId: string;
    fieldsById: ObjectMap<FieldId, FieldData>;
    activeViewId: ViewId | null;
    viewOrder: Array<ViewId>;
    viewsById: ObjectMap<ViewId, ViewData>;
    // recordsById will be absent until the block explicity loads the table's data.
    recordsById?: ObjectMap<RecordId, RecordData>;
    lock: TableLock | null;
};

export type TablePermissionData = {
    readonly id: TableId;
    readonly name: string;
    readonly fieldsById: {readonly [key: string]: FieldPermissionData};
    readonly lock: TableLock | null;
};
