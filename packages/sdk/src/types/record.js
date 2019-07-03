// @flow
import {type FieldId} from './field';

export type RecordId = string;

export type RecordDef = {[FieldId]: mixed};

export type RecordData = {
    id: RecordId,
    cellValuesByFieldId: ?RecordDef,
    commentCount: number,
    createdTime: string,
};
