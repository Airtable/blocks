// @flow
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import type Record from '../models/record';
import type Field from '../models/field';

/**
 * Expands a list of records in the Airtable UI, and prompts the user to pick
 * one. The selected record is returned to the block, and the modal is
 * automatically closed.
 *
 * If the user dismisses the modal, or another one is opened before this one
 * has been closed, it will return null.
 *
 * @param records the records the user can pick from. Duplicate records will be removed.
 * @param [opts] An optional options object.
 * @param [opts.fields] optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 * @param [opts.shouldAllowCreatingRecord] set to true to allow the user to create
 * an empty new record.
 *
 * @returns {Promise<record | null>} a Promise that resolves to the record
 * chosen by the user or null
 *
 * @example
 * import {expandRecordPickerAsync} from '@airtable/blocks/ui';
 *
 * const recordA = await expandRecordPickerAsync([record1, record2, record3]);
 * if (recordA !== null) {
 *     alert(recordA.primaryCellValueAsString);
 * } else {
 *     alert('no record picked');
 * }
 *
 * const recordB = await expandRecordPickerAsync([record1, record2], {
 *     fields: [field1, field2],
 * });
 */
async function expandRecordPickerAsync(
    records: Array<Record>,
    opts?: {
        fields?: Array<Field>,
        shouldAllowCreatingRecord?: boolean,
    },
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
        opts && opts.fields
            ? opts.fields.map(field => {
                  invariant(
                      field.parentTable.id === tableId,
                      'all fields must belong to the same table',
                  );
                  return field.id;
              })
            : null;

    const sdk = getSdk();
    const shouldAllowCreatingRecord = !!opts && !!opts.shouldAllowCreatingRecord;
    const chosenRecordId = await sdk.__airtableInterface.expandRecordPickerAsync(
        tableId,
        recordIds,
        fieldIds,
        shouldAllowCreatingRecord,
    );

    if (!chosenRecordId) {
        return null;
    }

    const table = sdk.base.getTableByIdIfExists(tableId);
    if (!table) {
        return null;
    }

    return sdk.base.__getRecordStore(table.id).getRecordByIdIfExists(chosenRecordId);
}

export default expandRecordPickerAsync;
