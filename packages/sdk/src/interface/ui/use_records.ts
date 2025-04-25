import {InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';
import useWatchable from '../../shared/ui/use_watchable';
import Table from '../models/table';

/** @internal */
export function useRecords(table: Table): Array<{}> | null {
    const {base} = useSdk<InterfaceSdkMode>();
    const recordStore = base.__getRecordStore(table.id);
    useWatchable(recordStore, ['records', 'recordIds', 'cellValues', 'recordOrder']);
    const records = recordStore.records;
    return records;
}
