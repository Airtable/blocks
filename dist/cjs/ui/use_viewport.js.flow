// @flow
import getSdk from '../get_sdk';
import Viewport from '../viewport';
import useWatchable from './use_watchable';

export default function useViewport(): Viewport {
    const viewport = getSdk().viewport;
    useWatchable(viewport, ['isFullscreen', 'size', 'minSize', 'maxFullscreenSize']);
    return viewport;
}
