import {act, cleanup} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Record} from '../../../src/interface/models/record';
import {type Table} from '../../../src/interface/models/table';
import {type FieldId, type RecordId} from '../../../src/shared/types/hyper_ids';
import {type ObjectMap} from '../../../src/shared/private_utils';
import {spawnError} from '../../../src/shared/error_utils';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.useFakeTimers();

/** Drain microtasks; fake timers treat awaits/microtasks as out-of-band. */
async function tickAsync() {
    await new Promise((resolve) => process.nextTick(resolve));
    jest.advanceTimersByTime(0);
}

/**
 * AbstractModelWithAsyncData.unloadData() delays the actual unload by
 * __DATA_UNLOAD_DELAY_MS (1000ms). Flush that timeout so the subclass's
 * _unloadData() runs and the host's unloadDynamicQuery spy records the call.
 */
async function flushUnloadTimeoutAsync() {
    await act(async () => {
        jest.advanceTimersByTime(1000);
        await tickAsync();
    });
}

describe('LinkedRecordsQueryResult', () => {
    let sdk: InterfaceBlockSdk;
    let firstTable: Table;
    let secondTable: Table;

    const makeRecord = (
        tableId: string,
        id: RecordId,
        cellValuesByFieldId: ObjectMap<FieldId, unknown>,
        createdTime: string,
    ) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById[tableId];
        parentTableData.recordsById[id] = {id, cellValuesByFieldId, createdTime};
        parentTableData.recordOrder.push(id);
    };

    /**
     * Simulate the host populating `dynamicQueriesByKey[key].recordOrder` in
     * response to a loadDynamicQueryAsync call.
     */
    const seedDynamicQuery = (tableId: string, key: string, recordIds: Array<RecordId>) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById[tableId];
        parentTableData.dynamicQueriesByKey[key] = {recordOrder: recordIds};
    };

    /** Compute the __poolKey LinkedRecordsQueryResult will produce for these opts. */
    const linkedKey = (
        originRecordId: RecordId,
        originFieldId: FieldId,
        fieldIds: Array<FieldId> | null,
    ): string =>
        JSON.stringify([
            'linked',
            originRecordId,
            originFieldId,
            fieldIds === null ? null : [...fieldIds].sort(),
        ]);

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        firstTable = sdk.base.getTableByName('First Table');
        secondTable = sdk.base.getTableByName('Second Table');
    });

    afterEach(async () => {
        await act(async () => {
            cleanup();
        });
        jest.advanceTimersByTime(2000);
        mockAirtableInterface.reset();
    });

    it('returns records whose IDs come from the host response', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {fld2ndPrimary: 'Anna'}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');
        const key = linkedKey('recA', 'fld1stLinked', ['fld2ndPrimary']);
        seedDynamicQuery('tblSecond', key, ['rec2ndA']);

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });
        expect(queryResult.__poolKey).toBe(key);

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(queryResult.recordIds).toStrictEqual(['rec2ndA']);
        expect(queryResult.records.map((r) => r.id)).toStrictEqual(['rec2ndA']);
    });

    it('_unloadData is safe to run on a failed-load instance', async () => {
        makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(async () => {
            throw spawnError('host rejected');
        });

        const qr = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });
        const key = qr.__poolKey;

        await expect(qr.loadDataAsync()).rejects.toThrow('host rejected');

        expect(originRecord.__linkedRecordsQueryResultPool._objectsByKey[key]).toContain(qr);

        act(() => {
            qr.unloadData();
        });

        await expect(flushUnloadTimeoutAsync()).resolves.not.toThrow();

        expect(originRecord.__linkedRecordsQueryResultPool._objectsByKey[key]).toBeUndefined();
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({key});
    });

    it('a retry after a host-load rejection actually re-issues the load', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        let callCount = 0;
        (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(async () => {
            callCount++;
            if (callCount === 1) {
                throw spawnError('host rejected');
            }
        });

        const qr = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await expect(qr.loadDataAsync()).rejects.toThrow('host rejected');
        await expect(qr.loadDataAsync()).resolves.toBeUndefined();
        expect(callCount).toBe(2);
        expect(qr.isDataLoaded).toBe(true);
    });

    it('catches an origin cell change that fires while super._loadDataAsync is awaiting', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        let resolveFirstLoad!: () => void;
        const firstLoadPromise = new Promise<void>((resolve) => {
            resolveFirstLoad = resolve;
        });
        let callCount = 0;
        (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(async () => {
            callCount++;
            if (callCount === 1) {
                await firstLoadPromise;
            }
        });

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        const loadPromise = queryResult.loadDataAsync();
        await tickAsync();

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}],
                },
            ]);
        });

        resolveFirstLoad();
        await act(async () => {
            await loadPromise;
            await tickAsync();
        });

        expect(callCount).toBe(2);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith(
            expect.objectContaining({
                tableId: 'tblSecond',
                recordIds: ['rec2ndB'],
            }),
        );
    });

    it('selectLinkedRecordsFromCell with no `fields` materializes all linked-table field ids in the host call', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField);
        await act(async () => {
            await queryResult.loadDataAsync();
        });

        const allLinkedFieldIds = ['fld2ndPrimary', 'fld2ndSecondary', 'fld2ndLinked'];
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith({
            key: linkedKey('recA', 'fld1stLinked', null),
            tableId: 'tblSecond',
            fieldIds: allLinkedFieldIds,
            recordIds: ['rec2ndA'],
        });

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}],
                },
            ]);
            await tickAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith({
            key: linkedKey('recA', 'fld1stLinked', null),
            tableId: 'tblSecond',
            fieldIds: allLinkedFieldIds,
            recordIds: ['rec2ndB'],
        });
    });

    it('re-issues loadDynamicQueryAsync with same key + new recordIds when the origin cell changes (no unload)', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');
        const key = linkedKey('recA', 'fld1stLinked', ['fld2ndPrimary']);

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith({
            key,
            tableId: 'tblSecond',
            fieldIds: ['fld2ndPrimary'],
            recordIds: ['rec2ndA'],
        });

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}],
                },
            ]);
            await tickAsync();
        });

        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith({
            key,
            tableId: 'tblSecond',
            fieldIds: ['fld2ndPrimary'],
            recordIds: ['rec2ndB'],
        });
    });

    it('skips the host refresh when the cell value changes but linked record IDs are identical', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA', name: 'Anna'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {fld2ndPrimary: 'Anna'}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        await act(async () => {
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
                    value: [{id: 'rec2ndA', name: 'Annabelle'}],
                },
            ]);
            await tickAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
    });

    it('still refreshes when the origin cell reorders the same set of linked record IDs', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}, {id: 'rec2ndB'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}, {id: 'rec2ndA'}],
                },
            ]);
            await tickAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
    });

    it('isDataLoaded stays true across an origin-cell-change refresh (no flicker)', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(queryResult.isDataLoaded).toBe(true);

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}],
                },
            ]);
            await tickAsync();
        });

        expect(queryResult.isDataLoaded).toBe(true);
    });

    it('atomically swaps recordIds when the host refresh response lands', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');

        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');
        const key = linkedKey('recA', 'fld1stLinked', ['fld2ndPrimary']);

        seedDynamicQuery('tblSecond', key, ['rec2ndA']);

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        expect(queryResult.recordIds).toStrictEqual(['rec2ndA']);

        await act(async () => {
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
                    value: [{id: 'rec2ndB'}],
                },
            ]);
            await tickAsync();
        });

        expect(queryResult.recordIds).toStrictEqual(['rec2ndA']);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblSecond', 'dynamicQueriesByKey', key, 'recordOrder'],
                    value: ['rec2ndB'],
                },
            ]);
            await tickAsync();
        });

        expect(queryResult.recordIds).toStrictEqual(['rec2ndB']);
    });

    it('unloadDynamicQuery is called exactly once regardless of cell-change refreshes', async () => {
        makeRecord(
            'tblFirst',
            'recA',
            {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
            '2020-01-01T00:00:00.000Z',
        );
        makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndB', {}, '2020-01-01T00:00:00.000Z');
        makeRecord('tblSecond', 'rec2ndC', {}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');
        const key = linkedKey('recA', 'fld1stLinked', ['fld2ndPrimary']);

        const queryResult = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary'],
        });

        await act(async () => {
            await queryResult.loadDataAsync();
        });

        for (const newLinked of [[{id: 'rec2ndB'}], [{id: 'rec2ndC'}]]) {
            await act(async () => {
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
                        value: newLinked,
                    },
                ]);
                await tickAsync();
            });
        }

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(3);
        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

        act(() => {
            queryResult.unloadData();
        });
        await flushUnloadTimeoutAsync();

        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({key});
    });

    describe('isValid', () => {
        const setupValidQuery = () => {
            makeRecord(
                'tblFirst',
                'recA',
                {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
                '2020-01-01T00:00:00.000Z',
            );
            makeRecord('tblSecond', 'rec2ndA', {}, '2020-01-01T00:00:00.000Z');
            const originRecord = sdk.base
                .__getRecordStore('tblFirst')
                .getRecordByIdIfExists('recA') as Record;
            const originField = firstTable.getFieldById('fld1stLinked');
            const queryResult = originRecord.selectLinkedRecordsFromCell(originField);
            return {originRecord, originField, queryResult};
        };

        it('starts true for a healthy query', () => {
            const {queryResult} = setupValidQuery();
            expect(queryResult.isValid).toBe(true);
        });

        it('flips to false when the origin record is deleted', () => {
            const {queryResult} = setupValidQuery();
            expect(queryResult.isValid).toBe(true);

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {path: ['tablesById', 'tblFirst', 'recordsById', 'recA'], value: null},
                ]);
            });

            expect(queryResult.isValid).toBe(false);
        });

        it('flips to false when the origin field is deleted', () => {
            const {queryResult} = setupValidQuery();

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked'],
                        value: null,
                    },
                ]);
            });

            expect(queryResult.isValid).toBe(false);
        });

        it('flips to false when the origin field is retyped away from MULTIPLE_RECORD_LINKS', () => {
            const {queryResult} = setupValidQuery();

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked', 'type'],
                        value: 'singleLineText',
                    },
                ]);
            });

            expect(queryResult.isValid).toBe(false);
        });

        it('flips to false when the linked table is deleted', () => {
            const {queryResult} = setupValidQuery();

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {path: ['tablesById', 'tblSecond'], value: null},
                ]);
            });

            expect(queryResult.isValid).toBe(false);
        });

        it("flips to false when the origin field's linkedTableId drifts", () => {
            const {queryResult} = setupValidQuery();

            act(() => {
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
                        value: 'tblFirst',
                    },
                ]);
            });

            expect(queryResult.isValid).toBe(false);
        });

        it('latches: once false, stays false even if the invalidating condition is reversed', () => {
            const {queryResult} = setupValidQuery();

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {path: ['tablesById', 'tblFirst', 'recordsById', 'recA'], value: null},
                ]);
            });
            expect(queryResult.isValid).toBe(false);

            act(() => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'recordsById', 'recA'],
                        value: {
                            id: 'recA',
                            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
                            createdTime: '2020-01-01T00:00:00.000Z',
                        },
                    },
                ]);
            });
            expect(queryResult.isValid).toBe(false);
        });
    });

    it('dedupes duplicate field ids at normalization so equivalent opts share the pool', () => {
        makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const originField = firstTable.getFieldById('fld1stLinked');

        const qr1 = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary', 'fld2ndSecondary'],
        });
        const qr2 = originRecord.selectLinkedRecordsFromCell(originField, {
            fields: ['fld2ndPrimary', 'fld2ndSecondary', 'fld2ndPrimary'],
        });
        expect(qr2).toBe(qr1);
        expect(qr1._normalizedOpts.fieldIdsOrNullIfAllFields).toEqual([
            'fld2ndPrimary',
            'fld2ndSecondary',
        ]);
    });

    it('throws when called with a non-MULTIPLE_RECORD_LINKS field', () => {
        makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
        const originRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;
        const nonLinkField = firstTable.getFieldById('fld1stPrimary');

        expect(() => originRecord.selectLinkedRecordsFromCell(nonLinkField)).toThrow(
            /MULTIPLE_RECORD_LINKS/,
        );
        expect(secondTable).toBeDefined();
    });
});
