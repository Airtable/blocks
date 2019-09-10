const invariant = require('invariant');

export default function(request) {
    const backendBlockSdkWrapperInstance = global['_airtableBlockSdk'];
    invariant(backendBlockSdkWrapperInstance, 'backendBlockSdkWrapperInstance');
    return {
        statusCode: 200,
        body: backendBlockSdkWrapperInstance.constructor.name,
    };
}
