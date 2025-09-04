import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {GlobalAlert} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../../src/base';
import getAirtableInterface from '../../../src/injected/airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
            }
            return mockAirtableInterface;
        },
    };
});

const mockAirtableInterface = getAirtableInterface() as jest.Mocked<MockAirtableInterface>;

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

describe('GlobalAlert', () => {
    it('renders within a Blocks Sdk context', () => {
        const globalAlert = new GlobalAlert();
        globalAlert.showReloadPrompt();
        render(<TestProvider>{globalAlert.__alertInfo!.content}</TestProvider>);
    });

    it('sends a "reload" request when clicked', () => {
        const globalAlert = new GlobalAlert();
        globalAlert.showReloadPrompt();
        const {container} = render(<TestProvider>{globalAlert.__alertInfo!.content}</TestProvider>);
        mockAirtableInterface.reloadFrame.mockImplementation(() => {});

        const clickableElement = container.querySelector('span span');
        fireEvent.click(clickableElement!);

        expect(mockAirtableInterface.reloadFrame).toHaveBeenCalledTimes(1);
    });
});
