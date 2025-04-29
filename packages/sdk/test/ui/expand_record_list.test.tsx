import React from 'react';
import ReactDOM from 'react-dom';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {expandRecordList, useBase, useRecords} from '../../src/base/ui/ui';
import {SdkContext} from '../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../src/base';

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

describe('expandRecordList', () => {
    beforeEach(() => {
        mockAirtableInterface.expandRecordList.mockImplementation(() => {});

        const recordsById = {
            recA: {
                id: 'recA',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2021-02-16T20:51:04.281Z',
            },
            recB: {
                id: 'recB',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2021-02-16T20:52:04.281Z',
            },
            recC: {
                id: 'recC',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2021-02-16T20:53:04.281Z',
            },
        };
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });
    });

    it('provides the minimal information to AirtableInterface (without options)', async () => {
        const TestBody = ({resolve}: {resolve: Function}) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecordList([records[0], records[2]]);
            resolve();

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecordList).toHaveBeenCalledWith(
            'tblTasks',
            ['recA', 'recC'],
            null,
        );
    });

    it('provides the minimal information to AirtableInterface (with options)', async () => {
        const TestBody = ({resolve}: {resolve: Function}) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecordList([records[1]], {fields: [table.fields[1]]});
            resolve();

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecordList).toHaveBeenCalledWith(
            'tblTasks',
            ['recB'],
            ['fldTaskNotes'],
        );
    });
});
