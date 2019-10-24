import {ObjectMap} from '../private_utils';
import {RecordId} from './record';

/** @hidden */
export type CursorData = {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
};
