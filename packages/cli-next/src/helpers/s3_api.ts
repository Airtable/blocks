import FormData from 'form-data';

import {invariant, spawnError} from './error_utils';
import {FetchApi, FetchInit, Response} from './fetch_api';

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
        // It's reasonable for AWS to respond with 200 (OK), 201 (Created) or 202
        // (Accepted), so treat all of those as successes even though we usually
        // explicitly request 201 through the success_action_status field.
        if (status !== 200 && status !== 201 && status !== 202) {
            const responseBody = await response.text();

            // The 'EntityTooLarge' error code indicates the proposed upload will
            // exceed the maximum allowed object size.
            // See https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html#ErrorCodeList
            if (status === 400 && responseBody.includes('EntityTooLarge')) {
                throw spawnError('Bundle size is too big.');
            } else {
                throw spawnError('Failed to upload.');
            }
        }
    }

    async uploadBundleAsync({fileBuffer, uploadInfo}: UploadS3Bundle) {
        // We always expect `key` to be in the info object; the server should never
        // send upload info without a specific key.
        invariant(uploadInfo.key, 'uploadInfo.key');

        // S3 demands that the 'file' field be last in the form data, since it will
        // ignore any options following it. To make sure this always happens, we
        // generate the form data manually here instead of letting request do it.
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
