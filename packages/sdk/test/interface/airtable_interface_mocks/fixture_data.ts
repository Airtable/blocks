import {
    type BaseId,
    type TableId,
    type FieldId,
    type RecordId,
} from '../../../src/shared/types/hyper_ids';
import {type TableData} from '../../../src/interface/types/table';
import {FieldType} from '../../../src/shared/types/field_core';
import {type FieldData} from '../../../src/interface/types/field';
import {type CollaboratorData} from '../../../src/shared/types/collaborator';
import {type ObjectMap, keyBy, getId} from '../../../src/shared/private_utils';
import {
    BlockRunContextType,
    type SdkInitData,
} from '../../../src/interface/types/airtable_interface';
import {type RecordData} from '../../../src/interface/types/record';

const MOCK_BLOCK_INSTALLATION_ID = 'blicPfOILwejF6HL2';
const MOCK_BLOCK_RUN_CONTEXT_TYPE = BlockRunContextType.PAGE_ELEMENT_IN_QUERY_CONTAINER;
const MOCK_PAGE_ID = 'pag0000KEVINWILDE';
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
        initialKvValuesByKey: {},
        runContext: {
            type: MOCK_BLOCK_RUN_CONTEXT_TYPE,
            pageId: MOCK_PAGE_ID,
            isPageElementInEditMode: false,
        },
        baseData: {
            id,
            name,
            color: color ?? MOCK_BASE_COLOR,
            tableOrder: tables.map((t) => t.id),
            tablesById: keyBy<TableData, string>(
                tables.map(convertTableFixtureDataToTableData),
                getId,
            ),
            permissionLevel: MOCK_BASE_PERMISSION_LEVEL,
            currentUserId: MOCK_CURRENT_USER_ID,
            enabledFeatureNames: [],
            collaboratorsById: keyBy(
                collaborators.map((c) => {
                    const {email, profilePicUrl} = c;
                    return {id: c.id, name: c.name, email, profilePicUrl};
                }),
                getId,
            ),
            activeCollaboratorIds: collaborators.filter((c) => c.isActive).map((c) => c.id),
            billingPlanGrouping: MOCK_BILLING_GROUP,
            appInterface: {},
            isBlockDevelopmentRestrictionEnabled: false,
            workspaceId: MOCK_WORKSPACE_ID,
        },
        intentData: null,
    };
}

function convertTableFixtureDataToTableData(tableFixtureData: TableFixtureData): TableData {
    const {id, name, description, fields, records} = tableFixtureData;
    return {
        id,
        name,
        description,
        primaryFieldId: fields[0].id,
        fieldsById: keyBy<FieldData, string>(fields.map(convertFieldFixtureDataToFieldData), getId),
        recordsById: keyBy<RecordData, string>(
            records.map(convertRecordFixtureDataToRecordData),
            getId,
        ),
        recordOrder: records.map((r) => r.id),
        lock: null,
        externalSyncById: null,
        isRecordExpansionEnabled: true,
        canCreateRecordsInline: true,
        canEditRecordsInline: true,
        canDestroyRecordsInline: true,
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
        isEditable: true,
        canCreateNewForeignRecords: type === FieldType.MULTIPLE_RECORD_LINKS ? true : undefined,
    };
}

function convertRecordFixtureDataToRecordData(recordFixtureData: RecordFixtureData): RecordData {
    const {id, createdTime, cellValuesByFieldId} = recordFixtureData;
    return {
        id,
        createdTime,
        cellValuesByFieldId,
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

/** A representation of the state of a Record */
interface RecordFixtureData {
    /** A unique identifier for the simulated Record */
    id: RecordId;
    /** The time the simulated record should appear to have been created */
    createdTime: string;
    /** A mapping of field identifiers to cell values */
    cellValuesByFieldId: ObjectMap<FieldId, unknown>;
}
