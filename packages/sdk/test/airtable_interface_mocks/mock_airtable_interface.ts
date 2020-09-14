import {AggregatorKey} from '../../src/types/aggregators';
import {
    AggregatorConfig,
    Aggregators,
    AirtableInterface,
    AppInterface,
    FieldTypeConfig,
} from '../../src/types/airtable_interface';
import {cloneDeep, ObjectMap} from '../../src/private_utils';
import {spawnError} from '../../src/error_utils';
import {FieldData, FieldId} from '../../src/types/field';
import {ModelChange} from '../../src/types/base';
import {Mutation, PermissionCheckResult} from '../../src/types/mutations';
import projectTrackerData from './project_tracker';
const EventEmitter = require('events');

const aggregators = {
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

const fieldTypeProvider = {
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
};

class MockAirtableInterface extends EventEmitter implements AirtableInterface {
    aggregators: Aggregators;
    fieldTypeProvider: any;
    sdkInitData: any;
    urlConstructor: any;
    globalConfigHelpers: any;
    setMultipleKvPathsAsync: any;
    unsubscribeFromTableData: any;
    fetchAndSubscribeToCellValuesInFieldsAsync: any;
    unsubscribeFromCellValuesInFields: any;
    setCellValuesAsync: any;
    deleteRecordsAsync: any;
    createRecordsAsync: any;
    fetchAndSubscribeToViewDataAsync: any;
    unsubscribeFromViewData: any;
    fetchDefaultCellValuesByFieldIdAsync: any;
    fetchAndSubscribeToCursorDataAsync: any;
    unsubscribeFromCursorData: any;
    expandRecord: any;
    expandRecordList: any;
    expandRecordPickerAsync: any;
    reloadFrame: any;
    setSettingsButtonVisibility: any;
    setUndoRedoMode: any;
    setFullscreenMaxSize: any;
    enterFullscreen: any;
    exitFullscreen: any;
    createVisList: any;
    setActiveViewOrTable: any;
    fetchAndSubscribeToPerformRecordActionAsync: any;
    trackEvent: any;
    sendStat: any;

    constructor(initData: any) {
        super();
        this.aggregators = aggregators;
        this.fieldTypeProvider = fieldTypeProvider;
        this._initData = cloneDeep(initData);
        this.reset();
    }

    static projectTrackerExample() {
        return new MockAirtableInterface(projectTrackerData);
    }

    reset() {
        this.removeAllListeners();
        this.sdkInitData = cloneDeep(this._initData);
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

    subscribeToGlobalConfigUpdates() {}
    subscribeToSettingsButtonClick() {}
    subscribeToEnterFullScreen() {}
    subscribeToExitFullScreen() {}
    subscribeToFocus() {}
    fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> {
        throw spawnError('unimplemented');
    }

    triggerModelUpdates(changes: ReadonlyArray<ModelChange>) {
        this.emit('modelupdates', {changes});
    }

    triggerGlobalConfigUpdates() {}
    triggerSettingsButtonClick() {}
    triggerEnterFullScreen() {}
    triggerExitFullScreen() {}
    triggerFocus() {}

    get idGenerator() {
        return {
            generateRecordId: () => 'recGeneratedMockId',
            generateFieldId: () => 'fldGeneratedMockId',
            generateTableId: () => 'tblGeneratedMockId',
        };
    }
}

export default MockAirtableInterface;
