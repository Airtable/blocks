import React, {Suspense} from 'react';
import {render, act} from '@testing-library/react';
import {useRecords} from '../../../src/base/ui/use_records';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../../src/base/sdk';
import Record from '../../../src/base/models/record';
import Table from '../../../src/base/models/table';
import {TableId} from '../../../src/shared/types/hyper_ids';
import {createPromiseWithResolveAndReject} from '../../test_helpers';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('useRecords', () => {
    let sdk: Sdk;
    let table: Table;
    const createdTime = new Date().toString();
    const recordsById = {
        recA: {id: 'recA', cellValuesByFieldId: {}, commentCount: 0, createdTime},
        recB: {id: 'recB', cellValuesByFieldId: {}, commentCount: 0, createdTime},
        recC: {id: 'recC', cellValuesByFieldId: {}, commentCount: 0, createdTime},
    };
    const Component = ({target, resolve}: {target: any; resolve: Function}) => {
        const records = useRecords(target);
        resolve(records);
        return <div></div>;
    };
    const visibleRecordIds = ['recA', 'recC'];

    beforeEach(() => {
        mockAirtableInterface.reset();
        sdk = new Sdk(mockAirtableInterface);
        table = sdk.base.getTableByName('First Table');
    });

    it('eventually returns all records from a table', async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });

        const {promise, resolve} = createPromiseWithResolveAndReject<Record[]>();
        await act(async () => {
            render(
                <Suspense fallback="">
                    <Component target={table} resolve={resolve} />
                </Suspense>,
            );
        });
        const records: Record[] = await promise;

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recA', 'recB', 'recC']);
    });

    it('eventually returns visible records from a view', async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
            visibleRecordIds,
            fieldOrder: {
                fieldIds: [],
                visibleFieldCount: 0,
            },
            colorsByRecordId: {},
        });
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });

        const {promise, resolve} = createPromiseWithResolveAndReject<Record[]>();
        await act(async () => {
            render(
                <Suspense fallback="">
                    <Component target={table.views[0]} resolve={resolve} />
                </Suspense>,
            );
        });
        const records: Record[] = await promise;

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recA', 'recC']);
    });

    it('eventually returns records from a LinkedRecordsQueryResult', async () => {
        const impl = (tableId: TableId) => {
            const first = tableId === 'tblFirst';
            const recId = first ? 'recA' : 'recD';
            const fieldId = first ? 'fld1stLinked' : 'fld2ndLinked';
            const cellValues = [{id: first ? 'recD' : 'recA'}];
            return Promise.resolve({
                recordsById: {
                    [recId]: {
                        id: recId,
                        cellValuesByFieldId: {
                            fld1stPrimary: 'primary',
                            [fieldId]: cellValues,
                        },
                        commentCount: 0,
                        createdTime,
                    },
                },
            });
        };
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockImplementation(impl);
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockImplementation(impl);

        const query = await sdk.base.tables[0].selectRecordsAsync();
        const record = query.getRecordById('recA');

        const {promise, resolve} = createPromiseWithResolveAndReject<Record[]>();
        await act(async () => {
            render(
                <Suspense fallback="">
                    <Component
                        target={record.selectLinkedRecordsFromCell('fld1stLinked')}
                        resolve={resolve}
                    />
                </Suspense>,
            );
        });
        const records: Record[] = await promise;

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recD']);
    });
});
