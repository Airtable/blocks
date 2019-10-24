/** @module @airtable/blocks: settingsButton */ /** */
import Watchable from './watchable';
import {isEnumValue, ObjectValues} from './private_utils';
import {AirtableInterface} from './injected/airtable_interface';

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
 * Interface to the settings button that lives outside the block's viewport.
 *
 * The {@link useSettingsButton} hook is the recommend way to watch the settings
 * button, but you can also use it directly as per below example.
 *
 * Watch `click` to handle click events on the button.
 *
 * @alias settingsButton
 * @example
 * ```js
 * import {settingsButton} from '@airtable/blocks';
 * // Button is not visible by default
 * settingsButton.show();
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 * ```
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
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param context an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof settingsButton
     * @instance
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param context the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
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
        // Is now visible: trigger change watches and set it to be visible
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
        // Be forgiving if hide() is called too many times, since we don't expose the count
        if (this._refCount > 0) {
            this._refCount -= 1;
        }

        // Should no longer be visible: trigger change watches and set it to be not visible
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
