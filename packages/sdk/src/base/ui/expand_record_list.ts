/** @module @airtable/blocks/ui: expandRecordList */ /** */
import {invariant} from '../../shared/error_utils';
import type Record from '../models/record';
import type Field from '../models/field';

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
 * import {expandRecordList} from '@airtable/blocks/base/ui';
 * expandRecordList([record1, record2, record3]);
 *
 * expandRecordList([record1, record2], {
 *     fields: [field1, field2],
 * });
 * ```
 * @docsPath UI/utils/expandRecordList
 */
function expandRecordList(records: Array<Record>, opts?: ExpandRecordListOpts) {
    if (records.length === 0) {
        return;
    }

    const tableId = records[0].parentTable.id;

    const recordIds = records.map((record) => {
        invariant(record.parentTable.id === tableId, 'all records must belong to the same table');

        return record.id;
    });

    const fieldIds =
        opts && opts.fields
            ? opts.fields.map((field) => {
                  invariant(
                      field.parentTable.id === tableId,
                      'all fields must belong to the same table',
                  );

                  return field.id;
              })
            : null;

    records[0].parentTable.parentBase.__sdk.__airtableInterface.expandRecordList(
        tableId,
        recordIds,
        fieldIds,
    );
}

export default expandRecordList;
