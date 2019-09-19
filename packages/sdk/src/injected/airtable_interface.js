// @flow
import {type BaseData, type BasePermissionData} from '../types/base';
import {type BlockInstallationId} from '../types/block';
import {type HostToBlockMessageType} from '../types/block_frame';
import {type GlobalConfigUpdate, type GlobalConfigData} from '../global_config';
import {type RecordData, type RecordDef} from '../types/record';
import {type UndoRedoMode} from '../types/undo_redo';
import {type ViewportSizeConstraint} from '../types/viewport';
import {type Mutation, type PartialMutation, type PermissionCheckResult} from '../types/mutations';
import {spawnError} from '../error_utils';

const AIRTABLE_INTERFACE_VERSION = 0;

export type SdkInitData = {|
    initialKvValuesByKey: GlobalConfigData,
    isDevelopmentMode: boolean,
    baseData: BaseData,
    blockInstallationId: BlockInstallationId,

    isFullscreen: boolean,
    isFirstRun: boolean,
|};

type IdGenerator = {|
    generateRecordId: () => string,
|};

/*
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 */
export interface AirtableInterface {
    sdkInitData: SdkInitData;
    idGenerator: IdGenerator;

    assertAllowedSdkPackageVersion: (packageName: string, packageVersion: string) => void;

    /*
     * globalConfig
     */
    setMultipleKvPathsAsync(updates: Array<GlobalConfigUpdate>): Promise<void>;

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
    createRecordsAsync(tableId: string, recordDefs: Array<RecordData>): Promise<void>;

    /*
     * view
     */
    fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any>; // eslint-disable-line flowtype/no-weak-types
    unsubscribeFromViewData(tableId: string, viewId: string): void;
    fetchDefaultCellValuesByFieldIdAsync(
        tableId: string,
        viewId: string | null,
    ): Promise<{[string]: mixed}>;

    applyMutationAsync(mutation: Mutation, opts?: {holdForMs?: number}): Promise<void>;
    checkPermissionsForMutation(
        mutation: PartialMutation,
        basePermissionData: BasePermissionData,
    ): PermissionCheckResult;

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
    setUndoRedoMode(mode: UndoRedoMode): void;
    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint): void;
    enterFullscreen(): void;
    exitFullscreen(): void;
}

const getAirtableInterfaceAtVersion: (number => AirtableInterface) | void =
    window.__getAirtableInterfaceAtVersion;

if (!getAirtableInterfaceAtVersion) {
    throw spawnError('@airtable/blocks can only run inside the block frame');
}

export default getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
