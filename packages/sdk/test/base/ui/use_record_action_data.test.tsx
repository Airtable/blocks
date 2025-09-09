import React, {Suspense} from 'react';
import {render, act} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../../src/base/sdk';
import useRecordActionData from '../../../src/base/ui/use_record_action_data';
import {type RecordActionData} from '../../../src/base/types/record_action_data';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {createPromiseWithResolveAndReject} from '../../test_helpers';

describe('useRecordActionData', () => {
    let sdk: Sdk;
    const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
    const TestProvider = ({children}: {children: React.ReactNode}) => {
        return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
    };
    const Component = ({resolve}: {resolve: Function}) => {
        const recordActionData = useRecordActionData();
        resolve(recordActionData);
        return <div></div>;
    };

    beforeEach(() => {
        mockAirtableInterface.reset();
        sdk = new Sdk(mockAirtableInterface);
    });

    it('loads', async () => {
        mockAirtableInterface.fetchAndSubscribeToPerformRecordActionAsync.mockResolvedValue(null);

        const {promise, resolve} = createPromiseWithResolveAndReject<RecordActionData>();
        await act(async () => {
            render(
                <TestProvider>
                    <Suspense fallback="">
                        <Component resolve={resolve} />
                    </Suspense>
                </TestProvider>,
            );
        });
        const recordActionData = await promise;

        expect(recordActionData).toBe(null);
    });
});
