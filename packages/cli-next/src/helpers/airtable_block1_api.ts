import {airtableFetchInit, AirtableApi, AirtableApiOptions} from './airtable_api';
import {FetchInit} from './fetch_api';

export interface AirtableBlock1ApiBaseOptions extends AirtableApiOptions {
    baseId: string;
    blockId: string;
}

export interface AirtableBlock1ApiBuildStartOptions {
    hasBackend: boolean;
}

export interface AirtableBlock1ApiInstallationOptions extends AirtableApiOptions {
    baseId: string;
    blockInstallationId: string;
}

export interface AirtableBlock1ApiBuildOptions extends AirtableBlock1ApiBaseOptions {
    buildId: string;
}

interface AirtableBlock1ApiDeployOptions extends AirtableBlock1ApiBaseOptions {
    deployId: string | null;
}

export interface AirtableBlock1ApiReleaseOptions
    extends AirtableBlock1ApiBuildOptions,
        AirtableBlock1ApiDeployOptions {}

export interface AirtableBlock1ApiCodeUploadOptions extends AirtableBlock1ApiBaseOptions {
    codeUploadId: string;
    status: 'uploaded' | 'failed';
}

function airtableBlock1FetchInit(
    {baseId, blockId, ...urlOptions}: AirtableBlock1ApiBaseOptions,
    {url, ...init}: FetchInit,
): FetchInit {
    return airtableFetchInit(urlOptions, {
        url: `/v2/bases/${baseId}/blocks/${blockId}${url}`,
        ...init,
    });
}

interface AirtableBlock1CodeUploadResponse {
    codeUploadId: string;
    presignedUploadUrl: string;
}

interface AirtableBlock1FinalizeCodeUploadResponse {
    message: string;
}

export class AirtableBlock1Api extends AirtableApi {
    async blockAccessPolicyAsync({
        baseId,
        blockInstallationId,
        ...urlOptions
    }: AirtableBlock1ApiInstallationOptions) {
        return await this.fetchJsonAsync(
            airtableFetchInit(urlOptions, {
                url: `/v2/meta/${baseId}/blockInstallations/${blockInstallationId}/accessPolicy`,
            }),
        );
    }

    async blockBuildStartAsync({
        hasBackend,
        ...urlOptions
    }: AirtableBlock1ApiBaseOptions & AirtableBlock1ApiBuildStartOptions) {
        return await this.fetchJsonAsync(
            airtableBlock1FetchInit(urlOptions, {url: '/builds/start', body: {hasBackend}}),
        );
    }

    async blockBuildSucceededAsync({buildId, ...urlOptions}: AirtableBlock1ApiBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlock1FetchInit(urlOptions, {url: `/builds/${buildId}/succeed`}),
        );
    }

    async blockBuildFailedAsync({buildId, ...urlOptions}: AirtableBlock1ApiBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlock1FetchInit(urlOptions, {url: `/builds/${buildId}/fail`}),
        );
    }

    async blockCreateDeployAsync({buildId, ...urlOptions}: AirtableBlock1ApiBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlock1FetchInit(urlOptions, {
                url: '/deploys/create',
                body: {
                    buildId,
                },
            }),
        );
    }

    async blockDeployStatusAsync({deployId, ...urlOptions}: AirtableBlock1ApiDeployOptions) {
        return await this.fetchJsonAsync(
            airtableBlock1FetchInit(urlOptions, {url: `/deploys/${deployId}/status`}),
        );
    }

    async blockCreateReleaseAsync({
        buildId,
        deployId,
        ...urlOptions
    }: AirtableBlock1ApiReleaseOptions) {
        return await this.fetchVoidAsync(
            airtableBlock1FetchInit(urlOptions, {
                url: '/releases/create',
                body: {
                    buildId,
                    deployId,
                },
            }),
        );
    }

    async blockCreateCodeUploadAsync(
        urlOptions: AirtableBlock1ApiBaseOptions,
    ): Promise<AirtableBlock1CodeUploadResponse> {
        return await this.fetchJsonAsync(
            airtableBlock1FetchInit(urlOptions, {
                url: '/codeUpload/create',
                body: {isV2Block: false},
            }),
        );
    }

    async blockFinalizeCodeUploadAsync({
        codeUploadId,
        status,
        ...urlOptions
    }: AirtableBlock1ApiCodeUploadOptions): Promise<AirtableBlock1FinalizeCodeUploadResponse> {
        return await this.fetchJsonAsync(
            airtableBlock1FetchInit(urlOptions, {
                url: '/codeUpload/finalize',
                body: {
                    codeUploadId,
                    status,
                },
            }),
        );
    }
}
