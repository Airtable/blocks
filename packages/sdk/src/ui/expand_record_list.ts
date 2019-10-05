/** @module @airtable/blocks/ui: expandRecordList */ /** */
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import Record from '../models/record';
import Field from '../models/field';

/**
 * Expands a list of records in the Airtable UI
 *
 * @param records the records to expand. Duplicate records will be removed.
 * @param [opts] An optional options object.
 * @param [opts.fields] optionally include an array of fields to control
 * which fields are shown in the record cards. The primary field will always
 * be shown. Duplicate fields will be removed.
 *
 * @example
 * ```js
 * import {expandRecordList} from '@airtable/blocks/ui';
 * expandRecordList([record1, record2, record3]);
 *
 * expandRecordList([record1, record2], {
 *     fields: [field1, field2],
 * });
 * ```
 */
function expandRecordList(
    records: Array<Record>,
    opts?: {
        fields?: Array<Field>;
    },
) {
    if (records.length === 0) {
        return;
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

    getSdk().__airtableInterface.expandRecordList(tableId, recordIds, fieldIds);
}

export default expandRecordList;
