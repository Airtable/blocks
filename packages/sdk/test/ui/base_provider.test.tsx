import React from 'react';
import {mount} from 'enzyme';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {BaseProvider, useBase} from '../../src/ui/ui';
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

describe('BaseProvider', () => {
    it('enables rendering outside of a Blocks context', () => {
        let base;
        const Component = () => {
            base = useBase();
            return null;
        };

        mount(
            <BaseProvider value={sdk.base}>
                <Component />
            </BaseProvider>,
        );

        expect(base).toBe(sdk.base);
    });
});
