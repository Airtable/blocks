import {type BaseDataCore, type BasePermissionDataCore} from '../../shared/types/base_core';
import {type ObjectMap} from '../../shared/private_utils';
import {type PrivateColumnType} from '../../shared/types/field_core';
import {type FieldId, type TableId} from '../../shared/types/hyper_ids';
import {type TableData, type TablePermissionData} from './table';

/** @hidden */
export interface BaseData extends BaseDataCore<TableData> {
    allTableDataForEditModeConfiguration?: ObjectMap<
        TableId,
        {
            id: TableId;
            name: string;
            primaryFieldId: FieldId;
            fieldsById: ObjectMap<
                FieldId,
                {
                    id: FieldId;
                    name: string;
                    type: PrivateColumnType;
                    typeOptions: {[key: string]: unknown} | null | undefined;
                }
            >;
        }
    >;
}

/** @hidden */
export interface BasePermissionData extends BasePermissionDataCore<TablePermissionData> {}
