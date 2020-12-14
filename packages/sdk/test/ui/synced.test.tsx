import React from 'react';
import {mount} from 'enzyme';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {Synced} from '../../src/ui/ui';
import {SdkContext} from '../../src/ui/sdk_context';
import {GlobalConfigUpdate} from '../../src/types/global_config';
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

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

interface RenderArg {
    value: unknown;
    canSetValue: boolean;
    setValue: (newValue: unknown) => void;
}

describe('Synced', () => {
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
        const wrapper = mount(
            <TestProvider>
                <Synced globalConfigKey="foo" render={spy} />
            </TestProvider>,
        );

        expect(wrapper.render().html()).toMatchInlineSnapshot(`"<p>undefined</p><p>true</p>"`);
    });

    it('reacts to invocations of the `setValue` function', async () => {
        mount(
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
