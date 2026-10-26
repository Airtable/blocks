import {act, cleanup} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Table} from '../../../src/interface/models/table';
import {type PreloadedRecordsData} from '../../../src/interface/types/table';
import {type RecordId} from '../../../src/shared/types/hyper_ids';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.useFakeTimers();

const PRELOADED_RECORDS_QUERY_KEY = '__airtablePreloadedRecords';

async function tickAsync() {
    await new Promise((resolve) => process.nextTick(resolve));
    jest.advanceTimersByTime(0);
}

describe('PreloadedRecordsQueryResult', () => {
    let sdk: InterfaceBlockSdk;
    let table: Table;

    const getTableData = () => mockAirtableInterface.sdkInitData.baseData.tablesById.tblFirst;

    const makeRecords = (count: number, startIndex = 0): Array<RecordId> => {
        const recordIds: Array<RecordId> = [];
        for (let i = startIndex; i < startIndex + count; i++) {
            const recordId = `rec${i}`;
            getTableData().recordsById[recordId] = {
                id: recordId,
                cellValuesByFieldId: {fld1stPrimary: `Record ${i}`, fldMockLookup: ['lookup']},
                createdTime: '2020-01-01T00:00:00.000Z',
            };
            getTableData().recordOrder.push(recordId);
            recordIds.push(recordId);
        }
        return recordIds;
    };

    const seedPreloadedRecords = (
        recordOrder: Array<RecordId>,
        preloadedRecordsData: Partial<PreloadedRecordsData> = {},
    ) => {
        getTableData().dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY] = {recordOrder};
        getTableData().preloadedRecords = {
            queryKey: PRELOADED_RECORDS_QUERY_KEY,
            fieldIds: ['fld1stPrimary'],
            rowLimit: 3,
            ...preloadedRecordsData,
        };
    };

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        table = sdk.base.getTableByName('First Table');
    });

    afterEach(async () => {
        await act(async () => {
            cleanup();
        });
        jest.advanceTimersByTime(2000);
        mockAirtableInterface.reset();
    });

    it('returns null when the host predates preloaded records', () => {
        makeRecords(2);
        expect(getTableData().preloadedRecords).toBeUndefined();
        expect(table.unstable_selectPreloadedRecords()).toBeNull();
    });

    it('returns null when nothing is preloaded', () => {
        getTableData().preloadedRecords = null;
        expect(table.unstable_selectPreloadedRecords()).toBeNull();
    });

    it('returns null when the preloaded rows are absent', () => {
        seedPreloadedRecords(makeRecords(2));
        delete getTableData().dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY];
        expect(table.unstable_selectPreloadedRecords()).toBeNull();
    });

    it('is loaded immediately without asking the host for data', async () => {
        seedPreloadedRecords(makeRecords(2));

        const queryResult = table.unstable_selectPreloadedRecords();
        expect(queryResult).not.toBeNull();
        expect(queryResult!.isDataLoaded).toBe(true);
        expect(queryResult!.recordIds).toStrictEqual(['rec0', 'rec1']);
        expect(
            queryResult!.records.map((record) => record.getCellValue('fld1stPrimary')),
        ).toStrictEqual(['Record 0', 'Record 1']);
        expect(() => queryResult!.records[0].name).not.toThrow();

        await act(async () => {
            await queryResult!.loadDataAsync();
        });
        queryResult!.unloadData();
        jest.advanceTimersByTime(2000);

        expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
    });

    it('returns the same instance while the preloaded records are unchanged', () => {
        seedPreloadedRecords(makeRecords(2));
        expect(table.unstable_selectPreloadedRecords()).toBe(
            table.unstable_selectPreloadedRecords(),
        );
    });

    it('slices the records to rowLimit and reports more records from the extra row', () => {
        seedPreloadedRecords(makeRecords(4), {rowLimit: 3});

        const queryResult = table.unstable_selectPreloadedRecords()!;
        expect(queryResult.rowLimit).toBe(3);
        expect(queryResult.recordIds).toStrictEqual(['rec0', 'rec1', 'rec2']);
        expect(queryResult.records).toHaveLength(3);
        expect(queryResult.hasMoreRecords).toBe(true);
        expect(queryResult.hasRecord('rec3')).toBe(false);
    });

    it('reports no more records when at most rowLimit records were preloaded', () => {
        seedPreloadedRecords(makeRecords(3), {rowLimit: 3});

        const queryResult = table.unstable_selectPreloadedRecords()!;
        expect(queryResult.recordIds).toHaveLength(3);
        expect(queryResult.hasMoreRecords).toBe(false);
    });

    it('only exposes the preloaded fields', () => {
        seedPreloadedRecords(makeRecords(1), {fieldIds: ['fld1stPrimary']});

        const queryResult = table.unstable_selectPreloadedRecords()!;
        expect(queryResult.fields.map((field) => field.id)).toStrictEqual(['fld1stPrimary']);

        const [record] = queryResult.records;
        expect(record.getCellValue('fld1stPrimary')).toBe('Record 0');
        expect(() => record.getCellValue('fldMockLookup')).toThrow(
            "Field fldMockLookup was not declared in this query result's fields",
        );
    });

    it('exposes the createdTime and isDeleted of its records', () => {
        seedPreloadedRecords(makeRecords(1));

        const [record] = table.unstable_selectPreloadedRecords()!.records;
        expect(record.createdTime).toStrictEqual(new Date('2020-01-01T00:00:00.000Z'));
        expect(record.isDeleted).toBe(false);
    });

    it('only lets its records watch the preloaded fields', () => {
        seedPreloadedRecords(makeRecords(1), {fieldIds: ['fldMockLookup']});

        const [record] = table.unstable_selectPreloadedRecords()!.records;
        const onChange = jest.fn();
        expect(() => record.watch('cellValueInField:fld1stPrimary', onChange)).toThrow(
            "Field fld1stPrimary was not declared in this query result's fields",
        );
        expect(() => record.watch(['cellValues', 'name'], onChange)).toThrow(
            "Field fld1stPrimary was not declared in this query result's fields",
        );

        const keys = ['cellValues', 'cellValueInField:fldMockLookup'];
        expect(record.watch(keys, onChange)).toStrictEqual(keys);
        expect(record.unwatch(keys, onChange)).toStrictEqual(keys);
    });

    describe('_selectForRequestedFieldIds', () => {
        it('gates reads to the preloaded fields among the requested ones', () => {
            seedPreloadedRecords(makeRecords(1), {fieldIds: ['fldMockLookup', 'fld1stPrimary']});
            const queryResult = table.unstable_selectPreloadedRecords()!;

            const restricted = queryResult._selectForRequestedFieldIds([
                'fld1stPrimary',
                'fld1stLinked',
            ]);

            expect(restricted.fields.map((field) => field.id)).toStrictEqual(['fld1stPrimary']);
            expect(restricted.recordIds).toStrictEqual(queryResult.recordIds);
            const [record] = restricted.records;
            expect(record.getCellValue('fld1stPrimary')).toBe('Record 0');
            expect(() => record.getCellValue('fldMockLookup')).toThrow(
                "Field fldMockLookup was not declared in this query result's fields",
            );
        });

        it('keeps the preloaded order of the fields', () => {
            seedPreloadedRecords(makeRecords(1), {fieldIds: ['fldMockLookup', 'fld1stPrimary']});

            const restricted = table
                .unstable_selectPreloadedRecords()!
                ._selectForRequestedFieldIds(['fld1stPrimary', 'fldMockLookup']);

            expect(restricted.fields.map((field) => field.id)).toStrictEqual([
                'fldMockLookup',
                'fld1stPrimary',
            ]);
        });

        it('has no fields when none of the requested ones were preloaded', () => {
            seedPreloadedRecords(makeRecords(1), {fieldIds: ['fldMockLookup']});

            const restricted = table
                .unstable_selectPreloadedRecords()!
                ._selectForRequestedFieldIds(['fld1stPrimary']);

            expect(restricted.isDataLoaded).toBe(true);
            expect(restricted.fields).toStrictEqual([]);
            expect(restricted.recordIds).toStrictEqual(['rec0']);
            expect(() => restricted.records[0].name).toThrow(
                "Field fld1stPrimary was not declared in this query result's fields. " +
                    'Declared fields: <none>',
            );
        });

        it('returns the same instance for the same fields in any order', () => {
            seedPreloadedRecords(makeRecords(1));
            const queryResult = table.unstable_selectPreloadedRecords()!;

            const restricted = queryResult._selectForRequestedFieldIds([
                'fld1stPrimary',
                'fldMockLookup',
            ]);

            expect(
                table
                    .unstable_selectPreloadedRecords()!
                    ._selectForRequestedFieldIds(['fldMockLookup', 'fld1stPrimary']),
            ).toBe(restricted);
            expect(queryResult._selectForRequestedFieldIds(['fld1stPrimary'])).not.toBe(restricted);
        });

        it('goes stale with the preloaded records it restricts', async () => {
            seedPreloadedRecords(makeRecords(2), {rowLimit: 3});
            const restricted = table
                .unstable_selectPreloadedRecords()!
                ._selectForRequestedFieldIds(['fld1stPrimary']);

            await act(async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'preloadedRecords'],
                        value: {
                            queryKey: PRELOADED_RECORDS_QUERY_KEY,
                            fieldIds: ['fld1stPrimary'],
                            rowLimit: 1,
                        },
                    },
                ]);
            });

            expect(restricted.isDataLoaded).toBe(false);
            const newRestricted = table
                .unstable_selectPreloadedRecords()!
                ._selectForRequestedFieldIds(['fld1stPrimary']);
            expect(newRestricted).not.toBe(restricted);
            expect(newRestricted.recordIds).toStrictEqual(['rec0']);
        });
    });

    it('becomes stale and is replaced when the host changes the preloaded records', async () => {
        seedPreloadedRecords(makeRecords(2), {rowLimit: 3});
        const oldQueryResult = table.unstable_selectPreloadedRecords()!;

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'preloadedRecords'],
                    value: {
                        queryKey: PRELOADED_RECORDS_QUERY_KEY,
                        fieldIds: ['fld1stPrimary'],
                        rowLimit: 1,
                    },
                },
            ]);
        });

        const newQueryResult = table.unstable_selectPreloadedRecords()!;
        expect(newQueryResult).not.toBe(oldQueryResult);
        expect(newQueryResult.recordIds).toStrictEqual(['rec0']);
        expect(oldQueryResult.isDeleted).toBe(true);
        expect(oldQueryResult.isDataLoaded).toBe(false);
    });

    it('goes away when the host releases the preloaded records', async () => {
        seedPreloadedRecords(makeRecords(2));
        const queryResult = table.unstable_selectPreloadedRecords()!;

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {path: ['tablesById', 'tblFirst', 'preloadedRecords'], value: null},
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        PRELOADED_RECORDS_QUERY_KEY,
                    ],
                    value: undefined,
                },
            ]);
        });

        expect(table.unstable_selectPreloadedRecords()).toBeNull();
        expect(queryResult.isDataLoaded).toBe(false);
    });

    it('stays live as the preloaded rows and cells change', async () => {
        seedPreloadedRecords(makeRecords(3), {rowLimit: 3});
        const queryResult = table.unstable_selectPreloadedRecords()!;
        await act(async () => {
            await queryResult.loadDataAsync();
        });

        const recordsHandler = jest.fn();
        const hasMoreRecordsHandler = jest.fn();
        const cellValuesHandler = jest.fn();
        queryResult.watch('records', recordsHandler);
        queryResult.watch('hasMoreRecords', hasMoreRecordsHandler);
        queryResult.watch('cellValues', cellValuesHandler);

        const [newRecordId] = makeRecords(1, 3);
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        PRELOADED_RECORDS_QUERY_KEY,
                        'recordOrder',
                    ],
                    value: ['rec0', 'rec1', 'rec2', newRecordId],
                },
            ]);
            await tickAsync();
        });

        expect(recordsHandler).toHaveBeenCalled();
        expect(hasMoreRecordsHandler).toHaveBeenCalled();
        expect(queryResult.hasMoreRecords).toBe(true);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'rec1',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Renamed',
                },
            ]);
            await tickAsync();
        });

        expect(cellValuesHandler).toHaveBeenCalled();
        expect(queryResult.records[1].getCellValue('fld1stPrimary')).toBe('Renamed');
    });

    it('keeps the extra row out of the records while a deleted record is still in the preloaded rows', async () => {
        seedPreloadedRecords(makeRecords(4), {rowLimit: 3});
        const queryResult = table.unstable_selectPreloadedRecords()!;

        const deletePromise = table.deleteRecordAsync('rec0');
        expect(queryResult.recordIds).toStrictEqual(['rec1', 'rec2']);
        expect(queryResult.hasMoreRecords).toBe(true);
        await act(async () => {
            await deletePromise;
        });
    });

    it('notifies watchers of only hasMoreRecords when the extra row arrives', async () => {
        seedPreloadedRecords(makeRecords(3), {rowLimit: 3});
        const queryResult = table.unstable_selectPreloadedRecords()!;
        const hasMoreRecordsHandler = jest.fn();
        await act(async () => {
            queryResult.watch('hasMoreRecords', hasMoreRecordsHandler);
            await tickAsync();
        });
        hasMoreRecordsHandler.mockClear();

        const [newRecordId] = makeRecords(1, 3);
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        PRELOADED_RECORDS_QUERY_KEY,
                        'recordOrder',
                    ],
                    value: ['rec0', 'rec1', 'rec2', newRecordId],
                },
            ]);
            await tickAsync();
        });

        expect(queryResult.hasMoreRecords).toBe(true);
        expect(hasMoreRecordsHandler).toHaveBeenCalled();
    });

    it('picks up preloaded rows that changed while it was unloaded', async () => {
        seedPreloadedRecords(makeRecords(2), {rowLimit: 3});
        const queryResult = table.unstable_selectPreloadedRecords()!;
        await act(async () => {
            await queryResult.loadDataAsync();
        });
        expect(queryResult.hasRecord('rec1')).toBe(true);
        queryResult.unloadData();
        jest.advanceTimersByTime(2000);

        const [newRecordId] = makeRecords(1, 2);
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        PRELOADED_RECORDS_QUERY_KEY,
                        'recordOrder',
                    ],
                    value: ['rec0', 'rec1', newRecordId],
                },
            ]);
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });
        const cellValuesHandler = jest.fn();
        queryResult.watch('cellValues', cellValuesHandler);
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        newRecordId,
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Renamed',
                },
            ]);
            await tickAsync();
        });

        expect(queryResult.hasRecord(newRecordId)).toBe(true);
        expect(cellValuesHandler).toHaveBeenCalled();
    });
});
