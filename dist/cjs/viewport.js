"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("./watchable"));

var _private_utils = _interopRequireDefault(require("./private_utils"));

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

const WatchableViewportKeys = {
  isFullscreen: 'isFullscreen',
  size: 'size',
  minSize: 'minSize',
  maxFullscreenSize: 'maxFullscreenSize'
};

const compareWithNulls = (a, b, compare) => {
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


class Viewport extends _watchable.default {
  static _isWatchableKey(key) {
    return _private_utils.default.isEnumValue(WatchableViewportKeys, key);
  }

  constructor(isFullscreen, airtableInterface) {
    var _context;

    super();
    (0, _defineProperty2.default)(this, "_minSizes", new _set.default());
    (0, _defineProperty2.default)(this, "_maxFullscreenSizes", new _set.default());
    (0, _defineProperty2.default)(this, "_cachedMaxFullscreenSize", null);
    (0, _defineProperty2.default)(this, "_cachedMinSize", null);
    this._isFullscreen = isFullscreen;
    this._airtableInterface = airtableInterface; // When size is watched, we'll increment this counter, and we'll decrement
    // it when it is unwatched and the counter is at 0. This way we can lazily
    // add an event listener for window resize and remove it when nobody is
    // listening anymore.

    this._sizeWatchCount = 0;
    this._onSizeChangeDebounced = u.debounce((0, _bind.default)(_context = this._onSizeChange).call(_context, this), 200); // whenever maxFullscreenSize changes, we want to sync it back to the
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


  enterFullscreen() {
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


  get maxFullscreenSize() {
    if (!this._cachedMaxFullscreenSize) {
      var _context2;

      const maxFullscreenSize = (0, _reduce.default)(_context2 = (0, _from.default)(this._maxFullscreenSizes)).call(_context2, (memo, size) => ({
        width: compareWithNulls(memo.width, size.width, Math.min),
        height: compareWithNulls(memo.height, size.height, Math.min)
      }), {
        width: null,
        height: null
      });
      const minSize = this.minSize;
      this._cachedMaxFullscreenSize = {
        width: maxFullscreenSize.width !== null && minSize.width !== null ? Math.max(maxFullscreenSize.width, minSize.width) : maxFullscreenSize.width,
        height: maxFullscreenSize.height !== null && minSize.height !== null ? Math.max(maxFullscreenSize.height, minSize.height) : maxFullscreenSize.height
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


  addMaxFullscreenSize({
    width,
    height
  }) {
    const size = (0, _freeze.default)({
      width: typeof width === 'number' ? width : null,
      height: typeof height === 'number' ? height : null
    });
    this._cachedMaxFullscreenSize = null;

    this._maxFullscreenSizes.add(size);

    this._onChange(WatchableViewportKeys.maxFullscreenSize);

    return () => {
      (0, _invariant.default)(this._maxFullscreenSizes.has(size), 'UnsetFn can only be called once');
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


  get minSize() {
    if (!this._cachedMinSize) {
      var _context3;

      this._cachedMinSize = (0, _reduce.default)(_context3 = (0, _from.default)(this._minSizes)).call(_context3, (memo, size) => ({
        width: compareWithNulls(memo.width, size.width, Math.max),
        height: compareWithNulls(memo.height, size.height, Math.max)
      }), {
        width: null,
        height: null
      });
    }

    return this._cachedMinSize;
  }
  /**
   * Add a minimum frame size constraint. Returns a function that can be
   * called to remove the added constraint. Use .minSize to get the aggregate
   * of all added constraints. Both `width` and `height` are optional - if
   * either is null, there is no minimum size in that dimension.
   */


  addMinSize({
    width,
    height
  }) {
    const size = (0, _freeze.default)({
      width: typeof width === 'number' ? width : null,
      height: typeof height === 'number' ? height : null
    });
    this._cachedMinSize = null; // min size is also a constraint on maxFullscreenSize:

    this._cachedMaxFullscreenSize = null;

    this._minSizes.add(size);

    this._onChange(WatchableViewportKeys.minSize);

    this._onChange(WatchableViewportKeys.maxFullscreenSize);

    return () => {
      (0, _invariant.default)(this._minSizes.has(size), 'UnsetFn can only be called once');
      this._cachedMinSize = null;
      this._cachedMaxFullscreenSize = null;

      this._minSizes.delete(size);

      this._onChange(WatchableViewportKeys.minSize); // min size is also a constraint on maxFullscreenSize:


      this._onChange(WatchableViewportKeys.maxFullscreenSize);
    };
  }
  /** */


  get isSmallerThanMinSize() {
    const {
      width,
      height
    } = this.size;
    const isWidthTooSmall = this.minSize.width !== null && this.minSize.width > width;
    const isHeightTooSmall = this.minSize.height !== null && this.minSize.height > height;
    return isWidthTooSmall || isHeightTooSmall;
  }
  /** Can be watched. */


  get isFullscreen() {
    return this._isFullscreen;
  }
  /** Can be watched. */


  get size() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  watch(keys, callback, context) {
    const validKeys = super.watch(keys, callback, context);

    if ((0, _includes.default)(u).call(u, validKeys, WatchableViewportKeys.size)) {
      if (this._sizeWatchCount === 0) {
        window.addEventListener('resize', this._onSizeChangeDebounced, false);
      }

      this._sizeWatchCount++;
    }

    return validKeys;
  }

  unwatch(keys, callback, context) {
    const validKeys = super.unwatch(keys, callback, context);

    if ((0, _includes.default)(u).call(u, validKeys, WatchableViewportKeys.size)) {
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
    const {
      body,
      activeElement
    } = document; // See comment in BlockFrame.focusIframe for why we do this.

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

(0, _defineProperty2.default)(Viewport, "_className", 'Viewport');
var _default = Viewport;
exports.default = _default;