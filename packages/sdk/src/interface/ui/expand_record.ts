/** @module @airtable/blocks/ui: expandRecord */ /** */
import Record from '../models/record';

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record The record to expand.
 *
 * @example
 * ```js
 * import {expandRecord} from '@airtable/blocks/ui';
 * expandRecord(record);
 * ```
 * @docsPath UI/utils/expandRecord
 */
function expandRecord(record: Record) {
    // TODO(kasra): this will cause the liveapp page to force a refresh if the
    // tableId and recordId are both valid, but the recordId does not
    // exist in the table.
    record.parentTable.parentBase.__sdk.__airtableInterface.expandRecord(
        record.parentTable.id,
        record.id,
    );
}

export default expandRecord;
