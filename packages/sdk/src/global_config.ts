/** @module @airtable/blocks: globalConfig */ /** */
import Watchable from './watchable';
import getSdk from './get_sdk';
import {AirtableInterface} from './injected/airtable_interface';
import {spawnError} from './error_utils';
import {MutationTypes, PermissionCheckResult} from './types/mutations';
import {getValueAtOwnPath, ObjectMap} from './private_utils';

const blockKvHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/blocks/block_kv_helpers',
);
const forkObjectPathForWriteByReference = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/fork_object_path_for_write_by_reference',
);

/** A path of keys indexing into the global config object */
export type GlobalConfigPath = ReadonlyArray<string>;
/** A single top level key or a path into the global config object */
export type GlobalConfigKey = GlobalConfigPath | string;
/** A {@link GlobalConfigPath}, with some parts of the path unknown (`undefined`) */
export type PartialGlobalConfigPath = ReadonlyArray<string | undefined>;
/** A {@link GlobalConfigKey} with some parts of the path/key unknown (`undefined`) */
export type PartialGlobalConfigKey = PartialGlobalConfigPath | string | undefined;
/** An array of {@link GlobalConfigValue}s */
export interface GlobalConfigArray extends ReadonlyArray<GlobalConfigValue> {}
/** An object containing {@GlobalConfigValue}s */
export interface GlobalConfigObject {
    readonly [key: string]: GlobalConfigValue | undefined;
}

/** The types of value that can be stored in globalConfig. */
export type GlobalConfigValue =
    | null
    | boolean
    | number
    | string
    | GlobalConfigArray
    | GlobalConfigObject;

/** @hidden */
export interface GlobalConfigData {
    [key: string]: GlobalConfigValue | undefined;
}

/** An instruction to set `path` within globalConfig to `value`. */
export interface GlobalConfigUpdate {
    /** The path to update. */
    readonly path: GlobalConfigPath;
    /** The value at `path` after updating. */
    readonly value: GlobalConfigValue | undefined;
}

/** A version of {@link GlobalConfigUpdate} where not all values are yet known. */
export interface PartialGlobalConfigUpdate {
    /** The path to update. */
    readonly path?: PartialGlobalConfigPath | undefined;
    /** The value at `path` after updating. */
    readonly value?: GlobalConfigValue | undefined;
}

/**
 * You can watch any top-level key in global config. Use '*' to watch every change.
 */
type WatchableGlobalConfigKey = string;

/** @internal */
function validatePath(
    path: GlobalConfigPath,
    store: GlobalConfigData,
): {isValid: true} | {isValid: false; reason: string} {
    const validation = blockKvHelpers.validateKvKeyPath(path, store);
    if (!validation.isValid) {
        return validation;
    }
    if (path[0] === '*') {
        return {isValid: false, reason: "cannot use '*' as a top-level key"};
    }
    return {isValid: true};
}

/**
 * A key-value store for persisting configuration options for a block installation.
 *
 * The contents will be synced in real-time to all logged-in users of the installation.
 * Contents will not be updated in real-time when the installation is running in
 * a publicly shared base.
 *
 * Any key can be watched to know when the value of the key changes.
 *
 * You should not need to construct this object yourself.
 *
 * @example
 * ```js
 * import {globalConfig} from '@airtable/blocks';
 * ```
 */
