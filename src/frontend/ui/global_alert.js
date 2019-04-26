// @flow
const React = require('block_sdk/frontend/ui/react');
const utils = require('block_sdk/shared/private_utils');
const Watchable = require('block_sdk/shared/watchable');
const getFrontendSdk = require('block_sdk/frontend/get_frontend_sdk');

const WatchableGlobalAlertKeys = {
    __alertInfo: '__alertInfo',
};
type WatchableGlobalAlertKey = $Keys<typeof WatchableGlobalAlertKeys>;

type AlertInfo = {
    content: React$Element<*>,
};

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.globalAlert.showReloadPrompt();
 */
class GlobalAlert extends Watchable<WatchableGlobalAlertKey> {
    static _className = 'GlobalAlert';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableGlobalAlertKeys, key);
    }
    _alertInfo: AlertInfo | null;
    constructor() {
        super();
        this._alertInfo = null;
        Object.seal(this);
    }
    get __alertInfo(): AlertInfo | null {
        return this._alertInfo;
    }
    /** */
    showReloadPrompt() {
        this._alertInfo = {
            content: (
                <span className="center line-height-4 quiet strong">
                    <span
                        className="pointer understroke link-unquiet"
                        onClick={() => {
                            getFrontendSdk().reload();
                        }}
                    >
                        Please reload
                    </span>
                </span>
            ),
        };
        this._onChange(WatchableGlobalAlertKeys.__alertInfo);
    }
}

module.exports = GlobalAlert;
