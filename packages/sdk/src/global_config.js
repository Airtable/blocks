// @flow
import {PermissionLevels} from './types/permission_levels';
import Watchable from './watchable';
import getSdk from './get_sdk';
import {type AirtableInterface, type AirtableWriteAction} from './injected/airtable_interface';
import {spawnError} from './error_utils';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const blockKvHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/blocks/block_kv_helpers',
);
const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const forkObjectPathForWriteByReference = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/fork_object_path_for_write_by_reference',
);

/**
 * @typedef
 */
export type GlobalConfigKey = string | Array<string>;

/**
 * @typedef {null|boolean|number|string|Array<GlobalConfigValue>|Object.<string, GlobalConfigValue>}
 */
export type GlobalConfigValue =
    | null
    | boolean
    | number
    | string
    | Array<GlobalConfigValue>
    | {[string]: GlobalConfigValue};

export type GlobalConfigData = {[string]: ?GlobalConfigValue};

export type GlobalConfigUpdate = {|
    path: Array<string>,
    value: GlobalConfigValue | void,
|};

type WatchableGlobalConfigKey = string;

/** @private */
function validatePath(
    path: GlobalConfigKey,
    store: GlobalConfigData,
): {|isValid: true|} | {|isValid: false, reason: string|} {
    const validation = blockKvHelpers.validateKvKeyPath(path, store);
    if (!validation.isValid) {
        return validation;
    }
    if (path === '*' || (Array.isArray(path) && path[0] === '*')) {
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
 * import {globalConfig} from '@airtable/blocks';
 */
class GlobalConfig extends Watchable<WatchableGlobalConfigKey> {
    static _className = 'GlobalConfig';
    static _isWatchableKey(key: string): boolean {
        return true;
    }
    _kvStore: GlobalConfigData;
    _airtableInterface: AirtableInterface;
    /**
     * @hideconstructor
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
     * @param {Object?} [context] an optional context for `this` in `callback`.
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
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableGlobalConfigKey>} the array of keys that were unwatched
     */

    /**
     * @private
     */
    __getTopLevelKey(key: GlobalConfigKey): string {
        if (Array.isArray(key)) {
            return key[0];
        }
        return key;
    }
    /**
     * @private
     */
    __formatKeyAsPath(key: GlobalConfigKey): Array<string> {
        if (!Array.isArray(key)) {
            return [key];
        }
        return key;
    }
    /**
     * Get the value at a path. Throws an error if the path is invalid.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns The value at the provided path, or `undefined` if no value exists at that path.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const topLevelValue = globalConfig.get('topLevelKey');
     * const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
     */
    get(key: GlobalConfigKey): GlobalConfigValue | void {
        const path = this.__formatKeyAsPath(key);

        const pathValidationResult = validatePath(path, this._kvStore);
        if (!pathValidationResult.isValid) {
            throw spawnError('Invalid globalConfig path: %s', pathValidationResult.reason);
        }

        const value = u.get(this._kvStore, path);
        return value;
    }
    /**
     * Returns `true` if the current user can set the global config value at `key`, `false` otherwise.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to the value.
     * @returns `true` if the current user can set the global config value at `key`, and `false` otherwise.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * if (globalConfig.canSet('favoriteColor')) {
     *     globalConfig.set('favoriteColor', 'purple');
     * }
     */
    canSet(key: GlobalConfigKey): boolean {
        const {session} = getSdk();
        return permissionHelpers.can(session.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /**
     * Sets a value at a path. Throws an error if the path or value is invalid.
     *
     * @param {string|Array<string>} key A string for the top-level key, or an array of strings describing the path to set.
     * @param value The value to set at the specified path. Use `undefined` to delete the value at the given path.
     * @returns {{}}
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * if (globalConfig.canSet('favoriteColor')) {
     *     globalConfig.set('favoriteColor', 'purple');
     * }
     */
    set(key: GlobalConfigKey, value: GlobalConfigValue | void): AirtableWriteAction<void, {}> {
        const path = this.__formatKeyAsPath(key);
        return this.setPaths([{path, value}]);
    }
    /**
     * Returns `true` if the current user can perform the specified updates to global config, `false` otherwise.
     *
     * @param {Array<{path: (string|Array<string>), value: GlobalConfigValue}>} updates The paths and values to set.
     * @returns `true` if the current user can perform the specified updates to global config, `false` otherwise.
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const updates = [
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ];
     * if (globalConfig.canSetPaths(updates)) {
     *     globalConfig.setPaths(updates);
     * }
     */
    canSetPaths(updates: Array<GlobalConfigUpdate>): boolean {
        const {session} = getSdk();
        return permissionHelpers.can(session.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /**
     * Sets multiple values. Throws if any path or value is invalid.
     *
     * @param {Array<{path: (string|Array<string>), value: GlobalConfigValue}>} updates The paths and values to set.
     * @returns {{}}
     * @example
     * import {globalConfig} from '@airtable/blocks';
     *
     * const updates = [
     *     {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
     *     {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
     * ];
     * if (globalConfig.canSetPaths(updates)) {
     *     globalConfig.setPaths(updates);
     * }
     */
    setPaths(updates: Array<GlobalConfigUpdate>): AirtableWriteAction<void, {}> {
        if (!this.canSetPaths(updates)) {
            throw spawnError('Your permission level does not allow setting globalConfig values');
        }

        for (const update of updates) {
            const pathValidation = validatePath(update.path, this._kvStore);
            if (!pathValidation.isValid) {
                throw spawnError('Invalid globalConfig path: %s', pathValidation.reason);
            }
        }
        getSdk().__applyGlobalConfigUpdates(updates);

        const completionPromise = this._airtableInterface.setMultipleKvPathsAsync(updates);
        return {
            completion: completionPromise,
        };
    }
    /**
     * @private
     * this shouldn't be called directly - instead, use getSdk().__applyGlobalConfigUpdates()
     */
    __setMultipleKvPaths(updates: Array<GlobalConfigUpdate>) {
        if (!Array.isArray(updates)) {
            throw spawnError('globalConfig updates must be an array');
        }

        const topLevelKeySet = {};

        const clonedObjectsSet = new Set();
        const workingKvStore = u.clone(this._kvStore);

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
