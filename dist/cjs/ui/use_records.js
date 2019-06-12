"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRecordIds = useRecordIds;
exports.useRecords = useRecords;
exports.useRecordById = useRecordById;

var _use_loadable = _interopRequireDefault(require("./use_loadable"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

// eslint-disable-line no-redeclare

/**
 * A hook for working with the set of record IDs in a particular query result. Automatically
 * handles loading data in the query result and updating your component when the underlying
 * data changes.
 *
 * This hook doesn't re-render when the data _inside_ the records changes - only when records are
 * added, removed, or re-ordered.
 *
 * @param {QueryResult} queryResult the query result you want the record ids from
 * @returns {Array<RecordId> | null} the array of record IDs in the query result, or null if no
 * query result was passed in.
 *
 * @example
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
 */
function useRecordIds(queryResult) {
  // eslint-disable-line no-redeclare
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['recordIds']);
  return queryResult ? queryResult.recordIds : null;
}

// eslint-disable-line no-redeclare

/**
 * A hook for working with all the records (including their colors and cell values) in a
 * particular query result. Automatically handles loading data in the query result and updating
 * your component when the underlying data changes.
 *
 * This hook re-renders when any data concerning the records changing - that's useful, but can
 * cause re-renders quite often, meaning {@link useRecordIds} or {@link useRecordById} could be
 * more appropriate depending on your use-case.
 *
 * @param {QueryResult | null} queryResult the query result you want the records from
 * @returns {Array<Record> | null} the records in the query result, or null if no query result was
 * passed in.
 *
 * @example
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
 */
function useRecords(queryResult) {
  // eslint-disable-line no-redeclare
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'cellValues', 'recordColors']);
  return queryResult ? queryResult.records : null;
}
/**
 * A hook for working with a single record from a query result. Automatically handles loading data
 * in the query result and updating your component when the records cell values etc. change.
 *
 * Often used with {@link useRecordIds} to render a list of records where each list item only
 * updates when the specific record it concerns changes.
 *
 * @param {QueryResult | null} queryResult the query result you want a record from
 * @param {RecordId} recordId the ID of the record you want from the query result
 * @returns {Record | null} the record, or null if no query result was passed in or no record with
 * that ID exists in the query result
 *
 * @example
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
 */


function useRecordById(queryResult, recordId) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'recordColors']);
  var record = queryResult ? queryResult.getRecordByIdIfExists(recordId) : null;
  (0, _use_watchable.default)(record, ['cellValues']);
  return record;
}