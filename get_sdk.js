// @flow
const blocksConfigSettings = require('client_server_shared/blocks/blocks_config_settings');
import type BlockSdk from 'client/blocks/sdk/sdk';

// Returns a reference to the global BlockSdk instance.
// Use it to avoid require cycles in block sdk modules.
function getSdk(): BlockSdk {
    return window[blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME];
}

module.exports = getSdk;
