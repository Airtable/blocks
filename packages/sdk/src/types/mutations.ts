/** @module @airtable/blocks: mutations */ /** */
import {ObjectValues, ObjectMap} from '../private_utils';
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
    readonly tableId: TableId | void;
    readonly records: ReadonlyArray<{
        readonly id: RecordId | void;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | void> | void;
    }> | void;
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
    readonly tableId: TableId | void;
    readonly recordIds: ReadonlyArray<RecordId> | void;
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
    readonly tableId: TableId | void;
    readonly records: ReadonlyArray<{
        readonly id: RecordId | void;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | void> | void;
    }> | void;
}

/** @hidden */
export interface SetMultipleGlobalConfigPathsMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates: ReadonlyArray<GlobalConfigUpdate>;
}

/** @hidden */
export interface PartialSetMultipleGlobalConfigPathsMutation {
    readonly type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates: ReadonlyArray<{
        readonly path: ReadonlyArray<string | void> | void;
        readonly value: GlobalConfigValue | void | void;
    }> | void;
}

/** @hidden */
export type Mutation =
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation
    | SetMultipleGlobalConfigPathsMutation;

/** @hidden */
export type PartialMutation =
    | PartialSetMultipleRecordsCellValuesMutation
    | PartialDeleteMultipleRecordsMutation
    | PartialCreateMultipleRecordsMutation
    | PartialSetMultipleGlobalConfigPathsMutation;

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
