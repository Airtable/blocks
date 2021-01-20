import React from 'react';
import ReactDOM from 'react-dom';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {expandRecord, useBase, useRecords} from '../../src/ui/ui';
import {SdkContext} from '../../src/ui/sdk_context';
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

const renderAsync = async (TestBody: Function) => {
    const el = document.createElement('div');
    return new Promise(resolve => {
        ReactDOM.render(
            <TestProvider>
                <React.Suspense fallback={<div></div>}>
                    <TestBody resolve={resolve} />
                </React.Suspense>
            </TestProvider>,
            el,
        );
    });
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
