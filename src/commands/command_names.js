// @flow
const CommandNames = {
    RUN: ('run': 'run'),
    CLONE: ('clone': 'clone'),
    PUSH: ('push': 'push'),
    PULL: ('pull': 'pull'),
    RENAME_ENTRY: ('rename-entry': 'rename-entry'),
};

export type CommandName = $Values<typeof CommandNames>;

module.exports = CommandNames;
