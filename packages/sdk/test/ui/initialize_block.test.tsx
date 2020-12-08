import React from 'react';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import {initializeBlock} from '../../src/ui/ui';

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

describe('initializeBlock', () => {
    it("functions without explicitly importing the SDK's main entry point", () => {
        initializeBlock(() => <div />);
    });
});
