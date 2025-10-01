/** @hidden */ /** */
import * as React from 'react';
import {isEnumValue, type ObjectValues} from '../../shared/private_utils';
import Watchable from '../../shared/watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {BUTTON_LINK_CLASS_NAME} from './global_css_helpers';

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
        <span style={{textAlign: 'center', lineHeight: 1.5, fontWeight: 500}}>
            <span
                className={BUTTON_LINK_CLASS_NAME}
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
 * import {globalAlert} from '@airtable/blocks/base/ui';
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
