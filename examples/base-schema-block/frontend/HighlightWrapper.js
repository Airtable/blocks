import React, {useState, createContext, useContext, useCallback, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Box, Text, colors} from '@airtable/blocks/ui';

import {SvgPanZoomContext} from './SvgPanZoomWrapper';
import {LINK_PROP_TYPE, NODE_PROP_TYPE} from './constants';

export const HighlightContext = createContext({
    onTableRowMouseOver() {},
    highlightedFields: [],
    highlightedLinks: [],
});

/**
 * Displays a small tooltip in the bottom-left corner that shows the type of the currently
 * hovered link or field.
 *
 * Uses `ReactDOM#createPortal` to lift the HTMLElements out of SVG world.
 *
 * @param {string} props.text
 */
function Tooltip({text}) {
    const tooltipRoot = document.getElementById('index');
    return ReactDOM.createPortal(
        <Box
            position="absolute"
            bottom={0}
            left={0}
            margin={2}
            backgroundColor={colors.GRAY_DARK_1}
            borderRadius="default"
        >
            <Text padding={2} textColor="white">
                {text}
            </Text>
        </Box>,
        tooltipRoot,
    );
}

Tooltip.propTypes = {
    text: PropTypes.string,
};

function toggleClassFromElements(classToToggle, elementsClassName) {
    const elementsToToggle = document.getElementsByClassName(elementsClassName);
    while (elementsToToggle[0]) {
        elementsToToggle[0].classList.toggle(classToToggle);
    }
}

/**
 * Wraps children in a context provider to handle the highlighting of dependent nodes when hovering
 * over links and fields.
 *
 * @param {Element} props.children
 * @param {Object} props.dependentLinksByNodeId list of links connected to each node, by node id
 * @param {Object} props.linksById all links (connection between two nodes), by link id
 * @param {Object} props.nodesById all nodes (field or table header), by node id
 */
export default function HighlightWrapper({children, dependentLinksByNodeId, linksById, nodesById}) {
    const svgPanZoom = useContext(SvgPanZoomContext);
    const [tooltip, setTooltip] = useState(false);
    const hoveredNodeOrLinkRef = useRef(null);
    const [highlightContext, setHighlightContext] = useState({
        onTableRowMouseOver: () => {},
        onTableRowMouseOut: () => {},
        onLinkMouseOver: () => {},
        highlightedFields: [],
        highlightedLinks: [],
    });

    /**
     * Sets tooltip visibility and text.
     *
     * Called when the active hover target is changed (or cleared). The tooltip shows the type of
     * field / link being actively hovered.
     */
    const configureTooltip = useCallback(
        (nodeOrLinkIdOrNull, isNode) => {
            if (!nodeOrLinkIdOrNull) {
                setTooltip({isVisible: false});
            } else {
                setTooltip({
                    isVisible: true,
                    text: isNode
                        ? nodesById[nodeOrLinkIdOrNull].tooltipLabel
                        : linksById[nodeOrLinkIdOrNull].tooltipLabel,
                });
            }
        },
        [nodesById, linksById],
    );

    /**
     * Mouseover handler to highlight relevant links & nodes.
     *
     * Updates the highlighted links & nodes in the visualization whenever the hover target changes.
     * This handler is set on the Table / Link containers (rather than the children themselves), and
     * uses event delegation to avoid adding potentially thousands event handlers.
     */
    const onNodeOrLinkMouseOver = useCallback(
        event => {
            const hoveredNode = event.currentTarget.querySelector('svg.TableRow:hover');
            const hoveredLink = event.currentTarget.querySelector('path.Link:hover');
            const hoveredNodeOrLink = hoveredNode || hoveredLink;
            // Ignore if hovered node/link cannot be found, or if both a link AND node were found,
            // or  the panning is disabled (which occurs when dragging a table)
            if (
                !hoveredNodeOrLink ||
                (hoveredNode && hoveredLink) ||
                (svgPanZoom && !svgPanZoom.isPanEnabled())
            ) {
                return;
            }

            // Return if the hover target hasn't changed
            const hoveredNodeOrLinkId = hoveredNodeOrLink.getAttribute('id');
            if (hoveredNodeOrLinkRef.current === hoveredNodeOrLinkId) {
                return;
            }

            // The hover target is valid. Update the ref and tooltip.
            hoveredNodeOrLinkRef.current = hoveredNodeOrLinkId;
            configureTooltip(hoveredNodeOrLinkId, Boolean(hoveredNode));

            // Remove highlighted from previously highlighted links & fields
            toggleClassFromElements('highlighted', 'TableRow highlighted');
            toggleClassFromElements('highlighted', 'Link highlighted');

            // If there is no hovered ID, then user moused-out. Nothing more to do.
            if (hoveredNodeOrLinkId === null) {
                return;
            }

            // Add highlighting to the appropriate nodes and links
            const idsToHighlight = [];
            if (hoveredNode) {
                // field/table is hovered
                const dependentLinks = dependentLinksByNodeId[hoveredNodeOrLinkId] || [];
                dependentLinks.forEach(link => {
                    idsToHighlight.push(link.id, link.targetId, link.sourceId);
                });
            } else {
                // link is hovered
                const link = linksById[hoveredNodeOrLinkId];
                idsToHighlight.push(link.id, link.sourceId, link.targetId);
            }
            for (const id of idsToHighlight) {
                const elementToHighlight = document.getElementById(id);
                if (elementToHighlight) {
                    elementToHighlight.classList.add('highlighted');
                }
            }
        },
        [svgPanZoom, dependentLinksByNodeId, linksById, configureTooltip],
    );

    /**
     * Mouseout handler to clear highlighted state.
     *
     * Clears the highlighted links & nodes when no longer hovering on anything.
     */
    const onNodeOrLinkMouseOut = useCallback(() => {
        if (svgPanZoom && !svgPanZoom.isPanEnabled()) {
            return;
        }
        const hoveredNode = event.currentTarget.querySelector('svg.TableRow:hover');
        const hoveredLink = event.currentTarget.querySelector('path.Link:hover');

        // Mouseout triggers when hovering over descendents within a node (ie, the text node).
        // In this case, we don't want to clear highlighting.
        if (hoveredNode || hoveredLink) {
            return;
        }

        hoveredNodeOrLinkRef.current = null;
        configureTooltip(null);

        // Remove highlighted from previously highlighted links & fields
        toggleClassFromElements('highlighted', 'TableRow highlighted');
        toggleClassFromElements('highlighted', 'Link highlighted');
    }, [svgPanZoom, configureTooltip]);

    useEffect(() => {
        setHighlightContext(currentHighlightContext => ({
            ...currentHighlightContext,
            onNodeOrLinkMouseOver,
            onNodeOrLinkMouseOut,
        }));
    }, [onNodeOrLinkMouseOver, onNodeOrLinkMouseOut]);

    return (
        <HighlightContext.Provider value={highlightContext}>
            {tooltip.isVisible && <Tooltip text={tooltip.text} />}
            {children}
        </HighlightContext.Provider>
    );
}

HighlightWrapper.propTypes = {
    children: PropTypes.node,
    dependentLinksByNodeId: PropTypes.objectOf(PropTypes.arrayOf(LINK_PROP_TYPE)).isRequired,
    linksById: PropTypes.objectOf(LINK_PROP_TYPE).isRequired,
    nodesById: PropTypes.objectOf(NODE_PROP_TYPE).isRequired,
};
