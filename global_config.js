// @flow
const {h, u} = require('client_server_shared/hu');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const BlockMessageTypes = require('client/blocks/block_message_types');
const Watchable = require('client/blocks/sdk/watchable');
const getSdk = require('client/blocks/sdk/get_sdk');
const blockKvHelpers = require('client_server_shared/blocks/block_kv_helpers');
const PermissionLevels = require('client_server_shared/permissions/permission_levels');
const permissionHelpers = require('client_server_shared/permissions/permission_helpers');

import type {BlockKvValue, BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';

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
    _kvStore: {[string]: BlockKvValue};
    _isDevelopmentMode: boolean;
    constructor(initialKvValuesByKey: {[string]: BlockKvValue}, isDevelopmentMode: boolean) {
        super();

        this._isDevelopmentMode = isDevelopmentMode;

        this._kvStore = initialKvValuesByKey;

        liveappInterface.registerHandler(BlockMessageTypes.HostToBlock.SET_MULTIPLE_KV_PATHS, data => {
            this._setMultipleKvPaths(data.updates);
        });
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
    get(key: GlobalConfigKey): BlockKvValue {
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
    set(key: GlobalConfigKey, value: BlockKvValue) {
        const path = this.__formatKeyAsPath(key);
        this.setPaths([
            {path, value},
        ]);
    }
    // TODO(jb): deprecate this in favor of set, now that set accepts a path.
    setPath(path: Array<string>, value: BlockKvValue) {
        this.setPaths([
            {path, value},
        ]);
    }
    /** */
    canSetPaths(updates: Array<BlockKvUpdate>) {
        // This takes the updates to future-proof against having per-key
        // permissions.
        // For now, just need at least edit permissions to update globalConfig.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    setPaths(updates: Array<BlockKvUpdate>) {
        // We check here, instead of deeper (e.g. on the liveapp side) so the user
        // gets a more useful error stack trace.
        if (!this.canSetPaths(updates)) {
            throw new Error('Your permission level does not allow setting globalConfig values');
        }

        this._setMultipleKvPaths(updates);

        // Now send the update over to liveapp.
        // TODO(jb): remove the isDevelopmentMode arg once we think enough clients
        // are updated. New clients don't need it, but we don't want to break old ones.
        liveappInterface.setMultipleKvPaths(updates, this._isDevelopmentMode);
    }
    _setMultipleKvPaths(updates: Array<BlockKvUpdate>) {
        if (!Array.isArray(updates)) {
            throw new Error('globalConfig updates must be an array');
        }

        const topLevelKeySet = {};
        for (const update of updates) {
            const updateValidationResult = blockKvHelpers.validateKvStoreUpdate(update, this._kvStore);
            if (!updateValidationResult.isValid) {
                throw new Error(`Invalid globalConfig update: ${updateValidationResult.reason}`);
            }
            blockKvHelpers.applyValidatedUpdateToKvStoreByReference(this._kvStore, update);

            const topLevelKey = update.path[0];
            topLevelKeySet[topLevelKey] = true;
        }

        const limitCheckResult = blockKvHelpers.limitCheckKvStore(this._kvStore, u.keys(topLevelKeySet));
        if (!limitCheckResult.isValid) {
            throw new Error(`globalConfig over limits: ${limitCheckResult.reason}`);
        }

        // Now loop over the top level keys to fire change events.
        // NOTE: it's important that we do this after the loop above (instead of inline),
        // so that all of the changes are reflected by the time we trigger change events.
        for (const key of Object.keys(topLevelKeySet)) {
            this._onChange(key);
        }
    }
}

module.exports = GlobalConfig;
