/** @module @airtable/blocks/ui: useRecords */ /** */
import {spawnError} from '../error_utils';
import {RecordId} from '../types/record';
import Table from '../models/table';
import TableOrViewQueryResult from '../models/table_or_view_query_result';
import LinkedRecordsQueryResult from '../models/linked_records_query_result';
import RecordQueryResult, {
    RecordQueryResultOpts,
    RecordIdQueryResultOpts,
    SingleRecordQueryResultOpts,
} from '../models/record_query_result';
import Record from '../models/record';
import * as RecordColoring from '../models/record_coloring';
import View from '../models/view';
import useLoadable from './use_loadable';
import useWatchable from './use_watchable';

/** */
type AnyQueryResult = TableOrViewQueryResult | LinkedRecordsQueryResult;
/** */
type TableOrViewOrQueryResult = Table | View | AnyQueryResult;

/** */
export function useRecordIds(
    tableOrView: Table | View,
    opts?: RecordIdQueryResultOpts,
): Array<RecordId>;
/** */
export function useRecordIds(queryResult: AnyQueryResult): Array<RecordId>;
/** */
export function useRecordIds(tableOrViewOrQueryResult: null): null;

/**
 * A hook for working with a set of record IDs from a table, view or query result. Automatically
 * handles loading data and updating your component when the underlying data changes.
 *
 * This hook doesn't re-render when the data _inside_ the records changes - only when records are
 * added, removed, or re-ordered. Use this over {@link useRecords} when you want to avoid watching
 * cell data for all records. Use with {@link useRecordById} to only watch cell data for certain
 * records.
 *
 * Under the hood, this hook creates a {@link TableOrViewQueryResult} if passed a table or view.
 * Pass a query result if you want direct access to it (e.g. for `queryResult.getRecordById`).
 *
 * Returns an array of record IDs, or null if no model was passed in.
 *
 * @param tableOrViewOrQueryResult The {@link Table}, {@link View} or {@link RecordQueryResult} you want the record ids from.
 * @param opts? If passing a Table or View, optional {@link RecordIdsQueryResultOpts} to control the results.
 * @example
 * ```js
 *  import {useRecordIds, useBase} from '@airtable/blocks/ui';
 *
 *  function RecordCount() {
 *      const base = useBase();
 *      const table = base.tables[0];
 *
 *      // grab all the record ids from that table
 *      const recordIds = useRecordIds(table);
 *
 *      // return the count
 *      return <span>record count in {table.name}: {recordIds.length}</span>;
 *  }
 * ```
 * @docsPath UI/hooks/useRecordIds
 * @hook
 */
export function useRecordIds(
    tableOrViewOrQueryResult: TableOrViewOrQueryResult | null,
    opts?: RecordIdQueryResultOpts,
): Array<RecordId> | null {
    let queryResult;
    if (tableOrViewOrQueryResult instanceof Table || tableOrViewOrQueryResult instanceof View) {
        queryResult = tableOrViewOrQueryResult.selectRecords({
            fields: [],
            recordColorMode: RecordColoring.modes.none(),
            sorts: opts ? opts.sorts : undefined,
        });
    } else {
        if (tableOrViewOrQueryResult instanceof RecordQueryResult && opts !== undefined) {
            throw spawnError('useRecordIds does not support passing both a queryResult and opts.');
        }
        queryResult = tableOrViewOrQueryResult;
    }

    useLoadable(queryResult);
    useWatchable(queryResult, ['recordIds']);
    return queryResult ? queryResult.recordIds : null;
}

/** */
export function useRecords(tableOrView: Table | View, opts?: RecordQueryResultOpts): Array<Record>;
/** */
export function useRecords(queryResult: AnyQueryResult): Array<Record>;
/** */
export function useRecords(tableOrViewOrQueryResult: null): null;

