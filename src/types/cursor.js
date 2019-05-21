// @flow
import {type RecordId} from './record';

export type CursorData = {|
    selectedRecordIdSet: {[RecordId]: boolean},
|};
