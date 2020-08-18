import {cursor} from '@airtable/blocks';
import {ViewType} from '@airtable/blocks/models';
import {
    initializeBlock,
    Box,
    Button,
    Dialog,
    Heading,
    Text,
    TextButton,
    Loader,
    useSettingsButton,
    useWatchable,
    useLoadable,
    useRecordById,
} from '@airtable/blocks/ui';
import {withGoogleMap, StreetViewPanorama, withScriptjs, GoogleMap} from 'react-google-maps';
import React, {useEffect, useRef, useState} from 'react';
import hash from 'object-hash';

import FullscreenBox from './FullscreenBox';
import {useSettingsStore} from './useSettingsStore';
import {useLocationRequest} from './useLocationRequest';
import {SettingsView} from './SettingsView';
import {getGoogle} from './getGoogle';
import {useGeocode} from './useGeocode';

/**
 * @typedef StreetViewState
 * @property {string} address
 * @property {{lat: number, lng: number}} position
 * @property {{heading: number, pitch: number, zoom: number}} pov
 */

/**
 * @typedef StreetViewStateChange
 * @property {StreetViewState} state
 * @property {{ok: boolean, unknownError: boolean, zeroResults: boolean}} status
 */

/**
 * @param {object} props
 * @param {string} props.address
 * @param {{lat: number, lng: number}} props.position
 * @param {StreetViewState} props.streetViewState
 * @param {(newStreetViewState: StreetViewStateChange) => void} props.onStreetViewStateChange
 * @param {import('react-google-maps').StreetViewPanoramaProps['options']} props.streetViewOptions
 */
const _RecordStreetView = props => {
    let {
        address,
        position,
        pov,
        streetViewState,
        onStreetViewStateChange,
        streetViewOptions,
    } = props;
    if (streetViewState && streetViewState.position) position = streetViewState.position;
    if (streetViewState && streetViewState.pov) pov = streetViewState.pov;

    const googleMapRef = useRef(/** @type {import('react-google-maps').GoogleMap} */ (null));
    const {pano} = useLocationRequest(position, address);

    const _onStreetViewStateChange = () => {
        if (!onStreetViewStateChange) return;
        const streetView = googleMapRef.current.getStreetView();
        const status = streetView.getStatus();
        const {OK, UNKNOWN_ERROR, ZERO_RESULTS} = getGoogle(window).maps.StreetViewStatus;
        const initialPayload = {
            state: {
                position,
                pov,
            },
            status: {
                ok: true,
                unknownError: false,
                zeroResults: false,
            },
        };

        const hashedInitialPayload = hash(initialPayload);

        if (status === OK) {
            initialPayload.state.position = streetView.getPosition().toJSON();
            initialPayload.state.pov = streetView.getPov();
        }

        if (status === UNKNOWN_ERROR || status === ZERO_RESULTS) {
            initialPayload.status.ok = false;
            initialPayload.status.unknownError = status === UNKNOWN_ERROR;
            initialPayload.status.zeroResults = status === ZERO_RESULTS;
        }

        // Call onStreetViewStateChange() only if something actually changed.
        if (hashedInitialPayload !== hash(initialPayload)) {
            onStreetViewStateChange(initialPayload);
        }
    };

    if (pano) {
        return (
            <GoogleMap defaultZoom={8} defaultCenter={position} ref={googleMapRef}>
                <StreetViewPanorama
                    defaultPano={pano}
                    defaultPosition={position}
                    defaultPov={pov}
                    visible
                    onPanoChanged={_onStreetViewStateChange}
                    onPositionChanged={_onStreetViewStateChange}
                    onPovChanged={_onStreetViewStateChange}
                    onStatusChanged={_onStreetViewStateChange}
                    options={streetViewOptions}
                />
            </GoogleMap>
        );
    }
    return null;
};

const RecordStreetView = withGoogleMap(_RecordStreetView);

const RecordNotOk = ({address, status}) => {
    let text;
    if (status && status.zeroResults) {
        text = 'Cannot find a street view for:';
    } else if (status && status.unknownError) {
        text = 'Received an unknown error while looking for a street view for:';
    }

    return (
        <FullscreenBox shouldCenterContent={true}>
            <Text>{text}</Text>
            <Text>{address}</Text>
        </FullscreenBox>
    );
};

const RecordGeocodeStreetView = props => {
    const {address} = props;
    const loc = useGeocode(address);

    if (loc && loc.lat && loc.lng) {
        return <RecordStreetView position={loc} {...props} />;
    } else if (loc && loc.locationNotFound) {
        return (
            <FullscreenBox shouldCenterContent={true}>
                <Text width="100%" textAlign="center">
                    Could not find a location from:
                </Text>
                <Text width="100%" textAlign="center">
                    {address}
                </Text>
            </FullscreenBox>
        );
    } else {
        return (
            <FullscreenBox shouldCenterContent={true}>
                <Loader />
            </FullscreenBox>
        );
    }
};

