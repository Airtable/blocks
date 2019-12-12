/** @module @airtable/blocks/ui: useRecords */ /** */
import {RecordId} from '../types/record';
import TableOrViewQueryResult from '../models/table_or_view_query_result';
import LinkedRecordsQueryResult from '../models/linked_records_query_result';
import Record from '../models/record';
import useLoadable from './use_loadable';
import useWatchable from './use_watchable';

/** */
type AnyQueryResult = TableOrViewQueryResult | LinkedRecordsQueryResult;

/** */
export function useRecordIds(queryResult: AnyQueryResult): Array<RecordId>;
/** */
export function useRecordIds(queryResult: null): null;

/**
 * A hook for working with the set of record IDs in a particular query result. Automatically
 * handles loading data in the query result and updating your component when the underlying
 * data changes.
 *
 * This hook doesn't re-render when the data _inside_ the records changes - only when records are
 * added, removed, or re-ordered.
 *
 * @param queryResult The query result you want the record ids from.
 * @returns The array of record IDs in the query result, or null if no
 * query result was passed in.
 *
 * @example
 * ```js
 *  import {useRecordIds, useBase} from '@airtable/blocks/ui';
 *
 *  function RecordCount() {
 *      // get a query result for the records in the first table
 *      const base = useBase();
 *      const table = base.tables[0];
 *      const queryResult = table.selectRecords();
 *
 *      // grab all the record ids from that QueryResult
 *      const recordIds = useRecordIds(queryResult);
 *
 *      // return the count
 *      return <span>record count in {table.name}: {recordIds.length}</span>;
 *  }
 * ```
 * @docsPath UI/hooks/useRecordIds
 * @hook
 */
export function useRecordIds(queryResult: AnyQueryResult | null): Array<RecordId> | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['recordIds']);
    return queryResult ? queryResult.recordIds : null;
}

/** */
export function useRecords(queryResult: AnyQueryResult): Array<Record>;
/** */
export function useRecords(queryResult: null): null;

/**
 * A hook for working with all the records (including their colors and cell values) in a
 * particular query result. Automatically handles loading data in the query result and updating
 * your component when the underlying data changes.
 *
 * This hook re-renders when any data concerning the records changing - that's useful, but can
 * cause re-renders quite often, meaning {@link useRecordIds} or {@link useRecordById} could be
 * more appropriate depending on your use case.
 *
 * @param queryResult The query result you want the records from.
 * @returns The records in the query result, or null if no query result was
 * passed in.
 *
 * @example
 * ```js
 *  import {useRecords, useBase} from '@airtable/blocks';
 *
 *  function RecordList() {
 *      // get a query result for the records in the first table
 *      const base = useBase();
 *      const table = base.tables[0];
 *      const queryResult = table.selectRecords();
 *
 *      // grab all the records from that query result
 *      const records = useRecords(queryResult);
 *
 *      // render a list of records:
 *      return (
 *          <ul>
 *              {records.map(record => {
 *                  return <li key={record.id}>{record.primaryCellValueAsString}</li>
 *              })}
 *          </ul>
 *      );
 *  }
 * ```
 * @docsPath UI/hooks/useRecords
 * @hook
 */
export function useRecords(queryResult: AnyQueryResult | null): Array<Record> | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'cellValues', 'recordColors']);
    return queryResult ? queryResult.records : null;
}
/* eslint-enable no-redeclare */

/**
 * A hook for working with a single record from a query result. Automatically handles loading data
 * in the query result and updating your component when the records cell values etc. change.
 *
 * Often used with {@link useRecordIds} to render a list of records where each list item only
 * updates when the specific record it concerns changes.
 *
 * @param queryResult The query result you want a record from.
 * @param recordId The ID of the record you want from the query result.
 * @returns The record, or null if no query result was passed in or no record with
 * that ID exists in the query result.
 *
 * @example
 * ```js
 *  import {useRecordById, useRecordIds, useBase} from '@airtable/blocks';
 *
 *  // this component concerns a single record - it only updates when that specific record updates
 *  function RecordListItem({queryResult, recordId}) {
 *      const record = useRecordById(queryResult, recordId);
 *      return <li>{record.primaryCellValueAsString}</li>;
 *  }
 *
 *  // this component renders a list of records, but doesn't update when their cell values change -
 *  // that's left up to RecordListItem
 *  function RecordList() {
 *      // get a query result for the records in the first table
 *      const base = useBase();
 *      const table = base.tables[0];
 *      const queryResult = table.selectRecords();
 *
 *      // grab all the record ids from that query result
 *      const recordIds = useRecordIds(queryResult);
 *
 *      // render a list of records:
 *      return (
 *          <ul>
 *              {recordsIds.map(recordId => {
 *                  return <RecordListItem key={recordId} recordId={recordId} queryResult={queryResult} />
 *              })}
 *          </ul>
 *      );
 *  }
 * ```
 * @docsPath UI/hooks/useRecordById
 * @hook
 */
export function useRecordById(
    queryResult: AnyQueryResult | null,
    recordId: RecordId,
): Record | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'recordColors']);
    const record = queryResult ? queryResult.getRecordByIdIfExists(recordId) : null;
    useWatchable(record, ['cellValues']);
    return record;
}
