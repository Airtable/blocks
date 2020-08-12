import SdkType from './sdk';

let sdk: SdkType;

/** @hidden */
export default function getSdk(): SdkType {
    if (!sdk) {
        const getAirtableInterface = require('./injected/airtable_interface').default;
        const Sdk = require('./sdk').default;
        sdk = new Sdk(getAirtableInterface());
    }

    return sdk;
}
