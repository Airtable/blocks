import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SvgTable from './SvgTable';
import {HighlightContext} from './HighlightWrapper';
import {COORDS_PROP_TYPE, TABLE_CONFIG_PROP_TYPE} from './constants';

/**
 * Container group for the table SVG elements. Handles node mouseover/mouseout (event delegation
 * done in the HighlightWrapper).
 *
 * @param {Object} props.tableCoordsByTableId table x,y coordinates, by table id
 * @param {Object} props.tableConfigsByTableId table header & field nodes for each table, by table id
 */
export default function TableContainer({tableConfigsByTableId, tableCoordsByTableId}) {
    const {onNodeOrLinkMouseOver, onNodeOrLinkMouseOut} = useContext(HighlightContext);

    return (
        <g
            id="table-container"
            onMouseMove={onNodeOrLinkMouseOver}
            onMouseOut={onNodeOrLinkMouseOut}
        >
            {Object.keys(tableConfigsByTableId).map(tableId => {
                return (
                    <SvgTable
                        key={tableId}
                        coords={tableCoordsByTableId[tableId]}
                        tableConfig={tableConfigsByTableId[tableId]}
                    />
                );
            })}
        </g>
    );
}

TableContainer.propTypes = {
    tableConfigsByTableId: PropTypes.objectOf(TABLE_CONFIG_PROP_TYPE),
    tableCoordsByTableId: PropTypes.objectOf(COORDS_PROP_TYPE),
};
