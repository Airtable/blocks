import {SdkInitData} from '../../src/types/airtable_interface';
import {ViewType} from '../../src/types/view';

const linkedRecords: SdkInitData = {
    isDevelopmentMode: false,
    blockInstallationId: 'blicPfOILwejF6HL2',
    isFirstRun: false,
    isFullscreen: false,
    initialKvValuesByKey: {},
    baseData: {
        id: 'app97Vimdj1OP7QKF',
        name: 'Linked Records Table',
        activeTableId: 'tblFirst',
        tableOrder: ['tblFirst', 'tblSecond'],
        tablesById: {
            tblFirst: {
                id: 'tblFirst',
                name: 'First Table',
                primaryFieldId: 'fld1stPrimary',
                fieldsById: {
                    fld1stPrimary: {
                        id: 'fld1stPrimary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fld1stLinked: {
                        id: 'fld1stLinked',
                        name: 'linked records',
                        type: 'multipleRecordLinks',
                        typeOptions: {
                            linkedTableId: 'tblSecond',
                            relationship: 'many',
                            symmetricColumnId: 'fld2ndLinked',
                            unreversed: true,
                        },
                        description: '',
                        lock: null,
                    },
                    fldMockLookup: {
                        id: 'fldMockLookup',
                        name: 'lookup',
                        type: 'multipleLookupValues',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                },
                activeViewId: 'viwPrjctAll',
                viewOrder: ['viwPrjctAll'],
                viewsById: {
                    viwPrjctAll: {
                        id: 'viwPrjctAll',
                        name: 'All projects',
                        type: ViewType.GRID,
                    },
                },
                description: '',
                lock: null,
                externalSyncById: null,
            },
            tblSecond: {
                id: 'tblSecond',
                name: 'Second Table',
                primaryFieldId: 'fld2ndPrimary',
                fieldsById: {
                    fld2ndPrimary: {
                        id: 'fld2ndPrimary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fld2ndSecondary: {
                        id: 'fld2ndSecondary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fld2ndLinked: {
                        id: 'fld2ndLinked',
                        name: 'linked records',
                        type: 'multipleRecordLinks',
                        typeOptions: {
                            linkedTableId: 'tblFirst',
                            relationship: 'many',
                            symmetricColumnId: 'fld1stLinked',
                            unreversed: true,
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
        },
        permissionLevel: 'create',
        currentUserId: 'usrCurrent',
        enabledFeatureNames: [],
        collaboratorsById: {
            usrGalSamari: {
                id: 'usrGalSamari',
                email: 'collab10@example.com',
                name: 'Gal Samari',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png',
            },
        },
        activeCollaboratorIds: ['usrEcGMEnwYKUYIJQ', 'usrCurrent'],
        cursorData: null,
        billingPlanGrouping: 'pro',
        appInterface: {},
        isBlockDevelopmentRestrictionEnabled: false,
    },
    intentData: null,
};

export default linkedRecords;
