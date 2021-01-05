import {FieldType, ViewType} from '@airtable/blocks/models';

export default {
    base: {
        id: 'appTestFixtureDat',
        name: 'Test Fixture Data Generation',
        tables: [
            {
                id: 'tblTable',
                name: 'Inventory',
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
                        id: 'fldInStock',
                        name: 'In Stock',
                        description: '',
                        type: FieldType.NUMBER,
                        options: null,
                    },
                ],
                views: [
                    {
                        id: 'viwGridView',
                        name: 'Grid view',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: ['fldName', 'fldInStock'],
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
                ],
                records: [
                    {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldName: 'pancake',
                            fldInStock: 10,
                        },
                    },
                    {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldName: 'crumpet',
                            fldInStock: 14,
                        },
                    },
                    {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldName: 'flapjack',
                            fldInStock: 8,
                        },
                    },
                ],
            },
            {
                id: 'tblTable2',
                name: 'Griddle cakes',
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
