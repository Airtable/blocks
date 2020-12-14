import {FieldType} from '../../src/types/field';
import {ViewType} from '../../src/types/view';
import MockAirtableInterface, {
    FixtureData,
} from '../../src/testing/mock_airtable_interface_external';

describe('MockAirtableInterface', () => {
    let smallBase: FixtureData['base'];

    beforeEach(() => {
        smallBase = {
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
                    ],
                    views: [
                        {
                            id: 'viwGridView',
                            name: 'Grid view',
                            type: ViewType.GRID,
                            fieldOrder: {
                                fieldIds: ['fldName', 'fldIceCream'],
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
                            id: 'viwGrid2',
                            name: 'Grid 2',
                            type: ViewType.GRID,
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
                            },
                        },
                        {
                            id: 'recb',
                            commentCount: 2,
                            createdTime: '2020-11-04T23:20:11.000Z',
                            cellValuesByFieldId: {
                                fldName: 'b',
                                fldIceCream: 'pistachio',
                            },
                        },
                        {
                            id: 'recc',
                            commentCount: 3,
                            createdTime: '2020-11-04T23:20:14.000Z',
                            cellValuesByFieldId: {
                                fldName: 'c',
                                fldIceCream: 'shoe leather',
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
        };
    });

    describe('constructor', () => {
        it('fails for duplicate tables', () => {
            smallBase.tables.push(smallBase.tables[0]);

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"repeated table ID: tblTable1"`);
        });

        it('fails for duplicate views', () => {
            smallBase.tables[0].views.push(smallBase.tables[0].views[0]);

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"repeated view ID: viwGridView"`);
        });

        it('fails for invalid record references in view data', () => {
            smallBase.tables[0].views[0].records[1].id = 'recd';

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"record recd not present in table tblTable1"`);
        });
    });

    describe('#applyMutationAsync', () => {
        it('asynchronously emits a "mutation" event', async () => {
            const ai = new MockAirtableInterface({base: smallBase});
            const calls: Array<any> = [];

            await new Promise(resolve => {
                ai.on('mutation', (...args: Array<any>) => {
                    calls.push(args);
                    resolve();
                });
                ai.applyMutationAsync({
                    type: 'createSingleTable',
                    id: 'tblFAKE',
                    name: 'fake table',
                    fields: [],
                });

                // The synchronicity of internal method invocation (such as for
                // `applyMutationAsync`) not a part of the SDK's formal API.
                // Although this method may be invoked synchronously in
                // response to some input, that detail is subject to change. If
                // consumers wrote tests which relied on synchronous
                // invocation, those tests would be at risk to fail following
                // future releases of the SDK which were otherwise assumed to
                // be non-breaking.
                //
                // Ensure the event is emitted asynchronously so that consumers
                // cannot write tests which are vulnerable to such changes.
                expect(calls).toEqual([]);
            });

            expect(calls).toEqual([
                [
                    {
                        type: 'createSingleTable',
                        id: 'tblFAKE',
                        name: 'fake table',
                        fields: [],
                    },
                ],
            ]);
        });
    });

    describe('#fetchAndSubscribeToCellValuesInFieldsAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblFoo', ['fldName']),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('fails for unrecognized field IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblTable1', [
                    'fldName',
                    'fldMadeUp',
                ]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"field fldMadeUp not present in table tblTable1"`,
            );
        });

        it('returns the requested table data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(
                await ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblTable1', ['fldIceCream']),
            ).toEqual({
                recordsById: {
                    reca: {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'strawberry',
                        },
                    },
                    recb: {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'pistachio',
                        },
                    },
                    recc: {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'shoe leather',
                        },
                    },
                },
            });
        });
    });

    describe('#fetchAndSubscribeToTableDataAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToTableDataAsync('tblFoo'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('returns the requested table data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToTableDataAsync('tblTable1')).toEqual({
                recordsById: {
                    reca: {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldName: 'a',
                            fldIceCream: 'strawberry',
                        },
                    },
                    recb: {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldName: 'b',
                            fldIceCream: 'pistachio',
                        },
                    },
                    recc: {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldName: 'c',
                            fldIceCream: 'shoe leather',
                        },
                    },
                },
            });
        });
    });

    describe('#fetchAndSubscribeToViewDataAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToViewDataAsync('tblFoo', 'viwGridView'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('fails for unrecognized view IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwFoo'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"view not present in fixture data: viwFoo"`,
            );
        });

        it('returns the requested view data (active view)', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwGridView')).toEqual({
                visibleRecordIds: ['reca', 'recb', 'recc'],
                fieldOrder: {
                    fieldIds: ['fldName', 'fldIceCream'],
                    visibleFieldCount: 2,
                },
                colorsByRecordId: {},
            });
        });

        it('returns the requested view data (inactive view)', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwGrid2')).toEqual({
                visibleRecordIds: ['recb', 'recc'],
                fieldOrder: {
                    fieldIds: ['fldName'],
                    visibleFieldCount: 1,
                },
                colorsByRecordId: {},
            });
        });
    });

    describe('#fieldTypeProvider', () => {
        let fieldTypeProvider: MockAirtableInterface['fieldTypeProvider'];
        const fieldData = {
            id: 'fldFAKE',
            name: 'fake name',
            type: 'fake type',
            typeOptions: {},
            description: null,
            lock: null,
        };

        beforeEach(() => {
            ({fieldTypeProvider} = new MockAirtableInterface({base: smallBase}));
        });

        describe('#convertCellValueToString', () => {
            const fakeAppInterface = {};

            it('returns the empty string for null values', () => {
                const cellValue = null;

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('');
            });

            it('returns the "name" property of object values which define a string value', () => {
                const cellValue = {name: 'obadiah'};

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('obadiah');
            });

            it('ignores the "name" property of object values which define a non-string value', () => {
                const cellValue = {name: 49.0004};

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('[object Object]');
            });

            it('returns a string representation of primitive values', () => {
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, 0, fieldData),
                ).toBe('0');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, -0, fieldData),
                ).toBe('0');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, 24601, fieldData),
                ).toBe('24601');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, -24601, fieldData),
                ).toBe('-24601');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, true, fieldData),
                ).toBe('true');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, false, fieldData),
                ).toBe('false');
                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        undefined,
                        fieldData,
                    ),
                ).toBe('undefined');
                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        'already a string',
                        fieldData,
                    ),
                ).toBe('already a string');
            });

            it('returns a comma-and-space-separated string for Array values', () => {
                const cellValue = [null, '', {}, {name: 'sarah'}];
                const expected = `${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[0],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[1],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[2],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[3],
                    fieldData,
                )}`;

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe(expected);
            });
        });
    });
});
