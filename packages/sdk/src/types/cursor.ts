import {ObjectMap} from '../private_utils';
import {RecordId} from './record';

export type CursorData = {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
};
