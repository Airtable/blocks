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
                            description="Must be an attachment or lookup of attachment field"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.ATTACHMENT_FIELD_ID}
                                allowedTypes={[
                                    FieldType.MULTIPLE_ATTACHMENTS,
                                    FieldType.MULTIPLE_LOOKUP_VALUES,
                                ]}
                            />
                        </FormField>
                        <FormField
                            label="Start time field (optional)"
                            description="Must be a duration field"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.START_TIME_FIELD_ID}
                                allowedTypes={[FieldType.DURATION]}
                                shouldAllowPickingNone={true}
                            />
                        </FormField>
                        <FormField
                            label="End time field (optional)"
                            description="Must be a duration field"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.END_TIME_FIELD_ID}
                                allowedTypes={[FieldType.DURATION]}
                                shouldAllowPickingNone={true}
                            />
                        </FormField>
                        <FormField label="Caption field (optional)">
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.CAPTION_FIELD_ID}
                                shouldAllowPickingNone={true}
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
