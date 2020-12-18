import {FieldType, ViewType} from '@airtable/blocks/models';

export default {
    base: {
        id: 'appTestFixtureDat',
        name: 'Test Fixture Data Generation',
        tables: [
            {
                id: 'tblTable1',
                name: 'Groceries',
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
                        id: 'fldPurchased',
                        name: 'Purchased',
                        description: '',
                        type: FieldType.CHECKBOX,
                        options: null,
                    },
                ],
                views: [
                    {
                        id: 'viwGridView',
                        name: 'Grid view',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: ['fldName', 'fldPurchased'],
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
                        id: 'viwGridView2',
                        name: 'Another grid view',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: ['fldName'],
                            visibleFieldCount: 1,
                        },
                        records: [],
                    },
                ],
                records: [
                    {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldName: 'carrots',
                            fldPurchased: false,
                        },
                    },
                    {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldName: 'baby carrots',
                            fldPurchased: true,
                        },
                    },
                    {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldName: 'elderly carrots',
                            fldPurchased: false,
                        },
                    },
                ],
            },
            {
                id: 'tblTable2',
                name: 'Porcelain dolls',
                description: '',
                fields: [
                    {
                        id: 'fldName2',
                        name: 'Name of doll',
                        description: '',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                    },
                ],
                views: [
                    {
                        id: 'viwGridView2',
                        name: 'Grid view',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: ['fldName2'],
                            visibleFieldCount: 1,
                        },
                        records: [],
                    },
                ],
                records: [],
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
