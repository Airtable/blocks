import {type NormalizedSortConfig} from '../models/record_query_result';
import {type TableId, type RecordId, type ViewId} from '../../shared/types/hyper_ids';
import {
    type AirtableInterfaceCore,
    type AppInterface,
    type FieldTypeProviderCore,
    type FieldTypeConfig,
    type SdkInitDataCore,
} from '../../shared/types/airtable_interface_core';
import {type BaseSdkMode} from '../../sdk_mode';
import {type FieldData} from './field';
import {type RecordData} from './record';
import {type ViewportSizeConstraint} from './viewport';
import {type AggregatorKey} from './aggregators';
import {type BaseData} from './base';
import {type CursorData} from './cursor';
import {type RecordActionData, type RecordActionDataCallback} from './record_action_data';
import {type UndoRedoMode} from './undo_redo';
import {type UpdateFieldOptionsOpts} from './mutations';
import {
    type GroupData,
    type ViewColorsByRecordIdData,
    type ViewFieldOrderData,
    type GroupLevelData,
} from './view';
import {type RequestJson, type ResponseJson} from './backend_fetch_types';

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
type FieldConfigValidationResult = {isValid: true} | {isValid: false; reason: string};
/** @hidden */
interface FieldUiConfig {
    iconName: string;
    desiredCellWidthForRecordCard: number;
    minimumCellWidthForRecordCard: number;
}
/** @hidden */
export interface FieldTypeProvider extends FieldTypeProviderCore {
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
    getUiConfig: (appInterface: AppInterface, fieldData: FieldData) => FieldUiConfig;
}

/** @hidden */
export interface PartialViewData {
    visibleRecordIds: Array<string>;
    fieldOrder: ViewFieldOrderData;
    colorsByRecordId?: ViewColorsByRecordIdData | null;
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
export interface SdkInitData extends SdkInitDataCore {
    runContext: BlockRunContext;
    baseData: BaseData;
    isFullscreen: boolean;
    locale?: string;
    defaultLocale?: string;
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
export interface VisList {
    removeRecordIds(recordIds: Array<RecordId>): void;
    addRecordData(recordData: RecordData): void;
    getOrderedRecordIds(): Array<RecordId>;
}

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable.
 *
 * @hidden
 */
export interface AirtableInterface extends AirtableInterfaceCore<BaseSdkMode> {
    idGenerator: IdGenerator;
    urlConstructor: UrlConstructor;
    aggregators: Aggregators;

    fieldTypeProvider: FieldTypeProvider;

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
}
