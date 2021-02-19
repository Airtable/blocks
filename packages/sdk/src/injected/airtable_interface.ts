import {spawnError} from '../error_utils';
import {AirtableInterface} from '../types/airtable_interface';

const AIRTABLE_INTERFACE_VERSION = 0;

let airtableInterface: AirtableInterface | null = null;

const missingAirtableInterfaceErrorMessage = [
    'Error: App environment misconfigured',
    '\n\n',
    'Airtable Apps can only run in the presence of an Airtable Base. If you ',
    'are trying to run your App with a Base hosted on airtable.com, then be ',
    'sure you are using the Airtable CLI to serve your code and accessing it ',
    'through a Custom App installed inside a Base on airtable.com.',
    '\n\n',
    'If you are trying to run automated tests for your App, then make sure ',
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
