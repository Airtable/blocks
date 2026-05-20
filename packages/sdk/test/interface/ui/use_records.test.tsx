import React from 'react';
import {act, render, cleanup} from '@testing-library/react';
import {useRecords} from '../../../src/interface/ui/use_records';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Record} from '../../../src/interface/models/record';
import {type RecordQueryResult} from '../../../src/interface/models/record_query_result';
import {type Table} from '../../../src/interface/models/table';
import {type FieldId, type RecordId} from '../../../src/shared/types/hyper_ids';
import {type ObjectMap} from '../../../src/shared/private_utils';
import {BlockWrapper} from '../../../src/interface/ui/block_wrapper';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
    state = {error: null as Error | null};
    static getDerivedStateFromError(error: Error) {
        return {error};
    }
    render() {
        if (this.state.error) {
            return <span>error: {this.state.error.message}</span>;
        }
        return this.props.children;
    }
}

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
 * `useLoadable` retains the model twice when suspending: once from the throw
 * path (released by SUSPENSE_CLEAN_UP_MS=60000ms) and once from `useEffect`
 * (released on unmount). Only after both releases does `unloadData` schedule
 * the subclass's `_unloadData` via a __DATA_UNLOAD_DELAY_MS=1000ms timer.
 * Advance past both so the host's `unloadDynamicQuery` spy records the call.
 */
async function flushUnloadTimeoutAsync() {
    await act(async () => {
        jest.advanceTimersByTime(61000);
        await tickAsync();
    });
}

