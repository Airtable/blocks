// @flow

// Corresponds to the server_shared/blocks/block_build_types.js in hyperbase repo.
const BlockBuildTypes = {
    RELEASE: ('RELEASE': 'RELEASE'),
    DEVELOPMENT: ('DEVELOPMENT': 'DEVELOPMENT'),
};

export type BlockBuildType = $Values<typeof BlockBuildTypes>;

module.exports = BlockBuildTypes;
