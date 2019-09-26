// @flow
import Watchable from './watchable';
import {isEnumValue} from './private_utils';
import {type AirtableInterface} from './injected/airtable_interface';

const WatchableSettingsButtonKeys = Object.freeze({
    isVisible: ('isVisible': 'isVisible'),
    click: ('click': 'click'),
});

type WatchableSettingsButtonKey = $Values<typeof WatchableSettingsButtonKeys>;

/**
 * Interface to the settings button that lives outside the block's viewport.
 *
 * The [useSettingsButton](#usesettingsbutton) hook is the recommend way to watch the settings
 * button, but you can also use it directly as per below example.
 *
 * Watch `click` to handle click events on the button.
 *
 * @alias settingsButton
 * @example
 * import {settingsButton} from '@airtable/blocks';
 * // Button is not visible by default
 * settingsButton.show();
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 */
class SettingsButton extends Watchable<WatchableSettingsButtonKey> {
    static _className = 'SettingsButton';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSettingsButtonKeys, key);
    }
    _refCount: number;
    _airtableInterface: AirtableInterface;
    /** @hideconstructor */
    constructor(airtableInterface: AirtableInterface) {
        super();

        this._refCount = 0;
        this._airtableInterface = airtableInterface;
    }

    /**
     * Get notified of changes to the settings button.
     *
     * Watchable keys are:
     * - `'isVisible'`
     * - `'click'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof settingsButton
     * @instance
     * @param {(WatchableSettingsButtonKey|Array<WatchableSettingsButtonKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {Object?} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableSettingsButtonKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof settingsButton
     * @instance
     * @param {(WatchableSettingsButtonKey|Array<WatchableSettingsButtonKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableSettingsButtonKey>} the array of keys that were unwatched
     */

    /**
     * Whether the settings button is being shown.
     * Can be watched.
     *
     * @memberof settingsButton
     */
    get isVisible(): boolean {
        return this._refCount > 0;
    }

    /**
     * Show the settings button.
     *
     * @memberof settingsButton
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
     *
     * @memberof settingsButton
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

    __onClick() {
        this._onChange(WatchableSettingsButtonKeys.click);
    }
}

export default SettingsButton;
