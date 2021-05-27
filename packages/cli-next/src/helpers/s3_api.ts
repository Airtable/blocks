import FormData from 'form-data';

import {invariant, spawnUserError} from './error_utils';
import {FetchApi, FetchInit, Response} from './fetch_api';

export enum S3ApiErrorName {
    S3_API_BUNDLE_TOO_LARGE = 's3ApiBundleTooLarge',
    S3_API_FAILED = 's3ApiFailed',
}

export interface S3ApiErrorBundleTooLarge {
    type: S3ApiErrorName.S3_API_BUNDLE_TOO_LARGE;
}

export interface S3ApiErrorFailed {
    type: S3ApiErrorName.S3_API_FAILED;
}

export type S3ApiErrorInfo = S3ApiErrorBundleTooLarge | S3ApiErrorFailed;

export interface S3SignedUploadInfo {
    endpointUrl: string;
    key: string | null;
    keyPrefix: string | null;
    params: {[key: string]: string};
}

export interface UploadS3Bundle {
    fileBuffer: Buffer;
    uploadInfo: S3SignedUploadInfo;
}

export class S3Api extends FetchApi {
    protected async _invariantOkResponseAsync(init: FetchInit, response: Response) {
        const {status} = response;
        if (status !== 200 && status !== 201 && status !== 202) {
            const responseBody = await response.text();

            if (status === 400 && responseBody.includes('EntityTooLarge')) {
                throw spawnUserError<S3ApiErrorInfo>({
                    type: S3ApiErrorName.S3_API_BUNDLE_TOO_LARGE,
                });
            } else {
                throw spawnUserError<S3ApiErrorInfo>({type: S3ApiErrorName.S3_API_FAILED});
            }
        }
    }

    async uploadBundleAsync({fileBuffer, uploadInfo}: UploadS3Bundle) {
        invariant(uploadInfo.key, 'uploadInfo.key');

        const formData = new FormData();
        formData.append('key', uploadInfo.key);
        for (const key of Object.keys(uploadInfo.params)) {
            formData.append(key, uploadInfo.params[key]);
        }
        formData.append('file', fileBuffer);

        const formLength = formData.getLengthSync();
        const headers = {
            'Cache-Control': 'max-age=31536000,immutable',
            'Content-Length': formLength.toString(),
            'x-amz-server-side-encryption': 'AES256',
            ...formData.getHeaders(),
        };
        const body = formData.getBuffer();

        return await this.fetchVoidAsync({
            url: uploadInfo.endpointUrl,
            method: 'post',
            headers,
            body,
        });
    }
}
