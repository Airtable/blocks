"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("./watchable"));

var _private_utils = _interopRequireDefault(require("./private_utils"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

var WatchableViewportKeys = {
  isFullscreen: 'isFullscreen',
  size: 'size',
  minSize: 'minSize',
  maxFullscreenSize: 'maxFullscreenSize'
};

var compareWithNulls = function compareWithNulls(a, b, compare) {
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


var Viewport =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(Viewport, _Watchable);
  (0, _createClass2.default)(Viewport, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return _private_utils.default.isEnumValue(WatchableViewportKeys, key);
    }
  }]);

  function Viewport(isFullscreen, airtableInterface) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, Viewport);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Viewport).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_minSizes", new _set.default());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_maxFullscreenSizes", new _set.default());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cachedMaxFullscreenSize", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cachedMinSize", null);
    _this._isFullscreen = isFullscreen;
    _this._airtableInterface = airtableInterface; // When size is watched, we'll increment this counter, and we'll decrement
    // it when it is unwatched and the counter is at 0. This way we can lazily
    // add an event listener for window resize and remove it when nobody is
    // listening anymore.

    _this._sizeWatchCount = 0;
    _this._onSizeChangeDebounced = u.debounce((0, _bind.default)(_context = _this._onSizeChange).call(_context, (0, _assertThisInitialized2.default)(_this)), 200); // whenever maxFullscreenSize changes, we want to sync it back to the
    // containing frame

    _this.watch(WatchableViewportKeys.maxFullscreenSize, function () {
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
    key: "enterFullscreen",
    value: function enterFullscreen() {
      this._airtableInterface.enterFullscreen();
    }
    /** Request to exit fullscreen mode */

  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      this._airtableInterface.exitFullscreen();
    }
    /**
     * Can be watched. The maximum dimensions of the block when it is in
     * fullscreen mode. Returns the smallest set of dimensions added with
     * addMaxFullscreenSize. If `width` or `height` is null, it means there is
     * no maxSize constraint on that dimension. If maxFullscreenSize would be
     * smaller than minSize, it is constrained to be at least that.
     */

  }, {
    key: "addMaxFullscreenSize",

    /**
     * Add a maximum fullscreen size constraint. Returns a function that can be
     * called to remove the fullscreen size that was added. Use
     * .maxFullscreenSize to get the aggregate of all added constraints. Both
     * `width` and `height` are optional - if either is set to null, that means
     * there is no max size in that dimension.
     */
    value: function addMaxFullscreenSize(_ref) {
      var _this2 = this;

      var width = _ref.width,
          height = _ref.height;
      var size = (0, _freeze.default)({
        width: typeof width === 'number' ? width : null,
        height: typeof height === 'number' ? height : null
      });
      this._cachedMaxFullscreenSize = null;

      this._maxFullscreenSizes.add(size);

      this._onChange(WatchableViewportKeys.maxFullscreenSize);

      return function () {
        (0, _invariant.default)(_this2._maxFullscreenSizes.has(size), 'UnsetFn can only be called once');
        _this2._cachedMaxFullscreenSize = null;

        _this2._maxFullscreenSizes.delete(size);

        _this2._onChange(WatchableViewportKeys.maxFullscreenSize);
      };
    }
    /**
     * Can be watched. The minimum dimensions of the block - if the viewport
     * gets smaller than this size, an overlay will be shown asking the user to
     * resize the block to be bigger. Returns the largest set of dimensions
     * added with addMinSize. If `width` or `height` is null, it means there is
     * no minSize constraint on that dimension.
     */

  }, {
    key: "addMinSize",

    /**
     * Add a minimum frame size constraint. Returns a function that can be
     * called to remove the added constraint. Use .minSize to get the aggregate
     * of all added constraints. Both `width` and `height` are optional - if
     * either is null, there is no minimum size in that dimension.
     */
    value: function addMinSize(_ref2) {
      var _this3 = this;

      var width = _ref2.width,
          height = _ref2.height;
      var size = (0, _freeze.default)({
        width: typeof width === 'number' ? width : null,
        height: typeof height === 'number' ? height : null
      });
      this._cachedMinSize = null; // min size is also a constraint on maxFullscreenSize:

      this._cachedMaxFullscreenSize = null;

      this._minSizes.add(size);

      this._onChange(WatchableViewportKeys.minSize);

      this._onChange(WatchableViewportKeys.maxFullscreenSize);

      return function () {
        (0, _invariant.default)(_this3._minSizes.has(size), 'UnsetFn can only be called once');
        _this3._cachedMinSize = null;
        _this3._cachedMaxFullscreenSize = null;

        _this3._minSizes.delete(size);

        _this3._onChange(WatchableViewportKeys.minSize); // min size is also a constraint on maxFullscreenSize:


        _this3._onChange(WatchableViewportKeys.maxFullscreenSize);
      };
    }
    /** */

  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(Viewport.prototype), "watch", this).call(this, keys, callback, context);

      if ((0, _includes.default)(u).call(u, validKeys, WatchableViewportKeys.size)) {
        if (this._sizeWatchCount === 0) {
          window.addEventListener('resize', this._onSizeChangeDebounced, false);
        }

        this._sizeWatchCount++;
      }

      return validKeys;
    }
  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(Viewport.prototype), "unwatch", this).call(this, keys, callback, context);

      if ((0, _includes.default)(u).call(u, validKeys, WatchableViewportKeys.size)) {
        this._sizeWatchCount--;

        if (this._sizeWatchCount === 0) {
          window.removeEventListener('resize', this._onSizeChangeDebounced, false);
        }
      }

      return validKeys;
    }
  }, {
    key: "__onEnterFullscreen",
    value: function __onEnterFullscreen() {
      this._isFullscreen = true;

      this._onChange(WatchableViewportKeys.isFullscreen);

      this._onChange(WatchableViewportKeys.size);
    }
  }, {
    key: "__onExitFullscreen",
    value: function __onExitFullscreen() {
      this._isFullscreen = false;

      this._onChange(WatchableViewportKeys.isFullscreen);

      this._onChange(WatchableViewportKeys.size);
    }
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
  }, {
    key: "_onSizeChange",
    value: function _onSizeChange() {
      this._onChange(WatchableViewportKeys.size);
    }
  }, {
    key: "maxFullscreenSize",
    get: function get() {
      if (!this._cachedMaxFullscreenSize) {
        var _context2;

        var maxFullscreenSize = (0, _reduce.default)(_context2 = (0, _from.default)(this._maxFullscreenSizes)).call(_context2, function (memo, size) {
          return {
            width: compareWithNulls(memo.width, size.width, Math.min),
            height: compareWithNulls(memo.height, size.height, Math.min)
          };
        }, {
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
        var _context3;

        this._cachedMinSize = (0, _reduce.default)(_context3 = (0, _from.default)(this._minSizes)).call(_context3, function (memo, size) {
          return {
            width: compareWithNulls(memo.width, size.width, Math.max),
            height: compareWithNulls(memo.height, size.height, Math.max)
          };
        }, {
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
    /** Can be watched. */

  }, {
    key: "isFullscreen",
    get: function get() {
      return this._isFullscreen;
    }
    /** Can be watched. */

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