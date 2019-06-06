// @flow

const SupportedTopLevelDirectoryNames = Object.freeze({
    FRONTEND: ('frontend': 'frontend'),
    SHARED: ('shared': 'shared'),
});

export type SupportedTopLevelDirectoryName = $Values<typeof SupportedTopLevelDirectoryNames>;

module.exports = SupportedTopLevelDirectoryNames;
