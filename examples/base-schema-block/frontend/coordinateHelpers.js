import _ from 'lodash';

import {
    ROW_HEIGHT,
    TABLE_GUTTER_SIZE,
    ROW_WIDTH,
    TABLE_BORDER_WIDTH,
    TABLE_BORDER_RADIUS,
} from './constants';

/**
 * Given a set of table configs, determine initial position coords for each table.
 *
 * Initial positions will be laid out in a columnar fashion, with each subsequent table being
 * placed in the current "shortest" column. The number of columns is determined roughly by
 * attempting to make the "grid" square (eg, 9 tables : 3 columns, 16 tables : 4 columns, etc).
 *
 * @param {Object} tableConfigsByTableId table header & field nodes for each table, by table id
 */
export function getInitialTableCoords(tableConfigsByTableId) {
    const numColumns = Math.ceil(Math.sqrt(Object.keys(tableConfigsByTableId).length));
    const columnHeights = Array(numColumns).fill(0);

    function getShortestColumn() {
        let currentLowest = null;
        let currentLowestIndex = 0;
        for (const [index, columnHeight] of columnHeights.entries()) {
            if (columnHeight === 0) {
                return index;
            }
            if (currentLowest === null || columnHeight < currentLowest) {
                currentLowest = columnHeight;
                currentLowestIndex = index;
            }
        }
        return currentLowestIndex;
    }

    const tableCoordsByTableId = {};

    for (const [tableId, tableConfig] of Object.entries(tableConfigsByTableId)) {
        const numRows = 1 + tableConfig.fieldNodes.length; // account for table header
        const columnIndex = getShortestColumn();

        // calculate coords for this table
        const y = columnHeights[columnIndex];
        const x = columnIndex * (ROW_WIDTH + TABLE_GUTTER_SIZE);
        tableCoordsByTableId[tableId] = {x, y};

        // increase the column height
        const dy = numRows * ROW_HEIGHT + TABLE_GUTTER_SIZE;
        columnHeights[columnIndex] += dy;
    }

    return tableCoordsByTableId;
}

/**
 *
 * Given a new set of table configs and an old set of table coords, return a comprehensive set of
 * table coordinates that includes new tables missing from the old set of coords.
 *
 * It's likely that a table will be created while this block is not running, in which case our
 * globalConfig-persisted table coordinates will become stale. The next time we run the block,
 * we want to assign coordinates to these new tables. This helper identifies which tables don't have
 * coordinates assigned, and then remedies that. Any missing tables are positioned in a new column
 * to the right of the current right-most table.
 *
 * @param {Object} newTableConfigs table configuration of fieldNodes & table header, by table id
 * @param {Object} oldTableCoords x,y coordinates for each table, by table id
 */
export function getUpdatedTableCoords(newTableConfigs, oldTableCoords) {
    const newTableIds = _.difference(Object.keys(newTableConfigs), Object.keys(oldTableCoords));
    if (newTableIds.length === 0) {
        return oldTableCoords;
    }
    let rightMostTablePosition, topMostTablePosition;
    Object.values(oldTableCoords).forEach(currentCoords => {
        if (rightMostTablePosition === undefined || currentCoords.x > rightMostTablePosition) {
            rightMostTablePosition = currentCoords.x;
        }
        if (topMostTablePosition === undefined || currentCoords.y < topMostTablePosition) {
            topMostTablePosition = currentCoords.y;
        }
    });
    let verticalOffset = topMostTablePosition;
    const newTableCoords = newTableIds.reduce((accumulatedTableCoords, currentTableId) => {
        const x = rightMostTablePosition + ROW_WIDTH + TABLE_GUTTER_SIZE;
        const y = verticalOffset;
        verticalOffset +=
            (newTableConfigs[currentTableId].fieldNodes.length + 1) * ROW_HEIGHT +
            TABLE_GUTTER_SIZE;
        return {...accumulatedTableCoords, [currentTableId]: {x, y}};
    }, {});
    return {...oldTableCoords, ...newTableCoords};
}

/**
 * Given all link and table information, calculate the path `d` attribute values for each link.
 *
 * @param {Object} linksById link objects, by link id
 * @param {Object} tableConfigsByTableId table configuration of fieldNodes & table header, by table id
 * @param {Object} tableCoordsByTableId x,y coordinates for each table, by table id
 * @returns {Object.<string, string>} link paths (`d` attribute values) by link id
 */
