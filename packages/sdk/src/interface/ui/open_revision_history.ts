/** @module @airtable/blocks/interface/ui: openRevisionHistory */ /** */
import {type Record} from '../models/record';

/**
 * Opens the native revision history panel for the given record in the Airtable UI,
 * without expanding the full record.
 *
 * @param record The record to show revision history for.
 *
 * @example
 * ```js
 * import {openRevisionHistory} from '@airtable/blocks/interface/ui';
 *
 * <button onClick={() => openRevisionHistory(record)}>Revision history</button>
 * ```
 * @docsPath UI/utils/openRevisionHistory
 */
export function openRevisionHistory(record: Record): void {
    record.parentTable.parentBase.__sdk.__airtableInterface.openRevisionHistory(
        record.parentTable.id,
        record.id,
    );
}
