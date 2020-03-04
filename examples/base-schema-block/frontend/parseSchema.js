import {FIELD_LABELS_BY_TYPE, LINK_LABELS_BY_TYPE} from './constants';
import {FieldType} from '@airtable/blocks/models';

/**
 * Utility helper to push an item into an array at given object key, or initialize that array
 * with the item if it doesn't yet exist.
 *
 * @param {Object} obj
 * @param {string} key
 * @param {unknown} value
 */
function pushToOrInitializeArray(obj, key, value) {
    if (!obj[key]) {
        obj[key] = [];
    } else if (!Array.isArray(obj[key])) {
        throw new Error(`Expected an array at ${key}, but found ${obj[key]}`);
    }
    obj[key].push(value);
}

function createLinkId(source, target) {
    return `${source}_${target}`;
}

/**
 * Given a base, iterate through to construct a list of nodes, links, and their interdependencies.
 *
 * @param {Base} base
 * @returns {{
 *     linksById: Object,
 *     nodesById: Obkect,
 *     tableConfigsByTableId: Object,
 *     dependentLinksByNodeId: Object
 * }}
 */
export default function parseSchema(base) {
    let linksById = {};
    const nodesById = {};
    const tableConfigsByTableId = {};
    const dependentLinksByNodeId = {};

    base.tables.forEach(table => {
        const fieldNodes = [];
        table.fields.forEach(field => {
            const fieldNode = {
                id: field.id,
                name: field.name,
                type: 'field',
                tableName: table.name,
                tableId: table.id,
                tooltipLabel: FIELD_LABELS_BY_TYPE[field.type],
            };
            fieldNodes.push(fieldNode);
            nodesById[fieldNode.id] = fieldNode;
            if (field.options && field.options.isValid === false) {
                return;
            }
            switch (field.type) {
                case FieldType.MULTIPLE_RECORD_LINKS: {
                    const {inverseLinkFieldId, linkedTableId} = field.options;
                    if (inverseLinkFieldId) {
                        // foreign table linked records (links to different table)
                        // every foreign linked record field MUST contain a mirrored linked record
                        // field on the inverse table. we only want to add 1 link for this
                        // relationship, so we check to see if the inverse link has already
                        // been created and just re-use it if so.
                        const inverseLinkId = createLinkId(inverseLinkFieldId, field.id);
                        const inverseLinkOrNull = linksById[inverseLinkId];
                        if (inverseLinkOrNull) {
                            pushToOrInitializeArray(
                                dependentLinksByNodeId,
                                field.id,
                                inverseLinkOrNull,
                            );
                        } else {
                            const link = {
                                id: createLinkId(field.id, inverseLinkFieldId),
                                sourceId: field.id,
                                sourceTableId: table.id,
                                targetId: inverseLinkFieldId,
                                targetTableId: linkedTableId,
                                type: field.type,
                                tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                            };
                            linksById[link.id] = link;
                            pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                        }
                    } else {
                        // self-linking linked records (links to same table)
                        // in this case, draw a link from the field to the table header itself.
                        // there is no "inverse field" for self-linking records.
                        const link = {
                            id: createLinkId(field.id, linkedTableId),
                            sourceId: field.id,
                            sourceTableId: table.id,
                            targetId: linkedTableId,
                            targetTableId: linkedTableId,
                            type: field.type,
                            tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                        };
                        linksById[link.id] = link;
                        pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                    }
                    break;
                }
                case FieldType.FORMULA: {
                    // formulas are dependent on multiple fields in the same table. we want to
                    // mark the link dependency in both directions, so add it to both the formula
                    // field and the dependent field for each. we consider the target to be the
                    // formula field itself, because other fields feed into its value.
                    const {referencedFieldIds} = field.options;
                    referencedFieldIds.forEach(dependentFieldId => {
                        const link = {
                            id: createLinkId(field.id, dependentFieldId),
                            sourceId: field.id,
                            sourceTableId: table.id,
                            targetId: dependentFieldId,
                            targetTableId: table.id,
                            type: field.type,
                            tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                        };
                        linksById[link.id] = link;
                        pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                        pushToOrInitializeArray(dependentLinksByNodeId, dependentFieldId, link);
                    });
                    break;
                }
                case FieldType.COUNT: {
                    // count fields reference a linked record field in the same table. treated
                    // similar to formula field.
                    const {recordLinkFieldId} = field.options;
                    const link = {
                        id: createLinkId(field.id, recordLinkFieldId),
                        sourceId: field.id,
                        sourceTableId: table.id,
                        targetId: recordLinkFieldId,
                        targetTableId: table.id,
                        type: field.type,
                        tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                    };
                    linksById[link.id] = link;
                    pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                    pushToOrInitializeArray(dependentLinksByNodeId, recordLinkFieldId, link);
                    break;
                }
                case FieldType.MULTIPLE_LOOKUP_VALUES: {
                    // lookup fields reference a linked record field in the same table and a field
                    // in the linked foreign table that is being "looked up".
                    const {recordLinkFieldId, fieldIdInLinkedTable} = field.options;
                    const link = {
                        id: createLinkId(field.id, recordLinkFieldId),
                        sourceId: field.id,
                        sourceTableId: table.id,
                        targetId: recordLinkFieldId,
                        targetTableId: table.id,
                        type: field.type,
                        tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                    };
                    linksById[link.id] = link;
                    pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                    pushToOrInitializeArray(dependentLinksByNodeId, recordLinkFieldId, link);

                    const recordLinkField = table.getFieldByIdIfExists(recordLinkFieldId);
                    if (recordLinkField !== null) {
                        const foreignLink = {
                            id: createLinkId(field.id, fieldIdInLinkedTable),
                            sourceId: field.id,
                            sourceTableId: table.id,
                            targetId: fieldIdInLinkedTable,
                            targetTableId: recordLinkField.options.linkedTableId,
                            type: field.type,
                            tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                        };
                        linksById[foreignLink.id] = foreignLink;
                        pushToOrInitializeArray(dependentLinksByNodeId, field.id, foreignLink);
                        pushToOrInitializeArray(
                            dependentLinksByNodeId,
                            fieldIdInLinkedTable,
                            foreignLink,
                        );
                    }

                    break;
                }
                case FieldType.ROLLUP: {
                    // rollup fieldss are a combination of lookups with formulas. like rollups,
                    // they reference a linked record field in the same table and a field in that
                    // linked foreign table that is being "rolled up". additionally, they can
                    // reference fields from their own table in the rollup calculation.
                    for (const referencedFieldId of field.options.referencedFieldIds) {
                        const link = {
                            id: createLinkId(field.id, referencedFieldId),
                            sourceId: field.id,
                            sourceTableId: table.id,
                            targetId: referencedFieldId,
                            targetTableId: table.id,
                            type: field.type,
                            tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                        };
                        linksById[link.id] = link;
                        pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                        pushToOrInitializeArray(dependentLinksByNodeId, referencedFieldId, link);
                    }

                    const {recordLinkFieldId, fieldIdInLinkedTable} = field.options;
                    const link = {
                        id: createLinkId(field.id, recordLinkFieldId),
                        sourceId: field.id,
                        sourceTableId: table.id,
                        targetId: recordLinkFieldId,
                        targetTableId: table.id,
                        type: field.type,
                        tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                    };
                    linksById[link.id] = link;
                    pushToOrInitializeArray(dependentLinksByNodeId, field.id, link);
                    pushToOrInitializeArray(dependentLinksByNodeId, recordLinkFieldId, link);

                    const recordLinkField = table.getFieldByIdIfExists(recordLinkFieldId);
                    if (recordLinkField !== null) {
                        const foreignLink = {
                            id: createLinkId(field.id, fieldIdInLinkedTable),
                            sourceId: field.id,
                            sourceTableId: table.id,
                            targetId: fieldIdInLinkedTable,
                            targetTableId: recordLinkField.options.linkedTableId,
                            type: field.type,
                            tooltipLabel: LINK_LABELS_BY_TYPE[field.type],
                        };
                        linksById[foreignLink.id] = foreignLink;
                        pushToOrInitializeArray(dependentLinksByNodeId, field.id, foreignLink);
                        pushToOrInitializeArray(
                            dependentLinksByNodeId,
                            fieldIdInLinkedTable,
                            foreignLink,
                        );
                    }
                    break;
                }
                default:
                    break;
            }
        });

        const tableNode = {
            id: table.id,
            name: table.name,
            type: 'table',
            tableName: table.name,
            tableId: table.id,
            tooltipLabel: 'Table',
        };
        nodesById[tableNode.id] = tableNode;
        tableConfigsByTableId[table.id] = {
            tableNode,
            fieldNodes,
        };
    });

    // When a table is deleted, we can get schema updates where fields still refer to that table.
    // Similarly, when a field is deleted, it might still have references.
    // So we filter out links defensively.
    const newLinksById = {};
    for (const [linkId, link] of Object.entries(linksById)) {
        const {targetTableId, targetId} = link;
        if (!Object.prototype.hasOwnProperty.call(nodesById, targetTableId)) {
            continue;
        }
        if (!Object.prototype.hasOwnProperty.call(nodesById, targetId)) {
            continue;
        }
        newLinksById[linkId] = link;
    }
    linksById = newLinksById;

    // We can't process dependentLinksByNodeId until we've gone through all fields in
    // all tables because of cross-table links (at least 2 passes required).
    base.tables.forEach(table => {
        const dependentLinks = table.fields.reduce((result, field) => {
            const links = dependentLinksByNodeId[field.id];
            return links ? result.concat(links) : result;
        }, []);
        dependentLinksByNodeId[table.id] = dependentLinks;
    });

    return {
        linksById,
        nodesById,
        tableConfigsByTableId,
        dependentLinksByNodeId,
    };
}
