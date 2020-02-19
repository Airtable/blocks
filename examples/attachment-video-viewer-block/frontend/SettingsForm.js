import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {FieldType, Table} from '@airtable/blocks/models';
import {
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    TablePickerSynced,
} from '@airtable/blocks/ui';

import {ConfigKeys} from './settings';

function SettingsForm({setIsSettingsVisible, settings}) {
    return (
        <Box
            flex="1 0 auto"
            display="flex"
            flexDirection="column"
            width="300px"
            backgroundColor="white"
            maxHeight="100vh"
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
                            label="Attachment field"
                            description="Must have field type: Attachment"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.ATTACHMENT_FIELD_ID}
                                allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
                            />
                        </FormField>
                        <FormField
                            label="Start Time field"
                            description="Must have field type: Duration"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.START_TIME_FIELD_ID}
                                allowedTypes={[FieldType.DURATION]}
                            />
                        </FormField>
                        <FormField
                            label="End Time field"
                            description="Must have field type: Duration"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.END_TIME_FIELD_ID}
                                allowedTypes={[FieldType.DURATION]}
                            />
                        </FormField>
                        <FormField
                            label="Caption field"
                            description="Must have field type: Single line text"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.CAPTION_FIELD_ID}
                                allowedTypes={[FieldType.SINGLE_LINE_TEXT]}
                            />
                        </FormField>
                    </Fragment>
                )}
            </Box>
            <Box
                flex="none"
                display="flex"
                flexDirection="row-reverse"
                justifyContent="space-between"
                paddingY={3}
                marginX={3}
                borderTop="thick"
            >
                <Button variant="primary" onClick={() => setIsSettingsVisible(false)}>
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

export default SettingsForm;
