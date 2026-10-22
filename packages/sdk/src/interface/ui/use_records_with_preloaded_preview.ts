/** @module @airtable/blocks/interface/ui: unstable_useRecordsWithPreloadedPreview */ /** */
import {useDeferredValue} from 'react';
import {spawnError} from '../../shared/error_utils';
import useArrayIdentity from '../../shared/ui/use_array_identity';
import {type Field} from '../models/field';
import {PreloadedRecordsQueryResult} from '../models/preloaded_records_query_result';
import {type Record} from '../models/record';
import {RecordQueryResult} from '../models/record_query_result';
import {Table} from '../models/table';
import {TableQueryResult} from '../models/table_query_result';
import {usePreloadedRecordsByTable, type PreloadedRecords} from './use_preloaded_records';
import {useRecords} from './use_records';

/**
 * The value returned by {@link unstable_useRecordsWithPreloadedPreview} while it returns the
 * records that Airtable preloaded.
 */
export interface PreloadedRecordsPreview extends PreloadedRecords {
    /** Always `true`: only the fields in `fields` are readable on `records`. */
    isPreview: true;
    /**
     * The fields you can read on `records`: the preloaded fields or, for a query result created
     * with `fields`, the preloaded fields among those. Reading the cell value of any other field
     * throws.
     */
    fields: ReadonlyArray<Field>;
}

/**
 * The value returned by {@link unstable_useRecordsWithPreloadedPreview} once every record is
 * loaded.
 */
export interface LoadedRecords {
    /** Always `false`: every record is loaded. */
    isPreview: false;
    /** Every record, the same as {@link useRecords} returns. */
    records: Array<Record>;
    /**
     * The fields you can read on `records`, in the table's order: every field of the table or,
     * for a query result created with `fields`, those fields.
     */
    fields: ReadonlyArray<Field>;
}

/**
 * The value returned by {@link unstable_useRecordsWithPreloadedPreview}: a
 * {@link PreloadedRecordsPreview} while every record loads, then {@link LoadedRecords}. Check
 * `isPreview` to tell them apart.
 */
export type RecordsWithPreloadedPreview = PreloadedRecordsPreview | LoadedRecords;

