import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {useRecords} from '../../src/ui/use_records';

import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import Record from '../../src/models/record';
import Table from '../../src/models/table';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('useRecords', () => {
    let table: Table;
    beforeEach(() => {
        mockAirtableInterface.reset();
        let base = new Base(mockAirtableInterface.sdkInitData.baseData, mockAirtableInterface);
        table = base.getTableByName('Design projects');
    });

    it('eventually returns all records', async () => {
        const Component = ({resolve}: {resolve: Function}) => {
            const records = useRecords(table);
            resolve(records);
            return <div></div>;
        };
        const createdTime = new Date().toString();
        const recordsById = {
            recA: {id: 'recA', cellValuesByFieldId: {}, commentCount: 0, createdTime},
            recB: {id: 'recB', cellValuesByFieldId: {}, commentCount: 0, createdTime},
            recC: {id: 'recC', cellValuesByFieldId: {}, commentCount: 0, createdTime},
        };
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });

        // Enzyme doesn't support <Suspense /> yet, so use ReactDOM manually.
        const records: Record[] = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <Suspense fallback="">
                        <Component resolve={resolve} />
                    </Suspense>,
                    document.createElement('div'),
                );
            });
        });

        const ids = records.map(({id}) => id).sort();
        expect(ids).toStrictEqual(['recA', 'recB', 'recC']);
    });
});
