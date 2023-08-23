import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';

import {__reset, __sdk as sdk} from '../../src';
import {FieldId} from '../../src/types/field';
import View from '../../src/models/view';
import ViewMetadataQueryResult from '../../src/models/view_metadata_query_result';
import {waitForWatchKeyAsync} from '../test_helpers';
import {NormalizedGroupLevel} from '../../src/types/airtable_interface';

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

const mockVisibleFields = (
    fieldIds: Array<FieldId>,
    visibleFieldCount: number,
    groupLevels?: Array<NormalizedGroupLevel>,
) => {
    mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
        visibleRecordIds: [],
        fieldOrder: {
            fieldIds,
            visibleFieldCount,
        },
        colorsByRecordId: {},
        groupLevels: groupLevels,
    });

    mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
        recordsById: {},
    });
};

const reorderFields = (fieldIds: Array<FieldId>, visibleFieldCount: number) => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tblDesignProjects', 'viewsById', 'viwPrjctAll', 'fieldOrder'],
            value: {
                fieldIds,
                visibleFieldCount,
            },
        },
    ]);
};

const deleteView = () => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
            value: ['viwPrjctIncmplt', 'viwPrjctCompleted', 'viwPrjctCalendar', 'viwPrjctDueDates'],
        },
        {
            path: ['tablesById', 'tblDesignProjects', 'viewsById', 'viwPrjctAll'],
            value: undefined,
        },
    ]);
};

const changeGroupLevels = (groupLevels: Array<NormalizedGroupLevel>) => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tblDesignProjects', 'viewsById', 'viwPrjctAll', 'groupLevels'],
            value: groupLevels,
        },
    ]);
};

