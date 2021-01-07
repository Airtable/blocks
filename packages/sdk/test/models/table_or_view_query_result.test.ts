import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import Base from '../../src/models/base';
import {waitForWatchKeyAsync} from '../test_helpers';
import {__reset, __sdk as sdk} from '../../src';
import {modes as recordColorModes} from '../../src/models/record_coloring';
import {FieldType} from '../../src/types/field';
import {RecordData} from '../../src/types/record';
import Table from '../../src/models/table';
import Field from '../../src/models/field';
import View from '../../src/models/view';

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

type CellValue = string | number | {[key: string]: string};

const recordEntry = (id: string, valuesByFieldId: {[key: string]: CellValue}) => ({
    [id]: {
        id,
        cellValuesByFieldId: valuesByFieldId,
        commentCount: 0,
        createdTime: '2020-10-21T01:30:11.506Z',
    },
});

const mockRecordData = (tableId: 'tblDesignProjects' | 'tblTasks', includeView: boolean) => {
    let recordsById: {[key: string]: RecordData};

    if (tableId === 'tblDesignProjects') {
        recordsById = {
            ...recordEntry('recA', {
                fldPrjctName: 'b',
                fldPrjctCtgry: {color: 'teal'},
            }),
            ...recordEntry('recB', {
                fldPrjctName: 'a',
                fldPrjctCtgry: {color: 'redBright'},
            }),
            ...recordEntry('recC', {
                fldPrjctName: 'c',
                fldPrjctCtgry: {},
            }),
        };
    } else {
        recordsById = {
            ...recordEntry('recD', {
                fldTaskName: 'b',
                fldTaskNotes: 'c',
                fldTaskTime: 1,
            }),
            ...recordEntry('recE', {
                fldTaskName: 'a',
                fldTaskNotes: 'b',
                fldTaskTime: 3,
            }),
            ...recordEntry('recF', {
                fldTaskName: 'c',
                fldTaskNotes: 'a',
                fldTaskTime: 2,
            }),
        };
    }

    mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});

    if (includeView) {
        mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
            visibleRecordIds: Object.keys(recordsById).slice(1),
            fieldOrder: {
                fieldIds: [],
                visibleFieldCount: 0,
            },
            colorsByRecordId: {},
        });
    }

    mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
        recordsById,
    });
};

const mockVisListRecordOrderOnce = (recordIds: Array<string>) => {
    const {createVisList} = mockAirtableInterface;
    createVisList.mockImplementationOnce(function(this: any, ...args) {
        const visList = createVisList.apply(this as any, args);
        (visList.getOrderedRecordIds as jest.Mock).mockReturnValue(recordIds);
        return visList;
    });
};

