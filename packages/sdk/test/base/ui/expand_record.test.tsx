import React from 'react';
import {render, act} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {expandRecord, useBase, useRecords} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../../src/base';
import getAirtableInterface from '../../../src/injected/airtable_interface';
import {createPromiseWithResolveAndReject} from '../../test_helpers';

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

const renderAsync = async (TestBody: React.FunctionComponent<any>): Promise<void> => {
    const {promise, resolve} = createPromiseWithResolveAndReject<void>();
    await act(async () => {
        render(
            <TestProvider>
                <React.Suspense fallback={<div></div>}>
                    <TestBody resolve={resolve} />
                </React.Suspense>
            </TestProvider>,
        );
    });
    return await promise;
};

describe('expandRecord', () => {
    beforeEach(() => {
        mockAirtableInterface.expandRecord.mockImplementation(() => {});

        const recordsById = {
            recA: {
                id: 'recA',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2020-11-19T20:51:04.281Z',
            },
            recB: {
                id: 'recB',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2020-11-19T20:51:04.281Z',
            },
        };
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });
    });

    it('provides the minimal information to AirtableInterface', async () => {
        const TestBody = ({resolve}: {resolve: Function}) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecord(records[0]);
            resolve();

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecord).toHaveBeenCalledWith('tblTasks', 'recA', null);
    });

    it('provides the minimal information to AirtableInterface', async () => {
        const TestBody = ({resolve}: {resolve: Function}) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecord(records[0], {records: [records[1]]});
            resolve();

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecord).toHaveBeenCalledWith('tblTasks', 'recA', [
            'recB',
        ]);
    });
});
