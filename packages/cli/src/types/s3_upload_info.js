// @flow
export type S3UploadInfo = {|
    endpointUrl: string,
    key: string | null,
    keyPrefix: string | null,
    params: {[string]: string},
|};
