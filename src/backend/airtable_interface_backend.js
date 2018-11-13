// @flow
const {h, u} = require('client_server_shared/hu');

import type {AbstractAirtableInterface} from 'block_sdk/shared/abstract_airtable_interface';
import type AirtableApiClient from 'block_sdk/backend/airtable_api_client';
import type {BlockKvStore, BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'block_sdk/shared/models/record';
import type {BaseDataForBlocks, RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';

class AirtableInterfaceBackend implements AbstractAirtableInterface {
    // Temporarily make apiClient public while we're still experimenting
    // with the backend SDK. This provides an escape hatch for making requests
    // directly to the API without going through the SDK.
    apiClient: AirtableApiClient;
    constructor(airtableApiClient: AirtableApiClient) {
        this.apiClient = airtableApiClient;
    }
    _throwIfResponseIsNot200(response: Object, messagePrefix: string) {
        if (response.statusCode !== 200) {
            const reasons = (response.body && response.body.errors) ?
                ': ' + response.body.errors.map(error => error.message).join(' ') :
                '';
            throw new Error(`${messagePrefix} (${response.statusCode})${reasons}`);
        }
    }
    async readBackendSdkInitDataAsync(args: {
        sdkVersion: number,
        shouldIncludeKvValuesByKey: boolean,
        shouldIncludeBaseData: boolean,
    }): Promise<{baseData?: BaseDataForBlocks, kvValuesByKey?: BlockKvStore}> {
        const {sdkVersion, shouldIncludeKvValuesByKey, shouldIncludeBaseData} = args;
        const response = await this.apiClient.postAsync(
            `/v2/bases/${this.apiClient.applicationId}/blockInstallations/${this.apiClient.blockInstallationId}/readBackendSdkInitData`,
            {sdkVersion, shouldIncludeKvValuesByKey, shouldIncludeBaseData},
        );
        this._throwIfResponseIsNot200(response, `Error fetching initial data for SDK (sdkVersion: ${sdkVersion})`);
        return response.body;
    }
    async setMultipleKvPathsAsync(updates: Array<BlockKvUpdate>): Promise<void> {
        // TODO: should we batch these?
        const response = await this.apiClient.patchAsync(
            `/v2/meta/${this.apiClient.applicationId}/blockInstallations/${this.apiClient.blockInstallationId}/globalConfig`,
            {updates},
        );
        this._throwIfResponseIsNot200(response, 'Error setting globalConfig values');
    }
    async _fetchRecordsAsync(tableId: string, fieldIdsOrNullIfAllFields: Array<string> | null): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        const recordsById = {};
        let cursor;
        do {
            const response = await this.apiClient.postAsync(
                `/v2/bases/${this.apiClient.applicationId}/tables/${tableId}/records/read`,
                {
                    filterFieldsBy: fieldIdsOrNullIfAllFields !== null ? {fields: fieldIdsOrNullIfAllFields} : undefined,
                    cursor,
                },
            );
            this._throwIfResponseIsNot200(response, 'Error reading records');

            for (const record of response.body.records) {
                const serializedCellValuesByFieldId = {};
                // NOTE: the public API returns cell values nested within an obj, but the SDK
                // currently doesn't expect this additional level of nesting, so for now, we'll
                // unwrap the cell values.
                // TODO: update the SDK (frontend and backend) to handle the nesting. This would
                // be a breaking change.
                for (const [fieldId, cellValue] of u.entries(record.cellValuesByFieldId)) {
                    serializedCellValuesByFieldId[fieldId] = cellValue.value;
                }

                const serializedRecord = {
                    id: record.id,
                    createdTime: record.createdTime,
                    cellValuesByFieldId: serializedCellValuesByFieldId,
                    // HACK: the public API doesn't currently return the comment count.
                    commentCount: 0,
                };
                recordsById[record.id] = serializedRecord;
            }
            cursor = response.body.cursor;
        } while (cursor);
        return {recordsById};
    }
    async fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._fetchRecordsAsync(tableId, null);
    }
    unsubscribeFromTableData(tableId: string) {
        // No-op
    }
    async fetchAndSubscribeToCellValuesInFieldsAsync(tableId: string, fieldIds: Array<string>): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._fetchRecordsAsync(tableId, fieldIds);
    }
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>) {
        // No-op
    }
    async setCellValuesAsync(tableId: string, cellValuesByRecordIdThenFieldId: {[string]: RecordDef}): Promise<void> {
        const records = u.map(cellValuesByRecordIdThenFieldId, (cellValuesByFieldId, recordId) => {
            const cellValuesByField = {};
            for (const [fieldId, cellValue] of u.entries(cellValuesByFieldId)) {
                cellValuesByField[fieldId] = {value: cellValue};
            }
            return {
                id: recordId,
                cellValuesByField,
            };
        });

        const response = await this.apiClient.postAsync(
            `/v2/bases/${this.apiClient.applicationId}/tables/${tableId}/records/update`,
            {
                records,
            },
        );
        this._throwIfResponseIsNot200(response, 'Error updating records');
    }
    async deleteRecordsAsync(tableId: string, recordIds: Array<string>): Promise<void> {
        const response = await this.apiClient.postAsync(
            `/v2/bases/${this.apiClient.applicationId}/tables/${tableId}/records/delete`,
            {
                deleteRecordsBy: {
                    recordIds,
                },
            },
        );
        this._throwIfResponseIsNot200(response, 'Error deleting records');
    }
    async createRecordsAsync(tableId: string, recordDefs: Array<RecordDataForBlocks>): Promise<void> {
        const record = recordDefs.map(recordDef => {
            const cellValuesByField = {};
            for (const [fieldId, cellValue] of u.entries(recordDef.cellValuesByFieldId)) {
                cellValuesByField[fieldId] = {value: cellValue};
            }
            return {
                id: recordDef.id,
                cellValuesByField,
            };
        });
        const response = await this.apiClient.postAsync(
            `/v2/bases/${this.apiClient.applicationId}/tables/${tableId}/records/create`,
            {
                records: record,
            },
        );
        this._throwIfResponseIsNot200(response, 'Error creating records');
    }
    async fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        throw new Error('not implemented yet');
    }
    unsubscribeFromViewData(tableId: string, viewId: string) {
        // No-op
    }
}

module.exports = AirtableInterfaceBackend;
