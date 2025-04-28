import {InterfaceSdkMode} from '../../sdk_mode';
import {RecordCore, WatchableRecordKeysCore} from '../../shared/models/record_core';
import {ObjectValues} from '../../shared/private_utils';

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
}
