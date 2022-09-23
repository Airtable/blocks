import {
    BaseId,
    CollaboratorData,
    Color,
    GlobalConfigValue,
    FieldId,
    PermissionCheckResult,
    RecordActionData,
    RecordId,
    TableId,
    ViewId,
} from '@airtable/blocks/types';
import {
    AbstractMockAirtableInterface,
    AppInterface,
    BaseData,
    BlockRunContextType,
    CursorData,
    GlobalConfigArray,
    GlobalConfigData,
    GlobalConfigObject,
    GlobalConfigUpdate,
    FieldData,
    FieldType,
    ModelChange,
    Mutation,
    MutationTypes,
    PartialViewData,
    RecordData,
    RequestJson,
    ResponseJson,
    SdkInitData,
    ViewportSizeConstraint,
    ViewType,
} from '@airtable/blocks/unstable_testing_utils';
import {TestMutation, TestMutationTypes} from './test_mutations';
import {cloneDeep, has, keyBy, getId, ObjectMap} from './private_utils';
import {invariant, spawnError} from './error_utils';

const MutationTypeValues: ReadonlyArray<string> = Object.freeze(Object.values(MutationTypes));

const unmodifiableSdkData = {
    isDevelopmentMode: false,
    blockInstallationId: 'bliTESTING',
    isFirstRun: false,
    isFullscreen: false,
    intentData: null,
};

const unmodifiableBaseData = {
    enabledFeatureNames: [],
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
    isSynced: false,
};

/**
 * Prior to version 4.1, TypeScript's built-in type guard for the native
 * `Array.isArray` did not function correctly for values of type
 * `ReadonlyArray`. This helper provides the expected functionality for the
 * purposes of `setGlobalConfigValue`.
 * TODO: replace with `Array.isArray` in TypeScript 4.1 or later.
 *
 * @internal
 */
function isReadonlyArray(value: any): value is ReadonlyArray<any> {
    return Array.isArray(value);
}

/**
 * Determine whether a given Mutation is defined by the Blocks SDK (and used in
 * production scenarios) or defined by the blocks-testing library (and used
 * purely for simulation purposes).
 *
 * @internal
 */
function isAuthenticMutation(mutation: TestMutation): mutation is Mutation {
    return MutationTypeValues.includes(mutation.type);
}

const alphanumerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Select a random element from an array-like object.
 *
 * @internal
 */
function pick<T>(arraylike: {[key: number]: T; length: number}): T {
    return arraylike[Math.floor(Math.random() * arraylike.length)];
}

/** @internal */
function setGlobalConfigValue(
    target: GlobalConfigArray,
    path: ReadonlyArray<string>,
    value: GlobalConfigValue | undefined,
): GlobalConfigArray;
function setGlobalConfigValue(
    target: GlobalConfigValue,
    path: ReadonlyArray<string>,
    value: GlobalConfigValue | undefined,
): GlobalConfigObject;
function setGlobalConfigValue(
    target: GlobalConfigValue,
    path: ReadonlyArray<string>,
    value: GlobalConfigValue | undefined,
): GlobalConfigObject | GlobalConfigArray {
    if (isReadonlyArray(target)) {
        const newTarget = target.slice();
        const index = parseInt(path[0], 10);

        if (path.length === 1) {
            if (value === undefined) {
                newTarget.splice(index, 1);
            } else {
                newTarget[index] = value;
            }
        } else {
            newTarget[index] = setGlobalConfigValue(target[index] || {}, path.slice(1), value);
        }
        return newTarget;
    }
    const newTarget = typeof target === 'object' ? {...target} : {};

    if (path.length === 1) {
        if (value === undefined) {
            delete newTarget[path[0]];
        } else {
            newTarget[path[0]] = value;
        }
    } else {
        newTarget[path[0]] = setGlobalConfigValue(newTarget[path[0]] || {}, path.slice(1), value);
    }
    return newTarget;
}

/**
 * A mapping relating the names of event subscriptions available on
 * {@link TestDriver} instances to the arguments that are provided when one of
 * those events is triggered.
 */
export interface WatchableKeysAndArgs {
    /**
     * Triggered whenever the SDK has been induced to persist a change to the
     * Base.
     */
    mutation: Mutation;
    /**
     * Triggered when the SDK has been induced to expand a Record in the user
     * interface
     */
    expandRecord: {recordId: RecordId; recordIds: Array<RecordId> | null};
    /**
     * Triggered when the SDK has been induced to enter full screen mode.
     */
    enterFullscreen: null;
    /**
     * Triggered when the SDK has been induced to exit full screen mode.
     */
    exitFullscreen: null;
    /**
     * Triggered when the maximum full screen size is modified.
     */
    setFullscreenMaxSize: ViewportSizeConstraint;
    /**
     * Triggered when the SDK has been induced to expand a list of Records in
     * the user interface.
     */
    expandRecordList: {
        tableId: string;
        recordIds: Array<string>;
        fieldIds: Array<string> | null;
    };
}