describe('ViewMetadataQueryResult', () => {
    let view: View;

    beforeEach(async () => {
        view = sdk.base.tables[0].views[0];
    });

    afterEach(() => {
        mockAirtableInterface.reset();
        __reset();
    });

    describe('#allFields', () => {
        it('returns all fields', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry'], 1);
            await result.loadDataAsync();

            const ids = result.allFields.map(({id}) => id);

            expect(ids).toEqual(['fldPrjctClient', 'fldPrjctCtgry']);
        });

        it('updates in response to messages from AirtableInterface', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry'], 1);
            await result.loadDataAsync();

            reorderFields(['fldPrjctClient', 'fldPrjctCtgry'], 2);

            const ids = result.allFields.map(({id}) => id);

            expect(ids).toEqual(['fldPrjctClient', 'fldPrjctCtgry']);
        });

        it('reports error for unloaded results', () => {
            expect(() => view.selectMetadata().allFields).toThrowErrorMatchingInlineSnapshot(
                `"view meta data is not loaded"`,
            );
        });

        it('reports error for deleted views', async () => {
            const result = view.selectMetadata();

            mockVisibleFields([], 0);
            await result.loadDataAsync();

            deleteView();

            expect(() => result.allFields).toThrowErrorMatchingInlineSnapshot(
                `"ViewMetadataQueryResult has been deleted"`,
            );
        });
    });

    describe('#isDataLoaded', () => {
        it('is initially unloaded', () => {
            expect(view.selectMetadata().isDataLoaded).toBe(false);
        });

        it('becomes true after loading', async () => {
            const result = view.selectMetadata();

            mockVisibleFields([], 0);
            await result.loadDataAsync();

            expect(result.isDataLoaded).toBe(true);
        });
    });

    it('#parentView', () => {
        expect(view.selectMetadata().parentView).toBe(sdk.base.tables[0].views[0]);
    });

    describe('#unloadData', () => {
        let result: ViewMetadataQueryResult;

        beforeEach(async () => {
            result = view.selectMetadata();
            mockVisibleFields([], 0);
            await result.loadDataAsync();
        });

        it('updates the `isDataLoaded` property', async () => {
            result.unloadData();

            await waitForWatchKeyAsync(result, 'isDataLoaded');

            expect(result.isDataLoaded).toBe(false);
        });

        it('unsubscribes from AirtableInterface: cell values in fields', async () => {
            const args = await new Promise(resolve => {
                result.unloadData();
                mockAirtableInterface.unsubscribeFromCellValuesInFields.mockImplementation(
                    (..._args) => resolve(_args),
                );
            });

            const table = sdk.base.tables[0];
            const field = table.fields[0];
            expect(args).toEqual([table.id, [field.id]]);
        });

        it('unsubscribes from AirtableInterface: view data', async () => {
            const args = await new Promise(resolve => {
                result.unloadData();
                mockAirtableInterface.unsubscribeFromViewData.mockImplementation((..._args) =>
                    resolve(_args),
                );
            });

            expect(args).toEqual([sdk.base.tables[0].id, view.id]);
        });

        it('ignores further updates to `allFields`', async () => {
            result.unloadData();
            await waitForWatchKeyAsync(result, 'isDataLoaded');

            const spy = jest.fn();

            result.watch('allFields', spy);
            reorderFields(['fldPrjctClient'], 1);

            expect(spy).toHaveBeenCalledTimes(0);
        });

        it('ignores further updates to `visibleFields`', async () => {
            result.unloadData();
            await waitForWatchKeyAsync(result, 'isDataLoaded');

            const spy = jest.fn();

            result.watch('visibleFields', spy);
            reorderFields(['fldPrjctClient'], 1);

            expect(spy).toHaveBeenCalledTimes(0);
        });
    });

    describe('#visibleFields', () => {
        it('returns visible fields only', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry'], 1);
            await result.loadDataAsync();

            const ids = result.visibleFields.map(({id}) => id);

            expect(ids).toEqual(['fldPrjctClient']);
        });

        it('updates in response to messages from AirtableInterface', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry'], 1);
            await result.loadDataAsync();

            reorderFields(['fldPrjctClient', 'fldPrjctCtgry'], 2);

            const ids = result.visibleFields.map(({id}) => id);

            expect(ids).toEqual(['fldPrjctClient', 'fldPrjctCtgry']);
        });

        it('reports error for unloaded results', () => {
            expect(() => view.selectMetadata().visibleFields).toThrowErrorMatchingInlineSnapshot(
                `"view meta data is not loaded"`,
            );
        });

        it('reports error for deleted views', async () => {
            const result = view.selectMetadata();

            mockVisibleFields([], 0);
            await result.loadDataAsync();

            deleteView();

            expect(() => result.visibleFields).toThrowErrorMatchingInlineSnapshot(
                `"ViewMetadataQueryResult has been deleted"`,
            );
        });
    });

    describe('#groupLevels', () => {
        it('returns null if provided nothing', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient'], 1);
            await result.loadDataAsync();

            expect(result.groupLevels).toEqual(null);
        });

        it('returns empty by default', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient'], 1, []);
            await result.loadDataAsync();

            expect(result.groupLevels).toEqual([]);
        });

        it('returns initial value by default', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient'], 1, [
                {fieldId: 'fldPrjctClient', direction: 'asc'},
            ]);
            await result.loadDataAsync();

            expect(result.groupLevels?.length).toEqual(1);
            expect(result.groupLevels?.[0].fieldId).toEqual('fldPrjctClient');
            expect(result.groupLevels?.[0].direction).toEqual('asc');
            expect(result.groupLevels?.[0].field.id).toEqual('fldPrjctClient');
        });

        it('updates in response to messages from AirtableInterface', async () => {
            const result = view.selectMetadata();

            mockVisibleFields(['fldPrjctClient'], 1);
            await result.loadDataAsync();

            changeGroupLevels([
                {fieldId: 'fldPrjctClient', direction: 'asc'},
                {fieldId: 'fldPrjctCtgry', direction: 'asc'},
            ]);

            expect(result.groupLevels?.length).toEqual(2);
            expect(result.groupLevels?.[0].fieldId).toEqual('fldPrjctClient');
            expect(result.groupLevels?.[0].direction).toEqual('asc');
            expect(result.groupLevels?.[0].field.id).toEqual('fldPrjctClient');
            expect(result.groupLevels?.[1].fieldId).toEqual('fldPrjctCtgry');
            expect(result.groupLevels?.[1].direction).toEqual('asc');
            expect(result.groupLevels?.[1].field.id).toEqual('fldPrjctCtgry');
        });

        it('reports error for unloaded results', () => {
            expect(() => view.selectMetadata().visibleFields).toThrowErrorMatchingInlineSnapshot(
                `"view meta data is not loaded"`,
            );
        });

        it('reports error for deleted views', async () => {
            const result = view.selectMetadata();

            mockVisibleFields([], 0);
            await result.loadDataAsync();

            deleteView();

            expect(() => result.visibleFields).toThrowErrorMatchingInlineSnapshot(
                `"ViewMetadataQueryResult has been deleted"`,
            );
        });
    });

    describe('#watch', () => {
        describe('key: allFields', () => {
            it('triggers model loading', async () => {
                const result = view.selectMetadata();

                mockVisibleFields([], 0);
                await waitForWatchKeyAsync(result, 'allFields');

                expect(result.isDataLoaded).toBe(true);
            });

            it('notifies when a visible field is removed', async () => {
                const spy = jest.fn();
                const result = view.selectMetadata();

                mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 2);
                await result.loadDataAsync();

                result.watch('allFields', spy);

                reorderFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 1);
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('notifies when a non-visible field is removed', async () => {
                const spy = jest.fn();
                const result = view.selectMetadata();

                mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 2);
                await result.loadDataAsync();

                result.watch('allFields', spy);

                reorderFields(['fldPrjctClient', 'fldPrjctCtgry'], 2);
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

        describe('key: visibleFields', () => {
            it('triggers model loading', async () => {
                const result = view.selectMetadata();

                mockVisibleFields([], 0);
                await waitForWatchKeyAsync(result, 'visibleFields');

                expect(result.isDataLoaded).toBe(true);
            });

            it('notifies when a visible field is removed', async () => {
                const spy = jest.fn();
                const result = view.selectMetadata();

                mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 2);
                await result.loadDataAsync();

                result.watch('visibleFields', spy);

                reorderFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 1);
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it.skip('does not notify when a non-visible field is removed', async () => {
                const spy = jest.fn();
                const result = view.selectMetadata();

                mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 2);
                await result.loadDataAsync();

                result.watch('visibleFields', spy);

                reorderFields(['fldPrjctClient', 'fldPrjctCtgry'], 2);
                expect(spy).toHaveBeenCalledTimes(0);
            });
        });

        describe('key: groupLevels', () => {
            it('triggers model loading', async () => {
                const result = view.selectMetadata();

                mockVisibleFields([], 0);
                await waitForWatchKeyAsync(result, 'groupLevels');

                expect(result.isDataLoaded).toBe(true);
            });

            it('notifies when a groupLevels changes', async () => {
                const spy = jest.fn();
                const result = view.selectMetadata();

                mockVisibleFields(['fldPrjctClient', 'fldPrjctCtgry', 'fldPrjctCmplt'], 2);
                await result.loadDataAsync();

                result.watch('groupLevels', spy);

                changeGroupLevels([
                    {fieldId: 'fldPrjctClient', direction: 'asc'},
                    {fieldId: 'fldPrjctCtgry', direction: 'asc'},
                ]);
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
