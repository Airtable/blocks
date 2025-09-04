import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {Synced} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {GlobalConfigUpdate} from '../../../src/shared/types/global_config';
import {__sdk as sdk} from '../../../src/base';
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

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

interface RenderArg {
    value: unknown;
    canSetValue: boolean;
    setValue: (newValue: unknown) => void;
}

describe('Synced', () => {
    // eslint-disable-next-line prefer-const
    let spy = jest.fn().mockImplementation(({value, canSetValue}: RenderArg) => {
        return (
            <div>
                <p>{String(value)}</p>
                <p>{String(canSetValue)}</p>
            </div>
        );
    });

    beforeEach(() => {
        spy.mockClear();
    });

    it('renders within a Blocks Sdk context', () => {
        const {container} = render(
            <TestProvider>
                <Synced globalConfigKey="foo" render={spy} />
            </TestProvider>,
        );

        expect(container.innerHTML).toMatchInlineSnapshot(
            `"<div><p>undefined</p><p>true</p></div>"`,
        );
    });

    it('reacts to invocations of the `setValue` function', async () => {
        render(
            <TestProvider>
                <Synced globalConfigKey="foo" render={spy} />
            </TestProvider>,
        );

        const updates = await new Promise(resolve => {
            const impl = (_updates: readonly GlobalConfigUpdate[]) => {
                resolve(_updates);
                return {
                    newKvStore: {},
                    changedTopLevelKeys: [],
                };
            };
            mockAirtableInterface.globalConfigHelpers.validateAndApplyUpdates.mockImplementation(
                impl,
            );

            spy.mock.calls[0][0].setValue('a small duck');
        });

        expect(updates).toEqual([{path: ['foo'], value: 'a small duck'}]);
    });
});
