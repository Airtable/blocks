import {BaseDataCore, BasePermissionDataCore} from '../../shared/types/base_core';
import {TableId} from '../../shared/types/hyper_ids';
import {TableData, TablePermissionData} from './table';
import {CursorData} from './cursor';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {
    tableOrder: Array<TableId>;
    activeTableId: TableId | null;
    cursorData: CursorData | null;
}

/** @hidden */
export interface BasePermissionData extends BasePermissionDataCore<TablePermissionData> {}
