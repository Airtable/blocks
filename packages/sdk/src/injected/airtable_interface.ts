import {spawnError} from '../error_utils';
import {AirtableInterface} from '../types/airtable_interface';

const AIRTABLE_INTERFACE_VERSION = 0;

const getAirtableInterfaceAtVersion: ((arg1: number) => AirtableInterface) | void = (window as any)
    .__getAirtableInterfaceAtVersion;

let airtableInterface: AirtableInterface | null = null;

/** @hidden */
export default function getAirtableInterface(): AirtableInterface {
    if (!airtableInterface) {
        if (!getAirtableInterfaceAtVersion) {
            throw spawnError('@airtable/blocks can only run inside the block frame');
        }

        airtableInterface = getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
    }

    return airtableInterface;
}
