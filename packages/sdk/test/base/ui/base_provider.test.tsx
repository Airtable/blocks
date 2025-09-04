import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {BaseProvider, useBase} from '../../../src/base/ui/ui';
import {__sdk as sdk} from '../../../src/base';

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

describe('BaseProvider', () => {
    it('enables rendering outside of a Blocks context', () => {
        let base;
        const Component = () => {
            base = useBase();
            return null;
        };

        render(
            <BaseProvider value={sdk.base}>
                <Component />
            </BaseProvider>,
        );

        expect(base).toBe(sdk.base);
    });
});
