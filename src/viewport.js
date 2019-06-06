// @flow
import invariant from 'invariant';
import Watchable from './watchable';
import {isEnumValue} from './private_utils';
import {type AirtableInterface} from './injected/airtable_interface';

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

const WatchableViewportKeys = Object.freeze({
    isFullscreen: ('isFullscreen': 'isFullscreen'),
    size: ('size': 'size'),
    minSize: ('minSize': 'minSize'),
    maxFullscreenSize: ('maxFullscreenSize': 'maxFullscreenSize'),
});

type WatchableViewportKey = $Values<typeof WatchableViewportKeys>;
type UnsetFn = () => void;

export type ViewportSizeConstraint = {
    width: number | null,
    height: number | null,
};

const compareWithNulls = (
    a: number | null,
    b: number | null,
    compare: (number, number) => number,
): number | null => {
    if (a !== null && b !== null) {
        return compare(a, b);
    }
    if (a === null) {
        return b;
    }
    if (b === null) {
        return a;
    }
    return null;
};
/**
 * Information about the current viewport
 *
 * @example
 * import {viewport} from 'airtable-block';
 */
class Viewport extends Watchable<WatchableViewportKey> {
    static _className = 'Viewport';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewportKeys, key);
    }

    _isFullscreen: boolean;
    _airtableInterface: AirtableInterface;
    _sizeWatchCount: number;
    _onSizeChangeDebounced: Function;
    _minSizes: Set<ViewportSizeConstraint> = new Set();
    _maxFullscreenSizes: Set<ViewportSizeConstraint> = new Set();
    _cachedMaxFullscreenSize: ViewportSizeConstraint | null = null;
    _cachedMinSize: ViewportSizeConstraint | null = null;

    constructor(isFullscreen: boolean, airtableInterface: AirtableInterface) {
        super();

        this._isFullscreen = isFullscreen;
        this._airtableInterface = airtableInterface;

        // When size is watched, we'll increment this counter, and we'll decrement
        // it when it is unwatched and the counter is at 0. This way we can lazily
        // add an event listener for window resize and remove it when nobody is
        // listening anymore.
        this._sizeWatchCount = 0;

        this._onSizeChangeDebounced = u.debounce(this._onSizeChange.bind(this), 200);

        // whenever maxFullscreenSize changes, we want to sync it back to the
        // containing frame
        this.watch(WatchableViewportKeys.maxFullscreenSize, () => {
            this._airtableInterface.setFullscreenMaxSize(this.maxFullscreenSize);
        });
    }
    /**
     * Request to enter fullscreen mode.
     *
     * May fail if another block is fullscreen or this block doesn't have
     * permission to fullscreen itself. Watch `isFullscreen` to know if the
     * request succeeded.
     */
    enterFullscreenIfPossible() {
        this._airtableInterface.enterFullscreen();
    }
    /** Request to exit fullscreen mode */
    exitFullscreen() {
        this._airtableInterface.exitFullscreen();
    }

    /**
     * Can be watched. The maximum dimensions of the block when it is in
     * fullscreen mode. Returns the smallest set of dimensions added with
     * addMaxFullscreenSize. If `width` or `height` is null, it means there is
     * no maxSize constraint on that dimension. If maxFullscreenSize would be
     * smaller than minSize, it is constrained to be at least that.
     */
    get maxFullscreenSize(): ViewportSizeConstraint {
        if (!this._cachedMaxFullscreenSize) {
            const maxFullscreenSize = Array.from(this._maxFullscreenSizes).reduce(
                (memo, size) => ({
                    width: compareWithNulls(memo.width, size.width, Math.min),
                    height: compareWithNulls(memo.height, size.height, Math.min),
                }),
                {width: null, height: null},
            );

            const minSize = this.minSize;
            this._cachedMaxFullscreenSize = {
                width:
                    maxFullscreenSize.width !== null && minSize.width !== null
                        ? Math.max(maxFullscreenSize.width, minSize.width)
                        : maxFullscreenSize.width,
                height:
                    maxFullscreenSize.height !== null && minSize.height !== null
                        ? Math.max(maxFullscreenSize.height, minSize.height)
                        : maxFullscreenSize.height,
            };
        }

        return this._cachedMaxFullscreenSize;
    }

    /**
     * Add a maximum fullscreen size constraint. Returns a function that can be
     * called to remove the fullscreen size that was added. Use
     * .maxFullscreenSize to get the aggregate of all added constraints. Both
     * `width` and `height` are optional - if either is set to null, that means
     * there is no max size in that dimension.
     */
    addMaxFullscreenSize({width, height}: $Shape<ViewportSizeConstraint>): UnsetFn {
        const size = Object.freeze({
            width: typeof width === 'number' ? width : null,
            height: typeof height === 'number' ? height : null,
        });

        this._cachedMaxFullscreenSize = null;
        this._maxFullscreenSizes.add(size);
        this._onChange(WatchableViewportKeys.maxFullscreenSize);

        return () => {
            invariant(this._maxFullscreenSizes.has(size), 'UnsetFn can only be called once');
            this._cachedMaxFullscreenSize = null;
            this._maxFullscreenSizes.delete(size);
            this._onChange(WatchableViewportKeys.maxFullscreenSize);
        };
    }

    /**
     * Can be watched. The minimum dimensions of the block - if the viewport
     * gets smaller than this size, an overlay will be shown asking the user to
     * resize the block to be bigger. Returns the largest set of dimensions
     * added with addMinSize. If `width` or `height` is null, it means there is
     * no minSize constraint on that dimension.
     */
    get minSize(): ViewportSizeConstraint {
        if (!this._cachedMinSize) {
            this._cachedMinSize = Array.from(this._minSizes).reduce(
                (memo, size) => ({
                    width: compareWithNulls(memo.width, size.width, Math.max),
                    height: compareWithNulls(memo.height, size.height, Math.max),
                }),
                {width: null, height: null},
            );
        }

        return this._cachedMinSize;
    }

    /**
     * Add a minimum frame size constraint. Returns a function that can be
     * called to remove the added constraint. Use .minSize to get the aggregate
     * of all added constraints. Both `width` and `height` are optional - if
     * either is null, there is no minimum size in that dimension.
     */
    addMinSize({width, height}: $Shape<ViewportSizeConstraint>): UnsetFn {
        const size = Object.freeze({
            width: typeof width === 'number' ? width : null,
            height: typeof height === 'number' ? height : null,
        });

        this._cachedMinSize = null;
        // min size is also a constraint on maxFullscreenSize:
        this._cachedMaxFullscreenSize = null;
        this._minSizes.add(size);
        this._onChange(WatchableViewportKeys.minSize);
        this._onChange(WatchableViewportKeys.maxFullscreenSize);

        return () => {
            invariant(this._minSizes.has(size), 'UnsetFn can only be called once');
            this._cachedMinSize = null;
            this._cachedMaxFullscreenSize = null;
            this._minSizes.delete(size);
            this._onChange(WatchableViewportKeys.minSize);
            // min size is also a constraint on maxFullscreenSize:
            this._onChange(WatchableViewportKeys.maxFullscreenSize);
        };
    }

    /** */
    get isSmallerThanMinSize(): boolean {
        const {width, height} = this.size;
        const isWidthTooSmall = this.minSize.width !== null && this.minSize.width > width;
        const isHeightTooSmall = this.minSize.height !== null && this.minSize.height > height;
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
    watch(
        keys: WatchableViewportKey | Array<WatchableViewportKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableViewportKey> {
        const validKeys = super.watch(keys, callback, context);

        if (validKeys.includes(WatchableViewportKeys.size)) {
            if (this._sizeWatchCount === 0) {
                window.addEventListener('resize', this._onSizeChangeDebounced, false);
            }
            this._sizeWatchCount++;
        }

        return validKeys;
    }
    unwatch(
        keys: WatchableViewportKey | Array<WatchableViewportKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableViewportKey> {
        const validKeys = super.unwatch(keys, callback, context);

        if (validKeys.includes(WatchableViewportKeys.size)) {
            this._sizeWatchCount--;
            if (this._sizeWatchCount === 0) {
                window.removeEventListener('resize', this._onSizeChangeDebounced, false);
            }
        }

        return validKeys;
    }
    __onEnterFullscreen() {
        this._isFullscreen = true;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    __onExitFullscreen() {
        this._isFullscreen = false;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    __focus() {
        const {body, activeElement} = document;
        // See comment in BlockFrame.focusIframe for why we do this.
        if (activeElement && activeElement !== body) {
            // If there's already an activeElement, re-focus it.
            activeElement.focus();
        } else if (body) {
            // If there isn't an activeElement, create a dummy input
            // to capture focus.
            const input = document.createElement('input');
            body.appendChild(input);
            input.focus();
            input.remove();
        }
    }
    _onSizeChange() {
        this._onChange(WatchableViewportKeys.size);
    }
}

export default Viewport;