/**
 * @param {import('react').ComponentProps<RecordStreetView> & {status: StreetViewStateChange['status']}} props
 */
const RecordStreetViewWrapper = props => {
    const {streetViewState, status} = props;

    if (streetViewState && streetViewState.position) {
        return <RecordStreetView {...props} />;
    } else if (status && (status.zeroResults || status.unknownError)) {
        return <RecordNotOk {...props} />;
    } else {
        return <RecordGeocodeStreetView {...props} />;
    }
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 * @param {import('@airtable/blocks/dist/types/src/models/record').default} props.record
 */
const MainRecord = ({settings, record}) => {
    const pendingCacheUpdate = useRef(null);
    const {
        cache,
        cacheField,
        isAllowedToOverwriteNonCacheValues,
        locationField,
        showDefaultUI,
        showRoadLabels,
    } = settings;

    // This trickery prevents the street view from loading/rendering twice
    // when there is no cached geocode. Here's what would happen if we didn't do this:
    //
    // No geocode? Use the address to look it up and render the street view.
    // Next we cache that value, but caching that value requires writing to the table.
    // Writing to the table will cause a re-render because the field is is being
    // watched for changes by useRecordById:
    //
    // "A hook for working with a single record. Automatically handles loading data and
    // updating your component when the record's cell values etc. change."
    //
    // So instead of writing to the cache field in the onStreetViewStateChange
    // handler below, we stash the values away until the user does anything that would
    // cause `MainRecord` to be re-rendered.
    //
    useEffect(() => {
        if (pendingCacheUpdate.current) {
            cache.setAsync(pendingCacheUpdate.current.record, pendingCacheUpdate.current.state);
            pendingCacheUpdate.current = null;
        }
    }, [pendingCacheUpdate.current, cache]);

    let streetViewState = cache.get(record);
    let locationFieldContents = record.getCellValueAsString(locationField).trim();
    let cacheFieldContents = record.getCellValueAsString(cacheField).trim();
    let isAboutToOverwriteNonCacheValues = false;

    // There might be something in the cache field that isn't
    // geocache data!
    try {
        // If the decoded cache value is JSON parsable,
        // then it might be our cache data.
        const decoded = cache.decode(cacheFieldContents);

        // If there isn't a position and pov property,
        // then this definitely isn't our cache data and
        // we need to signal that to the user.
        if (decoded && typeof decoded.position !== 'object' && typeof decoded.pov !== 'object') {
            throw decoded;
        }
    } catch (error) {
        void error;
        isAboutToOverwriteNonCacheValues = true;
    }

    if (isAboutToOverwriteNonCacheValues && !isAllowedToOverwriteNonCacheValues) {
        return (
            <Dialog width="320px">
                <Heading>Overwrite the contents of the cache field?</Heading>
                <Text variant="paragraph">
                    The contents of the cache field is not recognized. Are you sure you want to
                    overwrite it with geocode cache data?
                </Text>
                <Button
                    onClick={() => {
                        settings.cacheField = null;
                    }}
                >
                    Choose a new cache field
                </Button>
                <Button
                    onClick={() => {
                        settings.isAllowedToOverwriteNonCacheValues = true;
                    }}
                >
                    Continue
                </Button>
            </Dialog>
        );
    }

    /** @type {(change: StreetViewStateChange) => void} */
    let onStreetViewStateChange = ({state, status}) => {
        let mustUpdateCache = status.ok;

        if (streetViewState) {
            // If there is an existing street view state, and it
            // matches the new street view state, then we won't bother
            // updating the cache;
            mustUpdateCache = mustUpdateCache && hash(streetViewState) !== hash(state);
        }

        if (isAboutToOverwriteNonCacheValues) {
            // If the user has selected a field for use as a cache,
            // but that field already has contents in it, and those
            // contents do not appear to be encoded cache data,
            // BUT the user has explicitly agreed to allow overwriting
            // that data;
            mustUpdateCache = mustUpdateCache && isAllowedToOverwriteNonCacheValues;
        }

        if (mustUpdateCache) {
            pendingCacheUpdate.current = {record, state};
        }
    };

    if (!locationFieldContents.trim()) {
        return (
            <FullscreenBox shouldCenterContent={true}>
                <Text width="100%" textAlign="center">
                    Select a non-empty record from the &quot;{locationField.name}&quot; field.
                </Text>
            </FullscreenBox>
        );
    }

    const disableDefaultUI = !showDefaultUI;
    const enableCloseButton = false;
    const streetViewOptions = {
        disableDefaultUI,
        enableCloseButton,
        showRoadLabels,
    };

    return (
        <RecordStreetViewWrapper
            key={record.id}
            containerElement={<FullscreenBox />}
            mapElement={<FullscreenBox className="mapRoot" />}
            address={locationFieldContents}
            streetViewState={streetViewState}
            streetViewOptions={streetViewOptions}
            onStreetViewStateChange={onStreetViewStateChange}
        />
    );
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
const MainConfigured = ({settings}) => {
    const {fields, locationFieldId, locationField, table} = settings;
    const cursorKeys = ['selectedRecordIds', 'selectedFieldIds', 'activeTableId', 'activeViewId'];

    // Caches the currently selected record and field in state. If the user
    // selects a record and a street view appears, and then the user de-selects the
    // record (but does not select another), the street view will remain. This is
    // useful when, for example, the user resizes the blocks pane.
    const selectedIdDefault = {selectedRecordId: '', selectedFieldId: ''};
    const [{selectedRecordId, selectedFieldId}, setSelectedIds] = useState(selectedIdDefault);

    useLoadable(cursor);
    useWatchable(cursor, cursorKeys, () => {
        // If the update was triggered by a record being de-selected,
        // the current selectedRecordId will be retained. This is
        // what enables the caching described above.
        //
        const selectedRecordId =
            cursor.selectedRecordIds.length > 0 ? cursor.selectedRecordIds[0] : '';
        const selectedFieldId =
            cursor.selectedFieldIds.length > 0 ? cursor.selectedFieldIds[0] : '';

        setSelectedIds({selectedRecordId, selectedFieldId});

        // Additional Notes:
        //
        // When the user moves to a new table or view, there will be no selectedRecordIds
        // or selectedFieldIds, so we must delete the cached selectedRecordId and selectedFieldId.
        // This prevents the following scenario: User selects a record that contains a
        // street view address. The street view appears. User switches to a different table.
        // The street view disappears. The user switches back to the original table.
        // Weirdly, the previously viewed street view reappears, even though no record is selected.
        //
    });

    const record = useRecordById(table, selectedRecordId, {fields});

    let message = '';
    let mustShowSettingsButton = false;

    // Prevent this block from rendering a street view when the active table is not
    // the table the author selected in settings.
    if (cursor.activeTableId !== table.id && !(record && record.parentTable.id === table.id)) {
        message = `Switch to the “${table.name}” table to see street views.`;
        mustShowSettingsButton = true;
    } else if (
        // activeViewId is briefly null when switching views
        record === null &&
        (cursor.activeViewId === null ||
            table.getViewById(cursor.activeViewId).type !== ViewType.GRID)
    ) {
        message = 'Switch to a grid view to see street views.';
    } else if (
        // record will be null on block initialization, after
        // the user switches table or view, or if it was deleted.
        record === null ||
        // The location field may have been deleted.
        locationField === null
    ) {
        message = 'Select a cell to see a street view.';
    } else if (selectedFieldId !== locationFieldId) {
        // Prevent this block from rendering a street view when the selected cell is not
        // in the field that the author selected in settings.
        message = `Select a cell in the “${locationField.name}” field to see a street view.`;
        mustShowSettingsButton = true;
    }

    if (message) {
        return (
            <FullscreenBox shouldCenterContent={true}>
                <Text paddingX={3}>{message}</Text>
                {mustShowSettingsButton ? (
                    <TextButton
                        size="small"
                        marginTop={3}
                        onClick={() => {
                            settings.showSettings = true;
                        }}
                    >
                        Settings
                    </TextButton>
                ) : null}
            </FullscreenBox>
        );
    }

    return <MainRecord settings={settings} record={record} />;
};

const _LoadMapsScript = ({children}) => children;

const LoadMapsScript = withScriptjs(_LoadMapsScript);

let Main = () => {
    const settings = useSettingsStore();
    useSettingsButton(() => {
        settings.showSettings = !settings.showSettings;
    });

    const loadingElement = (
        <FullscreenBox shouldCenterContent={true}>
            <Loader />
        </FullscreenBox>
    );

    useEffect(() => {
        if (!settings.validated.isValid) {
            settings.showSettings = true;
        }
    }, [settings.validated.isValid, settings.showSettings]);

    const mustShowSettingsView = settings.showSettings || !settings.validated.isValid;

    return (
        <Box position="absolute" width="100%" height="100%">
            {mustShowSettingsView ? (
                <SettingsView settings={settings} />
            ) : (
                <FullscreenBox>
                    <LoadMapsScript
                        loadingElement={loadingElement}
                        googleMapURL={settings.googleMapURL}
                    >
                        <MainConfigured settings={settings} />
                    </LoadMapsScript>
                </FullscreenBox>
            )}
        </Box>
    );
};

initializeBlock(() => <Main />);
