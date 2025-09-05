import getAirtableInterface from '../injected/airtable_interface';
import {BaseSdkMode} from '../sdk_mode';
import {spawnError} from '../shared/error_utils';
import {BlockRunContextType} from './types/airtable_interface';

if ((window as any).__getAirtableInterfaceAtVersion) {
    const runContextType = getAirtableInterface<BaseSdkMode>().sdkInitData.runContext.type;
    if (
        runContextType !== BlockRunContextType.DASHBOARD_APP &&
        runContextType !== BlockRunContextType.VIEW
    ) {
        throw spawnError('Unexpected import when running block in interface');
    }
}
