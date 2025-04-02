/** @module @airtable/blocks/models: Record */ /** */
import {ObjectMap} from '../private_utils';
import {FieldId, RecordId} from './hyper_ids';

/** */
export type RecordDef = ObjectMap<FieldId, unknown>;

/** @hidden */
export interface RecordData {
    id: RecordId;
    // cellValuesByFieldId comes directly from liveapp (as cellValuesByColumnId),
    // which is stored sparsely. So it will be undefined when the row has no cell values.
    cellValuesByFieldId: RecordDef | null | undefined;
    commentCount: number;
    createdTime: string;
}
