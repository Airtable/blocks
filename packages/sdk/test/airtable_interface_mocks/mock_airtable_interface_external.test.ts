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
});
