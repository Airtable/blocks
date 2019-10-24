import {ObjectMap} from '../private_utils';
import {RecordId} from './record';

/** @hidden */
export interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
}
