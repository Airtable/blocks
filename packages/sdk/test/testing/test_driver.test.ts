import ReactDOM from 'react-dom';
import React from 'react';
import TableOrViewQueryResult from '../../src/models/table_or_view_query_result';
import {FieldType} from '../../src/types/field';
import {Mutation} from '../../src/types/mutations';
import {ViewType} from '../../src/types/view';
import {TestMutation} from '../../src/types/test_mutations';
import Sdk from '../../src/sdk';
import Cursor from '../../src/models/cursor';
import {useSdk} from '../../src/ui/sdk_context';
import useCursor from '../../src/ui/use_cursor';
import {FixtureData} from '../../src/testing/mock_airtable_interface_external';
import TestDriver from '../../src/testing/test_driver';
import {invariant} from '../../src/error_utils';

function getCursor(testDriver: TestDriver): Cursor {
    const div = document.createElement('div');
    let cursor: Cursor | null = null;
    const child = React.createElement(() => {
        cursor = useCursor();
        return null;
    }, null);

    ReactDOM.render(React.createElement(testDriver.Container, null, child), div);
    ReactDOM.unmountComponentAtNode(div);

    invariant(cursor, '`useCursor` hook did not provide a Cursor instance');

    return cursor;
}

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

        it('provides an SDK instance', () => {
            const div = document.createElement('div');
            let sdk: Sdk | null = null;
            const child = React.createElement(() => {
                sdk = useSdk();
                return null;
            }, null);

            ReactDOM.render(React.createElement(testDriver.Container, null, child), div);

            expect(sdk).toBeInstanceOf(Sdk);
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
    });

    describe('#cursor', () => {
        it('exposes properly-initialized cursor', async () => {
            expect(testDriver.cursor.activeTableId).toBe('tblTable1');
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
                type: 'createMultipleRecords',
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
                    type: 'createMultipleRecords',
                });
            });
        });
    });

    describe('simulated backend', () => {
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
    });
});
