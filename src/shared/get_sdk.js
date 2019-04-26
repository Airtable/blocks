// @flow
const blocksConfigSettings = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/blocks/blocks_config_settings',
);

import type {BlockSdkInterface} from 'block_sdk/shared/block_sdk_interface';
import type {AbstractAirtableInterface} from 'block_sdk/shared/abstract_airtable_interface';

// Returns a reference to the global BlockSdk instance.
// Use it to avoid require cycles in block sdk modules.
function getSdk(): BlockSdkInterface<AbstractAirtableInterface> {
    return (typeof window !== 'undefined' ? window : global)[
        blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME
    ];
}

module.exports = getSdk;
