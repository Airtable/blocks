import React, {useContext} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {colors, colorUtils} from '@airtable/blocks/ui';

import {DragContext} from './DragWrapper';
import {
    ROW_HEIGHT,
    TEXT_PADDING_X,
    ROW_WIDTH,
    TABLE_HEADER_PATH,
    NODE_PROP_TYPE,
    COORDS_PROP_TYPE,
    TABLE_CONFIG_PROP_TYPE,
    TABLE_BORDER_WIDTH,
} from './constants';
import {calculateTableBackgroundPath} from './coordinateHelpers';

const ALLOWED_COLORS = [
    colors.BLUE_BRIGHT,
    colors.CYAN_BRIGHT,
    colors.GREEN_BRIGHT,
    colors.YELLOW_BRIGHT,
    colors.ORANGE_BRIGHT,
    colors.RED_BRIGHT,
    colors.PINK_BRIGHT,
    colors.PURPLE_BRIGHT,
    colors.GRAY_BRIGHT,
    colors.GRAY_DARK_1,
];

/**
 * Table SVG component.
 *
 * Contains a table header row (with name of table), and a field row for each field in the table.
 * Positions are calculated using offsets and ROW_WIDTH / ROW_HEIGHT constants.
 *
 * @param {Object} coords x,y coordinates for this table
 * @param {Object} tableConfig table configuration, containing table header and field nodes
 */
export default function SvgTable({coords, tableConfig}) {
    const {tableId} = tableConfig.tableNode;
    const {x, y} = coords;
    const {handleTableDrag} = useContext(DragContext);

    const tableHeight = ROW_HEIGHT * (tableConfig.fieldNodes.length + 1) + 2 * TABLE_BORDER_WIDTH;
    return (
        <svg
            stroke="black"
            x={x}
            y={y}
            width={ROW_WIDTH + 2 * TABLE_BORDER_WIDTH}
            height={ROW_HEIGHT * (tableConfig.fieldNodes.length + 1) + 2 * TABLE_BORDER_WIDTH}
        >
            <path className="TableBorder" d={calculateTableBackgroundPath(tableHeight)} />
            <TableRow
                isHeader={true}
                rowIndex={0}
                node={tableConfig.tableNode}
                onTableRowDrag={e => handleTableDrag(e, tableId)}
            />
            {tableConfig.fieldNodes.map((fieldNode, index) => {
                return (
                    <TableRow
                        key={fieldNode.id}
                        isHeader={false}
                        rowIndex={index + 1}
                        node={fieldNode}
                        onTableRowDrag={() => {}}
                    />
                );
            })}
        </svg>
    );
}

SvgTable.propTypes = {
    coords: COORDS_PROP_TYPE.isRequired,
    tableConfig: TABLE_CONFIG_PROP_TYPE.isRequired,
};

/**
 * Utility function to truncate text to fit in a certain width. SVG does not support overflow
 * controls for text.
 *
 * @param {string} text Text to truncate
 * @param {boolean} isHeader Whether this text is header text (which uses a larger font weight)
 * @param {number} width Allowed width
 * @returns {string}
 */
function truncateTextForWidth(text, isHeader, width = ROW_WIDTH - 2 * TEXT_PADDING_X) {
    const span = document.createElement('span');
    document.body.append(span);
    span.classList.add('TableRow', isHeader ? 'TableHeader' : undefined);
    span.innerHTML = text;

    let truncatedText = text;
    while (span.offsetWidth > width) {
        truncatedText = truncatedText.substring(0, truncatedText.length - 4) + '...';
        span.innerHTML = truncatedText;
    }

    span.remove();
    return truncatedText;
}

/**
 * Table row component, which contains either the table name or a field name.
 *
 * @param {number} rowIndex Used as a multiplier to position the field vertically
 * @param {Object} node Node object containing name and relevant ids
 * @param {boolean} isHeader Whether this table row is a the table header
 * @param {onTableRowDrag} function mousedown event handler to control table dragging
 */
function TableRow({rowIndex, node, isHeader, onTableRowDrag}) {
    const truncatedRowName = truncateTextForWidth(node.name, isHeader);
    // Give each table header a random, determinsitic color based off the tableId
    let headerColorString;
    if (isHeader) {
        const colorIndex = node.tableId.charCodeAt(node.tableId.length - 1) % ALLOWED_COLORS.length;
        headerColorString = ALLOWED_COLORS[colorIndex];
    }
    return (
        <svg
            className={classnames('TableRow', {
                TableHeader: isHeader,
            })}
            id={node.id}
            x={TABLE_BORDER_WIDTH} // give room for filter box-shadow
            y={TABLE_BORDER_WIDTH + ROW_HEIGHT * rowIndex}
            onMouseDown={onTableRowDrag}
        >
            {isHeader ? (
                <path fill={colorUtils.getHexForColor(headerColorString)} d={TABLE_HEADER_PATH} />
            ) : (
                <rect height={ROW_HEIGHT} width={ROW_WIDTH} />
            )}
            <text x={TEXT_PADDING_X} y={ROW_HEIGHT / 2} width={ROW_WIDTH}>
                {truncatedRowName}
            </text>
        </svg>
    );
}

TableRow.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    node: NODE_PROP_TYPE.isRequired,
    isHeader: PropTypes.bool,
    onTableRowDrag: PropTypes.func.isRequired,
};
