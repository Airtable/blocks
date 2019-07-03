// @flow
import {type FieldId} from './field';

export type RecordId = string;

export type RecordDef = {[FieldId]: mixed};

export type RecordData = {
    id: RecordId,
    // cellValuesByFieldId comes directly from liveapp (as cellValuesByColumnId),
    // which is stored sparsely. So it will be undefined when the row has no cell values.
    cellValuesByFieldId: ?RecordDef,
    commentCount: number,
    createdTime: string,
};
