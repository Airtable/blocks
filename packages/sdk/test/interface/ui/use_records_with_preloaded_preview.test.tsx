import React, {StrictMode, Suspense, startTransition, useLayoutEffect, useState} from 'react';
import {act, render, cleanup} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Record} from '../../../src/interface/models/record';
import {type RecordQueryResult} from '../../../src/interface/models/record_query_result';
import {type Table} from '../../../src/interface/models/table';
import {
    unstable_useRecordsWithPreloadedPreview as useRecordsWithPreloadedPreview,
    type RecordsWithPreloadedPreview,
} from '../../../src/interface/ui/use_records_with_preloaded_preview';
import {useRecords} from '../../../src/interface/ui/use_records';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {type FieldId, type RecordId, type TableId} from '../../../src/shared/types/hyper_ids';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.useFakeTimers();

const PRELOADED_RECORDS_QUERY_KEY = '__airtablePreloadedRecords';
const PRIMARY_FIELD_ID_BY_TABLE_ID: {[tableId: string]: FieldId} = {
    tblFirst: 'fld1stPrimary',
    tblSecond: 'fld2ndPrimary',
};

/** The query key of `useRecords(table)`. */
const allRecordsQueryKey = (tableId: TableId) => JSON.stringify(['table', tableId, null, null]);

async function tickAsync() {
    await new Promise((resolve) => process.nextTick(resolve));
    jest.advanceTimersByTime(0);
}

/**
 * The text a user sees. When a Suspense boundary shows its fallback, React keeps the content in
 * the DOM but hides it with `display: none`.
 */
function getVisibleText(node: Node): string {
    if (node instanceof HTMLElement && node.style.display === 'none') {
        return '';
    }
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ?? '';
    }
    return Array.from(node.childNodes).map(getVisibleText).join('');
}

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

