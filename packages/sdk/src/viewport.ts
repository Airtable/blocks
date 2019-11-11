/** @module @airtable/blocks: viewport */ /** */
import {ViewportSizeConstraint} from './types/viewport';
import Watchable from './watchable';
import {isEnumValue, debounce, ObjectValues, FlowAnyFunction, FlowAnyObject} from './private_utils';
import {spawnInvariantViolationError} from './error_utils';
import {AirtableInterface} from './injected/airtable_interface';

const WatchableViewportKeys = Object.freeze({
    isFullscreen: 'isFullscreen' as const,
    size: 'size' as const,
    minSize: 'minSize' as const,
    maxFullscreenSize: 'maxFullscreenSize' as const,
});

/**
 * Watchable keys in {@link Viewport}.
 * - `isFullscreen`
 * - `size`
 * - `minSize`
 * - `maxFullscreenSize`
 */
type WatchableViewportKey = ObjectValues<typeof WatchableViewportKeys>;
/** */
type UnsetFn = () => void;

const compareWithNulls = (
    a: number | null,
    b: number | null,
    compare: (arg1: number, arg2: number) => number,
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
 * ```js
 * import {viewport} from '@airtable/blocks';
 * ```
 */
class Viewport extends Watchable<WatchableViewportKey> {
    /** @internal */
    static _className = 'Viewport';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableViewportKeys, key);
    }

    /** @internal */
    _isFullscreen: boolean;
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _sizeWatchCount: number;
    /** @internal */
    _onSizeChangeDebounced: FlowAnyFunction;
    /** @internal */
    _minSizes: Set<ViewportSizeConstraint> = new Set();
    /** @internal */
    _maxFullscreenSizes: Set<ViewportSizeConstraint> = new Set();
    /** @internal */
    _cachedMaxFullscreenSize: ViewportSizeConstraint | null = null;
    /** @internal */
    _cachedMinSize: ViewportSizeConstraint | null = null;

    /** @internal */
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
     * {@link addMaxFullscreenSize}.
     *
     * If `width` or `height` is null, it means there is
     * no max size constraint on that dimension. If `maxFullscreenSize` would be
     * smaller than {@link minSize}, it is constrained to be at least `minSize`.
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
     * @param sizeConstraint The width and height constraints to add. Both
     * `width` and `height` are optional - if either is set to null, that means
     * there is no max size in that dimension.
     * @returns A function that can be called to remove the fullscreen
     * size constraint that was added.
     */
    addMaxFullscreenSize(sizeConstraint: Partial<ViewportSizeConstraint>): UnsetFn {
        const {width, height} = sizeConstraint;
        const size = Object.freeze({
            width: typeof width === 'number' ? width : null,
            height: typeof height === 'number' ? height : null,
        });

        this._cachedMaxFullscreenSize = null;
        this._maxFullscreenSizes.add(size);
        this._onChange(WatchableViewportKeys.maxFullscreenSize);

        return () => {
            if (!this._maxFullscreenSizes.has(size)) {
                throw spawnInvariantViolationError('UnsetFn can only be called once');
            }
            this._cachedMaxFullscreenSize = null;
            this._maxFullscreenSizes.delete(size);
            this._onChange(WatchableViewportKeys.maxFullscreenSize);
        };
    }

    /**
     * The minimum dimensions of the block - if the viewport gets smaller than this
     * size, an overlay will be shown asking the user to resize the block to be bigger.
     *
     * The largest set of dimensions added with addMinSize. If `width` or `height` is null, it means
     * there is no minSize constraint on that dimension.
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
     * @param sizeConstraint The width and height constraints to add. Both `width`
     * and `height` are optional - if either is set to null, that means there is
     * no min size in that dimension.
     * @returns A function that can be called to remove the  size constraint
     * that was added.
     */
    addMinSize(sizeConstraint: Partial<ViewportSizeConstraint>): UnsetFn {
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
            if (!this._minSizes.has(size)) {
                throw spawnInvariantViolationError('UnsetFn can only be called once');
            }
            this._cachedMinSize = null;
            this._cachedMaxFullscreenSize = null;
            this._minSizes.delete(size);
            this._onChange(WatchableViewportKeys.minSize);
            this._onChange(WatchableViewportKeys.maxFullscreenSize);
        };
    }

    /**
     * `true` if the block frame is smaller than `minSize`, `false` otherwise.
     */
    get isSmallerThanMinSize(): boolean {
        const {width, height} = this.size;
        const isWidthTooSmall = this.minSize.width !== null && this.minSize.width > width;
        const isHeightTooSmall = this.minSize.height !== null && this.minSize.height > height;
        return isWidthTooSmall || isHeightTooSmall;
    }
    /**
     * `true` if the block is fullscreen, `false` otherwise.
     */
    get isFullscreen(): boolean {
        return this._isFullscreen;
    }
    /**
     * The current size of the block frame.
     *
     * Can be watched.
     */
    get size(): {width: number; height: number} {
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
     * @param context an optional context for `this` in `callback`.
     * @returns the array of keys that were watched
     */
    watch(
        keys: WatchableViewportKey | ReadonlyArray<WatchableViewportKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
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
     * @param context the context that was passed to `.watch` for this `callback`
     * @returns the array of keys that were unwatched
     */
    unwatch(
        keys: WatchableViewportKey | ReadonlyArray<WatchableViewportKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
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
     * @internal
     */
    __onEnterFullscreen() {
        this._isFullscreen = true;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @internal
     */
    __onExitFullscreen() {
        this._isFullscreen = false;

        this._onChange(WatchableViewportKeys.isFullscreen);
        this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @internal
     */
    __focus() {
        const {body, activeElement} = document;
        if (activeElement && activeElement !== body) {
            (activeElement as HTMLElement).focus();
        } else if (body) {
            const input = document.createElement('input');
            body.appendChild(input);
            input.focus();
            input.remove();
        }
    }
    /**
     * @internal
     */
    _onSizeChange() {
        this._onChange(WatchableViewportKeys.size);
    }
}

export default Viewport;
