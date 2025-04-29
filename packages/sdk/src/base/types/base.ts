import {BaseDataCore} from '../../shared/types/base_core';
import {TableId} from '../../shared/types/hyper_ids';
import {TableData} from './table';
import {CursorData} from './cursor';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    cursorData: CursorData | null;
}
