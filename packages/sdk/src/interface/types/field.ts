import {FieldDataCore, FieldPermissionDataCore} from '../../shared/types/field_core';

/** @hidden */
export interface FieldData extends FieldDataCore {
    /** Set by interfaces properties panel. Does not reflect locks or sync. */
    isEditable: boolean;
    /** Only populated for foreign key columns. */
    canCreateNewForeignRecords: boolean | undefined;
}

/** @hidden */
export interface FieldPermissionData extends FieldPermissionDataCore {
    /** Set by interfaces properties panel. Does not reflect locks or sync. */
    readonly isEditable: boolean;
    /** Only populated for foreign key columns. */
    readonly canCreateNewForeignRecords: boolean | undefined;
}
