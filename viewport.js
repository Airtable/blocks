// @flow
const Watchable = require('client/blocks/sdk/watchable');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const BlockMessageTypes = require('client/blocks/block_message_types');
const utils = require('client/blocks/sdk/utils');
const u = require('client_server_shared/u');

const WatchableViewportKeys = {
    isFullscreen: 'isFullscreen',
    size: 'size',
    minSize: 'minSize',
};

type WatchableViewportKey = $Keys<typeof WatchableViewportKeys>;

/**
 * Information about the current viewport
 *
 * @example
 * import {viewport} from 'airtable-block';
 */
class Viewport extends Watchable<WatchableViewportKey> {
    static _className = 'Viewport';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableViewportKeys, key);
    }
    _isFullscreen: boolean;
    _sizeWatchCount: number;
    _onSizeChangeDebounced: Function;
    _minSize: {width: number | null, height: number | null};
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

        this._onSizeChangeDebounced = u.debounce(this._onSizeChange.bind(this), 200);

        this._minSize = Object.freeze({
            width: null,
            height: null,
        });
    }
    /**
     * Request to enter fullscreen mode.
     *
     * May fail if another block is fullscreen or this block doesn't have
     * permission to fullscreen itself. Watch `isFullscreen` to know if the
     * request succeeded.
     */
    enterFullscreen() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            BlockMessageTypes.HostMethodNames.ENTER_FULLSCREEN,
        ));
    }
    /** Request to exit fullscreen mode */
    exitFullscreen() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            BlockMessageTypes.HostMethodNames.EXIT_FULLSCREEN,
        ));
    }
    /**
     * Set the maximum dimensions of the block when it is in fullscreen mode.
     * Both `width` and `height` are optional. If either is set to `null`, that
     * means there is not max size in that dimension.
     */
    setMaxFullscreenSize(size: {width?: number | null, height?: number | null}) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            BlockMessageTypes.HostMethodNames.SET_FULLSCREEN_MAX_SIZE,
            {
                width: size.width,
                height: size.height,
            },
        ));
    }
    /** Can be watched. */
    get minSize(): {width: number | null, height: number | null} {
        return this._minSize;
    }
    /**
     * Set the minimum dimensions of the block. If the viewport gets smaller
     * than this size, an overlay will be shown to the user asking them to
     * resize the block to be bigger.
     *
     * Both `width` and `height` and optional. If either is set to `null`, that
     * means there is not a min size in that dimension.
     */
    setMinSize(size: {width?: number | null, height?: number | null}) {
        this._minSize = Object.freeze({
            ...this._minSize,
            ...size,
        });
        this._onChange(WatchableViewportKeys.minSize);
    }
    /** */
    get isSmallerThanMinSize(): boolean {
        const {width, height} = this.size;
        const isWidthTooSmall = this._minSize.width !== null && this._minSize.width > width;
        const isHeightTooSmall = this._minSize.height !== null && this._minSize.height > height;
        return isWidthTooSmall || isHeightTooSmall;
    }
    /** Can be watched. */
    get isFullscreen(): boolean {
        return this._isFullscreen;
    }
    /** Can be watched. */
    get size(): {width: number, height: number} {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
    watch(keys: WatchableViewportKey | Array<WatchableViewportKey>, callback: Function, context?: ?Object): Array<WatchableViewportKey> {
        const validKeys = super.watch(keys, callback, context);

        if (u.includes(validKeys, WatchableViewportKeys.size)) {
            if (this._sizeWatchCount === 0) {
                window.addEventListener('resize', this._onSizeChangeDebounced, false);
            }
            this._sizeWatchCount++;
        }

        return validKeys;
    }
    unwatch(keys: WatchableViewportKey | Array<WatchableViewportKey>, callback: Function, context?: ?Object): Array<WatchableViewportKey> {
        const validKeys = super.unwatch(keys, callback, context);

        if (u.includes(validKeys, WatchableViewportKeys.size)) {
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
        this._onChange(WatchableViewportKeys.size);
    }
    _onExitFullscreen() {
        this._isFullscreen = false;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    _onSizeChange() {
        this._onChange(WatchableViewportKeys.size);
    }
}

module.exports = Viewport;
