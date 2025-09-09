import getAirtableInterface from '../injected/airtable_interface';
import {type InterfaceSdkMode} from '../sdk_mode';
import {spawnError} from '../shared/error_utils';
import {BlockRunContextType} from './types/airtable_interface';

if ((window as any).__getAirtableInterfaceAtVersion) {
    const runContextType = getAirtableInterface<InterfaceSdkMode>().sdkInitData.runContext.type;
    if (runContextType !== BlockRunContextType.PAGE_ELEMENT_IN_QUERY_CONTAINER) {
        throw spawnError('Unexpected import when running block in base');
    }
}
