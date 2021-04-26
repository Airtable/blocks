import fetch from 'node-fetch';
import {AirtableBlock2Api, AirtableBlock2ApiBaseOptions} from './airtable_block2_api';
import {spawnUnexpectedError} from './error_utils';

export interface UploadSubmitOptions {
    api: {
        airtable: AirtableBlock2Api;
    };
    blockUrlOptions: AirtableBlock2ApiBaseOptions;
}

export interface UploadSubmitDataOptions {
    archiveBuffer: Buffer;
}

export async function uploadBlock2SubmitAsync(
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
