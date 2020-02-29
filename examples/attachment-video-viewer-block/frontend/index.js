import React, {useState, useEffect} from 'react';
import {cursor} from '@airtable/blocks';
import {
    Box,
    initializeBlock,
    useLoadable,
    useSettingsButton,
    useViewport,
    useWatchable,
} from '@airtable/blocks/ui';

import {useSettings} from './settings';
import RecordPreview from './RecordPreview';
import SettingsForm from './SettingsForm';

/**
 * This block is remixed from the YoutubePreviewBlock.
 * It adds settings so that you don't have to configure the block in code and switches to uses the
 * React Video Player to play previews from attachments instead of using embedded YouTube video urls.
 */
function AttachmentVideoViewerBlock() {
    const viewport = useViewport();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    useSettingsButton(() => {
        if (!isSettingsVisible) {
            viewport.enterFullscreenIfPossible();
        }
        setIsSettingsVisible(!isSettingsVisible);
    });
    const settingsValidationResult = useSettings();
    useEffect(() => {
        if (!settingsValidationResult.isValid) {
            setIsSettingsVisible(true);
        }
    }, [settingsValidationResult.isValid]);

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
    useLoadable(cursor);

    // Update the selectedRecordId state when the selected record changes.
    useWatchable(cursor, ['selectedRecordIds'], () => {
        if (cursor.selectedRecordIds.length === 0) {
            return;
        }

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

    return (
        <Box display="flex">
            <RecordPreview
                settingsValidationResult={settingsValidationResult}
                selectedRecordId={selectedRecordId}
            />
            {isSettingsVisible && (
                <SettingsForm
                    setIsSettingsVisible={setIsSettingsVisible}
                    settings={settingsValidationResult.settings}
                />
            )}
        </Box>
    );
}

initializeBlock(() => <AttachmentVideoViewerBlock />);
