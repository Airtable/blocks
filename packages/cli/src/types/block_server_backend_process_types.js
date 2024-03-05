// @flow

import type {NormalizedBackendRouteResponse} from './backend_route_types';
import type {BlockJson} from './block_json_type';
import type {RemoteJson} from './remote_json_type';
import type {LambdaEvent} from './lambda_event_type';

/** Init options passed to block server backend process. */
export type BackendProcessOptions = {|
    blockJson: BlockJson,
    remoteJson: RemoteJson,
    outputUserTranspiledDirPath: string,
    backendSdkUrl: string | null,
    blockDevCredentialsPath: string | null,
    canUseCachedBackendSdk: boolean,
|};

/** Message types sent from backend process to block server main process. */
const BackendProcessResponseTypes = Object.freeze({
    EVENT_RESPONSE: ('event_response', 'event_response'),
    READY: ('ready', 'ready'),
});
/** Message types sent from backend process to block server main process. */
export type BackendProcessResponseType = $Values<typeof BackendProcessResponseTypes>;

/** Response message for READY. */
export type BackendProcessReadyResponse = {
    messageType: typeof BackendProcessResponseTypes.READY,
    pid: number,
};

/** Response message for EVENT_RESPONSE. */
export type BackendProcessEventResponse = {
    messageType: typeof BackendProcessResponseTypes.EVENT_RESPONSE,
    pid: number,
    requestId: string,
} & NormalizedBackendRouteResponse;

/** Message sent from backend process to block server main process. */
export type BackendProcessResponse = BackendProcessReadyResponse | BackendProcessEventResponse;

/** Message sent from block server main process to backend process. */
export type BackendProcessRequest = LambdaEvent & {
    requestId: string,
};

module.exports = {
    BackendProcessResponseTypes,
};
