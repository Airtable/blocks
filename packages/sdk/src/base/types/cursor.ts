import {type ObjectMap} from '../../shared/private_utils';
import {type FieldId, type RecordId} from '../../shared/types/hyper_ids';

/** @hidden */
export interface CursorData {
    selectedRecordIdSet: ObjectMap<RecordId, boolean>;
    selectedFieldIdSet: ObjectMap<FieldId, boolean>;
}
