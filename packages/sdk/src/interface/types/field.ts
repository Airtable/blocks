import {FieldDataCore, FieldPermissionDataCore} from '../../shared/types/field_core';

/** @hidden */
export interface FieldData extends FieldDataCore {
    isEditable: boolean;
}

/** @hidden */
export interface FieldPermissionData extends FieldPermissionDataCore {
    readonly isEditable: boolean;
}
