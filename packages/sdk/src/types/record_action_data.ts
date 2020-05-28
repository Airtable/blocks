import {RecordId} from './record';
import {ViewId} from './view';
import {TableId} from './table';

/**
 * TODO(emma): document these before making them public
 *
 * @hidden */
export interface RecordActionData {
    /** @hidden */
    recordId: RecordId;
    /** @hidden */
    viewId: ViewId;
    /** @hidden */
    tableId: TableId;
}
/** @hidden */
export type RecordActionDataCallback = (data: RecordActionData) => void;
