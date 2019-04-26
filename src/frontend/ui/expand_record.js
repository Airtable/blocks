// @flow
const getFrontendSdk = require('block_sdk/frontend/get_frontend_sdk');

import type Record from 'block_sdk/shared/models/record';

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

    getFrontendSdk().__airtableInterface.expandRecord(record.parentTable.id, record.id, recordIds);
}

module.exports = expandRecord;
