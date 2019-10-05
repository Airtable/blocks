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

type GlobalConfigPath = ReadonlyArray<string>;

/**
 * @typedef {string | Array<string>}
 */
export type GlobalConfigKey = GlobalConfigPath | string;

export interface GlobalConfigArray extends ReadonlyArray<GlobalConfigValue> {}
type GlobalConfigObject = Readonly<{[key: string]: GlobalConfigValue}>;

/**
 * @typedef {null|boolean|number|string|Array<GlobalConfigValue>|object.<string, GlobalConfigValue>}
 */
export type GlobalConfigValue =
    | null
    | boolean
    | number
    | string
    | GlobalConfigArray
    | GlobalConfigObject;

export type GlobalConfigData = {[key: string]: GlobalConfigValue | null | undefined};

export type GlobalConfigUpdate = {
    readonly path: GlobalConfigPath;
    readonly value: GlobalConfigValue | void;
};

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

// NOTE: GlobalConfig is essentially a wrapper around a generic key-value store.
// It's called GlobalConfig in order to convey two main points about its intended
// usage:
// 1) that it is synced 'globally' across clients (at some point we might make
//    a UserConfig which would be scoped to an individual user), and
// 2) that is should be used mainly for configuration of the block (kv store
//    as a name seems a bit too vague in terms of intended usage).
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
        // The user can store any arbitrary key in the global config, so there's
        // not much we can do here to check if a key is valid.
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
     * Get notified of changes to global config.
     *
     * You can watch any top-level key in global config. Use '*' to watch every change.
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof GlobalConfig
     * @instance
     * @param {(WatchableGlobalConfigKey|Array<WatchableGlobalConfigKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {?object} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableGlobalConfigKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof GlobalConfig
     * @instance
     * @param {(WatchableGlobalConfigKey|Array<WatchableGlobalConfigKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {?object} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableGlobalConfigKey>} the array of keys that were unwatched
     */

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
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns The value at the provided path, or `undefined` if no value exists at that path.
     * @example
     * ```js
     * import {globalConfig} from '@airtable/blocks';
     *
     * const topLevelValue = globalConfig.get('topLevelKey');
     * const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
     * ```
     */
    get(key: GlobalConfigKey): GlobalConfigValue | undefined {
        const path = this._formatKeyAsPath(key);

        const pathValidationResult = validatePath(path, this._kvStore);
        if (!pathValidationResult.isValid) {
            throw spawnError('Invalid globalConfig path: %s', pathValidationResult.reason);
        }

        const value = getValueAtOwnPath(this._kvStore, path);
        // value is returned as `unknown` from getValueAtOwnPath, but we know it must be a `GlobalConfigValue | void`
        return value as GlobalConfigValue | undefined;
    }

    /**
     * Checks whether the current user has permission to set the given global config key.
     *
     * Accepts partial input, in the same format as {@link setAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param {string|Array<string>} [key] A string for the top-level key, or an array of strings describing the path to set.
     * @param [value] The value to set at the specified path. Use `undefined` to delete the value at the given path.
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
        key?: ReadonlyArray<string | undefined> | string,
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
     * @param {string|Array<string>} [key] A string for the top-level key, or an array of strings describing the path to set.
     * @param [value] The value to set at the specified path. Use `undefined` to delete the value at the given path.
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
    hasPermissionToSet(
        key?: ReadonlyArray<string | undefined> | string,
        value?: GlobalConfigValue,
    ): boolean {
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
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @returns {Promise<void>} A promise that will resolve once the update is persisted to Airtable.
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
     * @param {Array<{path?: Array<string>, value?: GlobalConfigValue}>} [updates] The paths and values to set.
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
        updates?: ReadonlyArray<{
            readonly path?: ReadonlyArray<string | void> | void;
            readonly value?: GlobalConfigValue | void;
        }>,
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
     * @param {Array<{path?: Array<string>, value?: GlobalConfigValue}>} [updates] The paths and values to set.
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
    hasPermissionToSetPaths(
        updates?: ReadonlyArray<{
            readonly path?: ReadonlyArray<string | void> | void;
            readonly value?: GlobalConfigValue | void;
        }>,
    ): boolean {
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
     * @param {Array<{path: Array<string>, value: GlobalConfigValue}>} updates The paths and values to set.
     * @returns {Promise<void>} A promise that will resolve once the update is persisted to Airtable.
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
        // Validate the updates. Usually applyMutationAsync performs validations, but globalConfig
        // updates are a special case because it relies on internal globalConfig state to validate.
        // We check here, instead of deeper (e.g. on the liveapp side) so the user
        // gets a more useful error stack trace.
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

        // Create a working copy of the kvStore so that we can revert changes
        // in memory if the updates don't pass validation or limit checks.
        // First, let's shallow clone the starting kvStore.
        const clonedObjectsSet = new Set();
        const workingKvStore = {...this._kvStore};

        // Before applying each update, fork the working kvStore so we can roll
        // back any changes we make.
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

        // We passed validation and limit checks, so it's safe to persist the updates.
        this._kvStore = workingKvStore;

        // Now loop over the top level keys to fire change events.
        // NOTE: it's important that we do this after the loop above (instead of inline),
        // so that all of the changes are reflected by the time we trigger change events.
        for (const key of changedTopLevelKeys) {
            this._onChange(key);
        }
        if (changedTopLevelKeys.length) {
            this._onChange('*');
        }
    }
}

export default GlobalConfig;
