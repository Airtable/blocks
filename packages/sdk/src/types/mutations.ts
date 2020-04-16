/** @module @airtable/blocks: mutations */ /** */
import {ObjectValues, ObjectMap} from '../private_utils';
import {FieldTypeConfig} from '../injected/airtable_interface';
import {GlobalConfigUpdate, GlobalConfigValue} from './global_config';
import {TableId} from './table';
import {FieldId} from './field';
import {RecordId} from './record';

/** @hidden */
export const MutationTypes = Object.freeze({
    SET_MULTIPLE_RECORDS_CELL_VALUES: 'setMultipleRecordsCellValues' as const,
    DELETE_MULTIPLE_RECORDS: 'deleteMultipleRecords' as const,
    CREATE_MULTIPLE_RECORDS: 'createMultipleRecords' as const,
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: 'setMultipleGlobalConfigPaths' as const,
    CREATE_SINGLE_FIELD: 'createSingleField' as const,
    UPDATE_SINGLE_FIELD_CONFIG: 'updateSingleFieldConfig' as const,
    CREATE_SINGLE_TABLE: 'createSingleTable' as const,
});

/** @hidden */
export type MutationType = ObjectValues<typeof MutationTypes>;

/** @hidden */
export interface SetMultipleRecordsCellValuesMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES;
    readonly tableId: TableId;
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
}

/** @hidden */
export interface PartialSetMultipleRecordsCellValuesMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES;
    readonly tableId: TableId | undefined;
    readonly records:
        | ReadonlyArray<{
              readonly id: RecordId | undefined;
              readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | undefined> | undefined;
          }>
        | undefined;
}

/** @hidden */
export interface DeleteMultipleRecordsMutation {
    readonly type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS;
    readonly tableId: TableId;
    readonly recordIds: ReadonlyArray<RecordId>;
}

/** @hidden */
export interface PartialDeleteMultipleRecordsMutation {
    readonly type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS;
    readonly tableId: TableId | undefined;
    readonly recordIds: ReadonlyArray<RecordId> | undefined;
}

/** @hidden */
export interface CreateMultipleRecordsMutation {
    readonly type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS;
    readonly tableId: TableId;
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
}

/** @hidden */
export interface PartialCreateMultipleRecordsMutation {
    readonly type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS;
    readonly tableId: TableId | undefined;
    readonly records:
        | ReadonlyArray<{
              readonly id: RecordId | undefined;
              readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | undefined> | undefined;
          }>
        | undefined;
}

/** @hidden */
export interface SetMultipleGlobalConfigPathsMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates: ReadonlyArray<GlobalConfigUpdate>;
}

/** @hidden */
export interface PartialSetMultipleGlobalConfigPathsMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates:
        | ReadonlyArray<{
              readonly path: ReadonlyArray<string | undefined> | undefined;
              readonly value: GlobalConfigValue | undefined | undefined;
          }>
        | undefined;
}

/** @hidden */
export interface CreateSingleFieldMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_FIELD;
    readonly tableId: TableId;
    readonly id: FieldId;
    readonly name: string;
    readonly config: FieldTypeConfig;
}

/** @hidden */
export interface PartialCreateSingleFieldMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_FIELD;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly name: string | undefined;
    readonly config: FieldTypeConfig | undefined;
}

/** @hidden */

export interface UpdateSingleFieldConfigMutation {
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_CONFIG;
    readonly tableId: TableId;
    readonly id: FieldId;
    readonly config: FieldTypeConfig;
}

/** @hidden */
export interface PartialUpdateSingleFieldConfigMutation {
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_CONFIG;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly config: FieldTypeConfig | undefined;
}

/** @hidden */
export interface CreateSingleTableMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_TABLE;
    readonly id: TableId;
    readonly name: string;
    readonly fields: ReadonlyArray<{
        name: string;
        config: FieldTypeConfig;
    }>;
}

/** @hidden */
export interface PartialCreateSingleTableMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_TABLE;
    readonly id: TableId | undefined;
    readonly name: string | undefined;
    readonly fields:
        | ReadonlyArray<{
              name: string | undefined;
              config: FieldTypeConfig | undefined;
          }>
        | undefined;
}

/** @hidden */
export type Mutation =
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation
    | SetMultipleGlobalConfigPathsMutation
    | CreateSingleFieldMutation
    | UpdateSingleFieldConfigMutation
    | CreateSingleTableMutation;

/** @hidden */
export type PartialMutation =
    | PartialSetMultipleRecordsCellValuesMutation
    | PartialDeleteMultipleRecordsMutation
    | PartialCreateMultipleRecordsMutation
    | PartialSetMultipleGlobalConfigPathsMutation
    | PartialCreateSingleFieldMutation
    | PartialUpdateSingleFieldConfigMutation
    | PartialCreateSingleTableMutation;

/** */
export interface SuccessfulPermissionCheckResult {
    /** */
    hasPermission: true;
}

/** */
export interface UnsuccessfulPermissionCheckResult {
    /** */
    hasPermission: false;
    /**
     * A string explaining why the action is not permitted. These strings should only be used to
     * show to the user; you should not rely on the format of the string as it may change without
     * notice.
     */
    reasonDisplayString: string;
}

/** Indicates whether the user has permission to perform a particular action, and if not, why. */
export type PermissionCheckResult =
    | SuccessfulPermissionCheckResult
    | UnsuccessfulPermissionCheckResult;
