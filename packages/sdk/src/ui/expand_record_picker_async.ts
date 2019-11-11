/** @module @airtable/blocks/ui: expandRecordPickerAsync */ /** */
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import Record from '../models/record';
import Field from '../models/field';

/**
 * Options object for expanding a record picker.
 */
interface ExpandRecordPickerOpts {
    /** The fields to include in the record cards. The primary field will always be shown. Duplicate fields will be removed. */
    fields?: Array<Field>;
    /** If set to true, the user will be able to create an empty new record from the record picker. */
    shouldAllowCreatingRecord?: boolean;
}

/**
 * Expands a list of records in the Airtable UI, and prompts the user to pick
 * one. The selected record is returned to the block, and the modal is
 * automatically closed.
 *
 * If the user dismisses the modal, or another one is opened before this one
 * has been closed, it will return null.
 *
 * @param records the records the user can pick from. Duplicate records will be removed.
 * @param opts An optional options object.
 * @returns A Promise that resolves to the record chosen by the user or null.
 *
 * @example
 * ```js
 * import {expandRecordPickerAsync} from '@airtable/blocks/ui';
 *
 * async function pickRecordsAsync() {
 *     const recordA = await expandRecordPickerAsync([record1, record2, record3]);
 *     if (recordA !== null) {
 *         alert(recordA.primaryCellValueAsString);
 *     } else {
 *         alert('no record picked');
 *     }
 *
 *     const recordB = await expandRecordPickerAsync([record1, record2], {
 *         fields: [field1, field2],
 *     });
 * }
 * ```
 */
async function expandRecordPickerAsync(
    records: Array<Record>,
    opts?: ExpandRecordPickerOpts,
): Promise<Record | null> {
    if (records.length === 0) {
        return null;
    }

    const tableId = records[0].parentTable.id;

    const recordIds = records.map(record => {
        if (!(record.parentTable.id === tableId)) {
            throw spawnInvariantViolationError('all records must belong to the same table');
        }
        return record.id;
    });

    const fieldIds =
        opts && opts.fields
            ? opts.fields.map(field => {
                  if (!(field.parentTable.id === tableId)) {
                      throw spawnInvariantViolationError(
                          'all fields must belong to the same table',
                      );
                  }
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
