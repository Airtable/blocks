import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../src/sdk';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';
import Record from '../../src/models/record';
import RecordQueryResult from '../../src/models/record_query_result';
import LinkedRecordsQueryResult from '../../src/models/linked_records_query_result';
import {simulateTimersAndClearAfterEachTest, waitForWatchKeyAsync} from '../test_helpers';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return mockAirtableInterface;
    },
}));

describe('LinkedRecordQueryResult', () => {
    let sdk: Sdk;
    let query: RecordQueryResult;
    let record: Record;

    simulateTimersAndClearAfterEachTest();

    beforeEach(async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockImplementation(tableId => {
            const first = tableId === 'tblFirst';
            const recId = first ? 'recA' : 'recB';
            const fieldId = first ? 'fldLinked1' : 'fldLinked2';
            const cellValues = [{id: first ? 'recB' : 'recA'}];
            return Promise.resolve({
                recordsById: {
                    [recId]: {
                        id: recId,
                        cellValuesByFieldId: {
                            fldPrimary: 'primary',
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
        sdk = getSdk();
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
        clearSdkForTest();
    });

    describe('caching', () => {
        it('caches like requests', () => {
            const first = record.selectLinkedRecordsFromCell('fldLinked1');
            const second = record.selectLinkedRecordsFromCell('fldLinked1');
            expect(first).toBe(second);
        });

        it('does not cache dissimilar requests', () => {
            const first = record.selectLinkedRecordsFromCell('fldLinked1');
            const second = record.selectLinkedRecordsFromCell('fldLinked1', {
                fields: ['fldLinked2'],
            });
            expect(first).not.toBe(second);
        });
    });

    describe('#isValid', () => {
        it('initially true', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            expect(linked.isValid).toBe(true);
        });

        it('true following change to non-critical type option', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fldLinked1',
                        'typeOptions',
                        'unreversed',
                    ],
                    value: false,
                },
            ]);

            expect(linked.isValid).toBe(true);
        });

        it('false following change in field type (loaded)', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fldLinked1', 'type'],
                    value: 'text',
                },
            ]);

            expect(linked.isValid).toBe(false);
        });

        it('false following change in field type (unloaded)', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
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
                            'fldLinked1',
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
    });

    it('#parentTable', async () => {
        const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
        expect(linked.parentTable.id).toBe('tblSecond');
    });

    describe('#recordIds', () => {
        it('returns an array of the relevant record IDs', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

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
                        'fldLinked1',
                    ],
                    value: null,
                },
            ]);
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

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
                        'fldLinked1',
                    ],
                    value: [{id: 'recBogus'}],
                },
            ]);
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

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
                            fldPrimary: 'primary also',
                            fldLinked2: [{id: 'recA'}],
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
                        'fldLinked1',
                    ],
                    value: [{id: 'recB'}, {id: 'recC'}],
                },
            ]);

            let linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            expect(linked.recordIds).toStrictEqual(['recB', 'recC']);

            linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1', {
                sorts: [{field: 'fldPrimary'}],
            });

            expect(mockAirtableInterface.createVisList).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.createVisList.mock.calls[0][3]).toStrictEqual([
                {direction: 'asc', fieldId: 'fldPrimary'},
            ]);
            expect(linked.recordIds).toStrictEqual(['recB', 'recC']);
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fldLinked1',
                        'typeOptions',
                        'linkedTableId',
                    ],
                    value: 'tblFirst44',
                },
            ]);

            expect(() => linked.recordIds).toThrow(Error);
        });

        it('reports an error when the result has not yet been loaded', async () => {
            const linked = record.selectLinkedRecordsFromCell('fldLinked1');

            expect(() => linked.recordIds).toThrow(Error);
        });

        it('reports an error when the result has been unloaded', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });

            expect(() => linked.recordIds).toThrow(Error);
        });
    });

    describe('#records', () => {
        it('returns an array of the relevant records', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            expect(linked.records.length).toBe(1);
            expect(linked.records[0].id).toBe('recB');
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fldLinked1',
                        'typeOptions',
                        'linkedTableId',
                    ],
                    value: 'tblFirst44',
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the result has not yet been loaded', async () => {
            const linked = record.selectLinkedRecordsFromCell('fldLinked1');

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the result has been unloaded', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the origin record has been deleted', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recA'],
                    value: undefined,
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });

        it('reports an error when the field has been deleted in the origin table', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fldLinked1'],
                    value: undefined,
                },
            ]);

            expect(() => linked.records).toThrow(Error);
        });
    });

    describe('#fields', () => {
        it('returns null when no fields were initially specified', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            expect(linked.fields).toBe(null);
        });

        it('returns an array of the fields initially specified', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1', {
                fields: ['fldLinked2'],
            });

            if (linked.fields === null) {
                throw new Error('Expected an array, received null.');
            }

            expect(linked.fields.length).toBe(1);
            expect(linked.fields[0].id).toBe('fldLinked2');
        });

        it('reports an error when the result has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'fieldsById',
                        'fldLinked1',
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
            const result = record.selectLinkedRecordsFromCell('fldLinked1');
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('throws an error for non-existent records', async () => {
            const result = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            expect(() =>
                result.getRecordById('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No record with ID not a record id in this query result"`,
            );
        });
    });

    describe('#getRecordByIdIfExists', () => {
        it('throws an error for unloaded records', () => {
            const result = record.selectLinkedRecordsFromCell('fldLinked1');
            expect(() =>
                result.getRecordByIdIfExists('not a record id'),
            ).toThrowErrorMatchingInlineSnapshot(`"Record metadata is not loaded"`);
        });

        it('returns `null` for non-existent records', async () => {
            const result = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            expect(result.getRecordByIdIfExists('not a record id')).toBe(null);
        });
    });

    describe('#loadDataAsync', () => {
        it('works for loaded instances', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');

            await linked.loadDataAsync();

            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData(); 
                linked.unloadData(); 
            });
        });

        it('works for unloaded instances', async () => {
            const linked = record.selectLinkedRecordsFromCell('fldLinked1');

            await linked.loadDataAsync();

            await new Promise(resolve => {
                linked.watch('isDataLoaded', resolve);

                linked.unloadData();
            });
        });
    });

    describe('#unloadData', () => {
        it('functions when field has been invalidated', async () => {
            const linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fldLinked1', 'type'],
                    value: 'text',
                },
            ]);

            linked.unloadData();
        });

        it('tolerates unnecessary invocations', async () => {
            const linked = record.selectLinkedRecordsFromCell('fldLinked1');
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
            linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1', {
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
                            'fldSecondary',
                        ],
                        value,
                    },
                ]);
            };

            it('reports error when over-freed', () => {
                const noop = () => {};
                linked.watch('cellValuesInField:fldSecondary', noop);
                linked.unwatch('cellValuesInField:fldSecondary', noop);

                expect(() => {
                    linked.unwatch('cellValuesInField:fldSecondary', noop);
                }).toThrowErrorMatchingInlineSnapshot(
                    `"cellValuesInField:fldSecondary over-free'd"`,
                );
            });

            it('triggers unloading', async () => {
                const noop = () => {};
                linked.watch('cellValuesInField:fldSecondary', noop);
                linked.unloadData();
                linked.unwatch('cellValuesInField:fldSecondary', noop);

                await waitForWatchKeyAsync(linked, 'isDataLoaded');

                expect(linked.isDataLoaded).toBe(false);

                expect(mockAirtableInterface.unsubscribeFromCursorData.mock.calls.length).toBe(1);
                expect(mockAirtableInterface.unsubscribeFromTableData.mock.calls.length).toBe(0);
                expect(mockAirtableInterface.unsubscribeFromCellValuesInFields.mock.calls).toEqual([
                    ['tblSecond', ['fldSecondary']],
                ]);
                expect(mockAirtableInterface.unsubscribeFromViewData.mock.calls.length).toBe(0);
            });

            it('does not alter other subscriptions', () => {
                const spy1 = jest.fn();
                const spy2 = jest.fn();
                const spy3 = jest.fn();
                linked.watch('cellValuesInField:fldSecondary', spy1);
                linked.watch('cellValuesInField:fldSecondary', spy2);
                linked.watch('cellValuesInField:fldSecondary', spy3);
                change('something else');

                expect(spy1).toHaveBeenCalledTimes(1);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValuesInField:fldSecondary', spy2);

                change('something even differenter');

                expect(spy1).toHaveBeenCalledTimes(2);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy3).toHaveBeenCalledTimes(2);
            });

            it('properly cleans up final subscription', () => {
                const spy = jest.fn();

                linked.watch('cellValuesInField:fldSecondary', spy);
                linked.unwatch('cellValuesInField:fldSecondary', spy);
                linked.watch('cellValuesInField:fldSecondary', spy);

                change('something else');

                expect(spy).toHaveBeenCalledTimes(1);

                linked.unwatch('cellValuesInField:fldSecondary', spy);

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
                            'fldPrimary',
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
            linked = await record.selectLinkedRecordsFromCellAsync('fldLinked1', {
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
            linked.watch('cellValuesInField:fldSecondary', mocks.cellValuesInField);
        });

        describe('key: recordIds', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');

                await waitForWatchKeyAsync(linked2, 'recordIds');

                expect(linked2.isDataLoaded).toBe(true);
            });
        });

        describe('key: records', () => {
            it('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');

                await waitForWatchKeyAsync(linked2, 'records');

                expect(linked2.isDataLoaded).toBe(true);
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
                            'fldLinked1',
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
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');
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
                            'fldLinked1',
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
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');

                await waitForWatchKeyAsync(linked2, 'cellValues');

                expect(linked2.isDataLoaded).toBe(false);

                await waitForWatchKeyAsync(linked2, 'isDataLoaded');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('triggered by initial record loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');
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
                            'fldPrimary',
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
        });

        describe('key: recordColors', () => {
            it('triggers loading', async () => {
                const view = sdk.base.tables[1].views[0];
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1', {
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
                            'fldPrimary',
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
        });

        describe('key: isDataLoaded', () => {
            it('does not trigger loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1', {fields: []});
                const linked3 = record.selectLinkedRecordsFromCell('fldLinked1');

                linked2.watch('isDataLoaded', () => {});
                await linked3.loadDataAsync();

                expect(linked2.isDataLoaded).toBe(false);
            });

            it('is alerted to changes', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');

                await Promise.all([
                    linked2.loadDataAsync(),
                    waitForWatchKeyAsync(linked2, 'isDataLoaded'),
                ]);

                expect(linked2.isDataLoaded).toBe(true);
            });
        });

        describe('key: cellValuesInField:{FIELD_ID}', () => {
            it.skip('triggers loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');

                await waitForWatchKeyAsync(linked2, 'cellValuesInField:fldPrimary');

                expect(linked2.isDataLoaded).toBe(true);
            });

            it('triggered by initial record loading', async () => {
                const linked2 = record.selectLinkedRecordsFromCell('fldLinked1');
                const spy = jest.fn();
                linked2.watch('cellValuesInField:fldPrimary', spy);
                await linked2.loadDataAsync();
                expect(spy).toHaveBeenCalledTimes(1);
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
                            'fldSecondary',
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
                            'fldPrimary',
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
                            'fldSecondary',
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
                            'fldLinked1',
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
                            'fldPrimary',
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
