import {act, cleanup} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Table} from '../../../src/interface/models/table';
import {type Record} from '../../../src/interface/models/record';
import {type FieldId, type RecordId} from '../../../src/shared/types/hyper_ids';
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

describe('TableQueryResult', () => {
    let sdk: InterfaceBlockSdk;
    let table: Table;

    /** Compute the __poolKey TableQueryResult will produce for these opts. */
    const tableKey = (
        tableId: string,
        fieldIds: Array<FieldId> | null,
        recordIds: Array<RecordId> | null = null,
    ): string =>
        JSON.stringify([
            'table',
            tableId,
            fieldIds === null ? null : [...fieldIds].sort(),
            recordIds === null ? null : [...recordIds].sort(),
        ]);

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

    it('returns the same instance for identical opts (pool hit)', () => {
        const qr1 = table.selectRecords({fields: ['fld1stPrimary']});
        const qr2 = table.selectRecords({fields: ['fld1stPrimary']});
        expect(qr2).toBe(qr1);
    });

    it('returns a different instance for a different table', () => {
        const otherTable = sdk.base.getTableByName('Second Table');
        const qr1 = table.selectRecords({fields: ['fld1stPrimary']});
        const qr2 = otherTable.selectRecords({fields: ['fld2ndPrimary']});
        expect(qr2).not.toBe(qr1);
        expect(qr1.parentTable).toBe(table);
        expect(qr2.parentTable).toBe(otherTable);
    });

    it('different tables use separate __tableQueryResultPool instances', () => {
        const otherTable = sdk.base.getTableByName('Second Table');
        expect(table.__tableQueryResultPool).not.toBe(otherTable.__tableQueryResultPool);
    });

    it('_loadDataAsync strong-registers and _unloadData strong-unregisters via the pool', async () => {
        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        const key = qr.__poolKey;
        expect(key).toBe(tableKey('tblFirst', ['fld1stPrimary']));

        expect(table.__tableQueryResultPool._objectsByKey[key]).toBeUndefined();

        await act(async () => {
            await qr.loadDataAsync();
        });

        const strongEntry = table.__tableQueryResultPool._objectsByKey[key];
        expect(strongEntry).toBeDefined();
        expect(strongEntry).toContain(qr);

        act(() => {
            qr.unloadData();
        });

        expect(table.__tableQueryResultPool._objectsByKey[key]).toContain(qr);

        await flushUnloadTimeoutAsync();

        expect(table.__tableQueryResultPool._objectsByKey[key]).toBeUndefined();
    });

    it('_unloadData is safe to run on a failed-load instance', async () => {
        (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(async () => {
            throw spawnError('host rejected');
        });

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        const key = qr.__poolKey;

        await expect(qr.loadDataAsync()).rejects.toThrow('host rejected');

        expect(table.__tableQueryResultPool._objectsByKey[key]).toContain(qr);

        act(() => {
            qr.unloadData();
        });

        await expect(flushUnloadTimeoutAsync()).resolves.not.toThrow();

        expect(table.__tableQueryResultPool._objectsByKey[key]).toBeUndefined();
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({key});
    });

    it('a retry after a host-load rejection actually re-issues the load', async () => {
        let callCount = 0;
        (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(async () => {
            callCount++;
            if (callCount === 1) {
                throw spawnError('host rejected');
            }
        });

        const qr = table.selectRecords({fields: ['fld1stPrimary']});

        await expect(qr.loadDataAsync()).rejects.toThrow('host rejected');

        await expect(qr.loadDataAsync()).resolves.toBeUndefined();
        expect(callCount).toBe(2);
        expect(qr.isDataLoaded).toBe(true);
    });

    it('same fields, different recordIds -> different pool instances', () => {
        const qrA = table.selectRecords({fields: ['fld1stPrimary'], records: ['recA']});
        const qrB = table.selectRecords({fields: ['fld1stPrimary'], records: ['recB']});
        expect(qrB).not.toBe(qrA);
        expect(qrA.__poolKey).toBe(tableKey('tblFirst', ['fld1stPrimary'], ['recA']));
        expect(qrB.__poolKey).toBe(tableKey('tblFirst', ['fld1stPrimary'], ['recB']));
    });

    it('recordIds accepting Record instances or raw ids yields the same pool key', () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const recordStore = sdk.base.__getRecordStore('tblFirst');
        const recA = recordStore.getRecordByIdIfExists('recA') as Record;
        expect(recA).not.toBeNull();

        const qrFromRecord = table.selectRecords({
            fields: ['fld1stPrimary'],
            records: [recA],
        });
        const qrFromId = table.selectRecords({
            fields: ['fld1stPrimary'],
            records: ['recA'],
        });
        expect(qrFromRecord).toBe(qrFromId);
    });

    it('load passes recordIds through to the host', async () => {
        const qr = table.selectRecords({
            fields: ['fld1stPrimary'],
            records: ['recA', 'recB'],
        });
        await act(async () => {
            await qr.loadDataAsync();
        });
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith({
            key: tableKey('tblFirst', ['fld1stPrimary'], ['recA', 'recB']),
            tableId: 'tblFirst',
            fieldIds: ['fld1stPrimary'],
            recordIds: ['recA', 'recB'],
        });
    });

    it('selectRecords() with no `fields` materializes all current field ids in the host call', async () => {
        const qr = table.selectRecords();
        await act(async () => {
            await qr.loadDataAsync();
        });
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith({
            key: tableKey('tblFirst', null, null),
            tableId: 'tblFirst',
            fieldIds: ['fld1stPrimary', 'fld1stLinked', 'fldMockLookup'],
            recordIds: null,
        });
    });

    it('delayed unload dedups: load then quick unload/reload calls host once', async () => {
        const qr1 = table.selectRecords({fields: ['fld1stPrimary']});

        await act(async () => {
            await qr1.loadDataAsync();
        });
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        act(() => {
            qr1.unloadData();
        });

        const qr2 = table.selectRecords({fields: ['fld1stPrimary']});
        expect(qr2).toBe(qr1);

        await act(async () => {
            await qr2.loadDataAsync();
        });

        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(2000);
        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
    });

    it('does not fire when a cell changes for a record outside its own result set', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qrA = table.selectRecords({fields: ['fld1stPrimary'], records: ['recA']});
        const qrB = table.selectRecords({fields: ['fld1stPrimary'], records: ['recB']});

        baseData.tablesById.tblFirst.dynamicQueriesByKey[qrA.__poolKey] = {
            recordOrder: ['recA'],
        };
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qrB.__poolKey] = {
            recordOrder: ['recB'],
        };

        await act(async () => {
            await qrA.loadDataAsync();
            await qrB.loadDataAsync();
        });

        const qrACellValuesHandler = jest.fn();
        const qrARecordsHandler = jest.fn();
        const qrBCellValuesHandler = jest.fn();
        const qrBRecordsHandler = jest.fn();
        qrA.watch('cellValues', qrACellValuesHandler);
        qrA.watch('records', qrARecordsHandler);
        qrB.watch('cellValues', qrBCellValuesHandler);
        qrB.watch('records', qrBRecordsHandler);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recB',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Robert',
                },
            ]);
        });

        expect(qrBCellValuesHandler).toHaveBeenCalled();
        expect(qrBRecordsHandler).toHaveBeenCalled();
        expect(qrACellValuesHandler).not.toHaveBeenCalled();
        expect(qrARecordsHandler).not.toHaveBeenCalled();
    });

    it('cell-value membership cache is invalidated when the result set changes', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const cellValuesHandler = jest.fn();
        qr.watch('cellValues', cellValuesHandler);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recA',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Alicia',
                },
            ]);
        });
        expect(cellValuesHandler).toHaveBeenCalledTimes(1);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        qr.__poolKey,
                        'recordOrder',
                    ],
                    value: ['recA', 'recB'],
                },
            ]);
        });

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recB',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Robert',
                },
            ]);
        });
        expect(cellValuesHandler).toHaveBeenCalledTimes(2);
    });

    it('unwatches every field registered at load time, even if a field is deleted before unload', async () => {
        const qr = table.selectRecords({fields: ['fld1stPrimary', 'fld1stLinked']});
        const recordStore = sdk.base.__getRecordStore('tblFirst');

        await act(async () => {
            await qr.loadDataAsync();
        });

        expect(recordStore._changeWatchersByKey['cellValuesInField:fld1stPrimary']).toBeDefined();
        expect(recordStore._changeWatchersByKey['cellValuesInField:fld1stLinked']).toBeDefined();

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'fieldsById', 'fld1stLinked'],
                    value: null,
                },
            ]);
        });

        act(() => {
            qr.unloadData();
        });
        await flushUnloadTimeoutAsync();

        expect(recordStore._changeWatchersByKey['cellValuesInField:fld1stPrimary']).toBeUndefined();

        expect(recordStore._changeWatchersByKey['cellValuesInField:fld1stLinked']).toBeUndefined();
    });

    it("only fires 'records' change events for its own query key (cross-query isolation)", async () => {
        const qrA = table.selectRecords({fields: ['fld1stPrimary']});
        const qrB = table.selectRecords({fields: ['fld1stLinked']});
        await act(async () => {
            await qrA.loadDataAsync();
            await qrB.loadDataAsync();
        });

        const qrAOnChange = jest.fn();
        const qrBOnChange = jest.fn();
        qrA.watch('records', qrAOnChange);
        qrB.watch('records', qrBOnChange);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        qrB.__poolKey,
                        'recordOrder',
                    ],
                    value: ['recX'],
                },
            ]);
        });

        expect(qrBOnChange).toHaveBeenCalled();
        expect(qrAOnChange).not.toHaveBeenCalled();
    });

    it('fires cellValues for a record added to the result set in the same batch as the cell-value change', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const cellValuesHandler = jest.fn();
        qr.watch('cellValues', cellValuesHandler);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recA',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Alicia',
                },
            ]);
        });
        expect(cellValuesHandler).toHaveBeenCalledTimes(1);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'recB',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Bob',
                },
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'dynamicQueriesByKey',
                        qr.__poolKey,
                        'recordOrder',
                    ],
                    value: ['recA', 'recB'],
                },
            ]);
        });

        expect(cellValuesHandler).toHaveBeenCalledTimes(2);
    });

    it('every Record property is explicitly classified for the proxy gate', () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');
        const rawRecord = sdk.base
            .__getRecordStore('tblFirst')
            .getRecordByIdIfExists('recA') as Record;

        const props = new Set<string>();
        for (const name of Object.getOwnPropertyNames(rawRecord)) {
            props.add(name);
        }
        let proto: object | null = Object.getPrototypeOf(rawRecord);
        while (proto !== null && proto !== Object.prototype) {
            for (const name of Object.getOwnPropertyNames(proto)) {
                if (name === 'constructor') {
                    continue;
                }
                props.add(name);
            }
            proto = Object.getPrototypeOf(proto);
        }

        const GATED = [
            'getCellValue',
            'getCellValueAsString',
            'fetchForeignRecordsAsync',
            'selectLinkedRecordsFromCell',
            'selectLinkedRecordsFromCellAsync',
        ];
        const DENIED = ['_data', '_baseData', '_getRawCellValue'];
        const PASS_THROUGH = [
            '__getWatchableKey',
            '__triggerOnChangeForDirtyPaths',
            '_changeCount',
            '_changeWatchersByKey',
            '_getWatchableValidKeysOrThrow',
            '_id',
            '_isDeleted',
            '_onChange',
            '_sdk',
            '_spawnErrorForDeletion',
            '_watchableId',
            'id',
            'isDeleted',
            'toString',
            'unwatch',
            'watch',
            '_dataOrNullIfDeleted',
            '_getFieldMatching',
            '_parentRecordStore',
            '_parentTable',
            'commentCount',
            'createdTime',
            'getAttachmentClientUrlFromCellValueUrl',
            'name',
            'parentTable',
            '__linkedRecordsQueryResultPool',
            '_linkedRecordsQueryResultPool',
        ];

        const classified = new Set([...GATED, ...DENIED, ...PASS_THROUGH]);
        const unclassified = [...props].filter((p) => !classified.has(p)).sort();
        expect(unclassified).toStrictEqual([]);
    });

    it('proxy denies direct access to internal cell-data accessors', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const proxied = qr.records[0];

        expect(() => (proxied as Record & {_data: unknown})._data).toThrowError(
            /Direct access to _data/,
        );
        expect(() => (proxied as Record & {_baseData: unknown})._baseData).toThrowError(
            /Direct access to _baseData/,
        );
        expect(() =>
            (proxied as Record & {_getRawCellValue: (f: unknown) => unknown})._getRawCellValue(
                table.getFieldById('fld1stPrimary'),
            ),
        ).toThrowError(/Direct access to _getRawCellValue/);

        expect(() => proxied.getCellValue('fld1stPrimary')).not.toThrow();
    });

    it('proxy hides denied props from property enumeration (does not break dev tooling)', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const proxied = qr.records[0];

        expect('_data' in proxied).toBe(false);
        expect('_baseData' in proxied).toBe(false);
        expect('_getRawCellValue' in proxied).toBe(false);

        expect(Object.keys(proxied)).not.toContain('_data');
        expect(Object.keys(proxied)).not.toContain('_baseData');
        expect(Object.getOwnPropertyNames(proxied)).not.toContain('_data');
        expect(Object.getOwnPropertyNames(proxied)).not.toContain('_baseData');

        expect(Object.getOwnPropertyDescriptor(proxied, '_data')).toBeUndefined();
        expect(Object.getOwnPropertyDescriptor(proxied, '_baseData')).toBeUndefined();

        const seenKeys: Array<string> = [];
        expect(() => {
            // eslint-disable-next-line guard-for-in
            for (const key in proxied) {
                seenKeys.push(key);
            }
        }).not.toThrow();
        expect(seenKeys).not.toContain('_data');
        expect(seenKeys).not.toContain('_baseData');
        expect(seenKeys).not.toContain('_getRawCellValue');
    });

    it('proxy methods are bound to the receiver, not the raw target', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const proxied = qr.records[0];
        const proto = Object.getPrototypeOf(proxied);
        let capturedThis: unknown = null;
        proto._testCaptureThis = function (this: unknown) {
            // eslint-disable-next-line consistent-this
            capturedThis = this;
        };
        try {
            (proxied as Record & {_testCaptureThis: () => void})._testCaptureThis();
        } finally {
            delete proto._testCaptureThis;
        }

        expect(capturedThis).toBe(proxied);
    });

    it('cell-value handler is a no-op before isDataLoaded flips (avoids recordIds invariant)', () => {
        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        expect(qr.isDataLoaded).toBe(false);
        expect(() =>
            qr._onRecordStoreCellValuesChanged(null, 'cellValuesInField:fld1stPrimary', ['recA']),
        ).not.toThrow();
    });

    it('fires per-query event when the host replaces the whole dynamicQueriesByKey entry', async () => {
        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        await act(async () => {
            await qr.loadDataAsync();
        });

        const recordsHandler = jest.fn();
        qr.watch('records', recordsHandler);

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'dynamicQueriesByKey', qr.__poolKey],
                    value: {recordOrder: ['recX']},
                },
            ]);
        });

        expect(recordsHandler).toHaveBeenCalled();
    });

    it('getRecordById / getRecordByIdIfExists look up records in the result set', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const hit = qr.getRecordById('recA');
        expect(hit.id).toBe('recA');
        expect(qr.getRecordByIdIfExists('recA')?.id).toBe('recA');

        expect(qr.getRecordByIdIfExists('recMissing')).toBeNull();
        expect(() => qr.getRecordById('recMissing')).toThrowError(
            /No record with ID recMissing in this query result/,
        );
    });

    it('hasRecord returns false for an optimistically-deleted record (cache invalidated)', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA', 'recB'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        expect(qr.hasRecord('recA')).toBe(true);
        expect(qr.hasRecord('recB')).toBe(true);

        const deletePromise = table.deleteRecordAsync('recA');
        expect(qr.hasRecord('recA')).toBe(false);
        expect(qr.hasRecord('recB')).toBe(true);
        await deletePromise;
    });

    it('fires recordIds / records watchers on optimistic delete (before host syncs recordOrder)', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA', 'recB'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const recordsHandler = jest.fn();
        const recordIdsHandler = jest.fn();
        qr.watch('records', recordsHandler);
        qr.watch('recordIds', recordIdsHandler);

        const deletePromise = table.deleteRecordAsync('recA');
        expect(recordsHandler).toHaveBeenCalled();
        expect(recordIdsHandler).toHaveBeenCalled();
        await deletePromise;
    });

    it('records getter does not crash when a record is deleted before recordOrder is synced', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA', 'recB'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const deletePromise = table.deleteRecordAsync('recA');
        expect(() => qr.records).not.toThrow();
        expect(qr.records.map((r) => r.id)).toEqual(['recB']);
        expect(qr.recordIds).toEqual(['recB']);
        await deletePromise;
    });

    it('hasRecord / getRecordByIdIfExists scope the lookup to this query result', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordsById.recB = {
            id: 'recB',
            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA', 'recB');

        const qrA = table.selectRecords({fields: ['fld1stPrimary'], records: ['recA']});
        const qrB = table.selectRecords({fields: ['fld1stPrimary'], records: ['recB']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qrA.__poolKey] = {
            recordOrder: ['recA'],
        };
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qrB.__poolKey] = {
            recordOrder: ['recB'],
        };
        await act(async () => {
            await qrA.loadDataAsync();
            await qrB.loadDataAsync();
        });

        expect(qrA.hasRecord('recA')).toBe(true);
        expect(qrA.hasRecord('recB')).toBe(false);
        expect(qrA.getRecordByIdIfExists('recB')).toBeNull();
        expect(() => qrA.getRecordById('recB')).toThrowError(
            /No record with ID recB in this query result/,
        );

        const rawRecB = sdk.base.__getRecordStore('tblFirst').getRecordByIdIfExists('recB');
        expect(rawRecB).not.toBeNull();
        expect(qrA.hasRecord(rawRecB as Record)).toBe(false);
        expect(qrB.hasRecord(rawRecB as Record)).toBe(true);
    });

    it('canonicalizes field order at normalization: `.fields` reflects sorted ids, not caller order', () => {
        const qr1 = table.selectRecords({fields: ['fldMockLookup', 'fld1stPrimary']});
        const qr2 = table.selectRecords({fields: ['fld1stPrimary', 'fldMockLookup']});
        expect(qr2).toBe(qr1);

        expect(qr1.fields?.map((f) => f.id)).toEqual(['fld1stPrimary', 'fldMockLookup']);
    });

    it('dedupes duplicate field ids at normalization so equivalent opts share the pool', () => {
        const qr1 = table.selectRecords({fields: ['fld1stPrimary', 'fldMockLookup']});
        const qr2 = table.selectRecords({
            fields: ['fld1stPrimary', 'fldMockLookup', 'fld1stPrimary'],
        });
        expect(qr2).toBe(qr1);
        expect(qr1._normalizedOpts.fieldIdsOrNullIfAllFields).toEqual([
            'fld1stPrimary',
            'fldMockLookup',
        ]);
    });

    it('dedupes duplicate record ids at normalization so equivalent opts share the pool', () => {
        const qr1 = table.selectRecords({records: ['recA', 'recB']});
        const qr2 = table.selectRecords({records: ['recA', 'recB', 'recA']});
        expect(qr2).toBe(qr1);
        expect(qr1._normalizedOpts.recordIdsOrNullIfAllRecords).toEqual(['recA', 'recB']);
    });

    it('canonicalizes record-id order at normalization', () => {
        const qr1 = table.selectRecords({records: ['recZ', 'recA']});
        const qr2 = table.selectRecords({records: ['recA', 'recZ']});
        expect(qr2).toBe(qr1);

        expect(qr1._normalizedOpts.recordIdsOrNullIfAllRecords).toEqual(['recA', 'recZ']);
    });

    it('proxy gates getCellValue / getCellValueAsString / fetchForeignRecordsAsync on declared fields', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const proxied = qr.records[0];
        const linkedField = table.getFieldById('fld1stLinked');

        expect(() => proxied.getCellValue(linkedField)).toThrowError(
            /fld1stLinked was not declared in this query result's fields/,
        );
        expect(() => proxied.getCellValueAsString(linkedField)).toThrowError(
            /fld1stLinked was not declared in this query result's fields/,
        );
        expect(() => proxied.fetchForeignRecordsAsync(linkedField, '')).toThrowError(
            /fld1stLinked was not declared in this query result's fields/,
        );

        expect(() => proxied.getCellValue('fld1stPrimary')).not.toThrow();
        expect(() => proxied.getCellValueAsString('fld1stPrimary')).not.toThrow();
    });

    it('proxy does NOT gate inherited getters that read primary-field cells (record.name)', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stLinked']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        expect(qr.fields?.map((f) => f.id)).toEqual(['fld1stLinked', 'fld1stPrimary']);

        const proxied = qr.records[0];
        expect(() => proxied.name).not.toThrow();
        expect(typeof proxied.name).toBe('string');
    });

    it('proxy gates selectLinkedRecordsFromCell on the origin field', async () => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        baseData.tablesById.tblFirst.recordsById.recA = {
            id: 'recA',
            cellValuesByFieldId: {fld1stPrimary: 'Alice'},
            createdTime: '2020-01-01T00:00:00.000Z',
        };
        baseData.tablesById.tblFirst.recordOrder.push('recA');

        const qr = table.selectRecords({fields: ['fld1stPrimary']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr.loadDataAsync();
        });

        const proxied = qr.records[0];
        const linkedField = table.getFieldById('fld1stLinked');

        expect(() => proxied.selectLinkedRecordsFromCell(linkedField)).toThrowError(
            /fld1stLinked was not declared in this query result's fields/,
        );
        expect(() => proxied.selectLinkedRecordsFromCellAsync(linkedField)).toThrowError(
            /fld1stLinked was not declared in this query result's fields/,
        );

        const qr2 = table.selectRecords({fields: ['fld1stPrimary', 'fld1stLinked']});
        baseData.tablesById.tblFirst.dynamicQueriesByKey[qr2.__poolKey] = {
            recordOrder: ['recA'],
        };
        await act(async () => {
            await qr2.loadDataAsync();
        });
        const proxied2 = qr2.records[0];
        expect(() => proxied2.selectLinkedRecordsFromCell(linkedField)).not.toThrow();
    });
});