/** */
export function unstable_useRecordsWithPreloadedPreview(
    tableOrQueryResult: Table | RecordQueryResult,
): RecordsWithPreloadedPreview;
/** */
export function unstable_useRecordsWithPreloadedPreview(
    tableOrQueryResult: Table | RecordQueryResult | null,
): RecordsWithPreloadedPreview | null;
/** */
export function unstable_useRecordsWithPreloadedPreview(
    items: ReadonlyArray<Table | RecordQueryResult | null>,
): Array<RecordsWithPreloadedPreview | null>;
/**
 * A hook for working with every record of a table or query result, which shows the records that
 * Airtable preloaded for your extension while it loads them.
 *
 * **Unstable:** this hook may have breaking changes in a future release. Import it under its
 * stable name, as in the examples, so that the React Hooks lint rules treat it as a hook.
 *
 * It returns the same records as {@link useRecords}, except that while they load it returns the
 * preloaded records (see {@link unstable_usePreloadedRecords}) instead of suspending. The result
 * has `isPreview: true` while it holds the preloaded records, which have only some fields and at
 * most `rowLimit` records, and `isPreview: false` once it holds every record. Only read the fields
 * in `fields`: reading the cell value of any other field throws.
 *
 * The preloaded records are the first records of the whole table. So a table gets a preview, and so
 * does a query result from `table.selectRecords()` without the `records` option. For a query result
 * created with `fields`, the preview only has the preloaded fields among those, which can be none
 * of them. Any other query result, such as one for a record's linked records, never gets a preview
 * and suspends like `useRecords(queryResult)`.
 *
 * When nothing of the table was preloaded, including while a search term filters the element's
 * records, it suspends until every record is loaded, like `useRecords`. It also suspends if the
 * preloaded records go away before every record is loaded. If every record is already loaded, for
 * example by another component, it returns them straight away. Once it has returned every record,
 * it never goes back to the preview. When the table or query result changes, it returns the new
 * one's preview, if there is one, while its records load.
 *
 * You don't need a `<Suspense>` boundary of your own to show the preview: every record loads in a
 * background render, which suspends without hiding the preview. If you update your component in a
 * transition (`startTransition`) while it shows the preview, React waits for every record to load
 * before showing that update, as it does for `useDeferredValue`.
 *
 * To work with several tables or query results, pass an array of them, which can contain `null`s,
 * rather than calling the hook once for each. Like the array form of `useRecords`, it loads all of
 * their records in parallel, and returns one result per entry, in order, with `null` for each
 * `null`. Each result has its own `isPreview`. It returns previews only while every entry has a
 * preview or already-loaded records; otherwise it suspends until every entry's records are loaded.
 * The records load in one background render, which shows them all together, but a re-render can
 * show an entry's records as soon as they're loaded.
 *
 * Returns `null` for `null`.
 *
 * @param tableOrQueryResult The {@link Table} or {@link RecordQueryResult} you want the records
 * from, or an array of them.
 *
 * @example
 * ```js
 * import {
 *     useBase,
 *     unstable_useRecordsWithPreloadedPreview as useRecordsWithPreloadedPreview,
 * } from '@airtable/blocks/interface/ui';
 *
 * function TaskList() {
 *     const table = useBase().getTableByName('Tasks');
 *     // The preloaded records first, if there are any, then every record.
 *     const {records, fields, isPreview} = useRecordsWithPreloadedPreview(table);
 *     return (
 *         <table style={{opacity: isPreview ? 0.6 : 1}}>
 *             <tbody>
 *                 {records.map(record => (
 *                     <tr key={record.id}>
 *                         {fields.map(field => (
 *                             <td key={field.id}>{record.getCellValueAsString(field)}</td>
 *                         ))}
 *                     </tr>
 *                 ))}
 *             </tbody>
 *         </table>
 *     );
 * }
 * ```
 *
 * @example
 * ```js
 * import {
 *     useBase,
 *     unstable_useRecordsWithPreloadedPreview as useRecordsWithPreloadedPreview,
 * } from '@airtable/blocks/interface/ui';
 *
 * function TaskStatuses() {
 *     const table = useBase().getTableByName('Tasks');
 *     const statusField = table.getFieldByName('Status');
 *     // Only loads the primary field and Status. The preview has whichever of them were preloaded.
 *     const {records, fields, isPreview} = useRecordsWithPreloadedPreview(
 *         table.selectRecords({fields: [statusField]}),
 *     );
 *     const canShowStatus = fields.includes(statusField);
 *     return (
 *         <ul style={{opacity: isPreview ? 0.6 : 1}}>
 *             {records.map(record => (
 *                 <li key={record.id}>
 *                     {record.name}
 *                     {canShowStatus ? `: ${record.getCellValueAsString(statusField)}` : ''}
 *                 </li>
 *             ))}
 *         </ul>
 *     );
 * }
 * ```
 *
 * @example
 * ```js
 * import {
 *     useBase,
 *     unstable_useRecordsWithPreloadedPreview as useRecordsWithPreloadedPreview,
 * } from '@airtable/blocks/interface/ui';
 *
 * function TasksAndProjects() {
 *     const base = useBase();
 *     // Loads both tables in parallel.
 *     const [tasks, projects] = useRecordsWithPreloadedPreview([
 *         base.getTableByName('Tasks'),
 *         base.getTableByName('Projects'),
 *     ]);
 *     return <Dashboard tasks={tasks} projects={projects} />;
 * }
 * ```
 * @docsPath UI/hooks/unstable_useRecordsWithPreloadedPreview
 * @hook
 */
export function unstable_useRecordsWithPreloadedPreview(
    arg: Table | RecordQueryResult | null | ReadonlyArray<Table | RecordQueryResult | null>,
): RecordsWithPreloadedPreview | null | Array<RecordsWithPreloadedPreview | null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRecordsWithPreloadedPreview(arg);
}