/**
 * A complete set of information necessary to initialize a simulated Airtable
 * Base in automated test environments.
 */
export interface FixtureData {
    /**
     * An optional object describing the initial state of the globalConfig
     * which is associated with the simulated Base. If omitted, the Base's
     * globalConfig will be initially empty.
     */
    globalConfig?: GlobalConfigData;
    /** A representation of the state of an Airtable Base */
    base: {
        id: BaseId;
        name: string;
        color?: string;
        tables: Array<TableFixtureData>;
        collaborators: Array<CollaboratorData & {isActive: boolean}>;
        workspaceId: string;
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
    /**
     * A boolean determining if a view is locked
     */
    isLockedView: boolean;
}

/**
 * A reference to Record contained within a simulated view. This is distinct
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

/** @hidden */
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

/**
 * A callback function allowing tests to simulate user interaction with the
 * expanded record picker UI. The testing library will invoke this function
 * whenever the Extension under test uses the {@link expandRecordPickerAsync}
 * function, and the return value of this function will be provided to the Extension
 * under test as the {@link Record} that the simulated user selected.
 */
export type PickRecord = (
    tableId: string,
    recordIds: Array<string>,
    fieldIds: Array<string> | null,
    shouldAllowCreatingRecord: boolean,
) => RecordId | null;

const generateGenericId = () => {
    const length = 10 + Math.floor(Math.random() * 10);
    return Array.from({length})
        .map(() => pick(alphanumerics))
        .join('');
};

/**
 * An implementation of the MockAirtableInterface designed for use in automated
 * test suites for Airtable Blocks maintained externally. Provides a more
 * high-level constructor for specifying test fixture data and implements some
 * features which approximate interactions with Hyperbase in production.
 *
 * @hidden
 */
export default class MockAirtableInterface extends AbstractMockAirtableInterface {
    _recordDataStore: RecordDataStore;
    _userPermissionCheck?: (mutation: Mutation) => boolean;
    _pickRecord?: PickRecord;

