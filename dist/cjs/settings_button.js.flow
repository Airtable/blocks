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
 * Watch `click` to handle click events on the button.
 *
 * @alias settingsButton
 * @example
 * import {settingsButton} from '@airtable/blocks';
 * settingsButton.isVisible = true;
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 */
class SettingsButton extends Watchable<WatchableSettingsButtonKey> {
    static _className = 'SettingsButton';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSettingsButtonKeys, key);
    }
    _isVisible: boolean;
    _airtableInterface: AirtableInterface;
    /** @hideconstructor */
    constructor(airtableInterface: AirtableInterface) {
        super();

        this._isVisible = false;
        this._airtableInterface = airtableInterface;
    }
    /**
     * Whether the settings button is being shown.
     * Set to `true` to show the settings button.
     * Can be watched.
     *
     * @memberof settingsButton
     */
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(isVisible: boolean) {
        this._isVisible = isVisible;

        this._onChange(WatchableSettingsButtonKeys.isVisible, isVisible);

        this._airtableInterface.setSettingsButtonVisibility(isVisible);
    }
    __onClick() {
        this._onChange(WatchableSettingsButtonKeys.click);
    }
}

export default SettingsButton;
