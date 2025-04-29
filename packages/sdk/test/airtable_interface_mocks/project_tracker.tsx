import {ViewType} from '../../src/base/types/view';
import {FieldType} from '../../src/shared/types/field';
import {FixtureData} from './fixture_data';

const projectTracker: FixtureData = {
    base: {
        id: 'app97Vimdj1OP7QKF',
        name: 'Project tracker',
        color: 'purple',
        tables: [
            {
                id: 'tblDesignProjects',
                name: 'Design projects',
                fields: [
                    {
                        id: 'fldPrjctName',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldPrjctClient',
                        name: 'Client',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            foreignTableId: 'tblClients',
                            relationship: 'many',
                            symmetricColumnId: 'fldClientProjects',
                        },
                        description: 'the project client',
                    },
                    {
                        id: 'fldPrjctCtgry',
                        name: 'Category',
                        type: FieldType.SINGLE_SELECT,
                        options: {
                            choiceOrder: [
                                'selPrjctBrand',
                                'selPrjctIndstrl',
                                'selPrjctHealth',
                                'selPrjctTech',
                            ],
                            choices: {
                                selPrjctBrand: {
                                    name: 'Brand identity',
                                    id: 'selPrjctBrand',
                                    color: 'cyanDark',
                                },
                                selPrjctIndstrl: {
                                    name: 'Industrial design',
                                    id: 'selPrjctIndstrl',
                                    color: 'redDark',
                                },
                                selPrjctHealth: {
                                    name: 'Healthcare design',
                                    id: 'selPrjctHealth',
                                    color: 'yellowDark',
                                },
                                selPrjctTech: {
                                    name: 'Technology design',
                                    id: 'selPrjctTech',
                                    color: 'greenDark',
                                },
                            },
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctCmplt',
                        name: 'Complete',
                        type: FieldType.CHECKBOX,
                        options: {
                            color: 'orange',
                            icon: 'check',
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctTasks',
                        name: 'Tasks',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            foreignTableId: 'tblTasks',
                            relationship: 'many',
                            symmetricColumnId: 'fldTaskProject',
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctLead',
                        name: 'Project lead',
                        type: FieldType.SINGLE_COLLABORATOR,
                        options: {
                            shouldNotify: true,
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctTeam',
                        name: 'Project team',
                        type: FieldType.MULTIPLE_COLLABORATORS,
                        options: {
                            shouldNotify: true,
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctDue',
                        name: 'Due date',
                        type: FieldType.DATE,
                        options: {
                            isDateTime: false,
                            dateFormat: 'Local',
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctKickoff',
                        name: 'Kickoff date',
                        type: FieldType.DATE,
                        options: {
                            isDateTime: false,
                            dateFormat: 'Local',
                        },
                        description: '',
                    },
                    {
                        id: 'fldPrjctNotes',
                        name: 'Notes',
                        type: FieldType.MULTILINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldPrjctImages',
                        name: 'Project images',
                        type: FieldType.MULTIPLE_ATTACHMENTS,
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
                    {
                        id: 'viwPrjctIncmplt',
                        name: 'Incomplete projects by leader',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                    {
                        id: 'viwPrjctCompleted',
                        name: 'Completed projects',
                        type: ViewType.GALLERY,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                    {
                        id: 'viwPrjctCalendar',
                        name: 'Project calendar',
                        type: ViewType.CALENDAR,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                    {
                        id: 'viwPrjctDueDates',
                        name: 'Due dates only',
                        type: ViewType.CALENDAR,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                ],
                records: [],
                description: 'description for design projects table',
            },
            {
                id: 'tblTasks',
                name: 'Tasks',
                fields: [
                    {
                        id: 'fldTaskName',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldTaskNotes',
                        name: 'Notes',
                        type: FieldType.MULTILINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldTaskProject',
                        name: 'Design project',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            foreignTableId: 'tblDesignProjects',
                            symmetricColumnId: 'fldPrjctTasks',
                            relationship: 'many',
                        },
                        description: '',
                    },
                    {
                        id: 'fldTaskTime',
                        name: 'Time estimate (days)',
                        type: FieldType.NUMBER,
                        options: {
                            format: 'decimal',
                            precision: 1,
                            negative: false,
                            validatorName: 'positive',
                        },
                        description: '',
                    },
                    {
                        id: 'fldTaskCompleted',
                        name: 'Completed',
                        type: FieldType.CHECKBOX,
                        options: {
                            color: 'gray',
                            icon: 'check',
                        },
                        description: '',
                    },
                    {
                        id: 'fldTaskAssignee',
                        name: 'Assignee',
                        type: FieldType.SINGLE_COLLABORATOR,
                        options: {
                            shouldNotify: true,
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
                records: [],
                description: '',
            },
            {
                id: 'tblClients',
                name: 'Clients',
                fields: [
                    {
                        id: 'fldClientName',
                        name: 'Name',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldClientAbout',
                        name: 'About',
                        type: FieldType.MULTILINE_TEXT,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldClientLogo',
                        name: 'Logo',
                        type: FieldType.MULTIPLE_ATTACHMENTS,
                        options: null,
                        description: '',
                    },
                    {
                        id: 'fldClientProjects',
                        name: 'Projects',
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            foreignTableId: 'tblDesignProjects',
                            symmetricColumnId: 'fldPrjctClient',
                            relationship: 'many',
                        },
                        description: '',
                    },
                ],
                views: [
                    {
                        id: 'viwClientAll',
                        name: 'All clients',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: [],
                            visibleFieldCount: 0,
                        },
                        records: [],
                    },
                ],
                records: [],
                description: '',
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
            {
                id: 'usrSamEpps',
                email: 'collab35@example.com',
                name: 'Sam Epps',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/ybh33aqqTrKhPFYFj47K_headshot-orange-2.png',
                isActive: false,
            },
            {
                id: 'usrParisFotiou',
                email: 'collab26@example.com',
                name: 'Paris Fotiou',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/xoafD4NRXGRLcx3qilRg_Screen%20Shot%202019-01-17%20at%201.20.14%20PM.png',
                isActive: false,
            },
            {
                id: 'usrBaileyMirza',
                email: 'collab5@example.com',
                name: 'Bailey Mirza',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png',
                isActive: false,
            },
            {
                id: 'usrJordanPeretz',
                email: 'collab16@example.com',
                name: 'Jordan Peretz',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png',
                isActive: false,
            },
            {
                id: 'usrLeslieWalker',
                email: 'collab23@example.com',
                name: 'Leslie Walker',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/zMyV7nBhTI0fwMiWOi6g_headshot-blue-1.png',
                isActive: false,
            },
            {
                id: 'usrAshQuintana',
                email: 'collab4@example.com',
                name: 'Ash Quintana',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png',
                isActive: false,
            },
            {
                id: 'usrSkylerXu',
                email: 'collab37@example.com',
                name: 'Skyler Xu',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/WB8Q1EQRTJW3YBfv403V_headshot-orange-1.png',
                isActive: false,
            },
            {
                id: 'usrCameronToth',
                email: 'collab7@example.com',
                name: 'Cameron Toth',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/1Paw52jFSLa7vRHwxCRd_headshot-pink-2.png',
                isActive: false,
            },
        ],
    },
};

export default projectTracker;
