import {FlowAnyObject} from '../private_utils';
import {BaseData, BasePermissionData} from '../types/base';
import {BlockInstallationId} from '../types/block';
import {HostToBlockMessageType} from '../types/block_frame';
import {GlobalConfigUpdate, GlobalConfigData} from '../global_config';
import {RecordData, RecordDef, RecordId} from '../types/record';
import {UndoRedoMode} from '../types/undo_redo';
import {ViewportSizeConstraint} from '../types/viewport';
import {Mutation, PartialMutation, PermissionCheckResult} from '../types/mutations';
import {TableId} from '../types/table';
import {ViewId} from '../types/view';
import {spawnError} from '../error_utils';

const AIRTABLE_INTERFACE_VERSION = 0;

export type SdkInitData = {
    initialKvValuesByKey: GlobalConfigData;
    isDevelopmentMode: boolean;
    baseData: BaseData;
    blockInstallationId: BlockInstallationId;
    // NOTE: these don't really make much sense in backend blocks.
    // TODO: figure out what to do with them.
    isFullscreen: boolean;
    isFirstRun: boolean;
};

interface IdGenerator {
    generateRecordId(): string;
}

interface UrlConstructor {
    getTableUrl(tableId: TableId): string;
    getViewUrl(viewId: ViewId, tableId: TableId): string;
    getRecordUrl(recordId: RecordId, tableId: TableId): string;
}

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 *
 * @hidden
 */
export interface AirtableInterface {
    sdkInitData: SdkInitData;
    idGenerator: IdGenerator;
    urlConstructor: UrlConstructor;

    assertAllowedSdkPackageVersion: (packageName: string, packageVersion: string) => void;

    /*
     * globalConfig
     */
    setMultipleKvPathsAsync(updates: Array<GlobalConfigUpdate>): Promise<void>;

    /*
     * table
     */
    fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any>;
    unsubscribeFromTableData(tableId: string): void;
    fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: string,
        fieldIds: Array<string>,
    ): Promise<any>;
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>): void;
    setCellValuesAsync(
        tableId: string,
        cellValuesByRecordIdThenFieldId: {[key: string]: RecordDef},
    ): Promise<void>;
    deleteRecordsAsync(tableId: string, recordIds: Array<string>): Promise<void>;
    createRecordsAsync(tableId: string, recordDefs: Array<RecordData>): Promise<void>;

    /*
     * view
     */
    fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any>;
    unsubscribeFromViewData(tableId: string, viewId: string): void;
    fetchDefaultCellValuesByFieldIdAsync(
        tableId: string,
        viewId: string | null,
    ): Promise<{[key: string]: unknown}>;

    applyMutationAsync(mutation: Mutation, opts?: {holdForMs?: number}): Promise<void>;
    checkPermissionsForMutation(
        mutation: PartialMutation,
        basePermissionData: BasePermissionData,
    ): PermissionCheckResult;

    // frontend only:
    registerHandler(type: HostToBlockMessageType, handlerFn: (data: FlowAnyObject) => void): void;
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
    setUndoRedoMode(mode: UndoRedoMode): void;
    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint): void;
    enterFullscreen(): void;
    exitFullscreen(): void;
}

const getAirtableInterfaceAtVersion: ((arg1: number) => AirtableInterface) | void = (window as any)
    .__getAirtableInterfaceAtVersion;

if (!getAirtableInterfaceAtVersion) {
    throw spawnError('@airtable/blocks can only run inside the block frame');
}

export default getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
