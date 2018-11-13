// @flow
const invariant = require('invariant');
const getFrontendSdk = require('block_sdk/frontend/get_frontend_sdk');

import type Record from 'block_sdk/shared/models/record';
import type Field from 'block_sdk/shared/models/field';

/**
 * Expands a list of records in the Airtable UI
 *
 * @param records the records to expand. Duplicate records will be removed.
 * @param opts.fields optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.expandRecordList([record1, record2, record3]);
 *
 * UI.expandRecordList([record1, record2], {
 *     fields: [field1, field2],
 * });
 */
function expandRecordList(records: Array<Record>, opts?: {
    fields?: Array<Field>,
}) {
    if (records.length === 0) {
        return;
    }

    const tableId = records[0].parentTable.id;

    const recordIds = records.map(record => {
        invariant(record.parentTable.id === tableId, 'all records must belong to the same table');
        return record.id;
    });

    const fieldIds = opts && opts.fields ? opts.fields.map(field => {
        invariant(field.parentTable.id === tableId, 'all fields must belong to the same table');
        return field.id;
    }) : null;

    getFrontendSdk().__airtableInterface.expandRecordList(
        tableId,
        recordIds,
        fieldIds,
    );
}

module.exports = expandRecordList;
