const invariant = require('invariant');
const blockCliConfigSettings = require('../../src/config/block_cli_config_settings');

export default function(event) {
    const backendBlockSdkWrapperInstance = global[blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME];
    invariant(!!backendBlockSdkWrapperInstance, 'backendBlockSdkWrapperInstance');
    return {
        statusCode: 200,
        body: backendBlockSdkWrapperInstance.constructor.name,
    };
}
