import PropTypes from 'prop-types';
import React from 'react';

import {Field, FieldType, Record} from '@airtable/blocks/models';
import {CellRenderer, Text} from '@airtable/blocks/ui';

/**
 * Handles text and attachments to make them larger, but falls back to cell renderer for other
 * field types.
 */
export default function CustomCellRenderer({record, field}) {
    switch (field.type) {
        case FieldType.SINGLE_LINE_TEXT:
        // falls through

        case FieldType.MULTILINE_TEXT:
        // falls through

        case FieldType.RICH_TEXT: {
            return (
                <Text width="100%" size="xlarge">
                    {record.getCellValueAsString(field)}
                </Text>
            );
        }
        case FieldType.MULTIPLE_ATTACHMENTS: {
            const attachmentCellValue = record.getCellValue(field);

            let attachmentObj;
            if (attachmentCellValue && attachmentCellValue.length > 0) {
                // Try to get the first attachment object from the cell value.
                attachmentObj = attachmentCellValue[attachmentCellValue.length - 1];
            }

            if (!attachmentObj || !attachmentObj.thumbnails || !attachmentObj.thumbnails.large) {
                // If there are no attachment present, use the default cell renderer
                return <CellRenderer record={record} field={field} />;
            }
            return <img src={attachmentObj.thumbnails.large.url} height="150px" />;
        }
        default: {
            return <CellRenderer record={record} field={field} />;
        }
    }
}

CustomCellRenderer.propTypes = {
    record: PropTypes.instanceOf(Record).isRequired,
    field: PropTypes.instanceOf(Field).isRequired,
};
