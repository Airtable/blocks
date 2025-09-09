import {type BaseDataCore, type BasePermissionDataCore} from '../../shared/types/base_core';
import {type TableId} from '../../shared/types/hyper_ids';
import {type TableData, type TablePermissionData} from './table';
import {type CursorData} from './cursor';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    cursorData: CursorData | null;
}

/** @hidden */
export interface BasePermissionData extends BasePermissionDataCore<TablePermissionData> {}
