/** @module @airtable/blocks/models: Table */ /** */
import {TableId} from './hyper_ids';

/** @hidden */
export type TableLock = unknown;
/** @hidden */
export type ExternalSyncById = unknown;

/** @hidden */
export interface TableDataCore {
    id: TableId;
    name: string;
    primaryFieldId: string;
    description: string | null;
    lock: TableLock | null;
    externalSyncById: ExternalSyncById | null;
}

/** @hidden */
export interface TablePermissionDataCore {
    readonly id: TableId;
    readonly name: string;
    readonly lock: TableLock | null;
    readonly externalSyncById: ExternalSyncById | null;
}
