import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme';
import BlockWrapper from '../../src/ui/block_wrapper';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../src/sdk';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return mockAirtableInterface;
    },
}));

const render = (): HTMLElement => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BlockWrapper>
            <div></div>
        </BlockWrapper>,
        div,
    );
    return div;
};

describe('BlockWrapper', () => {
    let sdk: Sdk;

    beforeEach(() => {
        sdk = getSdk();
    });

    afterEach(() => {
        clearSdkForTest();
    });

    it('renders outside of a blocks context', () => {
        mount(
            <BlockWrapper>
                <div></div>
            </BlockWrapper>,
        );
    });

    it('prompts user to resize viewport ("block" terminology)', () => {
        mockAirtableInterface.setFullscreenMaxSize.mockImplementation(() => {});
        mockAirtableInterface.enterFullscreen.mockImplementation(() => {});
        sdk.viewport.addMinSize({width: 2 ** 30});

        expect(render().textContent).toMatch(/\bmake\s+this\s+block\s+bigger\b/i);
    });

    it('prompts user to resize viewport ("app" terminology)', () => {
        mockAirtableInterface.triggerModelUpdates([
            {
                path: ['enabledFeatureNames'],
                value: ['blocks.appsRename'],
            },
        ]);
        clearSdkForTest();
        sdk = getSdk();

        mockAirtableInterface.setFullscreenMaxSize.mockImplementation(() => {});
        mockAirtableInterface.enterFullscreen.mockImplementation(() => {});
        sdk.viewport.addMinSize({width: 2 ** 30});

        expect(render().textContent).toMatch(/\bmake\s+this\s+app\s+bigger\b/i);
    });
});
