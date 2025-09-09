import {type FieldTypeProvider, type IdGenerator} from '../../../src/base/types/airtable_interface';
import {AbstractMockAirtableInterface} from '../../../src/testing/interface/abstract_mock_airtable_interface';
import {spawnError} from '../../../src/shared/error_utils';
import {type GlobalConfigHelpers} from '../../../src/shared/types/airtable_interface_core';
import projectTrackerData from './project_tracker';
import linkedRecordsData from './linked_records';
import {type FixtureData, convertFixtureDataToSdkInitData} from './fixture_data';

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
 * An implementation of the AbstractMockAirtableInterface designed for use in the
 * Blocks SDK internal automated test suite. Provides Jest spies for all
 * available methods (and which resets the state of those spies with every call
 * to `reset`).
 */
export class MockAirtableInterface extends AbstractMockAirtableInterface {
    static projectTrackerExample() {
        return MockAirtableInterface.createFromFixtureData(projectTrackerData);
    }

    static linkedRecordsExample() {
        return MockAirtableInterface.createFromFixtureData(linkedRecordsData);
    }

    static createFromFixtureData(fixtureData: FixtureData) {
        const sdkInitData = convertFixtureDataToSdkInitData(fixtureData);
        return new MockAirtableInterface(sdkInitData) as jest.Mocked<MockAirtableInterface>;
    }

    get fieldTypeProvider() {
        return super.fieldTypeProvider as jest.Mocked<FieldTypeProvider>;
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

        resetSpies(this, Object.getOwnPropertyNames(MockAirtableInterface.prototype));
        resetSpies(this, Object.getOwnPropertyNames(AbstractMockAirtableInterface.prototype));
        resetSpies(this.fieldTypeProvider, Object.keys(this.fieldTypeProvider));
        resetSpies(this.globalConfigHelpers, Object.keys(this.globalConfigHelpers));
        resetSpies(this.idGenerator, Object.keys(this.idGenerator));
    }

    expandRecord(tableId: string, recordId: string) {
        throw spawnError('expandRecord unimplemented');
    }
    reloadFrame() {
        throw spawnError('reloadFrame unimplemented');
    }
    trackEvent() {
        throw spawnError('trackEvent unimplemented');
    }
    trackExposure() {
    }
    sendStat() {
        throw spawnError('sendStat unimplemented');
    }
}
