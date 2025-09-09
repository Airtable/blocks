/** @module @airtable/blocks: mutations */ /** */
import {type ObjectMap} from '../private_utils';
import {type FieldId, type RecordId, type TableId} from './hyper_ids';
import {type GlobalConfigUpdate, type GlobalConfigValue} from './global_config';

/** @hidden */
export const MutationTypesCore = Object.freeze({
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: 'setMultipleGlobalConfigPaths' as const,
    SET_MULTIPLE_RECORDS_CELL_VALUES: 'setMultipleRecordsCellValues' as const,
    DELETE_MULTIPLE_RECORDS: 'deleteMultipleRecords' as const,
    CREATE_MULTIPLE_RECORDS: 'createMultipleRecords' as const,
});


/**
 * The Mutation emitted when the App modifies one or more values in the
 * {@link GlobalConfig}.
 *
 * @docsPath testing/mutations/SetMultipleGlobalConfigPathsMutation
 */
export interface SetMultipleGlobalConfigPathsMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    /** One or more pairs of path and value */
    readonly updates: ReadonlyArray<GlobalConfigUpdate>;
}

/** @hidden */
export interface PartialSetMultipleGlobalConfigPathsMutation {
    readonly type: typeof MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS;
    readonly updates:
        | ReadonlyArray<{
              readonly path: ReadonlyArray<string | undefined> | undefined;
              readonly value: GlobalConfigValue | undefined | undefined;
          }>
        | undefined;
}

/**
 * The Mutation emitted when the App modifies one or more {@link Record|Records}.
 *
 * @docsPath testing/mutations/SetMultipleRecordsCellValuesMutation
 */
export interface SetMultipleRecordsCellValuesMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypesCore.SET_MULTIPLE_RECORDS_CELL_VALUES;
    /** The identifier for the @link Table in which Records are being modified */
    readonly tableId: TableId;
    /** The Records being modified */
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
    /** @hidden */
    readonly opts?: {
        readonly parseDateCellValueInColumnTimeZone?: boolean;
        readonly includesForeignRowsThatShouldBeCreated?: boolean;
    };
}

/** @hidden */
export interface PartialSetMultipleRecordsCellValuesMutation {
    readonly type: typeof MutationTypesCore.SET_MULTIPLE_RECORDS_CELL_VALUES;
    readonly tableId: TableId | undefined;
    readonly records:
        | ReadonlyArray<{
              readonly id: RecordId | undefined;
              readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | undefined> | undefined;
          }>
        | undefined;
    readonly opts?: {
        readonly parseDateCellValueInColumnTimeZone?: boolean;
        readonly includesForeignRowsThatShouldBeCreated?: boolean;
    };
}

/**
 * The Mutation emitted when the App deletes one or more {@link Record|Records}.
 *
 * @docsPath testing/mutations/DeleteMultipleRecordsMutation
 */
export interface DeleteMultipleRecordsMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypesCore.DELETE_MULTIPLE_RECORDS;
    /** The identifier for the Table in which Records are being deleted */
    readonly tableId: TableId;
    /** The identifiers for records being deleted */
    readonly recordIds: ReadonlyArray<RecordId>;
}

/** @hidden */
export interface PartialDeleteMultipleRecordsMutation {
    readonly type: typeof MutationTypesCore.DELETE_MULTIPLE_RECORDS;
    readonly tableId: TableId | undefined;
    readonly recordIds: ReadonlyArray<RecordId> | undefined;
}

/**
 * The Mutation emitted when the App creates one or more {@link Record|Records}.
 *
 * @docsPath testing/mutations/CreateMultipleRecordsMutation
 */
export interface CreateMultipleRecordsMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypesCore.CREATE_MULTIPLE_RECORDS;
    /** The identifier for the Table in which Records are being created */
    readonly tableId: TableId;
    /** The records being created */
    readonly records: ReadonlyArray<{
        readonly id: RecordId;
        readonly cellValuesByFieldId: ObjectMap<FieldId, unknown>;
    }>;
    /** @hidden */
    readonly opts?: {
        readonly parseDateCellValueInColumnTimeZone?: boolean;
        readonly includesForeignRowsThatShouldBeCreated?: boolean;
    };
}

/** @hidden */
export interface PartialCreateMultipleRecordsMutation {
    readonly type: typeof MutationTypesCore.CREATE_MULTIPLE_RECORDS;
    readonly tableId: TableId | undefined;
    readonly records:
        | ReadonlyArray<{
              readonly id: RecordId | undefined;
              readonly cellValuesByFieldId: ObjectMap<FieldId, unknown | undefined> | undefined;
          }>
        | undefined;
    readonly opts?: {
        readonly parseDateCellValueInColumnTimeZone?: boolean;
        readonly includesForeignRowsThatShouldBeCreated?: boolean;
    };
}

/** @hidden */
export type MutationCore =
    | SetMultipleGlobalConfigPathsMutation
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation;

/** @hidden */
export type PartialMutationCore =
    | PartialSetMultipleGlobalConfigPathsMutation
    | PartialSetMultipleRecordsCellValuesMutation
    | PartialDeleteMultipleRecordsMutation
    | PartialCreateMultipleRecordsMutation;

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
