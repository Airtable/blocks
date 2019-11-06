/** @module @airtable/blocks/ui: expandRecordList */ /** */
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import Record from '../models/record';
import Field from '../models/field';

/**
 * Options object for expanding a record list.
 */
interface ExpandRecordListOpts {
    /** The fields to include in the record cards. The primary field will always be shown. Duplicate fields will be removed. */
    fields?: Array<Field>;
}

/**
 * Expands a list of records in the Airtable UI.
 *
 * @param records The records to expand. Duplicate records will be removed.
 * @param opts An optional options object.
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
function expandRecordList(records: Array<Record>, opts?: ExpandRecordListOpts) {
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
