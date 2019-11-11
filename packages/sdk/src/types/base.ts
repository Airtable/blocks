/** @module @airtable/blocks/models: Base */ /** */
import {AppInterface} from '../injected/airtable_interface';
import {ObjectMap} from '../private_utils';
import {PermissionLevel} from './permission_levels';
import {TableData, TablePermissionData, TableId} from './table';
import {CursorData} from './cursor';
import {CollaboratorData, UserId} from './collaborator';

/** */
export type BaseId = string;

/** @hidden */
export interface ModelChange {
    path: Array<string>;
    value: unknown;
}

/** @hidden */
export interface BaseData {
    id: BaseId;
    name: string;
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    tablesById: ObjectMap<TableId, TableData>;

    appInterface: AppInterface;

    collaboratorsById: ObjectMap<UserId, CollaboratorData>;
    activeCollaboratorIds: Array<UserId>;


    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;
    cursorData: CursorData | null;
}

/** @hidden */
export interface BasePermissionData {
    readonly permissionLevel: PermissionLevel;
    readonly tablesById: ObjectMap<TableId, TablePermissionData>;
}
