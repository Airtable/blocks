import React from 'react';
import {act} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {initializeBlock} from '../../../src/base/ui/ui';
import {__resetHasBeenInitialized} from '../../../src/base/ui/initialize_block';

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

describe('initializeBlock', () => {
    afterEach(() => {
        __resetHasBeenInitialized();
    });
    it("functions without explicitly importing the SDK's main entry point", () => {
        act(() => {
            initializeBlock(() => <div />);
        });
    });
    it('functions as a view and a block through one entry point', () => {
        act(() => {
            initializeBlock({dashboard: () => <div />, view: () => <div />});
        });
    });
});
