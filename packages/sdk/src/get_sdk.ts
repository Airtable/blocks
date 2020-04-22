import SdkType from './sdk';

// TODO(alex): prevent sdk sharing across invocations of the same lambda container
let sdk: SdkType;

/** @hidden */
export default function getSdk(): SdkType {
    if (!sdk) {
        const airtableInterface = require('./injected/airtable_interface').default;
        const Sdk = require('./sdk').default;
        sdk = new Sdk(airtableInterface);
    }

    return sdk;
}
