'use strict';

const request = require('request');
const promisify = require('es6-promisify');
const Environments = require('./types/environments');

request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);
request.postAsync = promisify(request.post);

const apiDomainsByEnvironment = {
    [Environments.PRODUCTION]: 'api.airtable.com',
    [Environments.STAGING]: 'api-staging.airtable.com',
    [Environments.LOCAL]: 'api.hyperbasedev.com:3000',
};

class APIClient {
    constructor(opts) {
        this._environment = opts.environment || Environments.PRODUCTION;
        this._applicationId = opts.applicationId;
        this._blockInstallationId = opts.blockInstallationId;
        this._blockId = opts.blockId;
        this._apiKey = opts.apiKey;
    }

    _getRequestUrl() {
        const domain = apiDomainsByEnvironment[this._environment];
        return `https://${domain}/v2/meta/${this._applicationId}/blocks/${this._blockId}`;
    }

    updateBlockAsync(data) {
        const options = {
            url: this._getRequestUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: data,
            json: true,
        };
        return request.putAsync(options).then(response => {
            const body = response.body;
            const statusCode = response.statusCode;
            if (statusCode !== 200) {
                throw new Error(body.error.message);
            }
            return body;
        });
    }

    fetchBlockAsync() {
        const options = {
            url: this._getRequestUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
        };
        return request.getAsync(options).then(response => {
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
        });
    }

    /**
     * TODO(richsinn): when flow typing this method:
     *   - credentialsEncrypted parameter type => Array<CredentialEncrypted>
     *   - return type => Promise<Array<CredentialPlaintext>>
     */
    async decryptCredentialsAsync(credentialsEncrypted) {
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

    /**
     * TODO(richsinn): when flow typing this method:
     *   - credentialPlaintext parameter type => CredentialPlaintext
     *   - kmsDataKeyId parameter type => kmsDataKeyId?: string
     *   - return type => Promise<CredentialEncrypted>
     */
    async encryptCredentialAsync(
        credentialPlaintext,
        kmsDataKeyId,
    ) {
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

    /**
     * TODO(richsinn): when flow typing this method:
     *   - credentialEncrypted parameter type => credentialEncrypted
     *   - newKmsDataKeyId parameter type => string
     *   - return type => Promise<CredentialEncrypted>
     */
    async reEncryptCredentialAsync(
        credentialEncrypted,
        newKmsDataKeyId,
    ) {
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

    _getAccessPolicyUrl() {
        const domain = apiDomainsByEnvironment[this._environment];
        return `https://${domain}/v2/meta/${this._applicationId}/blockInstallations/${this._blockInstallationId}/accessPolicy`;
    }

    fetchAccessPolicyAsync() {
        const options = {
            url: this._getAccessPolicyUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
        };
        return request.getAsync(options).then(response => {
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
        });
    }

    get applicationId() {
        return this._applicationId;
    }

    get blockInstallationId() {
        return this._blockInstallationId;
    }

    get environment() {
        return this._environment;
    }
}

module.exports = APIClient;
