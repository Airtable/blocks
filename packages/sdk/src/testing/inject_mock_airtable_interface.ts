import {ViewType} from '../types/view';
import {BlockRunContextType} from '../types/airtable_interface';
import MockAirtableInterface from './mock_airtable_interface';

const vacantAirtableInterface = new MockAirtableInterface({
    isDevelopmentMode: false,
    blockInstallationId: 'bliVACANTFORTESTING',
    isFirstRun: false,
    isFullscreen: false,
    initialKvValuesByKey: {},
    baseData: {
        id: 'appVACANTFORTESTING',
        name: 'Vacant Base intended for use in automated testing environments only',
        activeTableId: 'tblVACANTFORTESTING',
        tableOrder: ['tblVACANTFORTESTING'],
        tablesById: {
            tblVACANTFORTESTING: {
                id: 'tblVACANTFORTESTING',
                name: 'Vacant table intended for use in automated testing environments only',
                primaryFieldId: 'fldVACANTFORTESTING',
                fieldsById: {
                    fldVACANTFORTESTING: {
                        id: 'fldVACANTFORTESTING',
                        name:
                            'Vacant field intended for use in automated testing environments only',
                        type: 'text',
                        typeOptions: null,
                        description: '',
                        lock: null,
                    },
                },
                activeViewId: 'viwVACANTFORTESTING',
                viewOrder: ['viwVACANTFORTESTING'],
                viewsById: {
                    viwVACANTFORTESTING: {
                        id: 'viwVACANTFORTESTING',
                        name: 'Vacant view intended for use in automated testing environments only',
                        type: ViewType.GRID,
                    },
                },
                description: 'Vacant table intended for use in automated testing environments only',
                lock: null,
                externalSyncById: null,
            },
        },
        permissionLevel: 'create',
        currentUserId: 'usrVACANTFORTESTING',
        enabledFeatureNames: [],
        collaboratorsById: {},
        activeCollaboratorIds: [],
        cursorData: null,
        billingPlanGrouping: 'pro',
        appInterface: {},
        isBlockDevelopmentRestrictionEnabled: false,
    },
    runContext: {type: BlockRunContextType.DASHBOARD_APP},
    intentData: null,
});

(window as any).__getAirtableInterfaceAtVersion = () => vacantAirtableInterface;
