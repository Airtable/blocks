import {FieldType} from '../../src/types/field';
import {ViewType} from '../../src/types/view';
import MockAirtableInterface, {FixtureData} from './mock_airtable_interface_app';

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
});
