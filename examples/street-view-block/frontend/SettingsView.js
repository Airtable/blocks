import {
    Box,
    Text,
    Link,
    Button,
    FormField,
    Heading,
    InputSynced,
    TablePickerSynced,
    FieldPickerSynced,
    Switch,
} from '@airtable/blocks/ui';
import React from 'react';
import {AllowedCacheFieldTypes, AllowedLocationFieldTypes} from './types';
import {ConfigKeys} from './useSettingsStore';
import FullscreenBox from './FullscreenBox';

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
const SettingsStatus = ({settings}) => {
    const {
        validated: {isValid, action, reason},
    } = settings;

    return !isValid ? (
        <Box>
            <Text textColor="red" marginRight={3}>
                {reason}
            </Text>
            {action ? (
                <Text textColor="light" marginRight={3}>
                    {action}
                </Text>
            ) : null}
        </Box>
    ) : null;
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
export const SettingsView = ({settings}) => {
    const {
        validated: {isValid},
    } = settings;

    const doneButtonProps = {
        disabled: !isValid,
    };

    return (
        <FullscreenBox display="flex" flexDirection="column">
            <Box flex="auto" overflow="auto" padding={3}>
                <Heading paddingBottom={3}>Street view settings</Heading>
                <FormField
                    label="Google API key"
                    description={
                        <>
                            Follow the steps in{' '}
                            <Link
                                underline={true}
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                            >
                                Get an API Key
                            </Link>
                            .
                        </>
                    }
                >
                    <InputSynced globalConfigKey={ConfigKeys.API_KEY} style={{border: 'none'}} />
                </FormField>
                <FormField label="Table">
                    <TablePickerSynced globalConfigKey={ConfigKeys.TABLE_ID} />
                </FormField>
                {settings.table ? (
                    <FormField
                        label="Address field"
                        description="Pick a field containing addresses or coordinates."
                    >
                        <FieldPickerSynced
                            table={settings.table}
                            globalConfigKey={ConfigKeys.LOCATION_FIELD_ID}
                            allowedTypes={AllowedLocationFieldTypes}
                        />
                    </FormField>
                ) : null}
                {settings.table && settings.locationField ? (
                    <FormField
                        label="Geocode cache field"
                        description="This block stores additional information for each address. Create a new text field in your table and pick it below. Other street view blocks can use the same field."
                    >
                        <FieldPickerSynced
                            table={settings.table}
                            globalConfigKey={ConfigKeys.CACHE_FIELD_ID}
                            allowedTypes={AllowedCacheFieldTypes}
                        />
                    </FormField>
                ) : null}
                <Switch
                    value={settings.showRoadLabels}
                    onChange={newValue => {
                        settings.showRoadLabels = newValue;
                    }}
                    label="Show road labels"
                    marginBottom={2}
                />
                <Switch
                    value={settings.showDefaultUI}
                    onChange={newValue => {
                        settings.showDefaultUI = newValue;
                    }}
                    label="Show default UI"
                    marginBottom={3}
                />
            </Box>
            <Box borderTop="thick" display="flex" flex="none" padding={3}>
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    paddingRight={2}
                >
                    <SettingsStatus settings={settings} />
                </Box>
                <Button
                    size="large"
                    variant="primary"
                    onClick={() => {
                        settings.showSettings = false;
                    }}
                    {...doneButtonProps}
                >
                    Done
                </Button>
            </Box>
        </FullscreenBox>
    );
};
