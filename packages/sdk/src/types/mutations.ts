import {ObjectValues, ObjectMap} from '../private_utils';
import {GlobalConfigUpdate, GlobalConfigValue} from '../global_config';
import {TableId} from './table';
import {FieldId} from './field';
import {RecordId} from './record';

export const MutationTypes = Object.freeze({
    SET_MULTIPLE_RECORDS_CELL_VALUES: 'setMultipleRecordsCellValues' as const,
    DELETE_MULTIPLE_RECORDS: 'deleteMultipleRecords' as const,
    CREATE_MULTIPLE_RECORDS: 'createMultipleRecords' as const,
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: 'setMultipleGlobalConfigPaths' as const,
});

export type MutationType = ObjectValues<typeof MutationTypes>;

export type SetMultipleRecordsCellValuesMutation = {
    readonly type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES;
    readonly tableId: TableId;
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
};

export type PartialSetMultipleRecordsCellValuesMutation = {
    readonly type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES;
    readonly tableId: TableId | void;
    readonly records: ReadonlyArray<{
        readonly id: RecordId | void;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | void> | void;
    }> | void;
};

export type DeleteMultipleRecordsMutation = {
    readonly type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS;
    readonly tableId: TableId;
    readonly recordIds: ReadonlyArray<RecordId>;
};

export type PartialDeleteMultipleRecordsMutation = {
    readonly type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS;
    readonly tableId: TableId | void;
    readonly recordIds: ReadonlyArray<RecordId> | void;
};

export type CreateMultipleRecordsMutation = {
    readonly type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS;
    readonly tableId: TableId;
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
};

export type PartialCreateMultipleRecordsMutation = {
    readonly type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS;
    readonly tableId: TableId | void;
    readonly records: ReadonlyArray<{
        readonly id: RecordId | void;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | void> | void;
    }> | void;
};

export type SetMultipleGlobalConfigPathsMutation = {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates: ReadonlyArray<GlobalConfigUpdate>;
};

export type PartialSetMultipleGlobalConfigPathsMutation = {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates: ReadonlyArray<{
        readonly path: ReadonlyArray<string | void> | void;
        readonly value: GlobalConfigValue | void | void;
    }> | void;
};

export type Mutation =
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation
    | SetMultipleGlobalConfigPathsMutation;

export type PartialMutation =
    | PartialSetMultipleRecordsCellValuesMutation
    | PartialDeleteMultipleRecordsMutation
    | PartialCreateMultipleRecordsMutation
    | PartialSetMultipleGlobalConfigPathsMutation;

export type PermissionCheckResult =
    | {hasPermission: true}
    | {hasPermission: false; reasonDisplayString: string};
