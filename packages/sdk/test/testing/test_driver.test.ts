import ReactDOM from 'react-dom';
import React from 'react';
import {FieldType} from '../../src/types/field';
import {Mutation} from '../../src/types/mutations';
import {ViewType} from '../../src/types/view';
import Sdk from '../../src/sdk';
import {useSdk} from '../../src/ui/sdk_context';
import TestDriver from '../../src/testing/test_driver';

describe('MockAirtableInterface', () => {
    let testDriver: TestDriver;

    const triggerMutationAsync = () => {
        return testDriver.base.tables[0].createRecordsAsync([{fields: {}}]);
    };

    beforeEach(() => {
        testDriver = new TestDriver({
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
        });
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
});
