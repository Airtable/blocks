import ReactDOM from 'react-dom';
import React from 'react';
// eslint-disable-next-line import/order
import TestDriver, {MutationTypes} from '../src';
import {Base, FieldType, TableOrViewQueryResult, ViewType} from '@airtable/blocks/models';
import {
    expandRecord,
    expandRecordList,
    expandRecordPickerAsync,
    useBase,
    useCursor,
    useGlobalConfig,
    useViewport,
} from '@airtable/blocks/ui';
import {Mutation} from '@airtable/blocks/unstable_testing_utils';

import {FixtureData} from '../src/mock_airtable_interface';
import {invariant} from '../src/error_utils';
import {TestMutation} from '../src/test_mutations';

function getHookValue<HookValue extends any>(
    testDriver: TestDriver,
    hook: () => HookValue,
): HookValue {
    const div = document.createElement('div');
    let value: HookValue | null = null;
    const child = React.createElement(() => {
        value = hook();
        return null;
    }, null);

    ReactDOM.render(React.createElement(testDriver.Container, null, child), div);
    ReactDOM.unmountComponentAtNode(div);

    invariant(value, 'React hook did not provide a model instance');

    return value;
}
const getBase = (testDriver: TestDriver) => getHookValue(testDriver, useBase);
const getCursor = (testDriver: TestDriver) => getHookValue(testDriver, useCursor);
const getGlobalConfig = (testDriver: TestDriver) => getHookValue(testDriver, useGlobalConfig);
const getViewport = (testDriver: TestDriver) => getHookValue(testDriver, useViewport);

