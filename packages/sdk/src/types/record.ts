import {ObjectMap} from '../private_utils';
import {FieldId} from './field';

export type RecordId = string;

export type RecordDef = ObjectMap<FieldId, unknown>;

export type RecordData = {
    id: RecordId;
    // cellValuesByFieldId comes directly from liveapp (as cellValuesByColumnId),
    // which is stored sparsely. So it will be undefined when the row has no cell values.
    cellValuesByFieldId: RecordDef | null | undefined;
    commentCount: number;
    createdTime: string;
};
