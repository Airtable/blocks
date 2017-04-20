// @flow
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const BlockMessageTypes = require('client/blocks/block_message_types');
const Watchable = require('client/blocks/sdk/watchable');
const getSdk = require('client/blocks/sdk/get_sdk');

type WatchableGlobalConfigKey = string;

// NOTE: GlobalConfig is essentially a wrapper around a generic key-value store.
// It's called GlobalConfig in order to convey two main points about its intended
// usage:
// 1) that it is synced 'globally' across clients (at some point we might make
//    a UserConfig which would be scoped to an individual user), and
// 2) that is should be used mainly for configuration of the block (kv store
//    as a name seems a bit too vague in terms of intended usage).
class GlobalConfig extends Watchable<WatchableGlobalConfigKey> {
    static _className = 'GlobalConfig';
    static _isWatchableKey(key: string): boolean {
        // The user can store any arbitrary key in the global config, so there's
        // not much we can do here to check if a key is valid.
        return true;
    }
    _kvStore: {[key: string]: mixed};
    _isDevelopmentMode: boolean;
    constructor(initialKvStringifiedValuesByKey: {[key: string]: string}, isDevelopmentMode: boolean) {
        super();

        this._isDevelopmentMode = isDevelopmentMode;

        this._kvStore = {};
        for (const key of Object.keys(initialKvStringifiedValuesByKey)) {
            const value = initialKvStringifiedValuesByKey[key];
            this._kvStore[key] = JSON.parse(value);
        }

        liveappInterface.registerHandler(BlockMessageTypes.HostToBlock.SET_KV_VALUE, data => {
            this._setFromLiveapp(data.key, data.value);
        });
    }
    get(key: string): mixed {
        return this._kvStore[key];
    }
    set(key: string, value: mixed) {
        // Read-only users can't update kvstore. Return an error to the block in this case.
        // We check here, instead of deeper (e.g. on the liveapp side) so the user
        // gets a more useful error stack trace.
        const {base, models} = getSdk();
        if (base.permissionLevel === models.permissionLevels.READ) {
            throw new Error(`Read-only user cannot set globalConfig value for key: ${key}`);
        }

        this._setKvValue(key, value);

        // Now send the update over to liveapp. Liveapp will handle whether or not it
        // sends the update to the server (depending on whether we are in dev mode
        // or not).
        liveappInterface.setKvValue(key, JSON.stringify(value), this._isDevelopmentMode);
    }
    _setFromLiveapp(key: string, stringifiedValue: ?string) {
        let value: mixed;
        if (stringifiedValue) {
            value = JSON.parse(stringifiedValue);
        }
        this._setKvValue(key, value);

        // NOTE: don't send this update to liveapp, since it originated from liveapp.
    }
    _setKvValue(key: string, value: mixed) {
        if (typeof key !== 'string' || key === '') {
            throw new Error('globalConfig key must be a non-empty string');
        }

        if (value !== undefined) {
            this._kvStore[key] = value;
        } else {
            delete this._kvStore[key];
        }

        this._onChange(key);
    }
}

module.exports = GlobalConfig;
