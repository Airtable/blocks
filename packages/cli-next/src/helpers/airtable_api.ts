import {spawnUnexpectedError, spawnUserError} from './error_utils';
import {FetchApi, Response, FetchInit} from './fetch_api';

/**
 * Enumeration of some error types server may return.
 */
/* eslint-disable airtable/enum-style */
enum ErrorResponseCode {
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    UNSUPPORTED_BLOCKS_CLI_VERSION = 'UNSUPPORTED_BLOCKS_CLI_VERSION',
}
/* eslint-enable airtable/enum-style */

export enum AirtableApiErrorName {
    AIRTABLE_API_ERROR_STATUS_AND_MESSAGES = 'airtableApiErrorStatusAndMessages',
    AIRTABLE_API_MULTIPLE_ERRORS = 'airtableApiMultipleErrors',
    AIRTABLE_API_WITH_INVALID_API_KEY = 'airtableApiWithInvalidApiKey',
    AIRTABLE_API_BASE_NOT_FOUND = 'airtableApiBaseNotFound',
    AIRTABLE_API_UNSUPPORTED_BLOCKS_CLI_VERSION = 'airtableApiUnsupportedBlocksCliVersion',
    AIRTABLE_API_UNEXPECTED_ERROR = 'airtableApiUnexpectedError',
}

export interface AirtableApiErrorStatusAndMessages {
    type: AirtableApiErrorName.AIRTABLE_API_ERROR_STATUS_AND_MESSAGES;
    status: number;
    errors: Exclude<ErrorResponseJson['errors'], undefined>;
}

export interface AirtableApiErrorMultiple {
    type: AirtableApiErrorName.AIRTABLE_API_MULTIPLE_ERRORS;
    errors: AirtableApiErrorInfo[];
}

export interface AirtableApiErrorInvalidApiKey {
    type: AirtableApiErrorName.AIRTABLE_API_WITH_INVALID_API_KEY;
}

export interface AirtableApiErrorBaseNotFound {
    type: AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND;
}

export interface AirtableApiErrorUnsupportedBlocksCliVersion {
    type: AirtableApiErrorName.AIRTABLE_API_UNSUPPORTED_BLOCKS_CLI_VERSION;
    serverMessage: string;
}

export interface AirtableApiErrorUnexpected {
    type: AirtableApiErrorName.AIRTABLE_API_UNEXPECTED_ERROR;
    serverMessage: string;
}

export type AirtableApiErrorInfo =
    | AirtableApiErrorStatusAndMessages
    | AirtableApiErrorMultiple
    | AirtableApiErrorInvalidApiKey
    | AirtableApiErrorBaseNotFound
    | AirtableApiErrorUnsupportedBlocksCliVersion
    | AirtableApiErrorUnexpected;

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

function createAirtableApiError({
    status,
    error: {message, code},
}: ErrorResponseError): AirtableApiErrorInfo {
    if (status === 401) {
        return {
            type: AirtableApiErrorName.AIRTABLE_API_WITH_INVALID_API_KEY,
        };
    } else if (status === 422 && code === ErrorResponseCode.RESOURCE_NOT_FOUND) {
        return {
            type: AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND,
        };
    } else {
        return {
            type: AirtableApiErrorName.AIRTABLE_API_UNEXPECTED_ERROR,
            serverMessage: message,
        };
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
            if (errors.some(errObj => errObj && typeof errObj.message === 'string')) {
                throw spawnUserError<AirtableApiErrorInfo>({
                    type: AirtableApiErrorName.AIRTABLE_API_ERROR_STATUS_AND_MESSAGES,
                    status,
                    errors,
                });
            }
            const errorMessages = errors.map(err => createAirtableApiError({status, error: err}));
            throw spawnUserError<AirtableApiErrorInfo>({
                type: AirtableApiErrorName.AIRTABLE_API_MULTIPLE_ERRORS,
                errors: errorMessages,
            });
        } else if (
            error &&
            error.code === ErrorResponseCode.UNSUPPORTED_BLOCKS_CLI_VERSION &&
            typeof error.message === 'string'
        ) {
            throw spawnUserError<AirtableApiErrorInfo>({
                type: AirtableApiErrorName.AIRTABLE_API_UNSUPPORTED_BLOCKS_CLI_VERSION,
                serverMessage: error.message,
            });
        } else if (error && typeof error.message === 'string') {
            throw spawnUserError<AirtableApiErrorInfo>(createAirtableApiError({status, error}));
        } else {
            throw spawnUnexpectedError('Request to Airtable failed with status code %s', status);
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
