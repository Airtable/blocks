import React from 'react';
import {mount} from 'enzyme';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {FieldIcon} from '../../src/ui/ui';
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

describe('FieldIcon', () => {
    it('renders within a blocks context', () => {
        const uiConfig = {
            iconName: 'text',
            desiredCellWidthForRecordCard: 10,
            minimumCellWidthForRecordCard: 10,
        };
        mockAirtableInterface.fieldTypeProvider.getUiConfig.mockReturnValue(uiConfig);
        const field = sdk.base.getTable('Design projects').getField('Name');

        mount(
            <TestProvider>
                <FieldIcon field={field} />
            </TestProvider>,
        );
    });
});
