// @flow
import type AirtableApiClient from 'block_sdk/backend/airtable_api_client';

class BlockNotifications {
    _endpointPrefix: string;
    _apiClient: AirtableApiClient;
    constructor(
        applicationId: string,
        blockInstallationId: string,
        apiClient: AirtableApiClient,
    ) {
        this._endpointPrefix = `/v2/bases/${applicationId}/blockInstallations/${blockInstallationId}`;
        this._apiClient = apiClient;
    }
    async sendAsync(args: {
        userIds: Array<string>,
        text: string,
    }) {
        const response = await this._apiClient.postAsync(`${this._endpointPrefix}/sendNotification`, {
            userIds: args.userIds,
            text: args.text,
        });

        if (response.statusCode !== 200) {
            let errorMessage;
            if (
                typeof response.body === 'object' &&
                response.body.errors &&
                response.body.errors[0] &&
                response.body.errors[0].message
            ) {
                errorMessage = response.body.errors[0].message;
            } else {
                errorMessage = `${response.statusCode}`;
            }
            throw new Error(`Failed to create notification: ${errorMessage}`);
        }
    }
}

module.exports = BlockNotifications;
