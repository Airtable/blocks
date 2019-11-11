import {FlowAnyObject, ObjectMap} from '../private_utils';
import {AggregatorKey} from '../types/aggregators';
import {BaseData, BasePermissionData} from '../types/base';
import {BlockInstallationId} from '../types/block';
import {HostToBlockMessageType} from '../types/block_frame';
import {FieldData, FieldId, FieldType} from '../types/field';
import {GlobalConfigUpdate, GlobalConfigData} from '../global_config';
import {RecordData, RecordDef, RecordId} from '../types/record';
import {UndoRedoMode} from '../types/undo_redo';
import {ViewportSizeConstraint} from '../types/viewport';
import {Mutation, PartialMutation, PermissionCheckResult} from '../types/mutations';
import {TableId} from '../types/table';
import {ViewId} from '../types/view';
import {NormalizedSortConfig} from '../models/record_query_result';
import {spawnError} from '../error_utils';

const AIRTABLE_INTERFACE_VERSION = 0;

/** @hidden */
export interface SdkInitData {
    initialKvValuesByKey: GlobalConfigData;
    isDevelopmentMode: boolean;
    baseData: BaseData;
    blockInstallationId: BlockInstallationId;
    isFullscreen: boolean;
    isFirstRun: boolean;
}

/** @hidden */
interface IdGenerator {
    generateRecordId(): string;
}

/** @hidden */
interface UrlConstructor {
    getTableUrl(tableId: TableId): string;
    getViewUrl(viewId: ViewId, tableId: TableId): string;
    getRecordUrl(recordId: RecordId, tableId: TableId): string;
    getAttachmentClientUrl(
        appInterface: AppInterface,
        attachmentId: string,
        attachmentUrl: string,
    ): string;
}

/** @hidden */
interface AggregatorConfig {
    key: AggregatorKey;
    displayName: string;
    shortDisplayName: string;
}

/** @hidden */
interface Aggregators {
    aggregate(
        appInterface: AppInterface,
        summaryFunctionKey: AggregatorKey,
        cellValues: Array<unknown>,
        fieldData: FieldData,
    ): unknown;
    aggregateToString(
        appInterface: AppInterface,
        summaryFunctionKey: AggregatorKey,
        cellValues: Array<unknown>,
        fieldData: FieldData,
    ): string;
    getAggregatorConfig(summaryFunctionKey: AggregatorKey): AggregatorConfig;
    getAllAvailableAggregatorKeys(): Array<AggregatorKey>;
    getAvailableAggregatorKeysForField(fieldData: FieldData): Array<AggregatorKey>;
}

/** @hidden */
type CellValueValidationResult = {isValid: true} | {isValid: false; reason: string};
/** @hidden */
interface FieldTypeConfig {
    type: FieldType;
    options?: {[key: string]: unknown};
}
/** @hidden */
interface FieldUiConfig {
    iconName: string;
    desiredCellWidthForRecordCard: number;
    minimumCellWidthForRecordCard: number;
}

/** @hidden */
interface FieldTypeProvider {
    isComputed(fieldData: FieldData): boolean;
    validateCellValueForUpdate(
        appInterface: AppInterface,
        newCellValue: unknown,
        currentCellValue: unknown,
        fieldData: FieldData,
    ): CellValueValidationResult;
    getConfig(
        appInterface: AppInterface,
        fieldData: FieldData,
        fieldNamesById: ObjectMap<FieldId, string>,
    ): FieldTypeConfig;
    convertStringToCellValue(
        appInterface: AppInterface,
        string: string,
        fieldData: FieldData,
    ): unknown;
    convertCellValueToString(
        appInterface: AppInterface,
        cellValue: unknown,
        fieldData: FieldData,
    ): string;
    getCellRendererData(
        appInterface: AppInterface,
        cellValue: unknown,
        fieldData: FieldData,
        shouldWrap: boolean,
    ): {cellValueHtml: string; attributes: {[key: string]: unknown}};
    getUiConfig: (appInterface: AppInterface, fieldData: FieldData) => FieldUiConfig;
}

/**
 * AppInterface should never be used directly by the SDK, so we don't describe the type.
 *
 * @hidden
 */
export type AppInterface = unknown;

/** @hidden */
export interface VisList {
    removeRecordIds(recordIds: Array<RecordId>): void;
    addRecordData(recordData: RecordData): void;
    getOrderedRecordIds(): Array<RecordId>;
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
    aggregators: Aggregators;
    fieldTypeProvider: FieldTypeProvider;

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
    createVisList(
        appInterface: AppInterface,
        recordDatas: Array<RecordData>,
        fieldDatas: Array<FieldData>,
        sorts: Array<NormalizedSortConfig>,
    ): VisList;
}

const getAirtableInterfaceAtVersion: ((arg1: number) => AirtableInterface) | void = (window as any)
    .__getAirtableInterfaceAtVersion;

if (!getAirtableInterfaceAtVersion) {
    throw spawnError('@airtable/blocks can only run inside the block frame');
}

export default getAirtableInterfaceAtVersion(AIRTABLE_INTERFACE_VERSION);
