import Sdk from './sdk';
import airtableInterface from './injected/airtable_interface';

// TODO(alex): prevent sdk sharing across invocations of the same lambda container
let sdk: Sdk;
/** @hidden */
export default function getSdk(): Sdk {
    if (!sdk) {
        sdk = new Sdk(airtableInterface);
    }

    return sdk;
}
