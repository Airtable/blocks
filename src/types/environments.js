// @flow
const Environments = {
    PRODUCTION: ('production': 'production'),
    STAGING: ('staging': 'staging'),
    LOCAL: ('local': 'local'),
    TEST: ('test': 'test'),
};

export type Environment = $Values<typeof Environments>;

module.exports = Environments;
