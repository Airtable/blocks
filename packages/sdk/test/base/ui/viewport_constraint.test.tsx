import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {ViewportConstraint} from '../../../src/base/ui/ui';
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

describe('ViewportConstraint', () => {
    it('renders within a Blocks Sdk context (no dimensions)', () => {
        render(
            <TestProvider>
                <ViewportConstraint />
            </TestProvider>,
        );
    });

    it('renders within a Blocks Sdk context (minSize only)', () => {
        mockAirtableInterface.setFullscreenMaxSize.mockImplementation(() => {});
        render(
            <TestProvider>
                <ViewportConstraint minSize={{width: 1, height: 1}} />
            </TestProvider>,
        );

        expect(mockAirtableInterface.setFullscreenMaxSize).toHaveBeenCalledWith({
            width: null,
            height: null,
        });
    });

    it('renders within a Blocks Sdk context (maxFullscreenSize only)', () => {
        render(
            <TestProvider>
                <ViewportConstraint maxFullscreenSize={{width: 1, height: 1}} />
            </TestProvider>,
        );
    });
});
