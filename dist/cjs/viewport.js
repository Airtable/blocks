"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.set");

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("./watchable"));

var _private_utils = require("./private_utils");

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

var WatchableViewportKeys = Object.freeze({
  isFullscreen: 'isFullscreen',
  size: 'size',
  minSize: 'minSize',
  maxFullscreenSize: 'maxFullscreenSize'
});

var compareWithNulls = (a, b, compare) => {
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


var Viewport =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(Viewport, _Watchable);
  (0, _createClass2.default)(Viewport, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableViewportKeys, key);
    }
  }]);

  /** @hideconstructor */
  function Viewport(isFullscreen, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, Viewport);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Viewport).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_minSizes", new Set());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_maxFullscreenSizes", new Set());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cachedMaxFullscreenSize", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cachedMinSize", null);
    _this._isFullscreen = isFullscreen;
    _this._airtableInterface = airtableInterface; // When size is watched, we'll increment this counter, and we'll decrement
    // it when it is unwatched and the counter is at 0. This way we can lazily
    // add an event listener for window resize and remove it when nobody is
    // listening anymore.

    _this._sizeWatchCount = 0;
    _this._onSizeChangeDebounced = u.debounce(_this._onSizeChange.bind((0, _assertThisInitialized2.default)(_this)), 200); // whenever maxFullscreenSize changes, we want to sync it back to the
    // containing frame

    _this.watch(WatchableViewportKeys.maxFullscreenSize, () => {
      _this._airtableInterface.setFullscreenMaxSize(_this.maxFullscreenSize);
    });

    return _this;
  }
  /**
   * Request to enter fullscreen mode.
   *
   * May fail if another block is fullscreen or this block doesn't have
   * permission to fullscreen itself. Watch `isFullscreen` to know if the
   * request succeeded.
   */


  (0, _createClass2.default)(Viewport, [{
    key: "enterFullscreenIfPossible",
    value: function enterFullscreenIfPossible() {
      this._airtableInterface.enterFullscreen();
    }
    /** Request to exit fullscreen mode */

  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      this._airtableInterface.exitFullscreen();
    }
    /**
     * The maximum dimensions of the block when it is in
     * fullscreen mode. Returns the smallest set of dimensions added with
     * {@link Viewport#addMaxFullscreenSize}.
     *
     * If `width` or `height` is null, it means there is
     * no max size constraint on that dimension. If `maxFullscreenSize` would be
     * smaller than {@link Viewport#minSize}, it is constrained to be at least `minSize`.
     *
     * @returns {{width: (number|null), height: (number|null)}} maxSize
     */

  }, {
    key: "addMaxFullscreenSize",

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
    value: function addMaxFullscreenSize(sizeConstraint) {
      var width = sizeConstraint.width,
          height = sizeConstraint.height;
      var size = Object.freeze({
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
     * The minimum dimensions of the block - if the viewport gets smaller than this
     * size, an overlay will be shown asking the user to resize the block to be bigger.
     *
     * @returns {{width: (number|null), height: (number|null)}} The largest set of dimensions
     * added with addMinSize. If `width` or `height` is null, it means there is no minSize
     * constraint on that dimension.
     */

  }, {
    key: "addMinSize",

    /**
     * Add a minimum frame size constraint. Use `.minSize`` to get the aggregate
     * of all added constraints.
     *
     * @param {{width: (number|null), height: (number|null)}} sizeConstraint The width and height constraints to add. Both `width`
     * and `height` are optional - if either is set to null, that means there is
     * no min size in that dimension.
     * @returns {Function} A function that can be called to remove the  size constraint
     * that was added.
     */
    value: function addMinSize(sizeConstraint) {
      var width = sizeConstraint.width,
          height = sizeConstraint.height;
      var size = Object.freeze({
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
    /**
     * Boolean to denote whether the block frame is smaller than the `minSize`.
     *
     * @returns `true` if the block frame is smaller than `minSize`, `false` otherwise.
     */

  }, {
    key: "watch",

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
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(Viewport.prototype), "watch", this).call(this, keys, callback, context);

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

  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(Viewport.prototype), "unwatch", this).call(this, keys, callback, context);

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

  }, {
    key: "__onEnterFullscreen",
    value: function __onEnterFullscreen() {
      this._isFullscreen = true;

      this._onChange(WatchableViewportKeys.isFullscreen);

      this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @private
     */

  }, {
    key: "__onExitFullscreen",
    value: function __onExitFullscreen() {
      this._isFullscreen = false;

      this._onChange(WatchableViewportKeys.isFullscreen);

      this._onChange(WatchableViewportKeys.size);
    }
    /**
     * @private
     */

  }, {
    key: "__focus",
    value: function __focus() {
      var _document = document,
          body = _document.body,
          activeElement = _document.activeElement; // See comment in BlockFrame.focusIframe for why we do this.

      if (activeElement && activeElement !== body) {
        // If there's already an activeElement, re-focus it.
        activeElement.focus();
      } else if (body) {
        // If there isn't an activeElement, create a dummy input
        // to capture focus.
        var input = document.createElement('input');
        body.appendChild(input);
        input.focus();
        input.remove();
      }
    }
    /**
     * @private
     */

  }, {
    key: "_onSizeChange",
    value: function _onSizeChange() {
      this._onChange(WatchableViewportKeys.size);
    }
  }, {
    key: "maxFullscreenSize",
    get: function get() {
      if (!this._cachedMaxFullscreenSize) {
        var maxFullscreenSize = Array.from(this._maxFullscreenSizes).reduce((memo, size) => ({
          width: compareWithNulls(memo.width, size.width, Math.min),
          height: compareWithNulls(memo.height, size.height, Math.min)
        }), {
          width: null,
          height: null
        });
        var minSize = this.minSize;
        this._cachedMaxFullscreenSize = {
          width: maxFullscreenSize.width !== null && minSize.width !== null ? Math.max(maxFullscreenSize.width, minSize.width) : maxFullscreenSize.width,
          height: maxFullscreenSize.height !== null && minSize.height !== null ? Math.max(maxFullscreenSize.height, minSize.height) : maxFullscreenSize.height
        };
      }

      return this._cachedMaxFullscreenSize;
    }
  }, {
    key: "minSize",
    get: function get() {
      if (!this._cachedMinSize) {
        this._cachedMinSize = Array.from(this._minSizes).reduce((memo, size) => ({
          width: compareWithNulls(memo.width, size.width, Math.max),
          height: compareWithNulls(memo.height, size.height, Math.max)
        }), {
          width: null,
          height: null
        });
      }

      return this._cachedMinSize;
    }
  }, {
    key: "isSmallerThanMinSize",
    get: function get() {
      var _this$size = this.size,
          width = _this$size.width,
          height = _this$size.height;
      var isWidthTooSmall = this.minSize.width !== null && this.minSize.width > width;
      var isHeightTooSmall = this.minSize.height !== null && this.minSize.height > height;
      return isWidthTooSmall || isHeightTooSmall;
    }
    /**
     * Boolean to denote whether the block is currently fullscreen.
     *
     * Can be watched.
     *
     * @returns `true` if the block is fullscreen, `false` otherwise.
     */

  }, {
    key: "isFullscreen",
    get: function get() {
      return this._isFullscreen;
    }
    /**
     * The current size of the block frame.
     *
     * Can be watched.
     *
     * @returns The current size of the block frame.
     */

  }, {
    key: "size",
    get: function get() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
  }]);
  return Viewport;
}(_watchable.default);

(0, _defineProperty2.default)(Viewport, "_className", 'Viewport');
var _default = Viewport;
exports.default = _default;