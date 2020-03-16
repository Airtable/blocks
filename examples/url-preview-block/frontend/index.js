import React, {useState} from 'react';
import {cursor} from '@airtable/blocks';
import {ViewType} from '@airtable/blocks/models';
import {
    initializeBlock,
    useBase,
    useRecordById,
    useLoadable,
    useWatchable,
    Box,
    Text,
    TextButton,
    Dialog,
    Link,
    Heading,
} from '@airtable/blocks/ui';

// How this block chooses a preview to show:
//
// - The user selects a row in grid view.
// - The block looks in the selected field for a supported URL
//   (e.g. https://www.youtube.com/watch?v=KYz2wyBy3kc)
// - The block uses this URL to construct an embed URL and inserts this URL into an iframe.

function UrlPreviewBlock() {
    // Caches the currently selected record and field in state. If the user
    // selects a record and a preview appears, and then the user de-selects the
    // record (but does not select another), the preview will remain. This is
    // useful when, for example, the user resizes the blocks pane.
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    // cursor.selectedRecordIds and selectedFieldIds aren't loaded by default,
    // so we need to load them explicitly with the useLoadable hook. The rest of
    // the code in the component will not run until they are loaded.
    useLoadable(cursor);

    // Update the selectedRecordId and selectedFieldId state when the selected
    // record or field change.
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds'], () => {
        // If the update was triggered by a record being de-selected,
        // the current selectedRecordId will be retained.  This is
        // what enables the caching described above.
        if (cursor.selectedRecordIds.length > 0) {
            // There might be multiple selected records. We'll use the first
            // one.
            setSelectedRecordId(cursor.selectedRecordIds[0]);
        }
        if (cursor.selectedFieldIds.length > 0) {
            // There might be multiple selected fields. We'll use the first
            // one.
            setSelectedFieldId(cursor.selectedFieldIds[0]);
        }
    });

    // This watch deletes the cached selectedRecordId and selectedFieldId when
    // the user moves to a new table or view. This prevents the following
    // scenario: User selects a record that contains a preview url. The preview appears.
    // User switches to a different table. The preview disappears. The user
    // switches back to the original table. Weirdly, the previously viewed preview
    // reappears, even though no record is selected.
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null);
        setSelectedFieldId(null);
    });

    const base = useBase();
    const table = base.getTableByIdIfExists(cursor.activeTableId);

    // table is briefly null when switching to a newly created table.
    if (!table) {
        return null;
    }

    return (
        <RecordPreview
            table={table}
            selectedRecordId={selectedRecordId}
            selectedFieldId={selectedFieldId}
        />
    );
}

// Shows a preview, or a message about what the user should do to see a preview.
function RecordPreview({table, selectedRecordId, selectedFieldId}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // We use getFieldByIdIfExists because the field might be deleted.
    const selectedField = selectedFieldId ? table.getFieldByIdIfExists(selectedFieldId) : null;

    // Triggers a re-render if the record changes. Preview URL cell value
    // might have changed, or record might have been deleted.
    const selectedRecord = useRecordById(table, selectedRecordId ? selectedRecordId : '', {
        fields: [selectedField],
    });

    // Triggers a re-render if the user switches table or view.
    // RecordPreview may now need to render a preview, or render nothing at all.
    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    // This button is re-used in two states so it's pulled out in a constant here.
    const viewSupportedURLsButton = (
        <TextButton size="small" marginTop={3} onClick={() => setIsDialogOpen(true)}>
            View supported URLs
        </TextButton>
    );

    let content;
    if (
        cursor.activeViewId === null || // activeViewId is briefly null when switching views
        table.getViewById(cursor.activeViewId).type !== ViewType.GRID
    ) {
        content = (
            <Container>
                <Text>Switch to a grid view to see previews</Text>
            </Container>
        );
    } else if (
        // selectedRecord will be null on block initialization, after
        // the user switches table or view, or if it was deleted.
        selectedRecord === null ||
        // The selected field may have been deleted.
        selectedField === null
    ) {
        content = (
            <Container>
                <Text>Select a cell to see a preview</Text>
                {viewSupportedURLsButton}
            </Container>
        );
    } else {
        // Using getCellValueAsString guarantees we get a string back.  If
        // we use getCellValue, we might get back numbers, booleans, or
        // arrays depending on the field type.
        const previewUrl = getPreviewUrlForCellValue(
            selectedRecord.getCellValueAsString(selectedField),
        );

        // In this case, the FIELD_NAME field of the currently selected
        // record either contains no URL, or contains a URL that cannot be
        // resolved to a supported preview.
        if (!previewUrl) {
            content = (
                <Container>
                    <Text>No preview</Text>
                    {viewSupportedURLsButton}
                </Container>
            );
        } else {
            content = (
                <Container>
                    <iframe
                        // Using `key=previewUrl` will immediately unmount the
                        // old iframe when we're switching to a new
                        // preview. Otherwise, the old iframe would be reused,
                        // and the old preview would stay onscreen while the new
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
    }

    return (
        <React.Fragment>
            {content}
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} maxWidth={400}>
                    <Dialog.CloseButton />
                    <Heading size="small">Supported services</Heading>
                    <Text marginTop={2}>Previews are supported for these services:</Text>
                    <Text marginTop={2}>
                        <Link
                            href="https://support.airtable.com/hc/en-us/articles/205752117-Creating-a-base-share-link-or-a-view-share-link"
                            target="_blank"
                        >
                            Airtable share links
                        </Link>
                        , Figma, SoundCloud, Spotify, Vimeo, YouTube
                    </Text>
                    <Link
                        marginTop={2}
                        href="https://airtable.com/shrQSwIety6rqfJZX"
                        target="_blank"
                    >
                        Request a new service
                    </Link>
                </Dialog>
            )}
        </React.Fragment>
    );
}

