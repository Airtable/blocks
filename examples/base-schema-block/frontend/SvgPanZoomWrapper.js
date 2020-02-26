import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import svgPanZoom from 'svg-pan-zoom';
import {useViewport} from '@airtable/blocks/ui';

export const SvgPanZoomContext = React.createContext(null);

/**
 * Wraps children in a context provider for the `svgPanZoom` instance.
 *
 * The `svgPanZoom` instance can't be instantiated until after the first render, because it needs
 * the root SVG element to exist in the DOM.
 *
 * @param {Element} props.children
 */
export default function SvgPanZoomWrapper({children}) {
    const [svgPanZoomInstance, setSvgPanZoomInstance] = useState(null);
    const viewport = useViewport();
    useEffect(() => {
        if (svgPanZoomInstance) {
            svgPanZoomInstance.resize();
            svgPanZoomInstance.fit();
            svgPanZoomInstance.center();
        }
    }, [svgPanZoomInstance, viewport.isFullscreen]);

    useEffect(() => {
        const panZoom = svgPanZoom('#root', {
            zoomScaleSensitivity: 0.04,
            minZoom: 0.2,
            maxZoom: 40,
            center: true,
            fit: true,
            dblClickZoomEnabled: false,
        });
        setSvgPanZoomInstance(panZoom);

        return () => panZoom.destroy();
    }, []);

    return (
        <SvgPanZoomContext.Provider value={svgPanZoomInstance}>
            {children}
        </SvgPanZoomContext.Provider>
    );
}

SvgPanZoomContext.propTypes = {
    children: PropTypes.node,
};