/** @internal */
function useRecordsWithPreloadedPreview(
    arg: Table | RecordQueryResult | null | ReadonlyArray<Table | RecordQueryResult | null>,
): RecordsWithPreloadedPreview | null | Array<RecordsWithPreloadedPreview | null> {
    const isArrayInput = Array.isArray(arg);
    const items: ReadonlyArray<Table | RecordQueryResult | null> = isArrayInput
        ? (arg as ReadonlyArray<Table | RecordQueryResult | null>)
        : [arg as Table | RecordQueryResult | null];

    const queryResults = useArrayIdentity(items.map(getQueryResult));
    const previews = usePreloadedRecordsByTable(
        queryResults.map(getWholeTableOrNull),
        queryResults.map((queryResult) => queryResult?._fieldIdsOrNullIfAllFields ?? null),
    );
    const deferredQueryResults = useDeferredValue<ReadonlyArray<RecordQueryResult | null> | null>(
        queryResults,
        null,
    );
    const isPreviewByIndex = queryResults.map(
        (queryResult, index) =>
            queryResult !== null &&
            previews[index] !== null &&
            !queryResult.isDataLoaded &&
            !(deferredQueryResults?.includes(queryResult) ?? false),
    );
    const mustSuspend = queryResults.some(
        (queryResult, index) =>
            queryResult !== null && !isPreviewByIndex[index] && !queryResult.isDataLoaded,
    );
    const recordsByIndex = useRecords(
        mustSuspend
            ? queryResults
            : queryResults.map((queryResult, index) =>
                  isPreviewByIndex[index] ? null : queryResult,
              ),
    );

    const results = queryResults.map((queryResult, index): RecordsWithPreloadedPreview | null => {
        const preview = previews[index];
        if (isPreviewByIndex[index] && preview !== null) {
            return {...preview, isPreview: true};
        }
        const records = recordsByIndex[index];
        if (queryResult === null || records === null) {
            return null;
        }
        return {isPreview: false, records, fields: getFieldsInTableOrder(queryResult)};
    });
    return isArrayInput ? results : results[0];
}

/** @internal */
function getQueryResult(item: Table | RecordQueryResult | null): RecordQueryResult | null {
    if (item === null) {
        return null;
    }
    if (item instanceof Table) {
        return item.selectRecords();
    }
    if (item instanceof PreloadedRecordsQueryResult) {
        throw spawnError(
            'unstable_useRecordsWithPreloadedPreview does not accept preloaded records. ' +
                'Use unstable_usePreloadedRecords instead.',
        );
    }
    if (item instanceof RecordQueryResult) {
        return item;
    }
    throw spawnError(
        'unstable_useRecordsWithPreloadedPreview only accepts a Table, a RecordQueryResult, ' +
            'null, or an array of them.',
    );
}

/**
 * The table of the query result if the query result has every record of that table, in the same
 * order as the preloaded records, so that those are its first records. Otherwise null.
 *
 * @internal
 */
function getWholeTableOrNull(queryResult: RecordQueryResult | null): Table | null {
    if (
        queryResult instanceof TableQueryResult &&
        queryResult._normalizedOpts.recordIdsOrNullIfAllRecords === null
    ) {
        return queryResult.parentTable;
    }
    return null;
}

/**
 * The fields of the query result in the table's order, rather than the sorted order in which
 * `TableQueryResult` stores them.
 *
 * @internal
 */
function getFieldsInTableOrder(queryResult: RecordQueryResult): ReadonlyArray<Field> {
    const fieldIds = queryResult._fieldIdsOrNullIfAllFields;
    const tableFields = queryResult.parentTable.fields;
    if (fieldIds === null) {
        return tableFields;
    }
    const fieldIdSet = new Set(fieldIds);
    return tableFields.filter((field) => fieldIdSet.has(field.id));
}
