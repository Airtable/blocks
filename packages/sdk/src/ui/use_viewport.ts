/** @module @airtable/blocks/ui: useViewport */ /** */
import getSdk from '../get_sdk';
import Viewport from '../viewport';
import useWatchable from './use_watchable';

/**
 * Returns the current {@link Viewport} object and updates whenever the viewport size, constraints,
 * or fullscreen status changes.
 *
 * @returns The current viewport.
 *
 * @example
 * ```js
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
 * ```
 */
export default function useViewport(): Viewport {
    const viewport = getSdk().viewport;
    useWatchable(viewport, ['isFullscreen', 'size', 'minSize', 'maxFullscreenSize']);
    return viewport;
}
