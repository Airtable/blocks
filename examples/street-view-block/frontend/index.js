import {cursor} from '@airtable/blocks';
import {
    initializeBlock,
    Box,
    Text,
    TextButton,
    Loader,
    useSettingsButton,
    useWatchable,
    useLoadable,
    useRecords,
} from '@airtable/blocks/ui';
import {withGoogleMap, StreetViewPanorama, withScriptjs, GoogleMap} from 'react-google-maps';
import React, {useState, useRef} from 'react';

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
        const {StreetViewStatus} = getGoogle(window).maps;

        if (status === StreetViewStatus.OK) {
            onStreetViewStateChange({
                state: {
                    address: address,
                    position: streetView.getPosition(),
                    pov: streetView.getPov(),
                },
                status: {
                    ok: true,
                    unknownError: false,
                    zeroResults: false,
                },
            });
        } else if (
            status === StreetViewStatus.UNKNOWN_ERROR ||
            status === StreetViewStatus.ZERO_RESULTS
        ) {
            onStreetViewStateChange({
                state: {
                    address: address,
                    position: null,
                    pov: null,
                },
                status: {
                    ok: false,
                    unknownError: status === StreetViewStatus.UNKNOWN_ERROR,
                    zeroResults: status === StreetViewStatus.ZERO_RESULTS,
                },
            });
        } else {
            onStreetViewStateChange({
                state: {
                    address: address,
                    position: position,
                    pov: pov,
                },
                status: {
                    ok: false,
                    unknownError: false,
                    zeroResults: false,
                },
            });
        }
    };

    if (pano) {
        return (
            <Box>
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
            </Box>
        );
    }
    return null;
};

const RecordStreetView = withGoogleMap(_RecordStreetView);

const RecordNotOk = ({address, status}) => {
    if (status && status.zeroResults) {
        return (
            <Box
                className="absolute all-0"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Box width="100%" textAlign="center">
                    Cannot find a street view for:
                </Box>
                <Box width="100%" textAlign="center">
                    {address}
                </Box>
            </Box>
        );
    } else if (status && status.unknownError) {
        return (
            <Box
                className="absolute all-0"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Box width="100%" textAlign="center">
                    Received an unknown error while looking for a street view for:
                </Box>
                <Box width="100%" textAlign="center">
                    {address}
                </Box>
            </Box>
        );
    }
};

