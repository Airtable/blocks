import React, {Fragment} from 'react';
import {Link} from '@airtable/blocks/ui';

export const BILLING_NOT_ENABLED = 'BILLING_NOT_ENABLED';
export const GEOCODING_NOT_ENABLED = 'GEOCODING_NOT_ENABLED';
export const MAPS_NOT_ENABLED = 'MAPS_NOT_ENABLED';
export const INVALID_KEY = 'INVALID_KEY';
export const EXPIRED_KEY = 'EXPIRED_KEY';
export const REFERER_NOT_ALLOWED = 'REFERER_NOT_ALLOWED';
export const UNKNOWN = 'UNKNOWN';

const URL_GOOGLE_CLOUD_CONSOLE = 'https://console.cloud.google.com';
const URL_GOOGLE_DEV_API_CREDENTIALS = 'https://console.developers.google.com/apis/credentials';

function Anchor({href, children}) {
    const aProps = {
        href,
        rel: 'noopener noreferrer',
        target: '_blank',
    };
    return <Link {...aProps}>{children}</Link>;
}

export default function(errorCode) {
    let action = null;
    let reason = null;

    switch (errorCode) {
        case BILLING_NOT_ENABLED: {
            const href = `${URL_GOOGLE_CLOUD_CONSOLE}/project/_/billing/enable`;
            action = (
                <Fragment>
                    Please <Anchor href={href}>enable Billing on the Google Cloud Project</Anchor>{' '}
                    for this API key.
                </Fragment>
            );
            reason = 'Billing is not enabled for this API key.';
            break;
        }
        case GEOCODING_NOT_ENABLED: {
            const href = `${URL_GOOGLE_CLOUD_CONSOLE}/apis/library/geocoding-backend.googleapis.com`;
            action = (
                <Fragment>
                    Please <Anchor href={href}>enable the Google Maps Geocoding API</Anchor> for
                    this API key.
                </Fragment>
            );
            reason = 'The Google Maps Geocoding API is not enabled for this API key.';
            break;
        }
        case MAPS_NOT_ENABLED: {
            const href = `${URL_GOOGLE_CLOUD_CONSOLE}/apis/library/maps-backend.googleapis.com`;
            action = (
                <Fragment>
                    Please <Anchor href={href}>enable the Google Maps API</Anchor> for this API key.
                </Fragment>
            );
            reason = 'The Google Maps API is not enabled for this API key.';
            break;
        }
        case EXPIRED_KEY: {
            action = (
                <Fragment>
                    If this is a recently created API key, wait a few minutes and try again. If not,{' '}
                    <Anchor href={URL_GOOGLE_DEV_API_CREDENTIALS}>generate a new API key</Anchor>.
                </Fragment>
            );
            reason = 'The API Key has expired.';
            break;
        }
        case REFERER_NOT_ALLOWED: {
            action = (
                <Fragment>
                    Please{' '}
                    <Anchor href={URL_GOOGLE_DEV_API_CREDENTIALS}>
                        update this key&apos;s application restrictions
                    </Anchor>{' '}
                    to accept requests from <code>*.airtableblocks.com/*</code>.
                </Fragment>
            );

            reason = 'The API Key is restricted.';
            break;
        }
        case INVALID_KEY:
        case UNKNOWN: {
            action = (
                <Fragment>
                    Please ensure that this API key is correct, or{' '}
                    <Anchor href={URL_GOOGLE_DEV_API_CREDENTIALS}>create a new one</Anchor>.
                </Fragment>
            );
            reason = 'The API Key is invalid.';
            break;
        }
    }

    return {
        action,
        reason,
    };
}
