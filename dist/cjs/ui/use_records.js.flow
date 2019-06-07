// @flow
import {type RecordId} from '../types/record';
import type TableOrViewQueryResult from '../models/table_or_view_query_result';
import type LinkedRecordsQueryResult from '../models/linked_records_query_result';
import type Record from '../models/record';
import useLoadable from './use_loadable';
import useWatchable from './use_watchable';

type AnyQueryResult = TableOrViewQueryResult | LinkedRecordsQueryResult;

export function useRecordIds(queryResult: AnyQueryResult): Array<RecordId> {
    useLoadable(queryResult);
    useWatchable(queryResult, ['recordIds']);
    return queryResult.recordIds;
}

export function useRecords(queryResult: AnyQueryResult): Array<Record> {
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'cellValues', 'recordColors']);
    return queryResult.records;
}

export function useRecordById(queryResult: AnyQueryResult, recordId: RecordId): Record | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'recordColors']);
    const record = queryResult.getRecordByIdIfExists(recordId);
    useWatchable(record, ['cellValues']);
    return record;
}
