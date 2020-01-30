/* eslint-disable no-console */
const invariant = require('invariant');

export default function(request) {
    const backendBlockSdkWrapperInstance = global['_airtableBlockSdk'];
    invariant(backendBlockSdkWrapperInstance, 'backendBlockSdkWrapperInstance');
    try {
        const airtableBlockModule = require('airtable-block');
        return {
            statusCode: 200,
            body: [
                backendBlockSdkWrapperInstance.constructor.name,
                airtableBlockModule.constructor.name,
            ],
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: [backendBlockSdkWrapperInstance.constructor.name],
        };
    }
}
