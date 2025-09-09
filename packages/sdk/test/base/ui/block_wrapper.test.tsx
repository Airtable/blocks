import React from 'react';
import {createRoot} from 'react-dom/client';
import {render as rtlRender, act} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import BlockWrapper from '../../../src/base/ui/block_wrapper';
import type Sdk from '../../../src/base/sdk';
import {__reset, __sdk as sdk} from '../../../src/base';
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

const render = (sdk_: Sdk): HTMLElement => {
    const div = document.createElement('div');
    act(() => {
        createRoot(div).render(
            <BlockWrapper sdk={sdk_}>
                <div></div>
            </BlockWrapper>,
        );
    });
    return div;
};

describe('BlockWrapper', () => {
    afterEach(() => {
        __reset();
    });

    it('renders outside of a blocks context', () => {
        rtlRender(
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
