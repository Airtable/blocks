import PropTypes from 'prop-types';
import React, {useLayoutEffect, useState} from 'react';
import {Box, Text, TextButton} from '@airtable/blocks/ui';
import {Field, Record} from '@airtable/blocks/models';

import CustomCellRenderer from './CustomCellRenderer';

export default function Flashcard({record, settings}) {
    const [showDetails, setShowDetails] = useState(false);

    // Reset showDetails whenever the record changes
    // We use a layout effect in order to update the showDetails state before the re-render triggered
    // by the record prop performs a paint to the DOM.
    useLayoutEffect(() => {
        setShowDetails(false);
    }, [record]);

    return (
        <Box display="flex" flex="auto" overflowY="auto">
            <Box marginY="auto" padding={5} width="100%">
                <Box display="flex" paddingBottom={2} borderBottom="default">
                    {record ? (
                        <CustomCellRenderer field={settings.titleField} record={record} />
                    ) : (
                        <Text width="100%" size="xlarge" textAlign="center">
                            No records left!
                        </Text>
                    )}
                </Box>
                <Box display="flex" paddingTop={2}>
                    {settings.detailsField &&
                        record &&
                        (showDetails ? (
                            <CustomCellRenderer field={settings.detailsField} record={record} />
                        ) : (
                            <TextButton size="large" onClick={() => setShowDetails(true)}>
                                Show answer
                            </TextButton>
                        ))}
                </Box>
            </Box>
        </Box>
    );
}

Flashcard.propTypes = {
    record: PropTypes.instanceOf(Record),
    settings: PropTypes.shape({
        titleField: PropTypes.instanceOf(Field).isRequired,
        detailsField: PropTypes.instanceOf(Field),
    }).isRequired,
};
