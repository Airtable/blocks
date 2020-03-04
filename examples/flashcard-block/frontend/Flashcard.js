import PropTypes from 'prop-types';
import React from 'react';
import {Box, Text} from '@airtable/blocks/ui';
import {Field, Record} from '@airtable/blocks/models';

import CustomCellRenderer from './CustomCellRenderer';

export default function Flashcard({record, settings, shouldShowAnswer}) {
    return (
        <Box display="flex" flex="auto" overflowY="auto">
            <Box marginY="auto" padding={5} width="100%">
                <Box display="flex" paddingBottom={2} borderBottom="default">
                    {record ? (
                        <CustomCellRenderer field={settings.questionField} record={record} />
                    ) : (
                        <Text width="100%" size="xlarge" textAlign="center">
                            All done!
                        </Text>
                    )}
                </Box>
                <Box display="flex" paddingTop={2}>
                    {settings.answerField && record && shouldShowAnswer ? (
                        <CustomCellRenderer field={settings.answerField} record={record} />
                    ) : null}
                </Box>
            </Box>
        </Box>
    );
}

Flashcard.propTypes = {
    record: PropTypes.instanceOf(Record),
    settings: PropTypes.shape({
        questionField: PropTypes.instanceOf(Field).isRequired,
        answerField: PropTypes.instanceOf(Field),
    }).isRequired,
};
