// @flow
const Environments = {
    PRODUCTION: ('production': 'production'),
    STAGING: ('staging': 'staging'),
    LOCAL: ('local': 'local'),
};

export type Environment = $Values<typeof Environments>;

module.exports = Environments;
