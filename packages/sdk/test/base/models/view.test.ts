/* eslint-disable no-unused-expressions */
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {ViewType} from '../../../src/base/types/view';
import {__reset, __sdk as sdk} from '../../../src/base';
import AbstractModel from '../../../src/shared/models/abstract_model';
import type Base from '../../../src/base/models/base';
import * as RecordColoring from '../../../src/base/models/record_coloring';
import type Table from '../../../src/base/models/table';
import View from '../../../src/base/models/view';
import {MutationTypes} from '../../../src/base/types/mutations';
import {BlockRunContextType} from '../../../src/base/types/airtable_interface';
import getAirtableInterface from '../../../src/injected/airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
            }
            return mockAirtableInterface;
        },
    };
});

const mockAirtableInterface = getAirtableInterface() as jest.Mocked<MockAirtableInterface>;

const recordsById = {
    recA: {
        id: 'recA',
        cellValuesByFieldId: {
            fld1stPrimary: '1',
            fld1stLinked: {id: 'recB'},
        },
        commentCount: 0,
        createdTime: '2020-10-23T16:31:04.281Z',
    },
    recB: {
        id: 'recB',
        cellValuesByFieldId: {
            fld1stPrimary: '2',
            fld1stLinked: {id: 'recC'},
        },
        commentCount: 0,
        createdTime: '2020-10-23T16:32:04.281Z',
    },
    recC: {
        id: 'recC',
        cellValuesByFieldId: {
            fld1stPrimary: '3',
            fld1stLinked: {id: 'recA'},
        },
        commentCount: 0,
        createdTime: '2020-10-23T16:33:04.281Z',
    },
};

const viewPath = ['tablesById', 'tblFirst', 'viewsById', 'viwPrjctAll'];
const viewOrderPath = ['tablesById', 'tblFirst', 'viewOrder'];
const activeViewIdPath = ['tablesById', 'tblFirst', 'activeViewId'];
const deleteView = () => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: viewPath,
            value: undefined,
        },
        {
            path: viewOrderPath,
            value: [],
        },
        {
            path: activeViewIdPath,
            value: null,
        },
    ]);
};

