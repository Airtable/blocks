/** @module @airtable/blocks/models: Base */ /** */
import {ObjectMap} from '../private_utils';
import {AppInterface} from './airtable_interface_core';
import {PermissionLevel} from './permission_levels';
import {TableDataCore, TablePermissionData} from './table_core';
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

    // These will be exposed through separate models, but stored
    // on base data for convenience.

    // Exposed through Session model
    // currentUserId will be null for backend block requests and publicly shared bases.
    currentUserId: UserId | null;
    permissionLevel: PermissionLevel;
    enabledFeatureNames: Array<string>;

    billingPlanGrouping: string;
    isBlockDevelopmentRestrictionEnabled: boolean;
    // This is optional to avoid making a backwards incompatible change.
    // If unset we default to 100000
    maxRowsPerTable?: number;
    workspaceId: string;
}

/** @hidden */
export interface BasePermissionData {
    readonly permissionLevel: PermissionLevel;
    readonly tablesById: ObjectMap<TableId, TablePermissionData>;
}
