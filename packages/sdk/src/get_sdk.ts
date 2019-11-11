import Sdk from './sdk';
import airtableInterface from './injected/airtable_interface';

let sdk: Sdk;
/** @hidden */
export default function getSdk(): Sdk {
    if (!sdk) {
        sdk = new Sdk(airtableInterface);
    }

    return sdk;
}