// Container element which takes up the full viewport and centers its children.
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

function getPreviewUrlForCellValue(url) {
    if (!url) {
        return null;
    }

    // Try to extract the preview URL from the URL using regular expression
    // based helper functions for each service we support.
    const airtablePreviewUrl = getAirtablePreviewUrl(url);
    if (airtablePreviewUrl) {
        return airtablePreviewUrl;
    }

    const youtubePreviewUrl = getYoutubePreviewUrl(url);
    if (youtubePreviewUrl) {
        return youtubePreviewUrl;
    }

    const vimeoPreviewUrl = getVimeoPreviewUrl(url);
    if (vimeoPreviewUrl) {
        return vimeoPreviewUrl;
    }

    const spotifyPreviewUrl = getSpotifyPreviewUrl(url);
    if (spotifyPreviewUrl) {
        return spotifyPreviewUrl;
    }

    const soundcloudPreviewUrl = getSoundcloudPreviewUrl(url);
    if (soundcloudPreviewUrl) {
        return soundcloudPreviewUrl;
    }

    const figmaPreviewUrl = getFigmaPreviewUrl(url);
    if (figmaPreviewUrl) {
        return figmaPreviewUrl;
    }

    // URL didn't match any supported services, so return null
    return null;
}

function getAirtablePreviewUrl(url) {
    const match = url.match(/airtable\.com(\/embed)?\/(shr[A-Za-z0-9]{14}.*)/);
    if (match) {
        return `https://airtable.com/embed/${match[2]}`;
    }

    // URL isn't for an Airtable share
    return null;
}

function getYoutubePreviewUrl(url) {
    // Standard youtube urls, e.g. https://www.youtube.com/watch?v=KYz2wyBy3kc
    let match = url.match(/youtube\.com\/.*v=([\w-]+)(&|$)/);

    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    // Shortened youtube urls, e.g. https://youtu.be/KYz2wyBy3kc
    match = url.match(/youtu\.be\/([\w-]+)(\?|$)/);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    // Youtube playlist urls, e.g. youtube.com/playlist?list=KYz2wyBy3kc
    match = url.match(/youtube\.com\/playlist\?.*list=([\w-]+)(&|$)/);
    if (match) {
        return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
    }

    // URL isn't for a youtube video
    return null;
}

function getVimeoPreviewUrl(url) {
    const match = url.match(/vimeo\.com\/([\w-]+)(\?|$)/);
    if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
    }

    // URL isn't for a Vimeo video
    return null;
}

function getSpotifyPreviewUrl(url) {
    // Spotify URLs for song, album, artist, playlist all have similar formats
    let match = url.match(/spotify\.com\/(track|album|artist|playlist)\/([\w-]+)(\?|$)/);
    if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }

    // Spotify URLs for podcasts and episodes have a different format
    match = url.match(/spotify\.com\/(show|episode)\/([\w-]+)(\?|$)/);
    if (match) {
        return `https://open.spotify.com/embed-podcast/${match[1]}/${match[2]}`;
    }

    // URL isn't for Spotify
    return null;
}

function getSoundcloudPreviewUrl(url) {
    // Soundcloud url's don't have a clear format, so just check if they are from soundcloud and try
    // to embed them.
    if (url.match(/soundcloud\.com/)) {
        return `https://w.soundcloud.com/player/?url=${url}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    }

    // URL isn't for Soundcloud
    return null;
}

function getFigmaPreviewUrl(url) {
    // Figma has a regex they recommend matching against
    if (
        url.match(
            /(https:\/\/([\w.-]+\.)?)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,
        )
    ) {
        return `https://www.figma.com/embed?embed_host=astra&url=${url}`;
    }

    // URL isn't for Figma
    return null;
}

initializeBlock(() => <UrlPreviewBlock />);
