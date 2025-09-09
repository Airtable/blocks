import React from 'react';
import {act, render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {expandRecordPickerAsync, useBase, useRecords} from '../../../src/base/ui/ui';
import {type Record} from '../../../src/base/models/models';
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

interface TestBodyParams {
    resolve: () => null;
    reject: () => null;
}

const renderAsync = async (TestBody: React.FunctionComponent<any>): Promise<Record> => {
    const {promise, resolve} = createPromiseWithResolveAndReject<Record>();
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
