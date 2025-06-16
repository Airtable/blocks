/** @module @airtable/blocks/models: Base */ /** */
import {ObjectMap} from '../private_utils';
import {AppInterface} from './airtable_interface_core';
import {PermissionLevel} from './permission_levels';
import {TableDataCore, TablePermissionDataCore} from './table_core';
import {CollaboratorData} from './collaborator';
import {TableId, UserId, BaseId} from './hyper_ids';

/** @hidden */
export interface ModelChange {
    path: Array<string>;
    value: unknown;
}

/** @hidden */
export interface BaseDataCore<TableDataT extends TableDataCore> {
    id: BaseId;
    name: string;
    color: string;
    tablesById: ObjectMap<TableId, TableDataT>;

    appInterface: AppInterface;

    collaboratorsById: ObjectMap<UserId, CollaboratorData>;
    activeCollaboratorIds: Array<UserId>;


    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;

    billingPlanGrouping: string;
    isBlockDevelopmentRestrictionEnabled: boolean;
    maxRowsPerTable?: number;
    workspaceId: string;
}

/** @hidden */
export interface BasePermissionDataCore<TablePermissionDataT extends TablePermissionDataCore> {
    readonly permissionLevel: PermissionLevel;
    readonly tablesById: ObjectMap<TableId, TablePermissionDataT>;
}
