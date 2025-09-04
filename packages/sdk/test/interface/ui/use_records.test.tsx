import React from 'react';
import {act, render} from '@testing-library/react';
import {useRecords} from '../../../src/interface/ui/use_records';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {Record} from '../../../src/interface/models/record';
import {Table} from '../../../src/interface/models/table';
import {FieldId, RecordId} from '../../../src/shared/types/hyper_ids';
import {ObjectMap} from '../../../src/shared/private_utils';
import {BlockWrapper} from '../../../src/interface/ui/block_wrapper';
import {createPromiseWithResolveAndReject} from '../../test_helpers';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('useRecords', () => {
    let sdk: InterfaceBlockSdk;
    let table: Table;
    const Component = ({table, resolve}: {table: Table; resolve: Function}) => {
        const records = useRecords(table);
        resolve(records);
        return <div></div>;
    };

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        table = sdk.base.getTableByName('First Table');
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
        const parentTableData = baseData.tablesById.tblFirst;
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

    it('eventually returns all records from a table', async () => {
        makeRecord('recA', {}, '2020-11-19T20:51:04.281Z');
        makeRecord('recB', {}, '2020-11-19T20:51:04.281Z');
        makeRecord('recC', {}, '2020-11-19T20:51:04.281Z');

        const {promise, resolve} = createPromiseWithResolveAndReject<Record[]>();
        await act(async () => {
            render(
                <BlockWrapper sdk={sdk}>
                    <Component table={table} resolve={resolve} />
                </BlockWrapper>,
            );
        });
        const records: Record[] = await promise;

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recA', 'recB', 'recC']);
    });
});
