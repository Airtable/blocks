import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {CellRenderer} from '../../../src/interface/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
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

describe('CellRenderer', () => {
    let sdk: InterfaceBlockSdk;

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    const TestProvider = ({children}: {children: React.ReactNode}) => {
        return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
    };

    it('renders within a Blocks Sdk context', () => {
        const field = sdk.base.getTable('Design projects').getField('Name');
        render(
            <TestProvider>
                <CellRenderer field={field} />
            </TestProvider>,
        );
    });
});
