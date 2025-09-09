/** @module @airtable/blocks/models: Record */ /** */
import {type ObjectMap} from '../private_utils';
import {type FieldId, type RecordId} from './hyper_ids';

/** */
export type RecordDef = ObjectMap<FieldId, unknown>;

/** @hidden */
export interface RecordDataCore {
    id: RecordId;
    cellValuesByFieldId: RecordDef | null | undefined;
    createdTime: string;
}
