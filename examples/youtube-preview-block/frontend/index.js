import {
    initializeBlock,
    useBase,
    useRecords,
    useLoadable,
    useWatchable,
    Box,
    Text,
} from '@airtable/blocks/ui';
import {cursor} from '@airtable/blocks';
import React, {useState} from 'react';
import {ViewType} from '@airtable/blocks/models';

// How this block chooses a video to show:
//
// - The user opens the table indicated by TABLE_NAME (below).
// - The user selects a row in grid view.
// - The block looks in the field indicated by FIELD_NAME.
//   This field contains a YouTube video URL
//   (e.g. https://www.youtube.com/watch?v=KYz2wyBy3kc)
// - The block extracts a video ID from the this field of the selected
//   record.
// - The block constructs an embed URL from this video ID and inserts
//   this URL into the YouTube embed code.

// These values match the recommended template for this example block.
// You can also change them to match your own base.
const TABLE_NAME = 'Movies';
const FIELD_NAME = 'Trailer';

function YouTubePreviewBlock() {
    // Caches the currently selected record in state.  If the user
    // selects a record and a video appears, and then the user
    // de-selects the record (but does not select another), the video
    // will remain. This is useful when, for example, the user resizes
    // the blocks pane.
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    // cursor.selectedRecordIds isn't loaded by default, so we need to
    // load it explicitly with the useLoadable hook.  The rest of the
    // code in the component will not run until
    // cursor.selectedRecordIds has loaded.
    useLoadable(cursor, ['selectedRecordIds']);

    // Update the selectedRecordId state when the selected record
    // changes.
    useWatchable(cursor, ['selectedRecordIds'], () => {
        // If the update was triggered by a record being de-selected,
        // the current selectedRecordId will be retained.  This is
        // what enables the caching described above.
        if (cursor.selectedRecordIds.length === 0) {
            return;
        }

        // There might be multiple selected records. We'll use the
        // first one.
        setSelectedRecordId(cursor.selectedRecordIds[0]);
    });

    // This watch deletes the cached selectedRecordId when the user
    // moves to a new table or view.  This prevents the following
    // scenario: User selects a record that contains a video. The
    // video appears. User switches to a different table. The video
    // disappears. The user switches back to the original table.
    // Weirdly, the previously viewed video reappears, even though no
    // record is selected.
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null);
    });

    return <RecordPreview selectedRecordId={selectedRecordId} />;
}

// Shows a video, or a message about what the user should do to see a
// video.
function RecordPreview({selectedRecordId}) {
    const base = useBase();

    const table = base.getTableByName(TABLE_NAME);

    const urlField = table.getFieldByName(FIELD_NAME);

    // We use a queryResult instead of the table with useRecords since
    // we want to rely on some features of queryResult later on
    // (queryResult.hasRecord and queryResult.getRecordById)
    // To avoid loading unnecessary data, we pass options to only load
    // cell values for the url field.
    const queryResult = table.selectRecords({fields: [urlField]});

    // Triggers a re-render if records change. Video URL cell value
    // might have changed, or record might have been deleted.
    useRecords(queryResult);

    // Triggers a re-render if the user switches table or view.
    // RecordPreview may now need to render a video, or render no
    // video at all.
    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    // selectedRecordId will be null on block initialization and after
    // the user switches table or view.
    if (selectedRecordId === null) {
        return (
            <Container>
                <Text>Select a record to see a preview.</Text>
            </Container>
        );
    }

    if (cursor.activeTableId !== table.id) {
        return (
            <Container>
                <Text>Switch to the &quot;{table.name}&quot; table to see previews.</Text>
            </Container>
        );
    }

    if (
        cursor.activeViewId === null || // activeViewId is briefly null when switching views
        table.getViewById(cursor.activeViewId).type !== ViewType.GRID
    ) {
        return (
            <Container>
                <Text>Switch to a grid view to see previews.</Text>
            </Container>
        );
    }

    // If the selectedRecordId is not in queryResult, the record
    // corresponding to selectedRecordId must have been deleted.
    if (!queryResult.hasRecord(selectedRecordId)) {
        return (
            <Container>
                <Text>Select a record to see a preview.</Text>
            </Container>
        );
    }

    const previewUrl = getPreviewUrlForRecord(
        queryResult.getRecordById(selectedRecordId),
        urlField,
    );

    // In this case, the FIELD_NAME field of the currently selected
    // record either contains no URL, or contains a URL that cannot be
    // resolved to a YouTube video.
    if (!previewUrl) {
        return (
            <Container>
                <Text>No video</Text>
            </Container>
        );
    }

    return (
        <Container>
            <iframe
                // Using `key=previewUrl` will immediately unmount the
                // old iframe when we're switching to a new
                // video. Otherwise, the old iframe would be reused,
                // and the old video would stay onscreen while the new
                // one was loading, which would be a confusing user
                // experience.
                key={previewUrl}
                style={{flex: 'auto', width: '100%'}}
                src={previewUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </Container>
    );
}

// Container element which takes up the full viewport and centers its
// children.
function Container({children}) {
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            {children}
        </Box>
    );
}

function getPreviewUrlForRecord(record, field) {
    // Using getCellValueAsString guarantees we get a string back.  If
    // we use getCellValue, we might get back numbers, booleans, or
    // arrays depending on the field type.
    const url = record.getCellValueAsString(field);

    if (!url) {
        return null;
    }

    // Try to extract the video ID from the URL using a regular
    // expression.
    const match = url.match(/v=([\w-]+)(&|$)/);

    if (!match) {
        return null;
    }

    const previewUrl = `https://www.youtube.com/embed/${match[1]}`;
    return previewUrl;
}

initializeBlock(() => <YouTubePreviewBlock />);
