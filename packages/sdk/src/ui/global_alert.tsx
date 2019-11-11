/** @hidden */ /** */
import * as React from 'react';
import {isEnumValue, ObjectValues} from '../private_utils';
import Watchable from '../watchable';
import getSdk from '../get_sdk';
import {baymax} from './baymax_utils';

const WatchableGlobalAlertKeys = Object.freeze({
    __alertInfo: '__alertInfo' as const,
});
/** @hidden */
type WatchableGlobalAlertKey = ObjectValues<typeof WatchableGlobalAlertKeys>;

/** @hidden */
interface AlertInfo {
    content: React.ReactElement;
}

/**
 * @hidden
 * @example
 * ```js
 * import {globalAlert} from '@airtable/blocks/ui';
 * globalAlert.showReloadPrompt();
 * ```
 */
class GlobalAlert extends Watchable<WatchableGlobalAlertKey> {
    /** @internal */
    static _className = 'GlobalAlert';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableGlobalAlertKeys, key);
    }
    /** @internal */
    _alertInfo: AlertInfo | null;
    /** @hidden */
    constructor() {
        super();
        this._alertInfo = null;
        Object.seal(this);
    }
    /** @internal */
    get __alertInfo(): AlertInfo | null {
        return this._alertInfo;
    }
    /** */
    showReloadPrompt() {
        this._alertInfo = {
            content: (
                <span className={baymax('center line-height-4 quiet strong')}>
                    <span
                        className={baymax('pointer understroke link-unquiet')}
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
