import {type ObjectValues} from '../private_utils';

/** @hidden */
export const PermissionLevels = Object.freeze({
    NONE: 'none' as const,
    READ: 'read' as const,
    COMMENT: 'comment' as const,
    EDIT: 'edit' as const,
    CREATE: 'create' as const,
    OWNER: 'owner' as const,
});

/** @hidden */
export type PermissionLevel = ObjectValues<typeof PermissionLevels>;
