// @flow
const invariant = require('invariant');
const request = require('request');
const promisify = require('es6-promisify');
const Environments = require('./types/environments');
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
type KmsDataKeyId = string;

const apiDomainsByEnvironment = {
    [Environments.PRODUCTION]: 'api.airtable.com',
    [Environments.STAGING]: 'api-staging.airtable.com',
    [Environments.LOCAL]: 'api.hyperbasedev.com:3000',
};

class APIClient {
    _environment: Environment;
    _applicationId: ApplicationId;
    _blockInstallationId: BlockInstallationId | null;
    _blockId: BlockId;
    _apiKey: string;

    constructor(opts: {|
        environment?: Environment,
        applicationId: ApplicationId,
        blockInstallationId?: BlockInstallationId,
        blockId: BlockId,
        apiKey: string,
    |}) {
        this._environment = opts.environment || Environments.PRODUCTION;
        this._applicationId = opts.applicationId;
        this._blockInstallationId = opts.blockInstallationId || null;
        this._blockId = opts.blockId;
        this._apiKey = opts.apiKey;
    }

    _getRequestUrl(): string {
        const domain = apiDomainsByEnvironment[this._environment];
        return `https://${domain}/v2/meta/${this._applicationId}/blocks/${this._blockId}`;
    }

    async updateBlockAsync(data: UpdateBlockParams): Promise<UpdateBlockResponse> {
        const options = {
            url: this._getRequestUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: data,
            json: true,
        };
        const response = await request.putAsync(options);
        const body = response.body;
        const statusCode = response.statusCode;
        if (statusCode !== 200) {
            throw new Error(body.error.message);
        }
        return body;
    }

    async fetchBlockAsync(): Promise<FetchBlockResponse> {
        const options = {
            url: this._getRequestUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
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
            url: `${this._getRequestUrl()}/credentials/decrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
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
            url: `${this._getRequestUrl()}/credential/encrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
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
            url: `${this._getRequestUrl()}/credential/reEncrypt`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
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

    _getAccessPolicyUrl(): string {
        invariant(this._blockInstallationId, '_blockInstallationId');
        const domain = apiDomainsByEnvironment[this._environment];
        return `https://${domain}/v2/meta/${this._applicationId}/blockInstallations/${this._blockInstallationId}/accessPolicy`;
    }

    async fetchAccessPolicyAsync(): Promise<string> {
        const options = {
            url: this._getAccessPolicyUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
        };
        const response = request.getAsync(options);
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
        return bodyParsed;
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
