import {SdkInitData, PartialViewData} from '../../src/types/airtable_interface';
import {BaseData, BaseId} from '../../src/types/base';
import {CollaboratorData} from '../../src/types/collaborator';
import {RecordData, RecordId} from '../../src/types/record';
import {keyBy, ObjectMap} from '../../src/private_utils';
import {TableId} from '../../src/types/table';
import {FieldId, FieldType} from '../../src/types/field';
import {ViewId, ViewType} from '../../src/types/view';
import Color from '../../src/colors';
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

export interface FixtureData {
    base: {
        id: BaseId;
        name: string;
        tables: Array<TableFixtureData>;
        collaborators: Array<CollaboratorData & {isActive: boolean}>;
    };
}

interface TableFixtureData {
    id: TableId;
    name: string;
    description: string | null;
    fields: Array<FieldFixtureData>;
    views: Array<ViewFixtureData>;
    records: Array<RecordFixtureData>;
}

interface FieldFixtureData {
    id: FieldId;
    name: string;
    description: string | null;
    type: FieldType;
    options: null | {[key: string]: unknown};
}

interface ViewFixtureData {
    id: ViewId;
    name: string;
    type: ViewType;
    fieldOrder: {
        fieldIds: Array<FieldId>;
        visibleFieldCount: number;
    };
    records: Array<ViewRecordFixtureData>;
}

interface ViewRecordFixtureData {
    id: RecordId;
    color: typeof Color | null;
}

interface RecordFixtureData {
    id: RecordId;
    commentCount: number;
    createdTime: string;
    cellValuesByFieldId: ObjectMap<FieldId, unknown>;
}

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

export default class MockAirtableInterfaceApp extends MockAirtableInterface {
    _recordDataStore: RecordDataStore;

    constructor(fixtureData: FixtureData) {
        const store: RecordDataStore = {
            tables: {},
            views: {},
        };
        const tables = fixtureData.base.tables.map(table => {
            if (table.id in store.tables) {
                throw new Error(`repeated table ID: ${table.id}`);
            }
            store.tables[table.id] = keyBy(table.records, getId);
            store.views[table.id] = {};

            for (const view of table.views) {
                if (view.id in store.views[table.id]) {
                    throw new Error(`repeated view ID: ${view.id}`);
                }

                for (const record of view.records) {
                    if (!(record.id in store.tables[table.id])) {
                        throw new Error(`record ${record.id} not present in table ${table.id}`);
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

    async fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: TableId,
        fieldIds: Array<FieldId>,
    ): Promise<any> {
        if (!(tableId in this._recordDataStore.tables)) {
            throw new Error(`table not present in fixture data: ${tableId}`);
        }

        for (const fieldId of fieldIds) {
            if (!(fieldId in this.sdkInitData.baseData.tablesById[tableId].fieldsById)) {
                throw new Error(`field ${fieldId} not present in table ${tableId}`);
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
            throw new Error(`table not present in fixture data: ${tableId}`);
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
            throw new Error(`table not present in fixture data: ${tableId}`);
        }
        const tableSchema = this.sdkInitData.baseData.tablesById[tableId];

        if (!(viewId in tableSchema.viewsById)) {
            throw new Error(`view not present in fixture data: ${viewId}`);
        }

        const viewData = this._recordDataStore.views[tableId][viewId];
        return {
            visibleRecordIds: viewData.records.map(({id}) => id),
            fieldOrder: viewData.fieldOrder,
            colorsByRecordId: {},
        };
    }
}
