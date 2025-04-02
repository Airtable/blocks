import React from 'react';
import {mount} from 'enzyme';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {GlobalAlert} from '../../src/base/ui/ui';
import {SdkContext} from '../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../src/base';

let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        if (!mockAirtableInterface) {
            mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
        }
        return mockAirtableInterface;
    },
}));

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

describe('GlobalAlert', () => {
    it('renders within a Blocks Sdk context', () => {
        const globalAlert = new GlobalAlert();
        globalAlert.showReloadPrompt();
        mount(<TestProvider>{globalAlert.__alertInfo!.content}</TestProvider>);
    });

    it('sends a "reload" request when clicked', () => {
        const globalAlert = new GlobalAlert();
        globalAlert.showReloadPrompt();
        const wrapper = mount(<TestProvider>{globalAlert.__alertInfo!.content}</TestProvider>);
        mockAirtableInterface.reloadFrame.mockImplementation(() => {});

        wrapper.find('span span').simulate('click');

        expect(mockAirtableInterface.reloadFrame).toHaveBeenCalledTimes(1);
    });
});
