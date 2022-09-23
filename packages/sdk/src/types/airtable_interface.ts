import {ObjectMap} from '../private_utils';
import {NormalizedSortConfig} from '../models/record_query_result';
import {Stat} from './stat';
import {AggregatorKey} from './aggregators';
import {BaseData, BasePermissionData, ModelChange} from './base';
import {BlockInstallationId} from './block';
import {CursorData} from './cursor';
import {FieldData, FieldId, FieldType} from './field';
import {RecordActionData, RecordActionDataCallback} from './record_action_data';
import {
    GlobalConfigUpdate,
    GlobalConfigData,
    GlobalConfigPath,
    GlobalConfigPathValidationResult,
} from './global_config';
import {RecordData, RecordId} from './record';
import {UndoRedoMode} from './undo_redo';
import {ViewportSizeConstraint} from './viewport';
import {
    Mutation,
    PartialMutation,
    PermissionCheckResult,
    UpdateFieldOptionsOpts,
} from './mutations';
import {TableId} from './table';
import {
    GroupData,
    ViewColorsByRecordIdData,
    ViewFieldOrderData,
    ViewId,
    GroupLevelData,
} from './view';
import {RequestJson, ResponseJson} from './backend_fetch_types';

/** @hidden */
export enum BlockRunContextType {
    DASHBOARD_APP = 'dashboardApp',
    VIEW = 'view',
}

/** @hidden */
export interface BlockInstallationPageBlockRunContext {
    type: BlockRunContextType.DASHBOARD_APP;
}

/** @hidden */
export interface ViewBlockRunContext {
    type: BlockRunContextType.VIEW;
    tableId: TableId;
    viewId: ViewId;
}

/** @hidden */
export type BlockRunContext = BlockInstallationPageBlockRunContext | ViewBlockRunContext;

/** @hidden */
export interface PartialViewData {
    visibleRecordIds: Array<string>;
    fieldOrder: ViewFieldOrderData;
    colorsByRecordId: ViewColorsByRecordIdData | null;
    groups?: Array<GroupData> | null;
    groupLevels?: Array<GroupLevelData> | null;
}

/** @hidden */
export type NormalizedGroupLevel = GroupLevelData;

/** @hidden */
export interface NormalizedViewMetadata {
    /** Group levels, can be null or unspecified (null to clear, unspecified to not overwrite) */
    groupLevels?: Array<NormalizedGroupLevel> | null | undefined;
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
    runContext: BlockRunContext;
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
        opts?: UpdateFieldOptionsOpts,
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
        opts?: {parseDateCellValueInColumnTimeZone?: boolean},
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
    performBackendFetchAsync(requestJson: RequestJson): Promise<ResponseJson>;

    /**
     * internal utils
     */
    trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown}): void;
    trackExposure(featureName: string): void;
    sendStat(stat: Stat): void;
}