    constructor(unsafeFixtureData: FixtureData) {
        const fixtureData = cloneDeep(unsafeFixtureData);
        const store: RecordDataStore = {
            tables: {},
            views: {},
        };

        if (!fixtureData.base.tables || !fixtureData.base.tables.length) {
            throw spawnError('Fixture data must include at least one table');
        }

        const tables = fixtureData.base.tables.map(table => {
            if (table.id in store.tables) {
                throw spawnError('repeated table ID: %s', table.id);
            }
            store.tables[table.id] = keyBy(table.records, getId);
            store.views[table.id] = {};

            if (!table.fields || !table.fields.length) {
                throw spawnError(
                    'Every table in fixture data must specify at least one field, but table "%s" specified zero fields',
                    table.id,
                );
            }

            table.fields
                .map(({id}) => id)
                .forEach((id, index, ids) => {
                    if (ids.indexOf(id) !== index) {
                        throw spawnError('repeated field ID: %s', id);
                    }
                });

            if (!table.views || !table.views.length) {
                throw spawnError(
                    'Every table in fixture data must specify at least one view, but table "%s" specified zero views',
                    table.id,
                );
            }

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
            initialKvValuesByKey: fixtureData.globalConfig || {},
            baseData: {
                ...(unmodifiableBaseData as Pick<BaseData, keyof typeof unmodifiableBaseData>),
                id: fixtureData.base.id,
                name: fixtureData.base.name,
                color: fixtureData.base.color || 'gray',
                activeTableId: tables[0].id,
                tableOrder: tables.map(({id}) => id),
                tablesById: keyBy(tables, getId),
                currentUserId: fixtureData.base.collaborators[0].id,
                cursorData: {
                    selectedRecordIdSet: {},
                    selectedFieldIdSet: {},
                },
                collaboratorsById: keyBy(fixtureData.base.collaborators, getId),
                activeCollaboratorIds: fixtureData.base.collaborators
                    .filter(({isActive}) => isActive)
                    .map(({id}) => id),
                workspaceId: fixtureData.base.workspaceId,
            },
            runContext: {type: BlockRunContextType.DASHBOARD_APP},
        };

        super(sdkInitData);
        this._recordDataStore = store;
    }

    async applyMutationAsync(mutation: TestMutation, opts?: {holdForMs?: number}): Promise<void> {
        if (mutation.type === TestMutationTypes.DELETE_SINGLE_FIELD) {
            const tableData = this.sdkInitData.baseData.tablesById[mutation.tableId];

            invariant(
                tableData.primaryFieldId !== mutation.id,
                "A table's primary field may not be deleted.",
            );
            const viewUpdates = Object.values(tableData.viewsById)
                .filter(view => {
                    return view.fieldOrder && view.fieldOrder.fieldIds.includes(mutation.id);
                })
                .map(view => {
                    const fieldOrder = view.fieldOrder;
                    invariant(fieldOrder, 'View must define a field ordering');
                    const index = fieldOrder.fieldIds.indexOf(mutation.id);
                    const fieldIds = fieldOrder.fieldIds.slice();
                    fieldIds.splice(index, 1);
                    const visibleFieldCount =
                        index < fieldOrder.visibleFieldCount
                            ? fieldOrder.visibleFieldCount - 1
                            : fieldOrder.visibleFieldCount;
                    return {
                        path: ['tablesById', mutation.tableId, 'viewsById', view.id, 'fieldOrder'],
                        value: {fieldIds, visibleFieldCount},
                    };
                });

            viewUpdates.forEach(({path, value}) => {
                const view = this._recordDataStore.views[path[1]][path[3]];
                invariant(view, 'Internal update must reference existing view');
                view.fieldOrder = value;
            });

            this.triggerModelUpdates([
                {
                    path: ['tablesById', mutation.tableId, 'fieldsById', mutation.id],
                    value: undefined,
                },
                ...viewUpdates,
            ]);
        } else if (mutation.type === TestMutationTypes.CREATE_SINGLE_TABLE) {
            const fieldData = mutation.fields.map(field => {
                return {
                    id: this.idGenerator.generateFieldId(),
                    name: field.name,
                    description: '',
                    type: field.config.type,
                    typeOptions: field.config.options,
                    ...unmodifiableFieldData,
                };
            });
            const viewData = {
                id: generateGenericId(),
                name: 'Dynamically-generated Grid view',
                type: ViewType.GRID,
                fieldOrder: {
                    fieldIds: fieldData.map(({id}) => id),
                    visibleFieldCount: fieldData.length,
                },
            };

            this.triggerModelUpdates([
                {
                    path: ['tablesById', mutation.id],
                    value: {
                        id: mutation.id,
                        name: mutation.name,
                        primaryFieldId: fieldData[0].id,
                        viewOrder: [viewData.id],
                        viewsById: {
                            [viewData.id]: viewData,
                        },
                        fieldsById: keyBy(fieldData, getId),
                        ...unmodifiableTableData,
                    },
                },
                {
                    path: ['tableOrder'],
                    value: this.sdkInitData.baseData.tableOrder.concat(mutation.id),
                },
            ]);
            this._recordDataStore.tables[mutation.id] = {};
            this._recordDataStore.views[mutation.id] = {
                [viewData.id]: {
                    fieldOrder: viewData.fieldOrder,
                    records: [],
                },
            };
        } else if (mutation.type === TestMutationTypes.CREATE_MULTIPLE_RECORDS) {
            Object.assign(
                this._recordDataStore.tables[mutation.tableId],
                keyBy(mutation.records, getId),
            );
        } else if (mutation.type === TestMutationTypes.DELETE_SINGLE_VIEW) {
            const tableData = this.sdkInitData.baseData.tablesById[mutation.tableId];

            invariant(
                tableData.viewOrder.length > 1,
                'The view in a table with one view may not be deleted',
            );

            const newOrder = tableData.viewOrder.filter(id => id !== mutation.id);

            delete this._recordDataStore.views[mutation.id];

            const updates: Array<ModelChange> = [
                {
                    path: ['tablesById', mutation.tableId, 'viewOrder'],
                    value: newOrder,
                },
                {
                    path: ['tablesById', mutation.tableId, 'viewsById', mutation.id],
                    value: undefined,
                },
            ];

            if (
                mutation.id === this.sdkInitData.baseData.tablesById[mutation.tableId].activeViewId
            ) {
                updates.push({
                    path: ['tablesById', mutation.tableId, 'activeViewId'],
                    value: newOrder[0],
                });
            }

            this.triggerModelUpdates(updates);
        }

        if (isAuthenticMutation(mutation)) {
            if (
                mutation.type === TestMutationTypes.CREATE_MULTIPLE_RECORDS ||
                mutation.type === TestMutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES
            ) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {opts: _internalOpts, ...mainMutation} = mutation;
                this.emit('mutation', mainMutation);
                return;
            }
            this.emit('mutation', mutation);
        }
    }

    checkPermissionsForMutation(mutation: Mutation): PermissionCheckResult {
        if (!this._userPermissionCheck || this._userPermissionCheck(mutation)) {
            return {
                hasPermission: true,
            };
        }
        return {
            hasPermission: false,
            reasonDisplayString:
                'The testing environment has been configured to deny this mutation.',
        };
    }

