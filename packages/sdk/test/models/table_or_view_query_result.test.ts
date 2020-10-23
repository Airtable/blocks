import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import {disableObjectPool, enableObjectPool, waitForWatchKeyAsync} from '../test_helpers';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';
import {modes as recordColorModes} from '../../src/models/record_coloring';
import {FieldType} from '../../src/types/field';
import {RecordData} from '../../src/types/record';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

const recordEntry = (id: string, valuesByFieldId: {[key: string]: string | number}) => ({
    [id]: {
        id,
        cellValuesByFieldId: valuesByFieldId,
        commentCount: 0,
        createdTime: '2020-10-21T01:30:11.506Z',
    },
});

const mockRecordData = (
    tableId: 'tbly388E8NA1CNhnF' | 'tblcstEo50YXLJcK4',
    includeView: boolean,
) => {
    let recordsById: {[key: string]: RecordData};

    if (tableId === 'tbly388E8NA1CNhnF') {
        recordsById = {
            ...recordEntry('recA', {fldXaTPfxIVhAUYde: 'b'}),
            ...recordEntry('recB', {fldXaTPfxIVhAUYde: 'a'}),
            ...recordEntry('recC', {fldXaTPfxIVhAUYde: 'c'}),
        };
    } else {
        recordsById = {
            ...recordEntry('recD', {
                fldfu76MKFFh6x6IM: 'b',
                fldij9kocxowfur16: 'c',
                fldSCh5AV7Z3056Vw: 1,
            }),
            ...recordEntry('recE', {
                fldfu76MKFFh6x6IM: 'a',
                fldij9kocxowfur16: 'b',
                fldSCh5AV7Z3056Vw: 3,
            }),
            ...recordEntry('recF', {
                fldfu76MKFFh6x6IM: 'c',
                fldij9kocxowfur16: 'a',
                fldSCh5AV7Z3056Vw: 2,
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
        disableObjectPool();
        base = getSdk().base;
    });

    afterEach(() => {
        mockAirtableInterface.reset();
        clearSdkForTest();
    });

    describe('caching', () => {
        beforeEach(() => {
            enableObjectPool();
        });

        it('caches like requests', () => {
            const first = base.tables[0].selectRecords();
            const second = base.tables[0].selectRecords();
            expect(first).toBe(second);
        });

        it('does not cache dissimilar requests', () => {
            const first = base.tables[0].selectRecords();
            const second = base.tables[0].selectRecords({
                fields: ['fldXaTPfxIVhAUYde'],
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
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.recordIds).toStrictEqual(['recA', 'recB', 'recC']);
        });

        it('rejects requests when source table has been deleted', async () => {
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result = await base.tables[0].selectRecordsAsync();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tableOrder'],
                    value: ['tblcstEo50YXLJcK4', 'tblyt8B45wJQIx1c3'],
                },
                {
                    path: ['tablesById', 'tbly388E8NA1CNhnF'],
                    value: undefined,
                },
            ]);

            expect(() => result.recordIds).toThrowErrorMatchingInlineSnapshot(
                `"RecordQueryResult's underlying table has been deleted"`,
            );
        });

        it('rejects requests when source view has been deleted', async () => {
            mockRecordData('tbly388E8NA1CNhnF', true);
            const result = await base.tables[0].views[0].selectRecordsAsync();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['viewOrder'],
                    value: [
                        'viwqo8mFAqy2HYSCL',
                        'viw8v5XkLudbiCJfD',
                        'viwhz3PjFATSxaV5X',
                        'viwA4Tzw8IJcHHgul',
                    ],
                },
                {
                    path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewsById', 'viwkNnS94RQAQQTMn'],
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
                fields: ['fldXaTPfxIVhAUYde', 'fld3DvZllJtyaNYpm'],
            });
            expect(result.fields).toStrictEqual([
                base.tables[0].fields[0],
                base.tables[0].fields[1],
            ]);
        });

        it('omits deleted fields', () => {
            const result = base.tables[0].selectRecords({
                fields: ['fldXaTPfxIVhAUYde', 'fldRljtoVpOt1IDYH'],
            });
            const expected = [base.tables[0].fields[0]];
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tbly388E8NA1CNhnF', 'fieldsById', 'fldRljtoVpOt1IDYH'],
                    value: null,
                },
            ]);
            expect(result.fields).toStrictEqual(expected);
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
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.hasRecord('recA')).toBe(true);
            expect(result.hasRecord('recB')).toBe(true);
            expect(result.hasRecord('recC')).toBe(true);
        });

        it('negative with record ID', async () => {
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result = await base.tables[0].selectRecordsAsync();
            expect(result.hasRecord('recD')).toBe(false);
        });

        it('positive with record instance', async () => {
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result1 = await base.tables[0].selectRecordsAsync();
            const result2 = await base.tables[0].selectRecordsAsync();
            expect(result1.hasRecord(result2.records[0])).toBe(true);
            expect(result1.hasRecord(result2.records[1])).toBe(true);
            expect(result1.hasRecord(result2.records[2])).toBe(true);
        });

        it('negative with record instance', async () => {
            mockRecordData('tbly388E8NA1CNhnF', false);
            const result1 = await base.tables[0].selectRecordsAsync();
            mockRecordData('tblcstEo50YXLJcK4', false);
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
                    value: ['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                },
                {
                    path: ['tablesById', 'tblcstEo50YXLJcK4'],
                    value: undefined,
                },
            ]);

            expect(result.isDeleted).toBe(true);
        });
    });

    describe('#loadDataAsync', () => {
        describe('from table', () => {
            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', false);
            });

            it('loads all fields from table by default', async () => {
                const result = base.tables[1].selectRecords();

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldfu76MKFFh6x6IM')).toBe('b');
                expect(result.records[0].getCellValue('fldij9kocxowfur16')).toBe('c');
                expect(result.records[0].getCellValue('fldSCh5AV7Z3056Vw')).toBe(1);
            });

            it('loads fields explicitly specified by `fields` option', async () => {
                const result = base.tables[1].selectRecords({fields: ['fldij9kocxowfur16']});

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldij9kocxowfur16')).toBe('c');
            });

            it('loads fields explicitly specified by `sorts` option', async () => {
                const result = base.tables[1].selectRecords({
                    fields: ['fldij9kocxowfur16'],
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldSCh5AV7Z3056Vw')).toBe(1);
            });

            it('tolerates deleted fields specified by `sorts` option', async () => {
                const result = base.tables[1].selectRecords({
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
                });

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblcstEo50YXLJcK4',
                            'fieldsById',
                            'fldSCh5AV7Z3056Vw',
                        ],
                        value: undefined,
                    },
                ]);
                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldfu76MKFFh6x6IM')).toBe('b');
            });

            it('loads fields explicitly specified by `recordColorMode` option', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'fieldsById', 'fldSelect'],
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
                    fields: ['fldij9kocxowfur16'],
                    recordColorMode: recordColorModes.bySelectField(selectField),
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(result.records[0].getCellValue('fldSelect')).toBe(null);
            });

            it('does not load fields that are not specified by `fields` nor `sorts`', async () => {
                const result = base.tables[1].selectRecords({
                    fields: ['fldij9kocxowfur16'],
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(3);
                expect(() =>
                    result.records[0].getCellValue('fldX2QXZGxsqj7YC0'),
                ).toThrowErrorMatchingInlineSnapshot(
                    `"Cell values for field fldX2QXZGxsqj7YC0 are not loaded"`,
                );
            });

            it('requests update to record order when type of sorted field changes', async () => {
                const result = base.tables[1].selectRecords({
                    sorts: [{field: 'fldij9kocxowfur16'}],
                });

                await result.loadDataAsync();

                mockVisListRecordOrderOnce(['recF', 'recD', 'recE']);
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblcstEo50YXLJcK4',
                            'fieldsById',
                            'fldij9kocxowfur16',
                            'type',
                        ],
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
                            'tblcstEo50YXLJcK4',
                            'viewsById',
                            'viwWxkRmrDMhu7I8p',
                            'visibleRecordIds',
                        ],
                        value: recordIds,
                    },
                ]);
            };

            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', true);
            });

            it('loads all fields from view by default', async () => {
                const result = base.tables[1].views[0].selectRecords();

                await result.loadDataAsync();

                expect(result.records.length).toBe(2);
                expect(result.records[0].getCellValue('fldfu76MKFFh6x6IM')).toBe('a');
                expect(result.records[0].getCellValue('fldij9kocxowfur16')).toBe('b');
                expect(result.records[0].getCellValue('fldSCh5AV7Z3056Vw')).toBe(3);
            });

            it('loads fields explicitly specified by `sorts` option', async () => {
                const result = base.tables[1].views[0].selectRecords({
                    fields: ['fldij9kocxowfur16'],
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
                });

                await result.loadDataAsync();

                expect(result.records.length).toBe(2);
                expect(result.records[0].getCellValue('fldSCh5AV7Z3056Vw')).toBe(3);
            });

            it('alerts AirtableInterface of newly-visible records when sorting is enabled', async () => {
                await base.tables[1].views[0].selectRecordsAsync({
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
                });

                changeVisibleRecords(['recD', 'recE', 'recF']);

                const visList =
                    mockAirtableInterface.createVisList.mock.results[
                        mockAirtableInterface.createVisList.mock.results.length - 1
                    ].value;
                expect(visList.removeRecordIds.mock.calls.length).toBe(0);
                expect(visList.addRecordData).toHaveBeenCalledWith({
                    cellValuesByFieldId: {
                        fldSCh5AV7Z3056Vw: 1,
                        fldfu76MKFFh6x6IM: 'b',
                        fldij9kocxowfur16: 'c',
                    },
                    commentCount: 0,
                    createdTime: '2020-10-21T01:30:11.506Z',
                    id: 'recD',
                });
            });

            it('alerts AirtableInterface of newly-hidden records when sorting is enabled', async () => {
                await base.tables[1].views[0].selectRecordsAsync({
                    sorts: [{field: 'fldSCh5AV7Z3056Vw'}],
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
        });
    });

    describe('#unloadData', () => {
        describe('from table', () => {
            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', false);
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
                        value: ['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4'],
                        value: undefined,
                    },
                ]);
                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult data is not loaded"`,
                );
            });

            it('stops watching for changes to type of sorted field', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    sorts: [{field: 'fldij9kocxowfur16'}],
                });

                result.unloadData();
                await waitForWatchKeyAsync(result, 'isDataLoaded');

                // Reloading the model allows the record order to be observed.
                // This test verifies that the preceeding `unload` operation
                // unsubscribed to "type" changes because the relevant
                // AirtableInterface method is mocked for exactly one call. If
                // unloading did not occur as expected, then the model would
                // ultimately report a different record ordering due to the
                // second (unmocked) call.
                await result.loadDataAsync();

                mockVisListRecordOrderOnce(['recF', 'recD', 'recE']);
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblcstEo50YXLJcK4',
                            'fieldsById',
                            'fldij9kocxowfur16',
                            'type',
                        ],
                        value: FieldType.SINGLE_LINE_TEXT,
                    },
                ]);

                expect(result.recordIds).toStrictEqual(['recF', 'recD', 'recE']);
            });

            it('tolerates sorted fields that have been deleted', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    sorts: [{field: 'fldij9kocxowfur16'}],
                });

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblcstEo50YXLJcK4',
                            'fieldsById',
                            'fldij9kocxowfur16',
                        ],
                        value: undefined,
                    },
                ]);

                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');
            });
        });

        describe('from view', () => {
            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', true);
            });

            it('unloads record data', async () => {
                const result = await base.tables[1].views[0].selectRecordsAsync();

                result.unloadData();

                await waitForWatchKeyAsync(result, 'isDataLoaded');

                expect(() => result.records).toThrowErrorMatchingInlineSnapshot(
                    `"RecordQueryResult data is not loaded"`,
                );
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
                        'tblcstEo50YXLJcK4',
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
            mockRecordData('tbly388E8NA1CNhnF', false);
        });

        describe('recordIds', () => {
            it('unsubscribes', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('recordIds', spy);
                result.unwatch('recordIds', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);
            });
        });

        describe('cellValues', () => {
            it('unsubscribes from changes to all fields', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValues', spy);
                result.unwatch('cellValues', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);

                change('fldfu76MKFFh6x6IM');

                expect(spy.mock.calls.length).toBe(0);

                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);

                change('fldxsrKD1DItS6Auv');

                expect(spy.mock.calls.length).toBe(0);

                change('fldSCh5AV7Z3056Vw');

                expect(spy.mock.calls.length).toBe(0);

                change('fldX2QXZGxsqj7YC0');

                expect(spy.mock.calls.length).toBe(0);

                change('fldfxDIwSfAEb1wLI');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('unsubscribes from changes to selected fields', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldfu76MKFFh6x6IM', 'fldij9kocxowfur16'],
                });
                const spy = jest.fn();

                result.watch('cellValues', spy);
                result.unwatch('cellValues', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);

                change('fldfu76MKFFh6x6IM');

                expect(spy.mock.calls.length).toBe(0);

                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);

                change('fldxsrKD1DItS6Auv');

                expect(spy.mock.calls.length).toBe(0);

                change('fldSCh5AV7Z3056Vw');

                expect(spy.mock.calls.length).toBe(0);

                change('fldX2QXZGxsqj7YC0');

                expect(spy.mock.calls.length).toBe(0);

                change('fldfxDIwSfAEb1wLI');

                expect(spy.mock.calls.length).toBe(0);
            });
        });

        describe('cellValuesInField:{FIELD_ID}', () => {
            it('unsubscribes from changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldij9kocxowfur16', spy);
                result.unwatch('cellValuesInField:fldij9kocxowfur16', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('does not unsubscribe other watchers', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldij9kocxowfur16', spy1);
                result.watch('cellValuesInField:fldij9kocxowfur16', spy2);
                result.unwatch('cellValuesInField:fldij9kocxowfur16', spy1);
                change('fldij9kocxowfur16');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('does not unsubscribe from changes to unspecified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldxsrKD1DItS6Auv', spy1);
                result.watch('cellValuesInField:fldij9kocxowfur16', spy2);
                result.unwatch('cellValuesInField:fldxsrKD1DItS6Auv', spy1);
                change('fldxsrKD1DItS6Auv');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(0);

                change('fldij9kocxowfur16');

                expect(spy1.mock.calls.length).toBe(0);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('tolerates unrecognized subscriptions', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.unwatch('cellValuesInField:fldij9kocxowfur16', spy);
                change('fldij9kocxowfur16');

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
                        'tblcstEo50YXLJcK4',
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
                    mockRecordData('tblcstEo50YXLJcK4', false);
                });

                it('notified when values in sorted fields change', async () => {
                    const result = await base.tables[1].selectRecordsAsync({
                        sorts: [{field: 'fldij9kocxowfur16'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldij9kocxowfur16');

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
                        sorts: [{field: 'fldfu76MKFFh6x6IM'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldij9kocxowfur16');

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
                                'tbly388E8NA1CNhnF',
                                'fieldsById',
                                'fldRljtoVpOt1IDYH',
                            ],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(0);
                });

                it('not notified when non-sorted field is added', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fld3DvZllJtyaNYpm'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: ['tablesById', 'tbly388E8NA1CNhnF', 'fieldsById', 'fldSelect'],
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

                // This test cannot pass due to a bug in the implementation
                // TODO(jugglinmike): Correct the bug and enable this test
                it.skip('notified when sorted field is created', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fld3DvZllJtyaNYpm'}, {field: 'fldRljtoVpOt1IDYH'}],
                    });
                    const spy = jest.fn();
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tbly388E8NA1CNhnF',
                                'fieldsById',
                                'fldRljtoVpOt1IDYH',
                            ],
                            value: undefined,
                        },
                    ]);

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tbly388E8NA1CNhnF',
                                'fieldsById',
                                'fldRljtoVpOt1IDYH',
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
                        sorts: [{field: 'fld3DvZllJtyaNYpm'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tbly388E8NA1CNhnF',
                                'fieldsById',
                                'fldRljtoVpOt1IDYH',
                            ],
                            value: undefined,
                        },
                    ]);

                    expect(spy.mock.calls.length).toBe(0);
                });

                // This test cannot pass due to a bug in the implementation
                // TODO(jugglinmike): Correct the bug and enable this test
                it.skip('notified when sorted field is deleted', async () => {
                    const result = await base.tables[0].selectRecordsAsync({
                        sorts: [{field: 'fld3DvZllJtyaNYpm'}, {field: 'fldRljtoVpOt1IDYH'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    mockAirtableInterface.triggerModelUpdates([
                        {
                            path: [
                                'tablesById',
                                'tbly388E8NA1CNhnF',
                                'fieldsById',
                                'fldRljtoVpOt1IDYH',
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
                    mockRecordData('tblcstEo50YXLJcK4', true);
                });

                it('notified when values in sorted fields change', async () => {
                    const result = await base.tables[1].views[0].selectRecordsAsync({
                        sorts: [{field: 'fldij9kocxowfur16'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldij9kocxowfur16');

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
                        sorts: [{field: 'fldfu76MKFFh6x6IM'}],
                    });
                    const spy = jest.fn();

                    result.watch('recordIds', spy);
                    change('fldij9kocxowfur16');

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
                                'tblcstEo50YXLJcK4',
                                'viewsById',
                                'viwWxkRmrDMhu7I8p',
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

        describe('cellValues', () => {
            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', false);
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
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(1);

                change('fldfu76MKFFh6x6IM');

                expect(spy.mock.calls.length).toBe(2);

                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(3);

                change('fldxsrKD1DItS6Auv');

                expect(spy.mock.calls.length).toBe(4);

                change('fldSCh5AV7Z3056Vw');

                expect(spy.mock.calls.length).toBe(5);

                change('fldX2QXZGxsqj7YC0');

                expect(spy.mock.calls.length).toBe(6);

                change('fldfxDIwSfAEb1wLI');

                expect(spy.mock.calls.length).toBe(7);
            });

            it('only notified for changes to selected fields', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldfu76MKFFh6x6IM', 'fldij9kocxowfur16'],
                });
                const spy = jest.fn();

                result.watch('cellValues', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(1);

                change('fldfu76MKFFh6x6IM');

                expect(spy.mock.calls.length).toBe(2);

                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(3);

                change('fldxsrKD1DItS6Auv');

                expect(spy.mock.calls.length).toBe(3);

                change('fldSCh5AV7Z3056Vw');

                expect(spy.mock.calls.length).toBe(3);

                change('fldX2QXZGxsqj7YC0');

                expect(spy.mock.calls.length).toBe(3);

                change('fldfxDIwSfAEb1wLI');

                expect(spy.mock.calls.length).toBe(3);
            });
        });

        describe('cellValuesInField:{FIELD_ID}', () => {
            beforeEach(() => {
                mockRecordData('tblcstEo50YXLJcK4', false);
            });

            it('notified for changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldij9kocxowfur16', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(1);
            });

            it('multiple watchers notified exactly once for changes to specified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy1 = jest.fn();
                const spy2 = jest.fn();

                result.watch('cellValuesInField:fldij9kocxowfur16', spy1);
                result.watch('cellValuesInField:fldij9kocxowfur16', spy2);
                change('fldij9kocxowfur16');

                expect(spy1.mock.calls.length).toBe(1);
                expect(spy2.mock.calls.length).toBe(1);
            });

            it('not notified for changes to unspecified field', async () => {
                const result = await base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                result.watch('cellValuesInField:fldxsrKD1DItS6Auv', spy);
                change('fldij9kocxowfur16');

                expect(spy.mock.calls.length).toBe(0);
            });

            it('reports an error when field has not been loaded', async () => {
                const result = await base.tables[1].selectRecordsAsync({
                    fields: ['fldij9kocxowfur16'],
                });
                const spy = jest.fn();

                expect(() => {
                    result.watch('cellValuesInField:fldxsrKD1DItS6Auv', spy);
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Can't watch field because it wasn't included in RecordQueryResult fields: fldxsrKD1DItS6Auv"`,
                );

                expect(spy.mock.calls.length).toBe(0);
            });
        });
    });
});
