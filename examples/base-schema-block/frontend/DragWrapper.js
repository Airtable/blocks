import React, {createContext, useContext, useCallback} from 'react';
import {globalConfig} from '@airtable/blocks';
import PropTypes from 'prop-types';

import {SvgPanZoomContext} from './SvgPanZoomWrapper';
import {calculateLinkCoords, calculateLinkPath} from './coordinateHelpers';
import {COORDS_PROP_TYPE, LINK_PROP_TYPE, TABLE_CONFIG_PROP_TYPE} from './constants';
import {ConfigKeys} from './settings';

export const DragContext = createContext({handleTableDrag() {}});

/**
 * Wraps children in a context provider to handle the dragging of a table.
 *
 * This entails recalculating the paths for links attached to the table being dragged, and
 * setting the event handlers to update during and after drag.
 *
 * @param {Element} props.children
 * @param {Object} props.dependentLinksByNodeId list of links connected to each node, by node id
 * @param {Object} props.tableCoordsByTableId table x,y coordinates, by table id
 * @param {Object} props.tableConfigsByTableId table header & field nodes for each table, by table id
 */
export default function DragWrapper({
    children,
    dependentLinksByNodeId,
    tableCoordsByTableId,
    tableConfigsByTableId,
}) {
    const svgPanZoom = useContext(SvgPanZoomContext);

    // After table dragging finishes, persist the new coordinates in global config.
    const updateTableCoords = useCallback(
        (tableId, newCoords) => {
            const newTableCoordsByTableId = {...tableCoordsByTableId, [tableId]: newCoords};
            globalConfig.setAsync(ConfigKeys.TABLE_COORDS_BY_TABLE_ID, newTableCoordsByTableId);
        },
        [tableCoordsByTableId],
    );

    /**
     * Mousedown handler on the table header to enable dragging behavior.
     */
    const handleTableDrag = useCallback(
        (event, tableId) => {
            if (!globalConfig.hasPermissionToSet()) {
                // Disable dragging for comment/read-only users
                return;
            }

            svgPanZoom.disablePan();
            const tableElement = event.currentTarget.parentElement;
            const activeItemContainerElement = document.getElementById('active-container');

            // Move the table being dragged to the 'active container', which is painted after the
            // 'table container', guaranteeing that the table being dragged is always "on top" of
            // all other tables / links.
            tableElement.parentNode.removeChild(tableElement);
            activeItemContainerElement.appendChild(tableElement);

            const mouseMoveHandler = mouseMoveEvent => {
                const currentX = Number(tableElement.getAttribute('x'));
                const currentY = Number(tableElement.getAttribute('y'));

                // Scale the movement based on the current `svgPanZoom` zoom level.
                const {realZoom} = svgPanZoom.getSizes();
                const newX = currentX + mouseMoveEvent.movementX / realZoom;
                const newY = currentY + mouseMoveEvent.movementY / realZoom;
                tableElement.setAttribute('x', newX);
                tableElement.setAttribute('y', newY);

                // Update dependent link paths
                for (const link of dependentLinksByNodeId[tableId]) {
                    const linkElement = document.getElementById(link.id);
                    if (!linkElement) {
                        continue;
                    }
                    const linkCoords = calculateLinkCoords(
                        link,
                        {...tableCoordsByTableId, [tableId]: {x: newX, y: newY}},
                        tableConfigsByTableId,
                    );
                    const path = calculateLinkPath(linkCoords);
                    linkElement.setAttribute('d', path);
                }
            };

            const mouseUpHandler = () => {
                // Cleanup event handlers
                window.removeEventListener('mousemove', mouseMoveHandler);
                window.removeEventListener('mouseup', mouseUpHandler);

                // Update globalConfig with the table's new coordinates
                const x = Number(tableElement.getAttribute('x'));
                const y = Number(tableElement.getAttribute('y'));
                updateTableCoords(tableId, {x, y});

                // Re-enable panning
                svgPanZoom.enablePan();

                // Move the table being dragged back to the table container
                const tableContainer = document.getElementById('table-container');
                tableElement.parentNode.removeChild(tableElement);
                tableContainer.appendChild(tableElement);
            };

            window.addEventListener('mousemove', mouseMoveHandler);
            window.addEventListener('mouseup', mouseUpHandler);
        },
        [
            svgPanZoom,
            dependentLinksByNodeId,
            updateTableCoords,
            tableConfigsByTableId,
            tableCoordsByTableId,
        ],
    );

    return (
        <DragContext.Provider value={{handleTableDrag}}>
            {children}
            <g id="active-container" />
        </DragContext.Provider>
    );
}

DragWrapper.propTypes = {
    children: PropTypes.node,
    dependentLinksByNodeId: PropTypes.objectOf(PropTypes.arrayOf(LINK_PROP_TYPE)).isRequired,
    tableCoordsByTableId: PropTypes.objectOf(COORDS_PROP_TYPE).isRequired,
    tableConfigsByTableId: PropTypes.objectOf(TABLE_CONFIG_PROP_TYPE).isRequired,
};
