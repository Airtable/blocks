import {ObjectMap} from '../private_utils';
import {SdkMode} from '../../sdk_mode';
import {Stat} from './stat';
import {FieldId, BlockInstallationId} from './hyper_ids';
import {FieldType, FieldData} from './field';
import {
    GlobalConfigUpdate,
    GlobalConfigData,
    GlobalConfigPath,
    GlobalConfigPathValidationResult,
} from './global_config';
import {BaseDataCore, ModelChange, BasePermissionData} from './base_core';
import {TableDataCore} from './table_core';
import {PermissionCheckResult} from './mutations_core';

/** @hidden */
export interface SdkInitDataCore {
    initialKvValuesByKey: GlobalConfigData;
    isDevelopmentMode: boolean;
    baseData: BaseDataCore<TableDataCore>;
    blockInstallationId: BlockInstallationId;
    isFirstRun: boolean;
    intentData: unknown;
    isUsingNewLookupCellValueFormat?: true | undefined;
}

/** @hidden */
type CellValueValidationResult = {isValid: true} | {isValid: false; reason: string};
/** @hidden */
export interface FieldTypeConfig {
    type: FieldType;
    options?: {[key: string]: unknown};
}
/** @hidden */
export interface FieldTypeProviderCore {
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
export interface AirtableInterfaceCore<SdkModeT extends SdkMode> {
    sdkInitData: SdkModeT['SdkInitDataT'];
    fieldTypeProvider: FieldTypeProviderCore;
    globalConfigHelpers: GlobalConfigHelpers;

    assertAllowedSdkPackageVersion: (packageName: string, packageVersion: string) => void;

    reloadFrame(): void;

    subscribeToModelUpdates(callback: (data: {changes: ReadonlyArray<ModelChange>}) => void): void;
    subscribeToGlobalConfigUpdates(
        callback: (data: {updates: ReadonlyArray<GlobalConfigUpdate>}) => void,
    ): void;

    applyMutationAsync(mutation: SdkModeT['MutationT'], opts?: {holdForMs?: number}): Promise<void>;
    checkPermissionsForMutation(
        mutation: SdkModeT['PartialMutationT'],
        basePermissionData: BasePermissionData,
    ): PermissionCheckResult;

    /**
     * internal utils
     */
    trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown}): void;
    trackExposure(featureName: string): void;
    sendStat(stat: Stat): void;
}
