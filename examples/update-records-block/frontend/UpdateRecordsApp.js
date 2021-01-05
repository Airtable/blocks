import {
    Box,
    Text,
    Button,
    useBase,
    useCursor,
    useLoadable,
    useRecords,
    useWatchable,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

// These values match the recommended template for this example app.
// You can also change them to match your own base, or add Table/FieldPickers to allow the
// user to choose a table and field to update.
const TABLE_NAME = 'Inventory';
const FIELD_NAME = 'In Stock';

// Airtable SDK limit: we can only update 50 records at a time. For more details, see
// https://github.com/Airtable/blocks/tree/blob/packages/sdk/docs/guide_writes.md#size-limits-rate-limits
const MAX_RECORDS_PER_UPDATE = 50;

function UpdateRecordsApp() {
    const base = useBase();
    const cursor = useCursor();

    const tableToUpdate = base.getTableByName(TABLE_NAME);

    const numberField = tableToUpdate.getFieldByName(FIELD_NAME);

    // cursor.selectedRecordIds isn't loaded by default, so we need to load it
    // explicitly with the useLoadable hook. The rest of the code in the
    // component will not run until it has loaded.
    useLoadable(cursor);

    // Re-render the app whenever the selected records change.
    useWatchable(cursor, ['selectedRecordIds']);

    if (cursor.activeTableId !== tableToUpdate.id) {
        return (
            <Container>
                <Text>Switch to the “{tableToUpdate.name}” table to use this app.</Text>
            </Container>
        );
    }

    return (
        <Container>
            <UpdateSelectedRecordsButton
                tableToUpdate={tableToUpdate}
                fieldToUpdate={numberField}
                selectedRecordIds={cursor.selectedRecordIds}
            />
        </Container>
    );
}

// Container element which centers its children.
function Container({children}) {
    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {children}
        </Box>
    );
}

function UpdateSelectedRecordsButton({tableToUpdate, fieldToUpdate, selectedRecordIds}) {
    // Triggers a re-render if records values change. This makes sure the record values are
    // up to date when calculating their new values.
    const records = useRecords(tableToUpdate, {fields: [fieldToUpdate]});

    // Track whether we're currently in the middle of performing an update.
    // We use this to disable the button during an update.
    // We also use this to show the correct number of records being updated on
    // the button: when the update starts, we store the number here. If the user
    // changes their selected records during the update, the number shown on the
    // button will remain accurate.
    const [numRecordsBeingUpdated, setNumRecordsBeingUpdated] = useState(null);

    const isUpdateInProgress = numRecordsBeingUpdated !== null;

    let buttonText;
    const recordsText = `record${selectedRecordIds.length === 1 ? '' : 's'}`;
    if (isUpdateInProgress) {
        buttonText = `Updating ${numRecordsBeingUpdated} ${recordsText}`;
    } else {
        buttonText = `Click to update ${selectedRecordIds.length} ${recordsText}`;
    }

    // Prepare the updates that we are going to perform. (Required to check permissions)
    // We need to get all of the selected records to get the current values of numberField.
    // .filter narrows the list of all records down to just the records with id
    // in selectedRecordIdSet.
    const selectedRecordIdsSet = new Set(selectedRecordIds);
    const recordsToUpdate = records.filter(record => selectedRecordIdsSet.has(record.id));

    const updates = recordsToUpdate.map(record => ({
        id: record.id,
        fields: {
            // Here, we add 1 to the current value, but you could extend this to support
            // different operations.
            // [fieldToUpdate.id] is used to use the value of fieldToUpdate.id as the key
            [fieldToUpdate.id]: record.getCellValue(fieldToUpdate) + 1,
        },
    }));

    // Disable the button if any of these are true:
    // - an update is in progress,
    // - no records are selected,
    // - the user doesn't have permission to perform the update.
    // (Phew!)
    const shouldButtonBeDisabled =
        isUpdateInProgress ||
        selectedRecordIds.length === 0 ||
        !tableToUpdate.hasPermissionToUpdateRecords(updates);

    return (
        <Button
            variant="primary"
            onClick={async function() {
                // Mark the update as started.
                setNumRecordsBeingUpdated(updates.length);

                // Update the records!
                // await is used to wait for all of the updates to finish saving
                // to Airtable servers. This keeps the button disabled until the
                // update is finished.
                await updateRecordsInBatches(tableToUpdate, updates);

                // We're done! Mark the update as finished.
                setNumRecordsBeingUpdated(null);
            }}
            disabled={shouldButtonBeDisabled}
        >
            {buttonText}
        </Button>
    );
}

async function updateRecordsInBatches(table, updates) {
    // Saves the updates in batches of MAX_RECORDS_PER_UPDATE to stay under size
    // limits.
    let i = 0;
    while (i < updates.length) {
        const updateBatch = updates.slice(i, i + MAX_RECORDS_PER_UPDATE);
        // await is used to wait for the update to finish saving to Airtable
        // servers before continuing. This means we'll stay under the rate
        // limit for writes.
        await table.updateRecordsAsync(updateBatch);
        i += MAX_RECORDS_PER_UPDATE;
    }
}

export default UpdateRecordsApp;