describe('useRecords', () => {
    let sdk: InterfaceBlockSdk;
    let table: Table;

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
     * response to a loadDynamicQueryAsync call. Seed before mounting so the
     * query result's `recordIds` getter returns these IDs.
     */
    const seedDynamicQuery = (tableId: string, key: string, recordIds: Array<RecordId>) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById[tableId];
        parentTableData.dynamicQueriesByKey[key] = {recordOrder: recordIds};
    };

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
        jest.advanceTimersByTime(62000);
        mockAirtableInterface.reset();
    });

    describe('with a Table', () => {
        it('eventually returns all records from a table', async () => {
            makeRecord('tblFirst', 'recA', {}, '2020-11-19T20:51:04.281Z');
            makeRecord('tblFirst', 'recB', {}, '2020-11-19T20:51:04.281Z');
            makeRecord('tblFirst', 'recC', {}, '2020-11-19T20:51:04.281Z');
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), [
                'recA',
                'recB',
                'recC',
            ]);

            let capturedRecords: Record[] = [];
            const Component = ({table: t}: {table: Table}) => {
                capturedRecords = useRecords(t);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component table={table} />
                    </BlockWrapper>,
                );
            });

            const ids = capturedRecords.map(({id}) => id).sort();
            expect(ids).toStrictEqual(['recA', 'recB', 'recC']);
        });
    });

    describe('with a RecordQueryResult', () => {
        it('calls loadDynamicQueryAsync on mount with the correct args', async () => {
            const Component = () => {
                useRecords(table.selectRecords({fields: ['fld1stPrimary']}));
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith({
                key: tableKey('tblFirst', ['fld1stPrimary']),
                tableId: 'tblFirst',
                fieldIds: ['fld1stPrimary'],
                recordIds: null,
            });
        });

        it('calls unloadDynamicQuery on unmount with the correct key', async () => {
            const Component = () => {
                useRecords(table.selectRecords({fields: ['fld1stPrimary']}));
                return <div />;
            };

            let unmount: () => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
                unmount = result.unmount;
            });

            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

            act(() => {
                unmount!();
            });

            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
            await flushUnloadTimeoutAsync();

            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblFirst', ['fld1stPrimary']),
            });
        });

        it('returns records from the RecordStore after loading', async () => {
            makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblFirst', 'recB', {fld1stPrimary: 'Bob'}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', tableKey('tblFirst', ['fld1stPrimary']), ['recA', 'recB']);

            let capturedRecords: Record[] = [];
            const Component = () => {
                capturedRecords = useRecords(table.selectRecords({fields: ['fld1stPrimary']}));
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            const ids = capturedRecords.map(({id}) => id).sort();
            expect(ids).toStrictEqual(['recA', 'recB']);
        });

        it('returns all records when fields is omitted', async () => {
            makeRecord('tblFirst', 'recA', {}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblFirst', 'recB', {}, '2020-01-01T00:00:00.000Z');
            const keyForAllFields = tableKey('tblFirst', null);
            seedDynamicQuery('tblFirst', keyForAllFields, ['recA', 'recB']);

            let capturedRecords: Record[] = [];
            const Component = () => {
                capturedRecords = useRecords(table.selectRecords());
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(capturedRecords).toHaveLength(2);
        });

        it('unloads old query and loads new query when fields change', async () => {
            const Component = ({fields}: {fields: Array<string>}) => {
                useRecords(table.selectRecords({fields}));
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component fields={['fld1stPrimary']} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component fields={['fld1stLinked']} />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith({
                key: tableKey('tblFirst', ['fld1stLinked', 'fld1stPrimary']),
                tableId: 'tblFirst',
                fieldIds: ['fld1stLinked', 'fld1stPrimary'],
                recordIds: null,
            });

            await flushUnloadTimeoutAsync();
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblFirst', ['fld1stPrimary']),
            });
        });

        it('re-renders when dynamicQueriesByKey changes via model updates', async () => {
            const key = tableKey('tblFirst', ['fld1stPrimary']);
            makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', key, ['recA']);

            let capturedRecords: Record[] = [];
            const Component = () => {
                capturedRecords = useRecords(table.selectRecords({fields: ['fld1stPrimary']}));
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(capturedRecords).toHaveLength(1);

            await act(async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'recordsById', 'recB'],
                        value: {
                            id: 'recB',
                            cellValuesByFieldId: {fld1stPrimary: 'Bob'},
                            createdTime: '2020-01-01T00:00:00.000Z',
                        },
                    },
                    {
                        path: ['tablesById', 'tblFirst', 'dynamicQueriesByKey', key, 'recordOrder'],
                        value: ['recA', 'recB'],
                    },
                ]);
                await tickAsync();
            });

            expect(capturedRecords).toHaveLength(2);
        });

        it('does not reload when fields are the same but in different order (pool dedup)', async () => {
            const Component = ({fields}: {fields: Array<string>}) => {
                useRecords(table.selectRecords({fields}));
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component fields={['fld1stPrimary', 'fld1stLinked']} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component fields={['fld1stLinked', 'fld1stPrimary']} />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
        });
    });

    describe('with null', () => {
        const useRecordsCompat = useRecords as (
            arg: Table | RecordQueryResult | null,
        ) => Array<Record> | null;

        it('returns null without loading anything', async () => {
            let captured: Array<Record> | null = [];
            const Component = () => {
                captured = useRecords(null);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toBeNull();
            expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
        });

        it('loads when arg flips from null to a query result', async () => {
            const key = tableKey('tblFirst', ['fld1stPrimary']);
            makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', key, ['recA']);

            let captured: Array<Record> | null = [];
            const Component = ({enabled}: {enabled: boolean}) => {
                captured = useRecordsCompat(
                    enabled ? table.selectRecords({fields: ['fld1stPrimary']}) : null,
                );
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component enabled={false} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(captured).toBeNull();
            expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component enabled={true} />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith({
                key,
                tableId: 'tblFirst',
                fieldIds: ['fld1stPrimary'],
                recordIds: null,
            });
            expect(captured).not.toBeNull();
            expect((captured as Array<Record>).map(({id}) => id)).toStrictEqual(['recA']);
        });

        it('unloads when arg flips from a query result to null', async () => {
            const key = tableKey('tblFirst', ['fld1stPrimary']);
            const Component = ({enabled}: {enabled: boolean}) => {
                useRecordsCompat(enabled ? table.selectRecords({fields: ['fld1stPrimary']}) : null);
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component enabled={true} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component enabled={false} />
                    </BlockWrapper>,
                );
            });

            await flushUnloadTimeoutAsync();
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({key});
        });
    });

    describe('with a Table and opts', () => {
        it('calls loadDynamicQueryAsync with a fields-scoped key', async () => {
            const Component = () => {
                useRecords(table, {fields: ['fld1stPrimary']});
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith({
                key: tableKey('tblFirst', ['fld1stPrimary']),
                tableId: 'tblFirst',
                fieldIds: ['fld1stPrimary'],
                recordIds: null,
            });
        });

        it('returns the records selected by the opts', async () => {
            const key = tableKey('tblFirst', ['fld1stPrimary']);
            makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblFirst', 'recB', {fld1stPrimary: 'Bob'}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', key, ['recA', 'recB']);

            let captured: Array<Record> = [];
            const Component = () => {
                captured = useRecords(table, {fields: ['fld1stPrimary']});
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured.map(({id}) => id).sort()).toStrictEqual(['recA', 'recB']);
        });

        it('passes recordIds opt through to loadDynamicQueryAsync', async () => {
            const Component = () => {
                useRecords(table, {records: ['recA']});
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: tableKey('tblFirst', null, ['recA']),
                    tableId: 'tblFirst',
                    recordIds: ['recA'],
                }),
            );
        });

        it('throws when opts is passed with a RecordQueryResult', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const Component = () => {
                useRecords(table.selectRecords(), {fields: ['fld1stPrimary']});
                return <div />;
            };

            let container: HTMLElement;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <ErrorBoundary>
                            <Component />
                        </ErrorBoundary>
                    </BlockWrapper>,
                );
                container = result.container;
            });

            expect(container!.textContent).toContain(
                'useRecords does not support passing both a queryResult and opts.',
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe('with an array', () => {
        let secondTable: Table;
        beforeEach(() => {
            secondTable = sdk.base.getTableByName('Second Table');
        });

        it('returns one entry per slot, preserving order', async () => {
            makeRecord('tblFirst', 'recA1', {}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblFirst', 'recA2', {}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblSecond', 'recB1', {}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), ['recA1', 'recA2']);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), ['recB1']);

            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([table, secondTable]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toHaveLength(2);
            expect((captured[0] as Array<Record>).map(({id}) => id).sort()).toStrictEqual([
                'recA1',
                'recA2',
            ]);
            expect((captured[1] as Array<Record>).map(({id}) => id)).toStrictEqual(['recB1']);
        });

        it('starts every slot loading before any has resolved (parallel)', async () => {
            (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(
                () => new Promise<void>(() => {}),
            );

            const Component = () => {
                useRecords([table, secondTable]);
                return <div />;
            };

            render(
                <BlockWrapper sdk={sdk}>
                    <Component />
                </BlockWrapper>,
            );

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({tableId: 'tblFirst'}),
            );
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({tableId: 'tblSecond'}),
            );
        });

        it('serial regression: separate useRecords calls only fire one host call per render', async () => {
            (mockAirtableInterface.loadDynamicQueryAsync as jest.Mock).mockImplementation(
                () => new Promise<void>(() => {}),
            );

            const Component = () => {
                useRecords(table);
                useRecords(secondTable);
                return <div />;
            };

            render(
                <BlockWrapper sdk={sdk}>
                    <Component />
                </BlockWrapper>,
            );

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
        });

        it('preserves null entries positionally without loading them', async () => {
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), []);

            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([table, null, table]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toHaveLength(3);
            expect(Array.isArray(captured[0])).toBe(true);
            expect(captured[1]).toBeNull();
            expect(Array.isArray(captured[2])).toBe(true);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
        });

        it('accepts a mix of Tables and pre-built RecordQueryResults', async () => {
            makeRecord('tblFirst', 'recA1', {fld1stPrimary: 'A'}, '2020-01-01T00:00:00.000Z');
            makeRecord('tblSecond', 'recB1', {}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', tableKey('tblFirst', ['fld1stPrimary']), ['recA1']);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), ['recB1']);

            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([
                    table.selectRecords({fields: ['fld1stPrimary']}),
                    secondTable,
                ]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect((captured[0] as Array<Record>).map(({id}) => id)).toStrictEqual(['recA1']);
            expect((captured[1] as Array<Record>).map(({id}) => id)).toStrictEqual(['recB1']);
        });

        it('returns [] for an empty array without loading anything', async () => {
            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toStrictEqual([]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
        });

        it('returns all-null output for all-null input without loading anything', async () => {
            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([null, null]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toStrictEqual([null, null]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
        });

        it('toggles a conditional slot between null and a query result cleanly', async () => {
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), []);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), []);

            const Component = ({showSecond}: {showSecond: boolean}) => {
                useRecords([table, showSecond ? secondTable : null]);
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component showSecond={false} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({tableId: 'tblFirst'}),
            );

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component showSecond={true} />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenLastCalledWith(
                expect.objectContaining({tableId: 'tblSecond'}),
            );

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component showSecond={false} />
                    </BlockWrapper>,
                );
            });

            await flushUnloadTimeoutAsync();
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblSecond', null, null),
            });
            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalledWith({
                key: tableKey('tblFirst', null, null),
            });
        });

        it('throws when opts is passed alongside an array', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const Component = () => {
                useRecords([table], {fields: ['fld1stPrimary']});
                return <div />;
            };

            let container: HTMLElement;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <ErrorBoundary>
                            <Component />
                        </ErrorBoundary>
                    </BlockWrapper>,
                );
                container = result.container;
            });

            expect(container!.textContent).toContain(
                'useRecords does not support passing opts together with an array of items.',
            );

            consoleErrorSpy.mockRestore();
        });

        it('unloads every slot on unmount', async () => {
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), []);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), []);

            const Component = () => {
                useRecords([table, secondTable]);
                return <div />;
            };

            let unmount: () => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
                unmount = result.unmount;
            });

            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

            act(() => {
                unmount!();
            });
            await flushUnloadTimeoutAsync();

            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblFirst', null, null),
            });
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblSecond', null, null),
            });
        });

        it('shrinking the array unloads the dropped slot but keeps survivors loaded', async () => {
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), []);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), []);

            const Component = ({tables}: {tables: Array<Table>}) => {
                useRecords(tables);
                return <div />;
            };

            let rerender: (ui: React.ReactElement) => void;
            await act(async () => {
                const result = render(
                    <BlockWrapper sdk={sdk}>
                        <Component tables={[table, secondTable]} />
                    </BlockWrapper>,
                );
                rerender = result.rerender;
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await act(async () => {
                rerender!(
                    <BlockWrapper sdk={sdk}>
                        <Component tables={[table]} />
                    </BlockWrapper>,
                );
            });

            await flushUnloadTimeoutAsync();
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: tableKey('tblSecond', null, null),
            });
            expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalledWith({
                key: tableKey('tblFirst', null, null),
            });
        });

        it('duplicate entries dedupe to a single host load', async () => {
            makeRecord('tblFirst', 'recA', {}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), ['recA']);

            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([table, table]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
            expect(captured).toHaveLength(2);
            expect((captured[0] as Array<Record>).map(({id}) => id)).toStrictEqual(['recA']);
            expect((captured[1] as Array<Record>).map(({id}) => id)).toStrictEqual(['recA']);
        });

        it('accepts a LinkedRecordsQueryResult alongside a Table', async () => {
            makeRecord(
                'tblFirst',
                'recA',
                {fld1stPrimary: 'Alice', fld1stLinked: [{id: 'rec2ndA'}]},
                '2020-01-01T00:00:00.000Z',
            );
            makeRecord('tblSecond', 'rec2ndA', {fld2ndPrimary: 'Anna'}, '2020-01-01T00:00:00.000Z');
            const linkedKey = JSON.stringify(['linked', 'recA', 'fld1stLinked', ['fld2ndPrimary']]);
            seedDynamicQuery('tblSecond', linkedKey, ['rec2ndA']);
            seedDynamicQuery('tblFirst', tableKey('tblFirst', null, null), ['recA']);

            const originRecord = sdk.base
                .__getRecordStore('tblFirst')
                .getRecordByIdIfExists('recA') as Record;
            const originField = table.getFieldById('fld1stLinked');

            let captured: Array<Array<Record> | null> = [];
            const Component = () => {
                captured = useRecords([
                    table,
                    originRecord.selectLinkedRecordsFromCell(originField, {
                        fields: ['fld2ndPrimary'],
                    }),
                ]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            expect(captured).toHaveLength(2);
            expect((captured[0] as Array<Record>).map(({id}) => id)).toStrictEqual(['recA']);
            expect((captured[1] as Array<Record>).map(({id}) => id)).toStrictEqual(['rec2ndA']);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({key: linkedKey}),
            );
        });

        it('re-renders when a cell value changes on any slot', async () => {
            const key = tableKey('tblFirst', ['fld1stPrimary']);
            makeRecord('tblFirst', 'recA', {fld1stPrimary: 'Alice'}, '2020-01-01T00:00:00.000Z');
            seedDynamicQuery('tblFirst', key, ['recA']);
            seedDynamicQuery('tblSecond', tableKey('tblSecond', null, null), []);

            let renderCount = 0;
            const Component = () => {
                renderCount++;
                useRecords([table.selectRecords({fields: ['fld1stPrimary']}), secondTable]);
                return <div />;
            };

            await act(async () => {
                render(
                    <BlockWrapper sdk={sdk}>
                        <Component />
                    </BlockWrapper>,
                );
            });

            const renderCountAfterMount = renderCount;

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
                await tickAsync();
            });

            expect(renderCount).toBeGreaterThan(renderCountAfterMount);
        });
    });
});
