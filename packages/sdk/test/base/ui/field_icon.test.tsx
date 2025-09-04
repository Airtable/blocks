import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {FieldIcon} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../../src/base';
import getAirtableInterface from '../../../src/injected/airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
            }
            return mockAirtableInterface;
        },
    };
});

const mockAirtableInterface = getAirtableInterface() as jest.Mocked<MockAirtableInterface>;

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

        render(
            <TestProvider>
                <FieldIcon field={field} />
            </TestProvider>,
        );
    });
});