describe('TestDriver', () => {
    let fixtureData: FixtureData;
    let testDriver: TestDriver;

    const triggerMutationAsync = () => {
        return testDriver.base.tables[0].createRecordsAsync([{fields: {}}]);
    };

    beforeEach(() => {
        fixtureData = {
            base: {
                id: 'appTestFixtureDat',
                name: 'Test Fixture Data Generation',
                tables: [
                    {
                        id: 'tblTable1',
                        name: 'Table 1',
                        description: '',
                        fields: [
                            {
                                id: 'fldName',
                                name: 'Name',
                                description: '',
                                type: FieldType.SINGLE_LINE_TEXT,
                                options: null,
                            },
                            {
                                id: 'fldIceCream',
                                name: 'Favorite ice cream',
                                description: '',
                                type: FieldType.SINGLE_LINE_TEXT,
                                options: null,
                            },
                            {
                                id: 'fldChord',
                                name: 'Arrangement of musical notes',
                                description: '',
                                type: FieldType.SINGLE_LINE_TEXT,
                                options: null,
                            },
                        ],
                        views: [
                            {
                                id: 'viwGridView',
                                name: 'Grid view',
                                type: ViewType.GRID,
                                fieldOrder: {
                                    fieldIds: ['fldName', 'fldIceCream', 'fldChord'],
                                    visibleFieldCount: 2,
                                },
                                records: [
                                    {
                                        id: 'reca',
                                        color: null,
                                    },
                                    {
                                        id: 'recb',
                                        color: null,
                                    },
                                    {
                                        id: 'recc',
                                        color: null,
                                    },
                                ],
                                isLockedView: false,
                            },
                            {
                                id: 'viwForm',
                                name: 'Form view',
                                type: ViewType.FORM,
                                fieldOrder: {
                                    fieldIds: ['fldName'],
                                    visibleFieldCount: 1,
                                },
                                records: [
                                    {
                                        id: 'recb',
                                        color: null,
                                    },
                                    {
                                        id: 'recc',
                                        color: null,
                                    },
                                ],
                                isLockedView: false,
                            },
                        ],
                        records: [
                            {
                                id: 'reca',
                                commentCount: 1,
                                createdTime: '2020-11-04T23:20:08.000Z',
                                cellValuesByFieldId: {
                                    fldName: 'a',
                                    fldIceCream: 'strawberry',
                                    fldChord: 'c major',
                                },
                            },
                            {
                                id: 'recb',
                                commentCount: 2,
                                createdTime: '2020-11-04T23:20:11.000Z',
                                cellValuesByFieldId: {
                                    fldName: 'b',
                                    fldIceCream: 'pistachio',
                                    fldChord: 'g sharp 7',
                                },
                            },
                            {
                                id: 'recc',
                                commentCount: 3,
                                createdTime: '2020-11-04T23:20:14.000Z',
                                cellValuesByFieldId: {
                                    fldName: 'c',
                                    fldIceCream: 'shoe leather',
                                    fldChord: 'b flat minor',
                                },
                            },
                        ],
                    },
                    {
                        id: 'tblTable2',
                        name: 'Table 2',
                        description: '',
                        fields: [
                            {
                                id: 'fldName2',
                                name: 'Name 2',
                                description: '',
                                type: FieldType.SINGLE_LINE_TEXT,
                                options: null,
                            },
                        ],
                        views: [
                            {
                                id: 'viwGridView2',
                                name: 'Grid view 2',
                                type: ViewType.GRID,
                                fieldOrder: {
                                    fieldIds: ['fldName2'],
                                    visibleFieldCount: 1,
                                },
                                records: [
                                    {
                                        id: 'recd',
                                        color: null,
                                    },
                                ],
                                isLockedView: false,
                            },
                        ],
                        records: [
                            {
                                id: 'recd',
                                commentCount: 1,
                                createdTime: '2020-11-04T23:20:08.000Z',
                                cellValuesByFieldId: {
                                    fldName: 'd',
                                },
                            },
                        ],
                    },
                ],
                collaborators: [
                    {
                        id: 'usrPhilRath',
                        name: 'Phil Rath',
                        email: 'phil.rath@airtable.test',
                        profilePicUrl: 'https://dl.airtable.test/.profilePics/usrPhilRath',
                        isActive: true,
                    },
                ],
                workspaceId: 'wsptestworkspaceid',
            },
        };
        testDriver = new TestDriver(fixtureData);
    });

    describe('#Container', () => {
        it('functions as a React Component', () => {
            const div = document.createElement('div');
            ReactDOM.render(React.createElement(testDriver.Container, null), div);
        });

        it('acts as a React Suspense boundary', () => {
            const div = document.createElement('div');
            const child = React.createElement(() => {
                throw Promise.resolve();
            }, null);

            ReactDOM.render(React.createElement(testDriver.Container, null, child), div);
        });

        it('provides a Base instance', () => {
            const div = document.createElement('div');
            let base: Base | null = null;
            const child = React.createElement(() => {
                base = useBase();
                return null;
            }, null);

            ReactDOM.render(React.createElement(testDriver.Container, null, child), div);

            expect(base).toBeInstanceOf(Base);
            expect(base!.id).toBe('appTestFixtureDat');
        });
    });

    describe('constructor', () => {
        it('provides distinct records', async () => {
            function read(result: TableOrViewQueryResult) {
                return result.records.map(record => ({
                    id: record.id,
                    fldName: record.getCellValue('fldName'),
                }));
            }

            const first = testDriver;
            const second = new TestDriver(fixtureData);

            const result1 = await first.base.getTable('Table 1').selectRecordsAsync();
            await first.base.getTable('Table 1').updateRecordAsync('reca', {fldName: 'new value'});

            expect(read(result1)[0]).toEqual({id: 'reca', fldName: 'new value'});

            const result2 = await second.base.getTable('Table 1').selectRecordsAsync();
            expect(read(result2)[0]).toEqual({id: 'reca', fldName: 'a'});
        });

        it('maintains globalConfig values at the top-level', () => {
            fixtureData.globalConfig = {foo: 'bar'};
            const globalConfig = getGlobalConfig(new TestDriver(fixtureData));

            expect(globalConfig.get('foo')).toBe('bar');
        });

        it('maintains globalConfig values nested within the top-level', () => {
            fixtureData.globalConfig = {
                foo: {
                    bar: 'baz',
                },
            };
            const globalConfig = getGlobalConfig(new TestDriver(fixtureData));

            expect(globalConfig.get(['foo', 'bar'])).toBe('baz');
        });

        it('maintains distinct globalConfig stores for each instance (initial state provided)', async () => {
            fixtureData.globalConfig = {foo: 'bar'};
            const globalConfig1 = getGlobalConfig(new TestDriver(fixtureData));
            const globalConfig2 = getGlobalConfig(new TestDriver(fixtureData));

            await globalConfig1.setAsync('foo', 'baz');

            expect(globalConfig1.get('foo')).toBe('baz');
            expect(globalConfig2.get('foo')).toBe('bar');
        });

        it('maintains distinct globalConfig stores for each instance (initial state omitted)', async () => {
            delete fixtureData.globalConfig;
            const globalConfig1 = getGlobalConfig(new TestDriver(fixtureData));
            const globalConfig2 = getGlobalConfig(new TestDriver(fixtureData));

            await globalConfig1.setAsync('foo', 'baz');

            expect(globalConfig1.get('foo')).toBe('baz');
            expect(globalConfig2.get('foo')).toBe(undefined);
        });
    });

    describe('#cursor', () => {
        it('exposes properly-initialized cursor', async () => {
            expect(testDriver.cursor.activeTableId).toBe('tblTable1');
        });
    });

    describe('#base', () => {
        it('exposes properly-initialized base', async () => {
            expect(testDriver.base.id).toBe('appTestFixtureDat');
        });
    });

    describe('#globalConfig', () => {
        it('exposes global config from SDK', async () => {
            expect(testDriver.globalConfig).toBe(getGlobalConfig(testDriver));
        });
    });

    describe('#session', () => {
        it('exposes properly-initialized session', async () => {
            expect(testDriver.session.currentUser!.id).toBe('usrPhilRath');
        });
    });

    describe('#deleteFieldAsync', () => {
        it('throws when the specified table is not present', async () => {
            await expect(
                testDriver.deleteFieldAsync('tblNONEXISTENT', 'fldIceCream'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'tblNONEXISTENT' in base 'Test Fixture Data Generation'"`,
            );
        });

        it('throws when the specified field is not present', async () => {
            await expect(
                testDriver.deleteFieldAsync('tblTable1', 'fldNONEXISTENT'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"No field with ID or name 'fldNONEXISTENT' in table 'Table 1'"`,
            );
        });

        it('removes the specified field from the parent table', async () => {
            const initialCount = testDriver.base.tables[0].fields.length;

            await testDriver.deleteFieldAsync('tblTable1', 'fldIceCream');

            expect(testDriver.base.tables[0].fields.length).toBe(initialCount - 1);
        });

        it('does not emit a corresponding mutation event', async () => {
            const mutations: Array<TestMutation> = [];
            testDriver.watch('mutation', mutation => mutations.push(mutation));

            await testDriver.deleteFieldAsync('tblTable1', 'fldIceCream');

            expect(mutations).toEqual([]);
        });

        it('removes the specified field from the parent table (specified by name)', async () => {
            await testDriver.deleteFieldAsync('Table 1', 'Favorite ice cream');

            const ids = testDriver.base.tables[0].fields.map(({id}) => id);
            expect(ids).toEqual(['fldName', 'fldChord']);
        });

        it('removes the specified field from the parent view in the simulated backend', async () => {
            const view = testDriver.base.tables[0].views[0];

            await testDriver.deleteFieldAsync('tblTable1', 'fldIceCream');

            const viewMetadata = await view.selectMetadataAsync();

            const ids = viewMetadata.allFields.map(({id}) => id);
            expect(ids).toEqual(['fldName', 'fldChord']);
        });

        it('removes the specified field from the parent view optimistically', async () => {
            const view = testDriver.base.tables[0].views[0];

            const viewMetadata = await view.selectMetadataAsync();

            await testDriver.deleteFieldAsync('tblTable1', 'fldIceCream');

            const ids = viewMetadata.allFields.map(({id}) => id);
            expect(ids).toEqual(['fldName', 'fldChord']);
        });

        it('reduces the visible field count when deleted field is visible', async () => {
            const view = testDriver.base.tables[0].views[0];

            await testDriver.deleteFieldAsync('tblTable1', 'fldIceCream');

            const viewMetadata = await view.selectMetadataAsync();

            const ids = viewMetadata.visibleFields.map(({id}) => id);
            expect(ids).toEqual(['fldName']);
        });

        it('persists the visible field count when deleted field is not visible', async () => {
            const view = testDriver.base.tables[0].views[0];

            await testDriver.deleteFieldAsync('tblTable1', 'fldChord');

            const viewMetadata = await view.selectMetadataAsync();

            const ids = viewMetadata.visibleFields.map(({id}) => id);
            expect(ids).toEqual(['fldName', 'fldIceCream']);
        });

        it('rejects attempts to delete primary field', async () => {
            await expect(
                testDriver.deleteFieldAsync('tblTable1', 'fldName'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"A table's primary field may not be deleted."`,
            );
        });
    });

    describe('#deleteTable', () => {
        it('throws when the specified table ID is not present', () => {
            expect(() => {
                testDriver.deleteTable('tblNONEXISTENT');
            }).toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'tblNONEXISTENT' in base 'Test Fixture Data Generation'"`,
            );
        });

        it('removes the table specified by ID', () => {
            testDriver.deleteTable('tblTable2');

            const ids = testDriver.base.tables.map(({id}) => id);
            expect(ids).toEqual(['tblTable1']);
        });

        it('removes the table specified by name', () => {
            testDriver.deleteTable('Table 2');

            const ids = testDriver.base.tables.map(({id}) => id);
            expect(ids).toEqual(['tblTable1']);
        });

        it('selects a new active table when the active table is deleted', () => {
            testDriver.deleteTable('tblTable1');

            expect(getCursor(testDriver).activeTableId).toBe('tblTable2');
        });

        it('retains the active table when an inactive table is deleted', () => {
            testDriver.deleteTable('tblTable2');

            expect(getCursor(testDriver).activeTableId).toBe('tblTable1');
        });

        it('throws when the specified table is the only table', () => {
            testDriver.deleteTable('tblTable1');

            expect(() => {
                testDriver.deleteTable('tblTable2');
            }).toThrowErrorMatchingInlineSnapshot(
                `"Table with ID \\"tblTable2\\" may not be deleted because it is the only Table present in the Base"`,
            );
        });
    });

    describe('#deleteViewAsync', () => {
        it('throws when the specified table is not present', async () => {
            await expect(
                testDriver.deleteViewAsync('tblNONEXISTENT', 'viwGridView'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'tblNONEXISTENT' in base 'Test Fixture Data Generation'"`,
            );
        });

        it('throws when the specified view is not present', async () => {
            await expect(
                testDriver.deleteViewAsync('tblTable1', 'viwNONEXISTENT'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwNONEXISTENT' in table 'Table 1'"`,
            );
        });

        it('removes the specified view from the parent table (by IDs)', async () => {
            await testDriver.deleteViewAsync('tblTable1', 'viwGridView');

            const ids = testDriver.base.tables[0].views.map(({id}) => id);
            expect(ids).toEqual(['viwForm']);
        });

        it('removes the specified view from the parent table (by names)', async () => {
            await testDriver.deleteViewAsync('Table 1', 'Grid view');

            const ids = testDriver.base.tables[0].views.map(({id}) => id);
            expect(ids).toEqual(['viwForm']);
        });

        it('selects a new active view when the active view is deleted', async () => {
            await testDriver.deleteViewAsync('Table 1', 'Grid view');

            expect(getCursor(testDriver).activeViewId).toBe('viwForm');
        });

        it('retains the active view when an inactive view is deleted', async () => {
            await testDriver.deleteViewAsync('Table 1', 'Form view');

            expect(getCursor(testDriver).activeViewId).toBe('viwGridView');
        });

        it('rejects attempts to delete final view', async () => {
            await testDriver.deleteViewAsync('tblTable1', 'viwForm');

            await expect(
                testDriver.deleteViewAsync('tblTable1', 'viwGridView'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"The view in a table with one view may not be deleted"`,
            );
        });
    });

    describe('#setActiveCursorModels', () => {
        it('rejects attempts to set nothing', () => {
            expect(() => {
                testDriver.setActiveCursorModels({} as any);
            }).toThrowErrorMatchingInlineSnapshot(
                `"One of \`table\` or \`view\` must be specified."`,
            );
        });

        it('rejects unrecognized Table references', () => {
            expect(() => {
                testDriver.setActiveCursorModels({table: 'tblNonExistent'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'tblNonExistent' in base 'Test Fixture Data Generation'"`,
            );
        });

        it('rejects attempts to change table without changing view', async () => {
            expect(() => {
                testDriver.setActiveCursorModels({table: 'tblTable2'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot change active table to \\"tblTable2\\" because active view (\\"viwGridView\\") belongs to another table"`,
            );
        });

        it('tolerates attempts to reset table to existing value', async () => {
            testDriver.setActiveCursorModels({table: 'tblTable1'});

            expect(testDriver.cursor.activeTableId).toBe('tblTable1');
        });

        it('updates cursor by Table ID', async () => {
            testDriver.setActiveCursorModels({table: 'tblTable2', view: 'viwGridView2'});

            expect(testDriver.cursor.activeTableId).toBe('tblTable2');
        });

        it('updates cursor by Table name', async () => {
            testDriver.setActiveCursorModels({table: 'Table 2', view: 'viwGridView2'});

            expect(testDriver.cursor.activeTableId).toBe('tblTable2');
        });

        it('rejects unrecognized View references', () => {
            expect(() => {
                testDriver.setActiveCursorModels({view: 'viwNonExistent'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwNonExistent' in table 'Table 1'"`,
            );
        });

        it('rejects attempts to set view of another table (active table inferred)', () => {
            expect(() => {
                testDriver.setActiveCursorModels({view: 'viwGridView2'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwGridView2' in table 'Table 1'"`,
            );
        });

        it('rejects attempts to set view of another table (active table specified)', () => {
            expect(() => {
                testDriver.setActiveCursorModels({table: 'tblTable2', view: 'viwGridView'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwGridView' in table 'Table 2'"`,
            );
        });

        it('updates cursor by View ID', async () => {
            testDriver.setActiveCursorModels({view: 'viwForm'});

            expect(testDriver.cursor.activeViewId).toBe('viwForm');
        });

        it('updates cursor by View name', async () => {
            testDriver.setActiveCursorModels({view: 'Form view'});

            expect(testDriver.cursor.activeViewId).toBe('viwForm');
        });
    });

    describe('#simulatePermissionCheck', () => {
        it('provides an appropriate Mutation object', async () => {
            const [mutation] = await Promise.all([
                new Promise(resolve => {
                    testDriver.simulatePermissionCheck((value: Mutation) => {
                        resolve(value);
                        return true;
                    });
                }),
                triggerMutationAsync().catch(() => {}),
            ]);

            expect(mutation).toEqual({
                records: [
                    {
                        cellValuesByFieldId: {},
                        id: expect.anything(),
                    },
                ],
                tableId: 'tblTable1',
                type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                opts: {
                    parseDateCellValueInColumnTimeZone: true,
                },
            });
        });

        it('honors return value - true', async () => {
            testDriver.simulatePermissionCheck(() => true);
            await triggerMutationAsync();
        });

        it('honors return value - false', async () => {
            testDriver.simulatePermissionCheck(() => false);
            await expect(triggerMutationAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Cannot apply createMultipleRecords mutation: The testing environment has been configured to deny this mutation."`,
            );
        });
    });

    describe('#simulateExpandedRecordSelection', () => {
        it('invokes the provided function with the appropriate arguments', async () => {
            const {records} = await testDriver.base.tables[0].selectRecordsAsync();
            const spy = jest.fn(() => 'reca');

            testDriver.simulateExpandedRecordSelection(spy);

            await expandRecordPickerAsync(records);

            expect(spy).toHaveBeenCalledWith('tblTable1', ['reca', 'recb', 'recc'], null, false);
        });

        it('honors the return value of the provided function', async () => {
            const {records} = await testDriver.base.tables[0].selectRecordsAsync();

            testDriver.simulateExpandedRecordSelection(() => 'recc');

            expect(await expandRecordPickerAsync(records)).toBe(records[2]);
        });

        it('reports an error when not used', async () => {
            const {records} = await testDriver.base.tables[0].selectRecordsAsync();

            expect(expandRecordPickerAsync(records)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Unable to simulate user record selection for \`expandRecordPickerAsync\`. The test environment must be configured with the record to select before this method is called."`,
            );
        });
    });

    describe('#userSelectRecords', () => {
        it('rejects requests to select record in inactive tables', () => {
            expect(() => {
                testDriver.userSelectRecords(['reca', 'recd', 'recc']);
            }).toThrowErrorMatchingInlineSnapshot(
                `"Record with ID \\"recd\\" is not present in active table \\"tblTable1\\""`,
            );
        });

        it('updates the cursor selection with the specified records', () => {
            testDriver.userSelectRecords(['recb', 'recc']);

            expect(testDriver.cursor.selectedRecordIds).toEqual(['recb', 'recc']);
        });

        it('persists update through model loading', async () => {
            testDriver.userSelectRecords(['recb', 'recc']);

            await testDriver.cursor.loadDataAsync();

            expect(testDriver.cursor.selectedRecordIds).toEqual(['recb', 'recc']);
        });

        it('allows resetting', async () => {
            testDriver.userSelectRecords(['reca', 'recc']);
            testDriver.userSelectRecords(['recb']);

            expect(testDriver.cursor.selectedRecordIds).toEqual(['recb']);
        });

        it('allows deselection', async () => {
            testDriver.userSelectRecords(['reca', 'recc']);
            testDriver.userSelectRecords([]);

            expect(testDriver.cursor.selectedRecordIds).toEqual([]);
        });
    });

    describe('#unwatch', () => {
        describe('key: mutation', () => {
            it('cancels subscription', async () => {
                let counter = 0;
                const increment = () => (counter += 1);
                testDriver.watch('mutation', increment);
                await triggerMutationAsync();
                expect(counter).toBe(1);
                await triggerMutationAsync();
                expect(counter).toBe(2);

                testDriver.unwatch('mutation', increment);

                await Promise.all([
                    new Promise(resolve => {
                        testDriver.watch('mutation', resolve);
                    }),
                    triggerMutationAsync(),
                ]);

                expect(counter).toBe(2);
            });
        });
    });

    describe('#watch', () => {
        describe('key: mutation', () => {
            it('notifies subscribers', async () => {
                const [data] = await Promise.all([
                    new Promise(resolve => {
                        testDriver.watch('mutation', resolve);
                    }),
                    triggerMutationAsync(),
                ]);

                expect(data).toEqual({
                    records: [
                        {
                            cellValuesByFieldId: {},
                            id: expect.anything(),
                        },
                    ],
                    tableId: 'tblTable1',
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                });
            });
        });
    });

    describe('simulated backend', () => {
        describe('viewport requests', () => {
            it('notifies on requests to enter full screen mode', () => {
                const enterSpy = jest.fn();
                const exitSpy = jest.fn();
                const fullscreenSpy = jest.fn();

                testDriver.watch('enterFullscreen', enterSpy);
                testDriver.watch('exitFullscreen', exitSpy);
                testDriver.watch('setFullscreenMaxSize', fullscreenSpy);
                getViewport(testDriver).enterFullscreenIfPossible();

                expect(enterSpy).toHaveBeenCalledTimes(1);
                expect(enterSpy).toHaveBeenCalledWith(null);
                expect(exitSpy).toHaveBeenCalledTimes(0);
                expect(fullscreenSpy).toHaveBeenCalledTimes(0);
            });

            it('notifies on requests to exit full screen mode', () => {
                const enterSpy = jest.fn();
                const exitSpy = jest.fn();
                const fullscreenSpy = jest.fn();

                testDriver.watch('enterFullscreen', enterSpy);
                testDriver.watch('exitFullscreen', exitSpy);
                testDriver.watch('setFullscreenMaxSize', fullscreenSpy);
                getViewport(testDriver).exitFullscreen();

                expect(enterSpy).toHaveBeenCalledTimes(0);
                expect(exitSpy).toHaveBeenCalledTimes(1);
                expect(exitSpy).toHaveBeenCalledWith(null);
                expect(fullscreenSpy).toHaveBeenCalledTimes(0);
            });

            it('notifies on requests to change max viewport size', () => {
                const enterSpy = jest.fn();
                const exitSpy = jest.fn();
                const fullscreenSpy = jest.fn();

                testDriver.watch('enterFullscreen', enterSpy);
                testDriver.watch('exitFullscreen', exitSpy);
                testDriver.watch('setFullscreenMaxSize', fullscreenSpy);
                getViewport(testDriver).addMaxFullscreenSize({
                    width: 1024,
                    height: 768,
                });

                expect(enterSpy).toHaveBeenCalledTimes(0);
                expect(exitSpy).toHaveBeenCalledTimes(0);
                expect(fullscreenSpy).toHaveBeenCalledTimes(1);
                expect(fullscreenSpy).toHaveBeenCalledWith({width: 1024, height: 768});
            });
        });

        describe('table creation', () => {
            const fieldsSpec = [
                {name: 'laura', type: FieldType.SINGLE_LINE_TEXT},
                {name: 'mark', type: FieldType.EMAIL},
            ];

            it('creates one table', async () => {
                const {base} = testDriver;
                await base.createTableAsync('new table', fieldsSpec);

                const table = base.getTableByName('new table');
                expect(base.getTableById(table.id)).toBe(table);
            });

            it('creates multiple fields', async () => {
                const {base} = testDriver;
                const table = await base.createTableAsync('new table', fieldsSpec);

                const field1 = table.getFieldByName('laura');
                expect(table.getFieldById(field1.id)).toBe(field1);
                expect(field1.type).toBe(FieldType.SINGLE_LINE_TEXT);
                const field2 = table.getFieldByName('mark');
                expect(field2.type).toBe(FieldType.EMAIL);
                expect(table.getFieldById(field2.id)).toBe(field2);

                expect(table.primaryField).toBe(field1);
            });

            it('creates one view', async () => {
                const {base} = testDriver;
                const table = await base.createTableAsync('new table', fieldsSpec);
                expect(table.views.length).toBe(1);
                const viewMetadata = await table.views[0].selectMetadataAsync();

                const allNames = viewMetadata.allFields.map(({name}) => name);
                expect(allNames).toEqual(['laura', 'mark']);

                const visibleNames = viewMetadata.visibleFields.map(({name}) => name);
                expect(visibleNames).toEqual(['laura', 'mark']);
            });

            it('allows loading records from table', async () => {
                const {base} = testDriver;
                const table = await base.createTableAsync('new table', fieldsSpec);

                const queryResult = await table.selectRecordsAsync();

                expect(queryResult.records.length).toBe(0);
            });

            it('allows loading records from view', async () => {
                const {base} = testDriver;
                const table = await base.createTableAsync('new table', fieldsSpec);

                const queryResult = await table.views[0].selectRecordsAsync();

                expect(queryResult.records.length).toBe(0);
            });
        });

        describe('record creation', () => {
            it('creates records prior to table being loaded', async () => {
                const newId = await testDriver.base.tables[0].createRecordsAsync([
                    {
                        fields: {},
                    },
                ]);
                const queryResult = await testDriver.base.tables[0].selectRecordsAsync();
                expect(newId).toEqual([expect.anything()]);
                expect(queryResult.records.map(({id}) => id)).toEqual([
                    'reca',
                    'recb',
                    'recc',
                    newId[0],
                ]);
            });
        });

        describe('record expansion', () => {
            it('notifies when individual records are expanded', async () => {
                const base = getBase(testDriver);
                const result = await base.tables[0].selectRecordsAsync();
                const expandRecordSpy = jest.fn();
                const expandRecordListSpy = jest.fn();

                testDriver.watch('expandRecord', expandRecordSpy);
                testDriver.watch('expandRecordList', expandRecordListSpy);

                expandRecord(result.records[1]);

                expect(expandRecordSpy).toHaveBeenCalledWith({recordId: 'recb', recordIds: null});
                expect(expandRecordListSpy).toHaveBeenCalledTimes(0);
            });

            it('notifies when multiple records are expanded', async () => {
                const base = getBase(testDriver);
                const result = await base.tables[0].selectRecordsAsync();
                const expandRecordSpy = jest.fn();
                const expandRecordListSpy = jest.fn();

                testDriver.watch('expandRecord', expandRecordSpy);
                testDriver.watch('expandRecordList', expandRecordListSpy);

                expandRecordList([result.records[0], result.records[2]]);

                expect(expandRecordSpy).toHaveBeenCalledTimes(0);
                expect(expandRecordListSpy).toHaveBeenCalledWith({
                    recordIds: ['reca', 'recc'],
                    fieldIds: null,
                    tableId: 'tblTable1',
                });
            });
        });
    });
});
