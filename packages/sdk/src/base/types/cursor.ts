import {ObjectMap} from '../../shared/private_utils';
import {FieldId, RecordId} from '../../shared/types/hyper_ids';

/** @hidden */
export interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
    selectedFieldIdSet: ObjectMap<FieldId, boolean>;
}
