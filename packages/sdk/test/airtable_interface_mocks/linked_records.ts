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
                primaryFieldId: 'fldPrimary',
                fieldsById: {
                    fldPrimary: {
                        id: 'fldPrimary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldLinked1: {
                        id: 'fldLinked1',
                        name: 'linked records',
                        type: 'multipleRecordLinks',
                        typeOptions: {
                            linkedTableId: 'tblSecond',
                            relationship: 'many',
                            symmetricColumnId: 'fldLinked2',
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
                primaryFieldId: 'fldPrimary',
                fieldsById: {
                    fldPrimary: {
                        id: 'fldPrimary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldSecondary: {
                        id: 'fldSecondary',
                        name: 'Name',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                    fldLinked2: {
                        id: 'fldLinked2',
                        name: 'linked records',
                        type: 'multipleRecordLinks',
                        typeOptions: {
                            linkedTableId: 'tblFirst',
                            relationship: 'many',
                            symmetricColumnId: 'fldLinked1',
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