export function calculateLinkPaths(linksById, tableConfigsByTableId, tableCoordsByTableId) {
    const linkPathsByLinkId = {};
    for (const [linkId, link] of Object.entries(linksById)) {
        const linkCoords = calculateLinkCoords(link, tableCoordsByTableId, tableConfigsByTableId);
        const linkPath = calculateLinkPath(linkCoords);
        linkPathsByLinkId[linkId] = linkPath;
    }
    return linkPathsByLinkId;
}

/**
 * Given a link and table information, determine the x,y coordinates for the source and target
 * of that link, and whether the link should be drawn using a direct path.
 *
 * The `useDirectPath` return value indicates whether the path is "S-shaped" (connecting from the
 * right edge of one row to the left edge of another row), or "C-shaped" (connecting from the
 * right edge of one row to the right edge of another row). The former is considered the "direct"
 * path.
 *
 * @param {Object} link link object
 * @param {Object} tableConfigsByTableId table configuration of fieldNodes & table header, by table id
 * @param {Object} tableCoordsByTableId x,y coordinates for each table, by table id
 * @returns {{
 *     sourceCoords: {x: number, y: number},
 *     targetCoords: {x: number, y: number},
 *     useDirectPath: boolean
 * }}
 */
export function calculateLinkCoords(link, tableCoordsByTableId, tableConfigsByTableId) {
    // Source is always a field row (never will be a table header)
    const sourceTableCoords = tableCoordsByTableId[link.sourceTableId];
    const sourceTableConfig = tableConfigsByTableId[link.sourceTableId];
    const sourceFieldIndex = sourceTableConfig.fieldNodes.findIndex(n => n.id === link.sourceId);
    if (sourceFieldIndex === -1) {
        throw new Error(`Could not find field ${link.sourceId} in table ${link.sourceTableId}`);
    }
    const sourceYOffset = ROW_HEIGHT + sourceFieldIndex * ROW_HEIGHT;
    const sourceNodeCoords = {
        x: sourceTableCoords.x + TABLE_BORDER_WIDTH,
        y: sourceTableCoords.y + sourceYOffset + TABLE_BORDER_WIDTH + ROW_HEIGHT / 2,
    };

    // Target can be a table header if the link is a self-linking linked record
    const targetTableCoords = tableCoordsByTableId[link.targetTableId];
    const targetTableConfig = tableConfigsByTableId[link.targetTableId];
    let targetYOffset;
    if (link.targetId === link.targetTableId) {
        // self-linking linked record; link target is the table header
        targetYOffset = 0;
    } else {
        const targetFieldIndex = targetTableConfig.fieldNodes.findIndex(
            n => n.id === link.targetId,
        );
        if (targetFieldIndex === -1) {
            throw new Error(`Could not find field ${link.targetId} in table ${link.targetTableId}`);
        }
        targetYOffset = ROW_HEIGHT + targetFieldIndex * ROW_HEIGHT;
    }
    const targetNodeCoords = {
        x: targetTableCoords.x + TABLE_BORDER_WIDTH,
        y: targetTableCoords.y + targetYOffset + TABLE_BORDER_WIDTH + ROW_HEIGHT / 2,
    };

    if (sourceNodeCoords.x - targetNodeCoords.x > ROW_WIDTH) {
        // source row completely to the right of target row, with no overlap:
        //      ---[S]
        //      |
        // [T]---
        // use left edge of source, right edge of target
        return {
            sourceCoords: {
                x: sourceNodeCoords.x,
                y: sourceNodeCoords.y,
            },
            targetCoords: {
                x: targetNodeCoords.x + ROW_WIDTH,
                y: targetNodeCoords.y,
            },
            useDirectPath: true,
        };
    }

    if (targetNodeCoords.x - sourceNodeCoords.x > ROW_WIDTH) {
        // source row is completely to the left of target row, with no overlap:
        // [S]---
        //      |
        //      ---[T]
        // use right edge of source, left edge of target
        return {
            sourceCoords: {
                x: sourceNodeCoords.x + ROW_WIDTH,
                y: sourceNodeCoords.y,
            },
            targetCoords: {
                x: targetNodeCoords.x,
                y: targetNodeCoords.y,
            },
            useDirectPath: true,
        };
    }

    return {
        // source row and target row are overlapping horizontally:
        // [S]---
        //      |
        //  [T]--
        // use the right edge for both (not direct path)
        sourceCoords: {
            x: sourceNodeCoords.x + ROW_WIDTH,
            y: sourceNodeCoords.y,
        },
        targetCoords: {
            x: targetNodeCoords.x + ROW_WIDTH,
            y: targetNodeCoords.y,
        },
        useDirectPath: false,
    };
}

