/** @module @airtable/blocks/interface/ui: unstable_usePreloadedRecords */ /** */
import {compact} from '../../shared/private_utils';
import {type FieldId} from '../../shared/types/hyper_ids';
import useWatchable from '../../shared/ui/use_watchable';
import {type Field} from '../models/field';
import {type Record} from '../models/record';
import {type Table} from '../models/table';

/**
 * The value returned by {@link unstable_usePreloadedRecords}.
 */
export interface PreloadedRecords {
    /** At most `rowLimit` records, in the same order as `useRecords(table)`. */
    records: Array<Record>;
    /** The preloaded fields. Reading the cell value of any other field from `records` throws. */
    fields: ReadonlyArray<Field>;
    /** The maximum number of records that were preloaded. */
    rowLimit: number;
    /** Whether more records match than were preloaded. */
    hasMoreRecords: boolean;
}

/**
 * A hook for working with the first records of a table that Airtable preloaded for your
 * extension, so you can show them straight away. The builder chooses, per table, whether to
 * preload records, which fields, and how many records.
 *
 * **Unstable:** this hook may have breaking changes in a future release. Import it under its
 * stable name, as in the example, so that the React Hooks lint rules treat it as a hook.
 *
 * Unlike {@link useRecords}, this hook never suspends and never loads data. It returns `null`
 * when no records of this table were preloaded, which includes while a search term filters the
 * element's records, and re-renders your component when preloaded records arrive or change.
 *
 * The preloaded records are the first `rowLimit` records that `useRecords(table)` returns, with
 * only some of the fields. A good pattern is to render a preview of your UI from the preloaded
 * records while `useRecords` loads all the records in a nested `<Suspense>`, then swap in the full
 * data. {@link unstable_useRecordsWithPreloadedPreview} does this for you in a single hook.
 *
 * Only read the fields in `fields`: reading the cell value of any other field throws. If
 * `hasMoreRecords` is false and `fields` covers what your UI needs, you may not need to load all
 * the records at all.
 *
 * @param table The {@link Table} you want the preloaded records from.
 *
 * @example
 * ```js
 * import {Suspense} from 'react';
 * import {
 *     useBase,
 *     useRecords,
 *     unstable_usePreloadedRecords as usePreloadedRecords,
 * } from '@airtable/blocks/interface/ui';
 *
 * function TasksBlock() {
 *     const table = useBase().getTableByName('Tasks');
 *     // Never suspends. Null if nothing was preloaded.
 *     const preview = usePreloadedRecords(table);
 *     const fallback = preview ? (
 *         <TaskList records={preview.records} fields={preview.fields} isPreview />
 *     ) : (
 *         <Spinner />
 *     );
 *     return (
 *         <Suspense fallback={fallback}>
 *             <FullTaskList table={table} />
 *         </Suspense>
 *     );
 * }
 *
 * function FullTaskList({table}) {
 *     // All records. Suspends, showing the preview, until they are loaded.
 *     const records = useRecords(table);
 *     return <TaskList records={records} fields={table.fields} />;
 * }
 * ```
 * @docsPath UI/hooks/unstable_usePreloadedRecords
 * @hook
 */
export function unstable_usePreloadedRecords(table: Table | null): PreloadedRecords | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePreloadedRecordsByTable([table])[0];
}

/**
 * {@link unstable_usePreloadedRecords} for several tables, with the same number of hook calls
 * for any number of tables. Returns one entry per table, in order. When `requestedFieldIdsByIndex`
 * has field ids for an entry, that entry only has the preloaded fields among them.
 *
 * @internal
 */
export function usePreloadedRecordsByTable(
    tables: ReadonlyArray<Table | null>,
    requestedFieldIdsByIndex: ReadonlyArray<ReadonlyArray<FieldId> | null> = [],
): Array<PreloadedRecords | null> {
    const liveTables = tables.map((table) => (table && !table.isDeleted ? table : null));
    useWatchable(
        getUniqueModels(
            liveTables.map((table) => table && table.parentBase.__getRecordStore(table.id)),
        ),
        ['preloadedRecords'],
    );
    useWatchable(getUniqueModels(tables.map((table) => table?.parentBase ?? null)), ['schema']);

    const preloadedRecordsQueryResults = liveTables.map((table, index) => {
        const preloadedRecordsQueryResult = table && table.unstable_selectPreloadedRecords();
        const requestedFieldIds = requestedFieldIdsByIndex[index] ?? null;
        if (preloadedRecordsQueryResult === null || requestedFieldIds === null) {
            return preloadedRecordsQueryResult;
        }
        return preloadedRecordsQueryResult._selectForRequestedFieldIds(requestedFieldIds);
    });
    useWatchable(getUniqueModels(preloadedRecordsQueryResults), [
        'records',
        'cellValues',
        'hasMoreRecords',
    ]);

    return preloadedRecordsQueryResults.map((preloadedRecordsQueryResult) => {
        if (preloadedRecordsQueryResult === null || !preloadedRecordsQueryResult.isDataLoaded) {
            return null;
        }
        return {
            records: preloadedRecordsQueryResult.records,
            fields: preloadedRecordsQueryResult.fields,
            rowLimit: preloadedRecordsQueryResult.rowLimit,
            hasMoreRecords: preloadedRecordsQueryResult.hasMoreRecords,
        };
    });
}

/** @internal */
function getUniqueModels<T>(models: ReadonlyArray<T | null>): Array<T> {
    return Array.from(new Set(compact(models)));
}
