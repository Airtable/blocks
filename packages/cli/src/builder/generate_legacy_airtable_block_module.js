// @flow
const blockCliConfigSettings = require('../config/block_cli_config_settings');

/** Returns code for the legacy airtable-block wrapper module. */
module.exports = function generateLegacyAirtableBlockModuleCode(): string {
    // NOTE: this must return ES5 (so no JSX!) since it won't get transpiled on the client.
    return `
if (console && console.warn) {
  console.warn('Warning: Importing legacy airtable-block module');
}
module.exports = (typeof window !== 'undefined' ? window : global)['${blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];
`;
};
