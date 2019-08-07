// @flow

const ConfigLocations = Object.freeze({
    BLOCK: ('block': 'block'),
    USER: ('user': 'user'),
});
export type ConfigLocation = $Values<typeof ConfigLocations>;

const DEFAULT_API_KEY_NAME = 'default';
type ApiKey = string;
export type AirtableApiKeyOrApiKeyByName = ApiKey | {[string]: ApiKey};

/**
 * These are all the user-level/block-level configs that are currently supported via
 * the config management system (i.e. the `.airtableblocksrc.json` file).
 */
export type UserOrBlockConfig = {
    airtableApiKey?: AirtableApiKeyOrApiKeyByName,
};

/**
 * NOTE: This is differs from our typical enum patterns in two ways:
 *   1. For type def, we're using $Keys<T> instead of $Values<typeof SomeObject> to couple
 *      this with the `UserOrBlockConfig` type def.
 *   2. For the const def, we're explicitly typing the const with the $Keys<T> type def from [1].
 * This is so that we can more tightly couple the `ConfigKeys` const with the `UserOrBlockConfig`
 * type definition.
 */
export type ConfigKey = $Keys<UserOrBlockConfig>;
const ConfigKeys: {[string]: ConfigKey} = Object.freeze({
    API_KEY: ('airtableApiKey': 'airtableApiKey'),
});

module.exports = {
    ConfigKeys,
    ConfigLocations,
    DEFAULT_API_KEY_NAME,
};
