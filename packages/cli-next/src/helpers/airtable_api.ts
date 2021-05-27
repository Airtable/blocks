import fetch from 'node-fetch';
import {spawnUnexpectedError, spawnUserError} from './error_utils';
import {FetchApi, Response, FetchInit} from './fetch_api';
import {S3Api, S3SignedUploadInfo} from './s3_api';

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
    AIRTABLE_API_KEY_MALFORMED = 'airtableApiKeyMalformed',
    AIRTABLE_API_KEY_NAME_INVALID = 'airtableApiKeyNameInvalid',
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

export interface AirtableApiErrorKeyMalformed {
    type: AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED;
}

export interface AirtableApiErrorKeyNameInvalid {
    type: AirtableApiErrorName.AIRTABLE_API_KEY_NAME_INVALID;
    name: string;
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
    | AirtableApiErrorKeyMalformed
    | AirtableApiErrorKeyNameInvalid
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
    blockId: string;
    apiKey: string;
    userAgent: string;
    apiBaseUrl: string;
}

export interface CreateBuildOptions {
    s3: S3Api;
    frontendBundle: Buffer;
    backendBundle: Buffer | null;
}

export interface CreateReleaseOptions {
    buildId: string;
    deployId?: string;
    developerComment?: string;
}

export interface CodeUploadOptions {
    codeUploadId: string;
    status: 'uploaded' | 'failed';
}

export interface CodeUploadResponse {
    codeUploadId: string;
    presignedUploadUrl: string;
}

export interface FinalizeCodeUploadResponse {
    message: string;
}

export interface UploadSubmissionOptions {
    archiveBuffer: Buffer;
}

export interface CreateBuildResponseJson {
    buildId: string;
    frontendBundleUploadUrl: string;
    backendDeploymentPackageUploadUrl: string | null;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
    backendDeploymentPackageS3UploadInfo: S3SignedUploadInfo | null;
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

export abstract class AirtableApi extends FetchApi {
    protected blockId: string;
    private apiKey: string;
    private userAgent: string;
    private apiBaseUrl: string;

    constructor({blockId, apiKey, userAgent, apiBaseUrl}: AirtableApiOptions) {
        super();
        this.blockId = blockId;
        this.apiKey = apiKey;
        this.userAgent = userAgent;
        this.apiBaseUrl = apiBaseUrl;
    }

    airtableFetchInit({url, ...init}: FetchInit): FetchInit {
        return {
            url: new URL(url, this.apiBaseUrl).href,
            ...init,
            method: 'post',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'User-Agent': this.userAgent,
                'Content-Type': 'application/json',
            },
        };
    }

    abstract async createBuildAsync(options: CreateBuildOptions): Promise<CreateBuildResponseJson>;

    abstract async createReleaseAsync(options: CreateReleaseOptions): Promise<void>;

    async uploadSubmissionAsync({archiveBuffer}: UploadSubmissionOptions): Promise<string> {
        const {presignedUploadUrl, codeUploadId} = await this._blockCreateCodeUploadAsync();

        const response = await fetch(presignedUploadUrl, {method: 'put', body: archiveBuffer});

        const didUpload = response.status === 200;
        const status = didUpload ? 'uploaded' : 'failed';
        const {message} = await this._blockFinalizeCodeUploadAsync({
            codeUploadId,
            status,
        });

        if (!didUpload) {
            throw spawnUnexpectedError(message);
        }

        return message;
    }

    protected abstract async _blockCreateCodeUploadAsync(): Promise<CodeUploadResponse>;

    protected abstract async _blockFinalizeCodeUploadAsync(
        options: CodeUploadOptions,
    ): Promise<FinalizeCodeUploadResponse>;

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
}
