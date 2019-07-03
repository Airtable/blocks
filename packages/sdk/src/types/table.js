// @flow
import {type FieldData, type FieldId} from './field';
import {type ViewData, type ViewId} from './view';
import {type RecordData, type RecordId} from './record';

export type TableId = string;

export type TableData = {|
    id: TableId,
    name: string,
    primaryFieldId: string,
    fieldsById: {[FieldId]: FieldData},
    activeViewId: ViewId | null,
    viewOrder: Array<ViewId>,
    viewsById: {[ViewId]: ViewData},
    recordsById?: {[RecordId]: RecordData},
|};
