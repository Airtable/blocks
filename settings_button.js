// @flow
const Watchable = require('client/blocks/sdk/watchable');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const {HostMethodNames, HostToBlock} = require('client/blocks/block_message_types');
const utils = require('client/blocks/sdk/utils');

const WatchableSettingsButtonKeys = {
    isVisible: 'isVisible',
    click: 'click',
};

type WatchableSettingsButtonKey = $Keys<typeof WatchableSettingsButtonKeys>;

/**
 * Interface to the settings button that lives outside the block's viewport.
 *
 * Watch `click` to handle click events on the button.
 *
 * @example
 * import {settingsButton} from 'airtable-block';
 * settingsButton.isVisible = true;
 * settingsButton.watch('click', () => {
 *     alert('Clicked!');
 * })
 */
class SettingsButton extends Watchable<WatchableSettingsButtonKey> {
    static _className = 'SettingsButton';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableSettingsButtonKeys, key);
    }
    _isVisible: boolean;
    constructor() {
        super();

        this._isVisible = false;

        liveappInterface.registerHandler(HostToBlock.DID_CLICK_SETTINGS_BUTTON, () => {
            if (this._isVisible) {
                // Since there's an async gap when communicating with liveapp,
                // no-op if the button has been hidden since it was clicked.
                this._onChange(WatchableSettingsButtonKeys.click);
            }
        });
    }
    /**
     * Whether the settings button is being shown.
     * Set to `true` to show the settings button.
     * Can be watched.
     */
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(isVisible: boolean) {
        this._isVisible = isVisible;

        this._onChange(WatchableSettingsButtonKeys.isVisible, isVisible);

        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            HostMethodNames.SET_SETTINGS_BUTTON_VISIBILITY,
            {isVisible},
        ));
    }
}

module.exports = SettingsButton;
