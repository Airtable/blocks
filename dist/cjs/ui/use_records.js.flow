// @flow
import {type RecordId} from '../types/record';
import type TableOrViewQueryResult from '../models/table_or_view_query_result';
import type LinkedRecordsQueryResult from '../models/linked_records_query_result';
import type Record from '../models/record';
import useLoadable from './use_loadable';
import useWatchable from './use_watchable';

type AnyQueryResult = TableOrViewQueryResult | LinkedRecordsQueryResult;

// TODO: should these hooks return [] if queryResult is null?

export function useRecordIds(queryResult: AnyQueryResult | null): Array<RecordId> | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['recordIds']);
    return queryResult ? queryResult.recordIds : null;
}

export function useRecords(queryResult: AnyQueryResult | null): Array<Record> | null {
    useLoadable(queryResult);
    useWatchable(queryResult, ['records', 'cellValues', 'recordColors']);
    return queryResult ? queryResult.records : null;
}

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
