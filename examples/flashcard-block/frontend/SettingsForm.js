import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Table} from '@airtable/blocks/models';
import {
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    TablePickerSynced,
    ViewPickerSynced,
} from '@airtable/blocks/ui';

import {ConfigKeys} from './settings';

export default function SettingsForm({setIsSettingsVisible, settings}) {
    return (
        <Box
            flex="none"
            display="flex"
            flexDirection="column"
            width="300px"
            backgroundColor="white"
            maxHeight="100vh"
            borderLeft="thick"
        >
            <Box
                flex="auto"
                display="flex"
                flexDirection="column"
                minHeight="0"
                padding={3}
                overflowY="auto"
            >
                <Heading marginBottom={3}>Settings</Heading>
                <FormField label="Table">
                    <TablePickerSynced globalConfigKey={ConfigKeys.TABLE_ID} />
                </FormField>
                {settings.table && (
                    <Fragment>
                        <FormField
                            label="View"
                            description="Only records in this view will be used"
                        >
                            <ViewPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.VIEW_ID}
                            />
                        </FormField>
                        <FormField label="Question field">
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.QUESTION_FIELD_ID}
                            />
                        </FormField>
                        <FormField label="Answer field (optional)">
                            <FieldPickerSynced
                                table={settings.table}
                                shouldAllowPickingNone={true}
                                globalConfigKey={ConfigKeys.ANSWER_FIELD_ID}
                            />
                        </FormField>
                    </Fragment>
                )}
            </Box>
            <Box
                flex="none"
                display="flex"
                justifyContent="flex-end"
                paddingY={3}
                marginX={3}
                borderTop="thick"
            >
                <Button variant="primary" size="large" onClick={() => setIsSettingsVisible(false)}>
                    Done
                </Button>
            </Box>
        </Box>
    );
}

SettingsForm.propTypes = {
    setIsSettingsVisible: PropTypes.func.isRequired,
    settings: PropTypes.shape({
        table: PropTypes.instanceOf(Table),
    }).isRequired,
};
