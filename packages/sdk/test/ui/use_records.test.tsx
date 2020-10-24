import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {useRecords} from '../../src/ui/use_records';

import getSdk from '../../src/get_sdk';
import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import Record from '../../src/models/record';
import Table from '../../src/models/table';
import {TableId} from '../../src/types/table';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('useRecords', () => {
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
        let base = new Base(mockAirtableInterface.sdkInitData.baseData, mockAirtableInterface);
        table = base.getTableByName('First Table');
    });

    it('eventually returns all records from a table', async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });

        const records: Record[] = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <Suspense fallback="">
                        <Component target={table} resolve={resolve} />
                    </Suspense>,
                    document.createElement('div'),
                );
            });
        });

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

        const records: Record[] = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <Suspense fallback="">
                        <Component target={table.views[0]} resolve={resolve} />
                    </Suspense>,
                    document.createElement('div'),
                );
            });
        });

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recA', 'recC']);
    });

    it('eventually returns records from a LinkedRecordsQueryResult', async () => {
        const impl = (tableId: TableId) => {
            const first = tableId === 'tblFirst';
            const recId = first ? 'recA' : 'recD';
            const fieldId = first ? 'fldLinked1' : 'fldLinked2';
            const cellValues = [{id: first ? 'recD' : 'recA'}];
            return Promise.resolve({
                recordsById: {
                    [recId]: {
                        id: recId,
                        cellValuesByFieldId: {
                            fldPrimary: 'primary',
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

        const sdk = getSdk();
        const query = await sdk.base.tables[0].selectRecordsAsync();
        const record = query.getRecordById('recA');

        const records: Record[] = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <Suspense fallback="">
                        <Component
                            target={record.selectLinkedRecordsFromCell('fldLinked1')}
                            resolve={resolve}
                        />
                    </Suspense>,
                    document.createElement('div'),
                );
            });
        });

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recD']);
    });
});
