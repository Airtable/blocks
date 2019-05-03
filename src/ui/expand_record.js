// @flow
import getSdk from '../get_sdk';

import type Record from '../models/record';

export type ExpandRecordOpts = {
    records?: Array<Record>,
};

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record the record to expand
 * @param opts If `records` is provided, the list will be used to page through
 * records from the expanded record dialog.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.expandRecord(record1, {
 *     records: [record1, record2, record3],
 * });
 */
function expandRecord(record: Record, opts?: ExpandRecordOpts) {
    // TODO(kasra): this will cause the liveapp page to force a refresh if the
    // tableId and recordId are both valid, but the recordId does not
    // exist in the table.

    let recordIds = null;
    if (opts && opts.records) {
        recordIds = opts.records.map(r => r.id);
    }

    getSdk().__airtableInterface.expandRecord(record.parentTable.id, record.id, recordIds);
}

export default expandRecord;
