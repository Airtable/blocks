/** @module @airtable/blocks: globalConfig */ /** */
import {type SdkMode} from '../sdk_mode';
import Watchable from './watchable';
import {spawnError} from './error_utils';
import {
    type GlobalConfigPath,
    type GlobalConfigKey,
    type PartialGlobalConfigKey,
    type GlobalConfigValue,
    type GlobalConfigData,
    type GlobalConfigUpdate,
    type PartialGlobalConfigUpdate,
    type GlobalConfigPathValidationResult,
} from './types/global_config';
import {type PermissionCheckResult, MutationTypesCore} from './types/mutations_core';
import {getValueAtOwnPath} from './private_utils';
import {type BlockSdkCore} from './sdk_core';
import {type AirtableInterfaceCore} from './types/airtable_interface_core';

/**
 * You can watch any top-level key in global config. Use '*' to watch every change.
 */
type WatchableGlobalConfigKey = string;

/**
 * A key-value store for persisting configuration options for an extension installation.
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
 * The maximum allowed size for a given GlobalConfig instance is 150kB.
 * The maximum number of keys for a given GlobalConfig instance is 1000.
 *
 * @docsPath models/GlobalConfig
 */
class GlobalConfig extends Watchable<WatchableGlobalConfigKey> {
    /** @internal */
    static _className = 'GlobalConfig';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return true;
    }
    /** @internal */
    _sdk: BlockSdkCore<SdkMode>;
    /** @internal */
    _kvStore: GlobalConfigData;
    /** @internal */
    _airtableInterface: AirtableInterfaceCore<SdkMode>;
    /**
     * @internal
     */
    constructor(initialKvValuesByKey: GlobalConfigData, sdk: BlockSdkCore<SdkMode>) {
        super();

        this._kvStore = initialKvValuesByKey;
        this._sdk = sdk;
        this._airtableInterface = sdk.__airtableInterface;
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
     * import {useGlobalConfig} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const globalConfig = useGlobalConfig();
     *     const topLevelValue = globalConfig.get('topLevelKey');
     *     const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
     * }
     * ```
     */
    get(key: GlobalConfigKey): unknown {
        const path = this._formatKeyAsPath(key);

        const pathValidationResult = this._validatePath(path, this._kvStore);
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
     * import {useGlobalConfig} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const globalConfig = useGlobalConfig();
     *     const updateFavoriteColorIfPossible = (color) => {
     *         if (globalConfig.hasPermissionToSet('favoriteColor', color)) {
     *             globalConfig.setAsync('favoriteColor', color);
     *         }
     *         // The update is now applied within your extension (eg will be
     *         // reflected in globalConfig) but are still being saved to
     *         // Airtable servers (e.g. may not be updated for other users yet)
     *     }
     *
     *     const updateFavoriteColorIfPossibleAsync = async (color) => {
     *         if (globalConfig.hasPermissionToSet('favoriteColor', color)) {
     *             await globalConfig.setAsync('favoriteColor', color);
     *         }
     *         // globalConfig updates have been saved to Airtable servers.
     *         alert('favoriteColor has been updated');
     *     }
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
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
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
     * import {useGlobalConfig} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const globalConfig = useGlobalConfig();
     *     const updates = [
     *         {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *         {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     *     ];
     *
     *     const applyUpdatesIfPossible = () => {
     *         if (globalConfig.hasPermissionToSetPaths(updates)) {
     *             globalConfig.setPathsAsync(updates);
     *         }
     *         // The updates are now applied within your extension (eg will be reflected in
     *         // globalConfig) but are still being saved to Airtable servers (e.g. they
     *         // may not be updated for other users yet)
     *     }
     *
     *     const applyUpdatesIfPossibleAsync = async () => {
     *         if (globalConfig.hasPermissionToSetPaths(updates)) {
     *             await globalConfig.setPathsAsync(updates);
     *         }
     *         // globalConfig updates have been saved to Airtable servers.
     *         alert('globalConfig has been updated');
     *     }
     * }
     * ```
     */
    async setPathsAsync(updates: Array<GlobalConfigUpdate>): Promise<void> {
        if (!this.hasPermissionToSetPaths(updates)) {
            throw spawnError('Your permission level does not allow setting globalConfig values');
        }

        for (const update of updates) {
            const pathValidation = this._validatePath(update.path, this._kvStore);
            if (!pathValidation.isValid) {
                throw spawnError('Invalid globalConfig path: %s', pathValidation.reason);
            }
        }

        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypesCore.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
            updates,
        });
    }
    /**
     * @internal
     * this shouldn't be called directly - instead, use this._sdk.__applyGlobalConfigUpdates()
     */
    __setMultipleKvPaths(updates: ReadonlyArray<GlobalConfigUpdate>) {
        const {newKvStore, changedTopLevelKeys} =
            this._airtableInterface.globalConfigHelpers.validateAndApplyUpdates(
                updates,
                this._kvStore,
            );

        this._kvStore = newKvStore;

        for (const key of changedTopLevelKeys) {
            this._onChange(key);
        }
        if (changedTopLevelKeys.length) {
            this._onChange('*');
        }
    }
}

export default GlobalConfig;
