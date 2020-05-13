import PropTypes from 'prop-types';
import React from 'react';
import {
    useGlobalConfig,
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    Switch,
    TablePickerSynced,
    Text,
} from '@airtable/blocks/ui';

import {useSettings, ConfigKeys, allowedUrlFieldTypes} from './settings';

function SettingsForm({setIsSettingsOpen}) {
    const globalConfig = useGlobalConfig();
    const {
        isValid,
        message,
        settings: {isEnforced, urlTable},
    } = useSettings();

    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            flexDirection="column"
        >
            <Box flex="auto" padding={4} paddingBottom={2}>
                <Heading marginBottom={3}>Settings</Heading>
                <FormField label="">
                    <Switch
                        aria-label="When enabled, the block will only show previews for the specified table and field, regardless of what field is selected."
                        value={isEnforced}
                        onChange={value => {
                            globalConfig.setAsync(ConfigKeys.IS_ENFORCED, value);
                        }}
                        label="Use a specific field for previews"
                    />
                    <Text paddingY={1} textColor="light">
                        {isEnforced
                            ? 'The block will show previews for the selected record in grid view if the table has a supported URL in the specified field.'
                            : 'The block will show previews if the selected cell in grid view has a supported URL.'}
                    </Text>
                </FormField>
                {isEnforced && (
                    <FormField label="Preview table">
                        <TablePickerSynced globalConfigKey={ConfigKeys.URL_TABLE_ID} />
                    </FormField>
                )}
                {isEnforced && urlTable && (
                    <FormField label="Preview field">
                        <FieldPickerSynced
                            table={urlTable}
                            globalConfigKey={ConfigKeys.URL_FIELD_ID}
                            allowedTypes={allowedUrlFieldTypes}
                        />
                    </FormField>
                )}
            </Box>
            <Box display="flex" flex="none" padding={3} borderTop="thick">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    paddingRight={2}
                >
                    <Text textColor="light">{message}</Text>
                </Box>
                <Button
                    disabled={!isValid}
                    size="large"
                    variant="primary"
                    onClick={() => setIsSettingsOpen(false)}
                >
                    Done
                </Button>
            </Box>
        </Box>
    );
}

SettingsForm.propTypes = {
    setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;
