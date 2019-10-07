import {AppInterface} from '../injected/airtable_interface';
import {ObjectMap} from '../private_utils';
import {PermissionLevel} from './permission_levels';
import {TableData, TablePermissionData, TableId} from './table';
import {CursorData} from './cursor';
import {UserId} from './collaborator';

export type BaseId = string;
export type ObjectId = string;
export type InviteId = string;

export type ModelChange = {
    path: Array<string>;
    value: unknown;
};

export type AppBlanketUserData = {
    id: UserId | InviteId;
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicUrl?: string;
    permissionLevel: PermissionLevel;
};

export type AppBlanketData = {
    userInfoById?: ObjectMap<UserId | InviteId, AppBlanketUserData>;
};

export type BaseData = {
    id: BaseId;
    name: string;
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    tablesById: ObjectMap<TableId, TableData>;

    // // TODO(emma): Delete appBlanket when we've added collaboratorsById
    appBlanket: AppBlanketData;
    appInterface: AppInterface;

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

export type BasePermissionData = {
    readonly permissionLevel: PermissionLevel;
    readonly tablesById: ObjectMap<TableId, TablePermissionData>;
};
