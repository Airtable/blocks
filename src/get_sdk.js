// @flow
import type SdkType from './sdk';

// TODO(alex): prevent sdk sharing across invocations of the same lambda container
let sdk;
module.exports = function getSdk(): SdkType {
    if (!sdk) {
        const Sdk = require('./sdk');
        const airtableInterface = require('./injected/airtable_interface');
        sdk = new Sdk(airtableInterface);
    }

    return sdk;
};