/**
 * A hook for working with all of the records (including their colors and cell values) in a
 * particular table, view or query result. Automatically handles loading data and updating
 * your component when the underlying data changes.
 *
 * This hook re-renders when any data concerning the records changes, including cell values - that's
 * useful, but can cause re-renders quite often, meaning {@link useRecordIds} or
 * {@link useRecordById} could be more appropriate depending on your use case.
 *
 * Under the hood, this hook creates a {@link TableOrViewQueryResult} if passed a table or view.
 * Pass a query result if you want direct access to it (e.g. for `queryResult.getRecordById`).
 *
 * Returns a list of records, or null if no model was passed in.
 *
 * @param tableOrViewOrQueryResult The {@link Table}, {@link View} or {@link RecordQueryResult} you want the records from.
 * @param opts? If passing a Table or View, optional {@link RecordQueryResultOpts} to control the results.
 * @example
 * ```js
 *  import {useRecords, useBase} from '@airtable/blocks/ui';
 *
 *  function GetRecords() {
 *      const base = useBase();
 *      const table = base.tables[0];
 *      const view = table.views[0];
 *      let records;
 *
 *      // Returns all records in the table
 *      records = useRecords(table);
 *
 *      // Equivalent to the above - useful if you want to reuse the queryResult elsewhere
 *      const queryResult = table.selectRecords();
 *      records = useRecords(queryResult);
 *
 *      // Returns all records for a view
 *      records = useRecords(view)
 *
 *      // Returns all records in a table, only loading data for the specified fields
 *      records = useRecords(table, {fields: ['My field']});
 *
 *      // Returns all records in a table, sorting the records by values in the specified fields
 *      records = useRecords(table, {sorts: [
 *         // sort by 'My field' in ascending order...
 *         {field: 'My field'},
 *         // then by 'My other field' in descending order
 *         {field: 'My other field', direction: 'desc'},
 *      ]});
 *  }
 * ```
 *
 * @example
 * ```js
 *  import {useRecords, useBase} from '@airtable/blocks/ui';
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
 *                  return <li key={record.id}>{record.name}</li>
 *              })}
 *          </ul>
 *      );
 *  }
 * ```
 * @docsPath UI/hooks/useRecords
 * @hook
 */
export function useRecords(
    tableOrViewOrQueryResult: TableOrViewOrQueryResult | null,
    opts?: RecordQueryResultOpts,
): Array<Record> | null {
    let queryResult;
    if (tableOrViewOrQueryResult instanceof Table || tableOrViewOrQueryResult instanceof View) {
        queryResult = tableOrViewOrQueryResult.selectRecords(opts);
    } else {
        if (tableOrViewOrQueryResult instanceof RecordQueryResult && opts !== undefined) {
            throw spawnError('useRecords does not support passing both a queryResult and opts.');
        }
        queryResult = tableOrViewOrQueryResult;
    }

    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'cellValues', 'recordColors']);
    return queryResult ? queryResult.records : null;
}

/** */
export function useRecordById(
    tableOrView: Table | View,
    recordId: RecordId,
    opts?: SingleRecordQueryResultOpts,
): Record | null;

/** */
export function useRecordById(queryResult: AnyQueryResult, recordId: RecordId): Record | null;

/**
 * A hook for working with a single record. Automatically handles loading data and updating your
 * component when the record's cell values etc. change.
 *
 * Often used with {@link useRecordIds} to render a list of records where each list item only
 * updates when the specific record it concerns changes.
 *
 * Under the hood, this hook creates a {@link TableOrViewQueryResult} if passed a table or view.
 * Pass a query result if you want direct access to it (e.g. for `queryResult.getRecordById`).
 *
 * Returns the specified record, or null if no model was passed in, or no record with that ID exists
 * in the model.
 *
 * @param tableOrViewOrQueryResult The {@link Table}, {@link View} or {@link RecordQueryResult} you want a record from.
 * @param recordId The ID of the record you want.
 * @param opts? If passing a Table or View, optional {@link SingleRecordQueryResultOpts} to control the results.
 * @example
 * ```js
 *  import {useRecordById, useRecordIds, useBase} from '@airtable/blocks/ui';
 *
 *  // this component concerns a single record - it only updates when that specific record updates
 *  function RecordListItem({table, recordId}) {
 *      const record = useRecordById(table, recordId);
 *      return <li>{record.name}</li>;
 *  }
 *
 *  // this component renders a list of records, but doesn't update when their cell values change -
 *  // that's left up to RecordListItem
 *  function RecordList() {
 *      const base = useBase();
 *      const table = base.tables[0];
 *
 *      // grab all the record ids from the table
 *      const recordIds = useRecordIds(table);
 *
 *      // render a list of records:
 *      return (
 *          <ul>
 *              {recordIds.map(recordId => {
 *                  return <RecordListItem key={recordId} recordId={recordId} table={table} />
 *              })}
 *          </ul>
 *      );
 *  }
 * ```
 * @docsPath UI/hooks/useRecordById
 * @hook
 */
export function useRecordById(
    tableOrViewOrQueryResult: TableOrViewOrQueryResult | null,
    recordId: RecordId,
    opts?: SingleRecordQueryResultOpts,
): Record | null {
    let queryResult;
    if (tableOrViewOrQueryResult instanceof Table || tableOrViewOrQueryResult instanceof View) {
        queryResult = tableOrViewOrQueryResult.selectRecords(opts);
    } else {
        if (tableOrViewOrQueryResult instanceof RecordQueryResult && opts !== undefined) {
            throw spawnError('useRecordById does not support passing both a queryResult and opts.');
        }
        queryResult = tableOrViewOrQueryResult;
    }

    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'recordColors']);
    const record = queryResult ? queryResult.getRecordByIdIfExists(recordId) : null;
    useWatchable(record, ['cellValues']);
    return record;
}
