import {FieldType} from '@airtable/blocks/models';
import PropTypes from 'prop-types';

// ================
// TABLE DIMENSIONS
// ================
export const TABLE_GUTTER_SIZE = 50;
export const ROW_HEIGHT = 32;
export const ROW_WIDTH = 180;
export const TEXT_PADDING_X = 10;
export const TABLE_BORDER_WIDTH = 2;
export const TABLE_BORDER_RADIUS = 4;
// Give table headers rounded top-left / top-right corners
export const TABLE_HEADER_PATH = `
    M 0 ${ROW_HEIGHT}
    L 0 ${TABLE_BORDER_RADIUS} 
    A ${TABLE_BORDER_RADIUS} ${TABLE_BORDER_RADIUS} 0 0 1 ${TABLE_BORDER_RADIUS} 0 
    L ${ROW_WIDTH - TABLE_BORDER_RADIUS} 0 
    A ${TABLE_BORDER_RADIUS} ${TABLE_BORDER_RADIUS} 0 0 1 ${ROW_WIDTH} ${TABLE_BORDER_RADIUS} 
    L ${ROW_WIDTH} ${ROW_HEIGHT} 
    Z
`;

// ===============
// TEXT FORMATTING
// ===============
export const FONT_FAMILY =
    "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
export const FONT_SIZE = '13px';

// ==========
// LABEL TEXT
// ==========
export const FIELD_LABELS_BY_TYPE = Object.freeze({
    [FieldType.SINGLE_LINE_TEXT]: 'Single line text field',
    [FieldType.EMAIL]: 'Email field',
    [FieldType.DATE]: 'Date field',
    [FieldType.DATE_TIME]: 'Datetime field',
    [FieldType.PHONE_NUMBER]: 'Phone field',
    [FieldType.MULTIPLE_RECORD_LINKS]: 'Linked records field',
    [FieldType.FOREIGN_KEY]: 'Linked record field',
    [FieldType.TEXT]: 'Text field',
    [FieldType.MULTILINE_TEXT]: 'Multiple line text field',
    [FieldType.MULTIPLE_ATTACHMENTS]: 'Attachments field',
    [FieldType.CHECKBOX]: 'Checkbox field',
    [FieldType.MULTIPLE_SELECTS]: 'Multiple select field',
    [FieldType.SINGLE_SELECT]: 'Single select field',
    [FieldType.DATE]: 'Date field',
    [FieldType.PHONE]: 'Phone field',
    [FieldType.EMAIL]: 'Email field',
    [FieldType.URL]: 'URL field',
    [FieldType.NUMBER]: 'Number field',
    [FieldType.CURRENCY]: 'Currency field',
    [FieldType.PERCENT]: 'Percent field',
    [FieldType.FORMULA]: 'Formula field',
    [FieldType.CREATED_TIME]: 'Created time field',
    [FieldType.ROLLUP]: 'Rollup field',
    [FieldType.COUNT]: 'Count field',
    [FieldType.MULTIPLE_LOOKUP_VALUES]: 'Lookup field',
    [FieldType.AUTO_NUMBER]: 'Autonumber field',
    [FieldType.BARCODE]: 'Barcode field',
    [FieldType.SINGLE_COLLABORATOR]: 'Collaborator field',
    [FieldType.MULTIPLE_COLLABORATORS]: 'Collaborators field',
    [FieldType.RATING]: 'Rating field',
    [FieldType.RICH_TEXT]: 'Rich text field',
    [FieldType.DURATION]: 'Duration field',
    [FieldType.LAST_MODIFIED_TIME]: 'Last modified time field',
    [FieldType.CREATED_BY]: 'Created by field',
    [FieldType.LAST_MODIFIED_BY]: 'Last modified by field',
    [FieldType.BUTTON]: 'Button field',
});
export const LINK_LABELS_BY_TYPE = Object.freeze({
    [FieldType.MULTIPLE_RECORD_LINKS]: 'Linked record',
    [FieldType.FORMULA]: 'Formula dependency',
    [FieldType.ROLLUP]: 'Rollup dependency',
    [FieldType.COUNT]: 'Count dependency',
    [FieldType.MULTIPLE_LOOKUP_VALUES]: 'Lookup dependency',
});

// ==========
// PROP TYPES
// ==========
export const LINK_PROP_TYPE = PropTypes.shape({
    id: PropTypes.string.isRequired,
    sourceId: PropTypes.string.isRequired,
    sourceTableId: PropTypes.string.isRequired,
    targetId: PropTypes.string.isRequired,
    targetTableId: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        FieldType.MULTIPLE_RECORD_LINKS,
        FieldType.FORMULA,
        FieldType.ROLLUP,
        FieldType.MULTIPLE_LOOKUP_VALUES,
        FieldType.COUNT,
    ]).isRequired,
    tooltipLabel: PropTypes.string.isRequired,
});
export const NODE_PROP_TYPE = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['table', 'field']).isRequired,
    tableName: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
    tooltipLabel: PropTypes.string.isRequired,
});
export const COORDS_PROP_TYPE = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
});
export const TABLE_CONFIG_PROP_TYPE = PropTypes.shape({
    tableNode: NODE_PROP_TYPE.isRequired,
    fieldNodes: PropTypes.arrayOf(NODE_PROP_TYPE.isRequired).isRequired,
});
