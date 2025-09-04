import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {CellRenderer} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../../src/base';

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

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

describe('CellRenderer', () => {
    it('renders within a Blocks Sdk context', () => {
        const field = sdk.base.getTable('Design projects').getField('Name');
        render(
            <TestProvider>
                <CellRenderer field={field} />
            </TestProvider>,
        );
    });
});
