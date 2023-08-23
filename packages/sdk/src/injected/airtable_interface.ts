import {spawnError} from '../error_utils';
import {AirtableInterface} from '../types/airtable_interface';

const AIRTABLE_INTERFACE_VERSION = 0;

let airtableInterface: AirtableInterface | null = null;

const missingAirtableInterfaceErrorMessage = [
    'Error: Extension environment misconfigured',
    '\n\n',
    'Airtable Extensions can only run in the presence of an Airtable Base. If you ',
    'are trying to run your Extension with a Base hosted on airtable.com, then be ',
    'sure you are using the Airtable CLI to serve your code and accessing it ',
    'through a Custom Extension installed inside a Base on airtable.com.',
    '\n\n',
    'If you are trying to run automated tests for your Extension, then make sure ',
    'you have loaded the `@airtable/testing-library` module *before* the ',
    '`@airtable/blocks` module.',
].join('');

/** @hidden */
export default function getAirtableInterface(): AirtableInterface {
    const getAirtableInterfaceAtVersion:
        | ((arg1: number) => AirtableInterface)
        | void = (window as any).__getAirtableInterfaceAtVersion;

    if (!airtableInterface) {
        if (!getAirtableInterfaceAtVersion) {
            throw spawnError(missingAirtableInterfaceErrorMessage);
        }

        airtableInterface = getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
    }

    return airtableInterface;
}
