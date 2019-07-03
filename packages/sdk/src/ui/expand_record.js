// @flow
import getSdk from '../get_sdk';
import type Record from '../models/record';

/** @typedef */
export type ExpandRecordOpts = {
    records?: Array<Record>,
};

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record the record to expand
 * @param {object} [opts] An optional options object.
 * @param {Array<Record>} [opts.records] If `records` is provided, the list will be used to page through
 * records from the expanded record dialog.
 *
 * @example
 * import {expandRecord} from '@airtable/blocks/ui';
 * expandRecord(record1, {
 *     records: [record1, record2, record3],
 * });
 */
function expandRecord(record: Record, opts?: ExpandRecordOpts) {

    let recordIds = null;
    if (opts && opts.records) {
        recordIds = opts.records.map(r => r.id);
    }

    getSdk().__airtableInterface.expandRecord(record.parentTable.id, record.id, recordIds);
}

export default expandRecord;
