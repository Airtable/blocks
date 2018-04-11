// @flow
const invariant = require('invariant');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const getSdk = require('client/blocks/sdk/get_sdk');
const {HostMethodNames} = require('client/blocks/block_message_types');

import type Record from 'client/blocks/sdk/models/record';
import type Field from 'client/blocks/sdk/models/field';

/**
 * Expands a list of records in the Airtable UI, and prompts the user to pick
 * one. The selected record is returned to the block, and the modal is
 * automatically closed.
 *
 * If the user dismisses the modal, or another one is opened before this one
 * has been closed, it will return null.
 *
 * @param records the records the user can pick from. Duplicate records will be removed.
 * @param opts.fields optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 *
 * @returns {Promise<record | null>} a Promise that resolves to the record
 * chosen by the user or null
 *
 * @example
 * import {UI} from 'airtable-block';
 *
 * const record = await UI.expandRecordPickerAsync([record1, record2, record3]);
 * if (record !== null) {
 *   alert(record.primaryCellValueAsString);
 * } else {
 *   alert('no record picked');
 * }
 *
 * const record = await UI.expandRecordPickerAsync([record1, record2], {
 *     fields: [field1, field2],
 * });
 */
async function expandRecordPickerAsync(
    records: Array<Record>,
    opts?: {
        fields?: Array<Field>,
    }
): Promise<Record | null> {
    if (records.length === 0) {
        return null;
    }

    const tableId = records[0].parentTable.id;

    const recordIds = records.map(record => {
        invariant(record.parentTable.id === tableId, 'all records must belong to the same table');
        return record.id;
    });

    const fieldIds =
        opts && opts.fields ?
            opts.fields.map(field => {
                invariant(
                    field.parentTable.id === tableId,
                    'all fields must belong to the same table'
                );
                return field.id;
            }) :
            null;

    const chosenRecordId = await liveappInterface.callHostMethodAsync(
        HostMethodNames.EXPAND_RECORD_PICKER,
        {tableId, recordIds, fieldIds}
    );

    if (!chosenRecordId) {
        return null;
    }

    const table = getSdk().base.getTableById(tableId);
    if (!table) {
        // table has probably been deleted
        return null;
    }

    return table.getRecordById(chosenRecordId);
}

module.exports = expandRecordPickerAsync;
