import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../src/sdk';
import useRecordActionData from '../../src/ui/use_record_action_data';
import {RecordActionData} from '../../src/types/record_action_data';
import {SdkContext} from '../../src/ui/sdk_context';

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
        const recordActionData: RecordActionData = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <TestProvider>
                        <Suspense fallback="">
                            <Component resolve={resolve} />
                        </Suspense>
                    </TestProvider>,
                    document.createElement('div'),
                );
            });
        });
        expect(recordActionData).toBe(null);
    });
});
