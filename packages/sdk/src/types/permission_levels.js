// @flow
export const PermissionLevels = Object.freeze({
    NONE: ('none': 'none'),
    READ: ('read': 'read'),
    COMMENT: ('comment': 'comment'),
    EDIT: ('edit': 'edit'),
    CREATE: ('create': 'create'),
    OWNER: ('owner': 'owner'),
});

export type PermissionLevel = $Values<typeof PermissionLevels>;
