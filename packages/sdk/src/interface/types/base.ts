import {BaseDataCore, BasePermissionDataCore} from '../../shared/types/base_core';
import {TableData, TablePermissionData} from './table';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {}

/** @hidden */
export interface BasePermissionData extends BasePermissionDataCore<TablePermissionData> {}