    get globalConfigHelpers() {
        const globalConfigHelpers = super.globalConfigHelpers;

        globalConfigHelpers.validateAndApplyUpdates = (
            updates: ReadonlyArray<GlobalConfigUpdate>,
            store: GlobalConfigData,
        ) => {
            const changedTopLevelKeys = new Set<string>();
            let newKvStore = {...store};
            for (const update of updates) {
                changedTopLevelKeys.add(update.path[0]);
                newKvStore = setGlobalConfigValue(newKvStore, update.path, update.value);
            }

            return {
                newKvStore,
                changedTopLevelKeys: Array.from(changedTopLevelKeys),
            };
        };

        return globalConfigHelpers;
    }

    emit<Key extends keyof WatchableKeysAndArgs>(key: Key, data: WatchableKeysAndArgs[Key]) {
        super.emit(key, data);
    }

    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null) {
        this.emit('expandRecord', {recordId, recordIds});
    }

    expandRecordList(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
    ): void {
        this.emit('expandRecordList', {tableId, recordIds, fieldIds});
    }

    async expandRecordPickerAsync(
        tableId: string,
        recordIds: Array<string>,
        fieldIds: Array<string> | null,
        shouldAllowCreatingRecord: boolean,
    ): Promise<string | null> {
        if (!this._pickRecord) {
            throw spawnError(
                'Unable to simulate user record selection for `expandRecordPickerAsync`. The test environment must be configured with the record to select before this method is called.',
            );
        }

        return this._pickRecord(tableId, recordIds, fieldIds, shouldAllowCreatingRecord);
    }

    get fieldTypeProvider() {
        const fieldTypeProvider = super.fieldTypeProvider;

        fieldTypeProvider.convertCellValueToString = (
            appInterface: AppInterface,
            cellValue: unknown,
            fieldData: FieldData,
        ): string => {
            if (cellValue === null) {
                return '';
            }

            if (Array.isArray(cellValue)) {
                return cellValue
                    .map((item: unknown) => {
                        return fieldTypeProvider.convertCellValueToString(
                            appInterface,
                            item,
                            fieldData,
                        );
                    })
                    .join(', ');
            }

            if (
                typeof cellValue === 'object' &&
                cellValue !== null &&
                has(cellValue, 'name')
            ) {
                const named = cellValue as {name: any};

                if (typeof named.name === 'string') {
                    return named.name;
                }
            }

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

    async fetchAndSubscribeToCursorDataAsync(): Promise<CursorData> {
        const cursorData = this.sdkInitData.baseData.cursorData;
        const selectedRecordIdSet = Object.assign({}, cursorData && cursorData.selectedRecordIdSet);

        return {
            selectedRecordIdSet,
            selectedFieldIdSet: {},
        };
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

    hasRecord(tableId: TableId, recordId: RecordId): boolean {
        const recordsById = this._recordDataStore.tables[tableId];

        return recordsById && recordId in recordsById;
    }

    get idGenerator() {
        const idGenerator = super.idGenerator;

        idGenerator.generateRecordId = generateGenericId;
        idGenerator.generateFieldId = generateGenericId;

        return idGenerator;
    }

    on<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        super.on(key, fn);
    }

    off<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        super.off(key, fn);
    }

    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint) {
        this.emit('setFullscreenMaxSize', maxFullscreenSize);
    }

    setPickRecord(pickRecord: PickRecord) {
        this._pickRecord = pickRecord;
    }

    setUserPermissionCheck(check: (mutation: Mutation) => boolean) {
        this._userPermissionCheck = check;
    }

    async performBackendFetchAsync(requestJson: RequestJson): Promise<ResponseJson> {
        throw spawnError(
            'Backend fetch is not currently supported in the blocks testing environment.',
        );
    }

    async fetchDefaultCellValuesByFieldIdAsync(): Promise<{[key: string]: unknown}> {
        return {};
    }
    reloadFrame() {}
    setSettingsButtonVisibility() {}
    setUndoRedoMode() {}

    enterFullscreen() {
        this.emit('enterFullscreen', null);
    }

    exitFullscreen() {
        this.emit('exitFullscreen', null);
    }

    async fetchAndSubscribeToPerformRecordActionAsync(): Promise<RecordActionData | null> {
        return null;
    }
    trackEvent() {}

    /**
     * `trackExposure` cannot be invoked by any Extensions (neither those authored by
     * Airtable nor by other Extension developers). It should be implemented to
     * satisfy the AirtableInterface contract, but the implementation should
     * not throw because it must be successful for Extensions to function. Likewise,
     * it should not emit an event because test authors have no need to track
     * its usage.
     */
    trackExposure() {}

    sendStat() {}
}
