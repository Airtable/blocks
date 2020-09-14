import SdkType from './sdk';

let sdk: SdkType | null = null;

/** @hidden */
export default function getSdk(): SdkType {
    if (!sdk) {
        const getAirtableInterface = require('./injected/airtable_interface').default;
        const Sdk = require('./sdk').default;
        sdk = new Sdk(getAirtableInterface());
    }

    return sdk as SdkType;
}

/** @hidden */
export function clearSdkForTest() {
    sdk = null;
}
