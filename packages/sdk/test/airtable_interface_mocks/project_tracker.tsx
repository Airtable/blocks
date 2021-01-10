import {BlockRunContextType, SdkInitData} from '../../src/types/airtable_interface';
import {ViewType} from '../../src/types/view';

const projectTracker: SdkInitData = {
    isDevelopmentMode: false,
    blockInstallationId: 'blicPfOILwejF6HL2',
    isFirstRun: false,
    isFullscreen: false,
    initialKvValuesByKey: {},
    runContext: {type: BlockRunContextType.DASHBOARD_APP},
    baseData: {
        id: 'app97Vimdj1OP7QKF',
        name: 'Project tracker',
        activeTableId: 'tblDesignProjects',
        tableOrder: ['tblDesignProjects', 'tblTasks', 'tblClients'],
        tablesById: {
            tblDesignProjects: {
                id: 'tblDesignProjects',
                name: 'Design projects',
                primaryFieldId: 'fldPrjctName',
                fieldsById: {
                    fldPrjctName: {
                        id: 'fldPrjctName',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldPrjctClient: {
                        id: 'fldPrjctClient',
                        name: 'Client',
                        type: 'foreignKey',
                        typeOptions: {
                            foreignTableId: 'tblClients',
                            relationship: 'many',
                            symmetricColumnId: 'fldClientProjects',
                        },
                        description: 'the project client',
                        lock: null,
                    },
                    fldPrjctCtgry: {
                        id: 'fldPrjctCtgry',
                        name: 'Category',
                        type: 'singleSelect',
                        typeOptions: {
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
                        lock: null,
                    },
                    fldPrjctCmplt: {
                        id: 'fldPrjctCmplt',
                        name: 'Complete',
                        type: 'checkbox',
                        typeOptions: {
                            color: 'orange',
                            icon: 'check',
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctTasks: {
                        id: 'fldPrjctTasks',
                        name: 'Tasks',
                        type: 'foreignKey',
                        typeOptions: {
                            foreignTableId: 'tblTasks',
                            relationship: 'many',
                            symmetricColumnId: 'fldTaskProject',
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctLead: {
                        id: 'fldPrjctLead',
                        name: 'Project lead',
                        type: 'collaborator',
                        typeOptions: {
                            shouldNotify: true,
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctTeam: {
                        id: 'fldPrjctTeam',
                        name: 'Project team',
                        type: 'multiCollaborator',
                        typeOptions: {
                            shouldNotify: true,
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctDue: {
                        id: 'fldPrjctDue',
                        name: 'Due date',
                        type: 'date',
                        typeOptions: {
                            isDateTime: false,
                            dateFormat: 'Local',
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctKickoff: {
                        id: 'fldPrjctKickoff',
                        name: 'Kickoff date',
                        type: 'date',
                        typeOptions: {
                            isDateTime: false,
                            dateFormat: 'Local',
                        },
                        description: '',
                        lock: null,
                    },
                    fldPrjctNotes: {
                        id: 'fldPrjctNotes',
                        name: 'Notes',
                        type: 'multilineText',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldPrjctImages: {
                        id: 'fldPrjctImages',
                        name: 'Project images',
                        type: 'multipleAttachment',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                },
                activeViewId: 'viwPrjctAll',
                viewOrder: [
                    'viwPrjctAll',
                    'viwPrjctIncmplt',
                    'viwPrjctCompleted',
                    'viwPrjctCalendar',
                    'viwPrjctDueDates',
                ],
                viewsById: {
                    viwPrjctAll: {
                        id: 'viwPrjctAll',
                        name: 'All projects',
                        type: ViewType.GRID,
                    },
                    viwPrjctIncmplt: {
                        id: 'viwPrjctIncmplt',
                        name: 'Incomplete projects by leader',
                        type: ViewType.GRID,
                    },
                    viwPrjctCompleted: {
                        id: 'viwPrjctCompleted',
                        name: 'Completed projects',
                        type: ViewType.GALLERY,
                    },
                    viwPrjctCalendar: {
                        id: 'viwPrjctCalendar',
                        name: 'Project calendar',
                        type: ViewType.CALENDAR,
                    },
                    viwPrjctDueDates: {
                        id: 'viwPrjctDueDates',
                        name: 'Due dates only',
                        type: ViewType.CALENDAR,
                    },
                },
                description: 'description for design projects table',
                lock: null,
                externalSyncById: null,
            },
            tblTasks: {
                id: 'tblTasks',
                name: 'Tasks',
                primaryFieldId: 'fldTaskName',
                fieldsById: {
                    fldTaskName: {
                        id: 'fldTaskName',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldTaskNotes: {
                        id: 'fldTaskNotes',
                        name: 'Notes',
                        type: 'multilineText',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldTaskProject: {
                        id: 'fldTaskProject',
                        name: 'Design project',
                        type: 'foreignKey',
                        typeOptions: {
                            foreignTableId: 'tblDesignProjects',
                            symmetricColumnId: 'fldPrjctTasks',
                            relationship: 'many',
                        },
                        description: '',
                        lock: null,
                    },
                    fldTaskTime: {
                        id: 'fldTaskTime',
                        name: 'Time estimate (days)',
                        type: 'number',
                        typeOptions: {
                            format: 'decimal',
                            precision: 1,
                            negative: false,
                            validatorName: 'positive',
                        },
                        description: '',
                        lock: null,
                    },
                    fldTaskCompleted: {
                        id: 'fldTaskCompleted',
                        name: 'Completed',
                        type: 'checkbox',
                        typeOptions: {
                            color: 'gray',
                            icon: 'check',
                        },
                        description: '',
                        lock: null,
                    },
                    fldTaskAssignee: {
                        id: 'fldTaskAssignee',
                        name: 'Assignee',
                        type: 'collaborator',
                        typeOptions: {
                            shouldNotify: true,
                        },
                        description: '',
                        lock: null,
                    },
                },
                activeViewId: null,
                viewOrder: ['viwTaskAll'],
                viewsById: {
                    viwTaskAll: {
                        id: 'viwTaskAll',
                        name: 'All tasks',
                        type: ViewType.GRID,
                    },
                },
                description: '',
                lock: null,
                externalSyncById: null,
            },
            tblClients: {
                id: 'tblClients',
                name: 'Clients',
                primaryFieldId: 'fldClientName',
                fieldsById: {
                    fldClientName: {
                        id: 'fldClientName',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldClientAbout: {
                        id: 'fldClientAbout',
                        name: 'About',
                        type: 'multilineText',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldClientLogo: {
                        id: 'fldClientLogo',
                        name: 'Logo',
                        type: 'multipleAttachment',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldClientProjects: {
                        id: 'fldClientProjects',
                        name: 'Projects',
                        type: 'foreignKey',
                        typeOptions: {
                            foreignTableId: 'tblDesignProjects',
                            symmetricColumnId: 'fldPrjctClient',
                            relationship: 'many',
                        },
                        description: '',
                        lock: null,
                    },
                },
                activeViewId: null,
                viewOrder: ['viwClientAll'],
                viewsById: {
                    viwClientAll: {
                        id: 'viwClientAll',
                        name: 'All clients',
                        type: ViewType.GRID,
                    },
                },
                description: '',
                lock: null,
                externalSyncById: null,
            },
        },
        permissionLevel: 'create',
        currentUserId: 'usrGalSamari',
        enabledFeatureNames: [],
        collaboratorsById: {
            usrGalSamari: {
                id: 'usrGalSamari',
                email: 'collab10@example.com',
                name: 'Gal Samari',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png',
            },
            usrSamEpps: {
                id: 'usrSamEpps',
                email: 'collab35@example.com',
                name: 'Sam Epps',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/ybh33aqqTrKhPFYFj47K_headshot-orange-2.png',
            },
            usrParisFotiou: {
                id: 'usrParisFotiou',
                email: 'collab26@example.com',
                name: 'Paris Fotiou',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/xoafD4NRXGRLcx3qilRg_Screen%20Shot%202019-01-17%20at%201.20.14%20PM.png',
            },
            usrBaileyMirza: {
                id: 'usrBaileyMirza',
                email: 'collab5@example.com',
                name: 'Bailey Mirza',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png',
            },
            usrJordanPeretz: {
                id: 'usrJordanPeretz',
                email: 'collab16@example.com',
                name: 'Jordan Peretz',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png',
            },
            usrLeslieWalker: {
                id: 'usrLeslieWalker',
                email: 'collab23@example.com',
                name: 'Leslie Walker',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/zMyV7nBhTI0fwMiWOi6g_headshot-blue-1.png',
            },
            usrAshQuintana: {
                id: 'usrAshQuintana',
                email: 'collab4@example.com',
                name: 'Ash Quintana',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png',
            },
            usrSkylerXu: {
                id: 'usrSkylerXu',
                email: 'collab37@example.com',
                name: 'Skyler Xu',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/WB8Q1EQRTJW3YBfv403V_headshot-orange-1.png',
            },
            usrCameronToth: {
                id: 'usrCameronToth',
                email: 'collab7@example.com',
                name: 'Cameron Toth',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/1Paw52jFSLa7vRHwxCRd_headshot-pink-2.png',
            },
        },
        activeCollaboratorIds: ['usrEcGMEnwYKUYIJQ', 'usrGalSamari'],
        cursorData: null,
        billingPlanGrouping: 'pro',
        appInterface: {},
        isBlockDevelopmentRestrictionEnabled: false,
    },
    intentData: null,
};

export default projectTracker;
