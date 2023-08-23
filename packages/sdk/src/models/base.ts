/** @module @airtable/blocks/models: Base */ /** */
import {BaseData, ModelChange} from '../types/base';
import {CollaboratorData, UserId} from '../types/collaborator';
import {FieldType} from '../types/field';
import {MutationTypes, PermissionCheckResult} from '../types/mutations';
import {TableId} from '../types/table';
import {isEnumValue, entries, isDeepEqual, ObjectValues, ObjectMap, has} from '../private_utils';
import {spawnError, invariant} from '../error_utils';
import Sdk from '../sdk';
import Table from './table';
import RecordStore from './record_store';
import AbstractModel from './abstract_model';


const WatchableBaseKeys = Object.freeze({
    name: 'name' as const,
    tables: 'tables' as const,
    collaborators: 'collaborators' as const,
    schema: 'schema' as const,
    color: 'color' as const,
});

/**
 * Any key in base that can be watched:
 * - `name`: the name of the base
 * - `tables`: the order of tables in the base
 * - `collaborators`: all the collaborators in the base
 * - `schema`: the base schema (essentially everything except for record data)
 */
type WatchableBaseKey = ObjectValues<typeof WatchableBaseKeys>;

/** @internal */
type ChangedPathsForObject<T extends object> = {[K in keyof T]?: ChangedPathsForType<T[K]>} & {
    _isDirty?: true;
};
/** @internal */
export type ChangedPathsForType<T> = T extends {} ? ChangedPathsForObject<T> : {_isDirty?: true};

/**
 * Model class representing a base.
 *
 * If you want the base model to automatically recalculate whenever the base schema changes, try the
 * {@link useBase} hook. Alternatively, you can manually subscribe to changes with
 * {@link useWatchable} (recommended) or [Base#watch](/api/models/Base#watch).
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks';
 *
 * console.log('The name of your base is', base.name);
 * ```
 * @docsPath models/Base
 */
