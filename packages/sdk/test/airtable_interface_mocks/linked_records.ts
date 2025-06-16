import {ViewType} from '../../src/base/types/view';
import {FieldType} from '../../src/shared/types/field_core';
import {FixtureData} from './fixture_data';

const linkedRecords: FixtureData = {
    base: {
        id: 'app97Vimdj1OP7QKF',
        name: 'Linked Records Table',
        color: 'purpleLight2',
        tables: [
            {
                id: 'tblFirst',
                name: 'First Table',
                fields: [
                    {
                        id: 'fld1stPrimary',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fld1stLinked',
                        name: 'linked records',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            linkedTableId: 'tblSecond',
                            relationship: 'many',
                            symmetricColumnId: 'fld2ndLinked',
                            unreversed: true,
                        },
                        description: '',
                    },
                    {
                        id: 'fldMockLookup',
                        name: 'lookup',
                        type: FieldType.MULTIPLE_LOOKUP_VALUES,
                        options: null,
                        description: '',
                    },
                ],
                views: [
                    {
                        id: 'viwPrjctAll',
                        name: 'All projects',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                ],
                description: '',
                records: [],
            },
            {
                id: 'tblSecond',
                name: 'Second Table',
                fields: [
                    {
                        id: 'fld2ndPrimary',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fld2ndSecondary',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fld2ndLinked',
                        name: 'linked records',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            linkedTableId: 'tblFirst',
                            relationship: 'many',
                            symmetricColumnId: 'fld1stLinked',
                            unreversed: true,
                        },
                        description: '',
                    },
                ],
                views: [
                    {
                        id: 'viwTaskAll',
                        name: 'All tasks',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                ],
                description: '',
                records: [],
            },
        ],
        collaborators: [
            {
                id: 'usrGalSamari',
                email: 'collab10@example.com',
                name: 'Gal Samari',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png',
                isActive: true,
            },
        ],
    },
};

export default linkedRecords;
