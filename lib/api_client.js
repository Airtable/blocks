'use strict';

const request = require('request');
const promisify = require('es6-promisify');

request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);

const apiDomainsByEnvironment = {
    production: 'api.airtable.com',
    staging: 'api-staging.airtable.com',
    local: 'api.hyperbasedev.com:3000',
};

class APIClient {
    constructor(opts) {
        this._environment = opts.environment || 'production';
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

    _getReadBlockInstallationGlobalConfigUrl() {
        const domain = apiDomainsByEnvironment[this._environment];
        return `https://${domain}/v2/meta/${this._applicationId}/blockInstallations/${this._blockInstallationId}/globalConfig`;
    }

    // Reading globalConfig isn't allowed with a regular API key, so we need an accessPolicy.
    readBlockInstallationGlobalConfigAsync(accessPolicy) {
        const options = {
            url: `${this._getReadBlockInstallationGlobalConfigUrl()}?accessPolicy=${encodeURIComponent(accessPolicy)}`,
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
