/** @module @airtable/blocks/models: Table */ /** */
import {ObjectMap} from '../private_utils';
import {FieldData, FieldPermissionData} from './field';
import {TableId, FieldId} from './hyper_ids';

/** @hidden */
export type TableLock = unknown;
/** @hidden */
export type ExternalSyncById = unknown;

/** @hidden */
export interface TableDataCore {
    id: TableId;
    name: string;
    primaryFieldId: string;
    fieldsById: ObjectMap<FieldId, FieldData>;
    description: string | null;
    lock: TableLock | null;
    externalSyncById: ExternalSyncById | null;
}

/** @hidden */
export interface TablePermissionData {
    readonly id: TableId;
    readonly name: string;
    readonly fieldsById: {readonly [key: string]: FieldPermissionData};
    readonly lock: TableLock | null;
}
