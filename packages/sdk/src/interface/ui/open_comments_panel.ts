/** @module @airtable/blocks/interface/ui: openCommentsPanel */ /** */
import {type Record} from '../models/record';

/**
 * Opens the native comments panel for the given record in the Airtable UI,
 * without expanding the full record.
 *
 * @param record The record to show comments for.
 *
 * @example
 * ```js
 * import {openCommentsPanel} from '@airtable/blocks/interface/ui';
 *
 * <button onClick={() => openCommentsPanel(record)}>Comments</button>
 * ```
 * @docsPath UI/utils/openCommentsPanel
 */
export function openCommentsPanel(record: Record): void {
    record.parentTable.parentBase.__sdk.__airtableInterface.openCommentsPanel(
        record.parentTable.id,
        record.id,
    );
}
