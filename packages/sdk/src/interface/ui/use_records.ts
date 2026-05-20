/** @module @airtable/blocks/interface/ui: useRecords */ /** */
import {invariant, spawnError} from '../../shared/error_utils';
import {compact} from '../../shared/private_utils';
import useLoadable from '../../shared/ui/use_loadable';
import useWatchable from '../../shared/ui/use_watchable';
import {type Record} from '../models/record';
import {RecordQueryResult} from '../models/record_query_result';
import {Table} from '../models/table';
import {type TableQueryResultOpts} from '../models/table_query_result';

/** */
export function useRecords(table: Table, opts?: TableQueryResultOpts): Array<Record>;
/** */
export function useRecords(queryResult: RecordQueryResult): Array<Record>;
/** */
export function useRecords(tableOrQueryResult: null): null;
/** */
export function useRecords(arg: Table | null, opts?: TableQueryResultOpts): Array<Record> | null;
/** */
export function useRecords(arg: RecordQueryResult | null): Array<Record> | null;
/** */
export function useRecords(
    items: ReadonlyArray<Table | RecordQueryResult | null>,
): Array<Array<Record> | null>;
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
 * Calling `useRecords` multiple times in the same component will load the
 * queries sequentially, since each call suspends until its own data is
 * loaded. To load multiple queries in parallel, pass an array — each entry
 * may be a {@link Table}, a {@link RecordQueryResult}, or `null`. The hook
 * returns an array of the same shape, with `null` preserved for `null`
 * inputs. Per-query options are not accepted in the array form; if you need
 * them, build a query result yourself with `table.selectRecords(opts)` and
 * pass that.
 *
 * @param tableOrQueryResult The {@link Table} or {@link RecordQueryResult} you want the records from.
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
 *
 * @example
 * ```js
 *  import {useBase, useRecords} from '@airtable/blocks/interface/ui';
 *
 *  function MultiTableList() {
 *      const base = useBase();
 *
 *      // load every table's records in parallel — one suspend, not N
 *      const [tasks, projects, owners] = useRecords([
 *          base.getTableByName('Tasks'),
 *          base.getTableByName('Projects'),
 *          base.getTableByName('Owners'),
 *      ]);
 *
 *      return <Dashboard tasks={tasks} projects={projects} owners={owners} />;
 *  }
 * ```
 * @docsPath UI/hooks/useRecords
 * @hook
 */
export function useRecords(
    arg: Table | RecordQueryResult | null | ReadonlyArray<Table | RecordQueryResult | null>,
    opts?: TableQueryResultOpts,
): Array<Record> | null | Array<Array<Record> | null> {
    const isArrayInput = Array.isArray(arg);
    if (isArrayInput && opts !== undefined) {
        throw spawnError(
            'useRecords does not support passing opts together with an array of items. ' +
                'Build the query result with table.selectRecords(opts) instead.',
        );
    }

    const inputs: ReadonlyArray<Table | RecordQueryResult | null> = isArrayInput
        ? (arg as ReadonlyArray<Table | RecordQueryResult | null>)
        : [arg as Table | RecordQueryResult | null];

    const queryResults: ReadonlyArray<RecordQueryResult | null> = inputs.map((item) => {
        if (item instanceof Table) {
            return item.selectRecords(isArrayInput ? undefined : opts);
        }
        if (item instanceof RecordQueryResult) {
            if (!isArrayInput && opts !== undefined) {
                throw spawnError(
                    'useRecords does not support passing both a queryResult and opts.',
                );
            }
            return item;
        }
        if (item === null) {
            return null;
        }
        throw spawnError('useRecords array entries must be a Table, a RecordQueryResult, or null.');
    });

    const compactQueryResults = compact(queryResults);

    useLoadable(compactQueryResults);
    useWatchable(compactQueryResults, ['records', 'cellValues']);

    const recordsList = queryResults.map((queryResult) => {
        if (queryResult === null) {
            return null;
        }
        invariant(queryResult.isDataLoaded, 'Query result is not loaded');
        return queryResult.records;
    });

    return isArrayInput ? recordsList : recordsList[0];
}
