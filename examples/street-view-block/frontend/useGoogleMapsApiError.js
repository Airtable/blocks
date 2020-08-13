import {startsWith, includes, some} from 'lodash';
import {useState, useEffect} from 'react';
import {GoogleAuthFailureReason} from './GoogleAuthFailureReason';

// https://developers.google.com/maps/documentation/javascript/error-messages
const GOOGLE_MAPS_INVALID_KEY_ERROR_CODES = [
    'DeletedApiProjectMapError',
    'MissingKeyMapError',
    'ApiProjectMapError',
    'InvalidKey', // also covers InvalidKeyMapError
    'KeyLooksLike',
    'NoApiKeys',
];

// We have to monkeypatch console.error to catch Google's API authentication
// errors in order to show users helpful error messages...
const originalConsoleError = console.error || (() => {}); // eslint-disable-line no-console
// eslint-disable-next-line no-console
console.error = function(error) {
    if (startsWith(error, 'Geocoding Service: ') && includes(error, 'not authorized')) {
        window.gm_authFailure(GoogleAuthFailureReason.GEOCODING_NOT_ENABLED);
    } else if (includes(error, 'ApiNotActivatedMapError')) {
        window.gm_authFailure(GoogleAuthFailureReason.MAPS_NOT_ENABLED);
    } else if (includes(error, 'RefererNotAllowedMapError')) {
        window.gm_authFailure(GoogleAuthFailureReason.REFERER_NOT_ALLOWED);
    } else if (some(GOOGLE_MAPS_INVALID_KEY_ERROR_CODES, errorCode => includes(error, errorCode))) {
        window.gm_authFailure(GoogleAuthFailureReason.INVALID_KEY);
    } else if (includes(error, 'ExpiredKeyMapError')) {
        window.gm_authFailure(GoogleAuthFailureReason.EXPIRED_KEY);
    }
    originalConsoleError.apply(console, arguments);
};

/** @type {import('./GoogleAuthFailureReason').GoogleAuthFailureReason} */
let mapsAuthReason;

const reasonListeners = [];

window.gm_authFailure = reason => {
    if (!reason) return;
    mapsAuthReason = reason;
    reasonListeners.forEach(listener => listener(reason));
};

export const useGoogleMapsApiError = () => {
    const [error, setError] = useState(mapsAuthReason);
    useEffect(() => {
        reasonListeners.push(setError);
        return () => {
            reasonListeners.splice(reasonListeners.indexOf(setError), 1);
        };
    });
    return error;
};

export default useGoogleMapsApiError;
