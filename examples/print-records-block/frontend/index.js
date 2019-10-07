import {
    initializeBlock,
    Button,
    useBase,
    useRecords,
    useGlobalConfig,
    Box,
    CellRenderer,
    Heading,
    ViewPickerSynced,
} from '@airtable/blocks/ui';
import React from 'react';
import printWithoutElementsWithClass from './print_without_elements_with_class';

const GlobalConfigKeys = {
    VIEW_ID: 'viewId',
};

function PrintRecordsBlock() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    // We want to render the list of records in this table.
    const table = base.getTableByName('Collections');

    // The view ID is stored in globalConfig using ViewPickerSynced.
    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);

    // The view may have been deleted, so we use getViewByIdIfExists
    // instead of getViewById. getViewByIdIfExists will return null
    // if the view doesn't exist.
    const view = table.getViewByIdIfExists(viewId);

    return (
        <div>
            <Toolbar table={table} />
            <Box padding={3}>
                <Report view={view} />
            </Box>
        </div>
    );
}

// The toolbar contains the view picker and print button.
function Toolbar({table}) {
    return (
        <Box className="print-hide" padding={2} borderBottom="thick" display="flex">
            <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} />
            <Button
                onClick={() => {
                    // Inject CSS to hide elements with the "print-hide" class name
                    // when the block gets printed. This lets us hide the toolbar from
                    // the print output.
                    printWithoutElementsWithClass('print-hide');
                }}
                marginLeft={2}
            >
                Print
            </Button>
        </Box>
    );
}

// Renders a <Record> for each of the records in the specified view.
function Report({view}) {
    const records = useRecords(view ? view.selectRecords() : null);

    if (!view) {
        return <div>Pick a view</div>;
    }

    return (
        <div>
            {records.map(record => {
                return <Record key={record.id} record={record} />;
            })}
        </div>
    );
}

// Renders a single record from the Collections table with each
// of its linked Artists records.
function Record({record}) {
    const base = useBase();

    // Each record in the "Collections" table is linked to records
    // in the "Artists" table. We want to show the Artists for
    // each collection.
    const linkedTable = base.getTableByName('Artists');
    const linkedRecords = useRecords(
        record.selectLinkedRecordsFromCell('Artists', {
            // Keep the linked records sorted by their primary field.
            sorts: [{field: linkedTable.primaryField, direction: 'asc'}],
        }),
    );

    return (
        <Box paddingBottom={3}>
            <Heading>{record.primaryCellValueAsString}</Heading>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <tbody>
                    {linkedRecords.map(linkedRecord => {
                        // Distinguish artists on display by putting
                        // their names in green.  An example of
                        // dynamic styling based on cell content
                        const isArtistOnDisplay = linkedRecord.getCellValue('On Display?');
                        const artistNameColor = isArtistOnDisplay ? 'green' : 'black';
                        return (
                            <tr key={linkedRecord.id} style={{borderBottom: '1px solid #ddd'}}>
                                <td style={{width: '40%', color: artistNameColor}}>
                                    {linkedRecord.primaryCellValueAsString}
                                </td>
                                <td>
                                    <CellRenderer
                                        record={linkedRecord}
                                        field={linkedTable.getFieldByName('Attachments')}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Box>
    );
}

initializeBlock(() => <PrintRecordsBlock />);
