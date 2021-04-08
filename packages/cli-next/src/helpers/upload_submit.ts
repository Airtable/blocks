import fetch from 'node-fetch';
import {AirtableBlock1Api, AirtableBlock1ApiBaseOptions} from './airtable_block1_api';
import {spawnUnexpectedError} from './error_utils';

export interface UploadSubmitOptions {
    api: {
        airtable: AirtableBlock1Api;
    };
    blockUrlOptions: AirtableBlock1ApiBaseOptions;
}

export interface UploadSubmitDataOptions {
    archiveBuffer: Buffer;
}

export async function uploadSubmitAsync(
    {api: {airtable}, blockUrlOptions}: UploadSubmitOptions,
    {archiveBuffer}: UploadSubmitDataOptions,
): Promise<string> {
    const {presignedUploadUrl, codeUploadId} = await airtable.blockCreateCodeUploadAsync(
        blockUrlOptions,
    );

    const response = await fetch(presignedUploadUrl, {method: 'put', body: archiveBuffer});

    const didUpload = response.status === 200;
    const status = didUpload ? 'uploaded' : 'failed';
    const {message} = await airtable.blockFinalizeCodeUploadAsync({
        codeUploadId,
        status,
        ...blockUrlOptions,
    });

    if (!didUpload) {
        throw spawnUnexpectedError(message);
    }

    return message;
}
