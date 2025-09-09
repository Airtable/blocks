import EventEmitter from 'events';
import {type AggregatorKey} from '../../base/types/aggregators';
import {
    type AppInterface,
    type FieldTypeConfig,
    type GlobalConfigHelpers,
} from '../../shared/types/airtable_interface_core';
import {
    type AggregatorConfig,
    type Aggregators,
    type AirtableInterface,
    type FieldTypeProvider,
    type SdkInitData,
    type UrlConstructor,
    type PartialViewData,
    type IdGenerator,
    type VisList,
} from '../../base/types/airtable_interface';
import {type TableId, type FieldId, type ViewId, type RecordId} from '../../shared/types/hyper_ids';
import {cloneDeep, type ObjectMap} from '../../shared/private_utils';
import {spawnError} from '../../shared/error_utils';
import {type ModelChange} from '../../shared/types/base_core';
import {type FieldData} from '../../base/types/field';
import {type RecordData} from '../../base/types/record';
import {type ViewportSizeConstraint} from '../../base/types/viewport';
import {type PermissionCheckResult} from '../../shared/types/mutations_core';
import {type Mutation} from '../../base/types/mutations';
import {type NormalizedSortConfig} from '../../base/models/record_query_result';
import {type RequestJson, type ResponseJson} from '../../base/types/backend_fetch_types';
import {type CursorData} from '../../base/types/cursor';
import {type RecordActionData} from '../../base/types/record_action_data';

/** @internal */
const aggregators: Aggregators = {
    aggregate(
        appInterface: AppInterface,
        summaryFunctionKey: AggregatorKey,
        cellValues: Array<unknown>,
        fieldData: FieldData,
    ): unknown {
        return null;
    },
    aggregateToString(
        appInterface: AppInterface,
        summaryFunctionKey: AggregatorKey,
        cellValues: Array<unknown>,
        fieldData: FieldData,
    ): string {
        return '';
    },
    getAggregatorConfig(summaryFunctionKey: AggregatorKey): AggregatorConfig {
        return {
            key: '',
            displayName: '',
            shortDisplayName: '',
        };
    },
    getAllAvailableAggregatorKeys(): Array<AggregatorKey> {
        return [];
    },
    getAvailableAggregatorKeysForField(fieldData: FieldData): Array<AggregatorKey> {
        return [];
    },
};

/** @internal */
const fieldTypeProvider: FieldTypeProvider = {
    isComputed(fieldData: FieldData): boolean {
        return false;
    },
    validateConfigForUpdate: () => {
        return {isValid: true};
    },
    getConfig: (
        appInterface: AppInterface,
        fieldData: FieldData,
        fieldNamesById: ObjectMap<FieldId, string>,
    ) => {
        return {
            type: fieldData.type,
            options: fieldData.typeOptions,
        } as FieldTypeConfig;
    },
    canBePrimary: () => {
        return true;
    },
    convertStringToCellValue(appInterface: AppInterface, string: string, fieldData: FieldData) {
        return '';
    },
    convertCellValueToString(appInterface: AppInterface, cellValue: unknown, fieldData: FieldData) {
        return '';
    },
    getCellRendererData(
        appInterface: AppInterface,
        cellValue: unknown,
        fieldData: FieldData,
        shouldWrap: boolean,
    ) {
        return {cellValueHtml: `<pre>${JSON.stringify(cellValue)}</pre>`, attributes: {}};
    },
    validateCellValueForUpdate(
        appInterface: AppInterface,
        newCellValue: unknown,
        currentCellValue: unknown,
        fieldData: FieldData,
    ) {
        return {isValid: true};
    },
    getUiConfig(appInterface: AppInterface, fieldData: FieldData) {
        return {
            iconName: '',
            desiredCellWidthForRecordCard: 0,
            minimumCellWidthForRecordCard: 0,
        };
    },
};

/** @internal */
const urlConstructor: UrlConstructor = {
    getTableUrl(tableId) {
        return `https://airtable.test/${tableId}`;
    },
    getViewUrl(viewId, tableId) {
        return `https://airtable.test/${tableId}/${viewId}`;
    },
    getRecordUrl(recordId, tableId) {
        return `https://airtable.test/${tableId}/${recordId}`;
    },
    getAttachmentClientUrl(appInterface, attachmentId, attachmentUrl) {
        return attachmentUrl;
    },
};

