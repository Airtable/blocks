/** @module @airtable/blocks/ui: useViewport */ /** */
import Viewport from '../viewport';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {BaseSdkMode} from '../../sdk_mode';

/**
 * Returns the current {@link Viewport} object and updates whenever the viewport size, constraints,
 * or fullscreen status changes.
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
 * @docsPath UI/hooks/useViewport
 * @hook
 */
export default function useViewport(): Viewport {
    const viewport = useSdk<BaseSdkMode>().viewport;
    useWatchable(viewport, ['isFullscreen', 'size', 'minSize', 'maxFullscreenSize']);
    return viewport;
}
