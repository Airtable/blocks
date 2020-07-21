import {
    Box,
    Text,
    Button,
    Label,
    Heading,
    InputSynced,
    TablePickerSynced,
    FieldPickerSynced,
    Switch,
} from '@airtable/blocks/ui';
import React from 'react';
import {FieldType} from '@airtable/blocks/models';
import {ConfigKeys} from './useSettingsStore';

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 */
const SettingsStatus = ({settingsStore}) => {
    if (!settingsStore.googleApiKey) {
        return 'Enter a Google Maps api key above.';
    } else if (!settingsStore.table) {
        return 'Pick a table with fields that have location data.';
    } else if (!settingsStore.locationField) {
        return 'Pick a field with location data.';
    }

    return null;
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 */
export const SettingsView = ({settingsStore}) => {
    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box flex="1 1 auto" padding="3" paddingLeft="0" paddingRight="0">
                <Box maxHeight="100%" padding="3" paddingTop="0">
                    <Heading paddingBottom={3}>Street view settings</Heading>
                    <Box paddingBottom={2}>
                        <Label width={'100%'}>
                            <Heading as="h5">Google API key</Heading>
                            <Box paddingBottom={2}>
                                Follow the steps in{' '}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="understroke link"
                                    href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                                >
                                    Get an API Key
                                </a>
                                .
                            </Box>
                            <InputSynced
                                globalConfigKey={ConfigKeys.API_KEY}
                                style={{border: 'none'}}
                            />
                        </Label>
                    </Box>
                    <Box paddingBottom={2}>
                        <Label width={'100%'}>
                            <Heading as="h5">Table</Heading>
                            <TablePickerSynced globalConfigKey={ConfigKeys.TABLE} />
                        </Label>
                    </Box>
                    {settingsStore.table ? (
                        <Box paddingBottom={2}>
                            <Label width={'100%'}>
                                <Heading as="h5">Location field</Heading>
                                <Text className="quiet" paddingBottom="1">
                                    Pick a field containing addresses or coordinates.
                                </Text>
                                <FieldPickerSynced
                                    table={settingsStore.table}
                                    globalConfigKey={ConfigKeys.LOCATION_FIELD}
                                    allowedTypes={[
                                        FieldType.BARCODE,
                                        FieldType.FORMULA,
                                        FieldType.MULTILINE_TEXT,
                                        FieldType.MULTIPLE_LOOKUP_VALUES,
                                        FieldType.RICH_TEXT,
                                        FieldType.ROLLUP,
                                        FieldType.SINGLE_LINE_TEXT,
                                        FieldType.SINGLE_SELECT,
                                    ]}
                                />
                            </Label>
                        </Box>
                    ) : null}
                    {settingsStore.table && settingsStore.locationField ? (
                        <Box paddingBottom={2}>
                            <Label width={'100%'}>
                                <Heading as="h5">Cache field</Heading>
                                <Text className="quiet" paddingBottom="1">
                                    This block stores additional information for each address.
                                    Create a new text field in your table and pick it below. Other
                                    street view blocks can use the same field.
                                </Text>
                                <FieldPickerSynced
                                    table={settingsStore.table}
                                    globalConfigKey={ConfigKeys.CACHE_FIELD}
                                    allowedTypes={[
                                        FieldType.MULTILINE_TEXT,
                                        FieldType.RICH_TEXT,
                                        FieldType.SINGLE_LINE_TEXT,
                                    ]}
                                />
                            </Label>
                        </Box>
                    ) : null}
                    <Heading as="h4">Street view user interface</Heading>
                    <Box paddingBottom={2}>
                        <Switch
                            value={settingsStore.showRoadLabels}
                            onChange={newValue => {
                                settingsStore.showRoadLabels = newValue;
                            }}
                            label="Show road labels"
                        />
                    </Box>
                    <Box paddingBottom={3}>
                        <Switch
                            value={settingsStore.showDefaultUI}
                            onChange={newValue => {
                                settingsStore.showDefaultUI = newValue;
                            }}
                            label="Show default UI"
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                position="fixed"
                right="0"
                bottom="0"
                left="0"
                flex="0 0 auto"
                backgroundColor="white"
            >
                <Box display="flex" padding="3" paddingTop="2" paddingBottom="2">
                    <Box display="inline-block" flex="1 1 auto" paddingTop="2">
                        <SettingsStatus settingsStore={settingsStore} />
                    </Box>
                    <Box display="inline-block" flex="0 0 auto">
                        <Button
                            variant="primary"
                            className=""
                            onClick={() => {
                                settingsStore.showSettings = false;
                            }}
                            style={{border: 'none'}}
                        >
                            Done
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
