import React from 'react';
import ReactDOM from 'react-dom';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {expandRecordPickerAsync, useBase, useRecords} from '../../src/ui/ui';
import {Record} from '../../src/models/models';
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

interface TestBodyParams {
    resolve: () => null;
    reject: () => null;
}

const renderAsync = async (TestBody: Function): Promise<Record> => {
    const el = document.createElement('div');
    return new Promise((resolve, reject) => {
        ReactDOM.render(
            <TestProvider>
                <React.Suspense fallback={<div></div>}>
                    <TestBody resolve={resolve} reject={reject} />
                </React.Suspense>
            </TestProvider>,
            el,
        );
    });
};

describe('expandRecordPickerAsync', () => {
    beforeEach(() => {
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
        mockAirtableInterface.expandRecordPickerAsync.mockImplementation(async () => null);

        const TestBody = ({resolve, reject}: TestBodyParams) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecordPickerAsync([records[1], records[2]]).then(resolve, reject);

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecordPickerAsync).toHaveBeenCalledWith(
            'tblTasks',
            ['recB', 'recC'],
            null,
            false,
        );
    });

    it('provides the minimal information to AirtableInterface (with options)', async () => {
        mockAirtableInterface.expandRecordPickerAsync.mockImplementation(async () => null);
        const TestBody = ({resolve, reject}: TestBodyParams) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecordPickerAsync([records[2]], {
                fields: [table.fields[2]],
                shouldAllowCreatingRecord: true,
            }).then(resolve, reject);

            return <div></div>;
        };

        await renderAsync(TestBody);

        expect(mockAirtableInterface.expandRecordPickerAsync).toHaveBeenCalledWith(
            'tblTasks',
            ['recC'],
            ['fldTaskProject'],
            true,
        );
    });

    it('returns the chosen record', async () => {
        mockAirtableInterface.expandRecordPickerAsync.mockImplementation(async () => 'recB');
        const TestBody = ({resolve, reject}: TestBodyParams) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');

            const queryResult = table.selectRecords();
            const records = useRecords(queryResult);

            expandRecordPickerAsync(records).then(resolve, reject);

            return <div></div>;
        };

        expect((await renderAsync(TestBody)).id).toBe('recB');
    });
});
