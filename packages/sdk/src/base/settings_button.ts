/** @module @airtable/blocks: settingsButton */ /** */
import Watchable from '../shared/watchable';
import {isEnumValue, ObjectValues} from '../shared/private_utils';
import {AirtableInterface} from './types/airtable_interface';

const WatchableSettingsButtonKeys = Object.freeze({
    isVisible: 'isVisible' as const,
    click: 'click' as const,
});

/**
 * A watchable key in {@link SettingsButton}.
 * - `isVisible`
 * - `click`
 */
type WatchableSettingsButtonKey = ObjectValues<typeof WatchableSettingsButtonKeys>;

/**
 * Interface to the settings button that lives outside the extension's viewport.
 *
 * The {@link useSettingsButton} hook is the recommended way to use the settings button, but you can
 * also use it with {@link useWatchable} if you want more granular control (for example, to only
 * show the button conditionally).
 *
 * @alias settingsButton
 * @example
 * ```js
 * import {settingsButton} from '@airtable/blocks';
 * import {useWatchable} from '@airtable/blocks/ui';
 *
 * function AppWithSettings({shouldShowSettingsButton}) {
 *     useEffect(() => {
 *         // A count of calls to `show()` and `hide()` is maintained internally. The button will
 *         // stay visible if there are more calls to `show()` than `hide()` - so here, we check
 *         // `isVisible` so we only we only call them when necessary.
 *         // The button is not visible by default.
 *         if (shouldShowSettingsButton && !settingsButton.isVisible) {
 *             settingsButton.show();
 *         } else if (!shouldShowSettingsButton && settingsButton.isVisible) {
 *             settingsButton.hide();
 *         }
 *     });
 *
 *     useWatchable(settingsButton, 'click', function() {
 *         alert('Clicked!');
 *     });
 * }
 * ```
 * @docsPath models/SettingsButton
 */
class SettingsButton extends Watchable<WatchableSettingsButtonKey> {
    /** @internal */
    static _className = 'SettingsButton';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSettingsButtonKeys, key);
    }
    /** @internal */
    _refCount: number;
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    constructor(airtableInterface: AirtableInterface) {
        super();

        this._refCount = 0;
        this._airtableInterface = airtableInterface;
    }

    /**
     * Whether the settings button is being shown.
     * Can be watched.
     */
    get isVisible(): boolean {
        return this._refCount > 0;
    }

    /**
     * Show the settings button.
     */
    show() {
        if (this._refCount === 0) {
            this._onChange(WatchableSettingsButtonKeys.isVisible, true);
            this._airtableInterface.setSettingsButtonVisibility(true);
        }

        this._refCount += 1;
    }

    /**
     * Hide the settings button.
     *
     * Note: A count of calls to `show()` and `hide()` is maintained internally. The button will
     * stay visible if there are more calls to `show()` than `hide()`.
     */
    hide() {
        if (this._refCount > 0) {
            this._refCount -= 1;
        }

        if (this._refCount === 0) {
            this._onChange(WatchableSettingsButtonKeys.isVisible, false);
            this._airtableInterface.setSettingsButtonVisibility(false);
        }
    }

    /** @internal */
    __onClick() {
        this._onChange(WatchableSettingsButtonKeys.click);
    }
}

export default SettingsButton;
