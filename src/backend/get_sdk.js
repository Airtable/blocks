// @flow
const blocksConfigSettings = require('client_server_shared/blocks/blocks_config_settings');
import type BackendBlockSdkWrapper from './backend_block_sdk_wrapper';

// Returns a reference to the global BlockSdk instance.
// Use it to avoid require cycles in block sdk modules.
function getSdk(): BackendBlockSdkWrapper {
    return global[blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME];
}

module.exports = getSdk;