/** @internal */
const globalConfigHelpers: GlobalConfigHelpers = {
    validatePath(path, store) {
        return {isValid: true};
    },
    validateAndApplyUpdates(updates, store) {
        throw spawnError('validateAndApplyUpdates unimplemented');
    },
};

/** @internal */
const idGenerator: IdGenerator = {
    generateRecordId: () => 'recGeneratedMockId',
    generateFieldId: () => 'fldGeneratedMockId',
    generateTableId: () => 'tblGeneratedMockId',
};

/**
 * An abstract base class with a common interface exposed to both Blocks SDK's
 * internal automated test suite and the blocks-testing public repo.
 *
 * @hidden
 */
export abstract class AbstractMockAirtableInterface
    extends EventEmitter
    implements AirtableInterface
{
    sdkInitData!: SdkInitData;

    private _initData: SdkInitData;

    constructor(initData: SdkInitData) {
        super();
        this._initData = cloneDeep(initData);
        this.reset();
    }

    /**
     * Revert the mock interface to its initial state. This includes:
     *
     * - removing all event listeners
     * - restoring the database schema
     */
    reset() {
        this.removeAllListeners();
        this.sdkInitData = cloneDeep(this._initData);
    }

    get aggregators() {
        return aggregators;
    }

    get fieldTypeProvider() {
        return fieldTypeProvider;
    }

    get urlConstructor() {
        return urlConstructor;
    }

    get globalConfigHelpers() {
        return globalConfigHelpers;
    }

    get idGenerator() {
        return idGenerator;
    }

    assertAllowedSdkPackageVersion() {}

    applyMutationAsync(mutation: Mutation, opts?: {holdForMs?: number}): Promise<void> {
        return Promise.resolve();
    }

    checkPermissionsForMutation(mutation: Mutation): PermissionCheckResult {
        return {
            hasPermission: true,
        };
    }

    createVisList(
        appInterface: AppInterface,
        recordDatas: Array<RecordData>,
        fieldDatas: Array<FieldData>,
        sorts: Array<NormalizedSortConfig>,
    ): VisList {
        return {
            removeRecordIds(recordIds: Array<RecordId>) {},
            addRecordData(recordData: RecordData) {},
            getOrderedRecordIds() {
                return recordDatas.map(({id}) => id);
            },
        };
    }

    subscribeToModelUpdates(fn: (...args: any[]) => void) {
        this.on('modelupdates', fn);
    }

    setActiveViewOrTable(tableId: TableId, viewId: ViewId) {}

    subscribeToGlobalConfigUpdates() {}
    subscribeToSettingsButtonClick() {}
    subscribeToEnterFullScreen() {}
    subscribeToExitFullScreen() {}
    subscribeToFocus() {}
    abstract fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: TableId,
        fieldIds: Array<FieldId>,
    ): Promise<any>;
    abstract fetchAndSubscribeToCursorDataAsync(): Promise<CursorData>;
    abstract fetchAndSubscribeToTableDataAsync(
        tableId: string,
    ): Promise<{recordsById: {[recordId: string]: RecordData}}>;
    abstract fetchAndSubscribeToViewDataAsync(
        tableId: string,
        viewId: string,
    ): Promise<PartialViewData>;
    abstract fetchDefaultCellValuesByFieldIdAsync(): Promise<{[key: string]: unknown}>;

    triggerModelUpdates(changes: ReadonlyArray<ModelChange>) {
        this.emit('modelupdates', {changes});
    }

    triggerGlobalConfigUpdates() {}
    triggerSettingsButtonClick() {}
    triggerEnterFullScreen() {}
    triggerExitFullScreen() {}
    triggerFocus() {}

    unsubscribeFromCursorData() {}
    unsubscribeFromTableData() {}
    unsubscribeFromCellValuesInFields() {}
    unsubscribeFromViewData() {}

    abstract expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null): void;
    abstract expandRecordList(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
    ): void;
    abstract expandRecordPickerAsync(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
        shouldAllowCreatingRecord: boolean,
    ): Promise<string | null>;
    abstract reloadFrame(): void;
    abstract setSettingsButtonVisibility(): void;
    abstract setUndoRedoMode(): void;
    abstract setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint): void;
    abstract enterFullscreen(): void;
    abstract exitFullscreen(): void;
    abstract fetchAndSubscribeToPerformRecordActionAsync(): Promise<RecordActionData | null>;
    abstract trackEvent(): void;
    abstract trackExposure(): void;
    abstract sendStat(): void;
    abstract performBackendFetchAsync(requestJson: RequestJson): Promise<ResponseJson>;
}
