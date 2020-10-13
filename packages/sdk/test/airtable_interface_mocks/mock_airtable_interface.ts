import {AggregatorKey} from '../../src/types/aggregators';
import {
    AggregatorConfig,
    Aggregators,
    AirtableInterface,
    AppInterface,
    FieldTypeConfig,
    FieldTypeProvider,
    SdkInitData,
    UrlConstructor,
    GlobalConfigHelpers,
    PartialViewData,
    IdGenerator,
    VisList,
} from '../../src/types/airtable_interface';
import {cloneDeep, ObjectMap} from '../../src/private_utils';
import {spawnError} from '../../src/error_utils';
import {FieldData, FieldId} from '../../src/types/field';
import {ModelChange} from '../../src/types/base';
import {TableId} from '../../src/types/table';
import {ViewId} from '../../src/types/view';
import {Mutation, PermissionCheckResult} from '../../src/types/mutations';
import {CursorData} from '../../src/types/cursor';
import {RecordData} from '../../src/types/record';
import {RecordActionData} from '../../src/types/record_action_data';
import projectTrackerData from './project_tracker';
const EventEmitter = require('events');

// From the Jest documentation on `mockReset`:
//
// > This is useful when you want to completely reset a mock back to its
// > initial state. (Note that resetting a *spy* will result in a function with
// > no return value).
//
// In order to reset a Jest Spy to its initial state (which calls through to
// the authentic implementation), it must be removed via `mockRestore` and
// recreated using `jest.spyOn`.
const resetSpies = (target: {[key: string]: any}, names: string[]) => {
    for (const name of names) {
        if (jest.isMockFunction(target[name])) {
            target[name].mockRestore();
        }

        if (typeof target[name] === 'function') {
            jest.spyOn(target as any, name);
        }
    }
};

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

const fieldTypeProvider: FieldTypeProvider = {
    isComputed(fieldData: FieldData) {
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

const globalConfigHelpers: GlobalConfigHelpers = {
    validatePath(path, store) {
        return {isValid: true};
    },
    validateAndApplyUpdates(updates, store) {
        throw spawnError('validateAndApplyUpdates unimplemented');
    },
};

const idGenerator: IdGenerator = {
    generateRecordId: () => 'recGeneratedMockId',
    generateFieldId: () => 'fldGeneratedMockId',
    generateTableId: () => 'tblGeneratedMockId',
};

class MockAirtableInterface extends EventEmitter implements AirtableInterface {
    aggregators = aggregators as jest.Mocked<Aggregators>;
    fieldTypeProvider = fieldTypeProvider as jest.Mocked<FieldTypeProvider>;
    urlConstructor = urlConstructor as jest.Mocked<UrlConstructor>;
    globalConfigHelpers = globalConfigHelpers as jest.Mocked<GlobalConfigHelpers>;
    idGenerator = idGenerator as jest.Mocked<IdGenerator>;
    sdkInitData!: SdkInitData;

    private _initData: SdkInitData;

    constructor(initData: SdkInitData) {
        super();
        this._initData = cloneDeep(initData);
        this.reset();
    }

    static projectTrackerExample() {
        const iface = new MockAirtableInterface(projectTrackerData) as jest.Mocked<
            MockAirtableInterface
        >;
        iface.reset();
        return iface;
    }

    /**
     * Revert the mock interface to its initial state. This includes:
     *
     * - removing all event listeners
     * - restoring the database schema
     * - recreating the Jest "spies" for every instance method
     */
    reset() {
        this.removeAllListeners();
        this.sdkInitData = cloneDeep(this._initData);

        resetSpies(this, Object.getOwnPropertyNames(MockAirtableInterface.prototype));
        resetSpies(this.fieldTypeProvider, Object.keys(this.fieldTypeProvider));
        resetSpies(this.urlConstructor, Object.keys(this.urlConstructor));
        resetSpies(this.globalConfigHelpers, Object.keys(this.globalConfigHelpers));
        resetSpies(this.idGenerator, Object.keys(this.idGenerator));
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

    subscribeToModelUpdates(fn: Function) {
        this.on('modelupdates', fn);
    }

    setActiveViewOrTable(tableId: TableId, viewId: ViewId) {}

    // TODO(jugglinmike): Implement
    subscribeToGlobalConfigUpdates() {}
    subscribeToSettingsButtonClick() {}
    subscribeToEnterFullScreen() {}
    subscribeToExitFullScreen() {}
    subscribeToFocus() {}
    fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: TableId,
        fieldIds: Array<FieldId>,
    ): Promise<any> {
        throw spawnError('fetchAndSubscribeToCellValuesInFieldsAsync unimplemented');
    }
    fetchAndSubscribeToCursorDataAsync(): Promise<CursorData> {
        throw spawnError('fetchAndSubscribeToCursorDataAsync unimplemented');
    }
    fetchAndSubscribeToTableDataAsync(
        tableId: string,
    ): Promise<{recordsById: {[recordId: string]: RecordData}}> {
        throw spawnError('fetchAndSubscribeToTableDataAsync unimplemented');
    }
    fetchAndSubscribeToViewDataAsync(): Promise<PartialViewData> {
        throw spawnError('fetchAndSubscribeToViewDataAsync unimplemented');
    }
    fetchDefaultCellValuesByFieldIdAsync(): Promise<{[key: string]: unknown}> {
        throw spawnError('fetchDefaultCellValuesByFieldIdAsync unimplemented');
    }

    triggerModelUpdates(changes: ReadonlyArray<ModelChange>) {
        this.emit('modelupdates', {changes});
    }

    // TODO(jugglinmike): Implement
    triggerGlobalConfigUpdates() {}
    triggerSettingsButtonClick() {}
    triggerEnterFullScreen() {}
    triggerExitFullScreen() {}
    triggerFocus() {}

    unsubscribeFromCursorData() {}
    unsubscribeFromTableData() {}
    unsubscribeFromCellValuesInFields() {}
    unsubscribeFromViewData() {}

    expandRecord() {
        throw spawnError('expandRecord unimplemented');
    }
    expandRecordList() {
        throw spawnError('expandRecordList unimplemented');
    }
    expandRecordPickerAsync(): Promise<string | null> {
        throw spawnError('expandRecordPickerAsync unimplemented');
    }
    reloadFrame() {
        throw spawnError('reloadFrame unimplemented');
    }
    setSettingsButtonVisibility() {
        throw spawnError('setSettingsButtonVisibility unimplemented');
    }
    setUndoRedoMode() {
        throw spawnError('setUndoRedoMode unimplemented');
    }
    setFullscreenMaxSize() {
        throw spawnError('setFullscreenMaxSize unimplemented');
    }
    enterFullscreen() {
        throw spawnError('enterFullscreen unimplemented');
    }
    exitFullscreen() {
        throw spawnError('exitFullscreen unimplemented');
    }
    createVisList(): VisList {
        throw spawnError('createVisList unimplemented');
    }
    fetchAndSubscribeToPerformRecordActionAsync(): Promise<RecordActionData | null> {
        throw spawnError('fetchAndSubscribeToPerformRecordActionAsync unimplemented');
    }
    trackEvent() {
        throw spawnError('trackEvent unimplemented');
    }
    sendStat() {
        throw spawnError('sendStat unimplemented');
    }
}

export default MockAirtableInterface;
