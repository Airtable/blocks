// @flow
import {type PermissionLevel} from './permission_levels';
import {type TableData, type TableId} from './table';
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
    // NOTE: in rare cases where a base hasn't been loaded since 2016, AppBlanket may be null
    // However, it should never be read from in that scenario since (as of Sep 2017)
    // it's only used for collaborator fields which were introduced alongside AppBlanket
    appBlanket: AppBlanketData,
    sortTiebreakerKey: ObjectId | null,
    enabledFeatureNames: Array<string>,

    // These will be exposed through separate models, but stored
    // on base data for convenience.

    // currentUserId will be null for backend block requests and publicly shared bases.
    currentUserId: UserId | null,
    permissionLevel: PermissionLevel,

    // cursorData will be null if it has not been subscribed to.
    cursorData: CursorData | null,
|};
