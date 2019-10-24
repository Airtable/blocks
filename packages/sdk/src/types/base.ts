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
export type ModelChange = {
    path: Array<string>;
    value: unknown;
};

/** @hidden */
export type BaseData = {
    id: BaseId;
    name: string;
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    tablesById: ObjectMap<TableId, TableData>;

    appInterface: AppInterface;

    collaboratorsById: ObjectMap<UserId, CollaboratorData>;
    activeCollaboratorIds: Array<UserId>;

    // These will be exposed through separate models, but stored
    // on base data for convenience.

    // Exposed through Session model
    // currentUserId will be null for backend block requests and publicly shared bases.
    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;
    // Exposed through Cursor model
    // cursorData will be null if it has not been subscribed to.
    cursorData: CursorData | null;
};

/** @hidden */
export type BasePermissionData = {
    readonly permissionLevel: PermissionLevel;
    readonly tablesById: ObjectMap<TableId, TablePermissionData>;
};
