// @flow
const {h, u} = require('client_server_shared/hu');
const wrappedRequest = require('block_sdk/backend/helpers/wrapped_request');

class AirtableApiClient {
    applicationId: string;
    blockInstallationId: string;
    _apiAccessPolicyString: string;
    _apiBaseUrl: string;
    constructor(eventData: {
        applicationId: string,
        blockInstallationId: string,
        apiAccessPolicyString: string,
        apiBaseUrl: string,
    }) {
        this.applicationId = eventData.applicationId;
        this.blockInstallationId = eventData.blockInstallationId;
        this._apiAccessPolicyString = eventData.apiAccessPolicyString;
        this._apiBaseUrl = eventData.apiBaseUrl;
    }
    _getAbsoluteUrl(relativePath: string): string {
        return `${this._apiBaseUrl}${relativePath}`;
    }
    _getAccessPolicyHeaders(): {'x-airtable-access-policy': string} {
        return {
            'x-airtable-access-policy': this._apiAccessPolicyString,
        };
    }
    async patchAsync(urlPath: string, body: Object): Promise<Object> {
        const url = this._getAbsoluteUrl(urlPath);
        const response = await wrappedRequest.patchAsync({
            uri: url,
            body,
            headers: this._getAccessPolicyHeaders(),
            json: true,
        });
        return response;
    }
    async postAsync(urlPath: string, body: Object): Promise<Object> {
        const url = this._getAbsoluteUrl(urlPath);
        const response = await wrappedRequest.postAsync({
            uri: url,
            body,
            headers: this._getAccessPolicyHeaders(),
            json: true,
        });
        return response;
    }
}

module.exports = AirtableApiClient;
