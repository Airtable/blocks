// @flow
import Watchable from './watchable';
import {isEnumValue, debounce} from './private_utils';
import {invariant} from './error_utils';
import {type AirtableInterface} from './injected/airtable_interface';

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
 * import {viewport} from '@airtable/blocks';
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

    /** @hideconstructor */
    constructor(isFullscreen: boolean, airtableInterface: AirtableInterface) {
        super();

        this._isFullscreen = isFullscreen;
        this._airtableInterface = airtableInterface;

        this._sizeWatchCount = 0;

        this._onSizeChangeDebounced = debounce(this._onSizeChange.bind(this), 200);

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
     * The maximum dimensions of the block when it is in
     * fullscreen mode. Returns the smallest set of dimensions added with
     * [addMaxFullscreenSize](#addmaxfullscreensize).
     *
     * If `width` or `height` is null, it means there is
     * no max size constraint on that dimension. If `maxFullscreenSize` would be
     * smaller than [minSize](#minsize), it is constrained to be at least `minSize`.
     *
     * @returns {{width: (number|null), height: (number|null)}} maxSize
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
     * Add a maximum fullscreen size constraint. Use `.maxFullscreenSize`` to get
     * the aggregate of all added constraints.
     *
     * @param {{width: (number|null), height: (number|null)}} sizeConstraint The width and height constraints to add. Both
     * `width` and `height` are optional - if either is set to null, that means
     * there is no max size in that dimension.
     * @returns {Function} A function that can be called to remove the fullscreen
     * size constraint that was added.
     */
    addMaxFullscreenSize(sizeConstraint: $Shape<ViewportSizeConstraint>): UnsetFn {
        const {width, height} = sizeConstraint;
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
     * The minimum dimensions of the block - if the viewport gets smaller than this
     * size, an overlay will be shown asking the user to resize the block to be bigger.
     *
     * @returns {{width: (number|null), height: (number|null)}} The largest set of dimensions
     * added with addMinSize. If `width` or `height` is null, it means there is no minSize
     * constraint on that dimension.
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
     * Add a minimum frame size constraint. Use `.minSize`` to get the aggregate
     * of all added constraints.
     *
     * Upon adding a constraint, if the block is focused and the frame is smaller than the
     * minimum size, the block will enter fullscreen mode.
     *
     * @param {{width: (number|null), height: (number|null)}} sizeConstraint The width and height constraints to add. Both `width`
     * and `height` are optional - if either is set to null, that means there is
     * no min size in that dimension.
     * @returns {Function} A function that can be called to remove the  size constraint
     * that was added.
     */
    addMinSize(sizeConstraint: $Shape<ViewportSizeConstraint>): UnsetFn {
        const {width, height} = sizeConstraint;
        const size = Object.freeze({
            width: typeof width === 'number' ? width : null,
            height: typeof height === 'number' ? height : null,
        });

        this._cachedMinSize = null;
        this._cachedMaxFullscreenSize = null;
        this._minSizes.add(size);
        this._onChange(WatchableViewportKeys.minSize);
        this._onChange(WatchableViewportKeys.maxFullscreenSize);

        if (this.isSmallerThanMinSize) {
            this.enterFullscreenIfPossible();
        }

        return () => {
            invariant(this._minSizes.has(size), 'UnsetFn can only be called once');
            this._cachedMinSize = null;
            this._cachedMaxFullscreenSize = null;
            this._minSizes.delete(size);
            this._onChange(WatchableViewportKeys.minSize);
            this._onChange(WatchableViewportKeys.maxFullscreenSize);
        };
    }

    /**
     * Boolean to denote whether the block frame is smaller than the `minSize`.
     *
     * @returns `true` if the block frame is smaller than `minSize`, `false` otherwise.
     */
    get isSmallerThanMinSize(): boolean {
        const {width, height} = this.size;
        const isWidthTooSmall = this.minSize.width !== null && this.minSize.width > width;
        const isHeightTooSmall = this.minSize.height !== null && this.minSize.height > height;
        return isWidthTooSmall || isHeightTooSmall;
    }
    /**
     * Boolean to denote whether the block is currently fullscreen.
     *
     * Can be watched.
     *
     * @returns `true` if the block is fullscreen, `false` otherwise.
     */
    get isFullscreen(): boolean {
        return this._isFullscreen;
    }
    /**
     * The current size of the block frame.
     *
     * Can be watched.
     *
     * @returns The current size of the block frame.
     */
    get size(): {width: number, height: number} {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }
    /**
     * Get notified of changes to the viewport.
     *
     * Watchable keys are:
     * - `'isFullscreen'`
     * - `'size'`
     * - `'minSize'`
     * - `'maxFullscreenSize'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @param keys the keys to watch
     * @param callback a function to call when those keys change
     * @param [context] an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */
    watch(
        keys: WatchableViewportKey | $ReadOnlyArray<WatchableViewportKey>,
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
    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @param keys the keys to unwatch
     * @param callback the function passed to `.watch` for these keys
     * @param [context] the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
     */
    unwatch(
        keys: WatchableViewportKey | $ReadOnlyArray<WatchableViewportKey>,
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
    /**
     * @private
     */
    __onEnterFullscreen() {
        this._isFullscreen = true;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @private
     */
    __onExitFullscreen() {
        this._isFullscreen = false;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @private
     */
    __focus() {
        const {body, activeElement} = document;
        if (activeElement && activeElement !== body) {
            activeElement.focus();
        } else if (body) {
            const input = document.createElement('input');
            body.appendChild(input);
            input.focus();
            input.remove();
        }
    }
    /**
     * @private
     */
    _onSizeChange() {
        this._onChange(WatchableViewportKeys.size);
    }
}

export default Viewport;
