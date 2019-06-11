"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useViewport;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _viewport = _interopRequireDefault(require("../viewport"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * Returns the current {@link Viewport} object and updates whenever the viewport size, constraints,
 * or fullscreen status changes.
 *
 * @returns the current {@link Viewport}
 *
 * @example
 * import {useViewport} from '@airtable/blocks/ui';
 *
 * function ViewportSize() {
 *      const viewport = useViewport();
 *
 *      const toggleFullscreen = () => {
 *          if (viewport.isFullscreen) {
 *              viewport.exitFullscreen();
 *          } else {
 *              viewport.enterFullscreenIfPossible();
 *          }
 *      };
 *
 *      return (
 *          <Fragment>
 *              <button onClick={toggleFullscreen}>Toggle fullscreen</button>
 *
 *              viewport size: {viewport.size.width}x{viewport.size.height}
 *          </Fragment>
 *      );
 * }
 */
function useViewport() {
  var viewport = (0, _get_sdk.default)().viewport;
  (0, _use_watchable.default)(viewport, ['isFullscreen', 'size', 'minSize', 'maxFullscreenSize']);
  return viewport;
}