// @flow
const Watchable = require('client/blocks/sdk/watchable');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const BlockMessageTypes = require('client/blocks/block_message_types');
const utils = require('client/blocks/sdk/utils');
const _ = require('client_server_shared/lodash.custom');

const WatchableViewportKeys = {
    isFullscreen: 'isFullscreen',
    size: 'size',
};

type WatchableViewportKey = $Keys<typeof WatchableViewportKeys>;

class Viewport extends Watchable<WatchableViewportKey> {
    static _className = 'Viewport';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableViewportKeys, key);
    }
    _isFullscreen: boolean;
    _sizeWatchCount: number;
    _onSizeChangeDebounced: Function;
    constructor(isFullscreen: boolean) {
        super();

        this._isFullscreen = isFullscreen;

        // When size is watched, we'll increment this counter, and we'll decrement
        // it when it is unwatched and the counter is at 0. This way we can lazily
        // add an event listener for window resize and remove it when nobody is
        // listening anymore.
        this._sizeWatchCount = 0;

        liveappInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_ENTER_FULLSCREEN, () => {
            this._onEnterFullscreen();
        });

        liveappInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_EXIT_FULLSCREEN, () => {
            this._onExitFullscreen();
        });

        this._onSizeChangeDebounced = _.debounce(this._onSizeChange.bind(this), 200);
    }
    enterFullscreen() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            BlockMessageTypes.HostMethodNames.ENTER_FULLSCREEN,
        ));
    }
    exitFullscreen() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            BlockMessageTypes.HostMethodNames.EXIT_FULLSCREEN,
        ));
    }
    get isFullscreen(): boolean {
        return this._isFullscreen;
    }
    get size(): {width: number, height: number} {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
    watch(keys: WatchableViewportKey | Array<WatchableViewportKey>, callback: Function, context?: any): Array<WatchableViewportKey> { // eslint-disable-line flowtype/no-weak-types
        const validKeys = super.watch(keys, callback, context);

        if (_.includes(validKeys, WatchableViewportKeys.size)) {
            if (this._sizeWatchCount === 0) {
                window.addEventListener('resize', this._onSizeChangeDebounced, false);
            }
            this._sizeWatchCount++;
        }

        return validKeys;
    }
    unwatch(keys: WatchableViewportKey | Array<WatchableViewportKey>, callback: Function, context?: any): Array<WatchableViewportKey> { // eslint-disable-line flowtype/no-weak-types
        const validKeys = super.unwatch(keys, callback, context);

        if (_.includes(validKeys, WatchableViewportKeys.size)) {
            this._sizeWatchCount--;
            if (this._sizeWatchCount === 0) {
                window.removeEventListener('resize', this._onSizeChangeDebounced, false);
            }
        }

        return validKeys;
    }
    _onEnterFullscreen() {
        this._isFullscreen = true;

        this._onChange(WatchableViewportKeys.isFullscreen);
    }
    _onExitFullscreen() {
        this._isFullscreen = false;

        this._onChange(WatchableViewportKeys.isFullscreen);
    }
    _onSizeChange() {
        this._onChange(WatchableViewportKeys.size);
    }
}

module.exports = Viewport;
