/** @module @airtable/blocks/models: Table */ /** */
import {ObjectMap} from '../private_utils';
import {FieldData, FieldPermissionData, FieldId} from './field';
import {ViewData, ViewId} from './view';
import {RecordData, RecordId} from './record';

/** */
export type TableId = string;
/** @hidden */
export type TableLock = unknown;

/** @hidden */
export interface TableData {
    id: TableId;
    name: string;
    primaryFieldId: string;
    fieldsById: ObjectMap<FieldId, FieldData>;
    activeViewId: ViewId | null;
    viewOrder: Array<ViewId>;
    viewsById: ObjectMap<ViewId, ViewData>;
    recordsById?: ObjectMap<RecordId, RecordData>;
    description: string | null;
    lock: TableLock | null;
}

/** @hidden */
export interface TablePermissionData {
    readonly id: TableId;
    readonly name: string;
    readonly fieldsById: {readonly [key: string]: FieldPermissionData};
    readonly lock: TableLock | null;
}
