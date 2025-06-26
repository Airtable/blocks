import {InterfaceSdkMode} from '../../sdk_mode';
import {spawnError} from '../../shared/error_utils';
import {RecordCore, WatchableRecordKeysCore} from '../../shared/models/record_core';
import {ObjectValues} from '../../shared/private_utils';
import {FieldType} from '../../shared/types/field_core';
import {RecordId} from '../../shared/types/hyper_ids';
import {Field} from './field';

const WatchableRecordKeys = Object.freeze({
    ...WatchableRecordKeysCore,
});
/**
 * Any key within record that can be watched:
 * - `'name'`
 * - `'cellValues'`
 */
type WatchableRecordKey = ObjectValues<typeof WatchableRecordKeys> | string;

/**
 * Model class representing a record in a table.
 *
 * Do not instantiate. You can get instances of this class by calling {@link useRecords}.
 *
 * @docsPath models/Record
 */
export class Record extends RecordCore<InterfaceSdkMode, WatchableRecordKey> {
    /** @internal */
    static _className = 'Record';

    /**
     * Fetch foreign records for a field. Subsequent calls to this method will
     * override previous calls that are still pending. The previous call(s)
     * will immediately resolve with an empty `records` array.
     *
     * @param fieldId - The ID of the field to fetch foreign records for.
     * @param filterString - The filter string to use to filter the records.
     * @returns A promise that resolves to the foreign records.
     */
    fetchForeignRecordsAsync(
        field: Field,
        filterString: string,
    ): Promise<{
        records: ReadonlyArray<{id: RecordId; name: string}>;
    }> {
        const parentTable = this.parentTable;
        if (field.parentTable !== parentTable) {
            throw spawnError('Field %s is not in the same table as the record', field.name);
        }
        if (field.type !== FieldType.MULTIPLE_RECORD_LINKS) {
            throw spawnError('Field %s is not a multiple record links field', field.name);
        }
        const airtableInterface = this.parentTable.parentBase.__sdk.__airtableInterface;
        return airtableInterface.fetchForeignRecordsAsync(
            parentTable.id,
            this.id,
            field.id,
            filterString,
        );
    }
}
