// @flow
const CommandNames = {
    INIT: ('init': 'init'),
    RUN: ('run': 'run'),
    RELEASE: ('release': 'release'),
    SET_API_KEY: ('set-api-key': 'set-api-key'),

    // This command is a helper to migrate old blocks to the standalone CLI world.
    // TODO(jb): remove this once all blocks are migrated to the standalone CLI world.
    MIGRATE_OLD_BLOCK: ('migrate-old-block': 'migrate-old-block'),

    // These commands are no longer supported.
    // TODO(jb): remove them once all blocks are migrated to the standalone CLI world.
    CLONE: ('clone': 'clone'),
    PUSH: ('push': 'push'),
    PULL: ('pull': 'pull'),
    RENAME_ENTRY: ('rename-entry': 'rename-entry'),
    SET_CREDENTIAL: ('set-credential': 'set-credential'),
    DELETE_CREDENTIAL: ('delete-credential': 'delete-credential'),
    LIST_CREDENTIALS: ('list-credentials': 'list-credentials'),
    RENAME_CREDENTIAL: ('rename-credential': 'rename-credential'),
};

export type CommandName = $Values<typeof CommandNames>;

module.exports = CommandNames;
