/** @module @airtable/blocks/ui: expandRecord */ /** */
import Record from '../models/record';

/**
 * Options object for expanding a record.
 */
export interface ExpandRecordOpts {
    /** If `records` is provided, the list will be used to page through records from the expanded record dialog. */
    records?: Array<Record>;
}

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record The record to expand.
 * @param opts An optional options object.
 *
 * @example
 * ```js
 * import {expandRecord} from '@airtable/blocks/base/ui';
 * expandRecord(record1, {
 *     records: [record1, record2, record3],
 * });
 * ```
 * @docsPath UI/utils/expandRecord
 */
function expandRecord(record: Record, opts?: ExpandRecordOpts) {

    let recordIds = null;
    if (opts && opts.records) {
        recordIds = opts.records.map(r => r.id);
    }

    record.parentTable.parentBase.__sdk.__airtableInterface.expandRecord(
        record.parentTable.id,
        record.id,
        recordIds,
    );
}

export default expandRecord;