class GlobalConfig extends Watchable<WatchableGlobalConfigKey> {
    /** @internal */
    static _className = 'GlobalConfig';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return true;
    }
    /** @internal */
    _kvStore: GlobalConfigData;
    /** @internal */
    _airtableInterface: AirtableInterface;
    /**
     * @internal
     */
    constructor(initialKvValuesByKey: GlobalConfigData, airtableInterface: AirtableInterface) {
        super();

        this._kvStore = initialKvValuesByKey;
        this._airtableInterface = airtableInterface;
    }

    /**
     * @internal
     */
    __getTopLevelKey(key: GlobalConfigKey): string {
        if (Array.isArray(key)) {
            return key[0];
        }
        return key as string;
    }
    /**
     * @internal
     */
    _formatKeyAsPath<T extends string | undefined>(key: ReadonlyArray<T> | T): ReadonlyArray<T> {
        if (!Array.isArray(key)) {
            return [key as any];
        }
        return key;
    }
    /**
     * Get the value at a path. Throws an error if the path is invalid.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns The value at the provided path, or `undefined` if no value exists at that path.
     * @example
     * ```js
     * import {globalConfig} from '@airtable/blocks';
     *
     * const topLevelValue = globalConfig.get('topLevelKey');
     * const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
     * ```
     */
    get(key: GlobalConfigKey): unknown {
        const path = this._formatKeyAsPath(key);

        const pathValidationResult = validatePath(path, this._kvStore);
        if (!pathValidationResult.isValid) {
            throw spawnError('Invalid globalConfig path: %s', pathValidationResult.reason);
        }

        const value = getValueAtOwnPath(this._kvStore, path);
        return value as GlobalConfigValue | undefined;
    }

    /**
     * Checks whether the current user has permission to set the given global config key.
     *
     * Accepts partial input, in the same format as {@link setAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     *
     * @example
     * ```js
     * // Check if user can update a specific key and value.
     * const setCheckResult = globalConfig.checkPermissionsForSet('favoriteColor', 'purple');
     * if (!setCheckResult.hasPermission) {
     *     alert(setCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user can update a specific key, when you don't know the value yet.
     * const setKeyCheckResult = globalConfig.checkPermissionsForSet('favoriteColor');
     *
     * // Check if user could set globalConfig values, without knowing the specific key/value yet
     * const setUnknownKeyCheckResult = globalConfig.checkPermissionsForSet();
     * ```
     */
    checkPermissionsForSet(
        key?: PartialGlobalConfigKey,
        value?: GlobalConfigValue,
    ): PermissionCheckResult {
        return this.checkPermissionsForSetPaths([
            {path: key ? this._formatKeyAsPath(key) : undefined, value},
        ]);
    }
    /**
     * An alias for `globalConfig.checkPermissionsForSet(key, value).hasPermission`.
     *
     * Checks whether the current user has permission to set the given global config key.
     *
     * Accepts partial input, in the same format as {@link setAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @returns boolean Whether or not the user can set the specified key.
     *
     * @example
     * ```js
     * // Check if user can update a specific key and value.
     * const canSetFavoriteColorToPurple = globalConfig.hasPermissionToSet('favoriteColor', 'purple');
     * if (!canSetFavoriteColorToPurple) {
     *     alert('Not allowed!');
     * }
     *
     * // Check if user can update a specific key, when you don't know the value yet.
     * const canSetFavoriteColor = globalConfig.hasPermissionToSet('favoriteColor');
     *
     * // Check if user could set globalConfig values, without knowing the specific key/value yet
     * const canSetGlobalConfig = globalConfig.hasPermissionToSet();
     * ```
     */
    hasPermissionToSet(key?: PartialGlobalConfigKey, value?: GlobalConfigValue): boolean {
        return this.checkPermissionsForSet(key, value).hasPermission;
    }
    /**
     * Sets a value at a path. Throws an error if the path or value is invalid.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * update to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your change will be reflected in
     * {@link GlobalConfig} before the promise resolves.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @returns A promise that will resolve once the update is persisted to Airtable.
     * @example
     * ```js
     * import {globalConfig} from '@airtable/blocks';
     *
     * function updateFavoriteColorIfPossible(color) {
     *     if (globalConfig.hasPermissionToSetPaths('favoriteColor', color)) {
     *         globalConfig.setPathsAsync('favoriteColor', color);
     *     }
     *     // The update is now applied within your block (eg will be reflected in
     *     // globalConfig) but are still being saved to Airtable servers (eg.
     *     // may not be updated for other users yet)
     * }
     *
     * async function updateFavoriteColorIfPossibleAsync(color) {
     *     if (globalConfig.hasPermissionToSet('favoriteColor', color)) {
     *         await globalConfig.setAsync('favoriteColor', color);
     *     }
     *     // globalConfig updates have been saved to Airtable servers.
     *     alert('favoriteColor has been updated');
     * }
     * ```
     */
    async setAsync(key: GlobalConfigKey, value?: GlobalConfigValue): Promise<void> {
        const path = this._formatKeyAsPath(key);
        await this.setPathsAsync([{path, value}]);
    }
    /**
     * Checks whether the current user has permission to perform the specified updates to global config.
     *
     * Accepts partial input, in the same format as {@link setPathsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param updates The paths and values to set.
     * @returns PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key, `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used to display an error message to the user.
     *
     * @example
     * ```js
     * // Check if user can update a specific keys and values.
     * const setPathsCheckResult = globalConfig.checkPermissionsForSet([
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ]);
     * if (!setPathsCheckResult.hasPermission) {
     *     alert(setPathsCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user could potentially set globalConfig values.
     * // Equivalent to globalConfig.checkPermissionsForSet()
     * const setUnknownPathsCheckResult = globalConfig.checkPermissionsForSetPaths();
     * ```
     */
    checkPermissionsForSetPaths(
        updates?: ReadonlyArray<PartialGlobalConfigUpdate>,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
            updates: updates
                ? updates.map(({path, value}) => ({path: path || undefined, value}))
                : undefined,
        });
    }
    /**
     * An alias for `globalConfig.checkPermissionsForSetPaths(updates).hasPermission`.
     *
     * Checks whether the current user has permission to perform the specified updates to global config.
     *
     * Accepts partial input, in the same format as {@link setPathsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param updates The paths and values to set.
     * @returns boolean Whether or not the user has permission to apply the specified updates to globalConfig.
     *
     * @example
     * ```js
     * // Check if user can update a specific keys and values.
     * const canSetPaths = globalConfig.hasPermissionToSetPaths([
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ]);
     * if (!canSetPaths) {
     *     alert('not allowed!');
     * }
     *
     * // Check if user could potentially set globalConfig values.
     * // Equivalent to globalConfig.hasPermissionToSet()
     * const canSetAnyPaths = globalConfig.hasPermissionToSetPaths();
     * ```
     */
    hasPermissionToSetPaths(updates?: ReadonlyArray<PartialGlobalConfigUpdate>): boolean {
        return this.checkPermissionsForSetPaths(updates).hasPermission;
    }
    /**
     * Sets multiple values. Throws if any path or value is invalid.
     *
     * This action is asynchronous: `await` the returned promise if you wish to wait for the
     * updates to be persisted to Airtable servers.
     * Updates are applied optimistically locally, so your changes will be reflected in
     * {@link GlobalConfig} before the promise resolves.
     *
     * @param updates The paths and values to set.
     * @returns A promise that will resolve once the update is persisted to Airtable.
     * @example
     * ```js
     * import {globalConfig} from '@airtable/blocks';
     *
     * const updates = [
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ];
     *
     * function applyUpdatesIfPossible() {
     *     if (globalConfig.hasPermissionToSetPaths(updates)) {
     *         globalConfig.setPathsAsync(updates);
     *     }
     *     // The updates are now applied within your block (eg will be reflected in
     *     // globalConfig) but are still being saved to Airtable servers (eg. they
     *     // may not be updated for other users yet)
     * }
     *
     * async function applyUpdatesIfPossibleAsync() {
     *     if (globalConfig.hasPermissionToSetPaths(updates)) {
     *         await globalConfig.setPathsAsync(updates);
     *     }
     *     // globalConfig updates have been saved to Airtable servers.
     *     alert('globalConfig has been updated');
     * }
     * ```
     */
    async setPathsAsync(updates: Array<GlobalConfigUpdate>): Promise<void> {
        if (!this.hasPermissionToSetPaths(updates)) {
            throw spawnError('Your permission level does not allow setting globalConfig values');
        }

        for (const update of updates) {
            const pathValidation = validatePath(update.path, this._kvStore);
            if (!pathValidation.isValid) {
                throw spawnError('Invalid globalConfig path: %s', pathValidation.reason);
            }
        }

        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
            updates,
        });
    }
    /**
     * @internal
     * this shouldn't be called directly - instead, use getSdk().__applyGlobalConfigUpdates()
     */
    __setMultipleKvPaths(updates: ReadonlyArray<GlobalConfigUpdate>) {
        if (!Array.isArray(updates)) {
            throw spawnError(
                'globalConfig updates must be an array. Provided type: %s',
                typeof updates,
            );
        }

        const topLevelKeySet: ObjectMap<string, true> = {};

        const clonedObjectsSet = new Set();
        const workingKvStore = {...this._kvStore};

        for (const update of updates) {
            const updateValidationResult = blockKvHelpers.validateKvStoreUpdate(
                update,
                this._kvStore,
            );
            if (!updateValidationResult.isValid) {
                throw spawnError('Invalid globalConfig update: %s', updateValidationResult.reason);
            }

            forkObjectPathForWriteByReference(
                workingKvStore,
                this._kvStore,
                update.path,
                clonedObjectsSet,
            );
            blockKvHelpers.applyValidatedUpdateToKvStoreByReference(workingKvStore, update);

            const topLevelKey = update.path[0];
            topLevelKeySet[topLevelKey] = true;
        }

        const changedTopLevelKeys = Object.keys(topLevelKeySet);
        const limitCheckResult = blockKvHelpers.limitCheckKvStore(
            workingKvStore,
            changedTopLevelKeys,
        );
        if (!limitCheckResult.isValid) {
            throw spawnError('globalConfig over limits: %s', limitCheckResult.reason);
        }

        this._kvStore = workingKvStore;

        for (const key of changedTopLevelKeys) {
            this._onChange(key);
        }
        if (changedTopLevelKeys.length) {
            this._onChange('*');
        }
    }
}

export default GlobalConfig;