/**
 * Given source and target coordinates, and whether to use direct path (S-shaped), construct the
 * `d` value attribute for the link connecting these two points.
 *
 * NOTE: This implementation uses simple bezier curves with some assumptions regarding the control
 * points. This could be refactored to build "taxi-cab" paths, straight-edge paths, direct lines,
 * etc.
 *
 * @param {Object} sourceCoords x,y coordinates for the source
 * @param {Object} targetCoords x,y coordinates for the target
 * @param {boolean} useDirectPath whether to use the direct S-shaped path to connect the points
 * @returns {string} `d` value attribute
 */
export function calculateLinkPath({sourceCoords, targetCoords, useDirectPath}) {
    // initialize with the starting point
    let result = `M ${sourceCoords.x} ${sourceCoords.y}`;

    if (useDirectPath) {
        // For direct paths, we want to scale the X value of the control points with how close
        // the Y values are. This results in a less distorted-looking curve than using a non-scaling
        // technique. The scaling is defined as: yDelta [0, 300+] : xScale [0.5, 1.0]
        const xScaleFactor = 0.5 + Math.min(Math.abs(sourceCoords.y - targetCoords.y), 300) / 600;
        const leftMostX = sourceCoords.x < targetCoords.x ? sourceCoords.x : targetCoords.x;
        const offsetFromOpposite = Math.abs(sourceCoords.x - targetCoords.x) * (1 - xScaleFactor);
        result += 'C'; // cubic bezier curve
        result += ` ${
            targetCoords.x === leftMostX
                ? targetCoords.x + offsetFromOpposite
                : targetCoords.x - offsetFromOpposite
        } ${sourceCoords.y}`; // control point 1
        result += ` ${
            sourceCoords.x === leftMostX
                ? sourceCoords.x + offsetFromOpposite
                : sourceCoords.x - offsetFromOpposite
        } ${targetCoords.y}`; // control point 2
        result += ` ${targetCoords.x} ${targetCoords.y}`; // target
    } else {
        // for indirect paths, set the control points 40px to the right of whichever point is
        // further right, so it creates a "C" shape
        const rightMostX = sourceCoords.x > targetCoords.x ? sourceCoords.x : targetCoords.x;
        result += 'C'; // cubic bezier curve
        result += ` ${rightMostX + 40} ${sourceCoords.y}`; // control point 1
        result += ` ${rightMostX + 40} ${targetCoords.y}`; // control point 2
        result += ` ${targetCoords.x} ${targetCoords.y}`; // target
    }

    return result;
}

/**
 * Given a table height, calculates a path element to place behind the SvgTable element. It is
 * larger than the SvgTable, creating a border of width TABLE_BORDER_WIDTH around the table.
 *
 * @param {number} tableHeight
 */
export function calculateTableBackgroundPath(tableHeight) {
    const outerBorderRadius = TABLE_BORDER_RADIUS + TABLE_BORDER_WIDTH;
    const totalHeight = tableHeight + 2 * TABLE_BORDER_WIDTH;
    const totalWidth = ROW_WIDTH + 2 * TABLE_BORDER_WIDTH;
    return `
        M 0 ${totalHeight}
        L 0 ${outerBorderRadius} 
        A ${outerBorderRadius} ${outerBorderRadius} 0 0 1 ${outerBorderRadius} 0 
        L ${totalWidth - outerBorderRadius} 0 
        A ${outerBorderRadius} ${outerBorderRadius} 0 0 1 ${totalWidth} ${outerBorderRadius} 
        L ${totalWidth} ${totalHeight} 
        Z
    `;
}
