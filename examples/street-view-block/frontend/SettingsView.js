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
import {FieldType} from '@airtable/blocks/models';
import {ConfigKeys} from './useSettingsStore';
import FullscreenBox from './FullscreenBox';

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 */
const SettingsStatus = ({settingsStore}) => {
    let text;
    if (!settingsStore.googleApiKey) {
        text = 'Enter a Google Maps api key above.';
    } else if (!settingsStore.table) {
        text = 'Pick a table with fields that have location data.';
    } else if (!settingsStore.locationField) {
        text = 'Pick a field with location data.';
    } else {
        return null;
    }

    return (
        <Text textColor="light" marginRight={1}>
            {text}
        </Text>
    );
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 */
export const SettingsView = ({settingsStore}) => {
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
                    <TablePickerSynced globalConfigKey={ConfigKeys.TABLE} />
                </FormField>
                {settingsStore.table ? (
                    <FormField
                        label="Location field"
                        description="Pick a field containing addresses or coordinates."
                    >
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
                    </FormField>
                ) : null}
                {settingsStore.table && settingsStore.locationField ? (
                    <FormField
                        label="Cache field"
                        description="This block stores additional information for each address."
                    >
                        <FieldPickerSynced
                            table={settingsStore.table}
                            globalConfigKey={ConfigKeys.CACHE_FIELD}
                            allowedTypes={[
                                FieldType.MULTILINE_TEXT,
                                FieldType.RICH_TEXT,
                                FieldType.SINGLE_LINE_TEXT,
                            ]}
                        />
                        <Text variant="paragraph" textColor="light" size="small">
                            Create a new text field in your table and pick it below. Other street
                            view blocks can use the same field.
                        </Text>
                    </FormField>
                ) : null}
                <Switch
                    value={settingsStore.showRoadLabels}
                    onChange={newValue => {
                        settingsStore.showRoadLabels = newValue;
                    }}
                    label="Show road labels"
                    marginBottom={2}
                />
                <Switch
                    value={settingsStore.showDefaultUI}
                    onChange={newValue => {
                        settingsStore.showDefaultUI = newValue;
                    }}
                    label="Show default UI"
                    marginBottom={3}
                />
            </Box>
            <Box flex="none" backgroundColor="white">
                <Box
                    display="flex"
                    paddingY={2}
                    marginX={3}
                    borderTop="thick"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    <SettingsStatus settingsStore={settingsStore} />
                    <Button
                        variant="primary"
                        onClick={() => {
                            settingsStore.showSettings = false;
                        }}
                        style={{border: 'none'}}
                    >
                        Done
                    </Button>
                </Box>
            </Box>
        </FullscreenBox>
    );
};
