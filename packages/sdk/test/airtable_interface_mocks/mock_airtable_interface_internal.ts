import {
    Aggregators,
    FieldTypeProvider,
    UrlConstructor,
    GlobalConfigHelpers,
    IdGenerator,
    VisList,
    PartialViewData,
} from '../../src/types/airtable_interface';
import MockAirtableInterface from '../../src/testing/mock_airtable_interface';
import {TableId} from '../../src/types/table';
import {FieldId} from '../../src/types/field';
import {spawnError} from '../../src/error_utils';
import {CursorData} from '../../src/types/cursor';
import {RecordData} from '../../src/types/record';
import {RecordActionData} from '../../src/types/record_action_data';
import {RequestJson, ResponseJson} from '../../src/types/backend_fetch_types';
import projectTrackerData from './project_tracker';
import linkedRecordsData from './linked_records';

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

/**
 * An implementation of the MockAirtableInterface designed for use in the
 * Blocks SDK internal automated test suite. Provides Jest spies for all
 * available methods (and which resets the state of those spies with every call
 * to `reset`).
 */
class MockAirtableInterfaceInternal extends MockAirtableInterface {
    static projectTrackerExample() {
        return new MockAirtableInterfaceInternal(projectTrackerData) as jest.Mocked<
            MockAirtableInterfaceInternal
        >;
    }

    static linkedRecordsExample() {
        return new MockAirtableInterfaceInternal(linkedRecordsData) as jest.Mocked<
            MockAirtableInterfaceInternal
        >;
    }

    get aggregators() {
        return super.aggregators as jest.Mocked<Aggregators>;
    }

    get fieldTypeProvider() {
        return super.fieldTypeProvider as jest.Mocked<FieldTypeProvider>;
    }

    get urlConstructor() {
        return super.urlConstructor as jest.Mocked<UrlConstructor>;
    }

    get globalConfigHelpers() {
        return super.globalConfigHelpers as jest.Mocked<GlobalConfigHelpers>;
    }

    get idGenerator() {
        return super.idGenerator as jest.Mocked<IdGenerator>;
    }

    /**
     * Revert the mock interface to its initial state. This includes:
     *
     * - removing all event listeners
     * - restoring the database schema
     * - recreating the Jest "spies" for every instance method
     */
    reset() {
        super.reset();

        resetSpies(this, Object.getOwnPropertyNames(MockAirtableInterfaceInternal.prototype));
        resetSpies(this, Object.getOwnPropertyNames(MockAirtableInterface.prototype));
        resetSpies(this.fieldTypeProvider, Object.keys(this.fieldTypeProvider));
        resetSpies(this.urlConstructor, Object.keys(this.urlConstructor));
        resetSpies(this.globalConfigHelpers, Object.keys(this.globalConfigHelpers));
        resetSpies(this.idGenerator, Object.keys(this.idGenerator));
    }

    createVisList(
        ...args: Parameters<MockAirtableInterface['createVisList']>
    ): jest.Mocked<VisList> {
        const visList = super.createVisList(...args);
        resetSpies(visList, Object.keys(visList));
        return visList as jest.Mocked<VisList>;
    }

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
    async fetchAndSubscribeToViewDataAsync(
        tableId: string,
        viewId: string,
    ): Promise<PartialViewData> {
        throw spawnError('fetchAndSubscribeToViewDataAsync unimplemented');
    }
    fetchDefaultCellValuesByFieldIdAsync(): Promise<{[key: string]: unknown}> {
        throw spawnError('fetchDefaultCellValuesByFieldIdAsync unimplemented');
    }
    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null) {
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
    fetchAndSubscribeToPerformRecordActionAsync(): Promise<RecordActionData | null> {
        throw spawnError('fetchAndSubscribeToPerformRecordActionAsync unimplemented');
    }
    trackEvent() {
        throw spawnError('trackEvent unimplemented');
    }
    trackExposure() {
    }
    sendStat() {
        throw spawnError('sendStat unimplemented');
    }
    performBackendFetchAsync(requestJson: RequestJson): Promise<ResponseJson> {
        throw spawnError('performBackendFetchAsync unimplemented');
    }
}

export default MockAirtableInterfaceInternal;
