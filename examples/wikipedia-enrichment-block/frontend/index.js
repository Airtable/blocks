import {initializeBlock, useBase, useRecords, Loader, Button, Box} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';

// These values match the base for this example: https://airtable.com/shrBJH7LLUMD6ONIf
const TABLE_NAME = 'Articles';
const TITLE_FIELD_NAME = 'Title';
const EXTRACT_FIELD_NAME = 'Extract';
const IMAGE_FIELD_NAME = 'Image';

// Airtable SDK limit: we can only update 50 records at a time. For more details, see
// https://github.com/Airtable/blocks/blob/master/packages/sdk/docs/guide_writes.md#size-limits--rate-limits
const MAX_RECORDS_PER_UPDATE = 50;

// The API endpoint we're going to hit. For more details, see
// https://en.wikipedia.org/api/rest_v1/#/Page%20content/get_page_summary__title_
const API_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary';

function WikipediaEnrichmentApp() {
    const base = useBase();

    const table = base.getTableByName(TABLE_NAME);
    const titleField = table.getFieldByName(TITLE_FIELD_NAME);

    // load the records ready to be updated
    // we only need to load the word field - the others don't get read, only written to.
    const records = useRecords(table, {fields: [titleField]});

    // keep track of whether we have up update currently in progress - if there is, we want to hide
    // the update button so you can't have two updates running at once.
    const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);

    // check whether we have permission to update our records or not. Any time we do a permissions
    // check like this, we can pass in undefined for values we don't yet know. Here, as we want to
    // make sure we can update the summary and image fields, we make sure to include them even
    // though we don't know the values we want to use for them yet.
    const permissionCheck = table.checkPermissionsForUpdateRecord(undefined, {
        [EXTRACT_FIELD_NAME]: undefined,
        [IMAGE_FIELD_NAME]: undefined,
    });

    async function onButtonClick() {
        setIsUpdateInProgress(true);
        const recordUpdates = await getExtractAndImageUpdatesAsync(table, titleField, records);
        await updateRecordsInBatchesAsync(table, recordUpdates);
        setIsUpdateInProgress(false);
    }

    return (
        <Box
            // center the button/loading spinner horizontally and vertically.
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            {isUpdateInProgress ? (
                <Loader />
            ) : (
                <Fragment>
                    <Button
                        variant="primary"
                        onClick={onButtonClick}
                        disabled={!permissionCheck.hasPermission}
                        marginBottom={3}
                    >
                        Update summaries and images
                    </Button>
                    {!permissionCheck.hasPermission &&
                        // when we don't have permission to perform the update, we want to tell the
                        // user why. `reasonDisplayString` is a human-readable string that will
                        // explain why the button is disabled.
                        permissionCheck.reasonDisplayString}
                </Fragment>
            )}
        </Box>
    );
}

async function getExtractAndImageUpdatesAsync(table, titleField, records) {
    const recordUpdates = [];
    for (const record of records) {
        // for each record, we take the article title and make an API request:
        const articleTitle = record.getCellValueAsString(titleField);
        const requestUrl = `${API_ENDPOINT}/${encodeURIComponent(articleTitle)}?redirect=true`;
        const response = await fetch(requestUrl, {cors: true});
        const pageSummary = await response.json();

        // then, we can use the result of that API request to decide how we want to update our
        // record. To update an attachment, you need an array of objects with a `url` property.
        recordUpdates.push({
            id: record.id,
            fields: {
                [EXTRACT_FIELD_NAME]: pageSummary.extract,
                [IMAGE_FIELD_NAME]: pageSummary.originalimage
                    ? [{url: pageSummary.originalimage.source}]
                    : undefined,
            },
        });

        // out of respect for the wikipedia API, a free public resource, we wait a short time
        // between making requests. If you change this example to use a different API, you might
        // not need this.
        await delayAsync(50);
    }
    return recordUpdates;
}

async function updateRecordsInBatchesAsync(table, recordUpdates) {
    // Fetches & saves the updates in batches of MAX_RECORDS_PER_UPDATE to stay under size limits.
    let i = 0;
    while (i < recordUpdates.length) {
        const updateBatch = recordUpdates.slice(i, i + MAX_RECORDS_PER_UPDATE);
        // await is used to wait for the update to finish saving to Airtable servers before
        // continuing. This means we'll stay under the rate limit for writes.
        await table.updateRecordsAsync(updateBatch);
        i += MAX_RECORDS_PER_UPDATE;
    }
}

function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

initializeBlock(() => <WikipediaEnrichmentApp />);