describe('TableOrViewQueryResult', () => {
    let base: Base;

    beforeEach(() => {
        base = sdk.base;
    });

    afterEach(() => {
        mockAirtableInterface.reset();
        __reset();
    });

    describe('caching', () => {
        it('caches like requests', () => {
            const first = base.tables[0].selectRecords();
            const second = base.tables[0].selectRecords();
            expect(first).toBe(second);
        });

        it('does not cache dissimilar requests', () => {
            const first = base.tables[0].selectRecords();
            const second = base.tables[0].selectRecords({
                fields: ['fldPrjctName'],
            });
            expect(first).not.toBe(second);
        });
    });

    it('#parentTable', () => {
        const result = base.tables[0].selectRecords();
        expect(result.parentTable).toBe(base.tables[0]);
    });

    describe('#parentView', () => {
        it('returns `null` for table results', () => {
            const result = base.tables[0].selectRecords();
            expect(result.parentView).toBe(null);
        });

        it('returns view for view results', () => {
            const view = base.tables[0].views[0];
            const result = view.selectRecords();
            expect(result.parentView).toBe(view);
        });
    });

    describe('#recordIds', () => {
        it('rejects requests for unloaded results', () => {
            const result = base.tables[0].selectRecords();
            expect(() => result.recordIds).toThrowErrorMatchingInlineSnapshot(
                `"RecordQueryResult data is not loaded"`,
            );
        });

        it('returns correct record IDs', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.recordIds).toStrictEqual(['recA', 'recB', 'recC']);
        });

        it('rejects requests when source table has been deleted', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tableOrder'],
                    value: ['tblTasks', 'tblClients'],
                },
                {
                    path: ['tablesById', 'tblDesignProjects'],
                    value: undefined,
                },
            ]);

            expect(() => result.recordIds).toThrowErrorMatchingInlineSnapshot(
                `"RecordQueryResult's underlying table has been deleted"`,
            );
        });

        it('rejects requests when source view has been deleted', async () => {
            mockRecordData('tblDesignProjects', true);
            const result = await base.tables[0].views[0].selectRecordsAsync();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['viewOrder'],
                    value: [
                        'viwPrjctIncmplt',
                        'viwPrjctCompleted',
                        'viwPrjctCalendar',
                        'viwPrjctDueDates',
                    ],
                },
                {
                    path: ['tablesById', 'tblDesignProjects', 'viewsById', 'viwPrjctAll'],
                    value: undefined,
                },
            ]);

            expect(() => result.recordIds).toThrowErrorMatchingInlineSnapshot(
                `"RecordQueryResult's underlying view has been deleted"`,
            );
        });
    });

    describe('#fields', () => {
        it('returns null when no fields are requested', () => {
            const result = base.tables[0].selectRecords();
            expect(result.fields).toBe(null);
        });

        it('returns empty array when an empty set of fields is requested', () => {
            const result = base.tables[0].selectRecords({fields: []});
            expect(result.fields).toStrictEqual([]);
        });

        it('returns appropriate array when fields are requested', () => {
            const result = base.tables[0].selectRecords({
                fields: ['fldPrjctName', 'fldPrjctClient'],
            });
            expect(result.fields).toStrictEqual([
                base.tables[0].fields[0],
                base.tables[0].fields[1],
            ]);
        });

        it('omits deleted fields', () => {
            const result = base.tables[0].selectRecords({
                fields: ['fldPrjctName', 'fldPrjctCtgry'],
            });
            const expected = [base.tables[0].fields[0]];
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblDesignProjects', 'fieldsById', 'fldPrjctCtgry'],
                    value: null,
                },
            ]);
            expect(result.fields).toStrictEqual(expected);
        });
    });

    describe('#getRecordById', () => {
        it('throws an error for unloaded records', () => {
            const result = base.tables[0].selectRecords();
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('throws an error for non-existent records', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No record with ID not a record id in this query result"`,
            );
        });
    });

    describe('#getRecordByIdIfExists', () => {
        it('throws an error for unloaded records', () => {
            const result = base.tables[0].selectRecords();
            expect(() =>
                result.getRecordByIdIfExists('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('returns `null` for non-existent records', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.getRecordByIdIfExists('not a record id')).toBe(null);
        });
    });

    describe('#getRecordColor', () => {
        it('throws an error for unloaded records', () => {
            const result = base.tables[0].selectRecords();
            expect(() => result.getRecordColor('recB')).toThrowErrorMatchingInlineSnapshot(
                `"Record metadata is not loaded"`,
            );
        });

        describe('mode: none', () => {
            it('returns `null` (record specified by ID)', async () => {
                mockRecordData('tblDesignProjects', false);
                const result = await base.tables[0].selectRecordsAsync();
                expect(result.getRecordColor('recB')).toBe(null);
            });

            it('returns `null` (record specified by instance)', async () => {
                mockRecordData('tblDesignProjects', false);
                const result = await base.tables[0].selectRecordsAsync();
                expect(result.getRecordColor(result.records[1])).toBe(null);
            });
        });

        describe('mode: bySelectField', () => {
            it('returns the correct color', async () => {
                mockRecordData('tblDesignProjects', false);
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(
                        base.tables[0].getField('Category'),
                    ),
                });

                expect(result.getRecordColor('recA')).toBe('teal');
                expect(result.getRecordColor('recB')).toBe('redBright');
            });

            it('returns `null` when color is not specified', async () => {
                mockRecordData('tblDesignProjects', false);
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(
                        base.tables[0].getField('Category'),
                    ),
                });

                expect(result.getRecordColor('recC')).toBe(null);
            });

            it('returns `null` when field type has been modified', async () => {
                mockRecordData('tblDesignProjects', false);
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(
                        base.tables[0].getField('Category'),
                    ),
                });

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblDesignProjects',
                            'fieldsById',
                            'fldPrjctCtgry',
                            'type',
                        ],
                        value: 'text',
                    },
                ]);

                expect(result.getRecordColor('recA')).toBe(null);
            });
        });

        describe('mode: byView', () => {
            it('returns the correct color', async () => {
                const view = base.tables[0].getView('All projects');
                mockRecordData('tblDesignProjects', true);
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.byView(view),
                });
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblDesignProjects',
                            'viewsById',
                            view.id,
                            'colorsByRecordId',
                        ],
                        value: {
                            recA: 'red',
                            recB: 'white',
                            recC: 'grayLight2',
                        },
                    },
                ]);

                expect(result.getRecordColor('recA')).toBe('red');
                expect(result.getRecordColor('recB')).toBe('white');
                expect(result.getRecordColor('recC')).toBe('grayLight2');
            });
        });
    });

    describe('#hasRecord', () => {
        it('rejects requests for unloaded results', () => {
            const result = base.tables[0].selectRecords();
            expect(() => result.hasRecord('recA')).toThrowErrorMatchingInlineSnapshot(
                `"RecordQueryResult data is not loaded"`,
            );
        });

        it('positive with record ID', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.hasRecord('recA')).toBe(true);
            expect(result.hasRecord('recB')).toBe(true);
            expect(result.hasRecord('recC')).toBe(true);
        });

        it('negative with record ID', async () => {
            mockRecordData('tblDesignProjects', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.hasRecord('recD')).toBe(false);
        });

        it('positive with record instance', async () => {
            mockRecordData('tblDesignProjects', false);
            const result1 = await base.tables[0].selectRecordsAsync();
            const result2 = await base.tables[0].selectRecordsAsync();
            expect(result1.hasRecord(result2.records[0])).toBe(true);
            expect(result1.hasRecord(result2.records[1])).toBe(true);
            expect(result1.hasRecord(result2.records[2])).toBe(true);
        });

        it('negative with record instance', async () => {
            mockRecordData('tblDesignProjects', false);
            const result1 = await base.tables[0].selectRecordsAsync();
            mockRecordData('tblTasks', false);
            const result2 = await base.tables[1].selectRecordsAsync();
            expect(result1.hasRecord(result2.records[0])).toBe(false);
        });
    });

    describe('#isDeleted', () => {
        it('returns `false` when parent table is present', () => {
            const result = base.tables[1].selectRecords();

            expect(result.isDeleted).toBe(false);
        });

        it('returns `true` when parent table has been deleted', () => {
            const result = base.tables[1].selectRecords();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tableOrder'],
                    value: ['tblDesignProjects', 'tblClients'],
                },
                {
                    path: ['tablesById', 'tblTasks'],
                    value: undefined,
                },
            ]);

            expect(result.isDeleted).toBe(true);
        });
    });

    describe('#loadDataAsync', () => {
        describe('from table', () => {
            beforeEach(() => {
                mockRecordData('tblTasks', false);
            });

            it('loads all fields from table by default', async () => {
                const result = base.tables[1].selectRecords();

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldTaskName')).toBe('b');
                expect(result.records[0].getCellValue('fldTaskNotes')).toBe('c');
                expect(result.records[0].getCellValue('fldTaskTime')).toBe(1);
            });

            it('loads fields explicitly specified by `fields` option', async () => {
                const result = base.tables[1].selectRecords({fields: ['fldTaskNotes']});

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldTaskNotes')).toBe('c');
            });

            it('loads fields explicitly specified by `sorts` option', async () => {
                const result = base.tables[1].selectRecords({
                    fields: ['fldTaskNotes'],
                    sorts: [{field: 'fldTaskTime'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldTaskTime')).toBe(1);
            });

            it('tolerates deleted fields specified by `sorts` option', async () => {
                const result = base.tables[1].selectRecords({
                    sorts: [{field: 'fldTaskTime'}],
                });

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldTaskTime'],
                        value: undefined,
                    },
                ]);
                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldTaskName')).toBe('b');
            });

            it('loads fields explicitly specified by `recordColorMode` option', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldSelect'],
                        value: {
                            id: 'fldSelect',
                            name: 'Select Field',
                            type: FieldType.SINGLE_SELECT,
                            typeOptions: {
                                choiceOrder: ['selA', 'selB'],
                                choices: {
                                    selA: {
                                        name: 'Option A',
                                        id: 'selA',
                                        color: 'cyanDark',
                                    },
                                    selB: {
                                        name: 'Option B',
                                        id: 'selB',
                                        color: 'redDark',
                                    },
                                },
                            },
                            description: '',
                            lock: null,
                        },
                    },
                ]);
                const selectField = base.tables[1].fields[6];
                const result = base.tables[1].selectRecords({
                    fields: ['fldTaskNotes'],
                    recordColorMode: recordColorModes.bySelectField(selectField),
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldSelect')).toBe(null);
            });

            it('loads all fields when no particular fields are requested and `recordColorMode` option references a field', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldSelect'],
                        value: {
                            id: 'fldSelect',
                            name: 'Select Field',
                            type: FieldType.SINGLE_SELECT,
                            typeOptions: {
                                choiceOrder: ['selA', 'selB'],
                                choices: {
                                    selA: {
                                        name: 'Option A',
                                        id: 'selA',
                                        color: 'cyanDark',
                                    },
                                    selB: {
                                        name: 'Option B',
                                        id: 'selB',
                                        color: 'redDark',
                                    },
                                },
                            },
                            description: '',
                            lock: null,
                        },
                    },
                ]);
                const selectField = base.tables[1].fields[6];
                const result = base.tables[1].selectRecords({
                    recordColorMode: recordColorModes.bySelectField(selectField),
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                result.records[0].getCellValue('fldTaskName');
                result.records[0].getCellValue('fldTaskNotes');
                result.records[0].getCellValue('fldTaskProject');
                result.records[0].getCellValue('fldTaskTime');
                result.records[0].getCellValue('fldTaskCompleted');
                result.records[0].getCellValue('fldTaskAssignee');
                result.records[0].getCellValue('fldSelect');
            });

            it('does not load fields that are not specified by `fields` nor `sorts`', async () => {
                const result = base.tables[1].selectRecords({
                    fields: ['fldTaskNotes'],
                    sorts: [{field: 'fldTaskTime'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(() =>
                    result.records[0].getCellValue('fldTaskCompleted'),
                ).toThrowErrorMatchingInlineSnapshot(
                    `"Cell values for field fldTaskCompleted are not loaded"`,
                );
            });

            it('requests update to record order when type of sorted field changes', async () => {
                const result = base.tables[1].selectRecords({
                    sorts: [{field: 'fldTaskNotes'}],
                });

                await result.loadDataAsync();

                mockVisListRecordOrderOnce(['recF', 'recD', 'recE']);
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldTaskNotes', 'type'],
                        value: FieldType.SINGLE_LINE_TEXT,
                    },
                ]);

                expect(result.recordIds).toStrictEqual(['recF', 'recD', 'recE']);
            });
        });

        describe('from view', () => {
            const changeVisibleRecords = (recordIds: Array<string>) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblTasks',
                            'viewsById',
                            'viwTaskAll',
                            'visibleRecordIds',
                        ],
                        value: recordIds,
                    },
                ]);
            };

            beforeEach(() => {
                mockRecordData('tblTasks', true);
            });

            it('loads all fields from view by default', async () => {
                const result = base.tables[1].views[0].selectRecords();

                await result.loadDataAsync();

                expect(result.records.length).toBe(2);
                expect(result.records[0].getCellValue('fldTaskName')).toBe('a');
                expect(result.records[0].getCellValue('fldTaskNotes')).toBe('b');
                expect(result.records[0].getCellValue('fldTaskTime')).toBe(3);
            });

            it('loads fields explicitly specified by `sorts` option', async () => {
                const result = base.tables[1].views[0].selectRecords({
                    fields: ['fldTaskNotes'],
                    sorts: [{field: 'fldTaskTime'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(2);
                expect(result.records[0].getCellValue('fldTaskTime')).toBe(3);
            });

            it('alerts AirtableInterface of newly-visible records when sorting is enabled', async () => {
                await base.tables[1].views[0].selectRecordsAsync({
                    sorts: [{field: 'fldTaskTime'}],
                });

                changeVisibleRecords(['recD', 'recE', 'recF']);

                const visList =
                    mockAirtableInterface.createVisList.mock.results[
                        mockAirtableInterface.createVisList.mock.results.length - 1
                    ].value;
                expect(visList.removeRecordIds.mock.calls.length).toBe(0);
                expect(visList.addRecordData).toHaveBeenCalledWith({
                    cellValuesByFieldId: {
                        fldTaskTime: 1,
                        fldTaskName: 'b',
                        fldTaskNotes: 'c',
                    },
                    commentCount: 0,
                    createdTime: '2020-10-21T01:30:11.506Z',
                    id: 'recD',
                });
            });

            it('alerts AirtableInterface of newly-hidden records when sorting is enabled', async () => {
                await base.tables[1].views[0].selectRecordsAsync({
                    sorts: [{field: 'fldTaskTime'}],
                });

                changeVisibleRecords(['recF']);

                const visList =
                    mockAirtableInterface.createVisList.mock.results[
                        mockAirtableInterface.createVisList.mock.results.length - 1
                    ].value;
                expect(visList.removeRecordIds).toHaveBeenCalledWith(['recE']);
                expect(visList.addRecordData.mock.calls.length).toBe(0);
            });

            it('reflects newly-visible fields in #hasRecord', async () => {
                const result = await base.tables[1].views[0].selectRecordsAsync();

                expect(result.hasRecord('recD')).toBe(false);
                changeVisibleRecords(['recD', 'recE', 'recF']);
                expect(result.hasRecord('recD')).toBe(true);
            });

            it('reflects newly-hidden fields in #hasRecord', async () => {
                const result = await base.tables[1].views[0].selectRecordsAsync();

                expect(result.hasRecord('recE')).toBe(true);
                changeVisibleRecords(['recF']);
                expect(result.hasRecord('recE')).toBe(false);
            });

            it('gracefully handles when record color updates arrive before view data', () => {
                const result = base.tables[1].views[0].selectRecords();

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            base.tables[1].id,
                            'viewsById',
                            base.tables[1].views[0].id,
                            'colorsByRecordId',
                            'recD',
                        ],
                        value: 'pinkBright',
                    },
                ]);

                return result.loadDataAsync();
            });
        });
    });

    describe('#unloadData', () => {
        describe('from table', () => {
            beforeEach(() => {
                mockRecordData('tblTasks', false);
            });

            it('unloads record data', async () => {
                const result = await base.tables[1].selectRecordsAsync();

                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult data is not loaded"`,
                );
            });

            it('unloads record data from deleted table', async () => {
                const result = await base.tables[1].selectRecordsAsync();

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: undefined,
                    },
                ]);
                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult's underlying table has been deleted"`,
                );
            });

            it('stops watching for changes to type of sorted field', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    sorts: [{field: 'fldTaskNotes'}],
                });

                result.unloadData();
                await waitForWatchKeyAsync(result, 'isDataLoaded');

                await result.loadDataAsync();

                mockVisListRecordOrderOnce(['recF', 'recD', 'recE']);
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldTaskNotes', 'type'],
                        value: FieldType.SINGLE_LINE_TEXT,
                    },
                ]);

                expect(result.recordIds).toStrictEqual(['recF', 'recD', 'recE']);
            });

            it('tolerates sorted fields that have been deleted', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    sorts: [{field: 'fldTaskNotes'}],
                });

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'fieldsById', 'fldTaskNotes'],
                        value: undefined,
                    },
                ]);

                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');
            });

            it('tolerates unnecessary invocations', async () => {
                const result = base.tables[0].selectRecords();
                const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

                try {
                    expect(() => result.unloadData()).not.toThrow();
                } finally {
                    warnSpy.mockRestore();
                }

                await result.loadDataAsync();
            });

            describe('unsubscribing from cell values in fields', () => {
                const whenUnsubscribed = () => {
                    return new Promise(resolve => {
                        mockAirtableInterface.unsubscribeFromCellValuesInFields.mockImplementation(
                            resolve,
                        );
                    });
                };

                it('succeeds after all records have been nullified', async () => {
                    const result = await base.tables[1].selectRecordsAsync({
                        fields: ['fldTaskName', 'fldTaskNotes'],
                    });
                    result.unloadData();
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: ['tablesById', 'tblTasks', 'recordsById'],
                            value: undefined,
                        },
                    ]);
                    await whenUnsubscribed();
                });

                it('succeeds after individual record data has been nullified', async () => {
                    const result = await base.tables[1].selectRecordsAsync({
                        fields: ['fldTaskName', 'fldTaskNotes'],
                    });
                    result.unloadData();
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblTasks',
                                'recordsById',
                                'recD',
                                'cellValuesByFieldId',
                            ],
                            value: undefined,
                        },
                    ]);
                    await whenUnsubscribed();
                });
            });
        });

        describe('from view', () => {
            beforeEach(() => {
                mockRecordData('tblTasks', true);
            });

            it('unloads record data', async () => {
                const result = await base.tables[1].views[0].selectRecordsAsync();

                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult data is not loaded"`,
                );
            });

            it('unloads record data from deleted view', async () => {
                const view = base.tables[1].views[0];
                const result = await view.selectRecordsAsync();

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['viewOrder'],
                        value: [],
                    },
                    {
                        path: ['tablesById', 'tblTasks', 'viewsById', view.id],
                        value: undefined,
                    },
                ]);
                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult's underlying view has been deleted"`,
                );
            });

            it('tolerates unnecessary invocations', async () => {
                const result = base.tables[1].views[0].selectRecords();
                const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

                try {
                    expect(() => result.unloadData()).not.toThrow();
                } finally {
                    warnSpy.mockRestore();
                }

                await result.loadDataAsync();
            });
        });
    });

    describe('#unwatch', () => {
        let count = 0;
        const change = (fieldId: string) => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblTasks',
                        'recordsById',
                        'recB',
                        'cellValuesByFieldId',
                        fieldId,
                    ],
                    value: 'value number ' + count++,
                },
            ]);
        };

        beforeEach(() => {
            mockRecordData('tblDesignProjects', false);
        });

        describe('recordColors', () => {
            const changeByView = (table: Table, view: View, value: string) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            table.id,
                            'viewsById',
                            view.id,
                            'colorsByRecordId',
                            'recC',
                        ],
                        value: 'green',
                    },
                ]);
            };
            const changeBySelectField = (table: Table, field: Field, value: string) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            table.id,
                            'recordsById',
                            'recC',
                            'cellValuesByFieldId',
                            field.id,
                        ],
                        value,
                    },
                ]);
            };

            it('colorMode: none - cleans up final listener', async () => {
                const view = base.tables[0].views[0];
                const field = base.tables[0].getField('Category');
                const result = await base.tables[0].selectRecordsAsync();
                const spy = jest.fn();
                result.watch('recordColors', spy);
                changeByView(base.tables[0], view, 'green');
                changeBySelectField(base.tables[0], field, 'green');
                expect(spy.mock.calls.length).toBe(0);

                result.unwatch('recordColors', spy);

                changeByView(base.tables[0], view, 'yellow');
                changeBySelectField(base.tables[0], field, 'yellow');
                expect(spy.mock.calls.length).toBe(0);
            });

            it('colorMode: byView - cleans up final listener', async () => {
                mockRecordData('tblDesignProjects', true);
                const view = base.tables[0].views[0];
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.byView(view),
                });
                const spy = jest.fn();
                result.watch('recordColors', spy);
                result.unwatch('recordColors', spy);
                result.watch('recordColors', spy);
                changeByView(base.tables[0], view, 'red orange');
                expect(spy.mock.calls.length).toBe(1);

                result.unwatch('recordColors', spy);
                result.watch('recordColors', spy);
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
                        value: [],
                    },
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewsById', view.id],
                        value: undefined,
                    },
                ]);
                result.unwatch('recordColors', spy);
                changeByView(base.tables[0], view, 'orange red');

                expect(spy.mock.calls.length).toBe(1);
            });

            it('colorMode: byView - persists other listeners', async () => {
                mockRecordData('tblDesignProjects', true);
                const view = base.tables[0].views[0];
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.byView(view),
                });
                const noop = () => {};
                const spy = jest.fn();
                result.watch('recordColors', noop);
                result.watch('recordColors', spy);

                result.unwatch('recordColors', noop);
                changeByView(base.tables[0], view, 'orange red');

                expect(spy.mock.calls.length).toBe(1);
            });

            it('colorMode: bySelectField - ignores invocations prior to loading', async () => {
                const field = base.tables[0].getField('Category');
                const result = base.tables[0].selectRecords({
                    fields: [field],
                    recordColorMode: recordColorModes.bySelectField(field),
                });
                const spy = jest.fn();
                let consoleSpies = [
                    jest.spyOn(console, 'log').mockImplementation(() => {}),
                    jest.spyOn(console, 'warn').mockImplementation(() => {}),
                ];

                try {
                    result.unloadData();
                } finally {
                    consoleSpies[0].mockRestore();
                    consoleSpies[1].mockRestore();
                }

                await result.loadDataAsync();

                result.watch('recordColors', spy);

                changeBySelectField(base.tables[0], field, 'yellow');
                expect(spy.mock.calls.length).toBe(1);
            });

            it('colorMode: bySelectField - cleans up final listener', async () => {
                const field = base.tables[0].getField('Category');
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(field),
                });
                const spy = jest.fn();
                result.watch('recordColors', spy);
                result.unwatch('recordColors', spy);
                result.watch('recordColors', spy);
                changeBySelectField(base.tables[0], field, 'green');
                expect(spy.mock.calls.length).toBe(1);

                result.unwatch('recordColors', spy);

                changeBySelectField(base.tables[0], field, 'yellow');
                expect(spy.mock.calls.length).toBe(1);
            });

            it('colorMode: bySelectField - persists other listeners', async () => {
                const field = base.tables[0].getField('Category');
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(field),
                });
                const noop = () => {};
                const spy = jest.fn();
                result.watch('recordColors', noop);
                result.watch('recordColors', spy);

                result.unwatch('recordColors', noop);

                changeBySelectField(base.tables[0], field, 'yellow');
                expect(spy.mock.calls.length).toBe(1);
            });
        });

        describe('recordIds', () => {
            it('unsubscribes', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('recordIds', spy);
                result.unwatch('recordIds', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);
            });
        });

        describe('cellValues', () => {
            it('unsubscribes from changes to all fields', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValues', spy);
                result.unwatch('cellValues', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskName');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskProject');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskTime');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskCompleted');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskAssignee');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('unsubscribes from changes to selected fields', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldTaskName', 'fldTaskNotes'],
                });
                const spy = jest.fn();

                result.watch('cellValues', spy);
                result.unwatch('cellValues', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskName');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskProject');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskTime');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskCompleted');

                expect(spy.mock.calls.length).toBe(0);

                change('fldTaskAssignee');

                expect(spy.mock.calls.length).toBe(0);
            });
        });

        describe('cellValuesInField:{FIELD_ID}', () => {
            it('unsubscribes from changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldTaskNotes', spy);
                result.unwatch('cellValuesInField:fldTaskNotes', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('does not unsubscribe other watchers', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldTaskNotes', spy1);
                result.watch('cellValuesInField:fldTaskNotes', spy2);
                result.unwatch('cellValuesInField:fldTaskNotes', spy1);
                change('fldTaskNotes');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('does not unsubscribe from changes to unspecified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldTaskProject', spy1);
                result.watch('cellValuesInField:fldTaskNotes', spy2);
                result.unwatch('cellValuesInField:fldTaskProject', spy1);
                change('fldTaskProject');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(0);

                change('fldTaskNotes');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('tolerates unrecognized subscriptions', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.unwatch('cellValuesInField:fldTaskNotes', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);
            });
        });
    });

    describe('#watch', () => {
        let count = 0;
        const change = (fieldId: string) => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblTasks',
                        'recordsById',
                        'recE',
                        'cellValuesByFieldId',
                        fieldId,
                    ],
                    value: 'value number ' + count++,
                },
            ]);
        };

        describe('recordIds', () => {
            describe('from table', () => {
                beforeEach(() => {
                    mockRecordData('tblTasks', false);
                });

                it('notified when record is deleted', async () => {
                    const result = await base.tables[1].selectRecordsAsync();
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: ['tablesById', 'tblTasks', 'recordsById', 'recE'],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0].length).toBe(3);
                    expect(spy.mock.calls[0][0]).toBe(result);
                    expect(spy.mock.calls[0][1]).toBe('recordIds');
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: [],
                        removedRecordIds: ['recE'],
                    });
                });

                it('notified when values in sorted fields change', async () => {
                    const result = await base.tables[1].selectRecordsAsync({
                        sorts: [{field: 'fldTaskNotes'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldTaskNotes');

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0].length).toBe(3);
                    expect(spy.mock.calls[0][0]).toBe(result);
                    expect(spy.mock.calls[0][1]).toBe('recordIds');
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: [],
                        removedRecordIds: [],
                    });
                });

                it('not notified when values besides sorted fields change', async () => {
                    const result = await base.tables[1].selectRecordsAsync({
                        sorts: [{field: 'fldTaskName'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldTaskNotes');

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('not notifified when sorting is not enabled and a field is deleted', async () => {
                    const result = await base.tables[0].selectRecordsAsync();
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'fieldsById',
                                'fldPrjctCtgry',
                            ],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('not notified when non-sorted field is added', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fldPrjctClient'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: ['tablesById', 'tblDesignProjects', 'fieldsById', 'fldSelect'],
                            value: {
                                id: 'fldSelect',
                                name: 'Select Field',
                                type: FieldType.SINGLE_SELECT,
                                typeOptions: {
                                    choiceOrder: ['selA', 'selB'],
                                    choices: {
                                        selA: {
                                            name: 'Option A',
                                            id: 'selA',
                                            color: 'cyanDark',
                                        },
                                        selB: {
                                            name: 'Option B',
                                            id: 'selB',
                                            color: 'redDark',
                                        },
                                    },
                                },
                                description: '',
                                lock: null,
                            },
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('notified when sorted field is created', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fldPrjctClient'}, {field: 'fldPrjctCtgry'}],
                    });
                    const spy = jest.fn();
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'fieldsById',
                                'fldPrjctCtgry',
                            ],
                            value: undefined,
                        },
                    ]);

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'fieldsById',
                                'fldPrjctCtgry',
                            ],
                            value: {
                                id: 'fldSelect',
                                name: 'Select Field',
                                type: FieldType.SINGLE_SELECT,
                                typeOptions: {
                                    choiceOrder: ['selA', 'selB'],
                                    choices: {
                                        selA: {
                                            name: 'Option A',
                                            id: 'selA',
                                            color: 'cyanDark',
                                        },
                                        selB: {
                                            name: 'Option B',
                                            id: 'selB',
                                            color: 'redDark',
                                        },
                                    },
                                },
                                description: '',
                                lock: null,
                            },
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: [],
                        removedRecordIds: [],
                    });
                });

                it('not notified when non-sorted field is deleted', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fldPrjctClient'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'fieldsById',
                                'fldPrjctCtgry',
                            ],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('notified when sorted field is deleted', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fldPrjctClient'}, {field: 'fldPrjctCtgry'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'fieldsById',
                                'fldPrjctCtgry',
                            ],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: [],
                        removedRecordIds: [],
                    });
                });
            });

            describe('from view', () => {
                beforeEach(() => {
                    mockRecordData('tblTasks', true);
                });

                it('notified when values in sorted fields change', async () => {
                    const result = await base.tables[1].views[0].selectRecordsAsync({
                        sorts: [{field: 'fldTaskNotes'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldTaskNotes');

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0].length).toBe(3);
                    expect(spy.mock.calls[0][0]).toBe(result);
                    expect(spy.mock.calls[0][1]).toBe('recordIds');
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: [],
                        removedRecordIds: [],
                    });
                });

                it('not notified when values besides sorted fields change', async () => {
                    const result = await base.tables[1].views[0].selectRecordsAsync({
                        sorts: [{field: 'fldTaskName'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldTaskNotes');

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('notified when visible records change', async () => {
                    const result = await base.tables[1].views[0].selectRecordsAsync();
                    const spy = jest.fn();

                    result.watch('recordIds', spy);

                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tblTasks',
                                'viewsById',
                                'viwTaskAll',
                                'visibleRecordIds',
                            ],
                            value: ['recD', 'recF'],
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][2]).toStrictEqual({
                        addedRecordIds: ['recD'],
                        removedRecordIds: ['recE'],
                    });
                });
            });
        });

        describe('recordColors', () => {
            beforeEach(() => {
                mockRecordData('tblDesignProjects', true);
            });

            it('notified exactly once for initial data load', async () => {
                const result = base.tables[1].selectRecords({
                    recordColorMode: recordColorModes.byView(base.tables[1].views[0]),
                });
                const spy = jest.fn();
                result.watch('recordColors', spy);

                await result.loadDataAsync();

                expect(spy.mock.calls.length).toBe(1);
                expect(spy).toHaveBeenCalledWith(result, 'recordColors');
            });

            it('notified when select field changes', async () => {
                const field = base.tables[0].getField('Category');
                const result = await base.tables[0].selectRecordsAsync({
                    recordColorMode: recordColorModes.bySelectField(field),
                });
                const spy1 = jest.fn();
                const spy2 = jest.fn();
                result.watch('recordColors', spy1);
                result.watch('recordColors', spy2);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblDesignProjects',
                            'recordsById',
                            'recC',
                            'cellValuesByFieldId',
                            field.id,
                        ],
                        value: 'green',
                    },
                ]);

                expect(spy1.mock.calls.length).toBe(1);
                expect(spy1).toHaveBeenCalledWith(result, 'recordColors', ['recC']);
                expect(spy2.mock.calls.length).toBe(1);
                expect(spy2).toHaveBeenCalledWith(result, 'recordColors', ['recC']);
            });
        });

        describe('cellValues', () => {
            beforeEach(() => {
                mockRecordData('tblTasks', false);
            });

            it('notified exactly once for initial data load', async () => {
                const result = base.tables[1].selectRecords();
                const spy = jest.fn();
                result.watch('cellValues', spy);

                await result.loadDataAsync();

                expect(spy.mock.calls.length).toBe(1);
                expect(spy).toHaveBeenCalledWith(result, 'cellValues');
            });

            it('notified for changes to all fields by default', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValues', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(1);

                change('fldTaskName');

                expect(spy.mock.calls.length).toBe(2);

                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(3);

                change('fldTaskProject');

                expect(spy.mock.calls.length).toBe(4);

                change('fldTaskTime');

                expect(spy.mock.calls.length).toBe(5);

                change('fldTaskCompleted');

                expect(spy.mock.calls.length).toBe(6);

                change('fldTaskAssignee');

                expect(spy.mock.calls.length).toBe(7);
            });

            it('only notified for changes to selected fields', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldTaskName', 'fldTaskNotes'],
                });
                const spy = jest.fn();

                result.watch('cellValues', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(1);

                change('fldTaskName');

                expect(spy.mock.calls.length).toBe(2);

                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(3);

                change('fldTaskProject');

                expect(spy.mock.calls.length).toBe(3);

                change('fldTaskTime');

                expect(spy.mock.calls.length).toBe(3);

                change('fldTaskCompleted');

                expect(spy.mock.calls.length).toBe(3);

                change('fldTaskAssignee');

                expect(spy.mock.calls.length).toBe(3);
            });
        });

        describe('cellValuesInField:{FIELD_ID}', () => {
            beforeEach(() => {
                mockRecordData('tblTasks', false);
            });

            it('all fields triggered by initial record loading', async () => {
                const result = base.tables[2].selectRecords();
                const spies: {[key: string]: jest.Mock} = {
                    fldClientName: jest.fn(),
                    fldClientAbout: jest.fn(),
                    fldClientLogo: jest.fn(),
                    fldClientProjects: jest.fn(),
                };
                result.watch('cellValuesInField:fldClientName', spies.fldClientName);
                result.watch('cellValuesInField:fldClientAbout', spies.fldClientAbout);
                result.watch('cellValuesInField:fldClientLogo', spies.fldClientLogo);
                result.watch('cellValuesInField:fldClientProjects', spies.fldClientProjects);

                await result.loadDataAsync();

                expect(spies.fldClientName).toHaveBeenCalledTimes(1);
                expect(spies.fldClientAbout).toHaveBeenCalledTimes(1);
                expect(spies.fldClientLogo).toHaveBeenCalledTimes(1);
                expect(spies.fldClientProjects).toHaveBeenCalledTimes(1);
            });

            it('notified for changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldTaskNotes', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(1);
            });

            it('multiple watchers notified exactly once for changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldTaskNotes', spy1);
                result.watch('cellValuesInField:fldTaskNotes', spy2);
                change('fldTaskNotes');

                expect(spy1.mock.calls.length).toBe(1);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('not notified for changes to unspecified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldTaskProject', spy);
                change('fldTaskNotes');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('reports an error when field has not been loaded', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldTaskNotes'],
                });
                const spy = jest.fn();

                expect(() => {
                    result.watch('cellValuesInField:fldTaskProject', spy);
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Can't watch field because it wasn't included in RecordQueryResult fields: fldTaskProject"`,
                );

                expect(spy.mock.calls.length).toBe(0);
            });
        });
    });
});
