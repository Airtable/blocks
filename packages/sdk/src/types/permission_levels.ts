import {ObjectValues} from '../private_utils';
export const PermissionLevels = Object.freeze({
    NONE: 'none' as const,
    READ: 'read' as const,
    COMMENT: 'comment' as const,
    EDIT: 'edit' as const,
    CREATE: 'create' as const,
    OWNER: 'owner' as const,
});

export type PermissionLevel = ObjectValues<typeof PermissionLevels>;
