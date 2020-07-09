import React from 'react';
import {cursor, session} from '@airtable/blocks';
import {Box, Text, useRecordById} from '@airtable/blocks/ui';
import {ViewType} from '@airtable/blocks/models';

import FullScreenBox from './FullScreenBox';
import VideoPlayer from './VideoPlayer';

function RecordPreview({settingsValidationResult, selectedRecordId}) {
    const {settings, isValid, message} = settingsValidationResult;
    const {table, startTimeField, endTimeField, attachmentField, captionField} = settings;

    const selectedRecord = useRecordById(table, selectedRecordId ? selectedRecordId : '', {
        fields: [attachmentField, startTimeField, endTimeField, captionField],
    });

    if (!isValid) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    {message}
                </Text>
            </FullScreenBox>
        );
    }

    if (session.currentUser === null) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    This block is not supported in shares.
                </Text>
            </FullScreenBox>
        );
    }

    if (cursor.activeTableId !== table.id) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    Switch to the “{table.name}” table to see previews
                </Text>
            </FullScreenBox>
        );
    }

    if (
        // activeViewId is briefly null when switching views
        cursor.activeViewId === null ||
        // Grid view is required for cursor to have selected records.
        table.getViewById(cursor.activeViewId).type !== ViewType.GRID
    ) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    Switch to a grid view to see previews
                </Text>
            </FullScreenBox>
        );
    }

    // selectedRecord will be null on block initialization, after
    // the user switches table or view, or if the record is deleted
    if (selectedRecord === null) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    Select a record in grid view to see a preview
                </Text>
            </FullScreenBox>
        );
    }

    const attachments = selectedRecord.getCellValue(attachmentField);
    const attachmentUrl = attachments && attachments.length > 0 ? attachments[0].url : null;
    if (!attachmentUrl) {
        return (
            <FullScreenBox padding={3}>
                <Text textAlign="center" padding={1}>
                    No video in the “{attachmentField.name}” field
                </Text>
            </FullScreenBox>
        );
    }

    const startTime = startTimeField ? selectedRecord.getCellValue(startTimeField) : null;
    const endTime = endTimeField ? selectedRecord.getCellValue(endTimeField) : null;
    const caption = captionField ? selectedRecord.getCellValueAsString(captionField) : null;

    return (
        <FullScreenBox backgroundColor="#222">
            <VideoPlayer
                key={selectedRecord.id}
                startTime={startTime}
                endTime={endTime}
                src={attachmentUrl}
            />
            {caption && (
                <Box
                    height="48px"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={2}
                >
                    <Text
                        textColor="white"
                        maxWidth="100%"
                        overflow="hidden"
                        style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {caption}
                    </Text>
                </Box>
            )}
        </FullScreenBox>
    );
}

export default RecordPreview;
