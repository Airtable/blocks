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
 * expandRecord(record);
 * ```
 * @docsPath UI/utils/expandRecord
 */
export function expandRecord(record: Record): void {
    record.parentTable.parentBase.__sdk.__airtableInterface.expandRecord(
        record.parentTable.id,
        record.id,
    );
}
