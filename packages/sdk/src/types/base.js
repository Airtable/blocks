// @flow
import {type PermissionLevel} from './permission_levels';
import {type TableData, type TablePermissionData, type TableId} from './table';
import {type CursorData} from './cursor';
import {type UserId} from './collaborator';

export type BaseId = string;
export type ObjectId = string;
export type InviteId = string;

export type ModelChange = {|
    path: Array<string>,
    value: mixed,
|};

export type AppBlanketUserData = {
    id: UserId | InviteId,
    firstName?: string,
    lastName?: string,
    email?: string,
    profilePicUrl?: string,
    permissionLevel: PermissionLevel,
};

export type AppBlanketData = {|
    userInfoById?: {
        [UserId | InviteId]: AppBlanketUserData,
    },
|};

export type BaseData = {|
    id: BaseId,
    name: string,
    tableOrder: Array<TableId>,
    activeTableId: TableId | null,
    tablesById: {[TableId]: TableData},
    appBlanket: AppBlanketData,
    sortTiebreakerKey: ObjectId | null,


    currentUserId: UserId | null,
    permissionLevel: PermissionLevel,
    enabledFeatureNames: Array<string>,

    cursorData: CursorData | null,
|};

export type BasePermissionData = {
    +permissionLevel: PermissionLevel,
    +tablesById: {+[TableId]: TablePermissionData},
};
