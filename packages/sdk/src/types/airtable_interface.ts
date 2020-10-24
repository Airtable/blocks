import {ObjectMap} from '../private_utils';
import {Stat} from '../types/stat';
import {AggregatorKey} from '../types/aggregators';
import {BaseData, BasePermissionData, ModelChange} from '../types/base';
import {BlockInstallationId} from '../types/block';
import {CursorData} from '../types/cursor';
import {FieldData, FieldId, FieldType} from '../types/field';
import {RecordActionData, RecordActionDataCallback} from '../types/record_action_data';
import {
    GlobalConfigUpdate,
    GlobalConfigData,
    GlobalConfigPath,
    GlobalConfigPathValidationResult,
} from '../types/global_config';
import {RecordData, RecordId} from '../types/record';
import {UndoRedoMode} from '../types/undo_redo';
import {ViewportSizeConstraint} from '../types/viewport';
import {Mutation, PartialMutation, PermissionCheckResult} from '../types/mutations';
import {TableId} from '../types/table';
import {ViewColorsByRecordIdData, ViewFieldOrderData, ViewId} from '../types/view';
import {NormalizedSortConfig} from '../models/record_query_result';

/** @hidden */
export interface PartialViewData {
    visibleRecordIds: Array<string>;
    fieldOrder: ViewFieldOrderData;
    colorsByRecordId: ViewColorsByRecordIdData | null;
}

/** @hidden */
export interface SdkInitData {
    initialKvValuesByKey: GlobalConfigData;
    isDevelopmentMode: boolean;
    baseData: BaseData;
    blockInstallationId: BlockInstallationId;
    isFullscreen: boolean;
    isFirstRun: boolean;
    intentData: unknown;
    isUsingNewLookupCellValueFormat?: true | undefined;
}

/** @hidden */
export interface IdGenerator {
    generateRecordId(): string;
    generateFieldId(): string;
    generateTableId(): string;
}

/** @hidden */
export interface UrlConstructor {
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
export interface AggregatorConfig {
    key: AggregatorKey;
    displayName: string;
    shortDisplayName: string;
}

/** @hidden */
export interface Aggregators {
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
type FieldConfigValidationResult = {isValid: true} | {isValid: false; reason: string};
/** @hidden */
export interface FieldTypeConfig {
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
export interface FieldTypeProvider {
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
    validateConfigForUpdate(
        appInterface: AppInterface,
        newConfig: FieldTypeConfig,
        currentConfig: FieldTypeConfig | null,
        fieldData: FieldData | null,
        billingPlanGrouping: string,
    ): FieldConfigValidationResult;
    canBePrimary(
        appInterface: AppInterface,
        config: FieldTypeConfig,
        billingPlanGrouping: string,
    ): boolean;
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

/** @hidden */
export interface GlobalConfigHelpers /**/ {
    validatePath(path: GlobalConfigPath, store: GlobalConfigData): GlobalConfigPathValidationResult;
    validateAndApplyUpdates(
        updates: ReadonlyArray<GlobalConfigUpdate>,
        store: GlobalConfigData,
    ): {
        newKvStore: GlobalConfigData;
        changedTopLevelKeys: Array<string>;
    };
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
    globalConfigHelpers: GlobalConfigHelpers;

    assertAllowedSdkPackageVersion: (packageName: string, packageVersion: string) => void;

    /**
     * table
     */
    fetchAndSubscribeToTableDataAsync(
        tableId: string,
    ): Promise<{recordsById: {[recordId: string]: RecordData}}>;
    unsubscribeFromTableData(tableId: string): void;
    fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: string,
        fieldIds: Array<string>,
    ): Promise<any>;
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>): void;

    /**
     * view
     */
    fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<PartialViewData>;
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
    subscribeToModelUpdates(callback: (data: {changes: ReadonlyArray<ModelChange>}) => void): void;
    subscribeToGlobalConfigUpdates(
        callback: (data: {updates: ReadonlyArray<GlobalConfigUpdate>}) => void,
    ): void;
    subscribeToSettingsButtonClick(callback: () => void): void;
    subscribeToEnterFullScreen(callback: () => void): void;
    subscribeToExitFullScreen(callback: () => void): void;
    subscribeToFocus(callback: () => void): void;
    fetchAndSubscribeToCursorDataAsync(): Promise<CursorData>;
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
    setActiveViewOrTable(tableId: TableId, viewId?: ViewId): void;
    fetchAndSubscribeToPerformRecordActionAsync(
        callback: RecordActionDataCallback,
    ): Promise<RecordActionData | null>;

    /**
     * internal utils
     */
    trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown}): void;
    sendStat(stat: Stat): void;
}
