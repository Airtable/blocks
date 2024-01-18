// @flow

/** Event received on a block backend invocation. */
export type LambdaEvent = {
    method: string,
    query: {[string]: string | $ReadOnlyArray<string>},
    path: string,
    body: mixed,
    headers: {[string]: string},
    presignedS3UploadUrl: string,
    logKey: string,
    blockInvocationId: string,
    // kvValuesByKey will be void if the kv data couldn't fit into the request
    // due to payload limits.
    kvValuesByKey: Object | void,
    apiAccessPolicyString: string,
    applicationId: string,
    blockInstallationId: string,
    apiBaseUrl: string,
    region: string | null,
};
