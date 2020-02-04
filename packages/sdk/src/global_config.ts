/** @module @airtable/blocks: globalConfig */ /** */
import Watchable from './watchable';
import getSdk from './get_sdk';
import {AirtableInterface} from './injected/airtable_interface';
import {spawnError} from './error_utils';
import {
    GlobalConfigPath,
    GlobalConfigKey,
    PartialGlobalConfigKey,
    GlobalConfigValue,
    GlobalConfigData,
    GlobalConfigUpdate,
    PartialGlobalConfigUpdate,
    GlobalConfigPathValidationResult,
} from './types/global_config';
import {MutationTypes, PermissionCheckResult} from './types/mutations';
import {getValueAtOwnPath} from './private_utils';

/**
 * You can watch any top-level key in global config. Use '*' to watch every change.
 */
type WatchableGlobalConfigKey = string;

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
 * Any key can be watched to know when the value of the key changes. If you want your
 * component to automatically re-render whenever any key on GlobalConfig changes, try using the
 * {@link useGlobalConfig} hook.
 *
 * You should not need to construct this object yourself.
 *
 * The maximum allowed size of each URL-encoded write to GlobalConfig is 100kB.
 *
 * @example
 * ```js
 * import {globalConfig} from '@airtable/blocks';
 * ```
 * @docsPath models/GlobalConfig
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
     * @internal
     */
    _validatePath(
        path: GlobalConfigPath,
        store: GlobalConfigData,
    ): GlobalConfigPathValidationResult {
        const validation = this._airtableInterface.globalConfigHelpers.validatePath(path, store);
        if (!validation.isValid) {
            return validation;
        }
        if (path[0] === '*') {
            return {isValid: false, reason: "cannot use '*' as a top-level key"};
        }
        return {isValid: true};
    }
    /**
     * Get the value at a path. Throws an error if the path is invalid.
     *
     * Returns undefined if no value exists at that path.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to the value.
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

        const pathValidationResult = this._validatePath(path, this._kvStore);
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
     * Returns `{hasPermission: true}` if the current user can set the specified key,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise.  `reasonDisplayString` may
     * be used to display an error message to the user.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     *
     * @example
     * ```js
     * // Check if user can update a specific key and value.
     * const setCheckResult =
     *     globalConfig.checkPermissionsForSet('favoriteColor', 'purple');
     * if (!setCheckResult.hasPermission) {
     *     alert(setCheckResult.reasonDisplayString);
     * }
     *
     * // Check if user can update a specific key without knowing the value
     * const setKeyCheckResult =
     *     globalConfig.checkPermissionsForSet('favoriteColor');
     *
     * // Check if user can update globalConfig without knowing key or value
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
     *
     * @example
     * ```js
     * // Check if user can update a specific key and value.
     * const canSetFavoriteColorToPurple =
     *     globalConfig.hasPermissionToSet('favoriteColor', 'purple');
     * if (!canSetFavoriteColorToPurple) {
     *     alert('Not allowed!');
     * }
     *
     * // Check if user can update a specific key without knowing the value
     * const canSetFavoriteColor = globalConfig.hasPermissionToSet('favoriteColor');
     *
     * // Check if user can update globalConfig without knowing key or value
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
     *
     * Updates are applied optimistically locally, so your change will be reflected in
     * {@link GlobalConfig} before the promise resolves.
     *
     * @param key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @example
     * ```js
     * import {globalConfig} from '@airtable/blocks';
     *
     * function updateFavoriteColorIfPossible(color) {
     *     if (globalConfig.hasPermissionToSetPaths('favoriteColor', color)) {
     *         globalConfig.setPathsAsync('favoriteColor', color);
     *     }
     *     // The update is now applied within your block (eg will be
     *     // reflected in globalConfig) but are still being saved to
     *     // Airtable servers (e.g. may not be updated for other users yet)
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
     * Returns `{hasPermission: true}` if the current user can set the specified key,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param updates The paths and values to set.
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
     * const setUnknownPathsCheckResult =
     *     globalConfig.checkPermissionsForSetPaths();
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
     * Checks whether the current user has permission to perform the specified updates to global
     * config.
     *
     * Accepts partial input, in the same format as {@link setPathsAsync}.
     * The more information provided, the more accurate the permissions check will be.
     *
     * @param updates The paths and values to set.
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
     *     // globalConfig) but are still being saved to Airtable servers (e.g. they
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
            const pathValidation = this._validatePath(update.path, this._kvStore);
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
        // This helper validates updates and throw errors if necessary.
        // To avoid the case where an error is encountered after some updates have already been
        // applied (where we'd have to crash the block instead of letting the developer catch the
        // error), it doesn't mutate the current store: it returns newKvStore with changes applied.
        const {
            newKvStore,
            changedTopLevelKeys,
        } = this._airtableInterface.globalConfigHelpers.validateAndApplyUpdates(
            updates,
            this._kvStore,
        );

        // The updates are all good! Replace our kvStore with the new version.
        this._kvStore = newKvStore;

        // Now loop over the top level keys to fire change events.
        for (const key of changedTopLevelKeys) {
            this._onChange(key);
        }
        if (changedTopLevelKeys.length) {
            this._onChange('*');
        }
    }
}

export default GlobalConfig;