describe('useRecordsWithPreloadedPreview', () => {
    let sdk: InterfaceBlockSdk;
    /** What each commit showed, in order. */
    let commits: Array<string>;
    let latestResult: RecordsWithPreloadedPreview | null;
    let resolveLoadByQueryKey: {[queryKey: string]: () => void};
    let rejectLoadByQueryKey: {[queryKey: string]: (error: Error) => void};

    const getTableData = (tableId: TableId) =>
        mockAirtableInterface.sdkInitData.baseData.tablesById[tableId];

    /** Adds records, and the record order the host sends once `useRecords(table)` loads. */
    const makeRecords = (tableId: TableId, count: number): Array<RecordId> => {
        const recordIds: Array<RecordId> = [];
        for (let i = 0; i < count; i++) {
            const recordId = `rec${tableId}${i}`;
            getTableData(tableId).recordsById[recordId] = {
                id: recordId,
                cellValuesByFieldId: {[PRIMARY_FIELD_ID_BY_TABLE_ID[tableId]]: `${tableId} ${i}`},
                createdTime: '2020-01-01T00:00:00.000Z',
            };
            getTableData(tableId).recordOrder.push(recordId);
            recordIds.push(recordId);
        }
        getTableData(tableId).dynamicQueriesByKey[allRecordsQueryKey(tableId)] = {
            recordOrder: recordIds,
        };
        return recordIds;
    };

    const preloadedRecordsData = (tableId: TableId, rowLimit: number) => ({
        queryKey: PRELOADED_RECORDS_QUERY_KEY,
        fieldIds: [PRIMARY_FIELD_ID_BY_TABLE_ID[tableId]],
        rowLimit,
    });

    const seedPreloadedRecords = (
        tableId: TableId,
        recordIds: Array<RecordId>,
        rowLimit: number,
    ) => {
        getTableData(tableId).dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY] = {
            recordOrder: recordIds.slice(0, rowLimit + 1),
        };
        getTableData(tableId).preloadedRecords = preloadedRecordsData(tableId, rowLimit);
    };

    const releasePreloadedRecordsAsync = async (tableId: TableId) => {
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {path: ['tablesById', tableId, 'preloadedRecords'], value: null},
                {
                    path: [
                        'tablesById',
                        tableId,
                        'dynamicQueriesByKey',
                        PRELOADED_RECORDS_QUERY_KEY,
                    ],
                    value: undefined,
                },
            ]);
            await tickAsync();
        });
    };

    const finishLoadingAsync = async (tableId: TableId) => {
        await act(async () => {
            resolveLoadByQueryKey[allRecordsQueryKey(tableId)]();
            await tickAsync();
        });
    };

    const describeResult = (result: RecordsWithPreloadedPreview | null, table: Table | null) => {
        if (result === null) {
            return 'null';
        }
        const cellValues = result.records
            .map((record) => String(record.getCellValue(table!.primaryField)))
            .join(', ');
        return `${result.isPreview ? 'preview' : 'all'}: ${cellValues}`;
    };

    const Records = ({table}: {table: Table | null}) => {
        const result = useRecordsWithPreloadedPreview(table);
        latestResult = result;
        const text = describeResult(result, table);
        useLayoutEffect(() => {
            commits.push(text);
        });
        return <span>{text}</span>;
    };

    /** `commits` without consecutive repeats, e.g. re-renders that showed the same thing. */
    const getDistinctCommits = () =>
        commits.filter((commit, index) => index === 0 || commits[index - 1] !== commit);

    const Fallback = () => {
        useLayoutEffect(() => {
            commits.push('fallback');
        });
        return <span>fallback</span>;
    };

    const renderInSuspenseAsync = async (children: React.ReactNode) => {
        let result: ReturnType<typeof render>;
        await act(async () => {
            result = render(
                <SdkContext.Provider value={sdk}>
                    <Suspense fallback={<Fallback />}>{children}</Suspense>
                </SdkContext.Provider>,
            );
        });
        return result!;
    };

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        commits = [];
        latestResult = null;
        resolveLoadByQueryKey = {};
        rejectLoadByQueryKey = {};
        mockAirtableInterface.loadDynamicQueryAsync.mockImplementation(
            ({key}) =>
                new Promise<void>((resolve, reject) => {
                    resolveLoadByQueryKey[key] = resolve;
                    rejectLoadByQueryKey[key] = reject;
                }),
        );
    });

    afterEach(async () => {
        await act(async () => {
            cleanup();
        });
        jest.advanceTimersByTime(62000);
        mockAirtableInterface.reset();
    });

    it('returns the preview on the first render, then every record once they load', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');

        const {container} = await renderInSuspenseAsync(<Records table={table} />);

        expect(commits[0]).toBe('preview: tblFirst 0, tblFirst 1');
        expect(getVisibleText(container)).toBe('preview: tblFirst 0, tblFirst 1');
        expect(latestResult).toMatchObject({isPreview: true, rowLimit: 2, hasMoreRecords: true});
        expect(latestResult!.fields.map((field) => field.id)).toStrictEqual(['fld1stPrimary']);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
            expect.objectContaining({key: allRecordsQueryKey('tblFirst')}),
        );
        await act(async () => {
            jest.advanceTimersByTime(5000);
            await tickAsync();
        });
        expect(getVisibleText(container)).toBe('preview: tblFirst 0, tblFirst 1');

        await finishLoadingAsync('tblFirst');

        expect(getVisibleText(container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(latestResult!.isPreview).toBe(false);
        expect(latestResult!.fields).toStrictEqual(table.fields);
        expect(getDistinctCommits()).toStrictEqual([
            'preview: tblFirst 0, tblFirst 1',
            'all: tblFirst 0, tblFirst 1, tblFirst 2',
        ]);
    });

    it('works without a Suspense boundary of its own', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Records table={table} />
                </SdkContext.Provider>,
            ).container;
        });
        expect(getVisibleText(container!)).toBe('preview: tblFirst 0, tblFirst 1');

        await finishLoadingAsync('tblFirst');
        expect(getVisibleText(container!)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
    });

    it('returns every record straight away when they are already loaded', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        const AlreadyLoaded = () => {
            useRecords(table);
            return null;
        };
        let rerender: ReturnType<typeof render>['rerender'];
        await act(async () => {
            rerender = render(
                <SdkContext.Provider value={sdk}>
                    <Suspense fallback={<Fallback />}>
                        <AlreadyLoaded />
                    </Suspense>
                </SdkContext.Provider>,
            ).rerender;
        });
        await finishLoadingAsync('tblFirst');
        commits = [];

        await act(async () => {
            rerender(
                <SdkContext.Provider value={sdk}>
                    <Suspense fallback={<Fallback />}>
                        <AlreadyLoaded />
                        <Records table={table} />
                    </Suspense>
                </SdkContext.Provider>,
            );
        });

        expect(getDistinctCommits()).toStrictEqual(['all: tblFirst 0, tblFirst 1, tblFirst 2']);
    });

    it('suspends like useRecords when nothing was preloaded', async () => {
        makeRecords('tblFirst', 3);
        const table = sdk.base.getTableById('tblFirst');

        const {container} = await renderInSuspenseAsync(<Records table={table} />);
        expect(getVisibleText(container)).toBe('fallback');

        await finishLoadingAsync('tblFirst');
        expect(getVisibleText(container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(getDistinctCommits()).toStrictEqual([
            'fallback',
            'all: tblFirst 0, tblFirst 1, tblFirst 2',
        ]);
    });

    it('returns null for a null table', async () => {
        await renderInSuspenseAsync(<Records table={null} />);

        expect(getDistinctCommits()).toStrictEqual(['null']);
        expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
    });

    it('suspends if the preloaded records go away before every record loads', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        const {container} = await renderInSuspenseAsync(<Records table={table} />);
        expect(getVisibleText(container)).toBe('preview: tblFirst 0, tblFirst 1');

        await releasePreloadedRecordsAsync('tblFirst');
        expect(getVisibleText(container)).toBe('fallback');

        await finishLoadingAsync('tblFirst');
        expect(getVisibleText(container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(getDistinctCommits()).toStrictEqual([
            'preview: tblFirst 0, tblFirst 1',
            'fallback',
            'all: tblFirst 0, tblFirst 1, tblFirst 2',
        ]);
    });

    it('keeps every record once loaded when the preloaded records go away', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        const {container} = await renderInSuspenseAsync(<Records table={table} />);
        await finishLoadingAsync('tblFirst');
        commits = [];

        await releasePreloadedRecordsAsync('tblFirst');

        expect(getVisibleText(container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(getDistinctCommits()).toStrictEqual(['all: tblFirst 0, tblFirst 1, tblFirst 2']);
    });

    describe('when the table changes', () => {
        let setTable: (table: Table) => void;
        const TableSwitcher = ({initialTable}: {initialTable: Table}) => {
            const [table, setTableState] = useState(initialTable);
            setTable = setTableState;
            return <Records table={table} />;
        };

        it("returns the new table's preview while its records load", async () => {
            makeRecords('tblFirst', 3);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <TableSwitcher initialTable={sdk.base.getTableById('tblFirst')} />,
            );
            await finishLoadingAsync('tblFirst');
            expect(getVisibleText(container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
            commits = [];

            await act(async () => {
                setTable(sdk.base.getTableById('tblSecond'));
                await tickAsync();
            });
            expect(getVisibleText(container)).toBe('preview: tblSecond 0');

            await finishLoadingAsync('tblSecond');
            expect(getVisibleText(container)).toBe('all: tblSecond 0, tblSecond 1');
            expect(getDistinctCommits()).toStrictEqual([
                'preview: tblSecond 0',
                'all: tblSecond 0, tblSecond 1',
            ]);
        });

        it('suspends when the new table has no preview, instead of returning the old records', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            makeRecords('tblSecond', 2);
            const {container} = await renderInSuspenseAsync(
                <TableSwitcher initialTable={sdk.base.getTableById('tblFirst')} />,
            );
            await finishLoadingAsync('tblFirst');
            commits = [];

            await act(async () => {
                setTable(sdk.base.getTableById('tblSecond'));
                await tickAsync();
            });
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingAsync('tblSecond');
            expect(getVisibleText(container)).toBe('all: tblSecond 0, tblSecond 1');
            expect(getDistinctCommits()).toStrictEqual([
                'fallback',
                'all: tblSecond 0, tblSecond 1',
            ]);
        });
    });

    it('unloads every record when unmounted while they load', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        const {unmount} = await renderInSuspenseAsync(<Records table={table} />);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        await act(async () => {
            unmount();
        });
        await finishLoadingAsync('tblFirst');
        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();

        await act(async () => {
            jest.advanceTimersByTime(62000);
            await tickAsync();
        });
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
            key: allRecordsQueryKey('tblFirst'),
        });
        expect(getDistinctCommits()).toStrictEqual(['preview: tblFirst 0, tblFirst 1']);
    });

    it('works in StrictMode', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');

        let result: ReturnType<typeof render>;
        await act(async () => {
            result = render(
                <StrictMode>
                    <SdkContext.Provider value={sdk}>
                        <Suspense fallback={<Fallback />}>
                            <Records table={table} />
                        </Suspense>
                    </SdkContext.Provider>
                </StrictMode>,
            );
        });
        expect(getVisibleText(result!.container)).toBe('preview: tblFirst 0, tblFirst 1');

        await finishLoadingAsync('tblFirst');
        expect(getVisibleText(result!.container)).toBe('all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(getDistinctCommits()).toStrictEqual([
            'preview: tblFirst 0, tblFirst 1',
            'all: tblFirst 0, tblFirst 1, tblFirst 2',
        ]);
        expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);

        await act(async () => {
            result!.unmount();
        });
        await act(async () => {
            jest.advanceTimersByTime(62000);
            await tickAsync();
        });
        expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
    });

    it('throws to the error boundary if loading every record fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        const {container} = await renderInSuspenseAsync(
            <ErrorBoundary>
                <Records table={table} />
            </ErrorBoundary>,
        );
        expect(getVisibleText(container)).toBe('preview: tblFirst 0, tblFirst 1');

        await act(async () => {
            rejectLoadByQueryKey[allRecordsQueryKey('tblFirst')](new Error('load failed'));
            await tickAsync();
        });

        expect(getVisibleText(container)).toBe('error: load failed');
        consoleErrorSpy.mockRestore();
    });

    it('holds a transition that re-renders it during the preview until every record loads', async () => {
        seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
        const table = sdk.base.getTableById('tblFirst');
        let setLabel: (label: string) => void;
        const Labelled = () => {
            const [label, setLabelState] = useState('before');
            setLabel = setLabelState;
            return (
                <React.Fragment>
                    {label} <Records table={table} />
                </React.Fragment>
            );
        };
        const {container} = await renderInSuspenseAsync(<Labelled />);

        await act(async () => {
            startTransition(() => setLabel('after'));
            await tickAsync();
        });
        expect(getVisibleText(container)).toBe('before preview: tblFirst 0, tblFirst 1');

        await finishLoadingAsync('tblFirst');
        expect(getVisibleText(container)).toBe('after all: tblFirst 0, tblFirst 1, tblFirst 2');
        expect(getDistinctCommits()).toStrictEqual([
            'preview: tblFirst 0, tblFirst 1',
            'all: tblFirst 0, tblFirst 1, tblFirst 2',
        ]);
    });

    describe('with an array', () => {
        let latestResults: Array<RecordsWithPreloadedPreview | null>;
        let setTables: (tables: Array<Table | null>) => void;

        let renderCount: number;
        const RecordsList = ({initialTables}: {initialTables: Array<Table | null>}) => {
            const [tables, setTablesState] = useState(initialTables);
            setTables = setTablesState;
            const results = useRecordsWithPreloadedPreview(tables);
            renderCount++;
            latestResults = results;
            const text = results
                .map((result, index) => describeResult(result, tables[index]))
                .join(' | ');
            useLayoutEffect(() => {
                commits.push(text);
            });
            return <span>{text}</span>;
        };

        const setTablesAsync = async (tables: Array<Table | null>) => {
            await act(async () => {
                setTables(tables);
                await tickAsync();
            });
        };

        let firstTable: Table;
        let secondTable: Table;
        beforeEach(() => {
            latestResults = [];
            renderCount = 0;
            firstTable = sdk.base.getTableById('tblFirst');
            secondTable = sdk.base.getTableById('tblSecond');
        });

        const FIRST_PREVIEW = 'preview: tblFirst 0, tblFirst 1';
        const FIRST_ALL = 'all: tblFirst 0, tblFirst 1, tblFirst 2';
        const SECOND_PREVIEW = 'preview: tblSecond 0';
        const SECOND_ALL = 'all: tblSecond 0, tblSecond 1';

        it("returns a preview per table, then every table's records together", async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);

            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );

            expect(getVisibleText(container)).toBe(`${FIRST_PREVIEW} | ${SECOND_PREVIEW}`);
            expect(latestResults.map((result) => result!.isPreview)).toStrictEqual([true, true]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await finishLoadingAsync('tblFirst');
            expect(getVisibleText(container)).toBe(`${FIRST_PREVIEW} | ${SECOND_PREVIEW}`);

            await finishLoadingAsync('tblSecond');
            expect(getVisibleText(container)).toBe(`${FIRST_ALL} | ${SECOND_ALL}`);
            expect(latestResults.map((result) => result!.fields)).toStrictEqual([
                firstTable.fields,
                secondTable.fields,
            ]);
            expect(getDistinctCommits()).toStrictEqual([
                `${FIRST_PREVIEW} | ${SECOND_PREVIEW}`,
                `${FIRST_ALL} | ${SECOND_ALL}`,
            ]);
        });

        it("shows a table's records as soon as they load if it re-renders", async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );
            await finishLoadingAsync('tblFirst');
            expect(getVisibleText(container)).toBe(`${FIRST_PREVIEW} | ${SECOND_PREVIEW}`);

            await setTablesAsync([firstTable, secondTable]);
            expect(getVisibleText(container)).toBe(`${FIRST_ALL} | ${SECOND_PREVIEW}`);

            await finishLoadingAsync('tblSecond');
            expect(getVisibleText(container)).toBe(`${FIRST_ALL} | ${SECOND_ALL}`);
        });

        it('returns already-loaded records next to a preview', async () => {
            makeRecords('tblFirst', 3);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const AlreadyLoaded = () => {
                useRecords(firstTable);
                return null;
            };
            const {rerender} = await renderInSuspenseAsync(<AlreadyLoaded />);
            await finishLoadingAsync('tblFirst');
            commits = [];

            await act(async () => {
                rerender(
                    <SdkContext.Provider value={sdk}>
                        <Suspense fallback={<Fallback />}>
                            <AlreadyLoaded />
                            <RecordsList initialTables={[firstTable, secondTable]} />
                        </Suspense>
                    </SdkContext.Provider>,
                );
            });
            await finishLoadingAsync('tblSecond');

            expect(getDistinctCommits()).toStrictEqual([
                `${FIRST_ALL} | ${SECOND_PREVIEW}`,
                `${FIRST_ALL} | ${SECOND_ALL}`,
            ]);
        });

        it('suspends until every table loads, in parallel, when one has no preview', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            makeRecords('tblSecond', 2);

            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );
            expect(getVisibleText(container)).toBe('fallback');
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await finishLoadingAsync('tblSecond');
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingAsync('tblFirst');
            expect(getDistinctCommits()).toStrictEqual([
                'fallback',
                `${FIRST_ALL} | ${SECOND_ALL}`,
            ]);
        });

        it("suspends if one table's preview goes away before every record loads", async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );

            await releasePreloadedRecordsAsync('tblSecond');
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');
            expect(getDistinctCommits()).toStrictEqual([
                `${FIRST_PREVIEW} | ${SECOND_PREVIEW}`,
                'fallback',
                `${FIRST_ALL} | ${SECOND_ALL}`,
            ]);
        });

        it('keeps null entries in place', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);

            await renderInSuspenseAsync(<RecordsList initialTables={[null, firstTable, null]} />);
            await finishLoadingAsync('tblFirst');

            expect(getDistinctCommits()).toStrictEqual([
                `null | ${FIRST_PREVIEW} | null`,
                `null | ${FIRST_ALL} | null`,
            ]);
        });

        it('returns an empty array for an empty array without loading anything', async () => {
            await renderInSuspenseAsync(<RecordsList initialTables={[]} />);

            expect(latestResults).toStrictEqual([]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
        });

        it("returns a new table's preview while its records load, never the old records", async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable]} />,
            );
            await finishLoadingAsync('tblFirst');
            commits = [];

            await setTablesAsync([secondTable, firstTable]);
            expect(getVisibleText(container)).toBe(`${SECOND_PREVIEW} | ${FIRST_ALL}`);

            await finishLoadingAsync('tblSecond');
            expect(getDistinctCommits()).toStrictEqual([
                `${SECOND_PREVIEW} | ${FIRST_ALL}`,
                `${SECOND_ALL} | ${FIRST_ALL}`,
            ]);
        });

        it('suspends when a new table has no preview, instead of returning the old records', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            makeRecords('tblSecond', 2);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable]} />,
            );
            await finishLoadingAsync('tblFirst');
            commits = [];

            await setTablesAsync([secondTable, firstTable]);
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingAsync('tblSecond');
            expect(getDistinctCommits()).toStrictEqual([
                'fallback',
                `${SECOND_ALL} | ${FIRST_ALL}`,
            ]);
        });

        it('keeps every record when the tables are reordered or removed', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            await renderInSuspenseAsync(<RecordsList initialTables={[firstTable, secondTable]} />);
            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');
            commits = [];

            await setTablesAsync([secondTable, firstTable]);
            await setTablesAsync([firstTable]);
            await act(async () => {
                jest.advanceTimersByTime(62000);
                await tickAsync();
            });

            expect(getDistinctCommits()).toStrictEqual([`${SECOND_ALL} | ${FIRST_ALL}`, FIRST_ALL]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: allRecordsQueryKey('tblSecond'),
            });
        });

        it('renders once per update after every record loads', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );
            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');
            renderCount = 0;

            await act(async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'rectblSecond0',
                            'cellValuesByFieldId',
                            'fld2ndPrimary',
                        ],
                        value: 'Renamed',
                    },
                ]);
                await tickAsync();
            });

            expect(getVisibleText(container)).toBe(`${FIRST_ALL} | all: Renamed, tblSecond 1`);
            expect(renderCount).toBe(1);
        });

        it('unloads every table when unmounted while they load', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {unmount} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );

            await act(async () => {
                unmount();
            });
            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');
            await act(async () => {
                jest.advanceTimersByTime(62000);
                await tickAsync();
            });

            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(2);
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: allRecordsQueryKey('tblFirst'),
            });
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: allRecordsQueryKey('tblSecond'),
            });
            expect(getDistinctCommits()).toStrictEqual([`${FIRST_PREVIEW} | ${SECOND_PREVIEW}`]);
        });

        it('works in StrictMode', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);

            let result: ReturnType<typeof render>;
            await act(async () => {
                result = render(
                    <StrictMode>
                        <SdkContext.Provider value={sdk}>
                            <Suspense fallback={<Fallback />}>
                                <RecordsList initialTables={[firstTable, secondTable]} />
                            </Suspense>
                        </SdkContext.Provider>
                    </StrictMode>,
                );
            });
            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');

            expect(getDistinctCommits()).toStrictEqual([
                `${FIRST_PREVIEW} | ${SECOND_PREVIEW}`,
                `${FIRST_ALL} | ${SECOND_ALL}`,
            ]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await act(async () => {
                result!.unmount();
            });
            await act(async () => {
                jest.advanceTimersByTime(62000);
                await tickAsync();
            });
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(2);
        });

        it("throws to the error boundary if loading any table's records fails", async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <ErrorBoundary>
                    <RecordsList initialTables={[firstTable, secondTable]} />
                </ErrorBoundary>,
            );

            await finishLoadingAsync('tblFirst');
            await act(async () => {
                rejectLoadByQueryKey[allRecordsQueryKey('tblSecond')](new Error('load failed'));
                await tickAsync();
            });

            expect(getVisibleText(container)).toBe('error: load failed');
            consoleErrorSpy.mockRestore();
        });

        it('holds a transition that re-renders it during the previews until every table loads', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            seedPreloadedRecords('tblSecond', makeRecords('tblSecond', 2), 1);
            const {container} = await renderInSuspenseAsync(
                <RecordsList initialTables={[firstTable, secondTable]} />,
            );

            await act(async () => {
                startTransition(() => setTables([secondTable, firstTable]));
                await tickAsync();
            });
            expect(getVisibleText(container)).toBe(`${FIRST_PREVIEW} | ${SECOND_PREVIEW}`);

            await finishLoadingAsync('tblFirst');
            await finishLoadingAsync('tblSecond');
            expect(getDistinctCommits()).toStrictEqual([
                `${FIRST_PREVIEW} | ${SECOND_PREVIEW}`,
                `${SECOND_ALL} | ${FIRST_ALL}`,
            ]);
        });

        it('throws for an entry that is neither a Table nor a query result', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const {container} = await renderInSuspenseAsync(
                <ErrorBoundary>
                    <RecordsList initialTables={[firstTable.primaryField as unknown as Table]} />
                </ErrorBoundary>,
            );

            expect(getVisibleText(container)).toBe(
                'error: unstable_useRecordsWithPreloadedPreview only accepts a Table, ' +
                    'a RecordQueryResult, null, or an array of them.',
            );
            consoleErrorSpy.mockRestore();
        });
    });

    describe('with query results', () => {
        type Item = Table | RecordQueryResult | null;

        let firstTable: Table;
        let secondTable: Table;
        let latestItemResults: Array<RecordsWithPreloadedPreview | null>;
        let setItems: (items: Array<Item>) => void;
        let renderCount: number;

        beforeEach(() => {
            firstTable = sdk.base.getTableById('tblFirst');
            secondTable = sdk.base.getTableById('tblSecond');
            latestItemResults = [];
            renderCount = 0;
        });

        /** Records of the second table, whose two text fields make field gating easy to see. */
        const makeSecondTableRecords = (count: number): Array<RecordId> => {
            const recordIds: Array<RecordId> = [];
            for (let i = 0; i < count; i++) {
                const recordId = `rec2nd${i}`;
                getTableData('tblSecond').recordsById[recordId] = {
                    id: recordId,
                    cellValuesByFieldId: {
                        fld2ndPrimary: `P${i}`,
                        fld2ndSecondary: `S${i}`,
                        fld2ndLinked: null,
                    },
                    createdTime: '2020-01-01T00:00:00.000Z',
                };
                getTableData('tblSecond').recordOrder.push(recordId);
                recordIds.push(recordId);
            }
            return recordIds;
        };

        /** The query key of `table.selectRecords({fields, records})`. */
        const tableQueryKey = (
            tableId: TableId,
            fieldIds: Array<FieldId> | null,
            recordIds: Array<RecordId> | null = null,
        ) =>
            JSON.stringify([
                'table',
                tableId,
                fieldIds === null ? null : [...fieldIds].sort(),
                recordIds === null ? null : [...recordIds].sort(),
            ]);

        const seedQuery = (tableId: TableId, queryKey: string, recordIds: Array<RecordId>) => {
            getTableData(tableId).dynamicQueriesByKey[queryKey] = {recordOrder: recordIds};
        };

        const seedPreloadedFields = (
            tableId: TableId,
            recordIds: Array<RecordId>,
            fieldIds: Array<FieldId>,
            rowLimit: number,
        ) => {
            getTableData(tableId).dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY] = {
                recordOrder: recordIds.slice(0, rowLimit + 1),
            };
            getTableData(tableId).preloadedRecords = {
                queryKey: PRELOADED_RECORDS_QUERY_KEY,
                fieldIds,
                rowLimit,
            };
        };

        const finishLoadingQueryAsync = async (queryKey: string) => {
            await act(async () => {
                resolveLoadByQueryKey[queryKey]();
                await tickAsync();
            });
        };

        /** Each record as the values of the result's fields, so the readable fields show. */
        const describeItemResult = (result: RecordsWithPreloadedPreview | null) => {
            if (result === null) {
                return 'null';
            }
            const fieldIds = result.fields.map((field) => field.id).join('+');
            const rows = result.records.map((record) =>
                result.fields.map((field) => String(record.getCellValue(field))).join('/'),
            );
            return `${result.isPreview ? 'preview' : 'all'} [${fieldIds}] ${rows.join(', ')}`;
        };

        const ItemRecords = ({initialItem}: {initialItem: Item}) => {
            const [item, setItem] = useState(initialItem);
            setItems = ([nextItem]) => setItem(nextItem);
            const result = useRecordsWithPreloadedPreview(item);
            latestItemResults = [result];
            const text = describeItemResult(result);
            useLayoutEffect(() => {
                commits.push(text);
            });
            return <span>{text}</span>;
        };

        const ItemRecordsList = ({initialItems}: {initialItems: Array<Item>}) => {
            const [items, setItemsState] = useState(initialItems);
            setItems = setItemsState;
            const results = useRecordsWithPreloadedPreview(items);
            latestItemResults = results;
            const text = results.map(describeItemResult).join(' | ');
            useLayoutEffect(() => {
                commits.push(text);
            });
            return <span>{text}</span>;
        };

        const setItemsAsync = async (items: Array<Item>) => {
            await act(async () => {
                setItems(items);
                await tickAsync();
            });
        };

        const SECONDARY_QUERY_KEY = tableQueryKey('tblSecond', [
            'fld2ndPrimary',
            'fld2ndSecondary',
        ]);
        const FIELD_NOT_DECLARED = "was not declared in this query result's fields";

        it('gates the preview of a fields query result to its fields when all were preloaded', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields(
                'tblSecond',
                recordIds,
                ['fld2ndPrimary', 'fld2ndSecondary', 'fld2ndLinked'],
                1,
            );

            const {container} = await renderInSuspenseAsync(
                <ItemRecords
                    initialItem={secondTable.selectRecords({fields: ['fld2ndSecondary']})}
                />,
            );

            expect(getVisibleText(container)).toBe('preview [fld2ndPrimary+fld2ndSecondary] P0/S0');
            expect(() => latestItemResults[0]!.records[0].getCellValue('fld2ndLinked')).toThrow(
                FIELD_NOT_DECLARED,
            );
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: SECONDARY_QUERY_KEY,
                    fieldIds: ['fld2ndPrimary', 'fld2ndSecondary'],
                }),
            );

            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);

            expect(getDistinctCommits()).toStrictEqual([
                'preview [fld2ndPrimary+fld2ndSecondary] P0/S0',
                'all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/S1',
            ]);
            expect(() => latestItemResults[0]!.records[0].getCellValue('fld2ndLinked')).toThrow(
                FIELD_NOT_DECLARED,
            );
        });

        it('gives a fields query result the preloaded fields among its fields', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);

            await renderInSuspenseAsync(
                <ItemRecords
                    initialItem={secondTable.selectRecords({fields: ['fld2ndSecondary']})}
                />,
            );
            expect(() => latestItemResults[0]!.records[0].getCellValue('fld2ndSecondary')).toThrow(
                FIELD_NOT_DECLARED,
            );
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);

            expect(getDistinctCommits()).toStrictEqual([
                'preview [fld2ndPrimary] P0',
                'all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/S1',
            ]);
        });

        it('previews with no fields when none of the requested fields were preloaded', async () => {
            const recordIds = makeSecondTableRecords(2);
            const linkedQueryKey = tableQueryKey('tblSecond', ['fld2ndPrimary', 'fld2ndLinked']);
            seedQuery('tblSecond', linkedQueryKey, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndSecondary'], 1);
            const queryResult = secondTable.selectRecords({fields: ['fld2ndLinked']});

            await renderInSuspenseAsync(<ItemRecords initialItem={queryResult} />);

            const preview = latestItemResults[0]!;
            expect(preview.isPreview).toBe(true);
            expect(preview.fields).toStrictEqual([]);
            expect(preview.records.map((record) => record.id)).toStrictEqual(['rec2nd0']);
            expect(preview.isPreview && preview.hasMoreRecords).toBe(true);
            expect(() => preview.records[0].name).toThrow(FIELD_NOT_DECLARED);

            await finishLoadingQueryAsync(linkedQueryKey);

            const loaded = latestItemResults[0]!;
            expect(loaded.isPreview).toBe(false);
            expect(loaded.fields.map((field) => field.id)).toStrictEqual([
                'fld2ndPrimary',
                'fld2ndLinked',
            ]);
            expect(queryResult.fields!.map((field) => field.id)).toStrictEqual([
                'fld2ndLinked',
                'fld2ndPrimary',
            ]);
            expect(() => loaded.records[0].name).not.toThrow();
        });

        it('treats a query result without options like the table', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', allRecordsQueryKey('tblSecond'), recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary', 'fld2ndSecondary'], 1);

            await renderInSuspenseAsync(<ItemRecords initialItem={secondTable.selectRecords()} />);
            await finishLoadingQueryAsync(allRecordsQueryKey('tblSecond'));

            expect(getDistinctCommits()).toStrictEqual([
                'preview [fld2ndPrimary+fld2ndSecondary] P0/S0',
                'all [fld2ndPrimary+fld2ndSecondary+fld2ndLinked] P0/S0/null, P1/S1/null',
            ]);
        });

        it('suspends without a preview for a query result of some records', async () => {
            const recordIds = makeSecondTableRecords(2);
            const someRecordsQueryKey = tableQueryKey('tblSecond', null, ['rec2nd1']);
            seedQuery('tblSecond', someRecordsQueryKey, ['rec2nd1']);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);

            const {container} = await renderInSuspenseAsync(
                <ItemRecords initialItem={secondTable.selectRecords({records: ['rec2nd1']})} />,
            );
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingQueryAsync(someRecordsQueryKey);
            expect(getDistinctCommits()).toStrictEqual([
                'fallback',
                'all [fld2ndPrimary+fld2ndSecondary+fld2ndLinked] P1/S1/null',
            ]);
        });

        it('suspends without a preview for a linked records query result', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);
            getTableData('tblFirst').recordsById.recA = {
                id: 'recA',
                cellValuesByFieldId: {fld1stLinked: [{id: 'rec2nd1'}]},
                createdTime: '2020-01-01T00:00:00.000Z',
            };
            getTableData('tblFirst').recordOrder.push('recA');
            const linkedQueryKey = JSON.stringify([
                'linked',
                'recA',
                'fld1stLinked',
                ['fld2ndPrimary'],
            ]);
            seedQuery('tblSecond', linkedQueryKey, ['rec2nd1']);
            const originRecord = sdk.base
                .__getRecordStore('tblFirst')
                .getRecordByIdIfExists('recA') as Record;

            const {container} = await renderInSuspenseAsync(
                <ItemRecords
                    initialItem={originRecord.selectLinkedRecordsFromCell('fld1stLinked', {
                        fields: ['fld2ndPrimary'],
                    })}
                />,
            );
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingQueryAsync(linkedQueryKey);
            expect(getDistinctCommits()).toStrictEqual(['fallback', 'all [fld2ndPrimary] P1']);
        });

        it('previews a mixed array of a table and a fields query result together', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 3), 2);
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);

            await renderInSuspenseAsync(
                <ItemRecordsList
                    initialItems={[
                        firstTable,
                        null,
                        secondTable.selectRecords({fields: ['fld2ndSecondary']}),
                    ]}
                />,
            );
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
            await finishLoadingAsync('tblFirst');
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);

            const firstPreview = 'preview [fld1stPrimary] tblFirst 0, tblFirst 1';
            const firstAll =
                'all [fld1stPrimary+fld1stLinked+fldMockLookup] ' +
                'tblFirst 0/null/null, tblFirst 1/null/null, tblFirst 2/null/null';
            expect(getDistinctCommits()).toStrictEqual([
                `${firstPreview} | null | preview [fld2ndPrimary] P0`,
                `${firstAll} | null | all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/S1`,
            ]);
        });

        it('suspends a mixed array until every entry loads when one has no preview', async () => {
            seedPreloadedRecords('tblFirst', makeRecords('tblFirst', 1), 1);
            const recordIds = makeSecondTableRecords(2);
            const someRecordsQueryKey = tableQueryKey('tblSecond', null, ['rec2nd0']);
            seedQuery('tblSecond', someRecordsQueryKey, ['rec2nd0']);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);

            const {container} = await renderInSuspenseAsync(
                <ItemRecordsList
                    initialItems={[firstTable, secondTable.selectRecords({records: ['rec2nd0']})]}
                />,
            );
            expect(getVisibleText(container)).toBe('fallback');
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await finishLoadingQueryAsync(someRecordsQueryKey);
            expect(getVisibleText(container)).toBe('fallback');

            await finishLoadingAsync('tblFirst');
            expect(getDistinctCommits()).toStrictEqual([
                'fallback',
                'all [fld1stPrimary+fld1stLinked+fldMockLookup] tblFirst 0/null/null | ' +
                    'all [fld2ndPrimary+fld2ndSecondary+fld2ndLinked] P0/S0/null',
            ]);
        });

        it('switches an entry between a table and query results', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', allRecordsQueryKey('tblSecond'), recordIds);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);
            await renderInSuspenseAsync(<ItemRecords initialItem={secondTable} />);
            await finishLoadingAsync('tblSecond');
            commits = [];

            await setItemsAsync([secondTable.selectRecords()]);
            await setItemsAsync([secondTable.selectRecords({fields: ['fld2ndSecondary']})]);
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);

            expect(getDistinctCommits()).toStrictEqual([
                'all [fld2ndPrimary+fld2ndSecondary+fld2ndLinked] P0/S0/null, P1/S1/null',
                'preview [fld2ndPrimary] P0',
                'all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/S1',
            ]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);
        });

        it('pools query results with equivalent options and renders once per update', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);
            expect(secondTable.selectRecords({fields: ['fld2ndSecondary', 'fld2ndPrimary']})).toBe(
                secondTable.selectRecords({fields: ['fld2ndPrimary', 'fld2ndSecondary']}),
            );
            const InlineQueryResult = () => {
                const result = useRecordsWithPreloadedPreview(
                    secondTable.selectRecords({fields: ['fld2ndSecondary']}),
                );
                renderCount++;
                const text = describeItemResult(result);
                useLayoutEffect(() => {
                    commits.push(text);
                });
                return <span>{text}</span>;
            };
            const {container} = await renderInSuspenseAsync(<InlineQueryResult />);
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);
            renderCount = 0;

            await act(async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblSecond',
                            'recordsById',
                            'rec2nd1',
                            'cellValuesByFieldId',
                            'fld2ndSecondary',
                        ],
                        value: 'Renamed',
                    },
                ]);
                await tickAsync();
            });

            expect(getVisibleText(container)).toBe(
                'all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/Renamed',
            );
            expect(renderCount).toBe(1);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(1);
        });

        it('unloads a query result when unmounted while it loads', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);
            const {unmount} = await renderInSuspenseAsync(
                <ItemRecords
                    initialItem={secondTable.selectRecords({fields: ['fld2ndSecondary']})}
                />,
            );

            await act(async () => {
                unmount();
            });
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);
            await act(async () => {
                jest.advanceTimersByTime(62000);
                await tickAsync();
            });

            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledWith({
                key: SECONDARY_QUERY_KEY,
            });
            expect(getDistinctCommits()).toStrictEqual(['preview [fld2ndPrimary] P0']);
        });

        it('works with query results in StrictMode', async () => {
            const recordIds = makeSecondTableRecords(2);
            seedQuery('tblSecond', SECONDARY_QUERY_KEY, recordIds);
            seedPreloadedFields('tblSecond', recordIds, ['fld2ndPrimary'], 1);
            const firstRecordIds = makeRecords('tblFirst', 1);
            seedQuery('tblFirst', tableQueryKey('tblFirst', ['fld1stPrimary']), firstRecordIds);
            seedPreloadedRecords('tblFirst', firstRecordIds, 1);

            let result: ReturnType<typeof render>;
            await act(async () => {
                result = render(
                    <StrictMode>
                        <SdkContext.Provider value={sdk}>
                            <Suspense fallback={<Fallback />}>
                                <ItemRecordsList
                                    initialItems={[
                                        secondTable.selectRecords({fields: ['fld2ndSecondary']}),
                                        firstTable.selectRecords({fields: ['fld1stPrimary']}),
                                    ]}
                                />
                            </Suspense>
                        </SdkContext.Provider>
                    </StrictMode>,
                );
            });
            await finishLoadingQueryAsync(SECONDARY_QUERY_KEY);
            await finishLoadingQueryAsync(tableQueryKey('tblFirst', ['fld1stPrimary']));

            expect(getDistinctCommits()).toStrictEqual([
                'preview [fld2ndPrimary] P0 | preview [fld1stPrimary] tblFirst 0',
                'all [fld2ndPrimary+fld2ndSecondary] P0/S0, P1/S1 | all [fld1stPrimary] tblFirst 0',
            ]);
            expect(mockAirtableInterface.loadDynamicQueryAsync).toHaveBeenCalledTimes(2);

            await act(async () => {
                result!.unmount();
            });
            await act(async () => {
                jest.advanceTimersByTime(62000);
                await tickAsync();
            });
            expect(mockAirtableInterface.unloadDynamicQuery).toHaveBeenCalledTimes(2);
        });

        it('throws for preloaded records', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            seedPreloadedFields('tblSecond', makeSecondTableRecords(1), ['fld2ndPrimary'], 1);
            const {container} = await renderInSuspenseAsync(
                <ErrorBoundary>
                    <ItemRecords initialItem={secondTable.unstable_selectPreloadedRecords()} />
                </ErrorBoundary>,
            );

            expect(getVisibleText(container)).toBe(
                'error: unstable_useRecordsWithPreloadedPreview does not accept preloaded ' +
                    'records. Use unstable_usePreloadedRecords instead.',
            );
            consoleErrorSpy.mockRestore();
        });
    });
});
