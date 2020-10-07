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
import {TableId} from '../../src/types/table';
import {ViewId} from '../../src/types/view';
import {Mutation, PermissionCheckResult} from '../../src/types/mutations';
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
    convertStringToCellValue(appInterface: AppInterface, string: string, fieldData: FieldData) {
        return '';
    },
    validateCellValueForUpdate(
        appInterface: AppInterface,
        newCellValue: unknown,
        currentCellValue: unknown,
        fieldData: FieldData,
    ) {
        return {isValid: true};
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
    unsubscribeFromCellValuesInFields: any;
    setCellValuesAsync: any;
    deleteRecordsAsync: any;
    createRecordsAsync: any;
    fetchAndSubscribeToViewDataAsync: any;
    unsubscribeFromViewData: any;
    fetchDefaultCellValuesByFieldIdAsync: any;
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
        throw spawnError('unimplemented');
    }
    fetchAndSubscribeToCursorDataAsync(): Promise<any> {
        throw spawnError('unimplemented');
    }
    fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> {
        throw spawnError('unimplemented');
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

    get idGenerator() {
        return {
            generateRecordId: () => 'recGeneratedMockId',
            generateFieldId: () => 'fldGeneratedMockId',
            generateTableId: () => 'tblGeneratedMockId',
        };
    }
}

export default MockAirtableInterface;
