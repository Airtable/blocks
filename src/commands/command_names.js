// @flow
const CommandNames = {
    INIT: ('init': 'init'),
    RUN: ('run': 'run'),
    CLONE: ('clone': 'clone'),
    PUSH: ('push': 'push'),
    PULL: ('pull': 'pull'),
    RENAME_ENTRY: ('rename-entry': 'rename-entry'),
    SET_CREDENTIAL: ('set-credential': 'set-credential'),
    DELETE_CREDENTIAL: ('delete-credential': 'delete-credential'),
    LIST_CREDENTIALS: ('list-credentials': 'list-credentials'),
    RENAME_CREDENTIAL: ('rename-credential': 'rename-credential'),
    BUILD: ('build': 'build'),
};

export type CommandName = $Values<typeof CommandNames>;

module.exports = CommandNames;
