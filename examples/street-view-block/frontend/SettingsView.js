import {
    colors,
    Box,
    Text,
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

const severityColorCode = level => {
    switch (level) {
        case 1: {
            return colors.ORANGE;
        }
        case 2: {
            return colors.RED;
        }
        default: {
            return '';
        }
    }
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
const SettingsStatus = ({settings}) => {
    const {
        validated: {isValid, action, severity, reason},
    } = settings;

    const textColor = severityColorCode(severity);

    return !isValid ? (
        <Box>
            <Text textColor={textColor} marginRight={3}>
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
        validated: {isValid, severity, errorKey},
    } = settings;

    const borderColor = ['transparent', colors.ORANGE, colors.RED][severity];

    const errorStyle = {
        border: `2px solid ${borderColor}`,
    };

    const doneButtonProps = {
        disabled: !isValid,
    };

    const {API_KEY, CACHE_FIELD_ID, LOCATION_FIELD_ID, TABLE_ID} = ConfigKeys;

    return (
        <FullscreenBox display="flex" flexDirection="column">
            <Box flex="auto" overflow="auto" padding={3}>
                <Heading paddingBottom={3}>Settings</Heading>
                <FormField label="Google API key">
                    <InputSynced
                        globalConfigKey={API_KEY}
                        style={errorKey === API_KEY ? errorStyle : {}}
                        onChange={() => {
                            settings.googleApiKeyError = null;
                        }}
                    />

                    <Text textColor="light" size="small">
                        Note: the API key will be visible to all collaborators.
                    </Text>
                </FormField>
                <FormField label="Table">
                    <TablePickerSynced
                        globalConfigKey={TABLE_ID}
                        style={errorKey === TABLE_ID ? errorStyle : {}}
                    />
                </FormField>
                {settings.table ? (
                    <FormField
                        label="Address field"
                        description="Pick a field containing addresses or coordinates."
                    >
                        <FieldPickerSynced
                            table={settings.table}
                            globalConfigKey={LOCATION_FIELD_ID}
                            allowedTypes={AllowedLocationFieldTypes}
                            style={errorKey === LOCATION_FIELD_ID ? errorStyle : {}}
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
                            globalConfigKey={CACHE_FIELD_ID}
                            allowedTypes={AllowedCacheFieldTypes}
                            style={errorKey === CACHE_FIELD_ID ? errorStyle : {}}
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
