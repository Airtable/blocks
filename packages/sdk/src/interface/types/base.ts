import {type BaseDataCore, type BasePermissionDataCore} from '../../shared/types/base_core';
import {type TableData, type TablePermissionData} from './table';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {}

/** @hidden */
export interface BasePermissionData extends BasePermissionDataCore<TablePermissionData> {}
