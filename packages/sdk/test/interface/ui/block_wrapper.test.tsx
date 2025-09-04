import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {BlockWrapper} from '../../../src/interface/ui/block_wrapper';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('BlockWrapper', () => {
    let sdk: InterfaceBlockSdk;

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    it('renders outside of a blocks context', () => {
        render(
            <BlockWrapper sdk={sdk}>
                <div></div>
            </BlockWrapper>,
        );
    });
});
