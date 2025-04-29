/** @module @airtable/blocks/interface/ui: useRecords */ /** */
import {InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';
import useWatchable from '../../shared/ui/use_watchable';
import {Record} from '../models/record';
import {Table} from '../models/table';

/**
 * A hook for working with all of the records (including cell values) in a
 * particular table. Automatically handles loading data and updating
 * your component when the underlying data changes.
 *
 * This hook re-renders when data concerning the records changes (specifically, when cell values
 * change and when records are added or removed).
 *
 * Returns a list of records.
 *
 * @param table The {@link Table} you want the records from.
 *
 * @example
 * ```js
 *  import {useBase, useRecords} from '@airtable/blocks/interface/ui';
 *
 *  function RecordList() {
 *      const base = useBase();
 *      const table = base.tables[0];
 *
 *      // grab all the records from that table
 *      const records = useRecords(table);
 *
 *      // render a list of records:
 *      return (
 *          <ul>
 *              {records.map(record => {
 *                  return <li key={record.id}>{record.name}</li>;
 *              })}
 *          </ul>
 *      );
 *  }
 * ```
 * @docsPath UI/hooks/useRecords
 * @hook
 */
export function useRecords(table: Table): Array<Record> {
    const {base} = useSdk<InterfaceSdkMode>();
    const recordStore = base.__getRecordStore(table.id);
    useWatchable(recordStore, ['records', 'recordIds', 'cellValues', 'recordOrder']);
    const records = recordStore.records;
    return records;
}
