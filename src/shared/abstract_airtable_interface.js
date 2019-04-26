// @flow
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'block_sdk/shared/models/record';
import type {RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';

export type AirtableWriteAction<CompletionResponseData, AdditionalArgs: {}> = {
    completion: Promise<CompletionResponseData>,
} & AdditionalArgs;

/*
 * AbstractAirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 */
export interface AbstractAirtableInterface {
    /*
     * globalConfig
     */
    setMultipleKvPathsAsync(updates: Array<BlockKvUpdate>): Promise<void>;

    /*
     * table
     */
    fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any>; // eslint-disable-line flowtype/no-weak-types
    unsubscribeFromTableData(tableId: string): void;
    fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: string,
        fieldIds: Array<string>,
    ): Promise<any>; // eslint-disable-line flowtype/no-weak-types
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>): void;
    setCellValuesAsync(
        tableId: string,
        cellValuesByRecordIdThenFieldId: {[string]: RecordDef},
    ): Promise<void>;
    deleteRecordsAsync(tableId: string, recordIds: Array<string>): Promise<void>;
    createRecordsAsync(tableId: string, recordDefs: Array<RecordDataForBlocks>): Promise<void>;

    /*
     * view
     */
    fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any>; // eslint-disable-line flowtype/no-weak-types
    unsubscribeFromViewData(tableId: string, viewId: string): void;
}
