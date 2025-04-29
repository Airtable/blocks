/** @module @airtable/blocks: mutations */ /** */
import {GlobalConfigUpdate, GlobalConfigValue} from './global_config';

/** @hidden */
export const MutationTypesCore = Object.freeze({
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: 'setMultipleGlobalConfigPaths' as const,
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

/** @hidden */
export type MutationCore = SetMultipleGlobalConfigPathsMutation;

/** @hidden */
export type PartialMutationCore = PartialSetMultipleGlobalConfigPathsMutation;

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
