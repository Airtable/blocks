// @flow
const Watchable = require('../shared/watchable');
const utils = require('../shared/private_utils');

import type AirtableInterfaceFrontend from './airtable_interface_frontend';

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
    _airtableInterface: AirtableInterfaceFrontend;
    constructor(airtableInterface: AirtableInterfaceFrontend) {
        super();

        this._isVisible = false;
        this._airtableInterface = airtableInterface;
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

        this._airtableInterface.setSettingsButtonVisibility(isVisible);
    }
    __onClick() {
        this._onChange(WatchableSettingsButtonKeys.click);
    }
}

module.exports = SettingsButton;
