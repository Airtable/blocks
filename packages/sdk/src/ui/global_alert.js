// @flow
import * as React from 'react';
import {isEnumValue} from '../private_utils';
import Watchable from '../watchable';
import getSdk from '../get_sdk';

const WatchableGlobalAlertKeys = Object.freeze({
    __alertInfo: ('__alertInfo': '__alertInfo'),
});
type WatchableGlobalAlertKey = $Values<typeof WatchableGlobalAlertKeys>;

type AlertInfo = {
    content: React$Element<*>,
};

/**
 * @private
 * @example
 * import {globalAlert} from '@airtable/blocks/ui';
 * globalAlert.showReloadPrompt();
 */
class GlobalAlert extends Watchable<WatchableGlobalAlertKey> {
    static _className = 'GlobalAlert';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableGlobalAlertKeys, key);
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
    showReloadPrompt() {
        this._alertInfo = {
            content: (
                <span className="center line-height-4 quiet strong">
                    <span
                        className="pointer understroke link-unquiet"
                        onClick={() => {
                            getSdk().reload();
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

export default GlobalAlert;
