/* eslint-disable no-console */
const invariant = require('invariant');

export default function(request) {
    const backendBlockSdkWrapperInstance = global['_airtableBlockSdk'];
    invariant(backendBlockSdkWrapperInstance, 'backendBlockSdkWrapperInstance');
    let airtableBlockModule;
    try {
        airtableBlockModule = require('airtable-block');
    } catch (err) {
        console.error(err);
        airtableBlockModule = new Error('');
    }
    return {
        statusCode: 200,
        body: [
            backendBlockSdkWrapperInstance.constructor.name,
            airtableBlockModule.constructor.name,
        ],
    };
}
