// @flow
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from '../models/record';
import type {RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';

const AIRTABLE_INTERFACE_VERSION = 0;

// TODO(alex): add actual types
type HostToBlockMessageType = any;
type BlockUndoRedoMode = any;
type ViewportSizeConstraint = any;
type SdkInitData = any;

export type AirtableWriteAction<CompletionResponseData, AdditionalArgs: {}> = {
    completion: Promise<CompletionResponseData>,
} & AdditionalArgs;

/*
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 */
export interface AirtableInterface {
    sdkInitData: SdkInitData;

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

    // frontend only:
    registerHandler(type: HostToBlockMessageType, handlerFn: (data: Object) => void): void;
    fetchAndSubscribeToCursorDataAsync(): Promise<any>;
    unsubscribeFromCursorData(): void;
    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null): void;
    expandRecordList(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
    ): void;
    expandRecordPickerAsync(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
        shouldAllowCreatingRecord: boolean,
    ): Promise<string | null>;
    reloadFrame(): void;
    setSettingsButtonVisibility(isVisible: boolean): void;
    setUndoRedoMode(mode: BlockUndoRedoMode): void;
    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint): void;
    enterFullscreen(): void;
    exitFullscreen(): void;
}

const getAirtableInterfaceAtVersion: (number => AirtableInterface) | void =
    window.__getAirtableInterfaceAtVersion;

if (!getAirtableInterfaceAtVersion) {
    throw new Error('@airtable/blocks can only run inside the block frame');
}

module.exports = getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
