import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import {__reset, __sdk as sdk} from '../../src';
import Record from '../../src/models/record';
import RecordQueryResult from '../../src/models/record_query_result';
import LinkedRecordsQueryResult from '../../src/models/linked_records_query_result';
import {simulateTimersAndClearAfterEachTest, waitForWatchKeyAsync} from '../test_helpers';

let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        if (!mockAirtableInterface) {
            mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
        }
        return mockAirtableInterface;
    },
}));

describe('LinkedRecordQueryResult', () => {
    let query: RecordQueryResult;
    let record: Record;

    simulateTimersAndClearAfterEachTest();

    beforeEach(async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockImplementation(tableId => {
            const first = tableId === 'tblFirst';
            const recId = first ? 'recA' : 'recB';
            const fieldId = first ? 'fld1stLinked' : 'fld2ndLinked';
            const cellValues = [{id: first ? 'recB' : 'recA'}];
            return Promise.resolve({
                recordsById: {
                    [recId]: {
                        id: recId,
                        cellValuesByFieldId: {
                            fld1stPrimary: 'primary',
                            [fieldId]: cellValues,
                        },
                        commentCount: 0,
                        createdTime: new Date().toString(),
                    },
                },
            });
        });
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById: {},
        });
        mockAirtableInterface.fetchAndSubscribeToCursorDataAsync.mockResolvedValue({
            selectedRecordIdSet: {},
            selectedFieldIdSet: {},
        });
        query = await sdk.base.tables[0].selectRecordsAsync();
        record = query.getRecordById('recA');

        return new Promise(resolve => {
            sdk.cursor.watch('isDataLoaded', function init() {
                sdk.cursor.unwatch('isDataLoaded', init);
                resolve();
            });
        });
    });

    afterEach(() => {
        query.unloadData();
        mockAirtableInterface.reset();
        __reset();
    });

    describe('caching', () => {
        it('caches like requests', () => {
            const first = record.selectLinkedRecordsFromCell('fld1stLinked');
            const second = record.selectLinkedRecordsFromCell('fld1stLinked');
            expect(first).toBe(second);
        });

        it('does not cache dissimilar requests', () => {
            const first = record.selectLinkedRecordsFromCell('fld1stLinked');
            const second = record.selectLinkedRecordsFromCell('fld1stLinked', {
                fields: ['fld2ndLinked'],
            });
            expect(first).not.toBe(second);
        });
    });

    describe('#isDeleted', () => {
        it('is initially false', () => {
            const linked = record.selectLinkedRecordsFromCell('fld1stLinked');
            expect(linked.isDeleted).toBe(false);
        });

        it('is false after loading', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            expect(linked.isDeleted).toBe(false);
        });

        it('is true after record is deleted', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', record.id],
                    value: undefined,
                },
            ]);

            expect(linked.isDeleted).toBe(true);
        });

        it('is true after table is deleted', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', sdk.base.tables[0].id],
                    value: undefined,
                },
            ]);

            expect(linked.isDeleted).toBe(true);
        });
    });

    describe('#isValid', () => {
        it('initially true', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            expect(linked.isValid).toBe(true);
        });

        it('true following change to non-critical type option', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fld1stLinked',
                        'typeOptions',
                        'unreversed',
                    ],
                    value: false,
                },
            ]);

            expect(linked.isValid).toBe(true);
        });

        it('false following change in field type (loaded)', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked', 'type'],
                    value: 'text',
                },
            ]);

            expect(linked.isValid).toBe(false);
        });

        it('false following change in field type (unloaded)', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);
                linked.unloadData();
            });

            const loadPromise = linked.loadDataAsync();

            try {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'fieldsById',
                            'fld1stLinked',
                            'typeOptions',
                            'linkedTableId',
                        ],
                        value: 'tblFirst44',
                    },
                ]);

                expect(linked.isValid).toBe(false);
            } finally {
                await loadPromise.catch(() => {});
            }
        });

        it('false following deletion of "origin" record', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', record.id],
                    value: undefined,
                },
            ]);

            expect(linked.isValid).toBe(false);
        });

        it('true following deletion of unrelated record in origin table', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recD'],
                    value: {},
                },
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recD'],
                    value: undefined,
                },
            ]);

            expect(linked.isValid).toBe(true);
        });

        it('false following deletion of linked field in "origin" table', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked'],
                    value: undefined,
                },
            ]);

            expect(linked.isValid).toBe(false);
        });

        it('true following deletion of unrelated field in "origin" table', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stDoomed'],
                    value: {},
                },
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stDoomed'],
                    value: undefined,
                },
            ]);

            expect(linked.isValid).toBe(true);
        });
    });

    it('#parentTable', async () => {
        const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
        expect(linked.parentTable.id).toBe('tblSecond');
    });

    describe('#recordIds', () => {
        it('returns an array of the relevant record IDs', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.recordIds).toStrictEqual(['recB']);
        });

        it('returns an empty array when no records are linked', async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recA',
                        'cellValuesByFieldId',
                        'fld1stLinked',
                    ],
                    value: null,
                },
            ]);
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.recordIds).toStrictEqual([]);
        });

        it('returns an empty array when non-existent records are linked', async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recA',
                        'cellValuesByFieldId',
                        'fld1stLinked',
                    ],
                    value: [{id: 'recBogus'}],
                },
            ]);
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.recordIds).toStrictEqual([]);
        });

        it('honors sorts', async () => {
            await sdk.base.tables[1].selectRecordsAsync();
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblSecond', 'recordsById', 'recC'],
                    value: {
                        id: 'recC',
                        cellValuesByFieldId: {
                            fld1stPrimary: 'primary also',
                            fld2ndLinked: [{id: 'recA'}],
                        },
                    },
                },
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recA',
                        'cellValuesByFieldId',
                        'fld1stLinked',
                    ],
                    value: [{id: 'recB'}, {id: 'recC'}],
                },
            ]);

            let linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.recordIds).toStrictEqual(['recB', 'recC']);

            linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked', {
                sorts: [{field: 'fld2ndPrimary'}],
            });

            expect(mockAirtableInterface.createVisList).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.createVisList.mock.calls[0][3]).toStrictEqual([
                {direction: 'asc', fieldId: 'fld2ndPrimary'},
            ]);
            expect(linked.recordIds).toStrictEqual(['recB', 'recC']);
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fld1stLinked',
                        'typeOptions',
                        'linkedTableId',
                    ],
                    value: 'tblFirst44',
                },
            ]);

            expect(() => linked.recordIds).toThrow(Error);
        });

        it('reports an error when the result has not yet been loaded', async () => {
            const linked = record.selectLinkedRecordsFromCell('fld1stLinked');

            expect(() => linked.recordIds).toThrow(Error);
        });

        it('reports an error when the result has been unloaded', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });

            expect(() => linked.recordIds).toThrow(Error);
        });
    });

    describe('#records', () => {
        it('returns an array of the relevant records', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.records.length).toBe(1);
            expect(linked.records[0].id).toBe('recB');
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fld1stLinked',
                        'typeOptions',
                        'linkedTableId',
                    ],
                    value: 'tblFirst44',
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the result has not yet been loaded', async () => {
            const linked = record.selectLinkedRecordsFromCell('fld1stLinked');

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the result has been unloaded', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the origin record has been deleted', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recA'],
                    value: undefined,
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the field has been deleted in the origin table', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked'],
                    value: undefined,
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });
    });

    describe('#fields', () => {
        it('returns null when no fields were initially specified', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            expect(linked.fields).toBe(null);
        });

        it('returns an array of the fields initially specified', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked', {
                fields: ['fld2ndLinked'],
            });

            if (linked.fields === null) {
                throw new Error('Expected an array, received null.');
            }

            expect(linked.fields.length).toBe(1);
            expect(linked.fields[0].id).toBe('fld2ndLinked');
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fld1stLinked',
                        'typeOptions',
                        'linkedTableId',
                    ],
                    value: 'tblFirst44',
                },
            ]);

            expect(() => linked.fields).toThrow(Error);
        });
    });

    describe('#getRecordById', () => {
        it('throws an error for unloaded records', () => {
            const result = record.selectLinkedRecordsFromCell('fld1stLinked');
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('throws an error for non-existent records', async () => {
            const result = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No record with ID not a record id in this query result"`,
            );
        });
    });

    describe('#getRecordByIdIfExists', () => {
        it('throws an error for unloaded records', () => {
            const result = record.selectLinkedRecordsFromCell('fld1stLinked');
            expect(() =>
                result.getRecordByIdIfExists('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('returns `null` for non-existent records', async () => {
            const result = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            expect(result.getRecordByIdIfExists('not a record id')).toBe(null);
        });
    });

    describe('#loadDataAsync', () => {
        it('works for loaded instances', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');

            await linked.loadDataAsync();

            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData(); 
                linked.unloadData(); 
            });
        });

        it('works for unloaded instances', async () => {
            const linked = record.selectLinkedRecordsFromCell('fld1stLinked');

            await linked.loadDataAsync();

            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });
        });
    });

    describe('#unloadData', () => {
        it('functions when field has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked', 'type'],
                    value: 'text',
                },
            ]);

            linked.unloadData();
        });

        it('tolerates unnecessary invocations', async () => {
            const linked = record.selectLinkedRecordsFromCell('fld1stLinked');
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            try {
                expect(() => linked.unloadData()).not.toThrow();
            } finally {
                warnSpy.mockRestore();
            }

            await linked.loadDataAsync();
        });
    });

    describe('#unwatch', () => {
        let linked: LinkedRecordsQueryResult;

        beforeEach(async () => {
            mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
                visibleRecordIds: [],
                fieldOrder: {
                    fieldIds: [],
                    visibleFieldCount: 0,
                },
                colorsByRecordId: {},
            });
            const view = sdk.base.tables[1].views[0];
            linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked', {
                recordColorMode: {type: 'byView', view},
            });
        });

        describe('key: recordIds', () => {
            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('recordIds', noop);
                linked.unloadData();
                linked.unwatch('recordIds', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);
            });

            it('triggers unloading (specified via array)', async () => {
                const noop = () => {};
                linked.watch('recordIds', noop);
                linked.unloadData();
                linked.unwatch(['recordIds'], noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);
            });
        });

        describe('key: records', () => {
            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('records', noop);
                linked.unloadData();
                linked.unwatch('records', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);
            });
        });

        describe('key: cellValuesInField:{FIELD_ID}', () => {
            const change = (value: string) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld2ndSecondary',
                        ],
                        value,
                    },
                ]);
            };

            it('reports error when over-freed', () => {
                const noop = () => {};
                linked.watch('cellValuesInField:fld2ndSecondary', noop);
                linked.unwatch('cellValuesInField:fld2ndSecondary', noop);

                expect(() => {
                    linked.unwatch('cellValuesInField:fld2ndSecondary', noop);
                }).toThrowErrorMatchingInlineSnapshot(
                    `"cellValuesInField:fld2ndSecondary over-free'd"`,
                );
            });

            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('cellValuesInField:fld2ndSecondary', noop);
                linked.unloadData();
                linked.unwatch('cellValuesInField:fld2ndSecondary', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);

                expect(mockAirtableInterface.unsubscribeFromCursorData.mock.calls.length).toBe(1);
                expect(mockAirtableInterface.unsubscribeFromTableData.mock.calls.length).toBe(0);
                expect(mockAirtableInterface.unsubscribeFromCellValuesInFields.mock.calls).toEqual([
                    ['tblSecond', ['fld2ndSecondary']],
                ]);
                expect(mockAirtableInterface.unsubscribeFromViewData.mock.calls.length).toBe(0);
            });

            it('does not alter other subscriptions', () => {
                const spy1 = jest.fn();
                const spy2 = jest.fn();
                const spy3 = jest.fn();
                linked.watch('cellValuesInField:fld2ndSecondary', spy1);
                linked.watch('cellValuesInField:fld2ndSecondary', spy2);
                linked.watch('cellValuesInField:fld2ndSecondary', spy3);
                change('something else');

                expect(spy1).toHaveBeenCalledTimes(1);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValuesInField:fld2ndSecondary', spy2);

                change('something even differenter');

                expect(spy1).toHaveBeenCalledTimes(2);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(2);
            });

            it('properly cleans up final subscription', () => {
                const spy = jest.fn();

                linked.watch('cellValuesInField:fld2ndSecondary', spy);
                linked.unwatch('cellValuesInField:fld2ndSecondary', spy);
                linked.watch('cellValuesInField:fld2ndSecondary', spy);

                change('something else');

                expect(spy).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValuesInField:fld2ndSecondary', spy);

                change('something even more different');

                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

        describe('key: cellValues', () => {
            const change = (value: string) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value,
                    },
                ]);
            };

            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('cellValues', noop);
                linked.unloadData();
                linked.unwatch('cellValues', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);
            });

            it('does not alter other subscriptions', () => {
                const spy1 = jest.fn();
                const spy2 = jest.fn();
                const spy3 = jest.fn();
                linked.watch('cellValues', spy1);
                linked.watch('cellValues', spy2);
                linked.watch('cellValues', spy3);

                change('a');

                expect(spy1).toHaveBeenCalledTimes(1);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValues', spy2);
                change('b');

                expect(spy1).toHaveBeenCalledTimes(2);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(2);
            });

            it('properly cleans up final subscription', () => {
                const spy = jest.fn();
                linked.watch('cellValues', spy);

                change('a');

                expect(spy).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValues', spy);

                change('b');

                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

        describe('key: recordColors', () => {
            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('recordColors', noop);
                linked.unloadData();
                linked.unwatch('recordColors', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);
            });
        });
    });

    describe('#watch', () => {
        let linked: LinkedRecordsQueryResult;
        let mocks: {[key: string]: jest.Mock};

        beforeEach(async () => {
            mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
                visibleRecordIds: [],
                fieldOrder: {
                    fieldIds: [],
                    visibleFieldCount: 0,
                },
                colorsByRecordId: {},
            });
            const view = sdk.base.tables[1].views[0];
            linked = await record.selectLinkedRecordsFromCellAsync('fld1stLinked', {
                recordColorMode: {type: 'byView', view},
            });
            mocks = {
                records: jest.fn(),
                recordIds: jest.fn(),
                cellValues: jest.fn(),
                recordColors: jest.fn(),
                isDataLoaded: jest.fn(),
                cellValuesInField: jest.fn(),
            };

            linked.watch('records', mocks.records);
            linked.watch('recordIds', mocks.recordIds);
            linked.watch('cellValues', mocks.cellValues);
            linked.watch('recordColors', mocks.recordColors);
            linked.watch('isDataLoaded', mocks.isDataLoaded);
            linked.watch('cellValuesInField:fld2ndSecondary', mocks.cellValuesInField);
        });

        describe('key: recordIds', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');

                await waitForWatchKeyAsync(linked2, 'recordIds');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('is triggered by initial loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const spy = jest.fn();
                linked2.watch('recordIds', spy);
                await Promise.all([
                    linked.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(linked2, 'recordIds');
            });
        });

        describe('key: records', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');

                await waitForWatchKeyAsync(linked2, 'records');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('is triggered by initial loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const spy = jest.fn();
                linked2.watch('records', spy);
                await Promise.all([
                    linked.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(linked2, 'records');
            });
        });

        describe('keys: records & recordIds', () => {
            it('creation', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblSecond', 'recordsById', 'recC'],
                        value: {},
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(1);
                expect(mocks.recordIds).toHaveBeenCalledTimes(1);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('deletion', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblSecond', 'recordsById', 'recB'],
                        value: null,
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(1);
                expect(mocks.recordIds).toHaveBeenCalledTimes(1);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('origin cell value', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stLinked',
                        ],
                        value: 'tblFirst44',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(1);
                expect(mocks.recordIds).toHaveBeenCalledTimes(1);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('origin cell value - not fired prior to load', () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const recordsSpy = jest.fn();
                const recordIdsSpy = jest.fn();
                linked2.watch('records', recordsSpy);
                linked2.watch('records', recordIdsSpy);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stLinked',
                        ],
                        value: 'a value',
                    },
                ]);

                expect(recordsSpy).toHaveBeenCalledTimes(0);
                expect(recordIdsSpy).toHaveBeenCalledTimes(0);
            });
        });

        describe('key: cellValues', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');

                await waitForWatchKeyAsync(linked2, 'cellValues');

                expect(linked2.isDataLoaded).toBe(false);

                await waitForWatchKeyAsync(linked2, 'isDataLoaded');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('triggered by initial record loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const spy = jest.fn();
                linked2.watch('cellValues', spy);
                await linked2.loadDataAsync();
                expect(spy).toHaveBeenCalledTimes(1);
            });

            it('following update', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: 'sdf',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(0);
                expect(mocks.recordIds).toHaveBeenCalledTimes(0);
                expect(mocks.cellValues).toHaveBeenCalledTimes(1);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('is triggered by initial loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const spy = jest.fn();
                linked2.watch('cellValues', spy);
                await Promise.all([
                    linked.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(linked2, 'cellValues');
            });

            it('is triggered when underlying record has previously been loaded', async () => {
                const otherQuery = await sdk.base.tables[1].selectRecordsAsync();
                const spy = jest.fn();

                let lrqr = otherQuery.records[0].selectLinkedRecordsFromCell('fld2ndLinked');
                lrqr.watch('cellValues', spy);
                await lrqr.loadDataAsync();

                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

        describe('key: recordColors', () => {
            it('triggers loading', async () => {
                const view = sdk.base.tables[1].views[0];
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked', {
                    fields: [],
                    recordColorMode: {type: 'byView', view},
                });

                waitForWatchKeyAsync(linked2, 'recordColors').then(() => {});

                await waitForWatchKeyAsync(linked2, 'isDataLoaded');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('is alerted to changes', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'viewsById',
                            'viwTaskAll',
                            'colorsByRecordId',
                            'fld1stPrimary',
                        ],
                        value: 'blue... no, yell-aaaahhhh!',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(0);
                expect(mocks.recordIds).toHaveBeenCalledTimes(0);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(1);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('is triggered by initial loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const spy = jest.fn();
                linked2.watch('recordColors', spy);
                await Promise.all([
                    linked.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(linked2, 'recordColors');
            });
        });

        describe('key: isDataLoaded', () => {
            it('does not trigger loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked', {fields: []});
                const linked3 = record.selectLinkedRecordsFromCell('fld1stLinked');

                linked2.watch('isDataLoaded', () => {});
                await linked3.loadDataAsync();

                expect(linked2.isDataLoaded).toBe(false);
            });

            it('is alerted to changes', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');

                await Promise.all([
                    linked2.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(linked2.isDataLoaded).toBe(true);
            });
        });

        describe('key: cellValuesInField:{FIELD_ID}', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');

                const result = await new Promise(resolve => {
                    linked2.watch(
                        'cellValuesInField:fld2ndPrimary',
                        (...args: [LinkedRecordsQueryResult, string]) => resolve(args),
                    );
                });

                expect(linked2.isDataLoaded).toBe(true);
                expect(result).toEqual([linked2, 'cellValuesInField:fld2ndPrimary']);
            });

            it('all fields triggered by initial record loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fld1stLinked');
                const isDataLoadeds: Array<boolean> = [];
                const trackLoaded = () => {
                    isDataLoadeds.push(linked2.isDataLoaded);
                };

                const spies: {[key: string]: jest.Mock} = {
                    fld2ndPrimary: jest.fn().mockImplementation(trackLoaded),
                    fld2ndSecondary: jest.fn().mockImplementation(trackLoaded),
                    fld2ndLinked: jest.fn().mockImplementation(trackLoaded),
                };
                linked2.watch('cellValuesInField:fld2ndPrimary', spies.fld2ndPrimary);
                linked2.watch('cellValuesInField:fld2ndSecondary', spies.fld2ndSecondary);
                linked2.watch('cellValuesInField:fld2ndLinked', spies.fld2ndLinked);

                await linked2.loadDataAsync();

                expect(spies.fld2ndPrimary).toHaveBeenCalledTimes(1);
                expect(spies.fld2ndSecondary).toHaveBeenCalledTimes(1);
                expect(spies.fld2ndLinked).toHaveBeenCalledTimes(1);
                expect(isDataLoadeds).toEqual([true, true, true]);
            });

            it('referenced field', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld2ndSecondary',
                        ],
                        value: 'something else',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(0);
                expect(mocks.recordIds).toHaveBeenCalledTimes(0);
                expect(mocks.cellValues).toHaveBeenCalledTimes(1);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(1);
                expect(mocks.cellValuesInField).toHaveBeenCalledWith(
                    linked,
                    'cellValuesInField:fld2ndSecondary',
                    ['recB'],
                );
            });

            it('unreferenced field', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: 'something else',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(0);
                expect(mocks.recordIds).toHaveBeenCalledTimes(0);
                expect(mocks.cellValues).toHaveBeenCalledTimes(1);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('unrecognized record', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recG',
                            'cellValuesByFieldId',
                            'fld2ndSecondary',
                        ],
                        value: 'something else',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(0);
                expect(mocks.recordIds).toHaveBeenCalledTimes(0);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });

            it('cancels subscription when field is invalidated', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'fieldsById',
                            'fld1stLinked',
                            'typeOptions',
                            'linkedTableId',
                        ],
                        value: 'tblFirst44',
                    },
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'recB',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: 'something else',
                    },
                ]);

                expect(mocks.records).toHaveBeenCalledTimes(1);
                expect(mocks.recordIds).toHaveBeenCalledTimes(1);
                expect(mocks.cellValues).toHaveBeenCalledTimes(0);
                expect(mocks.recordColors).toHaveBeenCalledTimes(0);
                expect(mocks.isDataLoaded).toHaveBeenCalledTimes(0);
                expect(mocks.cellValuesInField).toHaveBeenCalledTimes(0);
            });
        });
    });
});
