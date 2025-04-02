import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import BlockWrapper from '../../src/base/ui/block_wrapper';
import Sdk from '../../src/base/sdk';
import {__reset, __sdk as sdk} from '../../src/base';

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

const render = (sdk_: Sdk): HTMLElement => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BlockWrapper sdk={sdk_}>
            <div></div>
        </BlockWrapper>,
        div,
    );
    return div;
};

describe('BlockWrapper', () => {
    afterEach(() => {
        __reset();
    });

    it('renders outside of a blocks context', () => {
        mount(
            <BlockWrapper sdk={sdk}>
                <div></div>
            </BlockWrapper>,
        );
    });

    it('prompts user to resize viewport ("extension" terminology)', () => {
        mockAirtableInterface.setFullscreenMaxSize.mockImplementation(() => {});
        mockAirtableInterface.enterFullscreen.mockImplementation(() => {});
        sdk.viewport.addMinSize({width: 2 ** 30});

        expect(render(sdk).textContent).toMatch(/\bmake\s+this\s+extension\s+bigger\b/i);
    });
});
