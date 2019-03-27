// @flow
const CommandNames = {
    RUN: ('run': 'run'),
    CLONE: ('clone': 'clone'),
    PUSH: ('push': 'push'),
    PULL: ('pull': 'pull'),
    RENAME_ENTRY: ('rename-entry': 'rename-entry'),
    SET_CREDENTIAL: ('set-credential': 'set-credential'),
};

export type CommandName = $Values<typeof CommandNames>;

module.exports = CommandNames;
