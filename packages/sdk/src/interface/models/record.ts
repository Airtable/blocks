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
 *
 * @hidden
 */
type WatchableRecordKey = ObjectValues<typeof WatchableRecordKeys> | string;

/** @hidden */
class Record extends RecordCore<InterfaceSdkMode, WatchableRecordKey> {
    /** @internal */
    static _className = 'Record';
}

export default Record;