const RecordGeocodeStreetView = props => {
    const {address} = props;
    const loc = useGeocode(address);

    if (loc && loc.lat && loc.lng) {
        return <RecordStreetView position={loc} {...props} />;
    } else if (loc && loc.locationNotFound) {
        return (
            <Box
                className="absolute all-0"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Box width="100%" textAlign="center">
                    Could not find a location from:
                </Box>
                <Box width="100%" textAlign="center">
                    {address}
                </Box>
            </Box>
        );
    } else {
        return (
            <Box
                className="absolute all-0"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Box width="100%" textAlign="center">
                    <Loader />
                </Box>
            </Box>
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

/** @type {StreetViewStateChange} */
const defaultStateCache = {state: null, status: null};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 * @param {import('@airtable/blocks/dist/types/src/models/record').default} props.record
 */
const MainRecord = ({settingsStore, record}) => {
    let [{state: streetViewState, status}, setTemporaryStateCache] = useState(
        /** @type {StreetViewStateChange} */ (defaultStateCache),
    );

    let address;
    /** @type {(change: StreetViewStateChange) => void} */
    let onStreetViewStateChange;
    if (settingsStore.cacheField) {
        let streetViewStateString = String(record.getCellValue(settingsStore.cacheFieldId) || '');
        if (
            streetViewStateString &&
            ((streetViewState && streetViewState.address !== address) || !streetViewState)
        ) {
            streetViewState = JSON.parse(streetViewStateString);
        }

        onStreetViewStateChange = ({state: newState, status}) => {
            if (newState.address !== address) return;
            const cacheState = JSON.stringify(newState);
            if (cacheState === record.getCellValue(settingsStore.cacheFieldId)) return;

            const table = settingsStore.table;
            if (status.ok) {
                table.updateRecordAsync(record, {
                    [settingsStore.cacheFieldId]: cacheState,
                });
            } else {
                setTemporaryStateCache({state: JSON.parse(cacheState), status});
            }
        };
    } else {
        onStreetViewStateChange = ({state: newState, status}) => {
            if (newState.address !== address) return;
            const cacheState = JSON.stringify(newState);
            if (cacheState === JSON.stringify(streetViewState)) return;

            setTemporaryStateCache({state: JSON.parse(cacheState), status});
        };
    }

    address = String(record.getCellValue(settingsStore.locationFieldId) || '');

    if (!address || (address && streetViewState && streetViewState.address !== address)) {
        streetViewState = null;
    }

    if (!address.trim()) {
        return (
            <Box className="absolute all-0" display="flex" alignItems="center">
                <Box width="100%" textAlign="center">
                    Select a record with the &quot;{settingsStore.locationField.name}&quot; field
                    set.
                </Box>
            </Box>
        );
    }

    return (
        <RecordStreetViewWrapper
            containerElement={
                <div
                    className="absolute all-0"
                    style={{height: settingsStore.showSettings ? 0 : ''}}
                />
            }
            mapElement={<div className="absolute all-0 mapRoot" />}
            address={address}
            streetViewState={streetViewState}
            status={status}
            streetViewOptions={{
                disableDefaultUI: !settingsStore.showDefaultUI,
                enableCloseButton: false,
                showRoadLabels: settingsStore.showRoadLabels,
            }}
            onStreetViewStateChange={onStreetViewStateChange}
        />
    );
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settingsStore
 */
const MainConfigured = ({settingsStore}) => {
    const table = settingsStore.table;
    const selection = useRecords(table.views[0], {fields: settingsStore.fields});

    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'activeTableId', 'activeViewId']);
    const lastRecordId = useRef('');

    if (cursor.activeTableId !== table.id) {
        return (
            <Box
                className="absolute all-0"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Text paddingX={3}>
                    Switch to the &quot;{table.name}&quot; table to see street views.
                </Text>
                <TextButton
                    size="small"
                    marginTop={3}
                    onClick={() => {
                        settingsStore.showSettings = true;
                    }}
                >
                    Settings
                </TextButton>
            </Box>
        );
    }

    let lastRecord = selection ? selection.find(({id}) => id === lastRecordId.current) : null;

    let firstSelectedRecordId = cursor.selectedRecordIds[0] || '';

    let record = selection ? selection.find(({id}) => id === firstSelectedRecordId) : null;

    if (record && record.getCellValue(settingsStore.locationField))
        lastRecordId.current = firstSelectedRecordId;
    else if (record) lastRecordId.current = '';

    if (!record) record = lastRecord;

    if (record) {
        return <MainRecord settingsStore={settingsStore} record={record} />;
    } else {
        return (
            <Box className="absolute all-0" display="flex" alignItems="center">
                <Box width="100%" textAlign="center">
                    Select a record.
                </Box>
            </Box>
        );
    }
};

const QuickSetupList = ({showSettings}) => (
    <Box
        className="absolute all-0"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
    >
        <Box>
            <Box>
                <span className="understroke link cursor-pointer" onClick={showSettings}>
                    Open this block&apos;s settings
                </span>{' '}
                and configure the following:
            </Box>
            <ul>
                <li>Google API Key</li>
                <li>A table in the base</li>
                <li>A field with locations in the table</li>
            </ul>
        </Box>
    </Box>
);

const _LoadMapsScript = ({children}) => children;

const LoadMapsScript = withScriptjs(_LoadMapsScript);

let Main = () => {
    const settingsStore = useSettingsStore();
    useSettingsButton(() => {
        settingsStore.showSettings = !settingsStore.showSettings;
    });

    return (
        <Box className="baymax" position="absolute" width="100%" height="100%">
            <Box className="absolute all-0">
                <Box
                    className="absolute all-0"
                    style={{display: settingsStore.showSettings ? 'none' : ''}}
                >
                    {settingsStore.googleApiKey && (
                        <LoadMapsScript
                            loadingElement={
                                <div className="absolute all-0">
                                    <Loader />
                                </div>
                            }
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${settingsStore.googleApiKey}`}
                        >
                            {settingsStore.isMinimallyConfigured && (
                                <MainConfigured settingsStore={settingsStore} />
                            )}
                        </LoadMapsScript>
                    )}
                    {!settingsStore.isMinimallyConfigured && (
                        <QuickSetupList
                            showSettings={() => {
                                settingsStore.showSettings = true;
                            }}
                        />
                    )}
                </Box>
                {settingsStore.showSettings ? (
                    <Box className="absolute all-0">
                        <SettingsView settingsStore={settingsStore} />
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
};

initializeBlock(() => <Main />);