class Base extends AbstractModel<BaseData, WatchableBaseKey> {
    /** @internal */
    static _className = 'Base';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableBaseKeys, key);
    }
    /** @internal */
    _tableModelsById: {[key: string]: Table};
    /** @internal */
    _tableRecordStoresByTableId: ObjectMap<TableId, RecordStore> = {};
    /** @internal */
    __billingPlanGrouping: string;
    /** @internal */
    _collaboratorIdsByNameAndEmail: Map<string, string> | null = null;
    /**
     * @internal
     */
    constructor(sdk: Sdk) {
        super(sdk, sdk.__airtableInterface.sdkInitData.baseData.id);
        this._tableModelsById = {}; 
        this.__billingPlanGrouping =
            sdk.__airtableInterface.sdkInitData.baseData.billingPlanGrouping;
    }

    /**
     * Aliased to communicate stability for internal use by Sdk code.
     *
     * @internal
     */
    get __sdk(): Sdk {
        return this._sdk;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): BaseData | null {
        return this._baseData;
    }
    /**
     * The name of the base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log('The name of your base is', base.name);
     * ```
     */
    get name(): string {
        return this._data.name;
    }

    /**
     * The workspace id of the base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log('The workspace id of your base is', base.workspaceId);
     * ```
     */
    get workspaceId(): string {
        return this._data.workspaceId;
    }

    /**
     * The color of the base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * import {Box} from '@airtable/blocks/ui';
     * const exampleBox = <Box backgroundColor={base.color}> This box's background is the same color as the base background</Box>
     * ```
     */
    get color(): string {
        return this._data.color;
    }

    /**
     * The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(`You have ${base.tables.length} tables`);
     * ```
     */
    get tables(): Array<Table> {
        const tables: Array<Table> = [];
        this._data.tableOrder.forEach(tableId => {
            const table = this.getTableByIdIfExists(tableId);
            if (table) {
                tables.push(table);
            }
        });
        return tables;
    }
    /**
     * The users who have access to this base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(base.activeCollaborators[0].email);
     * ```
     */
    get activeCollaborators(): Array<CollaboratorData> {
        return this._data.activeCollaboratorIds.map(collaboratorId =>
            this.getCollaboratorById(collaboratorId),
        );
    }
    /**
     * The user matching the given ID, or `null` if that user does not exist or does not have access
     * to this base.
     *
     * @param collaboratorId The ID of the user.
     */
    getCollaboratorByIdIfExists(collaboratorId: UserId): CollaboratorData | null {
        const collaboratorsById = this._data.collaboratorsById;
        return has(collaboratorsById, collaboratorId) ? collaboratorsById[collaboratorId] : null;
    }
    /**
     * The user matching the given ID. Throws if that user does not exist
     * or does not have access to this base. Use {@link getCollaboratorByIdIfExists}
     * instead if you are unsure whether a collaborator with the given ID exists
     * and has access to this base.
     *
     * @param collaboratorId The ID of the user.
     */
    getCollaboratorById(collaboratorId: UserId): CollaboratorData {
        const collaborator = this.getCollaboratorByIdIfExists(collaboratorId);
        if (!collaborator) {
            throw spawnError(
                "No collaborator with ID %s has access to base '%s'",
                collaboratorId,
                this.name,
            );
        }
        return collaborator;
    }
    /**
     * The user matching the given ID, name, or email address. Returns null if that user does not
     * exist or does not have access to this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getCollaboratorByIdIfExists} method instead.
     *
     * @param collaboratorIdOrNameOrEmail The ID of the user.
     */
    getCollaboratorIfExists(idOrNameOrEmail: UserId | string): CollaboratorData | null {
        const collaboratorById = this.getCollaboratorByIdIfExists(idOrNameOrEmail);
        if (collaboratorById) {
            return collaboratorById;
        }

        if (!this._collaboratorIdsByNameAndEmail) {
            this._collaboratorIdsByNameAndEmail = new Map<string, string>();
            for (const [id, {email, name}] of entries(this._data.collaboratorsById)) {
                this._collaboratorIdsByNameAndEmail.set(email, id);
                if (name && !this._collaboratorIdsByNameAndEmail.has(name)) {
                    this._collaboratorIdsByNameAndEmail.set(name, id);
                }
            }
        }

        const idForNameOrEmail = this._collaboratorIdsByNameAndEmail.get(idOrNameOrEmail);
        if (idForNameOrEmail !== undefined) {
            return this.getCollaboratorById(idForNameOrEmail);
        }

        return null;
    }
    /**
     * The user matching the given ID, name, or email address. Throws if that user does not exist
     * or does not have access to this base. Use {@link getCollaboratorIfExists} instead if you are
     * unsure whether a collaborator with the given ID exists and has access to this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getCollaboratorById} method instead.
     *
     * @param collaboratorIdOrNameOrEmail The ID of the user.
     */
    getCollaborator(idOrNameOrEmail: UserId | string): CollaboratorData | null {
        const collaborator = this.getCollaboratorIfExists(idOrNameOrEmail);
        if (!collaborator) {
            throw spawnError(
                "No collaborator with ID, name, or email of '%s' is in base '%s'",
                idOrNameOrEmail,
                this.name,
            );
        }
        return collaborator;
    }
    /**
     * @internal
     */
    __getRecordStore(tableId: TableId): RecordStore {
        if (has(this._tableRecordStoresByTableId, tableId)) {
            return this._tableRecordStoresByTableId[tableId];
        }
        invariant(this._data.tablesById[tableId], 'table must exist');
        const newRecordStore = new RecordStore(this._sdk, tableId);
        this._tableRecordStoresByTableId[tableId] = newRecordStore;
        return newRecordStore;
    }
    /**
     * @internal
     */
    __getBaseData(): BaseData {
        return this._data;
    }
    /**
     * The table matching the given ID, or `null` if that table does not exist in this base.
     *
     * @param tableId The ID of the table.
     */
    getTableByIdIfExists(tableId: string): Table | null {
        if (!this._data.tablesById[tableId]) {
            return null;
        } else {
            if (!this._tableModelsById[tableId]) {
                this._tableModelsById[tableId] = new Table(
                    this,
                    this.__getRecordStore(tableId),
                    tableId,
                    this._sdk,
                );
            }
            return this._tableModelsById[tableId];
        }
    }
    /**
     * The table matching the given ID. Throws if that table does not exist in this base. Use
     * {@link getTableByIdIfExists} instead if you are unsure whether a table exists with the given
     * ID.
     *
     * @param tableId The ID of the table.
     */
    getTableById(tableId: string): Table {
        const table = this.getTableByIdIfExists(tableId);
        if (!table) {
            throw spawnError("No table with ID %s in base '%s'", tableId, this.name);
        }
        return table;
    }
    /**
     * The table matching the given name, or `null` if no table exists with that name in this base.
     *
     * @param tableName The name of the table you're looking for.
     */
    getTableByNameIfExists(tableName: string): Table | null {
        for (const [tableId, tableData] of entries(this._data.tablesById)) {
            if (tableData.name === tableName) {
                return this.getTableByIdIfExists(tableId);
            }
        }
        return null;
    }
    /**
     * The table matching the given name. Throws if no table exists with that name in this base. Use
     * {@link getTableByNameIfExists} instead if you are unsure whether a table exists with the
     * given name.
     *
     * @param tableName The name of the table you're looking for.
     */
    getTableByName(tableName: string): Table {
        const table = this.getTableByNameIfExists(tableName);
        if (!table) {
            throw spawnError("No table named '%s' in base '%s'", tableName, this.name);
        }
        return table;
    }
    /**
     * The table matching the given ID or name. Returns `null` if no matching table exists within
     * this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getTableByIdIfExists} or
     * {@link getTableByNameIfExists} methods instead.
     *
     * @param tableIdOrName The ID or name of the table you're looking for.
     */
    getTableIfExists(tableIdOrName: TableId | string): Table | null {
        return (
            this.getTableByIdIfExists(tableIdOrName) ?? this.getTableByNameIfExists(tableIdOrName)
        );
    }
    /**
     * The table matching the given ID or name. Throws if no matching table exists within this base.
     * Use {@link getTableIfExists} instead if you are unsure whether a table exists with the given
     * name/ID.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getTableById} or {@link getTableByName} methods
     * instead.
     *
     * @param tableIdOrName The ID or name of the table you're looking for.
     */
    getTable(tableIdOrName: TableId | string): Table {
        const table = this.getTableIfExists(tableIdOrName);
        if (!table) {
            throw spawnError(
                "No table with ID or name '%s' in base '%s'",
                tableIdOrName,
                this.name,
            );
        }
        return table;
    }

    /**
     * Checks whether the current user has permission to create a table.
     *
     * Accepts partial input, in the same format as {@link createTableAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table
     *
     * @example
     * ```js
     * const createTableCheckResult = base.checkPermissionsForCreateTable();
     *
     * if (!createTableCheckResult.hasPermission) {
     *     alert(createTableCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForCreateTable(
        name?: string,
        fields?: Array<{
            name?: string;
            type?: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.CREATE_SINGLE_TABLE,
            id: undefined, 
            name: name,
            fields: fields?.map(field => {
                return {
                    name: field.name,
                    config: field.type
                        ? {
                              type: field.type,
                              ...(field.options ? {options: field.options} : null),
                          }
                        : undefined,
                    description: field.description,
                };
            }),
        });
    }

    /**
     * An alias for `checkPermissionsForCreateTable(name, fields).hasPermission`.
     *
     * Checks whether the current user has permission to create a table.
     *
     * Accepts partial input, in the same format as {@link createTableAsync}.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table
     *
     * @example
     * ```js
     * const canCreateTable = table.hasPermissionToCreateTable();
     *
     * if (!canCreateTable) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToCreateTable(
        name?: string,
        fields?: Array<{
            name?: string;
            type?: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): boolean {
        return this.checkPermissionsForCreateTable(name, fields).hasPermission;
    }

    /**
     * Creates a new table.
     *
     * Throws an error if the user does not have permission to create a table, if an invalid
     * table name is provided, or if invalid fields are provided (invalid name, type, options or
     * description).
     *
     * Refer to {@link FieldType} for supported field types, the write format for field options, and
     * other specifics for certain field types.
     *
     * At least one field must be specified. The first field in the `fields` array will be used as
     * the table's [primary field](https://support.airtable.com/hc/en-us/articles/202624179-The-Name-Field)
     * and must be a supported primary field type. Fields must have case-insensitive unique names
     * within the table.
     *
     * A default grid view will be created with all fields visible.
     *
     * This action is asynchronous. Unlike new records, new tables are **not** created
     * optimistically locally. You must `await` the returned promise before using the new
     * table in your extension.
     *
     * @param name name for the table. must be case-insensitive unique
     * @param fields array of fields to create in the table: see below for an example. `name` and
     * `type` must be specified for all fields, while `options` is only required for fields that
     * have field options. `description` is optional and will be `''` if not specified or if
     * specified as `null`.
     *
     * @example
     * ```js
     * async function createNewTable() {
     *     const name = 'My new table';
     *     const fields = [
     *         // Name will be the primary field of the table.
     *         {name: 'Name', type: FieldType.SINGLE_LINE_TEXT, description: 'This is the primary field'},
     *         {name: 'Notes', type: FieldType.RICH_TEXT},
     *         {name: 'Attachments', type: FieldType.MULTIPLE_ATTACHMENTS},
     *         {name: 'Number', type: FieldType.NUMBER, options: {
     *             precision: 8,
     *         }},
     *         {name: 'Select', type: FieldType.SINGLE_SELECT, options: {
     *             choices: [
     *                 {name: 'A'},
     *                 {name: 'B'},
     *             ],
     *         }},
     *     ];
     *
     *     if (base.hasPermissionToCreateTable(name, fields)) {
     *         await base.createTableAsync(name, fields);
     *     }
     * }
     * ```
     */
    async createTableAsync(
        name: string,
        fields: Array<{
            name: string;
            type: FieldType;
            options?: {[key: string]: unknown} | null;
            description?: string | null;
        }>,
    ): Promise<Table> {
        const tableId = this._sdk.__airtableInterface.idGenerator.generateTableId();

        await this._sdk.__mutations.applyMutationAsync({
            id: tableId,
            type: MutationTypes.CREATE_SINGLE_TABLE,
            name,
            fields: fields.map(field => {
                return {
                    name: field.name,
                    config: {
                        type: field.type,
                        ...(field.options ? {options: field.options} : null),
                    },
                    description: field.description ?? null,
                };
            }),
        });

        return this.getTableById(tableId);
    }

    /**
     * Returns the maximum number of records allowed in each table of this base.
     */
    getMaxRecordsPerTable(): number {
        return this._data.maxRowsPerTable ?? 100000;
    }

    /**
     * @internal
     */
    __triggerOnChangeForChangedPaths(changedPaths: ChangedPathsForType<BaseData>) {
        let didSchemaChange = false;
        if (changedPaths.name) {
            this._onChange(WatchableBaseKeys.name);
            didSchemaChange = true;
        }
        if (changedPaths.color) {
            this._onChange(WatchableBaseKeys.color);
            didSchemaChange = true;
        }
        if (changedPaths.tableOrder) {
            this._onChange(WatchableBaseKeys.tables);
            didSchemaChange = true;

            for (const [tableId, tableModel] of entries(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }
            for (const [tableId, recordStore] of entries(this._tableRecordStoresByTableId)) {
                if (recordStore && recordStore.isDeleted) {
                    recordStore.__onDataDeletion();
                    delete this._tableRecordStoresByTableId[tableId];
                }
            }
        }
        const {tablesById} = changedPaths;
        if (tablesById) {
            for (const [tableId, dirtyTablePaths] of entries(tablesById)) {
                const table = this.getTableByIdIfExists(tableId);
                if (table && dirtyTablePaths) {
                    const didTableSchemaChange = table.__triggerOnChangeForDirtyPaths(
                        dirtyTablePaths,
                    );
                    if (didTableSchemaChange) {
                        didSchemaChange = true;
                    }
                }
            }
        }
        if (changedPaths.collaboratorsById || changedPaths.activeCollaboratorIds) {
            this._onChange(WatchableBaseKeys.collaborators);
        }
        if (changedPaths.appInterface) {
            didSchemaChange = true;
        }
        if (didSchemaChange) {
            this._onChange(WatchableBaseKeys.schema);
        }
    }
    /**
     * @internal
     */
    __applyChangesWithoutTriggeringEvents(
        changes: ReadonlyArray<ModelChange>,
    ): ChangedPathsForType<BaseData> {
        const changedPaths = {};
        for (const change of changes) {
            this._applyChange(change.path, change.value, changedPaths);
        }
        return changedPaths;
    }
    /**
     * @internal
     */
    _applyChange(
        path: Array<string>,
        value: unknown,
        changedPathsByRef: ChangedPathsForType<BaseData>,
    ) {
        let dataSubtree = this._data as any;
        let dirtySubtree = changedPathsByRef as any;
        for (let i = 0; i < path.length - 1; i++) {
            const part = path[i];

            if (!dataSubtree[part]) {
                dataSubtree[part] = {};
            }
            dataSubtree = dataSubtree[part];

            if (!dirtySubtree[part]) {
                dirtySubtree[part] = {};
            }
            invariant(dirtySubtree[part], 'dirtySubtree');
            dirtySubtree = dirtySubtree[part];
        }
        const lastPathPart = path[path.length - 1];
        const didChange = !isDeepEqual(dataSubtree[lastPathPart], value);
        if (value === undefined) {
            delete dataSubtree[lastPathPart];
        } else {
            dataSubtree[lastPathPart] = value;
        }

        if (didChange) {
            if (!dirtySubtree[lastPathPart]) {
                dirtySubtree[lastPathPart] = {};
            }
            invariant(dirtySubtree[lastPathPart], 'dirtySubtree');
            dirtySubtree[lastPathPart]._isDirty = true;
        }
    }
}

export default Base;
