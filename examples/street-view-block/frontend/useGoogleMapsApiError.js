import {useState} from 'react';
import {
    BILLING_NOT_ENABLED,
    GEOCODING_NOT_ENABLED,
    MAPS_NOT_ENABLED,
    REFERER_NOT_ALLOWED,
    INVALID_KEY,
    EXPIRED_KEY,
} from './GoogleAuthFailure';

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
    // It's possible to reach this code before window.gm_authFailure has
    // been set, so bail out if it doesn't exist.
    if (window.gm_authFailure) {
        if (error.startsWith('Geocoding Service: ')) {
            if (error.includes('enable Billing')) {
                window.gm_authFailure(BILLING_NOT_ENABLED);
            }
            if (error.includes('not authorized')) {
                window.gm_authFailure(GEOCODING_NOT_ENABLED);
            }
        } else if (
            error.includes('ApiNotActivatedMapError') ||
            error.includes('ApiTargetBlockedMapError')
        ) {
            window.gm_authFailure(MAPS_NOT_ENABLED);
        } else if (error.includes('RefererNotAllowedMapError')) {
            window.gm_authFailure(REFERER_NOT_ALLOWED);
        } else if (
            GOOGLE_MAPS_INVALID_KEY_ERROR_CODES.some(errorCode => error.includes(errorCode))
        ) {
            window.gm_authFailure(INVALID_KEY);
        } else if (error.includes('ExpiredKeyMapError')) {
            window.gm_authFailure(EXPIRED_KEY);
        }
    }
    originalConsoleError.apply(console, arguments);
};

export const useGoogleMapsApiError = () => {
    const [error, setError] = useState(null);
    window.gm_authFailure = reason => {
        setError(reason);
    };
    return error;
};

export default useGoogleMapsApiError;
