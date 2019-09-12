// @flow

/** Request to backend route handlers. */
export type BackendRouteRequest = {
    method: string,
    query: {[string]: string | $ReadOnlyArray<string>},
    params: {[string]: string},
    path: string,
    body: mixed,
    headers: {[string]: string},

    // Private fields for SDK consumption:
    _apiBaseUrl: string,
    _apiAccessPolicyString: string,
    _applicationId: string,
    _blockInstallationId: string,
    _blockInvocationId: string,
    _kvValuesByKey: Object | void,
};

/** Response from backend route handlers. */
export type BackendRouteResponse = {
    statusCode?: number,
    body?: string | Buffer | Object | Array<mixed>,
    // Supported header formats:
    //   - {'X-Key': 'value'}
    //   - {'X-Key': ['value1', 'value2']}
    //   - ['X-Key', 'value1', 'X-Key', 'value2']
    headers?: {[string]: string | $ReadOnlyArray<string>},
    errorData?: {
        stack: string,
        message: string,
        name: string,
    },
};

/** Type signature of backend route handlers. */
export type BackendRouteHandler = (
    request: BackendRouteRequest,
) => BackendRouteResponse | Promise<BackendRouteResponse>;
