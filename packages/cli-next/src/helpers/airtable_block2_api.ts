import {AirtableApi, AirtableApiOptions, airtableFetchInit} from './airtable_api';
import {FetchInit} from './fetch_api';
import {S3SignedUploadInfo} from './s3_api';

export interface AirtableBlock2ApiBaseOptions extends AirtableApiOptions {
    blockId: string;
}

export interface AirtableBlock2ApiReleaseOptions extends AirtableBlock2ApiBaseOptions {
    buildId: string;
    developerComment: string;
}

export interface AirtableBlock2ApiBuildStartResponse {
    buildId: string;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
}

export interface AirtableBlock2ApiReleaseResponse {
    releaseId: string;
}

function airtableBlock2FetchInit(
    {blockId, ...urlOptions}: AirtableBlock2ApiBaseOptions,
    {url, ...init}: FetchInit,
): FetchInit {
    return airtableFetchInit(urlOptions, {
        url: `/v2/blocksV2/${blockId}${url}`,
        ...init,
    });
}

export class AirtableBlock2Api extends AirtableApi {
    async blockBuildStartAsync(
        urlOptions: AirtableBlock2ApiBaseOptions,
    ): Promise<AirtableBlock2ApiBuildStartResponse> {
        return await this.fetchJsonAsync(
            airtableBlock2FetchInit(urlOptions, {url: '/builds/start'}),
        );
    }

    async blockCreateReleaseAsync({
        buildId,
        developerComment,
        ...urlOptions
    }: AirtableBlock2ApiReleaseOptions): Promise<AirtableBlock2ApiReleaseResponse> {
        return await this.fetchJsonAsync(
            airtableBlock2FetchInit(urlOptions, {
                url: '/releases/create',
                body: {buildId, developerComment},
            }),
        );
    }
}
