import {AppInterface, SdkInitData, PartialViewData} from '../types/airtable_interface';
import {BaseData, BaseId} from '../types/base';
import {CollaboratorData} from '../types/collaborator';
import {Mutation} from '../types/mutations';
import {RecordData, RecordId} from '../types/record';
import {keyBy, ObjectMap} from '../private_utils';
import {TableId} from '../types/table';
import {FieldId, FieldType} from '../types/field';
import {ViewId, ViewType} from '../types/view';
import Color from '../colors';
import {spawnError} from '../error_utils';
import MockAirtableInterface from './mock_airtable_interface';

const unmodifiableSdkData = {
    isDevelopmentMode: false,
    blockInstallationId: 'bliTESTING',
    isFirstRun: false,
    isFullscreen: false,
    initialKvValuesByKey: {},
    intentData: null,
};

const unmodifiableBaseData = {
    enabledFeatureNames: [],
    cursorData: null,
    billingPlanGrouping: 'pro',
    permissionLevel: 'create',
    appInterface: {},
    isBlockDevelopmentRestrictionEnabled: false,
};

const unmodifiableTableData = {
    lock: null,
    externalSyncById: null,
};

const unmodifiableFieldData = {
    lock: null,
};

/**
 * A complete set of information necessary to initialize a simulated Airtable
 * Base in automated test environments.
 */
export interface FixtureData {
    /** A representation of the state of an Airtable Base */
    base: {
        id: BaseId;
        name: string;
        tables: Array<TableFixtureData>;
        collaborators: Array<CollaboratorData & {isActive: boolean}>;
    };
}

/** A representation of the state of a Table */
interface TableFixtureData {
    /** A unique identifier for the simulated Tbale */
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
}

/** @hidden */
interface ViewRecordFixtureData {
    id: RecordId;
    color: typeof Color | null;
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

/** @internal */
interface RecordDataStore {
    tables: {
        [key: string]: {
            [key: string]: RecordFixtureData;
        };
    };
    views: {
        [key: string]: {
            [key: string]: Pick<ViewFixtureData, 'fieldOrder' | 'records'>;
        };
    };
}

const getId = ({id}: {id: string}) => id;

/**
 * An implementation of the MockAirtableInterface designed for use in automated
 * test suites for Airtable Blocks maintained externally. Provides a more
 * high-level constructor for specifying test fixture data and implements some
 * features which approximate interactions with Hyperbase in production.
 *
 * @internal
 */
export default class MockAirtableInterfaceExternal extends MockAirtableInterface {
    _recordDataStore: RecordDataStore;

    constructor(fixtureData: FixtureData) {
        const store: RecordDataStore = {
            tables: {},
            views: {},
        };
        const tables = fixtureData.base.tables.map(table => {
            if (table.id in store.tables) {
                throw spawnError('repeated table ID: %s', table.id);
            }
            store.tables[table.id] = keyBy(table.records, getId);
            store.views[table.id] = {};

            for (const view of table.views) {
                if (view.id in store.views[table.id]) {
                    throw spawnError('repeated view ID: %s', view.id);
                }

                for (const record of view.records) {
                    if (!(record.id in store.tables[table.id])) {
                        throw spawnError('record %s not present in table %s', record.id, table.id);
                    }
                }
                store.views[table.id][view.id] = {
                    fieldOrder: view.fieldOrder,
                    records: view.records,
                };
            }

            return {
                ...unmodifiableTableData,
                id: table.id,
                name: table.name,
                description: table.description,
                fieldsById: keyBy(
                    table.fields.map(field => ({
                        ...field,
                        typeOptions: field.options,
                        ...unmodifiableFieldData,
                    })),
                    getId,
                ),
                primaryFieldId: table.fields[0].id,
                viewsById: keyBy(table.views, getId),
                activeViewId: table.views[0].id,
                viewOrder: table.views.map(({id}) => id),
            };
        });

        const sdkInitData: SdkInitData = {
            ...unmodifiableSdkData,
            baseData: {
                ...(unmodifiableBaseData as Pick<BaseData, keyof typeof unmodifiableBaseData>),
                id: fixtureData.base.id,
                name: fixtureData.base.name,
                activeTableId: tables[0].id,
                tableOrder: tables.map(({id}) => id),
                tablesById: keyBy(tables, getId),
                currentUserId: fixtureData.base.collaborators[0].id,
                collaboratorsById: keyBy(fixtureData.base.collaborators, getId),
                activeCollaboratorIds: fixtureData.base.collaborators
                    .filter(({isActive}) => isActive)
                    .map(({id}) => id),
            },
        };

        super(sdkInitData);
        this._recordDataStore = store;
    }

    async applyMutationAsync(mutation: Mutation, opts?: {holdForMs?: number}): Promise<void> {
        this.emit('mutation', mutation);
    }

    get fieldTypeProvider() {
        const fieldTypeProvider = super.fieldTypeProvider;

        fieldTypeProvider.convertCellValueToString = (
            appInterface: AppInterface,
            cellValue: unknown,
        ) => {
            return String(cellValue);
        };

        return fieldTypeProvider;
    }

    async fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: TableId,
        fieldIds: Array<FieldId>,
    ): Promise<any> {
        if (!(tableId in this._recordDataStore.tables)) {
            throw spawnError('table not present in fixture data: %s', tableId);
        }

        for (const fieldId of fieldIds) {
            if (!(fieldId in this.sdkInitData.baseData.tablesById[tableId].fieldsById)) {
                throw spawnError('field %s not present in table %s', fieldId, tableId);
            }
        }

        const recordsById: ObjectMap<RecordId, RecordData> = {};
        for (const record of Object.values(this._recordDataStore.tables[tableId])) {
            const cellValuesByFieldId: RecordData['cellValuesByFieldId'] = {};
            for (const fieldId of fieldIds) {
                cellValuesByFieldId[fieldId] = record.cellValuesByFieldId[fieldId];
            }
            recordsById[record.id] = {
                ...record,
                cellValuesByFieldId,
            };
        }

        return {recordsById};
    }

    async fetchAndSubscribeToTableDataAsync(
        tableId: string,
    ): Promise<{recordsById: {[recordId: string]: RecordData}}> {
        if (!(tableId in this._recordDataStore.tables)) {
            throw spawnError('table not present in fixture data: %s', tableId);
        }

        return {
            recordsById: this._recordDataStore.tables[tableId],
        };
    }

    async fetchAndSubscribeToViewDataAsync(
        tableId: string,
        viewId: string,
    ): Promise<PartialViewData> {
        if (!(tableId in this.sdkInitData.baseData.tablesById)) {
            throw spawnError('table not present in fixture data: %s', tableId);
        }
        const tableSchema = this.sdkInitData.baseData.tablesById[tableId];

        if (!(viewId in tableSchema.viewsById)) {
            throw spawnError('view not present in fixture data: %s', viewId);
        }

        const viewData = this._recordDataStore.views[tableId][viewId];
        return {
            visibleRecordIds: viewData.records.map(({id}) => id),
            fieldOrder: viewData.fieldOrder,
            colorsByRecordId: {},
        };
    }
}
