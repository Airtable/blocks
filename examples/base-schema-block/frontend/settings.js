import {useState} from 'react';
import {base} from '@airtable/blocks';
import _ from 'lodash';
import {useWatchable, useGlobalConfig} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';

import parseSchema from './parseSchema';
import {
    calculateLinkPaths,
    getUpdatedTableCoords,
    getInitialTableCoords,
} from './coordinateHelpers';

export const ConfigKeys = Object.freeze({
    ENABLED_LINKS_BY_TYPE: 'enabledLinksByType',
    TABLE_COORDS_BY_TABLE_ID: 'tableCoordsByTableId',
});

/**
 * Reads values from GlobalConfig and calculates relevant positioning information for the nodes
 * and links.
 *
 * A node represents either a "row" in the visualization - either a table header or a field. A link
 * represents a relationship between two nodes. We persist two types of information in globalConfig:
 * (1) whether a certain link type should be shown; and (2) the x,y position for each table, where
 * position indicates the top-left corner of the table.
 *
 * Positioning calculation takes place as follows:
 * (1) Parse the schema of the base (ie, what tables exist, what fields exist on those tables,
 * and what are the relationships/links between fields & tables).
 * (2) Lookup the persisted position for each table, and check for any recently-created tables that
 * are not accounted for in these persisted settings. Assign positions for any new tables.
 * (3) Using the table & link configurations from step 1 and table coordinates from step 2,
 * calculate the paths (ie, the `d` attribute for SVG element) for the links. Because the row widths
 * & heights are constant, we can infer coordinates by adding offsets to the table coordinates.
 *
 * When dragging a table and updating positions on `mousemove`, it is inefficient to go through this
 * calculation process / rely on React state updates to propagate down to the child components.
 * Instead, we only calculate required changes and directly manipulate the DOM (@see DragWrapper).
 * The new table coordinates are persisted to globalConfig when dragging is finished, but positions
 * and paths for nodes and links are only recalculated from scratch when the base schema changes.
 * Otherwise, we just rely on the current DOM position.
 *
 * @returns {{
 *     enabledLinksByType: { ['multipleRecordLinks' | 'formula' | 'multipleLookupValues' | 'rollup' | 'count']: boolean },
 *     tableCoordsByTableId: { TableId: { x: number, y: number }},
 *     tableConfigsByTableId: { TableId: { tableNode: Node, fieldNodes: Node[] }},
 *     nodesById: { NodeId: Node },
 *     linksById: { LinkId: Link },
 *     linkPathsByLinkId: { LinkId: string },
 *     dependentLinksByNodeId: { NodeId: Link[] }
 * }}
 */
export default function useSettings() {
    const [baseSchema, setBaseSchema] = useState(() => parseSchema(base));
    const {nodesById, linksById, tableConfigsByTableId, dependentLinksByNodeId} = baseSchema;
    const globalConfig = useGlobalConfig();
    if (!globalConfig.get(ConfigKeys.TABLE_COORDS_BY_TABLE_ID)) {
        // First time run, determine initial table coords
        globalConfig.setPathsAsync([
            {
                path: [ConfigKeys.TABLE_COORDS_BY_TABLE_ID],
                value: getInitialTableCoords(tableConfigsByTableId),
            },
            {
                path: [ConfigKeys.ENABLED_LINKS_BY_TYPE],
                value: {
                    [FieldType.MULTIPLE_RECORD_LINKS]: true,
                    [FieldType.FORMULA]: true,
                    [FieldType.ROLLUP]: true,
                    [FieldType.COUNT]: true,
                    [FieldType.MULTIPLE_LOOKUP_VALUES]: true,
                },
            },
        ]);
    } else {
        // Non-first time run, check for any new tables missing from the old saved coords
        if (
            _.difference(
                Object.keys(tableConfigsByTableId),
                Object.keys(globalConfig.get(ConfigKeys.TABLE_COORDS_BY_TABLE_ID)),
            ).length > 0
        ) {
            globalConfig.setAsync(
                ConfigKeys.TABLE_COORDS_BY_TABLE_ID,
                getUpdatedTableCoords(
                    tableConfigsByTableId,
                    globalConfig.get(ConfigKeys.TABLE_COORDS_BY_TABLE_ID),
                ),
            );
        }
    }
    const tableCoordsByTableId = globalConfig.get(ConfigKeys.TABLE_COORDS_BY_TABLE_ID);
    const [linkPathsByLinkId, setLinkPathsByLinkId] = useState(() =>
        calculateLinkPaths(linksById, tableConfigsByTableId, tableCoordsByTableId),
    );

    // Only re-perform these potentially expensive calclulations when required, when the base
    // schema changes (ie, table added/removed/renamed, field added/removed/renamed).
    useWatchable(base, ['schema'], () => {
        const newSchema = parseSchema(base);
        const newTableCoords = getUpdatedTableCoords(
            newSchema.tableConfigsByTableId,
            tableCoordsByTableId,
        );
        const newLinkPaths = calculateLinkPaths(
            newSchema.linksById,
            newSchema.tableConfigsByTableId,
            newTableCoords,
        );

        globalConfig.setAsync(ConfigKeys.TABLE_COORDS_BY_TABLE_ID, newTableCoords);
        setBaseSchema(newSchema);
        setLinkPathsByLinkId(newLinkPaths);
    });

    const enabledLinksByType = {
        [FieldType.MULTIPLE_RECORD_LINKS]: globalConfig.get([
            ConfigKeys.ENABLED_LINKS_BY_TYPE,
            FieldType.MULTIPLE_RECORD_LINKS,
        ]),
        [FieldType.FORMULA]: globalConfig.get([
            ConfigKeys.ENABLED_LINKS_BY_TYPE,
            FieldType.FORMULA,
        ]),
        [FieldType.ROLLUP]: globalConfig.get([ConfigKeys.ENABLED_LINKS_BY_TYPE, FieldType.ROLLUP]),
        [FieldType.MULTIPLE_LOOKUP_VALUES]: globalConfig.get([
            ConfigKeys.ENABLED_LINKS_BY_TYPE,
            FieldType.MULTIPLE_LOOKUP_VALUES,
        ]),
        [FieldType.COUNT]: globalConfig.get([ConfigKeys.ENABLED_LINKS_BY_TYPE, FieldType.COUNT]),
    };

    return {
        enabledLinksByType,
        tableCoordsByTableId,
        tableConfigsByTableId,
        nodesById,
        linksById,
        linkPathsByLinkId,
        dependentLinksByNodeId,
    };
}
