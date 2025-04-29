import React from 'react';
import {mount} from 'enzyme';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {CellRenderer} from '../../src/base/ui/ui';
import {SdkContext} from '../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../src/base';

let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        if (!mockAirtableInterface) {
            mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
        }
        return mockAirtableInterface;
    },
}));

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

describe('CellRenderer', () => {
    it('renders within a Blocks Sdk context', () => {
        const field = sdk.base.getTable('Design projects').getField('Name');
        mount(
            <TestProvider>
                <CellRenderer field={field} />
            </TestProvider>,
        );
    });
});
