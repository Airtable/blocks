import {BaseId} from '../../src/types/base';
import {TableId, TableData} from '../../src/types/table';
import {FieldId, FieldType, FieldData} from '../../src/types/field';
import {ViewData, ViewId, ViewType} from '../../src/types/view';
import {RecordId} from '../../src/types/record';
import {CollaboratorData} from '../../src/types/collaborator';
import {Color} from '../../src/colors';
import {ObjectMap, keyBy, getId} from '../../src/private_utils';
import {BlockRunContextType, SdkInitData} from '../../src/types/airtable_interface';

const MOCK_BLOCK_INSTALLATION_ID = 'blicPfOILwejF6HL2';
const MOCK_BLOCK_RUN_CONTEXT_TYPE = BlockRunContextType.DASHBOARD_APP;
const MOCK_BASE_PERMISSION_LEVEL = 'create';
const MOCK_CURRENT_USER_ID = 'usrGalSamari';
const MOCK_BASE_COLOR = 'purple';
const MOCK_BILLING_GROUP = 'pro';
const MOCK_WORKSPACE_ID = 'wspUai0ZmWFWfSBtb';

export function convertFixtureDataToSdkInitData(fixtureData: FixtureData): SdkInitData {
    const {
        base: {id, name, color, tables, collaborators},
    } = fixtureData;
    return {
        isDevelopmentMode: false,
        blockInstallationId: MOCK_BLOCK_INSTALLATION_ID,
        isFirstRun: false,
        isFullscreen: false,
        initialKvValuesByKey: {},
        runContext: {type: MOCK_BLOCK_RUN_CONTEXT_TYPE},
        baseData: {
            id,
            name,
            color: color ?? MOCK_BASE_COLOR,
            activeTableId: tables[0].id,
            tableOrder: tables.map(t => t.id),
            tablesById: keyBy<TableData, string>(
                tables.map(convertTableFixtureDataToTableData),
                getId,
            ),
            permissionLevel: MOCK_BASE_PERMISSION_LEVEL,
            currentUserId: MOCK_CURRENT_USER_ID,
            enabledFeatureNames: [],
            collaboratorsById: keyBy(
                collaborators.map(c => {
                    const {email, profilePicUrl} = c;
                    return {id: c.id, name: c.name, email, profilePicUrl};
                }),
                getId,
            ),
            activeCollaboratorIds: collaborators.filter(c => c.isActive).map(c => c.id),
            cursorData: null,
            billingPlanGrouping: MOCK_BILLING_GROUP,
            appInterface: {},
            isBlockDevelopmentRestrictionEnabled: false,
            workspaceId: MOCK_WORKSPACE_ID,
        },
        intentData: null,
    };
}

function convertViewFixtureDataToViewData(viewFixtureData: ViewFixtureData): ViewData {
    return {
        ...viewFixtureData,
        isLockedView: !!viewFixtureData.isLockedView,
    };
}

function convertTableFixtureDataToTableData(tableFixtureData: TableFixtureData): TableData {
    const {id, name, description, fields, views} = tableFixtureData;
    return {
        id,
        name,
        description,
        primaryFieldId: fields[0].id,
        fieldsById: keyBy<FieldData, string>(fields.map(convertFieldFixtureDataToFieldData), getId),
        activeViewId: views[0].id,
        viewOrder: views.map(v => v.id),
        viewsById: keyBy(views.map(convertViewFixtureDataToViewData), getId),
        recordsById: undefined, 
        lock: null,
        externalSyncById: null,
    };
}

function convertFieldFixtureDataToFieldData(fieldFixtureData: FieldFixtureData): FieldData {
    const {id, name, description, type, options} = fieldFixtureData;
    return {
        id,
        name,
        type,
        description,
        typeOptions: options,
        lock: null,
        isSynced: false,
    };
}

/**
 * A complete set of information necessary to initialize a simulated Airtable
 * Base in automated test environments. This is currently copied from
 * block-testing.
 * TODO(fredz): consider moving this into src/testing and exporting it as
 * part of unstable_testing_utils.
 *
 * Unlike SdkInitData which does not contain record data by design,
 * FixtureData contains it in fixtureData.base.tables[number].records,
 * and relies on dependent modules to simulate the hyperbase behavior of
 * only making those records after corresponding necessary calls to
 * AirtableInterface.
 */
export interface FixtureData {
    /** A representation of the state of an Airtable Base */
    base: {
        id: BaseId;
        name: string;
        color?: string;
        tables: Array<TableFixtureData>;
        collaborators: Array<CollaboratorData & {isActive: boolean}>;
    };
}

/** A representation of the state of a Table */
interface TableFixtureData {
    /** A unique identifier for the simulated Table */
    id: TableId;
    /** The name to assign to the simulated Table */
    name: string;
    /** The description to assign to the simulated Table */
    description: string | null;
    /**
     * Fixture data for the simulated Fields that should be present in the
     * simulated Table when it is initialized.
     */
    fields: Array<FieldFixtureData>;
    /**
     * Fixture data for the simulated Views that should be present in the
     * simulated Table when it is initialized.
     */
    views: Array<ViewFixtureData>;
    /**
     * Fixture data for the simulated Records that should be present in the
     * simulated Table when it is initialized.
     */
    records: Array<RecordFixtureData>;
}

/** A representation of the state of a Field */
interface FieldFixtureData {
    /** A unique identifier for the simulated Field */
    id: FieldId;
    /** The name to assign to the simulated Field */
    name: string;
    /** The description to assign to the simulated Field */
    description: string | null;
    /** The type of the simulated Field */
    type: FieldType;
    /** Options associated with the simulated Field */
    options: null | {[key: string]: unknown};
}

/** A representation of the state of a View */
interface ViewFixtureData {
    /** A unique identifier for the simulated View */
    id: ViewId;
    /** The name to assign to the simulated View */
    name: string;
    /** The type of the simulated view */
    type: ViewType;
    /**
     * A description of how simulated Fields should be sequenced within the
     * simulated View
     */
    fieldOrder: {
        fieldIds: Array<FieldId>;
        visibleFieldCount: number;
    };
    /**
     * A set of references to Records contained within the simulated view. This
     * is distinct from the complete fixture data for the simulated Records.
     */
    records: Array<ViewRecordFixtureData>;
    /**
     * Optional boolean denoting if the view is locked. By default tests assume
     * the view is unlocked if undefined.
     */
    isLockedView?: boolean;
}

/**
 * A reference to Record contained within a simulated view. This is disctinct
 * from the complete fixture data for the simulated Record.
 */
interface ViewRecordFixtureData {
    /** A value which uniquely identifies a Record within a base. */
    id: RecordId;
    /** The color associated with a Record's membership in a View. */
    color: Color | null;
}

/** A representation of the state of a Record */
interface RecordFixtureData {
    /** A unique identifier for the simulated Record */
    id: RecordId;
    /** The number of comments to assign to the simulated record */
    commentCount: number;
    /** The time the simulated record should appear to have been created */
    createdTime: string;
    /** A mapping of field identifiers to cell values */
    cellValuesByFieldId: ObjectMap<FieldId, unknown>;
}
