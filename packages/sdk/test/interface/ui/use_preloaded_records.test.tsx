import React, {Suspense} from 'react';
import {act, render, cleanup} from '@testing-library/react';

import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {type Table} from '../../../src/interface/models/table';
import {
    unstable_usePreloadedRecords as usePreloadedRecords,
    type PreloadedRecords,
} from '../../../src/interface/ui/use_preloaded_records';
import {useRecords} from '../../../src/interface/ui/use_records';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {cloneDeep} from '../../../src/shared/private_utils';
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

describe('usePreloadedRecords', () => {
    let sdk: InterfaceBlockSdk;
    let table: Table;

    const getTableData = () => mockAirtableInterface.sdkInitData.baseData.tablesById.tblFirst;

    const makeRecords = (count: number): Array<RecordId> => {
        const recordIds: Array<RecordId> = [];
        for (let i = 0; i < count; i++) {
            const recordId = `rec${i}`;
            getTableData().recordsById[recordId] = {
                id: recordId,
                cellValuesByFieldId: {fld1stPrimary: `Record ${i}`},
                createdTime: '2020-01-01T00:00:00.000Z',
            };
            getTableData().recordOrder.push(recordId);
            recordIds.push(recordId);
        }
        return recordIds;
    };

    const preloadedRecordsData = (rowLimit: number) => ({
        queryKey: PRELOADED_RECORDS_QUERY_KEY,
        fieldIds: ['fld1stPrimary'],
        rowLimit,
    });

    const seedPreloadedRecords = (recordOrder: Array<RecordId>, rowLimit: number) => {
        getTableData().dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY] = {recordOrder};
        getTableData().preloadedRecords = preloadedRecordsData(rowLimit);
    };

    let captured: PreloadedRecords | null = null;
    const Preview = ({table: t}: {table: Table}) => {
        captured = usePreloadedRecords(t);
        if (!captured) {
            return <span>no preload</span>;
        }
        return (
            <ul>
                {captured.records.map((record) => (
                    <li key={record.id}>{String(record.getCellValue('fld1stPrimary'))}</li>
                ))}
                {captured.hasMoreRecords && <li>more</li>}
            </ul>
        );
    };

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        table = sdk.base.getTableByName('First Table');
        captured = null;
    });

    afterEach(async () => {
        await act(async () => {
            cleanup();
        });
        jest.advanceTimersByTime(62000);
        mockAirtableInterface.reset();
    });

    it('renders preloaded records on the first render without suspending', async () => {
        seedPreloadedRecords(makeRecords(3), 2);
        let didRenderFallback = false;
        const Fallback = () => {
            didRenderFallback = true;
            return <span>suspended</span>;
        };
        let textContentAfterFirstRender: string | null = null;
        const RecordFirstRender = () => {
            React.useLayoutEffect(() => {
                textContentAfterFirstRender = document.body.textContent;
            }, []);
            return null;
        };

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Suspense fallback={<Fallback />}>
                        <Preview table={table} />
                        <RecordFirstRender />
                    </Suspense>
                </SdkContext.Provider>,
            ).container;
        });

        expect(didRenderFallback).toBe(false);
        expect(textContentAfterFirstRender).toBe('Record 0Record 1more');
        expect(container!.textContent).toBe('Record 0Record 1more');
        expect(captured!.rowLimit).toBe(2);
        expect(captured!.hasMoreRecords).toBe(true);
        expect(captured!.fields.map((field) => field.id)).toStrictEqual(['fld1stPrimary']);
        expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
    });

    it('shows the preview while useRecords loads every record in a nested Suspense', async () => {
        seedPreloadedRecords(makeRecords(3), 2);
        let resolveLoad: () => void = () => {};
        mockAirtableInterface.loadDynamicQueryAsync.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveLoad = resolve;
                }),
        );
        getTableData().dynamicQueriesByKey[JSON.stringify(['table', 'tblFirst', null, null])] = {
            recordOrder: ['rec0', 'rec1', 'rec2'],
        };

        const Full = ({table: t}: {table: Table}) => {
            const records = useRecords(t);
            return <span>full {records.length}</span>;
        };
        const App = () => (
            <Suspense fallback={<Preview table={table} />}>
                <Full table={table} />
            </Suspense>
        );

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <App />
                </SdkContext.Provider>,
            ).container;
        });
        expect(container!.textContent).toBe('Record 0Record 1more');

        await act(async () => {
            resolveLoad();
            await tickAsync();
        });
        expect(container!.textContent).toBe('full 3');
    });

    it('returns null when the host predates preloaded records', () => {
        makeRecords(2);

        act(() => {
            render(
                <SdkContext.Provider value={sdk}>
                    <Preview table={table} />
                </SdkContext.Provider>,
            );
        });

        expect(captured).toBeNull();
    });

    it('returns null for a null table', () => {
        const NullTable = () => {
            captured = usePreloadedRecords(null);
            return null;
        };
        act(() => {
            render(
                <SdkContext.Provider value={sdk}>
                    <NullTable />
                </SdkContext.Provider>,
            );
        });
        expect(captured).toBeNull();
    });

    it('re-renders when the preloaded records arrive after the first render', async () => {
        const recordIds = makeRecords(2);

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Preview table={table} />
                </SdkContext.Provider>,
            ).container;
        });
        expect(container!.textContent).toBe('no preload');

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
                    value: recordIds,
                },
                {
                    path: ['tablesById', 'tblFirst', 'preloadedRecords'],
                    value: preloadedRecordsData(5),
                },
            ]);
            await tickAsync();
        });

        expect(container!.textContent).toBe('Record 0Record 1');
        expect(captured!.hasMoreRecords).toBe(false);
        expect(mockAirtableInterface.loadDynamicQueryAsync).not.toHaveBeenCalled();
    });

    it('re-renders when preloaded cell values change', async () => {
        seedPreloadedRecords(makeRecords(2), 5);

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Preview table={table} />
                </SdkContext.Provider>,
            ).container;
        });

        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        'rec0',
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value: 'Renamed',
                },
            ]);
            await tickAsync();
        });

        expect(container!.textContent).toBe('RenamedRecord 1');
    });

    it('keeps re-rendering on cell value changes after the host replaces tablesById', async () => {
        const [rec0, rec1, rec2] = makeRecords(3);
        seedPreloadedRecords([rec0, rec1], 5);
        const changeCellValue = (recordId: RecordId, value: string) =>
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblFirst',
                        'recordsById',
                        recordId,
                        'cellValuesByFieldId',
                        'fld1stPrimary',
                    ],
                    value,
                },
            ]);

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Preview table={table} />
                </SdkContext.Provider>,
            ).container;
        });
        await act(async () => {
            changeCellValue(rec0, 'Renamed');
            await tickAsync();
        });
        expect(container!.textContent).toBe('RenamedRecord 1');

        const tablesById = cloneDeep(mockAirtableInterface.sdkInitData.baseData.tablesById);
        tablesById.tblFirst.dynamicQueriesByKey[PRELOADED_RECORDS_QUERY_KEY] = {
            recordOrder: [rec0, rec1, rec2],
        };
        await act(async () => {
            mockAirtableInterface.triggerModelUpdates([{path: ['tablesById'], value: tablesById}]);
            await tickAsync();
        });
        expect(container!.textContent).toBe('RenamedRecord 1Record 2');

        await act(async () => {
            changeCellValue(rec2, 'Changed');
            await tickAsync();
        });
        expect(container!.textContent).toBe('RenamedRecord 1Changed');
    });

    it('returns null once the host releases the preloaded records', async () => {
        seedPreloadedRecords(makeRecords(2), 5);

        let container: HTMLElement;
        await act(async () => {
            container = render(
                <SdkContext.Provider value={sdk}>
                    <Preview table={table} />
                </SdkContext.Provider>,
            ).container;
        });
        expect(container!.textContent).toBe('Record 0Record 1');

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
            await tickAsync();
        });

        expect(container!.textContent).toBe('no preload');
        jest.advanceTimersByTime(2000);
        expect(mockAirtableInterface.unloadDynamicQuery).not.toHaveBeenCalled();
    });
});
