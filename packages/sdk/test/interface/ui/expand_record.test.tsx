import React from 'react';
import {act, render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {expandRecord, useBase, useRecords} from '../../../src/interface/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {FieldId, RecordId} from '../../../src/shared/types/hyper_ids';
import {ObjectMap} from '../../../src/shared/private_utils';
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

const TestProvider = ({sdk, children}: {sdk: InterfaceBlockSdk; children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

const renderAsync = async (
    sdk: InterfaceBlockSdk,
    TestBody: React.FunctionComponent<any>,
): Promise<void> => {
    const {promise, resolve} = createPromiseWithResolveAndReject<void>();
    await act(async () => {
        render(
            <TestProvider sdk={sdk}>
                <React.Suspense fallback={<div></div>}>
                    <TestBody resolve={resolve} />
                </React.Suspense>
            </TestProvider>,
        );
    });
    return await promise;
};

describe('expandRecord', () => {
    let sdk: InterfaceBlockSdk;

    beforeEach(() => {
        mockAirtableInterface.expandRecord.mockImplementation(() => {});
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        sdk.base.getTableByName('Tasks');
        makeRecord('recA', {}, '2020-11-19T20:51:04.281Z');
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    const makeRecord = (
        id: RecordId,
        cellValuesByFieldId: ObjectMap<FieldId, unknown>,
        createdTime: string,
    ) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById.tblTasks;
        parentTableData.recordsById[id] = {
            id,
            cellValuesByFieldId,
            createdTime,
        };
        parentTableData.recordOrder.push(id);

        const parentRecordStore = sdk.base.__getRecordStore(parentTableData.id);

        const newRecord = parentRecordStore.getRecordByIdIfExists(id);

        return newRecord!;
    };

    it('provides the minimal information to AirtableInterface', async () => {
        const TestBody = ({resolve}: {resolve: Function}) => {
            const base = useBase();
            const table = base.getTableByName('Tasks');
            const records = useRecords(table);

            expandRecord(records[0]);
            resolve();

            return <div></div>;
        };

        await renderAsync(sdk, TestBody);

        expect(mockAirtableInterface.expandRecord).toHaveBeenCalledWith('tblTasks', 'recA');
    });
});
