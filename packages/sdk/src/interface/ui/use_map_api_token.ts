import {useCallback, useEffect, useState} from 'react';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';

/** @hidden */
type ApiTokenFetchState =
    | {status: 'initial'}
    | {status: 'loading'}
    | {
          status: 'completed';
          token: string;
          warningMessage?: string;
      }
    | {
          status: 'error';
          errorMessage: string;
          suggestedPrompt?: string;
      };

/**
 * @hidden
 * Experimental implementation of using an Airtable-provided token
 */
export function useMapApiToken(): ApiTokenFetchState {
    const [fetchState, setFetchState] = useState<ApiTokenFetchState>({status: 'initial'});
    const sdk = useSdk<InterfaceSdkMode>();

    const fetchApiToken = useCallback(async () => {
        try {
            const getTokenResponse = await sdk.unstable_getMapApiTokenAsync();
            if (getTokenResponse.success) {
                setFetchState({
                    status: 'completed',
                    token: getTokenResponse.apiKey,
                    warningMessage: getTokenResponse.warningMessage,
                });
            } else {
                setFetchState({
                    status: 'error',
                    errorMessage: getTokenResponse.userFriendlyErrorMessage,
                    suggestedPrompt: getTokenResponse.suggestedOmniPrompt,
                });
            }
        } catch (err) {
            setFetchState({
                status: 'error',
                errorMessage: `An unexpected error occurred while loading the map API token:\n${err}`,
            });
        }
    }, [sdk]);

    useEffect(() => {
        if (fetchState.status === 'initial') {
            setFetchState({status: 'loading'});
            fetchApiToken();
        }
    }, [fetchApiToken, fetchState.status]);

    return fetchState;
}
