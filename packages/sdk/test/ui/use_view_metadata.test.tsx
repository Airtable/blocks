import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import useViewMetadata from '../../src/base/ui/use_view_metadata';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../src/base/sdk';
import ViewMetadataQueryResult from '../../src/base/models/view_metadata_query_result';
import Table from '../../src/base/models/table';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('useViewMetadata', () => {
    let table: Table;
    beforeEach(() => {
        mockAirtableInterface.reset();
        table = new Sdk(mockAirtableInterface).base.getTableByName('Design projects');
    });

    it('eventually returns metadata', async () => {
        const Component = ({resolve}: {resolve: Function}) => {
            const metadata = useViewMetadata(table.views[0]);
            resolve(metadata);
            return <div></div>;
        };
        const createdTime = new Date().toString();
        const recordsById = {
            recA: {id: 'recA', cellValuesByFieldId: {}, commentCount: 0, createdTime},
            recB: {id: 'recB', cellValuesByFieldId: {}, commentCount: 0, createdTime},
            recC: {id: 'recC', cellValuesByFieldId: {}, commentCount: 0, createdTime},
        };
        const visibleRecordIds = ['recA', 'recC'];
        const fieldOrder = {
            fieldIds: ['fldPrjctName', 'fldPrjctClient', 'fldPrjctCtgry'],
            visibleFieldCount: 3,
        };

        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
            visibleRecordIds,
            fieldOrder,
            colorsByRecordId: {},
        });
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });

        const metadata: ViewMetadataQueryResult = await new Promise(resolve => {
            act(() => {
                ReactDOM.render(
                    <Suspense fallback="">
                        <Component resolve={resolve} />
                    </Suspense>,
                    document.createElement('div'),
                );
            });
        });

        const ids = metadata.allFields.map(({id}) => id);
        expect(ids).toStrictEqual(['fldPrjctName', 'fldPrjctClient', 'fldPrjctCtgry']);
    });
});
