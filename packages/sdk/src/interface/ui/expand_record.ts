/** @module @airtable/blocks/interface/ui: expandRecord */ /** */
import {Record} from '../models/record';

/**
 * Expands the given record in the Airtable UI.
 *
 * @param record The record to expand.
 *
 * @example
 * ```js
 * import {expandRecord} from '@airtable/blocks/interface/ui';
 *
 * <button onClick={() => expandRecord(record)}>{record.name}</button>
 * ```
 * @docsPath UI/utils/expandRecord
 */
export function expandRecord(record: Record): void {
    // TODO(kasra): this will cause the liveapp page to force a refresh if the
    // tableId and recordId are both valid, but the recordId does not
    // exist in the table.
    record.parentTable.parentBase.__sdk.__airtableInterface.expandRecord(
        record.parentTable.id,
        record.id,
    );
}
