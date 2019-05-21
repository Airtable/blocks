// @flow
import {
    type GlobalConfigValue,
    type GlobalConfigUpdate,
    type GlobalConfigData,
} from './types/global_config';
import {PermissionLevels} from './types/permission_levels';
import Watchable from './watchable';
import getSdk from './get_sdk';
import {type AirtableInterface, type AirtableWriteAction} from './injected/airtable_interface';

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

export type GlobalConfigKey = string | Array<string>;

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
 * a publicly shared base, or in development mode.
 *
 * Any key can be watched to know when the value of the key changes.
 *
 * @example
 * import {globalConfig} from 'airtable-block';
 */
class GlobalConfig extends Watchable<WatchableGlobalConfigKey> {
    static _className = 'GlobalConfig';
    static _isWatchableKey(key: string): boolean {
        // The user can store any arbitrary key in the global config, so there's
        // not much we can do here to check if a key is valid.
        return true;
    }
    _kvStore: GlobalConfigData;
    _airtableInterface: AirtableInterface;
    constructor(initialKvValuesByKey: GlobalConfigData, airtableInterface: AirtableInterface) {
        super();

        this._kvStore = initialKvValuesByKey;
        this._airtableInterface = airtableInterface;
    }
    __getTopLevelKey(key: GlobalConfigKey): string {
        if (Array.isArray(key)) {
            return key[0];
        }
        return key;
    }
    __formatKeyAsPath(key: GlobalConfigKey): Array<string> {
        if (!Array.isArray(key)) {
            return [key];
        }
        return key;
    }
    /** */
    get(key: GlobalConfigKey): GlobalConfigValue {
        const path = this.__formatKeyAsPath(key);

        const pathValidationResult = blockKvHelpers.validateKvKeyPath(path, this._kvStore);
        if (!pathValidationResult.isValid) {
            throw new Error(`Invalid globalConfig path: ${pathValidationResult.reason}`);
        }

        const value = u.get(this._kvStore, path);
        return value;
    }
    /** */
    canSet(key: GlobalConfigKey) {
        // This takes the key to future-proof against having per-key
        // permissions.
        // For now, just need at least edit permissions to update globalConfig.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    set(key: GlobalConfigKey, value: GlobalConfigValue): AirtableWriteAction<void, {}> {
        const path = this.__formatKeyAsPath(key);
        return this.setPaths([{path, value}]);
    }
    /** */
    canSetPaths(updates: Array<GlobalConfigUpdate>) {
        // This takes the updates to future-proof against having per-key
        // permissions.
        // For now, just need at least edit permissions to update globalConfig.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    setPaths(updates: Array<GlobalConfigUpdate>): AirtableWriteAction<void, {}> {
        // We check here, instead of deeper (e.g. on the liveapp side) so the user
        // gets a more useful error stack trace.
        if (!this.canSetPaths(updates)) {
            throw new Error('Your permission level does not allow setting globalConfig values');
        }

        this._setMultipleKvPaths(updates);

        // Now send the update to Airtable.
        const completionPromise = this._airtableInterface.setMultipleKvPathsAsync(updates);
        return {
            completion: completionPromise,
        };
    }
    _setMultipleKvPaths(updates: Array<GlobalConfigUpdate>) {
        if (!Array.isArray(updates)) {
            throw new Error('globalConfig updates must be an array');
        }

        const topLevelKeySet = {};

        // Create a working copy of the kvStore so that we can revert changes
        // in memory if the updates don't pass validation or limit checks.
        // First, let's shallow clone the starting kvStore.
        const clonedObjectsSet = new Set();
        const workingKvStore = u.clone(this._kvStore);

        // Before applying each update, fork the working kvStore so we can roll
        // back any changes we make.
        for (const update of updates) {
            const updateValidationResult = blockKvHelpers.validateKvStoreUpdate(
                update,
                this._kvStore,
            );
            if (!updateValidationResult.isValid) {
                throw new Error(`Invalid globalConfig update: ${updateValidationResult.reason}`);
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

        const limitCheckResult = blockKvHelpers.limitCheckKvStore(
            workingKvStore,
            u.keys(topLevelKeySet),
        );
        if (!limitCheckResult.isValid) {
            throw new Error(`globalConfig over limits: ${limitCheckResult.reason}`);
        }

        // We passed validation and limit checks, so it's safe to persist the updates.
        this._kvStore = workingKvStore;

        // Now loop over the top level keys to fire change events.
        // NOTE: it's important that we do this after the loop above (instead of inline),
        // so that all of the changes are reflected by the time we trigger change events.
        for (const key of Object.keys(topLevelKeySet)) {
            this._onChange(key);
        }
    }
    __onSetMultipleKvPaths(updates: Array<GlobalConfigUpdate>) {
        this._setMultipleKvPaths(updates);
    }
}

export default GlobalConfig;
