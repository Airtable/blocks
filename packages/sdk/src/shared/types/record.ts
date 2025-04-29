/** @module @airtable/blocks/models: Record */ /** */
import {ObjectMap} from '../private_utils';
import {FieldId, RecordId} from './hyper_ids';

/** */
export type RecordDef = ObjectMap<FieldId, unknown>;

/** @hidden */
export interface RecordDataCore {
    id: RecordId;
    cellValuesByFieldId: RecordDef | null | undefined;
    createdTime: string;
}
