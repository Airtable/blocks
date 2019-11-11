/** @module @airtable/blocks/models: Record */ /** */
import {ObjectMap} from '../private_utils';
import {FieldId} from './field';

/** */
export type RecordId = string;

/** */
export type RecordDef = ObjectMap<FieldId, unknown>;

/** @hidden */
export interface RecordData {
    id: RecordId;
    cellValuesByFieldId: RecordDef | null | undefined;
    commentCount: number;
    createdTime: string;
}
