// @flow
const invariant = require('invariant');
const request = require('request');
const {promisify} = require('util');
const Environments = require('./types/environments');
const {URL} = require('url');
const {USER_AGENT, TEST_SERVER_PORT} = require('./config/block_cli_config_settings');
request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);
request.postAsync = promisify(request.post);

import type {
    CredentialEncrypted,
    CredentialPlaintext,
} from './types/block_developer_credential_types';
import type {Environment} from './types/environments';
import type {
    UpdateBlockParams,
    UpdateBlockResponse,
    FetchBlockResponse
} from './types/api_client_types';

type ApplicationId = string;
type BlockInstallationId = string;
type BlockId = string;
type BuildId = string;
type KmsDataKeyId = string;
type ReleaseId = string;

const apiBaseUrlsByEnvironment = {
    [Environments.PRODUCTION]: 'https://api.airtable.com',
    [Environments.STAGING]: 'https://api-staging.airtable.com',
    [Environments.LOCAL]: 'https://api.hyperbasedev.com:3000',
    [Environments.TEST]: 'http://localhost:' + TEST_SERVER_PORT,
};

// TODO(jb): realistically, all of these endpoints should be using `bases` and not `meta`.
// If/when we update the endpoints, we should get rid of support for `meta` here.
const ApiTypes = Object.freeze({
    BASES: ('bases': 'bases'),
    META: ('meta': 'meta'),
});
type ApiType = $Values<typeof ApiTypes>;

class APIClient {
    _environment: Environment;
    _applicationId: ApplicationId;
    _blockInstallationId: BlockInstallationId | null;
    _blockId: BlockId | null;
    _apiKey: string;

    constructor(opts: {|
        environment?: Environment,
        applicationId: ApplicationId,
        blockInstallationId?: BlockInstallationId,
        blockId?: BlockId,
        apiKey: string,
    |}) {
        this._environment = opts.environment || Environments.PRODUCTION;
        this._applicationId = opts.applicationId;
        this._blockInstallationId = opts.blockInstallationId || null;
        this._blockId = opts.blockId || null;
        this._apiKey = opts.apiKey;
    }

    _getBlockBaseUrl(apiType: ApiType): string {
        invariant(this._blockId, 'this._blockId');
        return this._getUrl(`/v2/${apiType}/${this._applicationId}/blocks/${this._blockId}`);
    }

    _getAccessPolicyUrl(): string {
        invariant(this._blockInstallationId, '_blockInstallationId');
        return this._getUrl(`/v2/${ApiTypes.META}/${this._applicationId}/blockInstallations/${this._blockInstallationId}/accessPolicy`);
    }

    _getUrl(path: string): string {
        const baseUrl = apiBaseUrlsByEnvironment[this._environment];
        return new URL(path, baseUrl).href;
    }

    async updateBlockAsync(data: UpdateBlockParams): Promise<UpdateBlockResponse> {
        const options = {
            url: this._getBlockBaseUrl(ApiTypes.META),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
            body: data,
            json: true,
        };
        const response = await request.putAsync(options);
        const body = response.body;
        const statusCode = response.statusCode;
        // If we got a 404, return incorrect app or block id error.
        if (statusCode === 404) {
            throw new Error('Incorrect application or block id');
        } else if (statusCode !== 200) {
            throw new Error(body.error.message);
        }
        return body;
    }

    async fetchBlockAsync(): Promise<FetchBlockResponse> {
        const options = {
            url: this._getBlockBaseUrl(ApiTypes.META),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
        };
        const response = await request.getAsync(options);
        const body = response.body;
        const statusCode = response.statusCode;
        // If we got a 404, return incorrect app or block id error.
        if (statusCode === 404) {
            throw new Error('Incorrect application or block id');
        }
        const bodyParsed = JSON.parse(body);
        // If we got anything else other than 200 and 404, return whatever error we got.
        if (statusCode !== 200) {
            throw new Error(bodyParsed.error.message);
        }
        return bodyParsed;
    }

    async decryptCredentialsAsync(
        credentialsEncrypted: Array<CredentialEncrypted>,
    ): Promise<Array<CredentialPlaintext>> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.META)}/credentials/decrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
            body: {credentialsEncrypted},
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            throw new Error(body.error.message);
        }

        return body;
    }

    async encryptCredentialAsync(
        credentialPlaintext: CredentialPlaintext,
        kmsDataKeyId?: KmsDataKeyId,
    ): Promise<CredentialEncrypted> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.META)}/credential/encrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
            body: {
                credentialPlaintext,
                kmsDataKeyId,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            throw new Error(body.error.message);
        }

        return body;
    }

    async reEncryptCredentialAsync(
        credentialEncrypted: CredentialEncrypted,
        newKmsDataKeyId: KmsDataKeyId,
    ): Promise<CredentialEncrypted> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.META)}/credential/reEncrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
            body: {
                credentialEncrypted,
                newKmsDataKeyId,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            throw new Error(body.error.message);
        }

        return body;
    }

    async startBuildAsync(hasBackend: boolean): Promise<{buildId: BuildId, frontendBundleUploadUrl: string, backendDeploymentPackageUploadUrl: string | null}> {
        invariant(this._blockId, '_blockId');
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/start`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: {hasBackend},
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async succeedBuildAsync(buildId: BuildId): Promise<void> {
        invariant(this._blockId, '_blockId');
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/${buildId}/succeed`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    async failBuildAsync(buildId: BuildId): Promise<void> {
        invariant(this._blockId, '_blockId');
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/${buildId}/fail`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    async createReleaseAsync(buildId: BuildId): Promise<{releaseId: ReleaseId}> {
        invariant(this._blockId, '_blockId');
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/releases/create`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: {buildId},
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async fetchAccessPolicyAsync(): Promise<string> {
        const options = {
            url: this._getAccessPolicyUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
        };
        const response = await request.getAsync(options);
        const body = response.body;
        const statusCode = response.statusCode;
        // If we got a 404, return incorrect app or block id error.
        if (statusCode === 404) {
            throw new Error('Incorrect application or block installation id');
        }
        const bodyParsed = JSON.parse(body);
        // If we got anything else other than 200 and 404, return whatever error we got.
        if (statusCode !== 200) {
            throw new Error(bodyParsed.error.message);
        }
        return bodyParsed.accessPolicy;
    }

    get applicationId(): ApplicationId {
        return this._applicationId;
    }

    get blockInstallationId(): BlockInstallationId | null {
        return this._blockInstallationId;
    }

    get environment(): Environment {
        return this._environment;
    }
}

module.exports = APIClient;
