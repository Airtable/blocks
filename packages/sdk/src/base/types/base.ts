import {BaseDataCore} from '../../shared/types/base_core';
import {TableData} from './table';
import {CursorData} from './cursor';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {
    // Exposed through Cursor model
    // cursorData will be null if it has not been subscribed to.
    cursorData: CursorData | null;
}
