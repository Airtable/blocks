/** @module @airtable/blocks/models: Base */ /** */
import {type ObjectMap} from '../private_utils';
import {type AppInterface} from './airtable_interface_core';
import {type PermissionLevel} from './permission_levels';
import {type TableDataCore, type TablePermissionDataCore} from './table_core';
import {type CollaboratorData} from './collaborator';
import {type TableId, type UserId, type BaseId} from './hyper_ids';

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
    tableOrder: Array<TableId>;
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
