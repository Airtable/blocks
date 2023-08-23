import React from 'react';
import {mount} from 'enzyme';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {SelectSynced} from '../../src/ui/ui';
import {SdkContext} from '../../src/ui/sdk_context';
import {__sdk as sdk} from '../../src';

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

describe('SelectSynced', () => {
    it('renders within a blocks context', () => {
        mount(
            <TestProvider>
                <SelectSynced globalConfigKey="yodel" options={[{value: null, label: 'None'}]} />
            </TestProvider>,
        );
    });
});
