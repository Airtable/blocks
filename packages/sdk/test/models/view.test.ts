import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import {ViewType} from '../../src/types/view';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';
import BlockSdk from '../../src/sdk';
import AbstractModel from '../../src/models/abstract_model';
import Base from '../../src/models/base';
import * as RecordColoring from '../../src/models/record_coloring';
import Table from '../../src/models/table';
import View from '../../src/models/view';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

const recordsById = {
    recA: {
        id: 'recA',
        cellValuesByFieldId: {
            fldPrimary: '1',
            fldLinked1: {id: 'recB'},
        },
        commentCount: 0,
        createdTime: '2020-10-23T16:31:04.281Z',
    },
    recB: {
        id: 'recB',
        cellValuesByFieldId: {
            fldPrimary: '2',
            fldLinked1: {id: 'recC'},
        },
        commentCount: 0,
        createdTime: '2020-10-23T16:32:04.281Z',
    },
    recC: {
        id: 'recC',
        cellValuesByFieldId: {
            fldPrimary: '3',
            fldLinked1: {id: 'recA'},
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
    let sdk: BlockSdk;
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
                fieldIds: ['fldPrimary', 'fldLinked1'],
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

        sdk = getSdk();
        base = sdk.base;
        table = base.getTable('First Table');
        view = table.getViewById('viwPrjctAll');
    });

    afterEach(() => {
        clearSdkForTest();
        mockAirtableInterface.reset();
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
                    fields: ['fldPrimary'],
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
                    fields: ['fldPrimary'],
                    sorts: [{field: 'fldPrimary', direction: 'desc'}],
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
                        sorts: [{field: 'fldPrimary', direction: 'descending' as 'desc'}],
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
                        fields: [(1.0004 as unknown) as string],
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
                    fields: ['fldPrimary'],
                });

                expect(queryResult.fields!.length).toBe(1);
                expect(queryResult.fields![0].id).toBe('fldPrimary');
                expect(queryResult.records![0].id).toBe('recA');
                expect(queryResult.records![1].id).toBe('recB');
                expect(queryResult.records![2].id).toBe('recC');
            });

            test.skip('#selectRecordsAsync({ fields, sorts })', async () => {
                const queryResult = await view.selectRecordsAsync({
                    fields: ['fldPrimary'],
                    sorts: [{field: 'fldPrimary', direction: 'desc'}],
                });

                expect(queryResult.fields!.length).toBe(1);
                expect(queryResult.fields![0].id).toBe('fldPrimary');
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
                        fieldIds: ['fldPrimary', 'fldLinked1'],
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
        });

        describe('#watch()', () => {
            test('#watch(invalid key) throws', () => {
                expect(() =>
                    view.watch(('isDeleted' as unknown) as 'name', () => {}),
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
        });
    });
});
