import React from 'react';

import TableContainer from './TableContainer';
import LinkContainer from './LinkContainer';
import SvgPanZoomWrapper from './SvgPanZoomWrapper';
import HighlightWrapper from './HighlightWrapper';
import DragWrapper from './DragWrapper';
import useSettings from './settings';
import FullscreenBox from './FullscreenBox';

export default function SchemaVisualizer() {
    const {
        nodesById,
        linksById,
        linkPathsByLinkId,
        dependentLinksByNodeId,
        tableCoordsByTableId,
        tableConfigsByTableId,
        enabledLinksByType,
    } = useSettings();

    return (
        <FullscreenBox>
            <svg id="root" className="SchemaVisualizer" width="100%" height="100%">
                <SvgPanZoomWrapper>
                    <HighlightWrapper
                        dependentLinksByNodeId={dependentLinksByNodeId}
                        nodesById={nodesById}
                        linksById={linksById}
                    >
                        <DragWrapper
                            dependentLinksByNodeId={dependentLinksByNodeId}
                            tableConfigsByTableId={tableConfigsByTableId}
                            tableCoordsByTableId={tableCoordsByTableId}
                        >
                            <LinkContainer
                                linksById={linksById}
                                linkPathsByLinkId={linkPathsByLinkId}
                                enabledLinksByType={enabledLinksByType}
                            />
                            <TableContainer
                                tableConfigsByTableId={tableConfigsByTableId}
                                tableCoordsByTableId={tableCoordsByTableId}
                            />
                        </DragWrapper>
                    </HighlightWrapper>
                </SvgPanZoomWrapper>
            </svg>
        </FullscreenBox>
    );
}

SchemaVisualizer.propTypes = {};
