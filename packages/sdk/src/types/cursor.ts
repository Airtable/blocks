import {ObjectMap} from '../private_utils';
import {RecordId} from './record';
import {FieldId} from './field';

/** @hidden */
export interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
    selectedFieldIdSet: ObjectMap<FieldId, boolean>;
}
