/** @hidden */ /** */
import * as React from 'react';
import {isEnumValue, ObjectValues} from '../private_utils';
import Watchable from '../watchable';
import {baymax} from './baymax_utils';
import {useSdk} from './sdk_context';

const WatchableGlobalAlertKeys = Object.freeze({
    __alertInfo: '__alertInfo' as const,
});
/** @hidden */
type WatchableGlobalAlertKey = ObjectValues<typeof WatchableGlobalAlertKeys>;

/** @hidden */
interface AlertInfo {
    content: React.ReactElement;
}

const GlobalAlertInfo = () => {
    const sdk = useSdk();

    return (
        <span className={baymax('center line-height-4 quiet strong')}>
            <span
                className={baymax('pointer understroke link-unquiet')}
                onClick={() => {
                    sdk.reload();
                }}
            >
                Please reload
            </span>
        </span>
    );
};

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
            content: <GlobalAlertInfo />,
        };
        this._onChange(WatchableGlobalAlertKeys.__alertInfo);
    }
}

export default GlobalAlert;
