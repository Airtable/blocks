import {
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    InputSynced,
    Switch,
    TablePickerSynced,
    Text,
    TextButton,
} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';
import {AllowedCacheFieldTypes, AllowedLocationFieldTypes} from './types';
import {ConfigKeys} from './useSettingsStore';
import APIKeyInformationDialog from './APIKeyInformationDialog';
import FullscreenBox from './FullscreenBox';
import SettingsStatus, {severityColorCode} from './SettingsStatus';

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
export default function SettingsView({settings}) {
    const {
        validated: {isValid, severity, errorKey},
    } = settings;

    const borderColor = [severityColorCode(0), severityColorCode(1), severityColorCode(2)][
        severity
    ];

    const errorStyle = {
        border: `2px solid ${borderColor}`,
    };

    const doneButtonProps = {
        disabled: !isValid,
    };

    const {API_KEY, CACHE_FIELD_ID, LOCATION_FIELD_ID, TABLE_ID} = ConfigKeys;

    const onResetClick = () => (settings.googleApiKey = '');
    const labelWithResetButton = (
        <Fragment>
            Google API key (<TextButton onClick={onResetClick}>Reset</TextButton>)
        </Fragment>
    );
    const googleApiKeyLabel = errorKey === API_KEY ? labelWithResetButton : 'Google API key';

    return (
        <FullscreenBox display="flex" flexDirection="column">
            <Box flex="auto" overflow="auto" padding={3}>
                <Heading paddingBottom={3}>Settings</Heading>
                <FormField label={googleApiKeyLabel}>
                    <InputSynced
                        globalConfigKey={API_KEY}
                        style={errorKey === API_KEY ? errorStyle : {}}
                        onChange={() => {
                            settings.googleApiKeyError = null;
                        }}
                    />

                    <Text textColor="light" size="small">
                        Note: the API key will be visible to all collaborators.{' '}
                        <APIKeyInformationDialog />
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
                        label="Location field"
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
                        description="This app stores additional information for each address. Create a new text field in your table and pick it below. Other street view apps can use the same field as long as they share the same location field."
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
}