describe('View', () => {
    let base: Base;
    let table: Table;
    let view: View;

    beforeEach(async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
            recordsById,
        });

        mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
            visibleRecordIds: ['recA', 'recB', 'recC'],
            fieldOrder: {
                fieldIds: ['fld1stPrimary', 'fld1stLinked'],
                visibleFieldCount: 2,
            },
            colorsByRecordId: {
                recA: 'purpleBright',
                recB: 'orangeBright',
                recC: 'pinkBright',
            },
        });

        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });
        mockAirtableInterface.fetchAndSubscribeToCursorDataAsync.mockResolvedValue({
            selectedRecordIdSet: {},
            selectedFieldIdSet: {},
        });

        base = sdk.base;
        table = base.getTable('First Table');
        view = table.getViewById('viwPrjctAll');
    });

    afterEach(() => {
        mockAirtableInterface.reset();
        __reset();
    });

    describe('constructor', () => {
        test('instance of View', () => {
            expect(view).toBeInstanceOf(View);
        });
        test('View subclass of AbstractModel', () => {
            expect(view).toBeInstanceOf(AbstractModel);
        });
    });

    describe('properties', () => {
        test('#id', () => {
            expect(view.id).toBe('viwPrjctAll');
            expect(() => {
                // @ts-ignore
                view.id = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property id of [object Object] which has only a getter"`,
            );
            expect(view.id).toBe('viwPrjctAll');
        });
        test('#isDeleted', () => {
            expect(view.isDeleted).toBe(false);
            expect(() => {
                // @ts-ignore
                view.isDeleted = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property isDeleted of [object Object] which has only a getter"`,
            );
            expect(view.isDeleted).toBe(false);
        });
        test('#name', () => {
            expect(view.name).toBe('All projects');
            expect(() => {
                // @ts-ignore
                view.name = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property name of [object Object] which has only a getter"`,
            );
            expect(view.name).toBe('All projects');
        });
        test('#url', () => {
            expect(view.url).toBe('https://airtable.test/tblFirst/viwPrjctAll');
            expect(() => {
                // @ts-ignore
                view.url = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property url of [object Object] which has only a getter"`,
            );
            expect(view.url).toBe('https://airtable.test/tblFirst/viwPrjctAll');
        });
        test('#type', () => {
            expect(view.type).toBe(ViewType.GRID);
            expect(() => {
                // @ts-ignore
                view.type = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property type of [object Object] which has only a getter"`,
            );
            expect(view.type).toBe(ViewType.GRID);
        });
        test('#isLockedView', () => {
            expect(view.isLockedView).toBe(false);
            expect(() => {
                // @ts-ignore
                view.isLockedView = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property isLockedView of [object Object] which has only a getter"`,
            );
            expect(view.isLockedView).toBe(false);
        });
    });

    describe('methods', () => {
        describe('#selectMetaData()', () => {
            test('returns ViewMetadataQueryResult', async () => {
                const viewMetadata = view.selectMetadata();
                await viewMetadata.loadDataAsync();

                expect(viewMetadata.isDataLoaded).toBe(true);

                deleteView();

                expect(() => {
                    viewMetadata.visibleFields;
                }).toThrowErrorMatchingInlineSnapshot(`"ViewMetadataQueryResult has been deleted"`);
            });
        });

        describe('#selectMetadataAsync()', () => {
            test('resolves to ViewMetadataQueryResult', async () => {
                const viewMetadata = await view.selectMetadataAsync();

                expect(viewMetadata.isDataLoaded).toBe(true);

                deleteView();

                expect(() => {
                    viewMetadata.visibleFields;
                }).toThrowErrorMatchingInlineSnapshot(`"ViewMetadataQueryResult has been deleted"`);
            });
        });

        describe('#updateMetadataAsync()', () => {
            test('handles empty object', async () => {
                mockAirtableInterface.sdkInitData.runContext = {
                    type: BlockRunContextType.VIEW,
                    tableId: 'tblFirst',
                    viewId: 'viwPrjctAll',
                };

                await view.updateMetadataAsync({});

                expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {},
                    },
                    {holdForMs: 100},
                );
            });
            test('handles null group metadata', async () => {
                mockAirtableInterface.sdkInitData.runContext = {
                    type: BlockRunContextType.VIEW,
                    tableId: 'tblFirst',
                    viewId: 'viwPrjctAll',
                };

                await view.updateMetadataAsync({groupLevels: null});

                expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: null},
                    },
                    {holdForMs: 100},
                );
            });
            test('handles group metadata with field as an object', async () => {
                mockAirtableInterface.sdkInitData.runContext = {
                    type: BlockRunContextType.VIEW,
                    tableId: 'tblFirst',
                    viewId: 'viwPrjctAll',
                };

                const field = view.parentTable.fields[0];
                await view.updateMetadataAsync({groupLevels: [{field, direction: 'asc'}]});

                expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: [{fieldId: field.id, direction: 'asc'}]},
                    },
                    {holdForMs: 100},
                );
            });
            test('handles group metadata with field as an id', async () => {
                mockAirtableInterface.sdkInitData.runContext = {
                    type: BlockRunContextType.VIEW,
                    tableId: 'tblFirst',
                    viewId: 'viwPrjctAll',
                };

                const field = view.parentTable.fields[0];
                await view.updateMetadataAsync({
                    groupLevels: [{field: field.id, direction: 'asc'}],
                });

                expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: [{fieldId: field.id, direction: 'asc'}]},
                    },
                    {holdForMs: 100},
                );
            });
        });

        describe('#checkPermissionsForUpdateMetadata()', () => {
            test('correctly queries AirtableInterface when nothing is provided', async () => {
                view.checkPermissionsForUpdateMetadata({});

                expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {},
                    },
                    mockAirtableInterface.sdkInitData.baseData,
                );
            });
            test('handles null group metadata', async () => {
                view.checkPermissionsForUpdateMetadata({groupLevels: null});

                expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: null},
                    },
                    mockAirtableInterface.sdkInitData.baseData,
                );
            });
            test('handles group metadata with field as an object', async () => {
                const field = view.parentTable.fields[0];
                view.checkPermissionsForUpdateMetadata({groupLevels: [{field, direction: 'asc'}]});

                expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: [{fieldId: field.id, direction: 'asc'}]},
                    },
                    mockAirtableInterface.sdkInitData.baseData,
                );
            });
            test('handles group metadata with field as an id', async () => {
                const field = view.parentTable.fields[0];
                view.checkPermissionsForUpdateMetadata({
                    groupLevels: [{field: field.id, direction: 'asc'}],
                });

                expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {groupLevels: [{fieldId: field.id, direction: 'asc'}]},
                    },
                    mockAirtableInterface.sdkInitData.baseData,
                );
            });
        });

        describe('#hasPermissionToUpdateMetadata()', () => {
            test('correctly queries AirtableInterface when nothing is provided', async () => {
                view.hasPermissionToUpdateMetadata({});

                expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                    {
                        type: MutationTypes.UPDATE_VIEW_METADATA,
                        tableId: 'tblFirst',
                        viewId: 'viwPrjctAll',
                        metadata: {},
                    },
                    mockAirtableInterface.sdkInitData.baseData,
                );
            });
        });

        describe('#selectRecords()', () => {
            test('returns TableOrViewQueryResult', async () => {
                const queryResult = view.selectRecords();
                await queryResult.loadDataAsync();

                expect(queryResult.isDataLoaded).toBe(true);

                deleteView();

                expect(() => {
                    queryResult.recordIds;
                }).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult's underlying view has been deleted"`,
                );
            });

            test('#selectRecords({ fields }) throws when fields contains invalid field id', async () => {
                expect(() => {
                    view.selectRecords({
                        fields: ['fldDoesNotExist'],
                    });
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Field 'fldDoesNotExist' does not exist in table 'First Table'"`,
                );
            });

            test('#selectRecords({ fields })', async () => {
                const queryResult = view.selectRecords({
                    fields: ['fld1stPrimary'],
                });

                await queryResult.loadDataAsync();

                expect(queryResult.fields!.length).toBe(1);
                expect(queryResult.fields![0].name).toBe('Name');
                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('#selectRecords({ fields, sorts })', async () => {
                const queryResult = view.selectRecords({
                    fields: ['fld1stPrimary'],
                    sorts: [{field: 'fld1stPrimary', direction: 'desc'}],
                });

                await queryResult.loadDataAsync();

                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('#selectRecords({ recordColorMode: RecordColoring.modes.none() })', async () => {
                const queryResult = view.selectRecords({
                    recordColorMode: RecordColoring.modes.none(),
                });

                await queryResult.loadDataAsync();

                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('#selectRecords({ recordColorMode: RecordColoring.modes.byView() })', async () => {
                const queryResult = view.selectRecords({
                    recordColorMode: RecordColoring.modes.byView(view),
                });

                expect(() => queryResult.recordIds).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult data is not loaded"`,
                );

                await queryResult.loadDataAsync();

                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('throws for invalid record color modes', () => {
                expect(() => {
                    view.selectRecords({
                        recordColorMode: {
                            type: 'cranberries' as 'none',
                        },
                    });
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Unknown record coloring mode type: cranberries"`,
                );
            });

            test('throws for invalid sorting directions', () => {
                expect(() => {
                    view.selectRecords({
                        sorts: [{field: 'fld1stPrimary', direction: 'descending' as 'desc'}],
                    });
                }).toThrowErrorMatchingInlineSnapshot(`"Invalid sort direction: descending"`);
            });

            it('does not throw for some falsey `fields` values', () => {
                view.selectRecords({
                    // eslint-disable-next-line no-sparse-arrays
                    fields: [,],
                });
                view.selectRecords({
                    fields: [undefined],
                });
                view.selectRecords({
                    fields: [null],
                });
                view.selectRecords({
                    fields: [false],
                });
            });

            it('throws for invalid field specifiers', () => {
                expect(() => {
                    view.selectRecords({
                        fields: [1.0004 as unknown as string],
                    });
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Invalid value for field, expected a field, id, or name but got: 1.0004"`,
                );
            });
        });

        describe('#selectRecordsAsync()', () => {
            test('resolves to TableOrViewQueryResult', async () => {
                const queryResult = await view.selectRecordsAsync();
                expect(queryResult.isDataLoaded).toBe(true);

                deleteView();

                expect(() => {
                    queryResult.recordIds;
                }).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult's underlying view has been deleted"`,
                );
            });

            test('#selectRecordsAsync({ fields })', async () => {
                const queryResult = await view.selectRecordsAsync({
                    fields: ['fld1stPrimary'],
                });

                expect(queryResult.fields!.length).toBe(1);
                expect(queryResult.fields![0].id).toBe('fld1stPrimary');
                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test.skip('#selectRecordsAsync({ fields, sorts })', async () => {
                const queryResult = await view.selectRecordsAsync({
                    fields: ['fld1stPrimary'],
                    sorts: [{field: 'fld1stPrimary', direction: 'desc'}],
                });

                expect(queryResult.fields!.length).toBe(1);
                expect(queryResult.fields![0].id).toBe('fld1stPrimary');
                expect(queryResult.records![0].id).toBe('recC');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recA');
            });

            test('#selectRecordsAsync({ recordColorMode: RecordColoring.modes.none() })', async () => {
                const queryResult = await view.selectRecordsAsync({
                    recordColorMode: RecordColoring.modes.none(),
                });

                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('#selectRecordsAsync({ recordColorMode: RecordColoring.modes.byView() })', async () => {
                const queryResult = await view.selectRecordsAsync({
                    recordColorMode: RecordColoring.modes.byView(view),
                });

                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test('partial data provided by AirtableInterface', async () => {
                mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
                    visibleRecordIds: ['recA', 'recB', 'recC'],
                    fieldOrder: {
                        fieldIds: ['fld1stPrimary', 'fld1stLinked'],
                        visibleFieldCount: 2,
                    },
                    colorsByRecordId: null,
                });
                const queryResult = await view.selectRecordsAsync();

                expect(queryResult.records[0].getColorInView(view)).toBe(null);
                expect(queryResult.records[1].getColorInView(view)).toBe(null);
                expect(queryResult.records[2].getColorInView(view)).toBe(null);
            });

            test('rejects when table has been deleted', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst'],
                        value: undefined,
                    },
                ]);

                await expect(table.selectRecordsAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult's underlying table has been deleted"`,
                );
            });
        });

        describe('#toString()', () => {
            test('returns a debugging string', async () => {
                expect(view.toString()).toMatchInlineSnapshot(`"[View viwPrjctAll]"`);
            });
        });

        describe('#unwatch()', () => {
            test('#unwatch("name")', () => {
                const fn = jest.fn();
                view.watch('name', fn);

                expect(fn).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'name'],
                        value: 'Something else',
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);

                view.unwatch('name', fn);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'name'],
                        value: 'Another thing',
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);
            });

            test('#unwatch("isLockedView")', () => {
                const fn = jest.fn();
                view.watch('isLockedView', fn);

                expect(fn).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'isLocked'],
                        value: true,
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);

                view.unwatch('isLockedView', fn);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'isLocked'],
                        value: false,
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);
            });
        });

        describe('#watch()', () => {
            test('#watch(invalid key) throws', () => {
                expect(() =>
                    view.watch('isDeleted' as unknown as 'name', () => {}),
                ).toThrowErrorMatchingInlineSnapshot(`"Invalid key to watch for View: isDeleted"`);
            });

            test('#watch("name")', () => {
                const fn = jest.fn();
                view.watch('name', fn);

                expect(fn).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'name'],
                        value: 'Something else',
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);
                expect(fn).toHaveBeenCalledWith(view, 'name');
            });

            test('#watch("isLockedView")', () => {
                const fn = jest.fn();
                view.watch('isLockedView', fn);

                expect(fn).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [...viewPath, 'isLocked'],
                        value: true,
                    },
                ]);

                expect(fn).toHaveBeenCalledTimes(1);
                expect(fn).toHaveBeenCalledWith(view, 'isLockedView');
            });
        });
    });

    describe('deleting a view', () => {
        test('errors when deleting a locked view', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [...viewPath, 'isLocked'],
                    value: true,
                },
            ]);

            deleteView();

            expect(() => {
                view.isLockedView;
            }).toThrowErrorMatchingInlineSnapshot(`"View has been deleted"`);
        });

        test('succeeds when deleting an unlocked view', () => {
            const fn = jest.fn();
            view.watch('isLockedView', fn);

            expect(fn).toHaveBeenCalledTimes(0);
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [...viewPath, 'isLocked'],
                    value: false,
                },
            ]);
            expect(fn).toHaveBeenCalledTimes(1);

            deleteView();

            expect(fn).toHaveBeenCalledTimes(1);
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: viewOrderPath,
                    value: ['viwPrjctAll'],
                },
                {
                    path: activeViewIdPath,
                    value: 'viwPrjctAll',
                },
            ]);
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });
});
