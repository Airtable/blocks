import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Field, RecordQueryResult, Table, View} from '@airtable/blocks/models';
import {
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Heading,
    Label,
    Link,
    SelectButtonsSynced,
    SelectSynced,
    TablePickerSynced,
    Text,
    ViewPickerSynced,
} from '@airtable/blocks/ui';

import {ExportType} from './index';
import {allowedFieldTypes, ConfigKeys, LinkStyle, ChartOrientation, RecordShape} from './settings';

function SettingsForm({setIsSettingsVisible, settingsValidationResult, onExportGraph}) {
    const {settings, isValid} = settingsValidationResult;
    return (
        <Box
            flex="none"
            display="flex"
            flexDirection="column"
            width="300px"
            backgroundColor="white"
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
                        <FormField label="View">
                            <ViewPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.VIEW_ID}
                            />
                        </FormField>
                        <FormField
                            label="Linked record field"
                            description="Must be a self-linked record field"
                        >
                            <FieldPickerSynced
                                table={settings.table}
                                globalConfigKey={ConfigKeys.FIELD_ID}
                                allowedTypes={allowedFieldTypes}
                            />
                        </FormField>
                        <FormField
                            label="Chart orientation"
                            description={`Unlinked records will be ${
                                settings.chartOrientation === ChartOrientation.HORIZONTAL
                                    ? ChartOrientation.VERTICAL
                                    : ChartOrientation.HORIZONTAL
                            }`}
                        >
                            <SelectButtonsSynced
                                options={[
                                    {label: 'Vertical', value: ChartOrientation.VERTICAL},
                                    {label: 'Horizontal', value: ChartOrientation.HORIZONTAL},
                                ]}
                                globalConfigKey={ConfigKeys.CHART_ORIENTATION}
                            />
                        </FormField>
                        <FormField label="Link style">
                            <SelectButtonsSynced
                                options={[
                                    {label: 'Right angles', value: LinkStyle.RIGHT_ANGLES},
                                    {label: 'Straight lines', value: LinkStyle.STRAIGHT_LINES},
                                ]}
                                globalConfigKey={ConfigKeys.LINK_STYLE}
                            />
                        </FormField>
                        <FormField label="Record shape">
                            <SelectSynced
                                options={[
                                    {label: 'Pick a shape...', value: null, disabled: true},
                                    {label: 'Rounded', value: RecordShape.ROUNDED},
                                    {label: 'Rectangle', value: RecordShape.RECTANGLE},
                                    {label: 'Ellipse', value: RecordShape.ELLIPSE},
                                    {label: 'Circle', value: RecordShape.CIRCLE},
                                    {label: 'Diamond', value: RecordShape.DIAMOND},
                                ]}
                                globalConfigKey={ConfigKeys.RECORD_SHAPE}
                            />
                        </FormField>
                        <Box marginBottom={1}>
                            <Text fontWeight="strong" textColor="light">
                                Record color
                            </Text>
                            <Text variant="paragraph" textColor="light">
                                Record coloring is{' '}
                                <Link
                                    href="https://support.airtable.com/hc/en-us/articles/115013883908-Record-coloring-overview"
                                    target="_blank"
                                >
                                    based on the view
                                </Link>
                            </Text>
                        </Box>
                    </Fragment>
                )}
            </Box>
            <Box
                flex="none"
                display="flex"
                justifyContent="space-between"
                paddingY={3}
                marginX={3}
                borderTop="thick"
            >
                <Box display="flex" alignItems="center">
                    <Label marginRight={2} marginBottom={0}>
                        Export
                    </Label>
                    <Button
                        disabled={!isValid}
                        onClick={() => onExportGraph(ExportType.SVG)}
                        marginRight={2}
                    >
                        SVG
                    </Button>
                    <Button disabled={!isValid} onClick={() => onExportGraph(ExportType.PNG)}>
                        PNG
                    </Button>
                </Box>
                <Button variant="primary" onClick={() => setIsSettingsVisible(false)}>
                    Done
                </Button>
            </Box>
        </Box>
    );
}

SettingsForm.propTypes = {
    setIsSettingsVisible: PropTypes.func.isRequired,
    onExportGraph: PropTypes.func.isRequired,
    settingsValidationResult: PropTypes.shape({
        settings: PropTypes.shape({
            table: PropTypes.instanceOf(Table),
            view: PropTypes.instanceOf(View),
            field: PropTypes.instanceOf(Field),
            queryResult: PropTypes.instanceOf(RecordQueryResult),
            chartOrientation: PropTypes.oneOf(Object.values(ChartOrientation)).isRequired,
            linkStyle: PropTypes.oneOf(Object.values(LinkStyle)).isRequired,
            recordShape: PropTypes.oneOf(Object.values(RecordShape)).isRequired,
        }).isRequired,
        isValid: PropTypes.bool.isRequired,
    }),
};

export default SettingsForm;
