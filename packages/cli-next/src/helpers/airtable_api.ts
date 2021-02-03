import {invariant, spawnError} from './error_utils';
import {FetchApi, Response, FetchInit} from './fetch_api';

/* eslint-disable airtable/enum-style */
enum ErrorResponseCode {
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    UNSUPPORTED_BLOCKS_CLI_VERSION = 'UNSUPPORTED_BLOCKS_CLI_VERSION',
}
/* eslint-enable airtable/enum-style */

interface ErrorResponseJson {
    error?: {
        code?: ErrorResponseCode | string;
        message: string;
    };
    errors?: {
        code?: ErrorResponseCode | string;
        message: string;
    }[];
}

interface ErrorResponseError {
    status: number;
    error: {
        message: string;
        code?: string;
    };
}

export interface AirtableApiOptions {
    apiKey: string;
    userAgent: string;
    apiBaseUrl: string;
}

export interface AirtableApiBlockOptions extends AirtableApiOptions {
    baseId: string;
    blockId: string;
}

export interface AirtableApiBuildStartOptions {
    hasBackend: boolean;
}

export interface AirtableApiBlockInstallationOptions extends AirtableApiOptions {
    baseId: string;
    blockInstallationId: string;
}

export interface AirtableApiBlockBuildOptions extends AirtableApiBlockOptions {
    buildId: string;
}

interface AirtableApiBlockDeployOptions extends AirtableApiBlockOptions {
    deployId: string | null;
}

export interface AirtableApiBlockReleaseOptions
    extends AirtableApiBlockBuildOptions,
        AirtableApiBlockDeployOptions {}

export interface AirtableApiBlockCodeUploadOptions extends AirtableApiBlockOptions {
    codeUploadId: string;
}

function airtableFetchInit(
    {apiKey, userAgent, apiBaseUrl}: AirtableApiOptions,
    {url, ...init}: FetchInit,
): FetchInit {
    return {
        url: new URL(url, apiBaseUrl).href,
        ...init,
        method: 'post',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'User-Agent': userAgent,
            'Content-Type': 'application/json',
        },
    };
}

function airtableBlockFetchInit(
    {baseId, blockId, ...urlOptions}: AirtableApiBlockOptions,
    {url, ...init}: FetchInit,
): FetchInit {
    return airtableFetchInit(urlOptions, {
        url: `/v2/bases/${baseId}/blocks/${blockId}${url}`,
        ...init,
    });
}

function uploadAirtableError({status, error: {message, code}}: ErrorResponseError): string {
    if (status === 401) {
        return 'Invalid Airtable API key.';
    } else if (status === 422 && code === ErrorResponseCode.RESOURCE_NOT_FOUND) {
        return 'Airtable base not found.';
    } else {
        return message;
    }
}

export class AirtableApi extends FetchApi {
    protected async _invariantOkResponseAsync(init: FetchInit, response: Response) {
        const {status} = response;
        if (status === 200) {
            return;
        }

        const {error, errors}: ErrorResponseJson = await response.json();
        if (Array.isArray(errors)) {
            invariant(
                errors.some(errObj => errObj && typeof errObj.message === 'string'),
                'Request to Airtable failed with status code %s and errors:\n%s',
                status,
                JSON.stringify(errors, null, 4),
            );
            const errorMessages = errors.map(err => uploadAirtableError({status, error: err}));
            throw spawnError('Request to Airtable failed:\n%s', errorMessages.join('\n'));
        } else if (
            error &&
            error.code === ErrorResponseCode.UNSUPPORTED_BLOCKS_CLI_VERSION &&
            typeof error.message === 'string'
        ) {
            throw spawnError('%s', error.message);
        } else if (error && typeof error.message === 'string') {
            throw spawnError(uploadAirtableError({status, error}));
        } else {
            throw spawnError('Request to Airtable failed with status code %s', status);
        }
    }

    async blockAccessPolicyAsync({
        baseId,
        blockInstallationId,
        ...urlOptions
    }: AirtableApiBlockInstallationOptions) {
        return await this.fetchJsonAsync(
            airtableFetchInit(urlOptions, {
                url: `/v2/meta/${baseId}/blockInstallations/${blockInstallationId}/accessPolicy`,
            }),
        );
    }

    async blockBuildStartAsync({
        hasBackend,
        ...urlOptions
    }: AirtableApiBlockOptions & AirtableApiBuildStartOptions) {
        return await this.fetchJsonAsync(
            airtableBlockFetchInit(urlOptions, {url: '/builds/start', body: {hasBackend}}),
        );
    }

    async blockBuildSucceededAsync({buildId, ...urlOptions}: AirtableApiBlockBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlockFetchInit(urlOptions, {url: `/builds/${buildId}/succeed`}),
        );
    }

    async blockBuildFailedAsync({buildId, ...urlOptions}: AirtableApiBlockBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlockFetchInit(urlOptions, {url: `/builds/${buildId}/fail`}),
        );
    }

    async blockCreateDeployAsync({buildId, ...urlOptions}: AirtableApiBlockBuildOptions) {
        return await this.fetchVoidAsync(
            airtableBlockFetchInit(urlOptions, {
                url: '/deploys/create',
                body: {
                    buildId,
                },
            }),
        );
    }

    async blockDeployStatusAsync({deployId, ...urlOptions}: AirtableApiBlockDeployOptions) {
        return await this.fetchJsonAsync(
            airtableBlockFetchInit(urlOptions, {url: `/deploys/${deployId}/status`}),
        );
    }

    async blockCreateReleaseAsync({
        buildId,
        deployId,
        ...urlOptions
    }: AirtableApiBlockReleaseOptions) {
        return await this.fetchVoidAsync(
            airtableBlockFetchInit(urlOptions, {
                url: '/releases/create',
                body: {
                    buildId,
                    deployId,
                },
            }),
        );
    }

    async blockCreateCodeUploadAsync(urlOptions: AirtableApiBlockOptions) {
        return await this.fetchJsonAsync(
            airtableBlockFetchInit(urlOptions, {url: '/codeUpload/create'}),
        );
    }

    async blockFinalizeCodeUploadAsync({
        codeUploadId,
        ...urlOptions
    }: AirtableApiBlockCodeUploadOptions) {
        return await this.fetchVoidAsync(
            airtableBlockFetchInit(urlOptions, {
                url: '/codeUpload/finalize',
                body: {
                    codeUploadId,
                },
            }),
        );
    }
}
