import React from 'react';
import {mount} from 'enzyme';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {ViewportConstraint} from '../../src/ui/ui';
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

describe('ViewportConstraint', () => {
    it('renders within a Blocks Sdk context (no dimensions)', () => {
        mount(
            <TestProvider>
                <ViewportConstraint />
            </TestProvider>,
        );
    });

    it('renders within a Blocks Sdk context (minSize only)', () => {
        mockAirtableInterface.setFullscreenMaxSize.mockImplementation(() => {});
        mount(
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
        mount(
            <TestProvider>
                <ViewportConstraint maxFullscreenSize={{width: 1, height: 1}} />
            </TestProvider>,
        );
    });
});
